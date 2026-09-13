import img_1 from '../../../assets/images/41_1038.svg';
import img_2 from '../../../assets/images/615cb7874b4304ede07a379f82cc29690a4f8ed1.png';
import img_3 from '../../../assets/images/82_901.svg';
import img_4 from '../../../assets/images/82_910.svg';
import img_5 from '../../../assets/images/82_919.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for EmasDigital — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-emas-digital to isolate this page. */

.page-emas-digital {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #fffbf4; /* Fallback page color behind the sections */
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

.page-emas-digital, .page-emas-digital * {
  box-sizing: border-box;
}

.page-emas-digital h1,.page-emas-digital  h2,.page-emas-digital  h3,.page-emas-digital  p {
  margin: 0;
}

.page-emas-digital .app-container {
  width: 100%;
  max-width: 100%; /* Based on Figma design width */
  background-color: #ffffff;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

/* Stretch the content column so the last section fills any space below
   the content instead of leaving a gray band at the bottom. */
.page-emas-digital > div {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-emas-digital #section-header .app-container {
    background-color: #fdf4df; /* Matches the top of the hero gradient */
  }
  .page-emas-digital .site-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 20px 16px 20px;
  }
  .page-emas-digital .back-button {
    width: 36px;
    height: 36px;
    border-radius: 11px;
    background-color: rgba(255, 249, 242, 0.6);
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0;
  }
  .page-emas-digital .page-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
  }

/* CSS for section section:Hero */
.page-emas-digital #section-hero .app-container {
    background: linear-gradient(180deg, #fdf4df 0%, #fef0d1 40%, #fffbf4 100%);
  }
  .page-emas-digital .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 24px 40px 24px;
    position: relative;
    overflow: hidden;
  }
  .page-emas-digital .glow-effect {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .page-emas-digital .balance-card {
    background-color: #ffffff;
    border-radius: 20px;
    padding: 26px 20px 24px 20px;
    width: 100%;
    max-width: 280px;
    box-shadow: 0px 20px 40px 0px rgba(120, 80, 10, 0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    margin-bottom: 28px;
  }
  .page-emas-digital .card-label {
    color: #a79c8f;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .page-emas-digital .amount-wrapper {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 4px;
  }
  .page-emas-digital .amount-number {
    font-size: 32px;
    font-weight: 700;
    color: #1a1410;
    letter-spacing: -0.5px;
  }
  .page-emas-digital .amount-unit {
    font-size: 14px;
    font-weight: 600;
    color: #514840;
  }
  .page-emas-digital .amount-fiat {
    color: #e8790c;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .page-emas-digital .card-illustration {
    width: 105px;
    height: auto;
    display: block;
  }
  .page-emas-digital .update-info {
    color: rgba(26, 20, 16, 0.55);
    font-size: 11px;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
  }
  .page-emas-digital .stats-container {
    display: flex;
    gap: 14px;
    width: 100%;
    max-width: 280px;
    position: relative;
    z-index: 1;
  }
  .page-emas-digital .stat-box {
    background-color: rgba(255, 249, 242, 0.65);
    border-radius: 12px;
    padding: 12px 8px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  .page-emas-digital .stat-title {
    color: #514840;
    font-size: 10px;
  }
  .page-emas-digital .stat-value {
    color: #1a1410;
    font-size: 13px;
    font-weight: 700;
  }
  .page-emas-digital .stat-value.text-profit {
    color: #2e8b57;
  }

/* CSS for section section:Features */
.page-emas-digital #section-features {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .page-emas-digital #section-features .app-container {
    background-color: #ffffff;
    flex: 1;
  }
  .page-emas-digital .features-content {
    padding: 24px 20px 40px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .page-emas-digital .section-heading {
    font-size: 14px;
    font-weight: 700;
    color: #1a1410;
  }
  .page-emas-digital .feature-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .page-emas-digital .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .page-emas-digital .icon-wrapper {
    width: 34px;
    height: 34px;
    border-radius: 17px;
    background-color: #f6f1e9;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }
  .page-emas-digital .text-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 2px;
  }
  .page-emas-digital .feature-title {
    font-size: 13px;
    font-weight: 700;
    color: #1a1410;
  }
  .page-emas-digital .feature-desc {
    font-size: 12px;
    color: #a79c8f;
    line-height: 1.4;
  }
`;

export default function EmasDigital() {
  return (
    <div className="page-emas-digital">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <div className="app-container">
                  <header className="site-header">
                    <button className="back-button" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                      <img src={img_1} alt="" />
                    </button>
                    <h1 className="page-title">Emas Digital Saya</h1>
                  </header>
                </div>
              </section>
              <section id="section-hero">
                <div className="app-container">
                  <div className="hero-content">
                    <div className="glow-effect" />
                    <div className="balance-card">
                      <p className="card-label">Total Emas Digital</p>
                      <div className="amount-wrapper">
                        <span className="amount-number">1,367</span>
                        <span className="amount-unit">gram</span>
                      </div>
                      <p className="amount-fiat">≈ Rp 3.512.870</p>
                      <img className="card-illustration" src={img_2} alt="Jelajah Emas Digital Card" />
                    </div>
                    <p className="update-info">Diperbarui pada pukul 10:02 WIB</p>
                    <div className="stats-container">
                      <div className="stat-box">
                        <p className="stat-title">Profit</p>
                        <p className="stat-value text-profit">+Rp 85.000</p>
                      </div>
                      <div className="stat-box">
                        <p className="stat-title">Balance Hold</p>
                        <p className="stat-value">Rp 70.934</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-features">
                <div className="app-container">
                  <div className="features-content">
                    <h2 className="section-heading">Tentang Emas Digital Kamu</h2>
                    <div className="feature-list">
                      <div className="feature-item">
                        <div className="icon-wrapper">
                          <img src={img_3} alt="Aman" />
                        </div>
                        <div className="text-wrapper">
                          <h3 className="feature-title">Disimpan dengan Aman</h3>
                          <p className="feature-desc">Emas digital kamu disimpan di fasilitas penyimpanan berizin dan diasuransikan penuh.</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <div className="icon-wrapper">
                          <img src={img_4} alt="Cair" />
                        </div>
                        <div className="text-wrapper">
                          <h3 className="feature-title">Bisa Dicairkan Kapan Saja</h3>
                          <p className="feature-desc">Kamu bisa menjual atau mencetak emas fisik sesuai saldo yang tersedia.</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <div className="icon-wrapper">
                          <img src={img_5} alt="Real-time" />
                        </div>
                        <div className="text-wrapper">
                          <h3 className="feature-title">Harga Real-time</h3>
                          <p className="feature-desc">Nilai emas digital kamu mengikuti harga pasar terkini setiap saat.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

    </div>
  );
}
