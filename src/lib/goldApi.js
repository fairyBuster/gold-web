/* ============================================================================
   goldApi.js — backend tukar emas (gold swap) endpoints.

   GET  /api/gold/info/ — harga emas real-time per gram (server-side, sumber
        XAU + kurs USD→IDR), tarif cetak per gram, ongkir flat, dan saldo
        balance_hold & balance_deposit user. Semua decimal dikirim sebagai
        string.
   POST /api/gold/swap/ — tukar balance_hold jadi emas fisik:
        { gram, address_id }. 201 membawa detail order + nomor transaksi +
        saldo terbaru; 400/503 membawa alasan penolakan.
   GET  /api/gold/orders/<id>/ — detail satu order tukar emas milik user,
        dipakai layar step 3 saat dibuka dari riwayat transaksi (baris SWAP
        membawa gold_order_id).

   Berbeda dari goldPriceApi.js (API publik, display-only), nilai di sini
   yang dipakai perhitungan resmi di backend.
   ============================================================================ */

import { request } from './apiClient.js';

export function getGoldInfo() {
  return request('GET', '/api/gold/info/');
}

export function swapGold(gram, addressId) {
  return request('POST', '/api/gold/swap/', { gram: String(gram), address_id: addressId });
}

export function getGoldOrder(orderId) {
  return request('GET', `/api/gold/orders/${orderId}/`);
}
