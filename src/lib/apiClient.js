/* ============================================================================
   apiClient.js — tiny fetch layer for the Django backend.

   Every /api/* response is wrapped by the server's salted renderer as:
     { "data": "<reversed( base64(json) + salt )>" }
   so decodeSaltedResponse() must run on BOTH success and error bodies.
   Config comes from the environment (see .env.example):
     VITE_API_BASE_URL   base URL of the backend (no trailing slash)
     VITE_RESPONSE_SALT  must match RESPONSE_ENCODE_SALT on the server
   ============================================================================ */

import * as authSession from './authSession.js';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');
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
   base64-decode (UTF-8 aware) and parse. Plain JSON bodies pass through. */
export function decodeSaltedResponse(body) {
  if (!body || typeof body !== 'object' || typeof body.data !== 'string') return body;

  try {
    const reversed = body.data.split('').reverse().join('');
    if (!reversed.endsWith(RESPONSE_SALT)) return body;
    const bytes = Uint8Array.from(atob(reversed.slice(0, -RESPONSE_SALT.length)), (c) =>
      c.charCodeAt(0)
    );
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return body;
  }
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
    response = await fetch(`${BASE_URL}${path}`, {
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
