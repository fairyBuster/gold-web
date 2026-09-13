/* ============================================================================
   registerFlow.js — in-memory store for the register wizard.

   The wizard steps are separate routes (/auth/register-01..04), so plain
   component state cannot carry the collected form data across steps.
   Deliberately memory-only (resets on refresh) so passwords are never
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
