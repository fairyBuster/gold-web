/* Verifikasi DOM headless (jsdom) — notifikasi penonaktifan QRIS di IsiUlang:
   balasan gateway berisi Decoded JSON { detail: "Pengisian ulang tertunda
   hari ini. Silakan coba 30 menit selanjutnya" } (status error maupun 200)
   harus tampil sebagai copy "QRIS ini tidak tersedia, yuk coba pembayaran
   lainnya." — bukan kegagalan generik — dan alur non-QRIS (VA) tetap memakai
   copy kegagalannya sendiri. Skenario:
   1. QRIS 2 (MGM): initiate error 400 + detail → notif QRIS, tetap di topup.
   2. QRIS 2 (MGM): initiate 200 + detail → notif QRIS.
   3. QRIS 1 (LPAY): initiate 200 + detail → notif QRIS.
   4. QRIS 4 (FF Pay): initiate sukses, select-method 200 + detail → notif QRIS.
   5. VA BRI: initiate error 400 + detail → copy VA sendiri, bukan copy QRIS.
   6. VA BRI: initiate sukses → pindah ke halaman instruksi VA.
   Jalankan di dalam container: node /tmp/jsdomtest/verify-qris-disabled.mjs */
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';

const distHtml = readFileSync('/app/dist/index.html', 'utf8');
const entry = distHtml.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
if (!entry) {
  console.log('VERIFY-QRIS-DISABLED-FAIL no entry asset');
  process.exit(1);
}
const entryUrl = `file:///app/dist${entry}`;
const QRIS_COPY = 'QRIS ini tidak tersedia, yuk coba pembayaran lainnya';
const VA_COPY = 'Gagal Membuat Virtual Account';
const DETAIL_JSON = { detail: 'Pengisian ulang tertunda hari ini. Silakan coba 30 menit selanjutnya' };

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
const closeNotif = async () => {
  document.querySelector('.notif-overlay .close-button')?.click();
  await waitFor(() => !document.querySelector('.notif-overlay'), 1500);
};
const findCard = (name) => [...document.querySelectorAll('.page-isi-ulang .payment-card')]
  .find((el) => el.querySelector('.method-name')?.textContent.trim() === name);
const clickContinue = () => document.querySelector('.page-isi-ulang .btn-primary').click();

const calls = [];
let behavior = {};
const fetchImpl = async (url) => {
  const target = String(url);
  calls.push(target);
  if (target.includes('/api/auth/account-info/')) {
    return json({ full_name: 'Andrew Fernandez', username: '628123456789', balance: '1234567', balance_deposit: '150000' });
  }
  for (const [frag, reply] of Object.entries(behavior)) {
    if (target.includes(frag)) return reply();
  }
  return json({}, 200);
};
const countCalls = (frag) => calls.filter((u) => u.includes(frag)).length;

await boot('#/index/transactions/topup', fetchImpl);
await import(entryUrl);

const results = {};
const input = await waitFor(() => document.querySelector('.page-isi-ulang .amount-input'));
results.pageRendered = Boolean(input);
await feed(input, '50000');

/* 1. QRIS 2 (MGM) — initiate error 400 + Decoded JSON detail. */
behavior = { '/api/deposits/mgm/initiate/': () => json(DETAIL_JSON, 400) };
findCard('QRIS 2').click();
clickContinue();
await waitFor(() => notifText().includes(QRIS_COPY));
results.mgmErrorNotif = notifText();
results.mgmErrorHash = location.hash;

/* 2. QRIS 2 (MGM) — initiate 200 + Decoded JSON detail. */
await closeNotif();
behavior = { '/api/deposits/mgm/initiate/': () => json(DETAIL_JSON, 200) };
clickContinue();
await waitFor(() => notifText().includes(QRIS_COPY));
results.mgmOkNotif = notifText();
results.mgmOkHash = location.hash;
results.mgmCalls = countCalls('/api/deposits/mgm/initiate/');

/* 3. QRIS 1 (LPAY) — initiate 200 + Decoded JSON detail. */
await closeNotif();
behavior = { '/api/deposits/lpay/initiate/': () => json(DETAIL_JSON, 200) };
findCard('QRIS 1').click();
clickContinue();
await waitFor(() => notifText().includes(QRIS_COPY));
results.lpayNotif = notifText();
results.lpayCalls = countCalls('/api/deposits/lpay/initiate/');

/* 4. QRIS 4 (FF Pay) — initiate sukses, select-method 200 + Decoded JSON detail. */
await closeNotif();
behavior = {
  '/api/deposits/ffpay/initiate/': () => json({ ref_id: 'E2E-REF-1', expires_at: '2026-09-18T00:00:00Z', pay_data: null, pay_data_type: null }),
  '/api/deposits/ffpay/select-method/': () => json(DETAIL_JSON, 200),
};
findCard('QRIS 4').click();
clickContinue();
await waitFor(() => notifText().includes(QRIS_COPY));
results.ffpayNotif = notifText();
results.ffpayCalls = countCalls('/api/deposits/ffpay/initiate/');
results.ffpaySelectCalls = countCalls('/api/deposits/ffpay/select-method/');

/* 5. VA BRI — error 400 + detail: copy VA sendiri, bukan copy QRIS. */
await closeNotif();
behavior = { '/api/deposits/atpay/initiate-va/': () => json(DETAIL_JSON, 400) };
findCard('VA BRI').click();
clickContinue();
await waitFor(() => notifText().includes(VA_COPY));
results.vaErrorNotif = notifText();
results.vaErrorHash = location.hash;

/* 6. VA BRI — initiate sukses → halaman instruksi VA. */
await closeNotif();
behavior = {
  '/api/deposits/atpay/initiate-va/': () => json({
    va: '880812345678',
    amount: '50000.00',
    expire_time: '2026-09-17 21:00:00',
    method_guide: [{ subject: 'Cara Pembayaran melalui ATM', content: '1. Masukkan kartu 2. Ikuti instruksi' }],
  }),
};
clickContinue();
await waitFor(() => location.hash.includes('virtual-account'));
results.vaSuccessHash = location.hash;

results.passed = results.pageRendered === true
  && results.mgmErrorNotif.includes(QRIS_COPY)
  && results.mgmErrorHash === '#/index/transactions/topup'
  && results.mgmOkNotif.includes(QRIS_COPY)
  && results.mgmOkHash === '#/index/transactions/topup'
  && results.mgmCalls === 2
  && results.lpayNotif.includes(QRIS_COPY)
  && results.lpayCalls === 1
  && results.ffpayNotif.includes(QRIS_COPY)
  && results.ffpayCalls === 1
  && results.ffpaySelectCalls === 1
  && results.vaErrorNotif.includes(VA_COPY)
  && !results.vaErrorNotif.includes(QRIS_COPY)
  && results.vaErrorNotif.includes('Coba lagi beberapa saat lagi')
  && results.vaErrorHash === '#/index/transactions/topup'
  && results.vaSuccessHash.includes('virtual-account');

console.log(results.passed ? 'VERIFY-QRIS-DISABLED-PASS' : 'VERIFY-QRIS-DISABLED-FAIL');
console.log(JSON.stringify(results, null, 2));
process.exit(results.passed ? 0 : 1);
