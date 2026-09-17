/* Verifikasi DOM headless (jsdom) terhadap bundle hasil build di dalam
   container — pengganti sementara browser E2E selama sesi Browser IDE
   bermasalah. Skenario:
   1. Home (#/index/home): saldo + saldo isi ulang (BALANCE_DEPOSIT) tampil,
      eye toggle menyensor / menampilkan kembali keduanya.
   2. RiwayatIsiUlang (#/index/transactions/balance): subtitle channel
      generik (QRIS / Virtual Account / Bank Transfer BRI) dan nama
      gateway tidak bocor.
   3. Auto-retry: satu kegagalan koneksi sesaat pada GET transaksi tidak
      memunculkan kartu error — request diulang dan daftar tetap tampil.
   4. Vip (#/index/rewards/vip): skeleton dulu (tanpa konten mockup), lalu
      data rank live — hero Silver, progress Menuju Gold (64%), 6 tingkatan.
   5. Vip gagal: kartu error "Gagal Memuat Data VIP" menggantikan konten,
      tetap tanpa mockup desain.
   Jalankan di dalam container: node /tmp/jsdomtest/verify-dom.mjs */
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';

const distHtml = readFileSync('/app/dist/index.html', 'utf8');
const entry = distHtml.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
if (!entry) {
  console.log('VERIFY-DOM-FAIL no entry asset');
  process.exit(1);
}
const entryUrl = `file:///app/dist${entry}`;

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

function makeFetch(handlers) {
  return async (url) => {
    const target = String(url);
    for (const [needle, value] of handlers) {
      if (target.includes(needle)) return typeof value === 'function' ? value(target) : value;
    }
    return json({}, 404);
  };
}

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
  dom.window.localStorage.setItem('je_auth_session', JSON.stringify({ access: 'e2e-token' }));
  return dom;
}

const results = { home: {}, riwayat: {}, retry: {}, vip: {}, vipFail: {} };

/* ---------- 1. Home: saldo isi ulang di baris perubahan ---------- */
{
  const fetchImpl = makeFetch([
    ['/api/auth/account-info/', json({ full_name: 'Andrew Fernandez', username: '628123456789', balance: '1234567', balance_deposit: '150000' })],
    ['/api/auth/balance-statistics/', json({ total_income: '0', total_expense: '0' })],
    ['/api/transactions/', json({ count: 0, results: [] })],
    ['/api/news/', json({ count: 0, results: [] })],
    ['/api/', json({}, 200)],
  ]);
  await boot('#/index/home', fetchImpl);
  await import(entryUrl);

  const valueText = () => document.querySelector('.page-home .asset-value')?.textContent.trim() ?? null;
  const depositText = () => document.querySelector('.page-home .deposit-balance')?.textContent.trim() ?? null;

  await waitFor(() => valueText() === 'Rp 1.234.567');
  const h = results.home;
  h.valueShown = valueText();
  h.depositShown = depositText();
  const toggle = document.querySelector('.page-home .visibility-btn');
  h.toggleFound = Boolean(toggle);
  toggle?.click();
  await sleep(250);
  h.valueHidden = valueText();
  h.depositHidden = depositText();
  toggle?.click();
  await sleep(250);
  h.valueRestored = valueText();
  h.depositRestored = depositText();
  h.hash = location.hash;
  h.passed = h.valueShown === 'Rp 1.234.567'
    && h.depositShown === 'Saldo Isi Ulang Rp 150.000'
    && h.valueHidden === 'Rp ••••••'
    && h.depositHidden === 'Saldo Isi Ulang Rp ••••••'
    && h.valueRestored === 'Rp 1.234.567'
    && h.depositRestored === 'Saldo Isi Ulang Rp 150.000'
    && h.hash === '#/index/home';
}

/* ---------- 2. RiwayatIsiUlang: label channel generik ---------- */
{
  const row = (id, created, description) => ({ id, type: 'DEPOSIT', amount: '100000.00', status: 'COMPLETED', created_at: created, description });
  const rows = [
    row(8801, '2026-09-17 20:01:00', 'Deposit via LPAY (BALANCE_DEPOSIT)'),
    row(8802, '2026-09-17 19:02:00', 'Deposit via MGM (BALANCE_DEPOSIT)'),
    row(8803, '2026-09-17 18:03:00', 'Deposit via FF Pay (BALANCE_DEPOSIT)'),
    row(8804, '2026-09-17 17:04:00', 'Deposit via SiTransfer Hub (BALANCE_DEPOSIT)'),
    row(8805, '2026-09-17 16:05:00', 'Deposit via ClientHub (BALANCE_DEPOSIT)'),
    row(8806, '2026-09-17 15:06:00', 'Deposit via ATPAY (BALANCE_DEPOSIT)'),
    row(8807, '2026-09-17 14:07:00', 'Deposit via BankPay (BALANCE_DEPOSIT)'),
    row(8808, '2026-09-17 13:08:00', 'Deposit via Xyz Gateway (BALANCE_DEPOSIT)'),
  ];
  const fetchImpl = makeFetch([
    ['/api/transactions/', json({ count: rows.length, next: null, previous: null, results: rows })],
    ['/api/', json({}, 200)],
  ]);
  await boot('#/index/transactions/balance', fetchImpl);
  await import(`${entryUrl}?riwayat`);

  await waitFor(() => document.querySelectorAll('.page-riwayat-isi-ulang .history-subtitle').length >= rows.length);
  const r = results.riwayat;
  const subtitles = [...document.querySelectorAll('.page-riwayat-isi-ulang .history-subtitle')].map((el) => el.textContent.trim());
  r.subtitles = subtitles;
  const countEnding = (suffix) => subtitles.filter((s) => s.endsWith(`• ${suffix}`)).length;
  r.qrisRows = countEnding('QRIS');
  r.vaRows = countEnding('Virtual Account');
  r.bankTransferRows = countEnding('Bank Transfer BRI');
  r.timeOnlyRows = subtitles.filter((s) => /^\d{2}:\d{2}$/.test(s)).length;
  const rootText = document.getElementById('root').textContent || '';
  r.gatewayLeak = /lpay|mgm|ff\s*pay|sistransfer|clienthub|bankpay|atpay|xyz/gi.test(rootText);
  r.passed = subtitles.length === 8 && r.qrisRows === 4 && r.vaRows === 2 && r.bankTransferRows === 1 && r.timeOnlyRows === 1 && r.gatewayLeak === false;
}

/* ---------- 3. Auto-retry: gagal sekali (koneksi) lalu sukses ---------- */
{
  const row = (id, created, description) => ({ id, type: 'DEPOSIT', amount: '100000.00', status: 'COMPLETED', created_at: created, description });
  const rows = [row(9901, '2026-09-17 12:00:00', 'Deposit via LPAY (BALANCE_DEPOSIT)')];
  let txCalls = 0;
  const fetchImpl = async (url) => {
    const target = String(url);
    if (target.includes('/api/transactions/')) {
      txCalls += 1;
      if (txCalls === 1) throw new TypeError('fetch failed'); /* koneksi putus sesaat */
      return json({ count: rows.length, next: null, previous: null, results: rows });
    }
    if (target.includes('/api/')) return json({}, 200);
    return json({}, 404);
  };
  await boot('#/index/transactions/balance', fetchImpl);
  await import(`${entryUrl}?retry`);
  await waitFor(() => document.querySelectorAll('.page-riwayat-isi-ulang .history-subtitle').length >= rows.length);
  const t = results.retry;
  t.txCalls = txCalls; /* 2 = percobaan pertama gagal, retry-nya sukses */
  t.rows = document.querySelectorAll('.page-riwayat-isi-ulang .history-subtitle').length;
  const rootText = document.getElementById('root').textContent || '';
  t.errorShown = /Tidak dapat terhubung|Gagal memuat/i.test(rootText);
  t.passed = t.txCalls === 2 && t.rows >= 1 && t.errorShown === false;
}

/* ---------- 4. Vip: skeleton dulu, lalu data rank live ---------- */
{
  const level = (rank, title, deposit, extra = {}) => ({
    rank,
    title,
    description: `Total aset isi ulang Rp ${deposit === 0 ? 0 : deposit.toLocaleString('id-ID')}`,
    missions_required_total: 0,
    downlines_total_required: 0,
    downlines_active_required: 0,
    deposit_self_total_required: `${deposit}.00`,
    team_deposit_level_1_total_required: '0.00',
    is_current_rank: false,
    is_unlocked: false,
    user_progress_val: 900000,
    ...extra,
  });
  const levels = [
    level(1, 'Non VIP', 0, { is_unlocked: true }),
    level(2, 'Bronze', 50000, { is_unlocked: true }),
    level(3, 'Silver', 350000, { is_current_rank: true, is_unlocked: true }),
    level(4, 'Gold', 1400000),
    level(5, 'Platinum', 2500000),
    level(6, 'Diamond', 5000000),
  ];
  const status = {
    current_rank: 3,
    current_title: 'Silver',
    completed_missions: 0,
    downlines_total: 0,
    downlines_active: 0,
    deposit_self_total: '900000.00',
    team_deposit_level_1_total: '0.00',
    next_rank: 4,
    next_title: 'Gold',
    next_required_missions: 0,
    next_required_downlines_total: 0,
    next_required_downlines_active: 0,
    next_required_deposit_self_total: '1400000.00',
    next_required_team_deposit_level_1_total: '0.00',
    progress_basis: 'deposit_self_total',
  };
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const fetchImpl = async (url) => {
    const target = String(url);
    if (target.includes('/api/auth/rank-status/')) { await delay(1200); return json(status); }
    if (target.includes('/api/auth/rank-levels/')) { await delay(1200); return json(levels); }
    if (target.includes('/api/')) return json({}, 200);
    return json({}, 404);
  };
  await boot('#/index/rewards/vip', fetchImpl);
  await import(`${entryUrl}?vip`);

  const v = results.vip;
  await waitFor(() => document.querySelector('.page-vip .skeleton'));
  await sleep(300);
  v.skeletonDuringLoad = document.querySelectorAll('.page-vip .skeleton').length;
  v.titleDuringLoad = document.querySelector('.page-vip .status-title')?.textContent.trim() ?? null;
  v.tierNamesDuringLoad = document.querySelectorAll('.page-vip .tier-name').length;
  const duringText = document.querySelector('.page-vip').textContent || '';
  v.mockupsDuringLoad = ['Gold Member', 'Menuju Platinum', 'Rp3.512.870'].filter((s) => duringText.includes(s));

  await waitFor(() => document.querySelector('.page-vip .status-title')?.textContent.trim() === 'Silver', 12000);
  const text = (sel) => document.querySelector(sel)?.textContent.trim() ?? null;
  v.heroTitle = text('.page-vip .status-title');
  v.progressLabel = text('.page-vip .progress-label');
  v.progressAmount = text('.page-vip .progress-amount');
  v.progressWidth = document.querySelector('.page-vip .progress-bar-fill')?.style.width ?? null;
  const tiers = [...document.querySelectorAll('.page-vip .tier-card')].map((card) => ({
    title: card.querySelector('.tier-name')?.textContent.trim() ?? '',
    active: card.classList.contains('active'),
    locked: card.classList.contains('locked'),
    badge: card.querySelector('.current-level-badge')?.textContent.trim() ?? '',
  }));
  v.tierCount = tiers.length;
  v.activeTitle = tiers.find((t) => t.active)?.title ?? null;
  v.badgeTitles = tiers.filter((t) => t.badge).map((t) => t.title);
  v.lockedTitles = tiers.filter((t) => t.locked).map((t) => t.title);
  v.skeletonAfterLoad = document.querySelectorAll('.page-vip .skeleton').length;
  const afterText = document.querySelector('.page-vip').textContent || '';
  v.mockupsAfterLoad = ['Gold Member', 'Menuju Platinum', 'Rp3.512.870'].filter((s) => afterText.includes(s));
  v.passed = v.skeletonDuringLoad >= 10
    && v.titleDuringLoad === null
    && v.tierNamesDuringLoad === 0
    && v.mockupsDuringLoad.length === 0
    && v.heroTitle === 'Silver'
    && v.progressLabel === 'Menuju Gold'
    && v.progressAmount === 'Rp900.000 / Rp1.400.000'
    && v.progressWidth === '64%'
    && v.tierCount === 6
    && v.activeTitle === 'Silver'
    && JSON.stringify(v.badgeTitles) === JSON.stringify(['Silver'])
    && JSON.stringify(v.lockedTitles) === JSON.stringify(['Gold', 'Platinum', 'Diamond'])
    && v.skeletonAfterLoad === 0
    && v.mockupsAfterLoad.length === 0;
}

/* ---------- 5. Vip gagal: kartu error, tanpa konten mockup ---------- */
{
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const fetchImpl = async (url) => {
    const target = String(url);
    if (target.includes('/api/auth/rank-status/')) { await delay(300); return json({}, 500); }
    if (target.includes('/api/auth/rank-levels/')) { await delay(300); return json({}, 500); }
    if (target.includes('/api/')) return json({}, 200);
    return json({}, 404);
  };
  await boot('#/index/rewards/vip', fetchImpl);
  await import(`${entryUrl}?vipfail`);

  await waitFor(() => document.querySelector('.page-vip .notif-card.error'), 15000);
  const f = results.vipFail;
  const card = document.querySelector('.page-vip .notif-card.error');
  f.title = card?.querySelector('.notification-title')?.textContent.trim() ?? null;
  f.description = card?.querySelector('.notification-desc')?.textContent.trim() ?? null;
  f.skeletonLeft = document.querySelectorAll('.page-vip .skeleton').length;
  f.tierCardsLeft = document.querySelectorAll('.page-vip .tier-card').length;
  const failText = document.querySelector('.page-vip').textContent || '';
  f.mockups = ['Gold Member', 'Menuju Platinum', 'Rp3.512.870'].filter((s) => failText.includes(s));
  f.passed = f.title === 'Gagal Memuat Data VIP'
    && f.description === 'Server sedang bermasalah. Coba lagi beberapa saat lagi ya.'
    && f.skeletonLeft === 0
    && f.tierCardsLeft === 0
    && f.mockups.length === 0;
}

const passed = results.home.passed && results.riwayat.passed && results.retry.passed && results.vip.passed && results.vipFail.passed;
console.log(`VERIFY-DOM-${passed ? 'PASS' : 'FAIL'}`);
console.log(JSON.stringify(results, null, 2));
process.exit(passed ? 0 : 1);
