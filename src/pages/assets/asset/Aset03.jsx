import { useNavigate } from 'react-router-dom';
import img_1 from '../../../assets/images/7ad23d77f11622cbb0af82a44395f1afe17db1bf.webp';
import img_2 from '../../../assets/images/102_2053.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for Aset03 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-aset-03 to isolate this page. */

.page-aset-03 {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 36px 22px 24px 22px;
  max-width: 100%;
  min-height: 100vh;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 85% 5%, rgba(255, 159, 28, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.6) 0%, transparent 40%),
    radial-gradient(circle at 80% 25%, rgba(255, 201, 60, 0.15) 0%, transparent 50%);
  box-shadow: 0px 0px 30px rgba(26, 20, 16, 0.1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  color: #1a1410;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
}

.page-aset-03, .page-aset-03 * {
  box-sizing: border-box;
}

.page-aset-03 p,.page-aset-03  h1,.page-aset-03  h2,.page-aset-03  h3,.page-aset-03  h4,.page-aset-03  h5,.page-aset-03  h6 {
  margin: 0;
}

/* ---- inline section styles ---- */

/* CSS for section section:Hero */
.page-aset-03 #section-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 32px;
  }

  .page-aset-03 .hero-image {
    width: 126px;
    height: 131px;
    margin-bottom: 16px;
    object-fit: contain;
  }

  .page-aset-03 .hero-title {
    color: #1a1410;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .page-aset-03 .hero-subtitle {
    color: #514840;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.4;
  }

/* CSS for section section:Details */
.page-aset-03 #section-details {
    margin-bottom: 16px;
  }

  .page-aset-03 .details-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    padding: 0 16px;
  }

  .page-aset-03 .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #efe7dc;
  }

  .page-aset-03 .detail-row:last-child {
    border-bottom: none;
  }

  .page-aset-03 .detail-label {
    color: #a79c8f;
    font-size: 14px;
    font-weight: 400;
  }

  .page-aset-03 .detail-value {
    color: #1a1410;
    font-size: 14px;
    font-weight: 600;
    text-align: right;
  }

  .page-aset-03 .status-pill {
    background-color: rgba(63, 166, 107, 0.14);
    color: #3fa66b;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

/* CSS for section section:Info */
.page-aset-03 .info-box {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .page-aset-03 .info-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .page-aset-03 .info-text {
    color: #514840;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
  }

/* CSS for section section:Actions */
.page-aset-03 #section-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: auto;
    padding-top: 32px;
  }

  .page-aset-03 .btn {
    width: 100%;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    border: none;
    font-family: 'Inter', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s ease;
  }
  
  .page-aset-03 .btn:active {
    opacity: 0.8;
  }

  .page-aset-03 .btn-primary {
    background-color: #f1b04a;
    color: #1a1410;
    height: 50px;
  }

  .page-aset-03 .btn-secondary {
    background-color: transparent;
    border: 1px solid #efe7dc;
    color: #514840;
    height: 46px;
  }
`;

export default function Aset03() {
  const navigate = useNavigate();

  return (
    <div className="page-aset-03">
      <style>{styles}</style>
      <div>
              <section id="section-hero">
                <img src={img_1} alt="Success Character" className="hero-image" />
                <h1 className="hero-title">Rencana Sudah Aktif</h1>
                <p className="hero-subtitle">Rencana investasi aset kamu berhasil diaktifkan.</p>
              </section>
              <section id="section-details">
                <div className="details-card">
                  <div className="detail-row">
                    <span className="detail-label">Kategori</span>
                    <span className="detail-value">Kategori</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Nama aset</span>
                    <span className="detail-value">Nama produk</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Frekuensi</span>
                    <span className="detail-value">Siklus</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Sumber Dana</span>
                    <span className="detail-value">Saldo JelajahEmas</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status</span>
                    <span className="status-pill">Aktif</span>
                  </div>
                </div>
              </section>
              <section id="section-info">
                <div className="info-box">
                  <img src={img_2} alt="Info Icon" className="info-icon" />
                  <p className="info-text">Dengan mengaktifkan aset ini, kamu menyatakan telah membaca dan menyetujui Syarat &amp; Ketentuan yang berlaku.</p>
                </div>
              </section>
              <section id="section-actions">
                <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); navigate('/index/assets/asset-01'); }}>Lihat Rencana Investasi</button>
                <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); navigate('/index/home'); }}>Kembali ke Beranda</button>
              </section>
            </div>

    </div>
  );
}
