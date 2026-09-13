import { useNavigate } from 'react-router-dom';
import img_1 from '../../../assets/images/34_305.svg';
import img_2 from '../../../assets/images/34_313.svg';
import img_3 from '../../../assets/images/f3c7efd176c45912c54a20b6ff3074df704d1292.png';
import img_4 from '../../../assets/images/34_328.svg';
import img_5 from '../../../assets/images/34_341.svg';
import img_6 from '../../../assets/images/34_346.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for Qris — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-qris to isolate this page. */

.page-qris {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  background-color: #fffbf4;
  min-height: 100vh;
  position: relative;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  overflow-x: hidden;
  width: 100%;
}

.page-qris::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 600px;
  background: radial-gradient(circle at 80% 10%, rgba(255, 159, 28, 0.15) 0%, transparent 60%),
              radial-gradient(circle at 20% 5%, rgba(255, 255, 255, 0.8) 0%, transparent 50%);
  z-index: -1;
  pointer-events: none;
}

.page-qris, .page-qris * {
  box-sizing: border-box;
}

.page-qris p,.page-qris  h1,.page-qris  h2,.page-qris  h3,.page-qris  h4,.page-qris  h5,.page-qris  h6 {
  margin: 0;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-qris #section-header {
    padding: 20px 20px 4px 20px;
  }
  .page-qris .site-header {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .page-qris .back-button {
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
  .page-qris .page-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1410;
  }

/* CSS for section section:Status */
.page-qris #section-status {
    padding: 14px 20px 16px 20px;
  }
  .page-qris .status-banner {
    background-color: rgba(255, 159, 28, 0.1);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-qris .status-icon {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background-color: rgba(255, 159, 28, 0.18);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }
  .page-qris .status-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .page-qris .status-title {
    font-size: 14px;
    font-weight: 600;
    color: #1a1410;
  }
  .page-qris .status-subtitle {
    font-size: 12px;
    color: #a79c8f;
  }
  .page-qris .highlight-time {
    color: #d97706;
    font-weight: 600;
  }

/* CSS for section section:QRCard */
.page-qris #section-qrcard {
    padding: 0 20px 20px 20px;
  }
  .page-qris .qr-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 22px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .page-qris .logo-wrapper {
    margin-bottom: 8px;
  }
  .page-qris .qris-logo {
    height: 32px;
    width: auto;
    object-fit: contain;
  }
  .page-qris .qr-placeholder {
    width: 220px;
    height: 232px;
    background-color: #f6f1e9;
    border: 1px dashed rgba(26, 20, 16, 0.25);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  .page-qris .qr-placeholder p {
    font-size: 12px;
    color: #a79c8f;
  }
  .page-qris .billing-info {
    text-align: center;
    margin-bottom: 12px;
    width: 100%;
  }
  .page-qris .billing-label {
    font-size: 12px;
    color: #a79c8f;
    margin-bottom: 4px;
  }
  .page-qris .billing-amount {
    font-size: 24px;
    font-weight: 700;
    color: #1a1410;
  }
  .page-qris .action-buttons {
    display: flex;
    gap: 10px;
    width: 100%;
  }
  .page-qris .action-btn {
    flex: 1;
    background-color: #f6f1e9;
    border-radius: 12px;
    border: none;
    padding: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #514840;
  }

/* CSS for section section:Instructions */
.page-qris #section-instructions {
    padding: 0 20px 20px 20px;
  }
  .page-qris .section-heading {
    font-size: 14px;
    font-weight: 600;
    color: #1a1410;
    margin-bottom: 4px;
  }
  .page-qris .section-subheading {
    font-size: 12px;
    color: #a79c8f;
    line-height: 1.4;
    margin-bottom: 14px;
  }
  .page-qris .steps-list {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .page-qris .steps-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .page-qris .step-bullet {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: #960084;
    flex-shrink: 0;
  }
  .page-qris .step-text {
    font-size: 12px;
    color: #514840;
    line-height: 1.5;
    padding-top: 3px;
  }
  .page-qris .step-text strong {
    font-weight: 600;
    color: #1a1410;
  }
  .page-qris .wallet-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .page-qris .badge {
    background-color: #f6f1e9;
    color: #514840;
    font-size: 12px;
    font-weight: 500;
    padding: 7px 12px;
    border-radius: 20px;
  }

/* CSS for section section:Notes */
.page-qris #section-notes {
    padding: 0 20px 20px 20px;
  }
  .page-qris .notes-heading {
    font-size: 14px;
    font-weight: 600;
    color: #1a1410;
    margin-bottom: 8px;
  }
  .page-qris .notes-list {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .page-qris .notes-list li {
    font-size: 12px;
    color: #a79c8f;
    line-height: 1.5;
    position: relative;
    padding-left: 12px;
  }
  .page-qris .notes-list li::before {
    content: '•';
    position: absolute;
    left: 0;
    top: 0;
    color: #a79c8f;
  }
  .page-qris .disclaimer-text {
    font-size: 10px;
    color: #a79c8f;
    text-align: center;
    line-height: 1.5;
    padding: 0 10px;
  }

/* CSS for section section:FooterActions */
.page-qris #section-footer-actions {
    padding: 0 20px 24px 20px;
  }
  .page-qris .actions-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .page-qris .btn-primary {
    background-color: #f1b04a;
    color: #1a1410;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 5px;
    padding: 15px;
    width: 100%;
    cursor: pointer;
    text-align: center;
  }
  .page-qris .btn-secondary {
    background-color: transparent;
    color: #514840;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid #efe7dc;
    border-radius: 14px;
    padding: 13px;
    width: 100%;
    cursor: pointer;
    text-align: center;
  }
`;

export default function Qris() {
  const navigate = useNavigate();

  return (
    <div className="page-qris">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="site-header">
                  <button className="back-button" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="Back Icon" />
                  </button>
                  <h1 className="page-title">Instruksi Pembayaran</h1>
                </header>
              </section>
              <section id="section-status">
                <div className="status-banner">
                  <div className="status-icon">
                    <img src={img_2} alt="Clock Icon" />
                  </div>
                  <div className="status-content">
                    <h2 className="status-title">Menunggu Pembayaran</h2>
                    <p className="status-subtitle">Selesaikan dalam <span className="highlight-time">14:59</span></p>
                  </div>
                </div>
              </section>
              <section id="section-qrcard">
                <div className="qr-card">
                  <div className="logo-wrapper">
                    <img src={img_3} alt="QRIS Logo" className="qris-logo" />
                  </div>
                  <div className="qr-placeholder">
                    <img src={img_4} alt="QR Placeholder Icon" />
                    <p>+ Kode QR akan tampil di sini</p>
                  </div>
                  <div className="billing-info">
                    <p className="billing-label">Total Tagihan</p>
                    <p className="billing-amount">Rp 100.000</p>
                  </div>
                  <div className="action-buttons">
                    <button className="action-btn">
                      <img src={img_5} alt="Save Icon" />
                      <span>Simpan Gambar</span>
                    </button>
                    <button className="action-btn">
                      <img src={img_6} alt="Share Icon" />
                      <span>Bagikan</span>
                    </button>
                  </div>
                </div>
              </section>
              <section id="section-instructions">
                <div className="instructions-wrapper">
                  <h3 className="section-heading">Cara Pembayaran</h3>
                  <p className="section-subheading">Ikuti langkah berikut untuk membayar menggunakan kode QRIS di atas.</p>
                  <ul className="steps-list">
                    <li>
                      <div className="step-bullet" />
                      <p className="step-text">Buka aplikasi <strong>e-wallet</strong> atau <strong>m-Banking</strong> apa pun yang mendukung QRIS.</p>
                    </li>
                    <li>
                      <div className="step-bullet" />
                      <p className="step-text">Pilih menu <strong>Scan QR</strong> atau <strong>Pindai Kode</strong>, lalu arahkan kamera ke kode QR di atas.</p>
                    </li>
                    <li>
                      <div className="step-bullet" />
                      <p className="step-text">Periksa detail transaksi, pastikan nominal sesuai dengan <strong>Rp 100.000</strong>.</p>
                    </li>
                    <li>
                      <div className="step-bullet" />
                      <p className="step-text">Masukkan PIN atau lakukan verifikasi sesuai aplikasi yang kamu gunakan untuk menyelesaikan pembayaran.</p>
                    </li>
                    <li>
                      <div className="step-bullet" />
                      <p className="step-text">Pembayaran selesai. Simpan bukti transaksi sampai saldo terkonfirmasi masuk.</p>
                    </li>
                  </ul>
                  <div className="wallet-badges">
                    <span className="badge">GoPay</span>
                    <span className="badge">OVO</span>
                    <span className="badge">DANA</span>
                    <span className="badge">ShopeePay</span>
                    <span className="badge">m-Banking</span>
                  </div>
                </div>
              </section>
              <section id="section-notes">
                <div className="notes-wrapper">
                  <h3 className="notes-heading">Catatan Penting</h3>
                  <ul className="notes-list">
                    <li>Kode QR ini hanya berlaku untuk satu kali transaksi dan tidak dapat digunakan kembali setelah pembayaran berhasil atau waktu pembayaran berakhir.</li>
                    <li>Saldo akan otomatis masuk ke akun kamu maksimal 10 menit setelah pembayaran berhasil dikonfirmasi.</li>
                    <li>Jangan membagikan kode QR ini kepada pihak lain untuk menghindari transaksi yang tidak diinginkan.</li>
                  </ul>
                  <p className="disclaimer-text">Layanan pembayaran QRIS ini bekerja sama dengan pihak penyedia jasa pembayaran (payment gateway) pihak ketiga yang telah terverifikasi dan berizin resmi.</p>
                </div>
              </section>
              <section id="section-footer-actions">
                <div className="actions-wrapper">
                  <button className="btn-primary" onClick={(e) => { e.preventDefault(); navigate('/transactions/riwayat-isi-ulang'); }}>Saya sudah membayar</button>
                  <button className="btn-secondary" onClick={(e) => { e.preventDefault(); navigate('/support/hubungi-cs'); }}>Butuh Bantuan? Hubungi Kontak Jelajah</button>
                </div>
              </section>
            </div>

    </div>
  );
}
