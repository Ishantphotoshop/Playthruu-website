-- PlayThruu News: articles written and maintained by the News Brain (a
-- scheduled Claude routine) and overseen by admins at /admin/news.
--
-- Who can do what:
--   * Anyone (anon key) can READ articles whose status is published or
--     archived. Drafts in the review queue, rejected stories and the audit
--     log are never public.
--   * The News Brain never touches the database directly. It calls the
--     site's /api/news/brain endpoints with a bearer token; those run with
--     the service_role key, which bypasses RLS, and the endpoint code
--     decides whether a story may auto-publish.
--   * Admins are users listed in news_admins. They get full read/write on
--     articles through their normal logged-in session.
--
-- Admins live in their own table rather than an is_admin column on
-- profiles on purpose: the app lets users update their own profile row,
-- so a flag there could be self-granted. Nobody can write news_admins
-- except through the dashboard / service_role.
--
-- Run this once in Supabase dashboard -> SQL Editor -> New query -> Run.
-- Then make yourself an admin (replace the email):
--   insert into public.news_admins (user_id)
--   select id from auth.users where email = 'you@example.com';

create table public.news_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.news_admins enable row level security;
-- No policies: invisible and unwritable through anon/authenticated keys.

create or replace function public.is_news_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.news_admins where user_id = auth.uid());
$$;

create table public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

  -- editorial content
  title text not null,
  summary text not null,
  body jsonb not null default '[]'::jsonb, -- Block[] (see lib/news.ts)
  why_it_matters text not null default '',
  category text not null,
  importance text not null default 'standard'
    check (importance in ('breaking', 'important', 'standard', 'minor')),

  -- visibility: what the public sees
  --   review    -> in the admin queue, not public
  --   published -> live on /news
  --   rejected  -> killed by an admin; the Brain may not revive it
  --   archived  -> off the feed, but the URL still works
  status text not null default 'review'
    check (status in ('review', 'published', 'rejected', 'archived')),
  -- editorial lifecycle, as described in the News Brain brief
  lifecycle text not null default 'discovered'
    check (lifecycle in ('discovered', 'verified', 'published', 'updated', 'resolved', 'archived')),
  verification_status text not null
    check (verification_status in ('confirmed', 'reported', 'rumor', 'leak')),
  confidence_level text not null check (confidence_level in ('High', 'Medium', 'Low')),
  confidence_reason text not null default '',

  -- sourcing
  primary_source text,
  first_reported_by text,
  sources jsonb not null default '[]'::jsonb, -- Source[] (see lib/news.ts)
  -- conflicts, open questions, why it was queued — never shown publicly
  editor_notes text not null default '',

  -- entities & tags
  game text,
  publisher text,
  developer text,
  platforms text[] not null default '{}',
  genres text[] not null default '{}',
  tags text[] not null default '{}',

  -- media: only official/licensed assets; otherwise the site generates a
  -- PlayThruu card image, so image_url stays null
  image_url text,
  image_credit text,

  -- SEO & social
  seo_title text not null,
  seo_description text not null,
  keywords text[] not null default '{}',
  social_caption text not null default '',
  card_description text not null check (char_length(card_description) <= 100),

  -- admin overrides
  flagged_incorrect boolean not null default false,
  needs_update boolean not null default false, -- "force update": Brain revisits next run
  brain_locked boolean not null default false, -- Brain may not edit this article

  published_at timestamptz,
  updated_at timestamptz not null default now(),
  last_checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index news_articles_feed_idx on public.news_articles (status, updated_at desc);

alter table public.news_articles enable row level security;

create policy "news_public_read" on public.news_articles
  for select using (status in ('published', 'archived'));

create policy "news_admin_all" on public.news_articles
  for all to authenticated
  using (public.is_news_admin())
  with check (public.is_news_admin());

-- Audit trail: every Brain and admin action on an article.
create table public.news_events (
  id bigint generated always as identity primary key,
  article_id uuid references public.news_articles (id) on delete set null,
  article_slug text not null,
  actor text not null, -- 'brain' or an admin's email
  action text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
alter table public.news_events enable row level security;

create policy "news_events_admin_read" on public.news_events
  for select to authenticated using (public.is_news_admin());
create policy "news_events_admin_insert" on public.news_events
  for insert to authenticated with check (public.is_news_admin());
