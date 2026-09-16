/* ============================================================================
   kartuBankFlow.js — in-memory store for the "Tambah Rekening Bank" flow.

   The bank picker (/profil/pilih-bank) and the form (/profil/kartu-bank-02)
   are separate routes, so the chosen bank (id + display name) is kept here
   between steps. Deliberately memory-only (resets on refresh) — nothing
   sensitive is stored.
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
