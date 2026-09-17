import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { goBack } from '../../../lib/backNav.js';
import { QRCodeCanvas } from 'qrcode.react';
import img_1 from '../../../assets/images/34_305.svg';
import img_2 from '../../../assets/images/34_313.svg';
import img_3 from '../../../assets/images/f3c7efd176c45912c54a20b6ff3074df704d1292.webp';
import img_5 from '../../../assets/images/34_341.svg';
import img_6 from '../../../assets/images/34_346.svg';
/* Nominal ditampilkan dari route state (dibuat di Isi Ulang lewat MGM /
   LPAY / FF Pay). */
import { formatIDR } from '../../../lib/goldPriceApi.js';
/* Hasil simpan/bagikan tampil lewat halaman /notif. */
import { useShowNotif } from '../../../lib/useShowNotif.js';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/* Masa berlaku dari `expires_at` ISO UTC gateway; '' bila kosong/tak valid.
   Ditampilkan dalam zona waktu perangkat. */
function formatExpiry(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${date.getDate()} ${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}, ${hh}:${mm}`;
}

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
  /* Kerangka kode QR — gambar dari gateway (pay_data) atau generate lokal. */
  .page-qris .qr-placeholder {
    width: 220px;
    height: 232px;
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
  }
  /* Gambar QR dari gateway (pay_data QR_URL / qr_image LPAY). */
  .page-qris .qr-image {
    width: 196px;
    height: 196px;
    object-fit: contain;
    display: block;
  }
  /* Teks cadangan saat gambar QR gagal dimuat dan tidak ada konten lokal. */
  .page-qris .qr-fallback-text {
    font-size: 12px;
    color: #a79c8f;
    text-align: center;
    line-height: 1.5;
    padding: 0 16px;
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
  const location = useLocation();
  const showNotif = useShowNotif();
  const qrBoxRef = useRef(null);
  /* Gambar QR gateway gagal dimuat → jatuh kembali ke generate lokal. */
  const [imageFailed, setImageFailed] = useState(false);

  /* Data pembayaran dibuat di Isi Ulang (MGM / LPAY initiate / FF Pay
     initiate + select-method) dan diteruskan lewat route state; tanpa state
     (buka langsung / refresh) tidak ada pembayaran aktif. */
  const payment = (location.state?.qrImageUrl || location.state?.qrUrl || location.state?.qrContent)
    ? location.state
    : null;

  useEffect(() => {
    if (!payment) {
      showNotif({ title: 'Data Pembayaran Tidak Ditemukan', description: 'Silakan ulangi proses isi ulang saldo.' });
      navigate('/index/transactions/topup', { replace: true });
    }
  }, [navigate, payment, showNotif]);

  if (!payment) return null;

  const amountLabel = formatIDR(Number(payment.amount) || 0);
  const expiryLabel = formatExpiry(payment.expiresAt);
  /* QR tampil sebagai gambar (`pay_data` QR_URL atau `qr_image`); bila
     gambar tidak ada / gagal dimuat, kontennya (`pay_data` mentah /
     `qr_string`) digenerate lokal lewat QRCodeCanvas. */
  const showQrImage = Boolean(payment.qrImageUrl) && !imageFailed;
  const qrContent = payment.qrContent || payment.qrUrl || '';

  const getQrCanvas = () => qrBoxRef.current?.querySelector('canvas') || null;

  /* "Simpan Gambar": QR generatan lokal diunduh sebagai berkas PNG; gambar
     gateway berupa data URL (LPAY) diunduh langsung, gambar lintas-origin
     (MGM) dibuka di tab baru karena tak bisa ditarik lewat canvas. */
  const handleSaveImage = () => {
    const canvas = getQrCanvas();
    if (canvas) {
      try {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'qris-jelajah-emas.png';
        document.body.appendChild(link);
        link.click();
        link.remove();
        showNotif({ variant: 'success', title: 'Gambar Disimpan', description: 'Kode QR disimpan ke perangkat kamu.' });
        return;
      } catch {
        /* Unduhan gagal — coba jalur gambar gateway di bawah. */
      }
    }
    if (payment.qrImageUrl) {
      /* data URL bisa diunduh langsung (atribut download); navigasi tab ke
         data URL diblokir browser. Gambar lintas-origin dibuka di tab baru. */
      const isDataUrl = /^data:/i.test(payment.qrImageUrl);
      const link = document.createElement('a');
      link.href = payment.qrImageUrl;
      if (isDataUrl) {
        link.download = 'qris-jelajah-emas.png';
      } else {
        link.target = '_blank';
        link.rel = 'noopener';
      }
      document.body.appendChild(link);
      link.click();
      link.remove();
      showNotif({
        variant: 'success',
        title: isDataUrl ? 'Gambar Disimpan' : 'Gambar QR Dibuka',
        description: isDataUrl ? 'Kode QR disimpan ke perangkat kamu.' : 'Tekan lama gambar QR untuk menyimpannya ke perangkat.',
      });
      return;
    }
    showNotif({ title: 'Gagal Menyimpan', description: 'Tidak dapat menyimpan gambar. Coba lagi ya.' });
  };

  /* "Bagikan": pakai Web Share API — utamakan berbagi gambar QR kalau
     didukung; kalau tidak tersedia, detail pembayaran disalin ke clipboard. */
  const handleShare = async () => {
    const text = `Bayar ${amountLabel} via QRIS Jelajah Emas. Pilih menu Scan QR di e-wallet atau m-Banking, lalu pindai kodenya.`;
    const canvas = getQrCanvas();
    let file = null;
    if (canvas) {
      try {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (blob) file = new File([blob], 'qris-jelajah-emas.png', { type: 'image/png' });
      } catch {
        /* Gambar gagal dibuat — lanjut tanpa lampiran gambar. */
      }
    }
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'QRIS Jelajah Emas', text });
      } catch {
        /* Pengguna menutup share sheet — tidak ada aksi lanjutan. */
      }
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({ title: 'QRIS Jelajah Emas', text });
      } catch {
        /* Pengguna menutup share sheet — tidak ada aksi lanjutan. */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showNotif({ variant: 'success', title: 'Teks Dibagikan', description: 'Detail pembayaran disalin ke clipboard. Tempel di chat atau media sosial kamu.' });
    } catch {
      showNotif({ title: 'Gagal Membagikan', description: 'Tidak dapat membagikan detail pembayaran. Coba lagi ya.' });
    }
  };

  return (
    <div className="page-qris">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="site-header">
                  <button className="back-button" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/transactions/topup'); }}>
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
                    <p className="status-subtitle">
                      {expiryLabel
                        ? <>Selesaikan sebelum <span className="highlight-time">{expiryLabel}</span></>
                        : 'Segera selesaikan pembayaran sebelum waktu kedaluwarsa.'}
                    </p>
                  </div>
                </div>
              </section>
              <section id="section-qrcard">
                <div className="qr-card">
                  <div className="logo-wrapper">
                    <img src={img_3} alt="QRIS Logo" className="qris-logo" />
                  </div>
                  <div className="qr-placeholder" ref={qrBoxRef}>
                    {showQrImage ? (
                      <img className="qr-image" src={payment.qrImageUrl} alt="Kode QRIS pembayaran" onError={() => setImageFailed(true)} />
                    ) : qrContent ? (
                      <QRCodeCanvas value={qrContent} size={196} fgColor="#1a1410" bgColor="#ffffff" level="M" />
                    ) : (
                      <p className="qr-fallback-text">Kode QR tidak tersedia. Kembali dan buat ulang pembayaran ya.</p>
                    )}
                  </div>
                  <div className="billing-info">
                    <p className="billing-label">Total Tagihan</p>
                    <p className="billing-amount">{amountLabel}</p>
                  </div>
                  <div className="action-buttons">
                    <button className="action-btn" onClick={(e) => { e.preventDefault(); handleSaveImage(); }}>
                      <img src={img_5} alt="Save Icon" />
                      <span>Simpan Gambar</span>
                    </button>
                    <button className="action-btn" onClick={(e) => { e.preventDefault(); handleShare(); }}>
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
                      <p className="step-text">Periksa detail transaksi, pastikan nominal sesuai dengan <strong>{amountLabel}</strong>.</p>
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
                  <button className="btn-primary" onClick={(e) => { e.preventDefault(); navigate('/index/transactions/balance'); }}>Saya sudah membayar</button>
                  <button className="btn-secondary" onClick={(e) => { e.preventDefault(); navigate('/index/support/hubungi-cs'); }}>Butuh Bantuan? Hubungi Kontak Jelajah</button>
                </div>
              </section>
            </div>

    </div>
  );
}
