/* ============================================================================
   lupaPasswordFlow.js — in-memory store for the password-reset wizard.

   The wizard steps are separate routes (/auth/lupa-password..-04), so plain
   component state cannot carry the collected data across steps. Deliberately
   memory-only (resets on refresh) so passwords and OTP codes are never
   written to localStorage/sessionStorage.
   ============================================================================ */

let data = {};

export function save(partial) {
  data = { ...data, ...partial };
}

export function get() {
  return { ...data };
}

export function clear() {
  data = {};
}
