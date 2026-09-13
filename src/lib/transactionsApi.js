/* ============================================================================
   transactionsApi.js — transaction history endpoints.
   ============================================================================ */

import { request } from './apiClient.js';

/* GET /api/transactions/ — paginated list of the current user's transactions.
   Optional filters: type, status, wallet_type, start_date, end_date, page.
   Returns a DRF pagination envelope: { count, next, previous, results }. */
export function listTransactions({ type, status, walletType, startDate, endDate, page } = {}) {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (status) params.set('status', status);
  if (walletType) params.set('wallet_type', walletType);
  if (startDate) params.set('start_date', startDate);
  if (endDate) params.set('end_date', endDate);
  if (page) params.set('page', String(page));
  const query = params.toString();
  return request('GET', `/api/transactions/${query ? `?${query}` : ''}`);
}

/* Fetches every page of GET /api/transactions/ for the given filters by
   following DRF page-number pagination (`next`), capped at maxPages so the
   request count stays bounded. Returns the flat list of results. A later
   page may fail transiently (e.g. a gateway 502); the pages already loaded
   are kept instead of failing the whole feed. Only a first-page failure
   throws (there is nothing to show in that case). */
export async function listAllTransactions(filters = {}, maxPages = 10) {
  const results = [];
  let page = 1;
  let payload = await listTransactions({ ...filters, page });
  results.push(...(Array.isArray(payload?.results) ? payload.results : []));
  while (payload?.next && page < maxPages) {
    page += 1;
    try {
      payload = await listTransactions({ ...filters, page });
    } catch {
      break;
    }
    results.push(...(Array.isArray(payload?.results) ? payload.results : []));
  }
  return results;
}
