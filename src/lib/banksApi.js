/* ============================================================================
   banksApi.js — bank directory and the user's saved bank accounts
   ("kartu bank" feature: picker + add-bank form + saved list).
   ============================================================================ */

import { request } from './apiClient.js';

/* GET /api/banks/ — active banks, optionally filtered by currency code
   (IDR/USD/EUR/SGD/MYR). Public endpoint used by the bank picker. */
export function listBanks(currencyCode) {
  const query = currencyCode ? `?currency_code=${encodeURIComponent(currencyCode)}` : '';
  return request('GET', `/api/banks/${query}`);
}

/* GET /api/banks/user/ — the current user's saved bank accounts, default
   account first. Requires the Bearer token. */
export function listUserBanks() {
  return request('GET', '/api/banks/user/');
}

/* POST /api/banks/user/ — save a new bank account for the current user.
   `phone` is optional (blank allowed). The backend forces the very first
   saved bank to default; is_default=true makes this one the default and
   unsets the previous default. */
export function createUserBank({ bankId, accountName, accountNumber, phone, isDefault }) {
  return request('POST', '/api/banks/user/', {
    bank: Number(bankId),
    account_name: accountName,
    account_number: accountNumber,
    phone: phone || '',
    is_default: Boolean(isDefault),
  });
}
