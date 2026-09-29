-- Lets the PlayThruu app's existing admins manage News too, so the News
-- review queue can live in the app's admin build (app.playthruu.com/admin)
-- instead of needing a second admin list.
--
-- profiles.is_admin is already protected from self-promotion by the
-- guard_profile_privileges trigger (playthruu-app-deploy migration
-- 2026-09-02_admin_toolkit.sql), so it is safe to trust here. The
-- news_admins table keeps working too: either one grants access.
--
-- Run once in Supabase dashboard -> SQL Editor -> New query -> Run.

create or replace function public.is_news_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.news_admins where user_id = auth.uid())
      or exists (select 1 from public.profiles where id = auth.uid() and is_admin);
$$;
