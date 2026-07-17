// HikkInn push notifications — web-push scaffold.
// Tourist + operator + driver all receive push (booking conf, driver ETA,
// order ready, payout cleared, etc.). Real delivery uses Web Push Protocol
// (VAPID) via a Workers endpoint; this module handles client subscription.

export interface PushSub {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export async function getPushManager(): Promise<PushManager | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  return (await navigator.serviceWorker.ready).pushManager;
}

export async function subscribePush(): Promise<PushSub | null> {
  const pm = await getPushManager();
  if (!pm) return null;
  let sub = await pm.getSubscription();
  if (!sub) {
    // applicationServerKey must be the VAPID public key (base64url -> Uint8Array)
    const vapidRes = await fetch('/api/vapid-public');
    const vapidJson: any = await vapidRes.json();
    const vapid: string = vapidJson.key;
    sub = await pm.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapid) as BufferSource });
  }
  return { endpoint: sub.endpoint, keys: { p256dh: sub.toJSON().keys!.p256dh, auth: sub.toJSON().keys!.auth } };
}

export async function unsubscribePush(): Promise<boolean> {
  const pm = await getPushManager();
  if (!pm) return false;
  const sub = await pm.getSubscription();
  return sub ? sub.unsubscribe() : true;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export const NOTIFICATION_TYPES = [
  'booking_confirmed',
  'driver_assigned',
  'driver_eta',
  'order_ready',
  'payout_cleared',
  'trip_reminder',
  'seasonal_promo',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
