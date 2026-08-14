# Setting up reminders

The app works fully without this. Everything below only turns on **push
notifications** — a nudge at times you choose, even when the app is closed.

**What the server stores:** a notification token for your device, your
timezone, and the times you asked to be reminded. That's it. Your DOSE
history never leaves your phone.

You need to do this once. Budget about twenty minutes.

---

## 1. Create the Supabase project

1. Sign up at [supabase.com](https://supabase.com) — the free tier is plenty
2. **New project**, pick any name and a region near you
3. Once it's built, go to **Project Settings → API** and copy:
   - the **Project URL**
   - the **anon / public** key
   - the **service_role** key (secret — never put this in the app)

## 2. Create the table

**SQL Editor → New query**, paste the whole of `supabase/schema.sql`, run it.

## 3. Generate the VAPID keys

These are the keys that let a push service trust that a notification really
came from you. On your computer:

```bash
npx web-push generate-vapid-keys
```

You'll get a **public** key and a **private** key. Keep the private one secret.

## 4. Deploy the two functions

Install the CLI (`npm install -g supabase`), then from inside the `dose`
folder:

```bash
supabase login
supabase link --project-ref YOUR-PROJECT-REF     # the bit before .supabase.co

supabase secrets set \
  VAPID_PUBLIC_KEY="your-public-key" \
  VAPID_PRIVATE_KEY="your-private-key" \
  VAPID_SUBJECT="mailto:your@email.com"

supabase functions deploy subscribe --no-verify-jwt
supabase functions deploy send-reminders
```

`--no-verify-jwt` on `subscribe` is deliberate: there are no accounts, so
the app calls it with the public anon key. It only ever writes a push
token, and the table itself stays unreadable.

## 5. Schedule the sender

**SQL Editor**, with both placeholders replaced:

```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule('dose-reminders', '*/15 * * * *', $job$
  select net.http_post(
    url     := 'https://YOUR-PROJECT.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer YOUR-SERVICE-ROLE-KEY')
  );
$job$);
```

It runs every 15 minutes and works out who's due in their own local time,
so reminder times land correctly wherever anyone is.

## 6. Point the app at it

Edit `config.js`:

```js
const CONFIG = {
  SUPABASE_URL: "https://xxxxxxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGci...",
  VAPID_PUBLIC_KEY: "BEl62iUYgUiv...",
};
```

All three are meant to be public — they ship to every browser by design.
Commit and push; GitHub Pages will pick it up in a minute.

## 7. Turn them on

On your iPhone, in the **home-screen app** (not Safari):

**Settings → Daily reminders → Turn on reminders**, allow the permission
prompt, then set your three times.

---

## If it doesn't work

**"Reminders need the server set up first"** — `config.js` still has blanks,
or the old version is cached. Close the app fully and reopen twice.

**"Add DOSE to your Home Screen first"** — you're in Safari. iOS only
permits notifications for installed web apps.

**Permission prompt never appears** — needs iOS 16.4 or later, and the app
must have been *added to the Home Screen*, not bookmarked.

**Nothing arrives at the right time** — check the function logs in
**Edge Functions → send-reminders → Logs**. Each run reports how many
subscriptions it checked and sent. Also confirm the cron job exists:
`select * from cron.job;`

**To stop the schedule:** `select cron.unschedule('dose-reminders');`
