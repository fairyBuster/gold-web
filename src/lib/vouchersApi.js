/* ============================================================================
   vouchersApi.js — voucher claim endpoint (Redeem Kode page).
   ============================================================================ */

import { request } from './apiClient.js';

/* POST /api/vouchers/claim/ — claim a voucher by code; the backend credits
   its amount to the user's wallet. Resolves to { message, voucher_code,
   amount, wallet_type, transaction_id, balance } (201). Failure modes arrive
   as ApiError with the backend message: 400 (inactive / not started / expired
   / usage limit reached / already claimed / invalid amount) and 404 (code
   not found). */
export function claimVoucher({ code }) {
  return request('POST', '/api/vouchers/claim/', { code });
}
