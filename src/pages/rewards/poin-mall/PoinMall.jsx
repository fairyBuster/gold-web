/* ============================================================================
   PoinMall.jsx — single-file implementation of the point mall redemption.
   All steps of this flow live in this one file; the <PoinMall step={n} />
   element passed by App.jsx selects the active step. URL per step:
     1 -> /rewards/poin-mall-01
     2 -> /rewards/poin-mall-02
     3 -> /rewards/poin-mall-03
   ============================================================================ */

import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../../../components/BottomNav.jsx';
import img_3 from '../../../assets/images/88_973.svg';

/* Step 1 imports (renamed to avoid collisions with other steps) */
import S1_img_1 from '../../../assets/images/41_1038.svg';
import S1_img_2 from '../../../assets/images/cd4321a034b318f75c488cf1f2e3603c65cc1a7f.png';

/* Step 2 imports (renamed to avoid collisions with other steps) */
import S2_img_1 from '../../../assets/images/67_135.svg';
import S2_img_2 from '../../../assets/images/88_1102.svg';

/* Step 3 imports (renamed to avoid collisions with other steps) */
import S3_img_1 from '../../../assets/images/7ad23d77f11622cbb0af82a44395f1afe17db1bf.png';


/* ================= Step 1 — /rewards/poin-mall-01 (was PoinMall01.jsx) ================= */

const PoinMall01Styles = `
/* Scoped styles for PoinMall01 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-poin-mall-01 to isolate this page. */

.page-poin-mall-01 {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #e5e5e5; /* Darker background for desktop viewing */
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

/* Main container styling to simulate mobile screen */
.page-poin-mall-01 .app-container {
  width: 100%;
  max-width: 100%;
  background-color: #fffbf4;
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 84px; /* Space for the fixed bottom navigation */
}

/* Base section styling */
.page-poin-mall-01 .app-section {
  width: 100%;
  box-sizing: border-box;
}

.page-poin-mall-01 h1,.page-poin-mall-01  h2,.page-poin-mall-01  h3,.page-poin-mall-01  p {
  margin: 0;
}

.page-poin-mall-01 a {
  text-decoration: none;
}

.page-poin-mall-01 button {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-poin-mall-01 #section-header {
    /* Applying the top gradient from style_2 */
    background: radial-gradient(76.92% 178.57% at 11.54% -128.57%, rgba(255, 201, 60, 0.28) 0%, rgba(255, 201, 60, 0) 70%),
                radial-gradient(111.11% 142.86% at 25.56% 24.29%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 70%),
                radial-gradient(90.91% 125% at -40.91% 50%, rgba(255, 159, 28, 0.38) 0%, rgba(255, 159, 28, 0) 70%);
  }
  .page-poin-mall-01 .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    height: 72px;
    box-sizing: border-box;
  }
  .page-poin-mall-01 .back-btn {
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .page-poin-mall-01 .page-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    flex-grow: 1;
    margin-left: 14px;
  }
  .page-poin-mall-01 .history-link {
    font-size: 14px;
    font-weight: 600;
    color: #e8790c;
  }

/* CSS for section section:Hero */
.page-poin-mall-01 .hero-wrapper {
    padding: 0 20px 18px 20px;
  }
  .page-poin-mall-01 .hero-card {
    background: radial-gradient(41.67% 50% at 43.75% 50%, #241c16 0%, #1a1410 55%, #120d09 100%);
    border-radius: 20px;
    padding: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 42px; /* Space between top content and bottom bar */
  }
  .page-poin-mall-01 .hero-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: relative;
    z-index: 2;
  }
  .page-poin-mall-01 .hero-label {
    color: rgba(255, 249, 242, 0.55);
    font-size: 12px;
  }
  .page-poin-mall-01 .hero-points {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }
  .page-poin-mall-01 .points-value {
    color: #fff9f2;
    font-size: 32px;
    font-weight: 700;
  }
  .page-poin-mall-01 .points-text {
    color: rgba(255, 249, 242, 0.6);
    font-size: 14px;
  }
  .page-poin-mall-01 .hero-exchange-rate {
    background-color: rgba(255, 249, 242, 0.1);
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  .page-poin-mall-01 .rate-label {
    color: rgba(255, 249, 242, 0.7);
    font-size: 12px;
  }
  .page-poin-mall-01 .rate-value {
    color: #fff9f2;
    font-size: 14px;
    font-weight: 600;
  }
  .page-poin-mall-01 .hero-image {
    position: absolute;
    right: 0;
    top: -8px;
    width: 111px;
    height: 115px;
    object-fit: cover;
    z-index: 1;
  }

/* CSS for section section:Info */
.page-poin-mall-01 .info-wrapper {
    padding: 0 20px 20px 20px;
  }
  .page-poin-mall-01 .info-banner {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .page-poin-mall-01 .info-icon {
    width: 16px;
    height: 16px;
    margin-top: 2px;
    flex-shrink: 0;
  }
  .page-poin-mall-01 .info-text {
    font-size: 12px;
    line-height: 1.5;
    color: #1a1410;
  }

/* CSS for section section:Catalog */
.page-poin-mall-01 .catalog-wrapper {
    padding: 0 20px 100px 20px; /* Bottom padding to account for fixed nav */
  }
  .page-poin-mall-01 .catalog-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin-bottom: 14px;
  }
  .page-poin-mall-01 .catalog-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .page-poin-mall-01 .catalog-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .page-poin-mall-01 .card-image-placeholder {
    background-color: #f6f1e9;
    border-bottom: 1px solid rgba(26, 20, 16, 0.15);
    aspect-ratio: 1 / 1;
    width: 100%;
  }
  .page-poin-mall-01 .card-content {
    padding: 10px 12px 12px 12px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .page-poin-mall-01 .card-category {
    font-size: 10px;
    color: #a79c8f;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .page-poin-mall-01 .card-title {
    font-size: 12px;
    font-weight: 600;
    color: #1a1410;
    line-height: 1.4;
    margin-bottom: 12px;
    flex-grow: 1; /* Pushes points to the bottom */
  }
  .page-poin-mall-01 .card-points {
    background-color: rgba(255, 159, 28, 0.12);
    border-radius: 8px;
    padding: 3px 8px;
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
  }
  .page-poin-mall-01 .card-points span {
    color: #e8790c;
    font-size: 12px;
    font-weight: 600;
  }

/* Bottom navigation lives in src/components/BottomNav.jsx (styles inline in that file). */
`;

function PoinMall01() {
  return (
    <div className="page-poin-mall-01">
      <style>{PoinMall01Styles}</style>
      <div className="app-container">
              <section id="section-header" className="app-section">
                <header className="header-content">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={S1_img_1} alt="Back" />
                  </button>
                  <h1 className="page-title">Tukar Poin</h1>
                  <Link to="/rewards/riwayat-poin" className="history-link">Riwayat</Link>
                </header>
              </section>
              <section id="section-hero" className="app-section">
                <div className="hero-wrapper">
                  <div className="hero-card">
                    <div className="hero-content">
                      <p className="hero-label">Poin Kamu</p>
                      <div className="hero-points">
                        <span className="points-value">1.250</span>
                        <span className="points-text">Poin</span>
                      </div>
                    </div>
                    <div className="hero-exchange-rate">
                      <span className="rate-label">Nilai Tukar</span>
                      <span className="rate-value">1 Poin = Rp100</span>
                    </div>
                    <img src={S1_img_2} alt="Mascot" className="hero-image" />
                  </div>
                </div>
              </section>
              <section id="section-info" className="app-section">
                <div className="info-wrapper">
                  <div className="info-banner">
                    <img src={img_3} alt="Info" className="info-icon" />
                    <p className="info-text">Kamu dapat <strong>poin setiap kali isi ulang saldo</strong>. Kumpulkan poin dan tukarkan dengan berbagai voucher menarik di bawah ini.</p>
                  </div>
                </div>
              </section>
              <section id="section-catalog" className="app-section">
                <div className="catalog-wrapper">
                  <h2 className="catalog-title">Katalog Penukaran</h2>
                  <div className="catalog-grid">
                    {/* Card 1 */}
                    <div className="catalog-card">
                      <div className="card-image-placeholder" />
                      <div className="card-content">
                        <span className="card-category">Mall Belanja</span>
                        <h3 className="card-title">Voucher Belanja Rp50.000</h3>
                        <div className="card-points">
                          <span>500 Poin</span>
                        </div>
                      </div>
                    </div>
                    {/* Card 2 */}
                    <div className="catalog-card">
                      <div className="card-image-placeholder" />
                      <div className="card-content">
                        <span className="card-category">Mall Belanja</span>
                        <h3 className="card-title">Voucher Belanja Rp100.000</h3>
                        <div className="card-points">
                          <span>950 Poin</span>
                        </div>
                      </div>
                    </div>
                    {/* Card 3 */}
                    <div className="catalog-card">
                      <div className="card-image-placeholder" />
                      <div className="card-content">
                        <span className="card-category">JelajahEmas</span>
                        <h3 className="card-title">Potongan Biaya Cetak</h3>
                        <div className="card-points">
                          <span>300 Poin</span>
                        </div>
                      </div>
                    </div>
                    {/* Card 4 */}
                    <div className="catalog-card">
                      <div className="card-image-placeholder" />
                      <div className="card-content">
                        <span className="card-category">JelajahEmas</span>
                        <h3 className="card-title">Emas 0,01 Gram Gratis</h3>
                        <div className="card-points">
                          <span>1.000 Poin</span>
                        </div>
                      </div>
                    </div>
                    {/* Card 5 */}
                    <div className="catalog-card">
                      <div className="card-image-placeholder" />
                      <div className="card-content">
                        <span className="card-category">Pulsa Semua Operator</span>
                        <h3 className="card-title">Pulsa Rp25.000</h3>
                        <div className="card-points">
                          <span>280 Poin</span>
                        </div>
                      </div>
                    </div>
                    {/* Card 6 */}
                    <div className="catalog-card">
                      <div className="card-image-placeholder" />
                      <div className="card-content">
                        <span className="card-category">Paket Data</span>
                        <h3 className="card-title">Kuota Internet 5GB</h3>
                        <div className="card-points">
                          <span>650 Poin</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <BottomNav active="voucher" />
            </div> {/* Closes .app-container opened in Header */}

    </div>
  );
}

/* ================= Step 2 — /rewards/poin-mall-02 (was PoinMall02.jsx) ================= */

const PoinMall02Styles = `
/* Scoped styles for PoinMall02 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-poin-mall-02 to isolate this page. */

.page-poin-mall-02, .page-poin-mall-02 * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-poin-mall-02 {
  font-family: 'Inter', sans-serif;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #1a1410;
  min-height: 100vh;
  position: relative;
  width: 100%;
}

/* Creates a mobile-sized container effect on desktop */
.page-poin-mall-02::before {
  content: "";
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 100%;
  height: 100%;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 80% 0%, rgba(255, 201, 60, 0.28) 0%, transparent 50%),
    radial-gradient(circle at 20% 100%, rgba(255, 159, 28, 0.38) 0%, transparent 50%);
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  z-index: -1;
}

.page-poin-mall-02 section {
  width: 100%;
  max-width: 100%;
  position: relative;
  z-index: 1;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-poin-mall-02 .header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 20px 4px 20px;
}
.page-poin-mall-02 .back-btn {
  background-color: #f6f1e9;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}
.page-poin-mall-02 .header-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
}

/* CSS for section section:Hero */
.page-poin-mall-02 .hero-container {
  padding: 14px 20px 18px 20px;
}
.page-poin-mall-02 .image-placeholder {
  background-color: #f6f1e9;
  border: 1px solid rgba(26, 20, 16, 0.22);
  border-radius: 18px;
  height: 256px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.page-poin-mall-02 .placeholder-text {
  color: #a79c8f;
  font-size: 14px;
  font-weight: 600;
}

/* CSS for section section:ProductTitle */
.page-poin-mall-02 .title-container {
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
}
.page-poin-mall-02 .subtitle {
  color: #a79c8f;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}
.page-poin-mall-02 .main-title {
  color: #1a1410;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}
.page-poin-mall-02 .points-badge {
  background-color: rgba(255, 159, 28, 0.12);
  border-radius: 10px;
  padding: 6px 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
}
.page-poin-mall-02 .points-text {
  color: #e8790c;
  font-size: 14px;
  font-weight: 700;
}

/* CSS for section section:Description */
.page-poin-mall-02 .desc-container {
  padding: 0 20px 20px 20px;
}
.page-poin-mall-02 .section-heading {
  color: #1a1410;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}
.page-poin-mall-02 .desc-text {
  color: #514840;
  font-size: 14px;
  line-height: 1.5;
}

/* CSS for section section:Terms */
.page-poin-mall-02 .terms-container {
  padding: 0 20px 20px 20px;
}
.page-poin-mall-02 .section-heading {
  color: #1a1410;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
}
.page-poin-mall-02 .terms-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.page-poin-mall-02 .terms-list li {
  color: #a79c8f;
  font-size: 14px;
  line-height: 1.5;
  position: relative;
  padding-left: 14px;
}
.page-poin-mall-02 .terms-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  top: 0;
  color: #a79c8f;
}

/* CSS for section section:Footer */
.page-poin-mall-02 .footer-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 40px;
}
.page-poin-mall-02 .current-points {
  background-color: #f6f1e9;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-poin-mall-02 .points-label {
  color: #a79c8f;
  font-size: 14px;
}
.page-poin-mall-02 .points-value {
  color: #1a1410;
  font-size: 16px;
  font-weight: 700;
}
.page-poin-mall-02 .btn-primary {
  background-color: #f1b04a;
  color: #1a1410;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.page-poin-mall-02 .btn-primary:hover {
  background-color: #e5a540;
}
.page-poin-mall-02 .btn-primary:active {
  background-color: #d99a35;
}
`;

function PoinMall02() {
  const navigate = useNavigate();

  return (
    <div className="page-poin-mall-02">
      <style>{PoinMall02Styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <a href="#" className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={S2_img_1} alt="" />
                  </a>
                  <h1 className="header-title">Detail Penukaran</h1>
                </header>
              </section>
              <section id="section-hero">
                <div className="hero-container">
                  <div className="image-placeholder">
                    {/* Placeholder for product image */}
                    <span className="placeholder-text">+ Gambar Produk</span>
                  </div>
                </div>
              </section>
              <section id="section-product-title">
                <div className="title-container">
                  <p className="subtitle">Mall Belanja</p>
                  <h2 className="main-title">Voucher Belanja Rp100.000</h2>
                  <div className="points-badge">
                    <img src={S2_img_2} alt="Star icon" />
                    <span className="points-text">950 Poin</span>
                  </div>
                </div>
              </section>
              <section id="section-description">
                <div className="desc-container">
                  <h3 className="section-heading">Deskripsi</h3>
                  <p className="desc-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Voucher belanja senilai Rp100.000 yang dapat digunakan di seluruh gerai mitra Mall Belanja seluruh Indonesia.
                  </p>
                </div>
              </section>
              <section id="section-terms">
                <div className="terms-container">
                  <h3 className="section-heading">Syarat &amp; Ketentuan</h3>
                  <ul className="terms-list">
                    <li>Hadiah yang sudah ditukar akan berlaku 30 hari sejak tanggal penukaran.</li>
                    <li>Segera hubungi layanan pelanggan untuk menukarkan hadiah maksimal dalam 1x24 jam.</li>
                    <li>Voucher tidak dapat digabung dengan promo lain.</li>
                    <li>Poin yang sudah ditukar tidak dapat dikembalikan.</li>
                  </ul>
                </div>
              </section>
              <section id="section-footer">
                <div className="footer-container">
                  <div className="current-points">
                    <span className="points-label">Poin Kamu Saat Ini</span>
                    <span className="points-value">1.250 Poin</span>
                  </div>
                  <button className="btn-primary" onClick={(e) => { e.preventDefault(); navigate('/rewards/poin-mall-03'); }}>Tukar Sekarang</button>
                </div>
              </section>
            </div>

    </div>
  );
}

/* ================= Step 3 — /rewards/poin-mall-03 (was PoinMall03.jsx) ================= */

const PoinMall03Styles = `
/* Scoped styles for PoinMall03 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-poin-mall-03 to isolate this page. */

.page-poin-mall-03 {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f5f5f5; /* Darker background outside the app container to make it stand out on desktop */
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

/* ---- inline section styles ---- */

/* CSS for section section:MainScreen */
.page-poin-mall-03 .app-container {
    width: 100%;
    max-width: 100%;
    background-color: #fffbf4;
    background-image: 
      radial-gradient(circle at top right, rgba(255, 201, 60, 0.15) 0%, transparent 50%),
      radial-gradient(circle at bottom left, rgba(255, 159, 28, 0.15) 0%, transparent 50%);
    box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
    display: flex;
    flex-direction: column;
    padding: 36px 22px 24px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }

  .page-poin-mall-03 .success-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 36px;
  }

  .page-poin-mall-03 .success-image {
    width: 126px;
    height: 131px;
    object-fit: contain;
  }

  .page-poin-mall-03 .success-title {
    color: #1a1410;
    font-size: 20px;
    font-weight: 700;
    margin: 16px 0 8px;
    text-align: center;
  }

  .page-poin-mall-03 .success-desc {
    color: #514840;
    font-size: 13px;
    line-height: 1.5;
    text-align: center;
    margin: 0;
    padding: 0 10px;
  }

  .page-poin-mall-03 .details-section {
    margin-bottom: 20px;
  }

  .page-poin-mall-03 .details-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  .page-poin-mall-03 .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
  }

  .page-poin-mall-03 .detail-row:not(:last-child) {
    border-bottom: 1px solid #efe7dc;
  }

  .page-poin-mall-03 .detail-row:first-child {
    padding-top: 0;
  }

  .page-poin-mall-03 .detail-row:last-child {
    padding-bottom: 0;
  }

  .page-poin-mall-03 .detail-label {
    color: #a79c8f;
    font-size: 12px;
    font-weight: 400;
  }

  .page-poin-mall-03 .detail-value {
    color: #1a1410;
    font-size: 12px;
    font-weight: 700;
    text-align: right;
  }

  .page-poin-mall-03 .actions-section {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 40px;
  }

  .page-poin-mall-03 .btn {
    width: 100%;
    border: none;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-sizing: border-box;
    transition: opacity 0.2s ease;
  }

  .page-poin-mall-03 .btn:active {
    opacity: 0.8;
  }

  .page-poin-mall-03 .btn-primary {
    background-color: #f1b04a;
    color: #1a1410;
    border-radius: 14px;
    padding: 15px;
  }

  .page-poin-mall-03 .btn-secondary {
    background-color: transparent;
    color: #514840;
    border: 1px solid #efe7dc;
    border-radius: 14px;
    padding: 13px;
  }
`;

function PoinMall03() {
  const navigate = useNavigate();

  return (
    <div className="page-poin-mall-03">
      <style>{PoinMall03Styles}</style>
      <main className="app-container">
              <section id="success-message" className="success-section">
                <img src={S3_img_1} alt="Penukaran Berhasil" className="success-image" />
                <h1 className="success-title">Penukaran Berhasil</h1>
                <p className="success-desc">Simpan tangkapan layar ini dan kirim ke layanan pelanggan Jelajah Emas untuk menukarnya ya!</p>
              </section>
              <section id="transaction-details" className="details-section">
                <div className="details-card">
                  <div className="detail-row">
                    <span className="detail-label">Item</span>
                    <span className="detail-value">Voucher Belanja Rp100.000</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Poin Digunakan</span>
                    <span className="detail-value">950 Poin</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Sisa Poin</span>
                    <span className="detail-value">300 Poin</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Tanggal Penukaran</span>
                    <span className="detail-value">10/09/2026 17:32:01</span>
                  </div>
                </div>
              </section>
              <section id="actions" className="actions-section">
                <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>Kembali ke Beranda</button>
                <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); navigate('/rewards/poin-mall-01'); }}>Tukar Poin Lainnya</button>
              </section>
            </main>

    </div>
  );
}

const STEP_COMPONENTS = { 1: PoinMall01, 2: PoinMall02, 3: PoinMall03 };

export default function PoinMall({ step = 1 }) {
  const Step = STEP_COMPONENTS[step] ?? STEP_COMPONENTS[1];
  return <Step />;
}
