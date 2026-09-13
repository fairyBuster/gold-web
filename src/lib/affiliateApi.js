/* ============================================================================
   affiliateApi.js — affiliate/team (downline) endpoints.
   ============================================================================ */

import { request } from './apiClient.js';

/* GET /api/auth/downline-list/ — lightweight list of the current user's
   downline members (levels 1-5). Optional filters:
     level  → 1-5 (omit for all levels)
     status → 'active' | 'inactive' (omit for all)
   Returns { total_members, total_commission, members: [...] } where each
   member carries no level field — per-level data requires one call per level. */
export function getDownlineList({ level, status } = {}) {
  const params = new URLSearchParams();
  if (level) params.set('level', String(level));
  if (status) params.set('status', status);
  const query = params.toString();
  return request('GET', `/api/auth/downline-list/${query ? `?${query}` : ''}`);
}

/* GET /api/auth/downline-stats/ — per-level (1-5) downline statistics:
   member counts (total/active/inactive), COMPLETED deposit and withdrawal
   aggregates, and the profit_commission_amount / purchase_commission_amount
   earned BY the current user from each level. Always returns 5 entries. */
export function getDownlineStats() {
  return request('GET', '/api/auth/downline-stats/');
}
