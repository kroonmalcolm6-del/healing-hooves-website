# Healing Hooves

A standalone course site: public marketing/curriculum pages, plus a paywalled
member dashboard (recorded clips, a grazing chart/planning tool, and
downloadable resources) unlocked by a one-time Stripe payment.

Same stack as the Grazing Manager app: React + TypeScript + Vite + Tailwind +
Supabase, deployed to Vercel.

## 1. Colors

Right now this uses a placeholder Karoo-vernacular palette (limewash, red-oxide
roof paint, bottle-green shutters) since I didn't have the exact Grazing
Manager hex codes. To match it exactly, open `tailwind.config.ts` and swap the
six values under `colors` — everything in the app references those tokens
(`bone`, `soil`, `redoxide`, `shutter`, `veldgold`, `healed`), so changing them
there re-themes the whole site.

## 2. Supabase setup

1. Create a new Supabase project (or use an existing one — tables are
   namespaced clearly, but a dedicated project is cleaner).
2. Open the SQL editor and run `supabase/schema.sql`. This creates:
   - `purchases` — tracks who's paid
   - `course_videos`, `course_resources` — your course content (you'll fill
     these in)
   - `customer_paddocks`, `customer_moves`, `customer_rain_log` — each
     customer's own grazing chart data
3. Create two **private** storage buckets: `course-clips` and
   `course-resources`. Add the storage RLS policies shown in the comment at
   the bottom of `schema.sql` (paste them into SQL editor too).
4. Copy `.env.example` to `.env` and fill in your Supabase URL + anon key
   (Settings → API in the Supabase dashboard).

## 3. Stripe setup

1. Create a Stripe account (or use your existing one) and grab your secret key.
2. Install the Supabase CLI, then from this folder:
   ```
   supabase login
   supabase link --project-ref your-project-ref
   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
   supabase secrets set SITE_URL=https://your-domain.co.za
   supabase functions deploy create-checkout-session
   supabase functions deploy stripe-webhook --no-verify-jwt
   ```
3. In the Stripe Dashboard → Developers → Webhooks, add an endpoint pointing
   at the deployed `stripe-webhook` function URL, listening for
   `checkout.session.completed`. Stripe will show you a signing secret —
   set it:
   ```
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Price is set in two places — keep them in sync if you change it:
   `src/pages/Home.tsx` (the displayed "R4,500") and
   `supabase/functions/create-checkout-session/index.ts` (`PRICE_ZAR_CENTS`,
   the amount actually charged).

## 4. Run it locally

```
npm install
npm run dev
```

## 5. Deploy to Vercel

Push this folder to a GitHub repo, import it into Vercel, and add the two
environment variables from your `.env` (`VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`) in the Vercel project settings. Vercel auto-detects
Vite — no extra config needed.

## 6. Adding course content

There's no admin upload screen yet — for now, add content directly:

1. **Clips**: upload the video file to the `course-clips` bucket (Supabase
   dashboard → Storage), then insert a row into `course_videos` with the
   matching `storage_path`.
2. **Resources**: same pattern, using the `course-resources` bucket and the
   `course_resources` table.

Happy to build a proper admin upload screen for this next, if it'd save you
trips into the Supabase dashboard.

## What's a starting point vs. what's real

- **Auth, paywall gating, Stripe checkout + webhook, storage-backed
  clips/resources**: fully wired, should work as-is once you plug in your
  keys.
- **The grazing chart tool** (paddocks, rotation calendar, rain log): real,
  working, persists to Supabase per logged-in customer. It's intentionally
  simpler than the full Grazing Manager (no season planner, herd/stock flow,
  or SDH/100mm tracker yet) — built as a generic starting point for *any*
  customer's farm rather than hardcoded to Excelsior. Worth a follow-up pass
  if you want it closer to full parity.
