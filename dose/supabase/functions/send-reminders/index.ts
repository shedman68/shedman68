/* ═══════════════ DOSE Daily — send-reminders ═══════════════
   Runs on a schedule (every 15 minutes). Works out which devices are due
   a nudge in their own local time, sends it, and records that it did so
   that nobody gets the same slot twice in a day.

   Deploy:  supabase functions deploy send-reminders
   Secrets: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT             */

import { createClient } from "jsr:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

/* The nudge is a reminder, never a reprimand — see PHILOSOPHY.md §7.
   No counts, no streak-at-risk, no guilt. */
const LINES = [
  "A good moment for one of your four.",
  "Two minutes is enough to count.",
  "What's one thing you could do right now?",
  "Your DOSE is waiting whenever you are.",
  "Small and daily beats big and rare.",
];

const WINDOW_MIN = 15; // matches the cron interval

/* local wall-clock time and date for a given IANA timezone */
function localNow(tz: string) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz, hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
  const p: Record<string, string> = {};
  for (const { type, value } of fmt.formatToParts(new Date())) p[type] = value;
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    minutes: Number(p.hour) * 60 + Number(p.minute),
  };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

Deno.serve(async () => {
  const publicKey = Deno.env.get("VAPID_PUBLIC_KEY");
  const privateKey = Deno.env.get("VAPID_PRIVATE_KEY");
  if (!publicKey || !privateKey) {
    return new Response(JSON.stringify({ error: "VAPID keys not set" }), { status: 500 });
  }

  webpush.setVapidDetails(
    Deno.env.get("VAPID_SUBJECT") ?? "mailto:hello@example.com",
    publicKey,
    privateKey,
  );

  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: subs, error } = await db
    .from("push_subscriptions")
    .select("*")
    .eq("enabled", true);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  let sent = 0, pruned = 0;

  for (const sub of subs ?? []) {
    let now;
    try {
      now = localNow(sub.timezone || "UTC");
    } catch {
      now = localNow("UTC"); // unknown timezone string — don't lose the device over it
    }

    const lastSent = (sub.last_sent ?? {}) as Record<string, string>;

    /* the slot this run is responsible for, if any */
    const due = (sub.slots as string[]).find((slot) => {
      const delta = now.minutes - toMinutes(slot);
      return delta >= 0 && delta < WINDOW_MIN && lastSent[slot] !== now.date;
    });
    if (!due) continue;

    const body = LINES[Math.floor(Math.random() * LINES.length)];

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title: "DOSE", body, tag: `dose-${due}` }),
      );
      sent++;
      await db.from("push_subscriptions")
        .update({ last_sent: { ...lastSent, [due]: now.date } })
        .eq("id", sub.id);
    } catch (err) {
      /* 404/410 mean the browser threw the subscription away — the app was
         deleted or permission revoked. Stop trying. */
      const status = (err as { statusCode?: number })?.statusCode;
      if (status === 404 || status === 410) {
        await db.from("push_subscriptions").delete().eq("id", sub.id);
        pruned++;
      } else {
        console.error("push failed", sub.id, status, String(err));
      }
    }
  }

  return new Response(JSON.stringify({ checked: subs?.length ?? 0, sent, pruned }), {
    headers: { "Content-Type": "application/json" },
  });
});
