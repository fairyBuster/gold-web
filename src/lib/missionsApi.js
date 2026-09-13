/* ============================================================================
   missionsApi.js — missions endpoints (Misi page).
   ============================================================================ */

import { request } from './apiClient.js';

/* GET /api/missions/ — active missions with the current user's progress and
   claimability: { count, results: [...] }. Each result carries title, reward,
   reward_balance_type, requirement, progress, remaining, can_claim/status,
   claimed_count, etc. */
export function getMissions() {
  return request('GET', '/api/missions/');
}

/* POST /api/missions/claim/ — claim a mission reward; the backend credits the
   reward to the user's wallet. Resolves to { message, mission_id,
   times_claimed, reward_amount, wallet_type, transaction_id, new_balance }
   (200). Failure modes arrive as ApiError with the backend message: 400
   (requirements not met / already claimed) and 404 (mission not found or
   inactive). */
export function claimMission({ missionId, times = 1 }) {
  return request('POST', '/api/missions/claim/', { mission_id: missionId, times });
}
