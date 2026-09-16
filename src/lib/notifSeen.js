/* ============================================================================
   notifSeen.js — "seen" watermark for the notification feed.

   The transactions feed has no per-item read flag, so "new" is derived
   client-side: a pending item stays new until the user has displayed the
   notif list (MenuNotifikasi). Once that list loads, the newest item
   timestamp is stored; MenuNotifikasi's unread dots and the Home/Profil
   badge counts only include items newer than this watermark.
   ============================================================================ */

import { parseDate } from './transactionFormat.js';

const STORAGE_KEY = 'je_notif_seen_at';

/* Newest item timestamp the user has seen (ms since epoch; 0 = never seen). */
export function getSeenAt() {
  try {
    const value = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

/* True when the item arrived after the last notification-list view. */
export function isUnseen(item, seenAt) {
  const time = parseDate(item.created_at).getTime();
  return Number.isFinite(time) && time > seenAt;
}

/* Moves the watermark up to the newest timestamp in the list (never down). */
export function markSeenUpTo(items) {
  const newest = items.reduce((max, item) => {
    const time = parseDate(item.created_at).getTime();
    return Number.isFinite(time) ? Math.max(max, time) : max;
  }, 0);
  if (newest <= getSeenAt()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(newest));
  } catch {
    /* storage unavailable — nothing to persist */
  }
}
