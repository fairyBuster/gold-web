/* ============================================================================
   withdrawApi.js — withdrawal endpoints used by the Tarik Dana wizard.
   ============================================================================ */

import { request } from './apiClient.js';

/* GET /api/withdraw/settings/ — latest admin withdrawal settings (public).
   Fields: is_active, balance_source ('balance' | 'balance_deposit'),
   require_bank_account, require_pin, require_withdraw_service, ... */
export function getWithdrawSettings() {
  return request('GET', '/api/withdraw/settings/');
}

/* GET /api/banks/ — public list of active banks (name, code, currency,
   min/max withdrawal, fee percent/fixed, processing time). */
export function listBanks() {
  return request('GET', '/api/banks/');
}

/* GET /api/banks/user/ — the current user's saved bank accounts, default
   account first. Requires the Bearer token. */
export function listUserBanks() {
  return request('GET', '/api/banks/user/');
}

/* POST /api/withdraw/ — create a withdrawal request. The backend decides
   whether a PIN or a withdrawal service is required (admin settings); both
   are optional from the app's point of view and are intentionally not sent
   here. bank_account_id is omitted when there is no saved bank — the backend
   then falls back to the user's default bank whenever one is required. */
export function createWithdrawal({ amount, bankAccountId }) {
  const body = { amount: String(amount) };
  if (bankAccountId) body.bank_account_id = Number(bankAccountId);
  return request('POST', '/api/withdraw/', body);
}

/* GET /api/withdraw/transactions/ — paginated list of withdrawal transactions
   (newest first). Optional filters: orderNum (exact trx_id), status, page.
   Returns a DRF pagination envelope: { count, next, previous, results }. */
export function listWithdrawTransactions({ orderNum, status, page } = {}) {
  const params = new URLSearchParams();
  if (orderNum) params.set('order_num', orderNum);
  if (status) params.set('status', status);
  if (page) params.set('page', String(page));
  const query = params.toString();
  return request('GET', `/api/withdraw/transactions/${query ? `?${query}` : ''}`);
}
