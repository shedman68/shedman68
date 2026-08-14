/* ═══════════════ DOSE Daily — configuration ═══════════════
   Fill these in once your Supabase project exists (see SETUP.md).
   Until then the app works exactly as before, minus reminders.

   All three values are safe to publish — the anon key and VAPID public
   key are designed to be handed to browsers. The service-role key and
   the VAPID *private* key must never appear in this file.            */

const CONFIG = {
  SUPABASE_URL: "",       // https://xxxxxxxx.supabase.co
  SUPABASE_ANON_KEY: "",  // the "anon / public" key
  VAPID_PUBLIC_KEY: "",   // from: npx web-push generate-vapid-keys
};
