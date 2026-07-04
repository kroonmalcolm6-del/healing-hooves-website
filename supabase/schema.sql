-- ============================================================
-- Healing Hooves — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- ============================================================

-- ---------- purchases ----------
-- One row per attempted/completed Stripe checkout. The webhook is the
-- only thing allowed to write 'paid' — the client can only read its own row.
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  stripe_session_id text unique,
  status text not null default 'pending', -- 'pending' | 'paid'
  created_at timestamptz default now()
);

alter table purchases enable row level security;

create policy "users can read their own purchases"
  on purchases for select
  using (auth.uid() = user_id);

-- Inserts/updates happen from the Edge Functions using the service role key,
-- which bypasses RLS, so no insert/update policy is needed for normal users.

-- ---------- course_videos ----------
create table if not exists course_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  module text,
  sort_order int not null default 0,
  storage_path text not null, -- path inside the 'course-clips' storage bucket
  created_at timestamptz default now()
);

alter table course_videos enable row level security;

create policy "paid users can read course videos"
  on course_videos for select
  using (
    exists (
      select 1 from purchases
      where purchases.user_id = auth.uid() and purchases.status = 'paid'
    )
  );

-- ---------- course_resources ----------
create table if not exists course_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  storage_path text not null, -- path inside the 'course-resources' storage bucket
  created_at timestamptz default now()
);

alter table course_resources enable row level security;

create policy "paid users can read course resources"
  on course_resources for select
  using (
    exists (
      select 1 from purchases
      where purchases.user_id = auth.uid() and purchases.status = 'paid'
    )
  );

-- ---------- customer_paddocks ----------
create table if not exists customer_paddocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  name text not null,
  size_ha numeric,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

alter table customer_paddocks enable row level security;

create policy "users manage their own paddocks"
  on customer_paddocks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- customer_moves ----------
create table if not exists customer_moves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  paddock_id uuid references customer_paddocks(id) on delete cascade,
  move_date date not null,
  planned_rest_days int,
  notes text,
  created_at timestamptz default now()
);

alter table customer_moves enable row level security;

create policy "users manage their own moves"
  on customer_moves for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- customer_rain_log ----------
create table if not exists customer_rain_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  log_date date not null,
  mm numeric not null,
  created_at timestamptz default now()
);

alter table customer_rain_log enable row level security;

create policy "users manage their own rain log"
  on customer_rain_log for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Storage buckets — create these in the Supabase dashboard
-- (Storage → New bucket), both set to PRIVATE:
--   - course-clips
--   - course-resources
--
-- Then add storage policies so only paid users can read objects, e.g.:
--
-- create policy "paid users can read clips"
--   on storage.objects for select
--   using (
--     bucket_id = 'course-clips'
--     and exists (
--       select 1 from purchases
--       where purchases.user_id = auth.uid() and purchases.status = 'paid'
--     )
--   );
--
-- Repeat for 'course-resources'. Uploads should be done by you (Malcolm)
-- via the Supabase dashboard or CLI using the service role key — there's
-- no admin upload UI in the app yet (see README "Adding content").
-- ============================================================
