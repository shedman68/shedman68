/* ═══════════════ DOSE Daily — push reminders (client) ═══════════════
   Everything here degrades quietly: with no config, or on a device that
   can't do push, the app behaves exactly as it did before.            */

"use strict";

const PUSH = {
  /* has the backend been wired up yet? */
  configured() {
    return Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && CONFIG.VAPID_PUBLIC_KEY);
  },

  /* iOS only allows notifications for apps added to the Home Screen */
  installed() {
    return window.navigator.standalone === true ||
           window.matchMedia("(display-mode: standalone)").matches;
  },

  supported() {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  },

  /* why reminders aren't available, or null if they are */
  blocker() {
    if (!this.configured()) return "Reminders need the server set up first — see SETUP.md.";
    if (!this.supported()) return "This browser doesn't support notifications.";
    if (!this.installed()) return "Add DOSE to your Home Screen first — iOS only allows notifications for installed apps.";
    if (Notification.permission === "denied") return "Notifications are blocked for DOSE in your iPhone Settings.";
    return null;
  },

  async subscription() {
    if (!this.supported()) return null;
    const reg = await navigator.serviceWorker.ready;
    return reg.pushManager.getSubscription();
  },

  async enable(slots) {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") throw new Error("Permission not granted");

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
      });
    }

    await this.send({
      ...sub.toJSON(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      slots,
      enabled: true,
    });
    return true;
  },

  async update(slots) {
    const sub = await this.subscription();
    if (!sub) return false;
    await this.send({
      ...sub.toJSON(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      slots,
      enabled: true,
    });
    return true;
  },

  async disable() {
    const sub = await this.subscription();
    if (!sub) return;
    await this.send({ endpoint: sub.endpoint, enabled: false }).catch(() => {});
    await sub.unsubscribe().catch(() => {});
  },

  async send(payload) {
    const res = await fetch(`${CONFIG.SUPABASE_URL}/functions/v1/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        "apikey": CONFIG.SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`subscribe failed (${res.status})`);
    return res.json();
  },
};

/* VAPID keys arrive base64url-encoded; the Push API wants bytes */
function urlBase64ToUint8Array(base64) {
  const padded = (base64 + "=".repeat((4 - base64.length % 4) % 4))
    .replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}
