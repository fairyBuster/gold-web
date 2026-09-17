import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav.jsx';
import NotifCard from '../../components/NotifCard.jsx';
import PopupKomunitas from '../../components/PopupKomunitas.jsx';
import img_1 from '../../assets/images/38a55ef245471fd7a368a8008013cd81b2525d61.webp';
import img_2 from '../../assets/images/3d6fb697a044e75c7a6c789438a276b40b37b5b9.webp';
import img_3 from '../../assets/images/120_3267.svg';
import img_4 from '../../assets/images/120_3271.svg';
import img_5 from '../../assets/images/120_3364.svg';
import img_6 from '../../assets/images/120_3369.svg';
import img_7 from '../../assets/images/120_3373.svg';
import img_8 from '../../assets/images/6e7afc8beed777ee8ad0a014432f7422da8ce4ac.png';
import img_9 from '../../assets/images/120_3286.svg';
import img_10 from '../../assets/images/05ab16507053b79d47257c0cb8f932cb8e444b74.png';
import img_11 from '../../assets/images/0682ccf19a5ccac05cf1b55cdf4ce11990d20ded.webp';
import img_12 from '../../assets/images/daa433f6e9556af856198e9d4ecedd96ef8128a8.webp';
import img_13 from '../../assets/images/2435cd6c53c354916420eab2f8b2db60cacf59ca.png';
import img_14 from '../../assets/images/6c978b09e2741a18e62f0ff8b1cee6c908c1f1e0.png';
import img_15 from '../../assets/images/120_3336.svg';
import img_16 from '../../assets/images/a.png';
import img_17 from '../../assets/images/b.png';
import img_18 from '../../assets/images/a183fe7f42819438be5c49935567e464a5e56f98.webp';
/* Same card artwork used by the “Harga Emas Hari Ini” cards on AsetSaya/Asset pages. */
import img_19 from '../../assets/images/d35f294fb1a21fb0aa4f326dc1672ebf0f14686d.png';
/* "Event & Promosi" banner slides. */
import img_20 from '../../assets/images/b1.webp';
import img_21 from '../../assets/images/b2.webp';
import img_22 from '../../assets/images/b3.webp';
/* Full-page background artwork (same asset as the login screen). */
import img_23 from '../../assets/images/083535.webp';
/* Live gold-price card data (free public sources, cached 5 min). */
import { fetchGoldPrice, getCachedGoldPrice, formatIDR, formatPercentID } from '../../lib/goldPriceApi.js';
/* Header greeting user data — GET /api/auth/account-info/. */
import { getAccountInfo, getBalanceStatistics } from '../../lib/authApi.js';
/* "Berita Terbaru" cards — GET /api/news/ (public endpoint). */
import { listNews } from '../../lib/newsApi.js';
/* Notification badge — same rolling 7-day transaction feed as MenuNotifikasi. */
import { useTransactionFeed } from '../../lib/useTransactionFeed.js';
import { statusKind } from '../../lib/transactionFormat.js';
import { getSeenAt, isUnseen } from '../../lib/notifSeen.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for Home — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-home to isolate this page. */

.page-home, .page-home * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

.page-home {
  font-family: 'Inter', sans-serif;
  background-color: #fffbf4;
  color: #1a1410;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  padding-bottom: 80px; /* Space for bottom nav */
  /* Background artwork (assigned inline from the imported asset) is a
     full-page image with glows anchored to the top/bottom — stretch it. */
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: top center;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.05);
  width: 100%;
}

.page-home a {
  text-decoration: none;
}

.page-home button {
  border: none;
  background: none;
  font-family: inherit;
  cursor: pointer;
}

.page-home .hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.page-home .hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-home .header-section {
    position: relative;
    width: 100%;
    padding: 30px 20px 5px 87px;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  .page-home .character-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 93px;
    height: 146px;
    object-fit: cover;
    z-index: 10;
  }
  .page-home .header-content {
    position: relative;
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  .page-home .greeting {
    color: #a79c8f;
    font-size: 12px;
    line-height: 16px;
  }
  .page-home .header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .page-home .brand-logo {
    height: 52px;
    width: auto;
  }
  .page-home .header-actions {
    display: flex;
    gap: 10px;
  }
  .page-home .icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 17px;
    background-color: #ffffff;
    box-shadow: 0px 2px 8px 0px rgba(26, 20, 16, 0.08);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .page-home .notification-btn .badge {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 15px;
    height: 15px;
    background-color: #e24c4c;
    color: #ffffff;
    font-size: 9px;
    font-weight: 700;
    border-radius: 7.5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

/* CSS for section section:AssetSummary */
.page-home .asset-section {
    padding: 13px 20px 0;
  }
  .page-home .asset-card {
    background-size: cover;
    background-position: center;
    border-radius: 22px;
    padding: 22px 22px 24.5px;
    box-shadow: 0px 16px 30px 0px rgba(26, 20, 16, 0.1);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .page-home .asset-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .page-home .asset-label {
    color: #a79c8f;
    font-size: 12px;
  }
  .page-home .asset-link {
    color: #e8790c;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .page-home .asset-value-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
  }
  .page-home .asset-value {
    color: #1a1410;
    font-size: 24px;
    font-weight: 700;
    line-height: 33px;
  }
  /* Loading placeholder for the saldo value: the bar keeps the 24px number's
     footprint (h2 line-height) so the card does not jump when it resolves. */
  .page-home .asset-value-skeleton {
    display: inline-block;
    width: 176px;
    height: 26px;
    border-radius: 7px;
    background: linear-gradient(90deg, rgba(26, 20, 16, 0.08) 25%, rgba(26, 20, 16, 0.16) 37%, rgba(26, 20, 16, 0.08) 63%);
    background-size: 400% 100%;
    animation: home-asset-shimmer 1.4s ease infinite;
  }
  @keyframes home-asset-shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: 0 0; }
  }
  .page-home .visibility-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .page-home .asset-change {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 4px;
  }
  .page-home .change-text {
    color: #3fa66b;
    font-size: 12px;
    font-weight: 600;
  }
  .page-home .change-text.is-down {
    color: #e24c4c;
  }
  /* Saldo dompet isi ulang (BALANCE_DEPOSIT) di ujung kanan baris perubahan — label atas, nominal bawah. */
  .page-home .deposit-balance {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: #a79c8f;
    font-size: 12px;
    white-space: nowrap;
  }
  .page-home .deposit-balance strong {
    color: #514840;
    font-weight: 700;
  }

/* CSS for section section:MarketPrice */
.page-home .market-section {
    padding: 14px 20px 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .page-home .price-card {
    background-color: #a8a19bb3;
    /* The card artwork is sized to exactly one box — the whole image maps to
       this single card, no tiling or cropping. */
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 5px;
    padding: 16px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-home .coin-icon {
    width: 45px;
    height: 44px;
  }
  .page-home .price-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .page-home .price-label {
    color: #514840;
    font-size: 11px;
  }
  .page-home .price-amount {
    color: #1a1410;
    font-size: 15px;
    font-weight: 700;
  }
  .page-home .price-trend {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .page-home .trend-value {
    color: #e24c4c;
    font-size: 12px;
    font-weight: 600;
  }
  .page-home .trend-value.positive {
    color: #3fa66b;
  }
  .page-home .btn-buy {
    background-color: #231b15;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    padding: 15px;
    border-radius: 5px;
    width: 100%;
    text-align: center;
  }

/* CSS for section section:Features */
.page-home .features-section {
    padding: 24px 20px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .page-home .section-title {
    color: #1a1410;
    font-size: 16px;
    font-weight: 700;
  }
  .page-home .features-grid {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .page-home .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 68px;
  }
  .page-home .feature-item img {
    width: 46px;
    height: 46px;
    object-fit: contain;
  }
  .page-home .feature-item span {
    color: #514840;
    font-size: 11px;
    text-align: center;
  }

/* CSS for section section:Promotions */
.page-home .promos-section {
    padding: 24px 20px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .page-home .scroll-row {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 5px;
  }
  .page-home .promos-section .scroll-row {
    scroll-snap-type: x mandatory;
  }
  .page-home .promo-card {
    /* Each slide is one full-width banner; swipe sideways like a carousel. */
    min-width: 100%;
    aspect-ratio: 242 / 100;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    scroll-snap-align: start;
  }
  .page-home .promo-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

/* CSS for section section:News */
.page-home .news-section {
    padding: 24px 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .page-home .news-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .page-home .link-all {
    color: #e8790c;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .page-home .news-card {
    min-width: 180px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .page-home .news-image-placeholder {
    width: 100%;
    height: 88px;
    background-color: #f6f1e9;
    border: 1px solid rgba(26, 20, 16, 0.18);
    border-radius: 14px;
  }
  .page-home .news-image {
    width: 100%;
    height: 88px;
    border: 1px solid rgba(26, 20, 16, 0.18);
    border-radius: 14px;
    object-fit: cover;
    display: block;
  }
  .page-home .news-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 4px;
  }
  .page-home .news-title {
    color: #1a1410;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .page-home .news-date {
    color: #a79c8f;
    font-size: 10px;
  }
  .page-home .news-status {
    color: #a79c8f;
    font-size: 12px;
    padding: 8px 0;
  }

/* CSS for section section:Footer */
.page-home .footer-section {
    padding: 20px 24px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .page-home .footer-logos {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .page-home .logo-ojk {
    height: 17px;
    width: auto;
    border-radius: 5px;
  }
  .page-home .logo-bappebti {
    height: 17px;
    width: auto;
    border-radius: 5px;
  }
  .page-home .footer-text {
    color: #a79c8f;
    font-size: 10px;
    text-align: center;
    line-height: 1.5;
  }

/* Bottom navigation lives in src/components/BottomNav.jsx (styles inline in that file). */
`;

/* "YYYY-MM-DD HH:mm:ss" -> "DD/MM/YY" (mockup date style). Parsed manually so
   iOS Safari never sees the non-ISO space separator. */
function formatNewsDate(value) {
  const [year, month, day] = String(value || '').split(' ')[0].split('-');
  if (!year || !month || !day) return '';
  return `${day}/${month}/${year.slice(2)}`;
}

/* The notification badge counts "new" items from the same feed the
   MenuNotifikasi page combines: the three transaction types, rolling 7 days.
   A transaction counts as new while it is still pending — the state that
   shows the unread dot on the notification page. */
const NOTIFICATION_TYPES = ['DEPOSIT', 'WITHDRAW', 'INVESTMENTS'];

/* GET /api/transactions/ date filter: rolling 7-calendar-day window
   (today + the 6 previous days), formatted as YYYY-MM-DD. */
function startDateParam() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  const pad = (value) => String(value).padStart(2, '0');
  return `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
}

/* "Gabung Komunitas Kami" popup gate: resets on every page load (a refresh
   shows the popup again) but survives internal navigation — remounting Home
   within the same page load (e.g. returning from Profil) does not re-show it. */
let komunitasShownThisLoad = false;

export default function Home() {
  const navigate = useNavigate();
  const [goldPrice, setGoldPrice] = useState(null);
  const [account, setAccount] = useState(null);
  /* True until GET /api/auth/account-info/ settles — drives the saldo
     skeleton; both success and failure end it. */
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState('');
  // Eye toggle on the "Saldo sekarang" card — always starts visible
  // (terbuka) on every visit; each tap masks/unmasks the amounts.
  const [assetVisible, setAssetVisible] = useState(true);
  /* Today's / yesterday's income for the change line under the balance card
     (GET /api/auth/balance-statistics/today|yesterday/). */
  const [todayStats, setTodayStats] = useState(null);
  const [yesterdayStats, setYesterdayStats] = useState(null);
  /* "Gabung Komunitas Kami" popup (src/components/PopupKomunitas.jsx) —
     shows again after every refresh of Home, but only once per page load
     (see komunitasShownThisLoad above). The X or an overlay tap just
     hides it. */
  const [showKomunitas, setShowKomunitas] = useState(!komunitasShownThisLoad);
  useEffect(() => {
    komunitasShownThisLoad = true;
  }, []);

  // Live "Harga Emas Hari Ini" — a cached value paints instantly, then the
  // free public sources refresh it in the background (see goldPriceApi.js).
  // While no live data exists yet, the card keeps its static mockup values.
  useEffect(() => {
    let active = true;
    const cached = getCachedGoldPrice();
    if (cached) setGoldPrice(cached);
    fetchGoldPrice().then((live) => {
      if (active && live) setGoldPrice(live);
    });
    return () => {
      active = false;
    };
  }, []);

  // Header greeting — GET /api/auth/account-info/ (Home sits behind
  // RequireAuth, so a token is present). On failure the placeholder stays.
  useEffect(() => {
    let active = true;
    getAccountInfo()
      .then((data) => {
        if (active && data) setAccount(data);
      })
      .catch(() => {
        /* keep the "[Nama Pengguna]" placeholder */
      })
      .finally(() => {
        /* Either way the saldo skeleton stops once the request settles. */
        if (active) setBalanceLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Card change line — today's and yesterday's income for the "(…%)" growth
  // badge under the balance (same balance-statistics endpoints as Profil).
  useEffect(() => {
    let active = true;
    Promise.allSettled([getBalanceStatistics('today'), getBalanceStatistics('yesterday')]).then(([today, yesterday]) => {
      if (!active) return;
      if (today.status === 'fulfilled' && today.value) setTodayStats(today.value);
      if (yesterday.status === 'fulfilled' && yesterday.value) setYesterdayStats(yesterday.value);
    });
    return () => {
      active = false;
    };
  }, []);

  // "Berita Terbaru" — 3 latest articles from GET /api/news/ (public endpoint).
  useEffect(() => {
    let active = true;
    listNews()
      .then((payload) => {
        if (!active) return;
        const items = Array.isArray(payload?.results) ? payload.results : [];
        setNews(items.slice(0, 3));
      })
      .catch(() => {
        if (active) setNewsError('Gagal memuat berita.');
      })
      .finally(() => {
        if (active) setNewsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // "Event & Promosi" banner slider — auto-advances every 4s and loops back to
  // the first slide. Touching/clicking the row pauses it; releasing resumes
  // with a fresh timer that continues from the slide the user left on.
  const promoRowRef = useRef(null);
  useEffect(() => {
    const row = promoRowRef.current;
    if (!row) return undefined;
    let timer = null;
    let index = 0;
    const step = () => row.clientWidth + 12; /* slide width + flex gap */
    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };
    const advance = () => {
      const count = row.children.length || 1;
      index = (index + 1) % count;
      row.scrollTo({ left: index * step(), behavior: 'smooth' });
    };
    const start = () => {
      stop();
      /* Continue from wherever the user left the carousel. */
      index = Math.round(row.scrollLeft / step()) % (row.children.length || 1);
      timer = window.setInterval(advance, 4000);
    };
    start();
    row.addEventListener('pointerdown', stop);
    row.addEventListener('pointerup', start);
    row.addEventListener('pointercancel', start);
    row.addEventListener('pointerleave', start);
    return () => {
      stop();
      row.removeEventListener('pointerdown', stop);
      row.removeEventListener('pointerup', start);
      row.removeEventListener('pointercancel', start);
      row.removeEventListener('pointerleave', start);
    };
  }, []);

  // Notification badge — number of new notifications: pending transactions
  // that came in after the last view of the notif list (notifSeen watermark).
  // Zero means the badge is not rendered at all.
  const [seenAt] = useState(getSeenAt);
  const { items: notificationItems } = useTransactionFeed(NOTIFICATION_TYPES, {
    startDate: startDateParam(),
  });
  const newNotificationCount = notificationItems.filter(
    (trx) => statusKind(trx.status) === 'pending' && isUnseen(trx, seenAt)
  ).length;

  const hasLivePrice = Boolean(goldPrice) && Number.isFinite(goldPrice.pricePerGram);
  const changePercent = hasLivePrice
    ? (Number.isFinite(goldPrice.changePercent) ? goldPrice.changePercent : 0)
    : -1.01;
  const trendUp = changePercent >= 0;
  const priceText = hasLivePrice
    ? `${formatIDR(goldPrice.pricePerGram)} / gram`
    : 'Rp 2.569.270 / gram';
  const hour = new Date().getHours();
  const greetingTime = hour < 11 ? 'pagi' : hour < 15 ? 'siang' : hour < 19 ? 'sore' : 'malam';
  const displayName =
    (account?.full_name || '').trim() || (account?.username || '').trim() || '[Nama Pengguna]';
  // Wallet saldo on the "Saldo sekarang" card — the `balance` field of
  // GET /api/auth/account-info/ (numeric string in IDR). While the request
  // is in flight the card shows a skeleton bar; on failure it falls back
  // to "—".
  const balanceText = account ? formatIDR(Number(account.balance) || 0) : '—';
  /* Saldo dompet isi ulang — the `balance_deposit` field of the same
     account-info payload (the wallet IsiUlang tops up). Sits at the end of
     the change line and is masked by the same eye toggle. */
  const depositBalanceText = account ? formatIDR(Number(account.balance_deposit) || 0) : '—';
  /* Change line under the balance: today's income in Rupiah plus the percent
     change of that income against yesterday ("Rp X (Y%)"). The mockup
     "Rp 0 (0,0%)" stays until both stats requests land. */
  const incomeToday = todayStats ? Number(todayStats.total_income) || 0 : null;
  const incomeYesterday = yesterdayStats ? Number(yesterdayStats.total_income) || 0 : null;
  const incomeChangePercent =
    incomeToday === null || incomeYesterday === null
      ? null
      : incomeYesterday > 0
        ? ((incomeToday - incomeYesterday) / incomeYesterday) * 100
        : incomeToday > 0
          ? 100
          : 0;
  /* Same up/down convention as the gold-price trend: the arrow carries the
     direction, the percent stays absolute. */
  const incomeTrendUp = incomeChangePercent === null || incomeChangePercent >= 0;
  const incomeChangeText =
    incomeToday === null || incomeChangePercent === null
      ? 'Rp 0 (0,0%)'
      : `${formatIDR(incomeToday)} (${formatPercentID(Math.abs(incomeChangePercent))})`;

  return (
    <div className="page-home" style={{ backgroundImage: `url(${img_23})` }}>
      <style>{styles}</style>
      {/* Community popup — the X only hides it (default onClose would
          history.back() and leave Home). */}
      {showKomunitas && <PopupKomunitas onClose={() => setShowKomunitas(false)} />}
      <div>
              <section id="section-header" className="header-section">
                <img src={img_1} className="character-img" alt="Mascot" />
                <div className="header-content">
                  {/* <p className="greeting">Selamat {greetingTime}, {displayName}!</p> */}
                  <div className="header-main">
                    <img src={img_2} className="brand-logo" alt="Jelajah Emas" />
                    <div className="header-actions">
                      <button className="icon-btn" onClick={(e) => { e.preventDefault(); navigate('/index/support/tentang-kami'); }}>
                        <img src={img_3} alt="Tentang Kami" />
                      </button>
                      <button className="icon-btn notification-btn" onClick={(e) => { e.preventDefault(); navigate('/index/profil/notifikasi'); }}>
                        <img src={img_4} alt="Notification" />
                        {newNotificationCount > 0 && <span className="badge">{newNotificationCount}</span>}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-asset" className="asset-section">
                <div className="asset-card" style={{ backgroundImage: `url(${img_18})` }}>
                  <div className="asset-header">
                    <span className="asset-label">Saldo sekarang</span>
                    <Link to="/index/assets/all" className="asset-link">
                      Lihat Milik Saya
                      <img src={img_5} alt=">" />
                    </Link>
                  </div>
                  <div className="asset-value-container">
                    <h2 className="asset-value">
                      {balanceLoading
                        ? <span className="asset-value-skeleton" aria-hidden="true" />
                        : (assetVisible ? balanceText : 'Rp ••••••')}
                    </h2>
                    <button
                      className="visibility-btn"
                      aria-label={assetVisible ? 'Sembunyikan nilai aset' : 'Tampilkan nilai aset'}
                      onClick={() => setAssetVisible((v) => !v)}
                    >
                      <img src={img_6} alt="Toggle Visibility" />
                    </button>
                  </div>
                  <div className="asset-change">
                    <img src={incomeTrendUp ? img_7 : img_9} alt={incomeTrendUp ? 'Up' : 'Down'} />
                    <span className={`change-text${incomeTrendUp ? '' : ' is-down'}`}>{assetVisible ? incomeChangeText : 'Rp •••••• (•••%)'}</span>
                    <span className="deposit-balance">Saldo Isi Ulang <strong>{assetVisible ? depositBalanceText : 'Rp ••••••'}</strong></span>
                  </div>
                </div>
              </section>
              <section id="section-market" className="market-section">
                <div className="price-card" style={{ backgroundImage: `url(${img_19})` }}>
                  <img src={img_8} className="coin-icon" alt="Gold Coin" />
                  <div className="price-details">
                    <span className="price-label">Harga Emas Hari Ini</span>
                    <h3 className="price-amount">{priceText}</h3>
                  </div>
                  <div className="price-trend">
                    <img src={trendUp ? img_7 : img_9} alt={trendUp ? 'Up' : 'Down'} />
                    <span className={`trend-value${trendUp ? ' positive' : ''}`}>{formatPercentID(Math.abs(changePercent))}</span>
                  </div>
                </div>
                <button className="btn-buy" onClick={(e) => { e.preventDefault(); navigate('/index/assets/asset-01'); }}>Beli Emas Sekarang</button>
              </section>
              <section id="section-features" className="features-section">
                <h3 className="section-title">Fitur Lainnya</h3>
                <div className="features-grid">
                  <Link to="/index/transactions/topup" className="feature-item">
                    <img src={img_10} alt="Isi Ulang" />
                    <span>Isi Ulang</span>
                  </Link>
                  <Link to="/index/assets/cetak-emas-01" className="feature-item">
                    <img src={img_11} alt="Cetak" />
                    <span>Cetak</span>
                  </Link>
                  <Link to="/index/affiliate/tim-afiliasi" className="feature-item">
                    <img src={img_12} alt="Tim/Afiliasi" />
                    <span>Tim/Afiliasi</span>
                  </Link>
                  <Link to="/index/transactions/sending" className="feature-item">
                    <img src={img_13} alt="Tarik Dana" />
                    <span>Tarik Dana</span>
                  </Link>
                  <Link to="/index/transactions/riwayat-transaksi" className="feature-item">
                    <img src={img_14} alt="Riwayat" />
                    <span>Riwayat</span>
                  </Link>
                </div>
              </section>
              <section id="section-promotions" className="promos-section">
                <h3 className="section-title">Event &amp; Promosi</h3>
                <div className="scroll-row hide-scrollbar" ref={promoRowRef}>
                  <div className="promo-card">
                    <img src={img_20} alt="Banner Slide 1" />
                  </div>
                  <div className="promo-card">
                    <img src={img_21} alt="Banner Slide 2" />
                  </div>
                  <div className="promo-card">
                    <img src={img_22} alt="Banner Slide 3" />
                  </div>
                </div>
              </section>
              <section id="section-news" className="news-section">
                <div className="news-header">
                  <h3 className="section-title">Berita Terbaru</h3>
                  <Link to="/index/berita" className="link-all">
                    Lihat Semua
                    <img src={img_15} alt=">" />
                  </Link>
                </div>
                <div className="scroll-row hide-scrollbar">
                  {newsLoading && <p className="news-status">Memuat berita...</p>}
                  {!newsLoading && newsError && (
                    <NotifCard variant="error" title="Gagal Memuat Berita" description={newsError} />
                  )}
                  {!newsLoading && !newsError && news.length === 0 && <p className="news-status">Belum ada berita.</p>}
                  {news.map((item) => (
                    <Link
                      key={item.id}
                      to="/index/berita/detail"
                      state={{ newsId: item.id }}
                      className="news-card"
                      onClick={() => sessionStorage.setItem('je_news_id', String(item.id))}
                    >
                      {item.image ? (
                        <img className="news-image" src={item.image} alt={item.title} />
                      ) : (
                        <div className="news-image-placeholder" />
                      )}
                      <div className="news-content">
                        <p className="news-title">{item.title}</p>
                        <span className="news-date">{formatNewsDate(item.published_at)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
              <section id="section-footer" className="footer-section">
                <div className="footer-logos">
                  <img src={img_16} alt="OJK" className="logo-ojk" />
                  <img src={img_17} alt="BAPPEBTI" className="logo-bappebti" />
                </div>
                <p className="footer-text">
                  JelajahEmas dikelola oleh PT JELAJAH EMAS DIGITAL INDONESIA<br />
                  AHU: AHU-A11995.AH.01.30 tahun 2026 • NPWP: 1000000011096252
                </p>
              </section>
              <BottomNav active="home" />
            </div>

    </div>
  );
}
