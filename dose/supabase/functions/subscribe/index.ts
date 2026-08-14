/* ═══════════════ DOSE Daily — subscribe ═══════════════
   Records (or updates, or removes) a device's push subscription.

   The client calls this with the public anon key. All writes happen here
   with the service-role key, so the table itself stays locked down.

   Deploy:  supabase functions deploy subscribe --no-verify-jwt          */

import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid JSON" }, 400);
  }

  const { endpoint, keys, timezone, slots, enabled } = payload ?? {};

  if (typeof endpoint !== "string" || !endpoint.startsWith("https://")) {
    return json({ error: "endpoint required" }, 400);
  }

  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  /* unsubscribing — drop the row entirely rather than keeping a
     disabled record of someone who asked us to stop */
  if (enabled === false) {
    const { error } = await db.from("push_subscriptions").delete().eq("endpoint", endpoint);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, removed: true });
  }

  if (!keys?.p256dh || !keys?.auth) return json({ error: "keys required" }, 400);

  const cleanSlots = Array.isArray(slots)
    ? [...new Set(slots.filter((s: unknown) => typeof s === "string" && HHMM.test(s)))].sort()
    : ["08:00", "13:00", "20:00"];

  if (!cleanSlots.length) return json({ error: "at least one valid time required" }, 400);

  const { error } = await db.from("push_subscriptions").upsert({
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
    timezone: typeof timezone === "string" && timezone ? timezone : "UTC",
    slots: cleanSlots,
    enabled: true,
  }, { onConflict: "endpoint" });

  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, slots: cleanSlots });
});
