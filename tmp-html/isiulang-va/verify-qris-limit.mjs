/* Verifikasi DOM headless (jsdom) — guard batas nominal QRIS di IsiUlang:
   nominal di atas Rp10.000.000 + channel QRIS tidak boleh membuat deposit,
   cukup memunculkan notifikasi batas. Skenario:
   1. Isi nominal 15.000.000 lalu pilih "QRIS 2" → notif batas muncul dan
      belum ada panggilan /api/deposits/.
   2. Klik "Lanjutkan Pembayaran" → notif batas muncul lagi, tetap tanpa
      panggilan deposit, dan tetap di route topup.
   3. Ubah nominal ke 10.000.000 (batas pas) lalu Lanjutkan → panggilan
      /api/deposits/mgm/initiate/ terjadi (batas hanya untuk > 10jt) dan
      notif batas tidak tampil lagi.
   Jalankan di dalam container: node /tmp/jsdomtest/verify-qris-limit.mjs */
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';

const distHtml = readFileSync('/app/dist/index.html', 'utf8');
const entry = distHtml.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
if (!entry) {
  console.log('VERIFY-QRIS-LIMIT-FAIL no entry asset');
  process.exit(1);
}
const entryUrl = `file:///app/dist${entry}`;
const LIMIT_COPY = 'Melebihi batas nominal maksimal pengisian dengan QRIS';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const waitFor = async (fn, timeout = 10000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const value = fn();
    if (value) return value;
    await sleep(80);
  }
  return null;
};

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json' },
});

let W = null; /* window aktif — dipakai helper feed */

function setGlobals(w, fetchImpl) {
  const define = (key, value) => Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  define('window', w);
  define('document', w.document);
  define('navigator', w.navigator);
  define('location', w.location);
  define('history', w.history);
  define('localStorage', w.localStorage);
  define('getComputedStyle', w.getComputedStyle.bind(w));
  define('requestAnimationFrame', (cb) => w.requestAnimationFrame(cb));
  define('cancelAnimationFrame', (id) => w.cancelAnimationFrame(id));
  define('HTMLElement', w.HTMLElement);
  define('Node', w.Node);
  define('Event', w.Event);
  define('CustomEvent', w.CustomEvent);
  define('MutationObserver', w.MutationObserver);
  define('IntersectionObserver', w.IntersectionObserver || class { observe() {} unobserve() {} disconnect() {} });
  define('ResizeObserver', w.ResizeObserver || class { observe() {} unobserve() {} disconnect() {} });
  define('matchMedia', w.matchMedia ? w.matchMedia.bind(w) : () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
  define('fetch', fetchImpl);
  w.fetch = fetchImpl;
  w.scrollTo = () => {};
  w.Element.prototype.scrollTo = () => {};
  w.HTMLElement.prototype.scrollTo = () => {};
}

async function boot(hash, fetchImpl) {
  const vc = new VirtualConsole(); /* senyap — peringatan parsing CSS jsdom tidak relevan */
  const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', {
    url: `http://localhost/verify.html${hash}`,
    pretendToBeVisual: true,
    virtualConsole: vc,
  });
  setGlobals(dom.window, fetchImpl);
  W = dom.window;
  dom.window.localStorage.setItem('je_auth_session', JSON.stringify({ access: 'e2e-token' }));
  return dom;
}

/* React controlled input: set nilai lewat native setter, lalu dispatch 'input'. */
async function feed(input, value) {
  const setter = Object.getOwnPropertyDescriptor(W.HTMLInputElement.prototype, 'value').set;
  setter.call(input, value);
  input.dispatchEvent(new W.Event('input', { bubbles: true }));
  await sleep(60);
}

const notifText = () => document.querySelector('.notif-overlay')?.textContent || '';
const findCard = (name) => [...document.querySelectorAll('.page-isi-ulang .payment-card')]
  .find((el) => el.querySelector('.method-name')?.textContent.trim() === name);

const depositCalls = [];
const fetchImpl = async (url) => {
  const target = String(url);
  if (target.includes('/api/deposits/')) depositCalls.push(target);
  if (target.includes('/api/auth/account-info/')) {
    return json({ full_name: 'Andrew Fernandez', username: '628123456789', balance: '1234567', balance_deposit: '150000' });
  }
  return json({}, 200);
};

await boot('#/index/transactions/topup', fetchImpl);
await import(entryUrl);

const results = {};
const input = await waitFor(() => document.querySelector('.page-isi-ulang .amount-input'));
results.pageRendered = Boolean(input);

/* 1. Nominal 15jt + pilih QRIS 2 → notif batas, belum ada panggilan deposit. */
await feed(input, '15000000');
findCard('QRIS 2').click();
await waitFor(() => document.querySelector('.notif-overlay'));
results.selectNotif = notifText();
results.selectCalls = depositCalls.length;

/* 2. Lanjutkan → notif batas lagi, deposit tetap tidak dibuat. */
document.querySelector('.page-isi-ulang .btn-primary').click();
await sleep(350);
results.continueNotif = notifText();
results.continueCalls = depositCalls.length;
results.hashAfterBlocked = location.hash;

/* 3. Batas pas 10jt → flow lanjut ke MGM initiate; notif batas tidak muncul. */
await feed(input, '10000000');
findCard('QRIS 2').click();
document.querySelector('.page-isi-ulang .btn-primary').click();
await waitFor(() => depositCalls.some((u) => u.includes('/api/deposits/mgm/initiate/')));
results.boundaryMgmCalls = depositCalls.filter((u) => u.includes('/api/deposits/mgm/initiate/')).length;
await waitFor(() => notifText() && !notifText().includes(LIMIT_COPY), 2000);
results.boundaryNotif = notifText();

results.passed = results.pageRendered === true
  && results.selectNotif.includes(LIMIT_COPY)
  && results.selectCalls === 0
  && results.continueNotif.includes(LIMIT_COPY)
  && results.continueCalls === 0
  && results.hashAfterBlocked === '#/index/transactions/topup'
  && results.boundaryMgmCalls === 1
  && !results.boundaryNotif.includes(LIMIT_COPY);

console.log(results.passed ? 'VERIFY-QRIS-LIMIT-PASS' : 'VERIFY-QRIS-LIMIT-FAIL');
console.log(JSON.stringify(results, null, 2));
process.exit(results.passed ? 0 : 1);
