/* ============================================================================
   AsetSaya.jsx — single-file implementation of the my-assets views.
   All steps of this flow live in this one file; the <AsetSaya step={n} />
   element passed by App.jsx selects the active step. URL per step:
     1 -> /assets/aset-saya-01
     2 -> /assets/aset-saya-02
   Data: GET /api/investments/ (the user's plans) via src/lib/investmentsApi.js,
   plus the live "Harga Emas Hari Ini" card via src/lib/goldPriceApi.js.
   Step 1 keeps its empty-state design while no plans exist and lists the plan
   cards otherwise; step 2 always lists them.
   ============================================================================ */

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NotifCard from '../../../components/NotifCard.jsx';
/* GET /api/investments/ — the logged-in user's investment plans. */
import { listAllInvestments } from '../../../lib/investmentsApi.js';
import { formatRupiah, parseDate } from '../../../lib/transactionFormat.js';
/* Live "Harga Emas Hari Ini" — free public sources, cached 5 min. */
import { fetchGoldPrice, getCachedGoldPrice, formatIDR, formatPercentID } from '../../../lib/goldPriceApi.js';
import img_1 from '../../../assets/images/141_595.svg';
import img_2 from '../../../assets/images/6e7afc8beed777ee8ad0a014432f7422da8ce4ac.png';
import img_3 from '../../../assets/images/120_3286.svg';

/* Step 1 imports (renamed to avoid collisions with other steps) */
import S1_img_4 from '../../../assets/images/3a72c27da1899801de05252ae1048c69d8c58ce0.png';
import S1_img_5 from '../../../assets/images/62_921.svg';

/* Step 2 imports (renamed to avoid collisions with other steps) */
import S2_img_4 from '../../../assets/images/141_740.svg';
import S2_img_5 from '../../../assets/images/141_744.svg';
import img_4 from '../../../assets/images/d35f294fb1a21fb0aa4f326dc1672ebf0f14686d.png';


/* ================= Shared investment-plan helpers (GET /api/investments/) ================= */

/* Static mockup values kept until the live gold-price sources respond. */
const FALLBACK_PRICE_PER_GRAM = 2569270;
const FALLBACK_CHANGE_PERCENT = 1.01;

const INVESTMENT_STATUS_LABELS = {
  ACTIVE: 'Aktif',
  COMPLETED: 'Selesai',
  EXPIRED: 'Kedaluwarsa',
  CANCELLED: 'Dibatalkan',
};

function investmentStatusLabel(status) {
  return INVESTMENT_STATUS_LABELS[String(status || '').toUpperCase()] || '—';
}

/* "Klaim Harian" / "Klaim setelah 120 hari" — mirrors the claim_reset_mode
   mapping used by the asset-plan detail page. */
function investmentFrequency(investment) {
  const mode = investment.claim_reset_mode || 'after_purchase';
  if (mode === 'at_00' || mode === 'at_custom') return 'Klaim Harian';
  return `Klaim setelah ${Number(investment.duration_days) || 0} hari`;
}

/* "12 Sep 2026, 08:00 WIB" — '—' when the timestamp is missing. */
function formatClaimTime(iso) {
  const date = parseDate(iso);
  if (!iso || Number.isNaN(date.getTime())) return '—';
  const day = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  return `${day}, ${time} WIB`;
}

/* Days elapsed since purchase, capped at the plan duration (same rule as the
   backend's days_passed property). */
function investmentDaysPassed(investment) {
  const duration = Number(investment.duration_days) || 0;
  const created = parseDate(investment.created_at).getTime();
  if (!Number.isFinite(created)) return 0;
  const elapsed = Math.floor((Date.now() - created) / 86400000);
  return Math.max(0, Math.min(elapsed, duration));
}

function investmentProgressPercent(investment) {
  const duration = Number(investment.duration_days) || 0;
  if (duration <= 0) return 0;
  return Math.min(100, Math.round((investmentDaysPassed(investment) / duration) * 100));
}

/* "Total Aset Emas" cards count the quantity of still-ACTIVE plans. */
function totalActiveQuantity(investments) {
  return investments
    .filter((investment) => investment.status === 'ACTIVE')
    .reduce((sum, investment) => sum + (Number(investment.quantity) || 0), 0);
}

/* Both steps fetch the same user investments; newest first. */
function useInvestments() {
  const [investments, setInvestments] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    listAllInvestments()
      .then((list) => {
        if (active) setInvestments([...list].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)));
      })
      .catch((err) => {
        if (active) setError(err?.message || 'Gagal memuat rencana investasi.');
      });
    return () => {
      active = false;
    };
  }, []);
  return { investments, error };
}

/* Live gold price — a cached value paints instantly, then the free public
   sources refresh it in the background (see goldPriceApi.js). */
function useLiveGoldPrice() {
  const [goldPrice, setGoldPrice] = useState(null);
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
  return goldPrice;
}

/* One plan card — shared by both steps. Styled by the .product-card rules
   scoped under each page wrapper (.page-aset-saya-01 / -02). */
function InvestmentCard({ investment }) {
  const isActive = investment.status === 'ACTIVE';
  const daysPassed = investmentDaysPassed(investment);
  const progress = investmentProgressPercent(investment);
  const golongan =
    investment.product_golongan && investment.product_golongan !== '-' ? investment.product_golongan : '';
  const rawSpec = (investment.product_specification || '').trim();
  const spec = rawSpec && rawSpec !== '-' ? rawSpec : golongan;

  return (
    <div className="product-card">
      <div className="card-header">
        <div className="product-icon" />
        <div className="product-title-group">
          <span className="product-name">{investment.product_name}</span>
          {spec ? <span className="product-spec">{spec}</span> : null}
        </div>
        <div className={`status-badge${isActive ? '' : ' inactive'}`}>{investmentStatusLabel(investment.status)}</div>
      </div>
      <div className="info-list">
        <div className="info-row">
          <span className="info-label">Pembagian / Periode</span>
          <span className="info-value">{formatRupiah(investment.daily_profit)} / hari</span>
        </div>
        <div className="info-row">
          <span className="info-label">Frekuensi</span>
          <span className="info-value">{investmentFrequency(investment)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Sumber Dana</span>
          <span className="info-value">Saldo JelajahEmas</span>
        </div>
        <div className="info-row">
          <span className="info-label">Total Terkumpul</span>
          <span className="info-value">{formatRupiah(investment.total_claimed_profit)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Pembagian selanjutnya</span>
          <span className="info-value">{formatClaimTime(investment.next_claim_time_calculated)}</span>
        </div>
      </div>
      <div className="progress-section">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">{`${daysPassed} dari ${Number(investment.duration_days) || 0} hari`}</span>
      </div>
      <Link to="/assets/emas-digital" className="card-link">
        <span>Lihat aset digital saya</span>
        <img src={S2_img_4} alt="Arrow Right" />
      </Link>
    </div>
  );
}


/* ================= Step 1 — /assets/aset-saya-01 (was AsetSaya01.jsx) ================= */

const AsetSaya01Styles = `
/* Scoped styles for AsetSaya01 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-aset-saya-01 to isolate this page. */

.page-aset-saya-01, .page-aset-saya-01 * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.page-aset-saya-01 {
    font-family: 'Inter', sans-serif;
    background-color: #fffbf4;
    background-image: 
        radial-gradient(circle at 76.9% 178.5%, rgba(255, 201, 60, 0.28) 0%, rgba(255, 201, 60, 0) 70%),
        radial-gradient(circle at 111.1% 142.8%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 70%),
        radial-gradient(circle at 90.9% 125%, rgba(255, 159, 28, 0.38) 0%, rgba(255, 159, 28, 0) 70%);
    background-attachment: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  width: 100%;
}

.page-aset-saya-01 section {
    width: 100%;
    max-width: 100%;
    position: relative;
}

/* Keep the content wrapper full-width so the page never collapses into a
   narrow centered column on wide screens. */
.page-aset-saya-01 > div {
  width: 100%;
}

/* ---- inline section styles ---- */

/* CSS for section section:Top */
.page-aset-saya-01 .top-container {
    background: radial-gradient(circle at 41.6% 50%, #241c16 0%, #1a1410 55%, #120d09 100%);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.page-aset-saya-01 .header {
    display: flex;
    align-items: center;
    gap: 14px;
}

.page-aset-saya-01 .back-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background-color: rgba(255, 249, 242, 0.12);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
}

.page-aset-saya-01 .back-btn:hover {
    background-color: rgba(255, 249, 242, 0.2);
}

.page-aset-saya-01 .header-title {
    color: #fff9f2;
    font-size: 16px;
    font-weight: 600;
}

.page-aset-saya-01 .asset-summary-wrapper {
    padding-bottom: 12px;
}

.page-aset-saya-01 .asset-summary {
    background-color: rgba(255, 249, 242, 0.08);
    border-radius: 14px;
    padding: 13px 14px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.page-aset-saya-01 .asset-label {
    color: rgba(255, 249, 242, 0.5);
    font-size: 12px;
}

.page-aset-saya-01 .asset-value {
    color: #fff9f2;
    font-size: 18px;
    font-weight: 700;
    margin-top: 2px;
}

.page-aset-saya-01 .asset-fiat {
    color: rgba(255, 249, 242, 0.45);
    font-size: 12px;
    margin-top: 2px;
}

/* CSS for section section:PriceCard */
.page-aset-saya-01 #section-price-card {
    margin-top: 20px; /* Sit below the dark header instead of overlapping it */
    z-index: 10;
}

.page-aset-saya-01 .price-card-container {
    padding: 0 20px;
}

.page-aset-saya-01 .price-card {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 16px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.08);
}

.page-aset-saya-01 .gold-coin {
    width: 45px;
    height: 44px;
    object-fit: contain;
}

.page-aset-saya-01 .price-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-grow: 1;
}

.page-aset-saya-01 .price-label {
    color: #a79c8f;
    font-size: 12px;
}

.page-aset-saya-01 .price-value {
    color: #1a1410;
    font-size: 14px;
    font-weight: 700;
}

.page-aset-saya-01 .price-change {
    display: flex;
    align-items: center;
    gap: 4px;
}

.page-aset-saya-01 .change-value {
    color: #e24c4c;
    font-size: 12px;
    font-weight: 600;
}

/* CSS for section section:EmptyState */
.page-aset-saya-01 .empty-state-container {
    padding: 60px 20px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.page-aset-saya-01 .illustration-wrapper {
    margin-bottom: 24px;
}

.page-aset-saya-01 .illustration {
    width: 120px;
    height: 133px;
    object-fit: contain;
}

.page-aset-saya-01 .text-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;
}

.page-aset-saya-01 .empty-title {
    color: #1a1410;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
}

.page-aset-saya-01 .empty-subtitle {
    color: #a79c8f;
    font-size: 13px;
    line-height: 1.5;
    max-width: 280px;
}

.page-aset-saya-01 .primary-btn {
    background-color: #f1b04a;
    color: #1a1410;
    border: none;
    border-radius: 14px;
    padding: 14px 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: opacity 0.2s ease;
    width: auto;
}

.page-aset-saya-01 .primary-btn:hover {
    opacity: 0.9;
}

/* ---- Step 1 investment-plan list (GET /api/investments/) ---- */

.page-aset-saya-01 .investments-container {
    padding: 22px 20px 40px;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.page-aset-saya-01 .status-text {
    color: #a79c8f;
    font-size: 13px;
    line-height: 1.5;
    text-align: center;
}

.page-aset-saya-01 .error-text {
    color: #e24c4c;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
}

.page-aset-saya-01 .product-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
}

.page-aset-saya-01 .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 14px;
    border-bottom: 1px solid #efe7dc;
}

.page-aset-saya-01 .product-icon {
    width: 34px;
    height: 34px;
    background-color: #f6f1e9;
    border: 1px solid rgba(26, 20, 16, 0.22);
    border-radius: 9px;
}

.page-aset-saya-01 .product-title-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.page-aset-saya-01 .product-name {
    color: #1a1410;
    font-size: 14px;
    font-weight: 700;
}

.page-aset-saya-01 .product-spec {
    color: #a79c8f;
    font-size: 12px;
}

.page-aset-saya-01 .status-badge {
    margin-left: auto;
    background-color: rgba(63, 166, 107, 0.14);
    color: #2f8f5a;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 10px;
}

.page-aset-saya-01 .status-badge.inactive {
    background-color: rgba(26, 20, 16, 0.08);
    color: #a79c8f;
}

.page-aset-saya-01 .info-list {
    display: flex;
    flex-direction: column;
    padding-top: 14px;
}

.page-aset-saya-01 .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
}

.page-aset-saya-01 .info-label {
    color: #a79c8f;
    font-size: 12px;
}

.page-aset-saya-01 .info-value {
    color: #1a1410;
    font-size: 12px;
    font-weight: 600;
}

.page-aset-saya-01 .progress-section {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.page-aset-saya-01 .progress-bar-bg {
    width: 100%;
    height: 6px;
    background-color: #f6f1e9;
    border-radius: 4px;
    overflow: hidden;
}

.page-aset-saya-01 .progress-bar-fill {
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
    border-radius: 4px;
}

.page-aset-saya-01 .progress-text {
    color: #a79c8f;
    font-size: 12px;
}

.page-aset-saya-01 .card-link {
    margin-top: 10px;
    padding-top: 12px;
    border-top: 1px solid #efe7dc;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    text-decoration: none;
}

.page-aset-saya-01 .card-link span {
    color: #e8790c;
    font-size: 12px;
    font-weight: 600;
}

.page-aset-saya-01 .add-plan-btn {
    background: transparent;
    border: 1px dashed rgba(26, 20, 16, 0.25);
    border-radius: 14px;
    padding: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    width: 100%;
}

.page-aset-saya-01 .add-plan-btn span {
    color: #e8790c;
    font-size: 14px;
    font-weight: 600;
}
`;

function AsetSaya01() {
  const navigate = useNavigate();
  const { investments, error } = useInvestments();
  const goldPrice = useLiveGoldPrice();

  const loading = investments === null && !error;
  const hasInvestments = Boolean(investments && investments.length > 0);
  const hasLivePrice = Number.isFinite(goldPrice?.pricePerGram);
  const pricePerGram = hasLivePrice ? goldPrice.pricePerGram : FALLBACK_PRICE_PER_GRAM;
  const changePercent =
    hasLivePrice && Number.isFinite(goldPrice.changePercent) ? goldPrice.changePercent : FALLBACK_CHANGE_PERCENT;
  const trendUp = changePercent >= 0;
  const gramTotal = totalActiveQuantity(investments || []);

  return (
    <div className="page-aset-saya-01">
      <style>{AsetSaya01Styles}</style>
      <div>
              <section id="section-top">
                <div className="top-container">
                  <header className="header">
                    <button className="back-btn" aria-label="Kembali" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                      <img src={img_1} alt="Back Icon" />
                    </button>
                    <h1 className="header-title">Kumpulkan Aset Anda</h1>
                  </header>
                  <div className="asset-summary-wrapper">
                    <div className="asset-summary">
                      <span className="asset-label">Total Aset Emas Kamu</span>
                      <span className="asset-value">{gramTotal.toLocaleString('id-ID')} gram</span>
                      <span className="asset-fiat">≈ {formatRupiah(gramTotal * pricePerGram)}</span>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-price-card">
                <div className="price-card-container">
                  <div className="price-card" style={{ backgroundImage: `url(${img_4})` }}>
                    <img src={img_2} alt="Gold Coin" className="gold-coin" />
                    <div className="price-info">
                      <span className="price-label">Harga Emas Hari Ini</span>
                      <span className="price-value">{hasLivePrice ? `${formatIDR(pricePerGram)} / gram` : 'Rp 2.569.270 / gram'}</span>
                    </div>
                    <div className="price-change">
                      <img src={img_3} alt={trendUp ? 'Up Arrow' : 'Down Arrow'} style={trendUp ? undefined : { transform: 'rotate(180deg)' }} />
                      <span className="change-value">{trendUp ? '+' : '-'} {formatPercentID(Math.abs(changePercent))}</span>
                    </div>
                  </div>
                </div>
              </section>
              {loading && (
              <section id="section-investments">
                <div className="investments-container">
                  <p className="status-text">Memuat rencana investasi...</p>
                </div>
              </section>
              )}
              {!loading && error && (
              <section id="section-investments">
                <div className="investments-container">
                  <NotifCard variant="error" title="Gagal Memuat Rencana Investasi" description={error} />
                </div>
              </section>
              )}
              {!loading && !error && !hasInvestments && (
              <section id="section-empty-state">
                <div className="empty-state-container">
                  <div className="illustration-wrapper">
                    <img src={S1_img_4} alt="Belum Ada Rencana Investasi" className="illustration" />
                  </div>
                  <div className="text-content">
                    <h2 className="empty-title">Belum Ada Rencana Investasi</h2>
                    <p className="empty-subtitle">Buat rencana investasi emas rutin pertama kamu sekarang untuk mulai membangun aset secara konsisten.</p>
                  </div>
                  <button className="primary-btn" onClick={(e) => { e.preventDefault(); navigate('/assets/asset-01'); }}>
                    <img src={S1_img_5} alt="Plus Icon" />
                    <span>Buat Rencana Investasi</span>
                  </button>
                </div>
              </section>
              )}
              {!loading && !error && hasInvestments && (
              <section id="section-investments">
                <div className="investments-container">
                  {investments.map((investment) => (
                    <InvestmentCard key={investment.id} investment={investment} />
                  ))}
                  <button className="add-plan-btn" onClick={(e) => { e.preventDefault(); navigate('/assets/asset-01'); }}>
                    <img src={S2_img_5} alt="Plus" />
                    <span>Tambah Rencana Lain</span>
                  </button>
                </div>
              </section>
              )}
            </div>

    </div>
  );
}

/* ================= Step 2 — /assets/aset-saya-02 (was AsetSaya02.jsx) ================= */

const AsetSaya02Styles = `
/* Scoped styles for AsetSaya02 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-aset-saya-02 to isolate this page. */

.page-aset-saya-02, .page-aset-saya-02 * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-aset-saya-02 {
  min-height: 100vh;
  width: 100%;
}

.page-aset-saya-02 {
  font-family: 'Inter', sans-serif;
  background-color: #fffbf4;
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
}

/* Keep the content wrapper full-width so the page never collapses into a
   narrow centered column on wide screens. */
.page-aset-saya-02 > div {
  width: 100%;
}

.page-aset-saya-02::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 400px;
  background: radial-gradient(circle at 50% 100%, rgba(255, 201, 60, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
  z-index: 0;
}

/* ---- inline section styles ---- */

/* CSS for section section:TopHeader */
.page-aset-saya-02 #top-header {
    width: 100%;
    position: relative;
    z-index: 1;
  }
  .page-aset-saya-02 .top-header-bg {
    background: radial-gradient(circle at 41.6% 50%, #241c16 0%, #1a1410 55%, #120d09 100%);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .page-aset-saya-02 .header-nav {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .page-aset-saya-02 .back-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background-color: rgba(255, 249, 242, 0.12);
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .page-aset-saya-02 .header-title {
    color: #fff9f2;
    font-size: 16px;
    font-weight: 600;
  }
  .page-aset-saya-02 .total-asset-card {
    background-color: rgba(255, 249, 242, 0.08);
    border-radius: 14px;
    padding: 13px 14px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .page-aset-saya-02 .asset-label {
    color: rgba(255, 249, 242, 0.5);
    font-size: 12px;
  }
  .page-aset-saya-02 .asset-value {
    color: #fff9f2;
    font-size: 20px;
    font-weight: 700;
    margin-top: 2px;
  }
  .page-aset-saya-02 .asset-fiat {
    color: rgba(255, 249, 242, 0.45);
    font-size: 12px;
    margin-top: 2px;
  }

/* CSS for section section:PriceBanner */
.page-aset-saya-02 #price-banner {
    padding: 0 20px;
    margin-top: 20px; /* Sit below the dark header instead of overlapping it */
    position: relative;
    z-index: 10;
  }
  .page-aset-saya-02 .price-card {
    background-size: cover;
    background-position: center;
    border-radius: 16px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  .page-aset-saya-02 .coin-icon {
    width: 45px;
    height: 44px;
    object-fit: contain;
  }
  .page-aset-saya-02 .price-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }
  .page-aset-saya-02 .price-label {
    color: #a79c8f;
    font-size: 12px;
  }
  .page-aset-saya-02 .price-value {
    color: #1a1410;
    font-size: 14px;
    font-weight: 700;
  }
  .page-aset-saya-02 .price-change {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .page-aset-saya-02 .change-value {
    color: #e24c4c;
    font-size: 12px;
    font-weight: 700;
  }

/* CSS for section section:MainContent */
.page-aset-saya-02 #main-content {
    padding: 22px 20px 40px 20px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    position: relative;
    z-index: 1;
  }
  .page-aset-saya-02 .product-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
  .page-aset-saya-02 .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 14px;
    border-bottom: 1px solid #efe7dc;
  }
  .page-aset-saya-02 .product-icon {
    width: 34px;
    height: 34px;
    background-color: #f6f1e9;
    border: 1px solid rgba(26, 20, 16, 0.22);
    border-radius: 9px;
  }
  .page-aset-saya-02 .product-title-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .page-aset-saya-02 .product-name {
    color: #1a1410;
    font-size: 14px;
    font-weight: 700;
  }
  .page-aset-saya-02 .product-spec {
    color: #a79c8f;
    font-size: 12px;
  }
  .page-aset-saya-02 .status-badge {
    margin-left: auto;
    background-color: rgba(63, 166, 107, 0.14);
    color: #2f8f5a;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 10px;
  }
  .page-aset-saya-02 .info-list {
    display: flex;
    flex-direction: column;
    padding-top: 14px;
  }
  .page-aset-saya-02 .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
  }
  .page-aset-saya-02 .info-label {
    color: #a79c8f;
    font-size: 12px;
  }
  .page-aset-saya-02 .info-value {
    color: #1a1410;
    font-size: 12px;
    font-weight: 600;
  }
  .page-aset-saya-02 .progress-section {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .page-aset-saya-02 .progress-bar-bg {
    width: 100%;
    height: 6px;
    background-color: #f6f1e9;
    border-radius: 4px;
    overflow: hidden;
  }
  .page-aset-saya-02 .progress-bar-fill {
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
    border-radius: 4px;
  }
  .page-aset-saya-02 .progress-text {
    color: #a79c8f;
    font-size: 12px;
  }
  .page-aset-saya-02 .card-link {
    margin-top: 10px;
    padding-top: 12px;
    border-top: 1px solid #efe7dc;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    text-decoration: none;
  }
  .page-aset-saya-02 .card-link span {
    color: #e8790c;
    font-size: 12px;
    font-weight: 600;
  }
  .page-aset-saya-02 .add-plan-btn {
    background: transparent;
    border: 1px dashed rgba(26, 20, 16, 0.25);
    border-radius: 14px;
    padding: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    width: 100%;
  }
  .page-aset-saya-02 .add-plan-btn span {
    color: #e8790c;
    font-size: 14px;
    font-weight: 600;
  }
  .page-aset-saya-02 .status-badge.inactive {
    background-color: rgba(26, 20, 16, 0.08);
    color: #a79c8f;
  }
  .page-aset-saya-02 .status-text {
    color: #a79c8f;
    font-size: 13px;
    line-height: 1.5;
  }
  .page-aset-saya-02 .error-text {
    color: #e24c4c;
    font-size: 12px;
    font-weight: 600;
  }
`;

function AsetSaya02() {
  const navigate = useNavigate();
  const { investments, error } = useInvestments();
  const goldPrice = useLiveGoldPrice();

  const loading = investments === null && !error;
  const hasInvestments = Boolean(investments && investments.length > 0);
  const hasLivePrice = Number.isFinite(goldPrice?.pricePerGram);
  const pricePerGram = hasLivePrice ? goldPrice.pricePerGram : FALLBACK_PRICE_PER_GRAM;
  const changePercent =
    hasLivePrice && Number.isFinite(goldPrice.changePercent) ? goldPrice.changePercent : FALLBACK_CHANGE_PERCENT;
  const trendUp = changePercent >= 0;
  const gramTotal = totalActiveQuantity(investments || []);

  return (
    <div className="page-aset-saya-02">
      <style>{AsetSaya02Styles}</style>
      <div>
              <header id="top-header">
                <div className="top-header-bg">
                  <div className="header-nav">
                    <button className="back-btn" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                      <img src={img_1} alt="Back" />
                    </button>
                    <h1 className="header-title">Kumpulkan Aset Anda</h1>
                  </div>
                  <div className="total-asset-card">
                    <span className="asset-label">Total Aset Emas Kamu</span>
                    <span className="asset-value">{gramTotal.toLocaleString('id-ID')} gram</span>
                    <span className="asset-fiat">≈ {formatRupiah(gramTotal * pricePerGram)}</span>
                  </div>
                </div>
              </header>
              <section id="price-banner">
                <div className="price-card" style={{ backgroundImage: `url(${img_4})` }}>
                  <img src={img_2} alt="Gold Coin" className="coin-icon" />
                  <div className="price-info">
                    <span className="price-label">Harga Emas Hari Ini</span>
                    <span className="price-value">{hasLivePrice ? `${formatIDR(pricePerGram)} / gram` : 'Rp 2.569.270 / gram'}</span>
                  </div>
                  <div className="price-change">
                    <img src={img_3} alt={trendUp ? 'Up' : 'Down'} style={trendUp ? undefined : { transform: 'rotate(180deg)' }} />
                    <span className="change-value">{trendUp ? '+' : '-'} {formatPercentID(Math.abs(changePercent))}</span>
                  </div>
                </div>
              </section>
              <section id="main-content">
                {loading && (
                  <p className="status-text">Memuat rencana investasi...</p>
                )}
                {!loading && error && (
                  <NotifCard variant="error" title="Gagal Memuat Rencana Investasi" description={error} />
                )}
                {!loading && !error && !hasInvestments && (
                  <p className="status-text">Belum ada rencana investasi. Buat rencana pertamamu sekarang.</p>
                )}
                {!loading && !error && hasInvestments && investments.map((investment) => (
                  <InvestmentCard key={investment.id} investment={investment} />
                ))}
                <button className="add-plan-btn" onClick={(e) => { e.preventDefault(); navigate('/assets/asset-01'); }}>
                  <img src={S2_img_5} alt="Plus" />
                  <span>Tambah Rencana Lain</span>
                </button>
              </section>
            </div>

    </div>
  );
}

const STEP_COMPONENTS = { 1: AsetSaya01, 2: AsetSaya02 };

export default function AsetSaya({ step = 1 }) {
  const Step = STEP_COMPONENTS[step] ?? STEP_COMPONENTS[1];
  return <Step />;
}
