import { useState } from 'react';
import { goBack } from '../../lib/backNav.js';
/* POST /api/vouchers/claim/ — redeem a voucher code for a balance credit. */
import { claimVoucher } from '../../lib/vouchersApi.js';
/* API notifications (success/error) open the shared /notif screen. */
import { useShowNotif } from '../../lib/useShowNotif.js';
import NotifCard from '../../components/NotifCard.jsx';
import ListState from '../../components/ListState.jsx';
/* Riwayat Redeem reads the user's VOUCHER transactions (GET /api/transactions/). */
import { useTransactionFeed } from '../../lib/useTransactionFeed.js';
import { formatAmountLabel, formatRupiah, parseDate } from '../../lib/transactionFormat.js';
import img_1 from '../../assets/images/102_2017.svg';
import img_2 from '../../assets/images/6ea7969d642adfbb038f569e995e7ac2259bb145.webp';
import img_3 from '../../assets/images/102_2039.svg';
import img_4 from '../../assets/images/102_2053.svg';
import img_5 from '../../assets/images/83771caf3290878852dfea1999f709535d158b8b.png';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for RedeemKode — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-redeem-kode to isolate this page. */

.page-redeem-kode {
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.page-redeem-kode {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 80% -10%, rgba(255, 201, 60, 0.28) 0%, transparent 50%),
    radial-gradient(circle at 110% 20%, rgba(255, 159, 28, 0.25) 0%, transparent 60%);
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  position: relative;
  overflow-x: hidden;
  color: #1a1410;
}

.page-redeem-kode, .page-redeem-kode * {
  box-sizing: border-box;
}

.page-redeem-kode h1,.page-redeem-kode  h2,.page-redeem-kode  h3,.page-redeem-kode  h4,.page-redeem-kode  p {
  margin: 0;
}

.page-redeem-kode button {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
}

.page-redeem-kode input {
  border: none;
  background: none;
  outline: none;
  font-family: inherit;
}

.page-redeem-kode .px-20 {
  padding-left: 20px;
  padding-right: 20px;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-redeem-kode .header-container {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 20px 4px 20px;
  }
  .page-redeem-kode .back-btn {
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s;
  }
  .page-redeem-kode .back-btn:hover {
    background-color: #ece5d8;
  }
  .page-redeem-kode .header-title {
    color: #1a1410;
    font-size: 16px;
    font-weight: 700;
  }

/* CSS for section section:Hero */
.page-redeem-kode #section-hero {
    margin-top: 10px;
  }
  .page-redeem-kode .hero-image {
    width: 128px;
    height: 126px;
    object-fit: cover;
    display: block;
    margin-bottom: 8px;
  }
  .page-redeem-kode .hero-title {
    color: #1a1410;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .page-redeem-kode .hero-subtitle {
    color: #514840;
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 22px;
  }

/* CSS for section section:RedeemForm */
.page-redeem-kode .input-label {
    display: block;
    color: #514840;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .page-redeem-kode .input-container {
    background-color: #f6f1e9;
    border-radius: 14px;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 10px;
    margin-bottom: 24px;
  }
  .page-redeem-kode .input-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  .page-redeem-kode .redeem-input {
    flex: 1;
    font-size: 14px;
    color: #1a1410;
    min-width: 0;
  }
  .page-redeem-kode .redeem-input::placeholder {
    color: #a79c8f;
  }
  .page-redeem-kode .paste-btn {
    background-color: #ffffff;
    color: #514840;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 8px;
    flex-shrink: 0;
    transition: background-color 0.2s;
  }
  .page-redeem-kode .paste-btn:hover {
    background-color: #f0f0f0;
  }
  .page-redeem-kode .redeem-btn {
    width: 100%;
    background-color: #f1b04a;
    color: #1a1410;
    font-size: 16px;
    font-weight: 700;
    padding: 15px;
    border-radius: 14px;
    text-align: center;
    margin-bottom: 32px;
    transition: opacity 0.2s;
  }
  .page-redeem-kode .redeem-btn:hover {
    opacity: 0.9;
  }
  .page-redeem-kode .redeem-btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

/* CSS for section section:Info */
.page-redeem-kode .info-box {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 32px;
  }
  .page-redeem-kode .info-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .page-redeem-kode .info-text {
    color: #514840;
    font-size: 12px;
    line-height: 1.5;
  }
  .page-redeem-kode .info-text strong {
    font-weight: 700;
    color: #1a1410;
  }

/* CSS for section section:History */
.page-redeem-kode .history-title {
    color: #1a1410;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .page-redeem-kode .history-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 40px;
  }
  .page-redeem-kode .history-item {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 14px;
    padding: 13px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-redeem-kode .history-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    flex-shrink: 0;
  }
  .page-redeem-kode .history-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .page-redeem-kode .history-code {
    color: #1a1410;
    font-size: 14px;
    font-weight: 700;
  }
  .page-redeem-kode .history-date {
    color: #a79c8f;
    font-size: 12px;
  }
  .page-redeem-kode .history-points {
    color: #3fa66b;
    font-size: 14px;
    font-weight: 700;
  }
`;

/* wallet_type from the claim response -> display label (same wording as the
   fund-source labels across the app). */
const WALLET_LABELS = {
  BALANCE: 'Saldo JelajahEmas',
  BALANCE_DEPOSIT: 'Saldo Deposit',
};

/* Riwayat Redeem: transaksi bertipe VOUCHER dari GET /api/transactions/.
   Konstanta modul supaya identitas array stabil antar-render (dipakai
   sebagai dependency di useTransactionFeed). */
const HISTORY_TYPES = ['VOUCHER'];

/* "28 Agu 2026" — tanggal ringkas untuk baris riwayat redeem. */
function formatShortDate(iso) {
  const date = parseDate(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function RedeemKode() {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const showNotif = useShowNotif();
  /* Riwayat redeem termuat saat mount; setelah klaim sukses halaman remount
     (auto-return dari /notif) sehingga daftar ikut menyegarkan diri. */
  const { items: historyItems, loading: historyLoading, error: historyError } = useTransactionFeed(HISTORY_TYPES);

  /* Redeem: POST /api/vouchers/claim/. Both the empty-code check and API
     failures surface through the /notif screen. */
  const handleRedeem = async () => {
    if (submitting) return;
    const trimmed = code.trim();
    if (!trimmed) {
      showNotif({ title: 'Lengkapi Data', description: 'Masukkan kode redeem terlebih dahulu.' });
      return;
    }
    setSubmitting(true);
    try {
      const data = await claimVoucher({ code: trimmed });
      const walletLabel = WALLET_LABELS[String(data?.wallet_type || '').toUpperCase()] || 'saldo kamu';
      showNotif({
        variant: 'success',
        title: 'Voucher Berhasil Diklaim',
        description: `Kode ${data?.voucher_code || trimmed} berhasil diklaim. ${formatRupiah(data?.amount)} ditambahkan ke ${walletLabel} — saldo terbaru kamu ${formatRupiah(data?.balance)}.`,
      });
      setCode('');
    } catch (err) {
      showNotif({
        variant: 'error',
        title: 'Redeem Gagal',
        description: err?.message || 'Voucher gagal diklaim. Silakan coba lagi.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* "Tempel" fills the input from the clipboard; when the browser blocks
     clipboard access the user can still type the code manually. */
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setCode(text.trim());
      }
    } catch {
      showNotif({ variant: 'error', title: 'Gagal Membaca Clipboard', description: 'Tidak dapat membaca clipboard. Ketik kodenya secara manual.' });
    }
  };

  return (
    <div className="page-redeem-kode">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header-container">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/home'); }}>
                    <img src={img_1} alt="Back" />
                  </button>
                  <h1 className="header-title">Redeem Kode</h1>
                </header>
              </section>
              <section id="section-hero" className="px-20">
                <img src={img_2} alt="Redeem Illustration" className="hero-image" />
                <div className="hero-text">
                  <h2 className="hero-title">Punya Kode Redeem?</h2>
                  <p className="hero-subtitle">Masukkan kode voucher atau<br />kode promo yang kamu punya untuk klaim hadiahnya.</p>
                </div>
              </section>
              <section id="section-redeem-form" className="px-20">
                <label className="input-label">Kode Redeem</label>
                <div className="input-container">
                  <img src={img_3} alt="Icon" className="input-icon" />
                  <input
                    type="text"
                    placeholder="Masukkan kode di sini"
                    className="redeem-input"
                    value={code}
                    maxLength={50}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleRedeem(); } }}
                  />
                  <button className="paste-btn" onClick={(e) => { e.preventDefault(); handlePaste(); }}>Tempel</button>
                </div>
                <button className="redeem-btn" disabled={submitting} onClick={(e) => { e.preventDefault(); handleRedeem(); }}>
                  {submitting ? 'Memproses...' : 'Redeem Sekarang'}
                </button>
              </section>
              <section id="section-info" className="px-20">
                <div className="info-box">
                  <img src={img_4} alt="Info" className="info-icon" />
                  <p className="info-text">
                  Kode redeem bisa kamu dapatkan dari <strong>event, media sosial resmi, atau undangan teman</strong>. Satu kode hanya bisa dipakai sekali.
                  </p>
                </div>
              </section>
              <section id="section-history" className="px-20">
                <h3 className="history-title">Riwayat Redeem</h3>
                <div className="history-list">
                  {historyError ? (
                    <NotifCard variant="error" title="Gagal Memuat Riwayat" description={historyError} />
                  ) : historyLoading ? (
                    <ListState text="Memuat riwayat…" />
                  ) : historyItems.length === 0 ? (
                    <ListState text="Belum ada voucher yang ditukar." />
                  ) : (
                    /* Detail: kode voucher ditampilkan langsung (Riwayat Lainnya
                       hanya menampilkan judul generik "Menukarkan Kode"). */
                    historyItems.map((trx) => (
                      <div className="history-item" key={trx.id ?? `${trx.voucher_code}-${trx.created_at}`}>
                        <img src={img_5} alt="Voucher" className="history-icon" />
                        <div className="history-details">
                          <div className="history-code">{trx.voucher_code || 'Voucher'}</div>
                          <div className="history-date">{formatShortDate(trx.created_at)}</div>
                        </div>
                        <div className="history-points">{formatAmountLabel(trx.amount, trx.currency_code)}</div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

    </div>
  );
}
