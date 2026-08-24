-- Adds a waitlist table for the pre-launch marketing site
-- (playthruu-site), backed by this same Supabase project as the app
-- itself. Anyone can insert their email (anon, unauthenticated — this
-- runs before sign-up exists), but nobody can read the list back
-- through the anon/authenticated key, only via the Supabase dashboard
-- or a service_role key. That keeps the anon key safe to ship in the
-- site's client bundle the same way it already is in the app.
--
-- Run this once in Supabase dashboard -> SQL Editor -> New query -> Run.

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

alter table public.waitlist enable row level security;

create policy "waitlist_public_insert" on public.waitlist for insert with check (true);
