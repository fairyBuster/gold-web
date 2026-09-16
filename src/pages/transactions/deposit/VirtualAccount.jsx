import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img_1 from '../../../assets/images/36_421.svg';
import img_2 from '../../../assets/images/34_313.svg';
import img_3 from '../../../assets/images/ce5e15fdc0235c8752e5673a09627b9fdbe74d46.png';
/* Page background artwork — assigned inline on the root node (see styles). */
import img_4 from '../../../assets/images/083535.png';
/* Hasil salin tampil lewat halaman /notif kalau clipboard diblokir browser. */
import { useShowNotif } from '../../../lib/useShowNotif.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for VirtualAccount — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-virtual-account to isolate this page. */

.page-virtual-account {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  background-color: #fffbf4;
  /* Background artwork (assigned inline from the imported asset) is a
     full-page image with glows anchored to the top/bottom — stretch it. */
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: top center;
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  color: #1a1410;
  width: 100%;
}

.page-virtual-account, .page-virtual-account * {
  box-sizing: border-box;
}

.page-virtual-account h1,.page-virtual-account  h2,.page-virtual-account  h3,.page-virtual-account  p,.page-virtual-account  ul {
  margin: 0;
  padding: 0;
}

.page-virtual-account button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-virtual-account #section-header {
  padding: 20px;
}
.page-virtual-account .header {
  display: flex;
  align-items: center;
  gap: 14px;
}
.page-virtual-account .back-btn {
  width: 36px;
  height: 36px;
  background-color: #f6f1e9;
  border-radius: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
.page-virtual-account .title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
}

/* CSS for section section:Status */
.page-virtual-account #section-status {
  padding: 14px 20px;
}
.page-virtual-account .status-banner {
  background-color: rgba(255, 159, 28, 0.1);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.page-virtual-account .icon-wrapper {
  width: 36px;
  height: 36px;
  background-color: rgba(255, 159, 28, 0.18);
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
.page-virtual-account .status-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.page-virtual-account .status-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1410;
}
.page-virtual-account .status-desc {
  font-size: 12px;
  color: #514840;
}
.page-virtual-account .highlight {
  color: #ff9f1c;
  font-weight: 700;
}

/* CSS for section section:PaymentCard */
.page-virtual-account #section-payment-card {
  padding: 16px 20px;
}
.page-virtual-account .card-container {
  background: radial-gradient(circle at 41.6% 43.7%, #241c16 0%, #1a1410 55%, #120d09 100%);
  border-radius: 22px;
  padding: 20px 22px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-virtual-account .mascot-img {
  position: absolute;
  top: -8px;
  right: 0;
  width: 107px;
  height: 114px;
  z-index: 1;
}
.page-virtual-account .card-header h2 {
  color: #fff9f2;
  font-size: 14px;
  font-weight: 700;
  position: relative;
  z-index: 2;
}
.page-virtual-account .account-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  z-index: 2;
}
.page-virtual-account .label {
  color: rgba(255, 249, 242, 0.5);
  font-size: 12px;
}
.page-virtual-account .number-box {
  background-color: #fff9f2;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-virtual-account .number {
  color: #1a1410;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.page-virtual-account .copy-btn {
  background-color: #f6f1e9;
  color: #514840;
  border-radius: 8px;
  padding: 7px 11px;
  font-size: 12px;
  font-weight: 700;
}
.page-virtual-account .total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 249, 242, 0.14);
  position: relative;
  z-index: 2;
}
.page-virtual-account .amount {
  color: #fff9f2;
  font-size: 16px;
  font-weight: 700;
}

/* CSS for section section:PaymentMethods */
.page-virtual-account #section-payment-methods {
  padding: 20px;
}
.page-virtual-account .methods-header {
  margin-bottom: 14px;
}
.page-virtual-account .methods-header h2 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
}
.page-virtual-account .methods-header p {
  font-size: 12px;
  color: #a79c8f;
  line-height: 1.4;
}
.page-virtual-account .tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
}
.page-virtual-account .tab {
  flex: 1;
  padding: 9px 4px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}
.page-virtual-account .tab.active {
  background-color: #1a1410;
  color: #fff9f2;
}
.page-virtual-account .tab:not(.active) {
  background-color: #f6f1e9;
  color: #514840;
}
.page-virtual-account .steps-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.page-virtual-account .step-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.page-virtual-account .step-circle {
  width: 24px;
  height: 24px;
  background-color: #960084;
  border-radius: 12px;
  flex-shrink: 0;
}
.page-virtual-account .step-item p {
  font-size: 12px;
  color: #514840;
  line-height: 1.4;
  padding-top: 4px;
}

/* CSS for section section:ImportantNotes */
.page-virtual-account #section-important-notes {
  padding: 0 20px 20px 20px;
}
.page-virtual-account #section-important-notes h2 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
}
.page-virtual-account .notes-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.page-virtual-account .notes-list li {
  font-size: 12px;
  color: #a79c8f;
  line-height: 1.4;
  position: relative;
  padding-left: 12px;
}
.page-virtual-account .notes-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  top: 0;
  color: #a79c8f;
}

/* CSS for section section:Actions */
.page-virtual-account #section-actions {
  padding: 0 20px 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.page-virtual-account .btn-primary {
  background-color: #f1b04a;
  color: #1a1410;
  font-size: 14px;
  font-weight: 700;
  padding: 15px;
  border-radius: 5px;
  width: 100%;
  text-align: center;
}
.page-virtual-account .btn-secondary {
  background-color: transparent;
  color: #514840;
  font-size: 12px;
  font-weight: 700;
  padding: 13px;
  border-radius: 14px;
  border: 1px solid #efe7dc;
  width: 100%;
  text-align: center;
}
`;

/* Nomor Virtual Account — satu sumber untuk tampilan dan tombol Salin. */
const VA_NUMBER = '8808 1234 5678 90';

/* Payment channels shown as tabs, with the instruction steps per channel. */
const PAYMENT_METHODS = [
  {
    id: 'm-banking',
    label: 'm-Banking',
    steps: [
      'Buka aplikasi BRImo, lalu pilih menu pembayaran BRIVA.',
      'Masukkan nomor BRI Virtual Account yang tertera di atas.',
      'Periksa detail transaksi dan pastikan nominal pembayaran sesuai dengan total tagihan.',
      'Ikuti petunjuk pada aplikasi dan lakukan verifikasi untuk menyelesaikan pembayaran.',
      'Pembayaran selesai. Simpan bukti transaksi sampai saldo terkonfirmasi masuk.',
    ],
  },
  {
    id: 'atm',
    label: 'ATM',
    steps: [
      'Masukkan kartu ATM BRI kamu, lalu masukkan PIN.',
      'Pilih menu "Transaksi Lain", lalu pilih "Pembayaran" dan pilih "BRIVA".',
      'Masukkan nomor BRI Virtual Account yang tertera di atas.',
      'Periksa detail transaksi dan pastikan nominal pembayaran sesuai dengan total tagihan.',
      'Konfirmasi pembayaran, lalu simpan struk sebagai bukti transaksi.',
    ],
  },
  {
    id: 'internet-banking',
    label: 'Internet Banking',
    steps: [
      'Login ke Internet Banking BRI (ib.bri.co.id) dengan user ID dan password kamu.',
      'Pilih menu "Pembayaran", lalu pilih "BRIVA".',
      'Masukkan nomor BRI Virtual Account yang tertera di atas.',
      'Periksa detail transaksi dan pastikan nominal pembayaran sesuai dengan total tagihan.',
      'Masukkan mToken untuk menyelesaikan pembayaran, lalu simpan bukti transaksi.',
    ],
  },
];

export default function VirtualAccount() {
  const navigate = useNavigate();
  const [activeMethod, setActiveMethod] = useState(PAYMENT_METHODS[0].id);
  const [copied, setCopied] = useState(false);
  const showNotif = useShowNotif();
  const method = PAYMENT_METHODS.find((item) => item.id === activeMethod) || PAYMENT_METHODS[0];

  /* "Salin" menyalin nomor Virtual Account ke clipboard; label tombol berubah
     sesaat sebagai umpan balik (mengikuti pola halaman Misi). */
  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(VA_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showNotif({ title: 'Gagal Menyalin', description: 'Tidak dapat menyalin nomor. Salin manual ya.' });
    }
  };

  return (
    <div className="page-virtual-account" style={{ backgroundImage: `url(${img_4})` }}>
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="" />
                  </button>
                  <h1 className="title">Instruksi Pembayaran</h1>
                </header>
              </section>
              <section id="section-status">
                <div className="status-banner">
                  <div className="icon-wrapper">
                    <img src={img_2} alt="" />
                  </div>
                  <div className="status-info">
                    <div className="status-title">Menunggu Pembayaran</div>
                    <div className="status-desc">Selesaikan dalam <span className="highlight">23:41:09</span></div>
                  </div>
                </div>
              </section>
              <section id="section-payment-card">
                <div className="card-container">
                  <img src={img_3} alt="Mascot" className="mascot-img" />
                  <div className="card-header">
                    <h2>Virtual Account BRI</h2>
                  </div>
                  <div className="account-section">
                    <div className="label">Nomor Virtual Account</div>
                    <div className="number-box">
                      <span className="number">{VA_NUMBER}</span>
                      <button className="copy-btn" onClick={(e) => { e.preventDefault(); handleCopyNumber(); }}>
                        {copied ? 'Tersalin!' : 'Salin'}
                      </button>
                    </div>
                  </div>
                  <div className="total-section">
                    <div className="label">Total Tagihan</div>
                    <div className="amount">Rp 100.000</div>
                  </div>
                </div>
              </section>
              <section id="section-payment-methods">
                <div className="methods-header">
                  <h2>Cara Pembayaran</h2>
                  <p>Ikuti langkah-langkah berikut sesuai channel yang kamu gunakan untuk menyelesaikan pembayaran.</p>
                </div>
                <div className="tabs">
                  {PAYMENT_METHODS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`tab${item.id === activeMethod ? ' active' : ''}`}
                      onClick={() => setActiveMethod(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="steps-list">
                  {method.steps.map((step) => (
                    <div className="step-item" key={step}>
                      <div className="step-circle" />
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section id="section-important-notes">
                <h2>Catatan Penting</h2>
                <ul className="notes-list">
                  <li>Lakukan pembayaran sesuai nominal yang tertera secara persis, termasuk tiga digit terakhir jika ada.</li>
                  <li>Saldo akan otomatis masuk ke akun kamu maksimal 10 menit setelah pembayaran berhasil dikonfirmasi oleh bank.</li>
                  <li>Kode Virtual Account ini hanya berlaku untuk satu kali transaksi dan akan kedaluwarsa sesuai waktu yang tertera di atas.</li>
                  <li>Jangan melakukan pembayaran lebih dari satu kali untuk nomor Virtual Account yang sama.</li>
                </ul>
              </section>
              <section id="section-actions">
                <button className="btn-primary" onClick={(e) => { e.preventDefault(); navigate('/index/transactions/riwayat-isi-ulang'); }}>Saya sudah membayar</button>
                <button className="btn-secondary" onClick={(e) => { e.preventDefault(); navigate('/index/support/hubungi-cs'); }}>Butuh Bantuan? Hubungi Kontak Jelajah</button>
              </section>
            </div>

    </div>
  );
}
 