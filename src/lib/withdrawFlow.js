/* ============================================================================
   withdrawFlow.js — in-memory store for the Tarik Dana wizard.

   The wizard steps are separate routes (/index/transactions/sending and
   /index/transactions/tarik-dana-02..-04),
   so plain component state cannot carry the collected data across steps.
   Deliberately memory-only (resets on refresh): the amount and the chosen
   bank are re-collected safely and never written to localStorage.
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
