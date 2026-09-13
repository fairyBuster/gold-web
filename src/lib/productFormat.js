/* ============================================================================
   productFormat.js — investment product display helpers shared by the asset
   flow pages: the Asset step 1/2 cards and the Konfirmasi summary modal.
   ============================================================================ */

import { formatRupiah } from './transactionFormat.js';

/* "-", empty and null mean "no value" in the product dataset. */
export function isMeaningful(value) {
  const text = String(value ?? '').trim();
  return text !== '' && text !== '-';
}

/* Card sub-line: specifications when present, otherwise the description. */
export function productSpecLine(product) {
  const spec = isMeaningful(product.specifications) ? String(product.specifications).trim() : '';
  const desc = isMeaningful(product.description) ? String(product.description).trim() : '';
  return spec || desc;
}

/* duration is stored in hours; show whole days when it divides evenly. */
export function formatDuration(hours) {
  const total = Number(hours) || 0;
  if (total >= 24 && total % 24 === 0) return `${total / 24} Hari`;
  return `${total} Jam`;
}

export function durationDays(hours) {
  return Math.max(1, Math.round((Number(hours) || 0) / 24));
}

/* Profit credited per claim (rupiah). */
export function profitPerClaim(product) {
  const rate = Number(product.profit_rate) || 0;
  if (product.profit_type === 'percentage') return ((Number(product.price) || 0) * rate) / 100;
  if (product.profit_type === 'random') {
    return ((Number(product.profit_random_min) || 0) + (Number(product.profit_random_max) || 0)) / 2;
  }
  return rate;
}

/* Number of claims in the plan: daily for the at_* reset modes, a single
   claim for after_purchase. */
export function claimCount(product) {
  const mode = product.claim_reset_mode || 'after_purchase';
  if (mode === 'at_00' || mode === 'at_custom') {
    return Math.max(1, Math.floor((Number(product.duration) || 0) / 24));
  }
  return 1;
}

export function profitLabel(product) {
  const rate = Number(product.profit_rate) || 0;
  return product.profit_type === 'percentage' ? `${rate}%` : formatRupiah(rate);
}

export function claimLabel(product) {
  const mode = product.claim_reset_mode || 'after_purchase';
  if (mode === 'at_00' || mode === 'at_custom') return 'Klaim Harian';
  return `Klaim setelah ${formatDuration(product.duration)}`;
}

export function fundSourceLabel(product) {
  return product.balance_source === 'balance' ? 'Saldo JelajahEmas' : 'Saldo Deposit';
}
