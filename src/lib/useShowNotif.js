import { useSyncExternalStore } from 'react';

/* ============================================================================
   useShowNotif.js — floating in-app notification bus.

   showNotif() pushes { variant, title, description } into a module-level
   store; the single <NotifOverlay /> host (src/components/NotifOverlay.jsx,
   mounted once in App.jsx) subscribes and renders it as a floating card at
   the top of the screen. The page underneath stays mounted and the route
   never changes — the X button (or the auto-dismiss timer) removes the card.
   ============================================================================ */

const listeners = new Set();
let current = null;
let seq = 0;

function emit() {
  for (const listener of listeners) listener();
}

/* Push a notification — replaces any card still on screen. id feeds the
   overlay's animation key, so it must change even for rapid re-triggers. */
export function showNotif({ variant = 'error', title, description } = {}) {
  seq += 1;
  current = { id: seq, variant, title, description };
  emit();
}

/* Hide the visible notification (X button / auto-dismiss). */
export function dismissNotif() {
  current = null;
  emit();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return current;
}

/* Host hook used by <NotifOverlay />. */
export function useNotif() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/* Page-facing hook — same call shape as before: showNotif({ title, description }). */
export function useShowNotif() {
  return showNotif;
}
