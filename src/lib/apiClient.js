/* ============================================================================
   apiClient.js — tiny fetch layer for the Django backend.

   Requests go to the app's own origin (relative /api/* paths); the dev and
   preview servers reverse-proxy them to the real backend (BACKEND_ORIGIN in
   .env — no VITE_ prefix, so the backend host never enters the client bundle).

   Every /api/* response is wrapped by the server's salted renderer as:
     { "data": "<reversed( base64(json) + salt )>" }
   so decodeSaltedResponse() must run on BOTH success and error bodies.
   Absolute backend media URLs inside payloads are rewritten to same-origin
   /media/* paths by relativizeMediaUrls() (see below).
   VITE_RESPONSE_SALT  must match RESPONSE_ENCODE_SALT on the server
   ============================================================================ */

import * as authSession from './authSession.js';

const RESPONSE_SALT = import.meta.env.VITE_RESPONSE_SALT || 'KXXADFDFDF';

/* Login endpoints answer wrong credentials with 401 too. There the status is
   a form error (handled inline by the login page), not a dead session, so
   they never trigger the auto-redirect below. */
const LOGIN_PATHS = [
  '/api/auth/jwt/identifier-login/',
  '/api/auth/jwt/phone-login/',
  '/api/auth/jwt/email-login/',
];

export class ApiError extends Error {
  constructor(status, payload) {
    super(frontendMessage(status));
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

/* User-facing error text is always authored here (frontend) — backend wording
   (DRF field errors, "validation_error" codes, raw detail strings) must never
   reach a notification. Statuses without a dedicated hint return '' so the
   call site's own fallback (e.g. "Voucher gagal diklaim. Silakan coba lagi.")
   is displayed instead. The raw payload stays reachable as err.payload for
   programmatic checks. */
function frontendMessage(status) {
  if (status === 0) return 'Tidak dapat terhubung ke server. Periksa koneksi internet kamu.';
  if (status === 429) return 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi ya.';
  if (status >= 500) return 'Server sedang bermasalah. Coba lagi beberapa saat lagi ya.';
  return '';
}

/* Undo the server's encoding: reverse the string, strip the salt suffix,
   base64-decode (UTF-8 aware) and parse. Plain JSON bodies pass through.
   Every return path goes through relativizeMediaUrls() so payloads carry
   same-origin /media/* paths regardless of how the server encoded them. */
export function decodeSaltedResponse(body) {
  if (!body || typeof body !== 'object' || typeof body.data !== 'string') {
    return relativizeMediaUrls(body);
  }

  try {
    const reversed = body.data.split('').reverse().join('');
    if (!reversed.endsWith(RESPONSE_SALT)) return relativizeMediaUrls(body);
    const bytes = Uint8Array.from(atob(reversed.slice(0, -RESPONSE_SALT.length)), (c) =>
      c.charCodeAt(0)
    );
    return relativizeMediaUrls(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return relativizeMediaUrls(body);
  }
}

/* Payloads sometimes carry ABSOLUTE media URLs (http://<backend>/media/... —
   e.g. uploaded review photos). The browser must never load those directly:
   on the https site they are mixed content (blocked), and they would leak
   the backend domain the proxy setup hides. Rewrite every absolute /media/*
   URL to a same-origin path; the dev/preview proxy forwards it to the
   backend. Deep-walks the decoded JSON so nested objects/arrays are covered,
   and leaves every non-/media/ URL untouched. */
const ABSOLUTE_MEDIA_URL = /^https?:\/\/[^/]+(\/media\/.*)$/i;

function relativizeMediaUrls(value) {
  if (typeof value === 'string') return value.replace(ABSOLUTE_MEDIA_URL, '$1');
  if (Array.isArray(value)) return value.map(relativizeMediaUrls);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, item] of Object.entries(value)) out[key] = relativizeMediaUrls(item);
    return out;
  }
  return value;
}

export async function request(method, path, body) {
  /* FormData bodies (file uploads) go out as multipart/form-data — the
     Content-Type must be left unset so the browser adds the boundary. */
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  const { access } = authSession.get();
  if (access) headers.Authorization = `Bearer ${access}`;

  let response;
  try {
    response = await fetch(path, {
      method,
      headers,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Periksa koneksi internet kamu.');
  }

  let raw = null;
  try {
    raw = await response.json();
  } catch {
    raw = null;
  }

  const payload = decodeSaltedResponse(raw);
  if (!response.ok) {
    /* A 401 on a request that carried our Bearer token means the session is
       no longer valid (expired, revoked, or the account was disabled): drop
       it and let the app redirect to the login page. Requests without a
       token (public pages, register, lupa-password) pass through untouched. */
    if (response.status === 401 && access && !LOGIN_PATHS.includes(path)) {
      authSession.clear();
      window.dispatchEvent(new CustomEvent('je:unauthorized'));
    }
    throw new ApiError(response.status, payload);
  }
  return payload;
}
