/* ============================================================================
   authSession.js — stores the JWT session (access + refresh tokens).

   Persisted in localStorage so the session survives page reloads; call
   clear() on logout. Read via get() — apiClient attaches the access token
   as a Bearer header when one is present.
   ============================================================================ */

const STORAGE_KEY = 'je_auth_session';

let session = read();

function read() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function save(partial) {
  session = { ...session, ...partial };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable — keep the in-memory copy only */
  }
}

export function get() {
  return { ...session };
}

export function clear() {
  session = {};
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
