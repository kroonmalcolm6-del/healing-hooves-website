create table if not exists pre_approved_emails (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  note text,
  created_at timestamptz default now()
);
alter table pre_approved_emails enable row level security;
create policy "users can check own pre-approval"
  on pre_approved_emails for select
  using (email = auth.email());
