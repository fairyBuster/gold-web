/* ============================================================================
   Asset.jsx — single-file implementation of the investment plan & simulation.
   All steps of this flow live in this one file; the <Asset step={n} />
   element passed by App.jsx selects the active step. URL per step:
     1 -> /assets/asset-01
     2 -> /assets/asset-02
   ============================================================================ */

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotifCard from '../../../components/NotifCard.jsx';
import { getProduct, listProducts } from '../../../lib/productsApi.js';
import { formatRupiah } from '../../../lib/transactionFormat.js';
import img_3 from '../../../assets/images/6e7afc8beed777ee8ad0a014432f7422da8ce4ac.png';
import img_4 from '../../../assets/images/120_3286.svg';
import img_5 from '../../../assets/images/50152a965b856a6eb89e7be494cdab9588c66fa7.png';
import img_6 from '../../../assets/images/139_437.svg';
import img_9 from '../../../assets/images/74_478.svg';
import img_10 from '../../../assets/images/74_478.svg';
import img_11 from '../../../assets/images/74_478.svg';
import img_12 from '../../../assets/images/d35f294fb1a21fb0aa4f326dc1672ebf0f14686d.png';

/* Step 1 imports (renamed to avoid collisions with other steps) */
import S1_img_1 from '../../../assets/images/141_595.svg';
import S1_img_2 from '../../../assets/images/27d2feb51364f020c6b57863d6f2929526f97178.png';

/* Step 2 imports (renamed to avoid collisions with other steps) */
import S2_img_1 from '../../../assets/images/41_1038.svg';
import S2_img_2 from '../../../assets/images/15_398.svg';

/* Product display helpers (shared with the Konfirmasi page). */
import {
  isMeaningful,
  productSpecLine,
  formatDuration,
  durationDays,
  profitPerClaim,
  claimCount,
  profitLabel,
  claimLabel,
  fundSourceLabel,
} from '../../../lib/productFormat.js';

/* ================= Step 1 — /assets/asset-01 (was Asset01.jsx) ================= */

const Asset01Styles = `
/* Scoped styles for Asset01 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-asset-01 to isolate this page. */

.page-asset-01, .page-asset-01 * {
  box-sizing: border-box;
}

.page-asset-01 {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #e5e5e5;
  min-height: 100vh;
  width: 100%;
}

/* ---- inline section styles ---- */

/* CSS for section section:Hero */
.page-asset-01 .hero-section {
  max-width: 100%;
  height: 240px;
  margin: 0 auto;
  background: radial-gradient(43.75% 50% at 41.67% 0%, #241c16 0%, #1a1410 55%, #120d09 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
  overflow: hidden;
}
.page-asset-01 .top-nav {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 2;
}
.page-asset-01 .back-btn {
  width: 34px;
  height: 34px;
  background-color: rgba(255, 249, 242, 0.12);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}
.page-asset-01 .page-title {
  color: #fff9f2;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
.page-asset-01 .asset-card {
  background-color: rgba(255, 249, 242, 0.08);
  border-radius: 14px;
  padding: 13px 14px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
  z-index: 2;
}
.page-asset-01 .asset-label {
  color: rgba(255, 249, 242, 0.5);
  font-size: 12px;
  margin: 0;
}
.page-asset-01 .asset-value {
  color: #fff9f2;
  font-size: 20px;
  font-weight: 700;
  margin: 2px 0 0 0;
}
.page-asset-01 .asset-fiat {
  color: rgba(255, 249, 242, 0.45);
  font-size: 12px;
  margin: 0;
}
.page-asset-01 .character-img {
  position: absolute;
  right: -10px;
  top: 37px;
  width: 135px;
  height: 132px;
  z-index: 1;
}

/* CSS for section section:FloatingCard */
.page-asset-01 .floating-price-section {
  max-width: 100%;
  /* Pulled up over the dark hero so the card straddles its bottom edge
     (original mockup offset — half of the 94px card). */
  margin: -47px auto 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 10;
  /* Top 47px stay transparent: the dark hero shows through the strip the card
     overlaps, then the light body colour continues seamlessly. */
  background: linear-gradient(to bottom, transparent 47px, #fff9f2 47px);
}
.page-asset-01 .price-card {
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 94px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.page-asset-01 .gold-icon {
  width: 45px;
  height: 44px;
}
.page-asset-01 .price-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.page-asset-01 .price-label {
  color: #a79c8f;
  font-size: 12px;
  margin: 0;
}
.page-asset-01 .price-value {
  color: #1a1410;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
.page-asset-01 .price-change {
  display: flex;
  align-items: center;
  gap: 3px;
}
.page-asset-01 .change-value {
  color: #e24c4c;
  font-size: 14px;
  font-weight: 700;
}

/* CSS for section section:Programs */
.page-asset-01 .programs-section {
  max-width: 100%;
  margin: 0 auto;
  background-color: #fff9f2;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.page-asset-01 .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-asset-01 .title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}
.page-asset-01 .section-title {
  color: #1a1410;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
.page-asset-01 .badge-live {
  background-color: #e24c4c;
  color: #ffffff;
  font-size: 10px;
  padding: 2px 9px;
  border-radius: 20px;
  font-weight: 700;
  animation: page-asset-01-blink 1.2s ease-in-out infinite;
}
@keyframes page-asset-01-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
.page-asset-01 .link-all {
  color: #e8790c;
  font-size: 12px;
  text-decoration: none;
  font-weight: 700;
}
.page-asset-01 .tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
}
.page-asset-01 .tabs::-webkit-scrollbar {
  display: none;
}
.page-asset-01 .tab {
  background-color: #f6f1e9;
  color: #514840;
  border: none;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}
.page-asset-01 .tab.active {
  background-color: #1a1410;
  color: #fff9f2;
}
.page-asset-01 .program-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.page-asset-01 .program-status {
  color: #a79c8f;
  font-size: 12px;
  padding: 8px 0;
}
.page-asset-01 .program-card {
  border: 1px solid #efe7dc;
  border-radius: 16px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.page-asset-01 .card-main {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.page-asset-01 .card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.page-asset-01 .product-icon {
  width: 34px;
  height: 34px;
  background-color: #f6f1e9;
  border: 1px solid rgba(26, 20, 16, 0.22);
  border-radius: 9px;
}
.page-asset-01 .product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.page-asset-01 .product-name {
  color: #1a1410;
  font-size: 14px;
  font-weight: 700;
  margin: 0;
}
.page-asset-01 .product-spec {
  color: #a79c8f;
  font-size: 12px;
  margin: 0;
}
.page-asset-01 .quota-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}
.page-asset-01 .quota-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-asset-01 .quota-label {
  color: #a79c8f;
  font-size: 12px;
}
.page-asset-01 .quota-value {
  color: #1a1410;
  font-size: 12px;
  font-weight: 700;
}
.page-asset-01 .progress-bar {
  height: 6px;
  background-color: #f6f1e9;
  border-radius: 4px;
  width: 100%;
}
.page-asset-01 .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
  border-radius: 4px;
}
.page-asset-01 .stats-grid {
  display: flex;
  border-top: 1px solid #efe7dc;
  padding-top: 12px;
  margin-top: 4px;
}
.page-asset-01 .stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  align-items: flex-start;
}
.page-asset-01 .stat-label {
  color: #a79c8f;
  font-size: 10px;
}
.page-asset-01 .stat-value {
  color: #1a1410;
  font-size: 12px;
  font-weight: 700;
}
.page-asset-01 .stat-value.highlight {
  color: #2f8f5a;
}
.page-asset-01 .card-footer {
  background-color: #f6f1e9;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.page-asset-01 .footer-icon {
  width: 21px;
  height: 21px;
}
.page-asset-01 .footer-text {
  color: #1a1410;
  font-size: 12px;
  font-weight: 700;
  flex: 1;
}
.page-asset-01 .footer-arrow {
  width: 14px;
  height: 14px;
}

/* CSS for section section:FAQ */
.page-asset-01 .faq-section {
  max-width: 100%;
  margin: 0 auto;
  background-color: #fff9f2;
  padding: 6px 20px 24px 20px;
  display: flex;
  flex-direction: column;
}
.page-asset-01 .faq-title {
  color: #1a1410;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 16px 0;
}
.page-asset-01 .faq-list {
  display: flex;
  flex-direction: column;
}
.page-asset-01 .faq-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #efe7dc;
  cursor: pointer;
}
.page-asset-01 .faq-item:last-child {
  border-bottom: none;
}
.page-asset-01 .faq-question {
  color: #1a1410;
  font-size: 14px;
  font-weight: 400;
}
`;

function Asset01() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');

  useEffect(() => {
    let active = true;
    listProducts()
      .then((payload) => {
        if (!active) return;
        setProducts(Array.isArray(payload?.results) ? payload.results : []);
      })
      .catch((err) => {
        if (active) setError(err?.message || 'Gagal memuat rencana.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const tabs = ['Semua', ...new Set(products.map((product) => product.golongan).filter(isMeaningful))];
  const visibleProducts =
    activeTab === 'Semua'
      ? products
      : products.filter((product) => product.golongan === activeTab);

  return (
    <div className="page-asset-01">
      <style>{Asset01Styles}</style>
      <div>
              <section id="section-hero" className="hero-section">
                <div className="top-nav">
                  <a href="#" className="back-btn" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={S1_img_1} alt="Back" />
                  </a>
                  <h1 className="page-title">Kumpulkan Aset Anda</h1>
                </div>
                <div className="asset-card">
                  <p className="asset-label">Total Aset Emas Kamu</p>
                  <p className="asset-value">1,367 gram</p>
                  <p className="asset-fiat">≈ Rp3.512.870</p>
                </div>
                <img src={S1_img_2} alt="Character" className="character-img" />
              </section>
              <section id="section-floating-card" className="floating-price-section">
                <div className="price-card" style={{ backgroundImage: `url(${img_12})` }}>
                  <img src={img_3} alt="Gold Coin" className="gold-icon" />
                  <div className="price-info">
                    <p className="price-label">Harga Emas Hari Ini</p>
                    <p className="price-value">Rp 2.569.270 / gram</p>
                  </div>
                  <div className="price-change">
                    <img src={img_4} alt="Up" />
                    <span className="change-value">+ 1,01%</span>
                  </div>
                </div>
              </section>
              <section id="section-programs" className="programs-section">
                <div className="section-header">
                  <div className="title-wrapper">
                    <h2 className="section-title">Rencana Program</h2>
                    <span className="badge-live">Live</span>
                  </div>
                  <a href="#" className="link-all" onClick={(e) => { e.preventDefault(); setActiveTab('Semua'); }}>Lihat Semua</a>
                </div>
                <div className="tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      className={`tab${activeTab === tab ? ' active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="program-list">
                  {loading && <p className="program-status">Memuat rencana...</p>}
                  {!loading && error && (
                    <NotifCard variant="error" title="Gagal Memuat Rencana" description={error} />
                  )}
                  {!loading && !error && visibleProducts.length === 0 && (
                    <p className="program-status">Belum ada rencana yang tersedia.</p>
                  )}
                  {!loading &&
                    !error &&
                    visibleProducts.map((product) => (
                      <div className="program-card" key={product.id}>
                        <div className="card-main">
                          <div className="card-header">
                            <div className="product-icon" />
                            <div className="product-info">
                              <h3 className="product-name">{product.name}</h3>
                              {productSpecLine(product) && (
                                <p className="product-spec">{productSpecLine(product)}</p>
                              )}
                            </div>
                          </div>
                          {product.stock_enabled && (
                            <div className="quota-container">
                              <div className="quota-info">
                                <span className="quota-label">Kuota Peserta Aktif</span>
                                <span className="quota-value">
                                  {(Number(product.stock) || 0).toLocaleString('id-ID')} tersisa
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="stats-grid">
                            <div className="stat-item">
                              <span className="stat-label">Pembagian</span>
                              <span className="stat-value highlight">{profitLabel(product)}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Frekuensi</span>
                              <span className="stat-value">{formatDuration(product.duration)}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Estimasi Biaya</span>
                              <span className="stat-value">{formatRupiah(product.price)}</span>
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/assets/asset-02"
                          state={{ productId: product.id }}
                          className="card-footer"
                          onClick={() => sessionStorage.setItem('je_asset_product_id', String(product.id))}
                        >
                          <img src={img_5} alt="Doc" className="footer-icon" />
                          <span className="footer-text">Lihat detail rencana</span>
                          <img src={img_6} alt="Arrow" className="footer-arrow" />
                        </Link>
                      </div>
                    ))}
                </div>
              </section>
              <section id="section-faq" className="faq-section">
                <h2 className="faq-title">Seputar Investasi Emas</h2>
                <div className="faq-list">
                  <div className="faq-item">
                    <span className="faq-question">Apa itu Investasi Emas Rutin?</span>
                    <img src={img_9} alt="Expand" />
                  </div>
                  <div className="faq-item">
                    <span className="faq-question">Emas yang terkumpul disimpan di mana?</span>
                    <img src={img_10} alt="Expand" />
                  </div>
                  <div className="faq-item">
                    <span className="faq-question">Bagaimana cara mengubah atau membatalkan paket?</span>
                    <img src={img_11} alt="Expand" />
                  </div>
                </div>
              </section>
            </div>

    </div>
  );
}

/* ================= Step 2 — /assets/asset-02 (was Asset02.jsx) ================= */

const Asset02Styles = `
/* Scoped styles for Asset02 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-asset-02 to isolate this page. */

.page-asset-02 {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #fffbf4;
  background-image:
    radial-gradient(circle at 100% 0%, rgba(255, 201, 60, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 0% 100%, rgba(255, 159, 28, 0.1) 0%, transparent 40%);
  color: #1a1410;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  min-height: 100vh;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
  box-sizing: border-box;
  position: relative;
  padding-bottom: 24px;
  width: 100%;
}

.page-asset-02, .page-asset-02 * {
  box-sizing: inherit;
}

.page-asset-02 h1,.page-asset-02  h2,.page-asset-02  h3,.page-asset-02  p {
  margin: 0;
}

.page-asset-02 .container {
  padding-left: 20px;
  padding-right: 20px;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-asset-02 #header {
    padding: 20px 20px 16px 20px;
  }
  .page-asset-02 .header-container {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .page-asset-02 .back-btn {
    width: 36px;
    height: 36px;
    border-radius: 11px;
    background-color: #f6f1e9;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0;
  }
  .page-asset-02 .header-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
  }

/* CSS for section section:ProductCard */
.page-asset-02 #product-card {
    margin-bottom: 24px;
  }
  .page-asset-02 .card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-asset-02 .card-icon {
    width: 40px;
    height: 40px;
    background-color: #f6f1e9;
    border: 1px solid rgba(26, 20, 16, 0.22);
    border-radius: 10px;
  }
  .page-asset-02 .card-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
  }
  .page-asset-02 .product-name {
    font-size: 14px;
    font-weight: 700;
    color: #1a1410;
  }
  .page-asset-02 .badge {
    background-color: rgba(255, 159, 28, 0.14);
    color: #e8790c;
    font-size: 10px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
  }

/* CSS for section section:PackageDetails */
.page-asset-02 #package-details {
    margin-bottom: 24px;
  }
  .page-asset-02 .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #1a1410;
    margin-bottom: 12px;
  }
  .page-asset-02 .details-list {
    display: flex;
    flex-direction: column;
  }
  .page-asset-02 .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #efe7dc;
  }
  .page-asset-02 .detail-row:last-child {
    border-bottom: none;
  }
  .page-asset-02 .detail-label {
    font-size: 12px;
    color: #a79c8f;
  }
  .page-asset-02 .detail-value {
    font-size: 12px;
    font-weight: 700;
    color: #1a1410;
  }

/* CSS for section section:Simulation */
.page-asset-02 #simulation {
    margin-bottom: 24px;
  }
  .page-asset-02 .section-desc {
    font-size: 12px;
    color: #a79c8f;
    margin-bottom: 16px;
    line-height: 1.4;
  }
  .page-asset-02 .table-container {
    border: 1px solid #efe7dc;
    border-radius: 14px;
    overflow: hidden;
    background-color: #ffffff;
  }
  .page-asset-02 .table-header {
    display: flex;
    background-color: #f6f1e9;
    padding: 12px 14px;
    border-bottom: 1px solid #efe7dc;
  }
  .page-asset-02 .table-row {
    display: flex;
    padding: 12px 14px;
    border-bottom: 1px solid #efe7dc;
  }
  .page-asset-02 .table-row:last-child {
    border-bottom: none;
  }
  .page-asset-02 .col {
    flex: 1;
    font-size: 12px;
    color: #514840;
  }
  .page-asset-02 .col.left { text-align: left; }
  .page-asset-02 .col.center { text-align: center; }
  .page-asset-02 .col.right { text-align: right; }
  
  .page-asset-02 .table-header .col {
    font-weight: 700;
  }
  .page-asset-02 .bold-text {
    font-weight: 700;
    color: #1a1410;
  }

/* CSS for section section:Disclaimer */
.page-asset-02 #disclaimer {
    margin-bottom: 32px;
  }
  .page-asset-02 .info-box {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .page-asset-02 .info-icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-top: 2px;
  }
  .page-asset-02 .info-icon img {
    width: 100%;
    height: 100%;
    display: block;
  }
  .page-asset-02 .info-text {
    font-size: 11px;
    color: #514840;
    line-height: 1.5;
  }

/* Status text shown while loading / on errors */
.page-asset-02 .page-status {
  font-size: 13px;
  color: #a79c8f;
  text-align: center;
  padding: 32px 0 16px 0;
  line-height: 1.5;
}

/* CSS for section section:Action */
.page-asset-02 .primary-btn {
    width: 100%;
    background-color: #f1b04a;
    color: #1a1410;
    border: none;
    border-radius: 14px;
    padding: 16px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.2s;
  }
  .page-asset-02 .primary-btn:hover {
    background-color: #e0a03a;
  }
`;

function Asset02() {
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* Product id travels via Link state; sessionStorage keeps hard reloads working. */
  const productId =
    location.state?.productId || Number(sessionStorage.getItem('je_asset_product_id')) || 0;

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      setError('Pilih rencana terlebih dahulu dari daftar program.');
      return undefined;
    }
    let active = true;
    getProduct(productId)
      .then((payload) => {
        if (active) setProduct(payload);
      })
      .catch((err) => {
        if (active) setError(err?.message || 'Gagal memuat detail rencana.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [productId]);

  const perClaim = product ? profitPerClaim(product) : 0;
  const claims = product ? claimCount(product) : 0;
  const days = product ? durationDays(product.duration) : 1;
  const simulationRows = product
    ? Array.from({ length: Math.min(claims, 4) }, (_, index) => ({
        period: index + 1,
        profit: perClaim,
        total: (Number(product.price) || 0) + perClaim * (index + 1),
      }))
    : [];
  const customFields = product
    ? Array.from({ length: 10 }, (_, index) => ({
        title: product[`custom_field_${index + 1}_title`],
        content: product[`custom_field_${index + 1}_content`],
      })).filter((field) => isMeaningful(field.title) && isMeaningful(field.content))
    : [];

  return (
    <div className="page-asset-02">
      <style>{Asset02Styles}</style>
      <div>
              <section id="header">
                <header className="header-container">
                  <button className="back-btn" aria-label="Back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={S2_img_1} alt="Back Icon" />
                  </button>
                  <h1 className="header-title">Detail &amp; Simulasi</h1>
                </header>
              </section>
              {loading && (
                <section className="container">
                  <p className="page-status">Memuat detail rencana...</p>
                </section>
              )}
              {!loading && error && (
                <section className="container">
                  <NotifCard variant="error" title="Gagal Memuat Detail Rencana" description={error} showClose={false} />
                  <button className="primary-btn" onClick={() => navigate('/assets/asset-01')}>Lihat Rencana Lain</button>
                </section>
              )}
              {!loading && !error && product && (
                <>
              <section id="product-card" className="container">
                <div className="card">
                  <div className="card-icon" />
                  <div className="card-info">
                    <h2 className="product-name">{product.name}</h2>
                    {isMeaningful(product.golongan) && (
                      <span className="badge">{String(product.golongan).trim()}</span>
                    )}
                  </div>
                </div>
              </section>
              <section id="package-details" className="container">
                <h2 className="section-title">Rincian Paket</h2>
                <div className="details-list">
                  <div className="detail-row">
                    <span className="detail-label">Estimasi Biaya / Periode</span>
                    <span className="detail-value">{formatRupiah(product.price)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Pembagian / Hari</span>
                    <span className="detail-value">{formatRupiah((perClaim * claims) / days)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Frekuensi</span>
                    <span className="detail-value">{claimLabel(product)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Sumber Dana</span>
                    <span className="detail-value">Saldo Jelajah Emas</span>
                  </div>
                </div>
              </section>
              {customFields.length > 0 && (
              <section id="product-info" className="container">
                <h2 className="section-title">Informasi Produk</h2>
                <div className="details-list">
                  {customFields.map((field) => (
                    <div className="detail-row" key={field.title}>
                      <span className="detail-label">{field.title}</span>
                      <span className="detail-value">{field.content}</span>
                    </div>
                  ))}
                </div>
              </section>
              )}
              <section id="simulation" className="container">
                <h2 className="section-title">Simulasi Akumulasi</h2>
                <p className="section-desc">Estimasi berdasarkan harga emas saat ini dan nominal tetap tiap periode.</p>
                <div className="table-container">
                  <div className="table-header">
                    <div className="col left">Periode</div>
                    <div className="col center">Profit</div>
                    <div className="col right">Total Akumulasi</div>
                  </div>
                  {simulationRows.map((row) => (
                    <div className="table-row" key={row.period}>
                      <div className="col left">Periode {row.period}</div>
                      <div className="col center bold-text">{formatRupiah(row.profit)}</div>
                      <div className="col right">{formatRupiah(row.total)}</div>
                    </div>
                  ))}
                </div>
              </section>
              <section id="disclaimer" className="container">
                <div className="info-box">
                  <div className="info-icon">
                    <img src={S2_img_2} alt="Info" />
                  </div>
                  <p className="info-text">
                    Harga emas dapat berubah sewaktu-waktu mengikuti pasar.<br />
                    Nominal biaya di atas dihitung berdasarkan harga emas saat simulasi dibuat.
                  </p>
                </div>
              </section>
              <section id="action" className="container">
                <button className="primary-btn" onClick={() => navigate('/assets/konfirmasi', { state: { productId: product.id } })}>Aktifkan Paket Ini</button>
              </section>
                </>
              )}
            </div>

    </div>
  );
}

const STEP_COMPONENTS = { 1: Asset01, 2: Asset02 };

export default function Asset({ step = 1 }) {
  const Step = STEP_COMPONENTS[step] ?? STEP_COMPONENTS[1];
  return <Step />;
}
