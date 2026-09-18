/* Verifikasi DOM headless (jsdom) — judul tab/hasil Google halaman landing.
   App.jsx menurunkan document.title dari label route di src/pages-data.js
   ("<label> · Jelajah Emas"); label landing harus berubah dari "Website Resmi"
   menjadi "Jelajah Official". Skenario: root "/" tanpa hash (kondisi homepage
   yang dirayapi Google) harus redirect ke /index/landing dan berakhir dengan
   document.title "Jelajah Official · Jelajah Emas".
   Jalankan di dalam container: node /tmp/jsdomtest/verify-landing-title.mjs */
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';

const distHtml = readFileSync('/app/dist/index.html', 'utf8');
const entry = distHtml.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
if (!entry) {
  console.log('VERIFY-LANDING-TITLE-FAIL no entry asset');
  process.exit(1);
}
const entryUrl = `file:///app/dist${entry}`;
const EXPECTED = 'Jelajah Official · Jelajah Emas';

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

/* Root tanpa hash — persis kondisi homepage domain yang dirayapi Google.
   Halaman landing statis (tanpa panggilan API), mock seadanya cukup. */
const vc = new VirtualConsole(); /* senyap — peringatan parsing CSS jsdom tidak relevan */
const fetchImpl = async () => json({});
const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', {
  url: 'http://localhost/verify.html',
  pretendToBeVisual: true,
  virtualConsole: vc,
});
setGlobals(dom.window, fetchImpl);
await import(entryUrl);

const results = {};
await waitFor(() => document.title === EXPECTED);
results.title = document.title;
results.hash = location.hash;
results.renderedCount = document.querySelector('#root')?.children.length || 0;
results.passed = results.title === EXPECTED
  && results.hash === '#/index/landing'
  && results.renderedCount > 0;

console.log(results.passed ? 'VERIFY-LANDING-TITLE-PASS' : 'VERIFY-LANDING-TITLE-FAIL');
console.log(JSON.stringify(results, null, 2));
process.exit(results.passed ? 0 : 1);
