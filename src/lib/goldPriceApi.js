/* ============================================================================
   goldPriceApi.js — live gold price for the "Harga Emas Hari Ini" cards.

   Free, no-API-key, CORS-enabled public sources (tried in order):
     1. CoinGecko PAXG — one call returns the tokenized-gold price in IDR
        plus the 24h change percentage (price + trend together).
     2. api.gold-api.com XAU spot (USD/oz) converted to IDR with the
        open.er-api.com daily rates (price only, no change percentage).
   The result is cached in localStorage for CACHE_TTL_MS so reloads and the
   other pages showing the same card stay gentle on the free endpoints.
   ============================================================================ */

const GRAMS_PER_TROY_OUNCE = 31.1034768;
const CACHE_KEY = 'je_gold_price';
const CACHE_TTL_MS = 5 * 60 * 1000;

async function fetchJson(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

/* Source 1 — CoinGecko PAXG (tokenized gold, 1 token = 1 troy ounce). */
async function fetchFromCoinGecko() {
  const data = await fetchJson(
    'https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=idr&include_24hr_change=true'
  );
  const gold = data?.['pax-gold'];
  if (!gold || !Number.isFinite(gold.idr)) throw new Error('CoinGecko: unexpected payload');
  return {
    pricePerGram: gold.idr / GRAMS_PER_TROY_OUNCE,
    changePercent: Number.isFinite(gold.idr_24h_change) ? gold.idr_24h_change : null,
    source: 'coingecko',
  };
}

/* Source 2 — gold-api.com XAU spot in USD + open.er-api.com USD→IDR rate. */
async function fetchFromGoldApi() {
  const [gold, fx] = await Promise.all([
    fetchJson('https://api.gold-api.com/price/XAU'),
    fetchJson('https://open.er-api.com/v6/latest/USD'),
  ]);
  const usdPerOunce = Number(gold?.price);
  const usdToIdr = Number(fx?.rates?.IDR);
  if (!Number.isFinite(usdPerOunce) || !Number.isFinite(usdToIdr)) {
    throw new Error('gold-api: unexpected payload');
  }
  return {
    pricePerGram: (usdPerOunce * usdToIdr) / GRAMS_PER_TROY_OUNCE,
    changePercent: null,
    source: 'gold-api',
  };
}

/* Fresh cached value (within CACHE_TTL_MS) or null. */
export function getCachedGoldPrice() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Number.isFinite(cached.pricePerGram) && Date.now() - cached.ts < CACHE_TTL_MS) {
      return cached;
    }
  } catch {
    /* unreadable cache — fetch fresh data instead */
  }
  return null;
}

function saveCache(price) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), ...price }));
  } catch {
    /* storage full/blocked — the live value still renders */
  }
}

/* Fetch a live price, falling back across sources. Resolves to null when
   every source fails (callers keep their static placeholder values). */
export async function fetchGoldPrice() {
  for (const source of [fetchFromCoinGecko, fetchFromGoldApi]) {
    try {
      const price = await source();
      saveCache(price);
      return price;
    } catch {
      /* try the next source */
    }
  }
  return null;
}

/* "Rp 2.473.346" — Indonesian thousand separators, no decimals. */
export function formatIDR(value) {
  return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
}

/* "0,20%" — Indonesian decimal comma, always two decimals. */
export function formatPercentID(value) {
  return `${value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}
