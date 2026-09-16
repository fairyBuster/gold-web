/* ============================================================================
   depositsApi.js — deposit (isi ulang saldo) endpoints used by the Isi Ulang
   flow.
   ============================================================================ */

import { request } from './apiClient.js';

/* POST /api/deposits/atpay/initiate-va/ — create a deposit through ATPAY and
   return the Virtual Account number directly; the gateway checkout happens
   server-side (no browser trade_url step).
   Body: { amount: "10000.00", wallet_type: 'BALANCE_DEPOSIT', method } where
   method is the bank code — 'BRI' | 'DANAMON' | 'MANDIRI' | 'PERMATA'.
   Success payload (confirmed against the live gateway): { order_num, order_sn,
   amount, va: "1456…", selected_method, expire_time, method_guide: [{ subject,
   content }], payment_url, provider, … }. */
export function initiateDepositVa({ amount, method }) {
  return request('POST', '/api/deposits/atpay/initiate-va/', {
    amount: String(amount),
    wallet_type: 'BALANCE_DEPOSIT',
    method,
  });
}

/* The VA number ships as `va` in the live gateway payload; the other names
   stay as fallbacks since the OpenAPI schema documents no response body.
   Looked up at the top level first, then inside common nested envelopes.
   Returns '' when none of them is present. */
const VA_NUMBER_KEYS = [
  'va',
  'va_number',
  'virtual_account',
  'virtual_account_number',
  'no_va',
  'nomor_va',
  'account_number',
  'pay_code',
];

const ENVELOPE_KEYS = ['data', 'deposit', 'transaction', 'checkout', 'result'];

function readVaNumber(source) {
  if (!source || typeof source !== 'object') return '';
  for (const key of VA_NUMBER_KEYS) {
    const value = source[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return '';
}

export function extractVaNumber(payload) {
  const direct = readVaNumber(payload);
  if (direct) return direct;
  for (const key of ENVELOPE_KEYS) {
    const nested = readVaNumber(payload?.[key]);
    if (nested) return nested;
  }
  return '';
}

/* Payment deadline from the payload ("2026-09-17 19:38:04"); '' when absent. */
export function extractExpireTime(payload) {
  const value = payload?.expire_time;
  return typeof value === 'string' ? value.trim() : '';
}

/* Per-channel instructions from the gateway:
   [{ subject: 'Cara Pembayaran melalui ATM', content: '1. … 2. …' }]. */
export function extractMethodGuide(payload) {
  const guide = payload?.method_guide;
  return Array.isArray(guide)
    ? guide.filter((item) => item && typeof item.subject === 'string' && typeof item.content === 'string')
    : [];
}

/* POST /api/deposits/mgm/initiate/ — create a QRIS deposit via MGM (FF Pay /
   LPAY / MGM); the response carries the QR data the cashier page renders.
   Body: { amount: 100000, wallet_type: 'BALANCE_DEPOSIT', expiry_period }
   where expiry_period is in minutes — 1440 = 24 jam.
   Success payload (confirmed against the live gateway): { order_num, ref_id,
   amount, pay_url, pay_data (QR image URL saat pay_data_type 'QR_URL'),
   qr_url, qr_image, expires_at (ISO UTC), provider, … }. */
export const QRIS_EXPIRY_MINUTES = 1440;

export function initiateDepositQris({ amount }) {
  return request('POST', '/api/deposits/mgm/initiate/', {
    amount: Number(amount),
    wallet_type: 'BALANCE_DEPOSIT',
    expiry_period: QRIS_EXPIRY_MINUTES,
  });
}

/* QR data untuk halaman instruksi QRIS: gambar QR siap tampil (`pay_data`
   berjenis 'QR_URL', atau `qr_image` — data URL dari LPAY), konten QR
   mentah (`pay_data` non-URL atau `qr_string`) sebagai cadangan untuk
   digenerate lokal, dan masa berlaku. */
export function extractQrisData(payload) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const pick = (...keys) => {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return '';
  };
  const payData = pick('pay_data');
  const payDataType = pick('pay_data_type').toUpperCase();
  /* pay_data_type 'QR_URL' menandakan pay_data adalah URL gambar QR; tipe
     lain diperlakukan sebagai konten QR mentah untuk digenerate lokal. */
  const payDataIsImage = payDataType === 'QR_URL' || (payDataType === '' && /^https?:\/\//i.test(payData));
  return {
    qrImageUrl: (payDataIsImage ? payData : '') || pick('qr_image'),
    qrContent: payDataIsImage ? '' : (payData || pick('qr_string')),
    qrUrl: pick('qr_url'),
    expiresAt: pick('expires_at'),
  };
}

/* POST /api/deposits/ffpay/initiate/ — create a deposit through FF Pay (FF
   Pay / LPAY / MGM family); the response carries ref_id + pay_url but no QR
   yet — konten QR baru muncul lewat select-method.
   Body: { amount: 100000, wallet_type: 'BALANCE_DEPOSIT', expiry_period }
   (expiry_period in minutes — QRIS_EXPIRY_MINUTES = 24 jam).
   Success payload (confirmed against the live gateway): { order_num, ref_id,
   amount, pay_url, pay_data: null, pay_data_type: null, qr_url: null,
   qr_image: "", expires_at (ISO UTC "…Z"), provider }. */
export function initiateDepositFfpay({ amount }) {
  return request('POST', '/api/deposits/ffpay/initiate/', {
    amount: Number(amount),
    wallet_type: 'BALANCE_DEPOSIT',
    expiry_period: QRIS_EXPIRY_MINUTES,
  });
}

/* POST /api/deposits/ffpay/select-method/ — pilih metode untuk deposit ffpay
   yang sudah dibuat; method 'QRIS' mengembalikan konten QR mentah.
   Body: { ref_id, method: 'QRIS' }.
   Success payload (confirmed against the live gateway): { ref_id,
   merchant_ref, method: 'QRIS', pay_data: "00020…" (EMV QRIS — bukan URL
   gambar, pay_data_type 'PG_URL'), pay_url }. */
export function selectFfpayMethod({ refId, method = 'QRIS' }) {
  return request('POST', '/api/deposits/ffpay/select-method/', {
    ref_id: refId,
    method,
  });
}

/* ref_id deposit ffpay (dibutuhkan select-method); '' bila tidak ada. Muncul
   di top level payload; cadangan di dalam provider.data. */
export function extractRefId(payload) {
  const read = (source) => {
    if (!source || typeof source !== 'object') return '';
    for (const key of ['ref_id', 'refId', 'reference_id']) {
      const value = source[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return '';
  };
  return read(payload) || read(payload?.provider?.data);
}

/* POST /api/deposits/lpay/initiate/ — deposit QRIS via LPAY ("Inisiasi deposit
   via FF Pay / LPAY / MGM" di dokumentasi backend); satu panggilan langsung
   membawa gambar QR + konten EMV + masa berlaku.
   Body: { amount: 100000, wallet_type: 'BALANCE_DEPOSIT', expiry_period }
   (expiry_period in minutes — QRIS_EXPIRY_MINUTES = 24 jam).
   Success payload (confirmed against the live gateway): { order_num, ref_id,
   amount, pay_url, pay_data: null, pay_data_type: 'PG_URL', qr_url: null,
   qr_string: "00020…" (konten EMV QRIS), qr_image: "data:image/png;base64,…"
   (gambar QR siap tampil), expires_at (ISO UTC "…Z"), provider }. */
export function initiateDepositLpay({ amount }) {
  return request('POST', '/api/deposits/lpay/initiate/', {
    amount: Number(amount),
    wallet_type: 'BALANCE_DEPOSIT',
    expiry_period: QRIS_EXPIRY_MINUTES,
  });
}

/* POST /api/deposits/bankpay/initiate/ — deposit transfer bank manual via
   BankPay; payload berisi nomor VA + nominal unik yang harus ditransfer.
   Body: { amount: 50000, wallet_type: 'BALANCE_DEPOSIT', bankcode: 'bank' }.
   Success payload (confirmed against the live gateway): { order_num,
   amount: "50000.00", display_amount: "50,862" (nominal transfer — termasuk
   kode unik), pay_url, qr_code, va_number, va_bank: "BRI Virtual Account",
   va_name, provider }. */
export const BANKPAY_BANKCODE = 'bank';

export function initiateDepositBankpay({ amount }) {
  return request('POST', '/api/deposits/bankpay/initiate/', {
    amount: Number(amount),
    wallet_type: 'BALANCE_DEPOSIT',
    bankcode: BANKPAY_BANKCODE,
  });
}

/* Data deposit bankpay untuk halaman instruksi Virtual Account: nomor VA,
   nominal transfer (display_amount — nominal unik yang harus dibayar; jatuh
   ke `amount` bila kosong), kode bank dari va_bank ("BRI Virtual Account"
   → 'BRI'), nama pemilik VA, dan halaman bayar gateway. */
export function extractBankpayInfo(payload) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const read = (key) => (typeof source[key] === 'string' ? source[key].trim() : '');
  const display = read('display_amount').replace(/[^\d]/g, '');
  const amount = display ? Number(display) : Math.round(Number(source.amount) || 0);
  const bankMatch = read('va_bank').match(/^[A-Za-z]+/);
  return {
    vaNumber: extractVaNumber(source),
    amount,
    bank: bankMatch ? bankMatch[0].toUpperCase() : '',
    vaName: read('va_name'),
    payUrl: read('pay_url'),
  };
}
