import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav.jsx';
import * as authSession from '../../lib/authSession.js';
/* Saldo kartu "Saldo Kamu" — GET /api/auth/account-info/ (saldo utama, saldo
   isi ulang & saldo emas digital = BALANCE HOLD; statistik penarikan:
   GET /api/auth/balance-statistics/all-time/; poin/tiket roulette:
   GET /api/roulette/points/; persen income hari ini vs kemarin:
   GET /api/auth/balance-statistics/today|yesterday/; komisi undangan tingkat
   1-3: GET /api/auth/downline-stats/). */
import { getAccountInfo, getBalanceStatistics } from '../../lib/authApi.js';
/* "Poin Kamu" — saldo poin/tiket roulette dari GET /api/roulette/points/. */
import { getRoulettePoints } from '../../lib/rouletteApi.js';
/* Komisi undangan tingkat 1-3 — sumber "Total Komisi" (perhitungan yang
   sama dengan "Total Bonus" di halaman Tim Afiliasi). */
import { getDownlineStats } from '../../lib/affiliateApi.js';
import { formatRupiah, statusKind } from '../../lib/transactionFormat.js';
/* Live "Harga Emas Hari Ini" — free public sources, cached 5 min. */
import { fetchGoldPrice, getCachedGoldPrice, formatIDR, formatPercentID } from '../../lib/goldPriceApi.js';
/* Notification badge — same rolling 7-day transaction feed as MenuNotifikasi. */
import { useTransactionFeed } from '../../lib/useTransactionFeed.js';
import { getSeenAt, isUnseen } from '../../lib/notifSeen.js';
import img_1 from '../../assets/images/3d6fb697a044e75c7a6c789438a276b40b37b5b9.png';
import img_2 from '../../assets/images/145_815.svg';
import img_3 from '../../assets/images/120_3271.svg';
import img_4 from '../../assets/images/ec972c6bbdb7f31b7256dac0dd419e926ac47b3f.png';
import img_5 from '../../assets/images/24884b821f483719b32ae83be95f5938906ed0a4.png';
import img_6 from '../../assets/images/9b5ad71549ef79083a8ec75cc09e48d716da84b5.png';
import img_7 from '../../assets/images/340e645f2f26798f02677e2c98422f58aea39efc.png';
import img_8 from '../../assets/images/94ca8f344e5fb407a20caa7b64b18f1f69f1c241.png';
import img_9 from '../../assets/images/729874bc8fdae9508a7d6edd0fbcab0fc2297acd.png';
import img_10 from '../../assets/images/763617fd2eddebaebccfb9989d93f996b484d69a.png';
import img_11 from '../../assets/images/37bf07f68b14d7eb18658f6d01b3f9b6012b0779.png';
import img_12 from '../../assets/images/98_1430.svg';
import img_13 from '../../assets/images/98_1435.svg';
import img_14 from '../../assets/images/6e7afc8beed777ee8ad0a014432f7422da8ce4ac.png';
import img_15 from '../../assets/images/145_834.svg';
import img_16 from '../../assets/images/120_3336.svg';
import img_17 from '../../assets/images/98_1463.svg';
import img_18 from '../../assets/images/98_1469.svg';
import img_19 from '../../assets/images/35b20deded0e19912844b6fdf8f9fd2008b94258.png';
import img_20 from '../../assets/images/4efc6fe0afcfc3c59becc39e7b39f3b8af76471d.png';
import img_21 from '../../assets/images/535c8f9574b2f9baf9949b53f996ee4685220aa4.png';
import img_22 from '../../assets/images/56b2ad6f2b2c68460fa3d5fcbc77ac17528d20db.png';
import img_23 from '../../assets/images/b47d68fcca5d9906fa4b670a4e2ba97595b53d85.png';
import img_24 from '../../assets/images/81569fcc73114198ebce603270d2876bde8f85e9.png';
import img_25 from '../../assets/images/b81e15c346e04436d4942dcc3db210c53fb02cde.png';
import img_26 from '../../assets/images/d8666664ad04dfe2e0ca0eab6760afd9981cbdda.png';
import img_27 from '../../assets/images/da5c0c73940a74f9c3800abf541fd5f52b003bdc.png';
import img_28 from '../../assets/images/9fcc473ba5f784d0b2060fecc81d824e08c1f8ef.png';
import img_29 from '../../assets/images/d35f294fb1a21fb0aa4f326dc1672ebf0f14686d.png';
import img_30 from '../../assets/images/2d27e5e57ff1783ed10941fbbd9cc56c2b708170.png';
/* "Promo & Info" banner slides — same banners as the Home "Event & Promosi" carousel. */
import img_31 from '../../assets/images/b1.png';
import img_32 from '../../assets/images/b2.png';
import img_33 from '../../assets/images/b3.png';
/* Green up-trend arrow for the live gold banner (down state keeps img_15). */
import img_34 from '../../assets/images/120_3373.svg';

/* Static mockup values kept until the live gold-price sources respond. */
const FALLBACK_PRICE_PER_GRAM = 2569270;
const FALLBACK_CHANGE_PERCENT = -1.01;
/* Pertumbuhan income mockup — dipakai sampai statistik hari ini & kemarin
   landed. */
const FALLBACK_GROWTH_PERCENT = 1.01;

/* The notification badge counts "new" items from the same feed the
   MenuNotifikasi page combines: the three transaction types, rolling 7 days.
   A transaction counts as new while it is still pending. */
const NOTIFICATION_TYPES = ['DEPOSIT', 'WITHDRAW', 'INVESTMENTS'];

/* Level downline yang dihitung untuk "Total Komisi" — tingkat 1-3 saja. */
const TEAM_LEVELS = [1, 2, 3];

/* GET /api/transactions/ date filter: rolling 7-calendar-day window
   (today + the 6 previous days), formatted as YYYY-MM-DD. */
function startDateParam() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  const pad = (value) => String(value).padStart(2, '0');
  return `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
}

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for Profil — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-profil to isolate this page. */

.page-profil {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  width: 100%;
}

.page-profil .app-section {
  display: flex;
  justify-content: center;
  width: 100%;
}

.page-profil .app-container {
  width: 100%;
  max-width: 100%;
  background-color: #fffbf4;
  box-sizing: border-box;
  position: relative;
}

.page-profil p,.page-profil  h1,.page-profil  h2,.page-profil  h3,.page-profil  h4,.page-profil  h5,.page-profil  h6 {
  margin: 0;
}

.page-profil a {
  text-decoration: none;
}

.page-profil button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}

/* Reusable styles for sub-sections */
.page-profil .sub-section-container {
  padding: 0 20px 24px;
}

.page-profil .sub-section-title {
  font-size: 11px;
  font-weight: 600;
  color: #a79c8f;
  text-transform: uppercase;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.page-profil .icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 8px;
}

.page-profil .icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}

.page-profil .icon-item img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.page-profil .icon-item span {
  font-size: 11px;
  color: #514840;
  text-align: center;
  line-height: 1.2;
}

.page-profil .icon-item.danger span {
  color: #e24c4c;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-profil .header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: radial-gradient(circle at 0% 0%, rgba(255, 201, 60, 0.15) 0%, transparent 70%), #fffbf4;
}
.page-profil .logo {
  height: 34px;
  width: auto;
}
.page-profil .header-actions {
  display: flex;
  gap: 10px;
}
.page-profil .icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(26, 20, 16, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.page-profil .icon-btn img {
  width: 17px;
  height: 17px;
}
.page-profil .badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #e24c4c;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  height: 15px;
  min-width: 15px;
  border-radius: 7.5px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 4px;
  box-sizing: border-box;
}

/* CSS for section section:Features */
.page-profil .features-container {
  padding: 10px 20px 20px;
}
.page-profil .section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
  margin-bottom: 16px;
}
.page-profil .features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 8px;
  margin-bottom: 24px;
}
.page-profil .feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}
.page-profil .feature-item img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.page-profil .feature-item span {
  font-size: 11px;
  color: #514840;
  text-align: center;
  line-height: 1.2;
}
.page-profil .features-actions {
  display: flex;
  gap: 10px;
}
.page-profil .action-btn {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 44px;
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  border-radius: 30px;
  color: #1a1410;
  font-size: 13px;
  font-weight: 600;
}
.page-profil .action-btn img {
  width: 16px;
  height: 16px;
}

/* CSS for section section:GoldPrice */
.page-profil .gold-price-container {
  padding: 0 20px 24px;
}
.page-profil .gold-banner {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.page-profil .gold-banner-content {
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.page-profil .gold-coin {
  width: 45px;
  height: 44px;
}
.page-profil .gold-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.page-profil .gold-label {
  font-size: 12px;
  color: #a79c8f;
}
.page-profil .gold-price {
  font-size: 15px;
  font-weight: 700;
  color: #1a1410;
}
.page-profil .gold-change {
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: flex-end;
  margin-bottom: 4px;
}
.page-profil .gold-change span {
  font-size: 12px;
  font-weight: 600;
  color: #e24c4c;
}
.page-profil .gold-change span.positive {
  color: #3fa66b;
}
.page-profil .gold-btn {
  background-color: #231b15;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  height: 50px;
  border-radius: 5px;
  width: 100%;
}

/* CSS for section section:Balance */
.page-profil .balance-container {
  padding: 0 20px 24px;
}
.page-profil .balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.page-profil .balance-header .section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
  margin-bottom: 0;
}
.page-profil .view-all {
  font-size: 12px;
  color: #e8790c;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
.page-profil .balance-card {
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  padding: 18px 20px 20px;
  box-shadow: 0px 16px 30px 0px rgba(26, 20, 16, 0.18);
}
.page-profil .balance-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}
.page-profil .balance-card-title {
  font-size: 12px;
  color: #1a1410;
  line-height: 1.4;
}
.page-profil .text-green {
  color: #2e8b57;
}

.page-profil .text-red {
  color: #e24c4c;
}
.page-profil .refresh-btn {
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background-color: rgba(26, 20, 16, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-profil .refresh-btn:disabled {
  opacity: 0.5;
}
.page-profil .refresh-btn img.is-spinning {
  animation: profil-refresh-spin 0.8s linear infinite;
}
@keyframes profil-refresh-spin {
  to {
    transform: rotate(360deg);
  }
}
.page-profil .main-balance {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.page-profil .main-balance .amount {
  font-size: 24px;
  font-weight: 700;
  color: #1a1410;
}
.page-profil .eye-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-profil .balance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
  border-top: 1px solid rgba(26, 20, 16, 0.15);
  padding-top: 16px;
}
.page-profil .balance-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.page-profil .item-label {
  font-size: 11px;
  color: rgba(26, 20, 16, 0.55);
}
.page-profil .item-value {
  font-size: 13px;
  font-weight: 700;
  color: #1a1410;
}
.page-profil .skeleton-bar {
  display: inline-block;
  vertical-align: middle;
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(26, 20, 16, 0.08) 25%, rgba(26, 20, 16, 0.16) 37%, rgba(26, 20, 16, 0.08) 63%);
  background-size: 400% 100%;
  animation: profil-shimmer 1.4s ease infinite;
}
@keyframes profil-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}

/* CSS for section section:Promo */
.page-profil .promo-container {
  padding: 0 20px 24px;
}
.page-profil .promo-container .section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
  margin-bottom: 16px;
}
.page-profil .promo-container .scroll-row {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 5px;
  scroll-snap-type: x mandatory;
}
.page-profil .promo-card {
  /* Each slide is one full-width banner; swipe sideways like a carousel.
     Same banners (b1/b2/b3) and behavior as the Home "Event & Promosi" row. */
  min-width: 100%;
  aspect-ratio: 242 / 100;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  scroll-snap-align: start;
}
.page-profil .promo-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.page-profil .hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.page-profil .hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* CSS for section section:Account */
/* Styles shared via global.css */

/* CSS for section section:Help */
/* Styles shared via global.css */

/* CSS for section section:Others */
/* Styles shared via global.css */

/* CSS for section section:FooterInfo */
.page-profil .footer-info-container {
  padding: 0 20px 100px; /* Extra padding for bottom nav */
  text-align: center;
}
.page-profil .version {
  font-size: 10px;
  color: #a79c8f;
  margin-bottom: 8px;
}
.page-profil .disclaimer {
  font-size: 9px;
  color: #a79c8f;
  line-height: 1.4;
}

/* Bottom navigation lives in src/components/BottomNav.jsx (styles inline in that file). */
`;

/* Skeleton shimmer untuk nilai kartu "Saldo Kamu" yang masih menunggu backend
   — konvensi skeleton Home/Asset/CetakEmas/EmasDigital: bar inline-block
   seukuran teks aslinya supaya layout tidak bergeser. */
function MetricSkeleton({ width = 84, height = 12 }) {
  return <span className="skeleton-bar" style={{ width, height }} aria-hidden="true" />;
}

export default function Profil() {
  const navigate = useNavigate();

  /* Saldo dari GET /api/auth/account-info/. Selama menunggu tampil skeleton;
     kalo request-nya gagal (token expired / offline), angka placeholder di
     bawah tetep tampil. */
  const [account, setAccount] = useState(null);
  /* Statistik all-time (agregat penarikan COMPLETED) dari
     GET /api/auth/balance-statistics/all-time/. */
  const [stats, setStats] = useState(null);
  /* Saldo poin/tiket roulette dari GET /api/roulette/points/ — angka
     "Poin Kamu" (satuan poin, bukan Rupiah). */
  const [points, setPoints] = useState(null);
  /* Statistik kemarin (…/yesterday/) & hari ini (…/today/) — pembanding
     pada baris "(…% bertumbuh sejak kemarin)". */
  const [yesterdayStats, setYesterdayStats] = useState(null);
  const [todayStats, setTodayStats] = useState(null);
  /* Statistik downline per level dari GET /api/auth/downline-stats/ —
     sumber "Total Komisi" (hanya tingkat 1-3). */
  const [downlineStats, setDownlineStats] = useState(null);
  /* Live "Harga Emas Hari Ini" dari goldPriceApi.js. */
  const [goldPrice, setGoldPrice] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  /* Flag loading awal kartu "Saldo Kamu": true sampai request masing-masing
     selesai — sukses mengisi angka, gagal jatuh ke angka mockup; dua-duanya
     mengakhiri skeleton. Refresh manual tidak menghidupkan skeleton lagi,
     indikatornya cukup ikon refresh yang berputar. */
  const [accountLoading, setAccountLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pointsLoading, setPointsLoading] = useState(true);
  const [growthLoading, setGrowthLoading] = useState(true);
  const [commissionLoading, setCommissionLoading] = useState(true);

  const loadAccount = useCallback(async () => {
    try {
      const data = await getAccountInfo();
      if (data) setAccount(data);
    } catch {
      /* biarin angka placeholder */
    } finally {
      setAccountLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const data = await getBalanceStatistics('all-time');
      if (data) setStats(data);
    } catch {
      /* biarin angka placeholder */
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadPoints = useCallback(async () => {
    try {
      const data = await getRoulettePoints();
      if (data) setPoints(data.tickets);
    } catch {
      /* biarin angka placeholder */
    } finally {
      setPointsLoading(false);
    }
  }, []);

  /* Baris "(…% bertumbuh sejak kemarin)" butuh statistik kemarin DAN hari ini
     — satu loader menunggu keduanya (allSettled) supaya skeleton baru berhenti
     setelah kedua angka punya kesempatan landed. */
  const loadGrowthStats = useCallback(async () => {
    const [yesterday, today] = await Promise.allSettled([
      getBalanceStatistics('yesterday'),
      getBalanceStatistics('today'),
    ]);
    if (yesterday.status === 'fulfilled' && yesterday.value) setYesterdayStats(yesterday.value);
    if (today.status === 'fulfilled' && today.value) setTodayStats(today.value);
    setGrowthLoading(false);
  }, []);

  const loadDownlineStats = useCallback(async () => {
    try {
      const data = await getDownlineStats();
      if (data) setDownlineStats(data);
    } catch {
      /* biarin angka placeholder */
    } finally {
      setCommissionLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccount();
    loadStats();
    loadPoints();
    loadGrowthStats();
    loadDownlineStats();
  }, [loadAccount, loadStats, loadPoints, loadGrowthStats, loadDownlineStats]);

  /* Live gold price — a cached value paints instantly, then the free public
     sources refresh it in the background (see goldPriceApi.js). */
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

  /* Notification badge — jumlah notifikasi baru: transaksi pending yang masuk
     setelah kunjungan terakhir ke MenuNotifikasi (patokan notifSeen) dari feed
     rolling 7 hari yang sama dengan Home. Nol = badge-nya nggak dirender. */
  const [seenAt] = useState(getSeenAt);
  const { items: notificationItems } = useTransactionFeed(NOTIFICATION_TYPES, {
    startDate: startDateParam(),
  });
  const newNotificationCount = notificationItems.filter(
    (trx) => statusKind(trx.status) === 'pending' && isUnseen(trx, seenAt)
  ).length;

  /* Tombol refresh: tarik ulang saldo, statistik & harga emas tanpa reload
     halaman. fetchGoldPrice selalu ambil nilai live (bukan cache). */
  const refresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadAccount(),
      loadStats(),
      loadPoints(),
      loadGrowthStats(),
      loadDownlineStats(),
      fetchGoldPrice().then((live) => {
        if (live) setGoldPrice(live);
      }),
    ]);
    setRefreshing(false);
  };

  /* "Promo & Info" banner slider — same banners and behavior as the Home
     "Event & Promosi" row: auto-advances every 4s; touching/clicking pauses it,
     releasing resumes with a fresh timer from the slide the user left on. */
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

  const balanceText = account ? formatRupiah(account.balance) : 'Rp 70.934';
  const depositText = account ? formatRupiah(account.balance_deposit) : 'Rp 70.934';
  /* "Poin Kamu" — saldo poin/tiket roulette (GET /api/roulette/points/). */
  const pointsText =
    points !== null
      ? `${Math.round(Number(points) || 0).toLocaleString('id-ID')} Poin`
      : '1.250 Poin';

  /* Gold banner: live values once the public sources respond, mockup values
     otherwise (same treatment as the Home/AsetSaya cards). */
  const hasLivePrice = Number.isFinite(goldPrice?.pricePerGram);
  const pricePerGram = hasLivePrice ? goldPrice.pricePerGram : FALLBACK_PRICE_PER_GRAM;
  const changePercent =
    hasLivePrice && Number.isFinite(goldPrice.changePercent) ? goldPrice.changePercent : FALLBACK_CHANGE_PERCENT;
  const trendUp = changePercent >= 0;
  const priceText = hasLivePrice ? `${formatIDR(pricePerGram)} / gram` : 'Rp 2.569.270 / gram';

  /* "Saldo Emas Digital" = BALANCE HOLD (dompet emas digital, Rupiah) dan
     "Berat Emas" = konversinya ke gram memakai harga emas per gram yang sama
     dengan banner "Harga Emas Hari Ini" — angka gram yang sama dipakai di
     menu Cetak Emas. Mockup dipakai sampai saldo landed. */
  const holdValue = account ? Number(account.balance_hold) || 0 : null;
  const gramValue = holdValue === null ? null : holdValue / pricePerGram;
  const goldValueText = holdValue === null ? 'Rp 3.512.870' : formatRupiah(holdValue);
  const gramText =
    gramValue === null
      ? '1,367 gram'
      : `${gramValue.toLocaleString('id-ID', { maximumFractionDigits: 3 })} gram`;
  /* "Total Penarikan" — akumulasi penarikan COMPLETED (all-time). */
  const withdrawText = stats ? formatRupiah(stats.total_withdraw_completed) : 'Rp 1.850.000';
  /* "Total Komisi" — akumulasi komisi undangan (profit + purchase) tingkat
     1-3 saja, sama dengan "Total Bonus" di halaman Tim Afiliasi. Mockup
     dipakai sampai data landed. */
  const commissionTotal = downlineStats
    ? (downlineStats.levels || [])
        .filter((item) => TEAM_LEVELS.includes(item.level))
        .reduce(
          (sum, item) =>
            sum + Number(item.profit_commission_amount || 0) + Number(item.purchase_commission_amount || 0),
          0
        )
    : null;
  const commissionText = commissionTotal === null ? 'Rp 85.000' : formatRupiah(commissionTotal);
  /* "(…% bertumbuh sejak kemarin)" — persen perubahan income HARI INI (semua
     jenis pemasukan) dibanding kemarin: (hari ini − kemarin) / kemarin,
     konvensi yang sama dengan baris change di Home. Nilai mockup dipakai
     sampai kedua statistik landed. */
  const incomeToday = todayStats ? Number(todayStats.total_income) || 0 : null;
  const incomeYesterday = yesterdayStats ? Number(yesterdayStats.total_income) || 0 : null;
  const growthPercent =
    incomeToday === null || incomeYesterday === null
      ? FALLBACK_GROWTH_PERCENT
      : incomeYesterday > 0
        ? ((incomeToday - incomeYesterday) / incomeYesterday) * 100
        : incomeToday > 0
          ? 100
          : 0;
  const growthText = `(${formatPercentID(Math.abs(growthPercent))} ${
    growthPercent >= 0 ? 'bertumbuh sejak kemarin' : 'turun sejak kemarin'
  })`;

  return (
    <div className="page-profil">
      <style>{styles}</style>
      <div>
              <section id="section-header" className="app-section">
                <div className="app-container header-container">
                  <img src={img_1} alt="Jelajah Emas" className="logo" />
                  <div className="header-actions">
                    <button className="icon-btn" onClick={(e) => { e.preventDefault(); navigate('/index/support/tentang-kami'); }}>
                      <img src={img_2} alt="Tentang Kami" />
                    </button>
                    <button className="icon-btn" onClick={(e) => { e.preventDefault(); navigate('/index/profil/notifikasi'); }}>
                      <img src={img_3} alt="Notifications" />
                      {newNotificationCount > 0 && <span className="badge">{newNotificationCount}</span>}
                    </button>
                  </div>
                </div>
              </section>
              <section id="section-features" className="app-section">
                <div className="app-container features-container">
                  <h2 className="section-title">Fitur Lainnya</h2>
                  <div className="features-grid">
                    <Link to="/index/transactions/isi-ulang" className="feature-item">
                      <img src={img_4} alt="Isi Ulang" />
                      <span>Isi Ulang</span>
                    </Link>
                    <Link to="/index/rewards/vip" className="feature-item">
                      <img src={img_5} alt="VIP" />
                      <span>VIP</span>
                    </Link>
                    <Link to="/index/transactions/tarik-dana-01" className="feature-item">
                      <img src={img_6} alt="Tarik Dana" />
                      <span>Tarik Dana</span>
                    </Link>
                    <Link to="/index/affiliate/tim-afiliasi" className="feature-item">
                      <img src={img_7} alt="Tim/Afiliasi" />
                      <span>Tim/Afiliasi</span>
                    </Link>
                    <Link to="/index/assets/emas-digital" className="feature-item">
                      <img src={img_8} alt="Emas Digital" />
                      <span>Emas Digital</span>
                    </Link>
                    <Link to="/index/rewards/absen-harian" className="feature-item">
                      <img src={img_9} alt="Absen" />
                      <span>Absen</span>
                    </Link>
                    <Link to="/index/rewards/redeem-kode" className="feature-item">
                      <img src={img_10} alt="Redeem Kode" />
                      <span>Redeem Kode</span>
                    </Link>
                    <Link to="/index/rewards/misi" className="feature-item">
                      <img src={img_11} alt="Misi" />
                      <span>Misi</span>
                    </Link>
                  </div>
                  <div className="features-actions">
                    <Link to="/index/support/hubungi-cs" className="action-btn">
                      <img src={img_12} alt="Hubungi CS" />
                      <span>Hubungi CS</span>
                    </Link>
                    <Link to="/index/transactions/riwayat-transaksi" className="action-btn">
                      <img src={img_13} alt="Riwayat Transaksi" />
                      <span>Riwayat Transaksi</span>
                    </Link>
                  </div>
                </div>
              </section>
              <section id="section-gold-price" className="app-section">
                <div className="app-container gold-price-container">
                  <div className="gold-banner">
                    <div className="gold-banner-content" style={{ backgroundImage: `url(${img_29})` }}>
                      <img src={img_14} alt="Gold Coin" className="gold-coin" />
                      <div className="gold-info">
                        <span className="gold-label">Harga Emas Hari Ini</span>
                        <span className="gold-price">{priceText}</span>
                      </div>
                      <div className="gold-change">
                        <img src={trendUp ? img_34 : img_15} alt={trendUp ? 'Up' : 'Down'} />
                        <span className={trendUp ? 'positive' : ''}>{formatPercentID(Math.abs(changePercent))}</span>
                      </div>
                    </div>
                    <button className="gold-btn" onClick={(e) => { e.preventDefault(); navigate('/index/assets/asset-01'); }}>Lihat penawarannya</button>
                  </div>
                </div>
              </section>
              <section id="section-balance" className="app-section">
                <div className="app-container balance-container">
                  <div className="balance-header">
                    <h2 className="section-title">Saldo Kamu</h2>
                    <Link to="/index/transactions/riwayat-transaksi" className="view-all">
                      Lihat Semua
                      <img src={img_16} alt="Arrow Right" />
                    </Link>
                  </div>
                  <div className="balance-card" style={{ backgroundImage: `url(${img_30})` }}>
                    <div className="balance-card-top">
                      <div className="balance-card-title">
                        Saldo Tersedia<br />
                        {growthLoading ? (
                          <MetricSkeleton width={170} height={12} />
                        ) : (
                          <span className={growthPercent >= 0 ? 'text-green' : 'text-red'}>{growthText}</span>
                        )}
                      </div>
                      <button
                        className="refresh-btn"
                        onClick={refresh}
                        disabled={refreshing}
                        aria-label="Segarkan saldo"
                      >
                        <img src={img_17} alt="Refresh" className={refreshing ? 'is-spinning' : ''} />
                      </button>
                    </div>
                    <div className="main-balance">
                      <span className="amount">
                        {accountLoading ? <MetricSkeleton width={130} height={24} /> : showBalance ? balanceText : '••••••'}
                      </span>
                      <button
                        className="eye-btn"
                        onClick={() => setShowBalance((visible) => !visible)}
                        aria-label={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
                      >
                        <img src={img_18} alt="Toggle Visibility" />
                      </button>
                    </div>
                    <div className="balance-grid">
                      <div className="balance-item">
                        <span className="item-label">Saldo Isi Ulang</span>
                        <span className="item-value">
                          {accountLoading ? <MetricSkeleton width={72} height={12} /> : depositText}
                        </span>
                      </div>
                      <div className="balance-item">
                        <span className="item-label">Saldo Emas Digital</span>
                        <span className="item-value">
                          {accountLoading ? <MetricSkeleton width={80} height={12} /> : goldValueText}
                        </span>
                      </div>
                      <div className="balance-item">
                        <span className="item-label">Berat Emas</span>
                        <span className="item-value">
                          {accountLoading ? <MetricSkeleton width={72} height={12} /> : gramText}
                        </span>
                      </div>
                      <div className="balance-item">
                        <span className="item-label">Poin Kamu</span>
                        <span className="item-value">
                          {pointsLoading ? <MetricSkeleton width={72} height={12} /> : pointsText}
                        </span>
                      </div>
                      <div className="balance-item">
                        <span className="item-label">Total Penarikan</span>
                        <span className="item-value">
                          {statsLoading ? <MetricSkeleton width={84} height={12} /> : withdrawText}
                        </span>
                      </div>
                      <div className="balance-item">
                        <span className="item-label">Total Komisi</span>
                        <span className="item-value">
                          {commissionLoading ? <MetricSkeleton width={68} height={12} /> : commissionText}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-promo" className="app-section">
                <div className="app-container promo-container">
                  <h2 className="section-title">Promo &amp; Info</h2>
                  <div className="scroll-row hide-scrollbar" ref={promoRowRef}>
                    <div className="promo-card">
                      <img src={img_31} alt="Banner Promo 1" />
                    </div>
                    <div className="promo-card">
                      <img src={img_32} alt="Banner Promo 2" />
                    </div>
                    <div className="promo-card">
                      <img src={img_33} alt="Banner Promo 3" />
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-account" className="app-section">
                <div className="app-container sub-section-container">
                  <h3 className="sub-section-title">Akun</h3>
                  <div className="icon-grid">
                    <Link to="/index/profil/edit" className="icon-item">
                      <img src={img_19} alt="Edit Profil" />
                      <span>Edit Profil</span>
                    </Link>
                    <Link to="/index/profil/kartu-bank" className="icon-item">
                      <img src={img_20} alt="Rekening Bank" />
                      <span>Rekening Bank</span>
                    </Link>
                    <Link to="/index/profil/setelan" className="icon-item">
                      <img src={img_21} alt="Setelan" />
                      <span>Setelan</span>
                    </Link>
                    <Link to="/index/landing" className="icon-item">
                      <img src={img_22} alt="Unduh Aplikasi" />
                      <span>Unduh Aplikasi</span>
                    </Link>
                  </div>
                </div>
              </section>
              <section id="section-help" className="app-section">
                <div className="app-container sub-section-container">
                  <h3 className="sub-section-title">Bantuan &amp; Info</h3>
                  <div className="icon-grid">
                    <Link to="/index/support/pertanyaan-umum" className="icon-item">
                      <img src={img_23} alt="Pusat Bantuan" />
                      <span>Pusat Bantuan</span>
                    </Link>
                    <Link to="/index/support/hubungi-cs" className="icon-item">
                      <img src={img_24} alt="Hubungi CS" />
                      <span>Hubungi CS</span>
                    </Link>
                    <Link to="/index/support/tentang-kami" className="icon-item">
                      <img src={img_25} alt="Tentang Kami" />
                      <span>Tentang Kami</span>
                    </Link>
                    <Link to="/index/support/syarat-dan-ketentuan" className="icon-item">
                      <img src={img_26} alt="Syarat & Ketentuan" />
                      <span>Syarat &amp;<br />Ketentuan</span>
                    </Link>
                  </div>
                </div>
              </section>
              <section id="section-others" className="app-section">
                <div className="app-container sub-section-container">
                  <h3 className="sub-section-title">Lainnya</h3>
                  <div className="icon-grid">
                    <Link to="/index/profil/beri-rating" className="icon-item">
                      <img src={img_27} alt="Beri Rating" />
                      <span>Beri Rating</span>
                    </Link>
                    <Link to="/index/auth/login" className="icon-item danger" onClick={() => authSession.clear()}>
                      <img src={img_28} alt="Keluar" />
                      <span>Keluar</span>
                    </Link>
                  </div>
                </div>
              </section>
              <section id="section-footer-info" className="app-section">
                <div className="app-container footer-info-container">
                  <p className="version">JelajahEmas versi 1.0.0</p>
                  <p className="disclaimer">
                    JelajahEmas terdaftar dan diawasi oleh Otoritas Jasa Keuangan (OJK) &amp; Badan Pengawas Perdagangan Berjangka Komoditi (BAPPEBTI). Investasi emas mengandung risiko fluktuasi harga pasar.
                  </p>
                </div>
              </section>
              <BottomNav active="profil" />
            </div>

    </div>
  );
}
