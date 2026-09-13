/* ============================================================================
   authApi.js — authentication endpoints.
   ============================================================================ */

import { request } from './apiClient.js';

/* POST /api/auth/register/ — register a new user (phone number authentication).
   Payload: username, password, password2, email, full_name, phone,
   referral_code, otp, withdraw_pin. Returns the created user summary. */
export function registerUser(payload) {
  return request('POST', '/api/auth/register/', payload);
}

/* POST /api/auth/jwt/identifier-login/ — login with phone or email + password.
   Identifiers containing '@' are treated as email, otherwise as phone.
   Returns the JWT session ({ access, refresh }); also accepts the
   access_token / refresh_token key names just in case. */
export async function loginUser({ identifier, password }) {
  const payload = await request('POST', '/api/auth/jwt/identifier-login/', { identifier, password });
  return {
    access: payload?.access || payload?.access_token || '',
    refresh: payload?.refresh || payload?.refresh_token || '',
    raw: payload,
  };
}

/* POST /api/auth/request-otp-registered/ — request a WhatsApp OTP for a phone
   number that is already registered. Used by step 1 of the lupa-password
   wizard and by its "Kirim Ulang" action on step 2. */
export function requestOtpRegistered({ phone }) {
  return request('POST', '/api/auth/request-otp-registered/', { phone });
}

/* POST /api/auth/change-password-otp/ — change the password with old-password
   + OTP verification. Used by step 3 of the lupa-password wizard. */
export function changePasswordOtp({ phone, oldPassword, newPassword, newPasswordConfirm, otp }) {
  return request('POST', '/api/auth/change-password-otp/', {
    phone,
    old_password: oldPassword,
    new_password: newPassword,
    new_password_confirm: newPasswordConfirm,
    otp,
  });
}

/* GET /api/auth/account-info/ — current user account information (profile,
   balances, rank, referral). Requires the Bearer token; used by the Home
   header greeting. */
export function getAccountInfo() {
  return request('GET', '/api/auth/account-info/');
}

/* PUT /api/auth/profile-update/ — update the current user's profile (partial).
   Payload fields: full_name, username, telegram, email, date_of_birth
   (YYYY-MM-DD, tidak boleh masa depan), gender ('male' | 'female'). */
export function updateProfile(payload) {
  return request('PUT', '/api/auth/profile-update/', payload);
}

/* POST /api/auth/profile-photo/ — upload foto profil (multipart, field
   'avatar'; JPG/JPEG/PNG maksimal 1MB). Dipakai tombol ganti foto di
   halaman EditProfil; response berisi URL avatar absolut + message. */
export function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  return request('POST', '/api/auth/profile-photo/', formData);
}

/* GET /api/auth/balance-statistics/{period}/ — balance + income statistics
   for 'today' | 'yesterday' | 'weekly' | 'monthly' | 'all-time'. Requires the
   Bearer token; the asset-history summary reads interest_total from it. */
export function getBalanceStatistics(period = 'all-time') {
  return request('GET', `/api/auth/balance-statistics/${period}/`);
}

/* GET /api/auth/balance-cashback/ — saldo poin cashback deposit user
   (1 poin = 1 Rupiah). Sumber nilai "Poin Kamu" di halaman Profil. */
export function getBalanceCashback() {
  return request('GET', '/api/auth/balance-cashback/');
}

/* GET /api/auth/rank-levels/ — daftar tingkatan (rank) lengkap dengan syarat
   tiap level dan status user (is_current_rank, is_unlocked, user_progress_*).
   Dipakai halaman VIP; endpoint juga mengevaluasi ulang rank user. */
export async function getRankLevels() {
  const data = await request('GET', '/api/auth/rank-levels/');
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.results) ? data.results : [];
}
