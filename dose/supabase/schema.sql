-- ═══════════════════ DOSE Daily — push reminders ═══════════════════
-- Run this once in the Supabase SQL editor.
--
-- Design note: this table holds no DOSE history. It knows a device push
-- token, a timezone, and the times that device asked to be nudged.
-- Nothing about what anyone actually did.

create table if not exists public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  endpoint    text not null unique,          -- the push service URL for this device
  p256dh      text not null,                 -- client public key
  auth        text not null,                 -- client auth secret
  timezone    text not null default 'UTC',   -- IANA name, e.g. "Europe/Zurich"
  slots       jsonb not null default '["08:00","13:00","20:00"]'::jsonb,
  enabled     boolean not null default true,
  last_sent   jsonb not null default '{}'::jsonb,  -- { "08:00": "2026-08-13" }
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists push_subscriptions_enabled_idx
  on public.push_subscriptions (enabled) where enabled;

-- Row level security ON with **no policies**: neither the anon nor the
-- authenticated role can read or write this table. Every access goes
-- through an edge function using the service-role key, so a leaked anon
-- key exposes nothing.
alter table public.push_subscriptions enable row level security;

-- keep updated_at honest
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists push_subscriptions_touch on public.push_subscriptions;
create trigger push_subscriptions_touch
  before update on public.push_subscriptions
  for each row execute function public.touch_updated_at();


-- ─── Scheduling ───
-- Runs the sender every 15 minutes; it works out which devices are due
-- based on their own local time. Replace both placeholders first.
--
--   create extension if not exists pg_cron;
--   create extension if not exists pg_net;
--
--   select cron.schedule('dose-reminders', '*/15 * * * *', $job$
--     select net.http_post(
--       url     := 'https://YOUR-PROJECT.supabase.co/functions/v1/send-reminders',
--       headers := jsonb_build_object(
--         'Content-Type',  'application/json',
--         'Authorization', 'Bearer YOUR-SERVICE-ROLE-KEY')
--     );
--   $job$);
--
-- To stop it:  select cron.unschedule('dose-reminders');
