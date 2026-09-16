/* ============================================================================
   rouletteApi.js — roulette points & redeem endpoints (PoinMall flow).
   ============================================================================ */

import { request } from './apiClient.js';

/* GET /api/roulette/points/ — ringkasan poin/tiket roulette user: saldo
   (`tickets`), akumulasi masuk/keluar, dan breakdown sumbernya. Resolves to
   { tickets, total_earned, total_spent, earned_breakdown: { level1_purchase,
   self_deposit, admin_adjust }, spent_breakdown: { spin, redeem,
   admin_adjust }, ticket_cost, spins_available, total_spins, total_redeems }.
   Sumber angka "Poin Kamu" di hero PoinMall step 1 & kartu Saldo Profil, dan
   total "Poin Didapat"/"Poin Ditukar" di kartu ringkasan Riwayat Poin. */
export function getRoulettePoints() {
  return request('GET', '/api/roulette/points/');
}

/* GET /api/roulette/redeem/ — redeem prize catalog: active prizes with
   points_cost > 0, cheapest first (separate from the spin catalog at
   /api/roulette/status/). Resolves to { is_active, tickets, prizes: [{ id,
   name, image, description, prize_type, amount, points_cost }] } where
   `tickets` is the current user's point/ticket balance. */
export function getRedeemCatalog() {
  return request('GET', '/api/roulette/redeem/');
}

/* POST /api/roulette/redeem/ — exchange points for a prize (no spin). The
   backend deducts points_cost from the ticket wallet and credits BALANCE /
   BALANCE_DEPOSIT prizes instantly; physical prizes are logged for admin
   follow-up. Resolves to { message, tickets_before, tickets_after, prize_id,
   prize_name, prize_type, prize_amount, points_spent, transaction_id,
   redemption_id } (200). Failure modes arrive as ApiError with the backend
   message: 400 (not enough points / roulette inactive / prize not redeemable)
   and 404 (prize not found). */
export function redeemPrize({ prizeId }) {
  return request('POST', '/api/roulette/redeem/', { prize_id: prizeId });
}
