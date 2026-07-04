// supabase/functions/stripe-webhook/index.ts
//
// Deploy with: supabase functions deploy stripe-webhook --no-verify-jwt
// (--no-verify-jwt is required: Stripe calls this directly, with no Supabase JWT)
//
// After deploying, copy the function URL into Stripe Dashboard → Developers →
// Webhooks → Add endpoint, listening for: checkout.session.completed
// Then copy the resulting signing secret into:
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

import Stripe from "npm:stripe@16";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id ?? session.client_reference_id;

    if (userId) {
      const { error } = await supabaseAdmin
        .from("purchases")
        .update({ status: "paid" })
        .eq("stripe_session_id", session.id);

      // Fallback: if the 'pending' row from create-checkout-session is missing
      // for any reason, insert a fresh paid row rather than silently dropping it.
      if (error) {
        console.error("Failed to update purchase:", error.message);
      }
      await supabaseAdmin
        .from("purchases")
        .upsert(
          { user_id: userId, stripe_session_id: session.id, status: "paid" },
          { onConflict: "stripe_session_id" }
        );
    } else {
      console.error("checkout.session.completed with no user_id in metadata");
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
