/* ============================================================================
   investmentsApi.js — investment ("rencana investasi") endpoints.
   ============================================================================ */

import { request } from './apiClient.js';

/* GET /api/investments/ — the logged-in user's investments.
   Optional filters: status (ACTIVE/COMPLETED/EXPIRED/CANCELLED), product_id,
   page. The backend returns a plain array for this endpoint (no pagination
   envelope is produced), but callers should go through listAllInvestments()
   which tolerates both shapes. */
export function listInvestments({ status, productId, page } = {}) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (productId) params.set('product_id', String(productId));
  if (page) params.set('page', String(page));
  const query = params.toString();
  return request('GET', `/api/investments/${query ? `?${query}` : ''}`);
}

/* Fetches the full investment list regardless of response shape: a plain
   array passes through; a DRF pagination envelope ({ results, next }) is
   followed page-by-page, capped at maxPages. */
export async function listAllInvestments(filters = {}, maxPages = 10) {
  let payload = await listInvestments({ ...filters, page: 1 });
  if (Array.isArray(payload)) return payload;
  const results = Array.isArray(payload?.results) ? [...payload.results] : [];
  let page = 1;
  while (payload?.next && page < maxPages) {
    page += 1;
    payload = await listInvestments({ ...filters, page });
    results.push(...(Array.isArray(payload?.results) ? payload.results : []));
  }
  return results;
}
