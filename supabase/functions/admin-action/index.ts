import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const ADMIN_EMAILS = (Deno.env.get("ADMIN_EMAILS") ?? "")
  .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

Deno.serve(async (req) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, content-type",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const jwt = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const { data: { user } } = await supabaseAdmin.auth.getUser(jwt);
  if (!user || !ADMIN_EMAILS.includes((user.email ?? "").toLowerCase())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const { action, email, note, userId } = await req.json();

  if (action === "list") {
    const [usersRes, purchasesRes, preApprovedRes] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
      supabaseAdmin.from("purchases").select("*").eq("status", "paid"),
      supabaseAdmin.from("pre_approved_emails").select("*").order("created_at", { ascending: false }),
    ]);
    const users = (usersRes.data?.users ?? []).map((u) => ({
      id: u.id, email: u.email ?? "", created_at: u.created_at,
      has_purchase: (purchasesRes.data ?? []).some((p) => p.user_id === u.id),
      is_pre_approved: (preApprovedRes.data ?? []).some((p) => p.email === u.email),
      purchase: (purchasesRes.data ?? []).find((p) => p.user_id === u.id) ?? null,
      pre_approval: (preApprovedRes.data ?? []).find((p) => p.email === u.email) ?? null,
    }));
    const signedUpEmails = new Set((usersRes.data?.users ?? []).map((u) => u.email));
    const pendingPreApproved = (preApprovedRes.data ?? []).filter((p) => !signedUpEmails.has(p.email));
    return new Response(JSON.stringify({ users, pendingPreApproved }), { headers: { ...cors, "Content-Type": "application/json" } });
  }

  if (action === "grant") {
    const norm = email.trim().toLowerCase();
    await supabaseAdmin.from("pre_approved_emails").upsert({ email: norm, note: note || "Manual grant" }, { onConflict: "email" });
    const { data: { users: all } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const existing = all.find((u) => (u.email ?? "").toLowerCase() === norm);
    if (existing) {
      await supabaseAdmin.from("purchases").upsert({ user_id: existing.id, stripe_session_id: `manual-${Date.now()}`, status: "paid" }, { onConflict: "stripe_session_id" });
    }
    return new Response(JSON.stringify({ ok: true, signedUp: Boolean(existing) }), { headers: { ...cors, "Content-Type": "application/json" } });
  }

  if (action === "revoke") {
    const ops = [];
    if (userId) ops.push(supabaseAdmin.from("purchases").delete().eq("user_id", userId));
    if (email) ops.push(supabaseAdmin.from("pre_approved_emails").delete().eq("email", email.trim().toLowerCase()));
    await Promise.all(ops);
    return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: cors });
});
