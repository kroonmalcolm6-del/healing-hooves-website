// supabase/functions/create-checkout-session/index.ts
//
// Deploy with: supabase functions deploy create-checkout-session
// Required secrets (supabase secrets set ...):
//   STRIPE_SECRET_KEY
//   SUPABASE_URL              (auto-provided by Supabase)
//   SUPABASE_SERVICE_ROLE_KEY (auto-provided by Supabase)
//   SITE_URL                  e.g. https://healinghooves.co.za

import Stripe from "npm:stripe@16";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const SITE_URL = Deno.env.get("SITE_URL") ?? "http://localhost:5173";
const PRICE_ZAR_CENTS = 450000; // R4,500 — change here if you change the price on Home.tsx too

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(jwt);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const user = userData.user;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "zar",
            unit_amount: PRICE_ZAR_CENTS,
            product_data: {
              name: "Healing Hooves — Lifetime Access",
              description: "Course clips, the grazing chart tool, and downloadable resources.",
            },
          },
          quantity: 1,
        },
      ],
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: { user_id: user.id },
      success_url: `${SITE_URL}/checkout/success`,
      cancel_url: `${SITE_URL}/?checkout=cancelled`,
    });

    // Record a 'pending' row now so we have a stripe_session_id to reconcile
    // against even if the webhook is delayed.
    await supabaseAdmin
      .from("purchases")
      .insert({ user_id: user.id, stripe_session_id: session.id, status: "pending" });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Checkout failed" }), { status: 500 });
  }
});
