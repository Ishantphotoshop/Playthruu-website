-- Adds a `source` column so waitlist signups can be attributed to a
-- channel (utm_source, a ?ref= value, or the referring hostname) --
-- otherwise there's no way to tell which marketing channel (Instagram,
-- Reddit, Product Hunt, etc.) is actually converting.
--
-- Run this once in Supabase dashboard -> SQL Editor -> New query -> Run.

alter table public.waitlist add column source text;
