import { useNavigate } from 'react-router-dom';
import img_1 from '../../../assets/images/7ad23d77f11622cbb0af82a44395f1afe17db1bf.png';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for DetailRiwayatPoin — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-detail-riwayat-poin to isolate this page. */

.page-detail-riwayat-poin {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #e5e5e5; /* Darker background for desktop viewing */
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.page-detail-riwayat-poin, .page-detail-riwayat-poin * {
  box-sizing: border-box;
}

.page-detail-riwayat-poin h1,.page-detail-riwayat-poin  p {
  margin: 0;
}

.page-detail-riwayat-poin button {
  font-family: inherit;
}

/* ---- inline section styles ---- */

/* CSS for section section:App */
.page-detail-riwayat-poin .app-container {
    width: 100%;
    max-width: 100%;
    min-height: 100vh;
    background-color: #fffbf4;
    /* Approximating the complex radial gradients from Figma with a simpler, visually similar gradient */
    background-image: radial-gradient(circle at 50% 0%, #ffe8c2 0%, #fffbf4 45%);
    display: flex;
    flex-direction: column;
    padding: 36px 22px 24px 22px;
    box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
    position: relative;
    overflow: hidden;
  }

  /* Hero Section */
  .page-detail-riwayat-poin .hero-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 22px;
  }

  .page-detail-riwayat-poin .hero-image-wrapper {
    margin-bottom: 15px;
  }

  .page-detail-riwayat-poin .hero-image {
    width: 126px;
    height: auto;
    display: block;
  }

  .page-detail-riwayat-poin .hero-title {
    color: #1a1410;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .page-detail-riwayat-poin .hero-subtitle {
    color: #514840;
    font-size: 13px;
    line-height: 1.5;
    padding: 0 10px;
  }

  /* Details Section */
  .page-detail-riwayat-poin .details-section {
    width: 100%;
    margin-bottom: 20px;
  }

  .page-detail-riwayat-poin .details-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
  }

  .page-detail-riwayat-poin .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 0;
    border-bottom: 1px solid #efe7dc;
  }

  .page-detail-riwayat-poin .detail-row:first-child {
    padding-top: 0;
  }

  .page-detail-riwayat-poin .detail-row.no-border {
    border-bottom: none;
    padding-bottom: 0;
  }

  .page-detail-riwayat-poin .detail-label {
    color: #a79c8f;
    font-size: 13px;
    font-weight: 400;
  }

  .page-detail-riwayat-poin .detail-value {
    color: #1a1410;
    font-size: 13px;
    font-weight: 600;
    text-align: right;
    max-width: 65%;
  }

  /* Spacer to push actions to bottom */
  .page-detail-riwayat-poin .spacer {
    flex-grow: 1;
    min-height: 40px;
  }

  /* Actions Section */
  .page-detail-riwayat-poin .actions-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .page-detail-riwayat-poin .btn {
    width: 100%;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    transition: opacity 0.2s ease;
  }

  .page-detail-riwayat-poin .btn:active {
    opacity: 0.8;
  }

  .page-detail-riwayat-poin .btn-primary {
    background-color: #f1b04a;
    color: #1a1410;
    border: none;
    padding: 15px;
  }

  .page-detail-riwayat-poin .btn-secondary {
    background-color: transparent;
    border: 1px solid #efe7dc;
    color: #514840;
    padding: 14px; /* Slightly less padding to account for border */
  }
`;

export default function DetailRiwayatPoin() {
  const navigate = useNavigate();

  return (
    <div className="page-detail-riwayat-poin">
      <style>{styles}</style>
      <main className="app-container">
              <section id="section-hero" className="hero-section">
                <div className="hero-image-wrapper">
                  <img src={img_1} alt="Success Character" className="hero-image" />
                </div>
                <h1 className="hero-title">Segera Ambil Hadiahnya</h1>
                <p className="hero-subtitle">Simpan tangkapan layar ini dan kirim ke layanan pelanggan Jelajah Emas untuk menukarnya ya!</p>
              </section>
              <section id="section-details" className="details-section">
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
                  <div className="detail-row no-border">
                    <span className="detail-label">Tanggal Penukaran</span>
                    <span className="detail-value">10/09/2026 17:32:01</span>
                  </div>
                </div>
              </section>
              <div className="spacer" />
              <section id="section-actions" className="actions-section">
                <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); navigate('/rewards/riwayat-poin'); }}>Kembali ke Riwayat Poin</button>
                <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); navigate('/rewards/poin-mall-01'); }}>Tukar Poin Lainnya</button>
              </section>
            </main>

    </div>
  );
}
