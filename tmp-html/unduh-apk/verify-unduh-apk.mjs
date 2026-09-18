/* Verifikasi DOM headless (jsdom) — tombol "Unduh Aplikasi" di halaman Profil:
   tap harus langsung mengunduh APK (public/android/jelajahemas.apk) lewat
   <a download>, bukan pindah halaman. Assertion: item "Unduh Aplikasi" di
   grid Akun adalah anchor dengan href /android/jelajahemas.apk + atribut
   download, className icon-item tetap, dan grid lain di halaman utuh.
   Jalankan di dalam container: node /tmp/jsdomtest/verify-unduh-apk.mjs */
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';

const distHtml = readFileSync('/app/dist/index.html', 'utf8');
const entry = distHtml.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
if (!entry) {
  console.log('VERIFY-UNDUH-APK-FAIL no entry asset');
  process.exit(1);
}
const entryUrl = `file:///app/dist${entry}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const waitFor = async (fn, timeout = 15000) => {
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

/* Profil butuh sesi login; balasan API seadanya cukup — grid icon statis. */
const vc = new VirtualConsole(); /* senyap — peringatan parsing CSS jsdom tidak relevan */
const fetchImpl = async (url) => {
  const target = String(url);
  if (target.includes('/api/auth/account-info/')) {
    return json({ full_name: 'Andrew Fernandez', username: '628123456789', balance: '1234567', balance_deposit: '150000' });
  }
  return json({});
};

const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', {
  url: 'http://localhost/verify.html#/index/profil',
  pretendToBeVisual: true,
  virtualConsole: vc,
});
setGlobals(dom.window, fetchImpl);
dom.window.localStorage.setItem('je_auth_session', JSON.stringify({ access: 'e2e-token' }));
await import(entryUrl);

const results = {};
const item = await waitFor(() => [...document.querySelectorAll('.icon-item')]
  .find((el) => el.textContent.trim() === 'Unduh Aplikasi'));
results.found = Boolean(item);
results.tag = item ? item.tagName : null;
results.href = item ? item.getAttribute('href') : null;
results.resolvedHref = item ? item.href : null;
results.hasDownload = item ? item.hasAttribute('download') : false;
results.className = item ? item.className : null;
results.label = item ? item.querySelector('span')?.textContent : null;
results.iconItems = document.querySelectorAll('.icon-item').length;

results.passed = results.found === true
  && results.tag === 'A'
  && results.href === '/android/jelajahemas.apk'
  && results.resolvedHref === 'http://localhost/android/jelajahemas.apk'
  && results.hasDownload === true
  && results.className === 'icon-item'
  && results.label === 'Unduh Aplikasi'
  && results.iconItems >= 10;

console.log(results.passed ? 'VERIFY-UNDUH-APK-PASS' : 'VERIFY-UNDUH-APK-FAIL');
console.log(JSON.stringify(results, null, 2));
process.exit(results.passed ? 0 : 1);
