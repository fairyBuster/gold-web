/* Verifikasi headless tanpa browser: tabel regex klasifikasi provider dan
   pola "Deposit via" diekstrak LANGSUNG dari bundle hasil build, lalu
   dijalankan terhadap seluruh description contoh — memastikan hanya label
   channel generik (QRIS / Virtual Account / Bank Transfer BRI) yang keluar
   dan tidak ada nama gateway yang lolos. Dijalankan di dalam container:
   node verify-channel.mjs /app/dist/assets/index-*.js */
import { readFileSync } from 'node:fs';

const BUNDLE = process.argv[2] || '/app/dist/assets/index-BQuJ_2u3.js';
const src = readFileSync(BUNDLE, 'utf8');

const tableMatch = src.match(/\[\[\/bank[\s\S]{0,400}?\]\]/);
if (!tableMatch) {
  console.log(JSON.stringify({ fatal: 'rule table not found in bundle' }));
  process.exit(1);
}
const rules = eval(tableMatch[0]);

const providerReMatch = src.match(/\/Deposit via \(\[\^\(\]\+\)\/[a-z]*/);
if (!providerReMatch) {
  console.log(JSON.stringify({ fatal: 'provider regex not found in bundle' }));
  process.exit(1);
}
const providerRe = eval(providerReMatch[0]);

const channelName = (trx) => {
  const provider = providerRe.exec(trx.description || '')?.[1]?.trim();
  if (!provider) return '';
  const rule = rules.find(([pattern]) => pattern.test(provider));
  return rule ? rule[1] : '';
};

const cases = [
  ['Deposit via LPAY (BALANCE_DEPOSIT)', 'QRIS'],
  ['Deposit via MGM (BALANCE_DEPOSIT)', 'QRIS'],
  ['Deposit via FF Pay (BALANCE_DEPOSIT)', 'QRIS'],
  ['Deposit via SiTransfer Hub (BALANCE_DEPOSIT)', 'QRIS'],
  ['Deposit via ClientHub (BALANCE_DEPOSIT)', 'Virtual Account'],
  ['Deposit via ATPAY (BALANCE_DEPOSIT)', 'Virtual Account'],
  ['Deposit via BankPay (BALANCE_DEPOSIT)', 'Bank Transfer BRI'],
  ['Deposit via Xyz Gateway (BALANCE_DEPOSIT)', ''],
  ['Deposit via QRIS (BALANCE_DEPOSIT)', 'QRIS'],
  ['Deposit via ffpay (BALANCE_DEPOSIT)', 'QRIS'],
  ['Deposit via atpay (BALANCE_DEPOSIT)', 'Virtual Account'],
];

const results = cases.map(([description, expected]) => {
  const got = channelName({ description });
  return { description, expected, got, ok: got === expected };
});

const passed = results.every((r) => r.ok);
console.log('RIWAYAT-CHANNEL-BUNDLE-' + (passed ? 'PASS' : 'FAIL'));
console.log(JSON.stringify({
  bundle: BUNDLE,
  rules: rules.map(([re, label]) => [String(re), label]),
  results,
  passed,
}, null, 2));
process.exit(passed ? 0 : 1);
