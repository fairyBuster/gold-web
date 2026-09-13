import { useState } from 'react';
import img_1 from '../../../assets/images/109_2465.svg';
import img_2 from '../../../assets/images/915ddfcd2308a67f93cb52100b8c074abaa5928b.png';
import img_3 from '../../../assets/images/77ee91c8dada95217ef849cd09311a9e69dfd60e.png';
import NotifCard from '../../../components/NotifCard.jsx';
import ListPagination from '../../../components/ListPagination.jsx';
import ListState from '../../../components/ListState.jsx';
import { useTransactionFeed } from '../../../lib/useTransactionFeed.js';
import { formatRupiah, formatTime, groupByDay, parseDate, statusKind } from '../../../lib/transactionFormat.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for RiwayatIsiUlang — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-riwayat-isi-ulang to isolate this page. */

.page-riwayat-isi-ulang {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #e9ecef; /* Desktop background for contrast */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  width: 100%;
}

/* Fixed mobile background frame */
.page-riwayat-isi-ulang::before {
    content: '';
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 100%;
    height: 100vh;
    background-color: #fffbf4;
    background-image:
        radial-gradient(circle at 76.9% 11.5%, rgba(255, 201, 60, 0.28) 0%, rgba(255, 201, 60, 0) 70%),
        radial-gradient(circle at 111.1% 25.5%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 70%),
        radial-gradient(circle at 90.9% -40.9%, rgba(255, 159, 28, 0.38) 0%, rgba(255, 159, 28, 0) 70%);
    z-index: -1;
    box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
}

.page-riwayat-isi-ulang .section-wrapper {
    max-width: 100%;
    margin: 0 auto;
    width: 100%;
    position: relative;
    box-sizing: border-box;
}

.page-riwayat-isi-ulang, .page-riwayat-isi-ulang * {
    box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-riwayat-isi-ulang .header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 20px 16px 20px;
}
.page-riwayat-isi-ulang .back-btn {
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.2s;
}
.page-riwayat-isi-ulang .back-btn:active {
    opacity: 0.7;
}
.page-riwayat-isi-ulang .page-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
}

/* CSS for section section:Hero */
.page-riwayat-isi-ulang .hero-container {
    padding: 0 20px 20px 20px;
}
.page-riwayat-isi-ulang .summary-card {
    background: radial-gradient(circle at 41.6% 43.7%, #241c16 0%, #1a1410 55%, #120d09 100%);
    border-radius: 20px;
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 102px;
}
.page-riwayat-isi-ulang .summary-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.page-riwayat-isi-ulang .summary-label {
    color: rgba(255, 249, 242, 0.55);
    font-size: 12px;
    font-weight: 400;
    margin: 0;
}
.page-riwayat-isi-ulang .summary-amount {
    color: #7fd9a6;
    font-size: 24px;
    font-weight: 700;
    margin: 2px 0 0 0;
    line-height: 1.1;
}
.page-riwayat-isi-ulang .summary-count {
    color: rgba(255, 249, 242, 0.5);
    font-size: 12px;
    font-weight: 400;
    margin: 4px 0 0 0;
}
.page-riwayat-isi-ulang .summary-image {
    position: absolute;
    left: 195px;
    top: -50px;
    width: 227px;
    height: 227px;
    z-index: 1;
    pointer-events: none;
}

/* CSS for section section:History */
.page-riwayat-isi-ulang .history-container {
    padding: 0 20px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
}
.page-riwayat-isi-ulang .history-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.page-riwayat-isi-ulang .history-date {
    font-size: 12px;
    font-weight: 600;
    color: #514840;
    margin: 0;
    padding-left: 2px;
}
.page-riwayat-isi-ulang .history-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    padding: 13px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background-color 0.2s;
    cursor: pointer;
}
.page-riwayat-isi-ulang .history-card:active {
    background-color: #fcfcfc;
}
.page-riwayat-isi-ulang .history-icon {
    width: 43px;
    height: 43px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
}
.page-riwayat-isi-ulang .history-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex-grow: 1;
    min-width: 0; /* Prevents text overflow issues in flexbox */
}
.page-riwayat-isi-ulang .history-title {
    font-size: 14px;
    font-weight: 600;
    color: #1a1410;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.page-riwayat-isi-ulang .history-subtitle {
    font-size: 11px;
    color: #a79c8f;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.page-riwayat-isi-ulang .history-status {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-end;
    flex-shrink: 0;
}
.page-riwayat-isi-ulang .history-amount {
    font-size: 14px;
    font-weight: 600;
    color: #3fa66b;
    margin: 0;
}
.page-riwayat-isi-ulang .history-state {
    font-size: 11px;
    color: #a79c8f;
    margin: 0;
}
`;

/* Every deposit is fetched page-by-page and merged newest-first. */
const DEPOSIT_TYPES = ['DEPOSIT'];

/* Only settled top-ups belong in this history — PENDING/FAILED rows are excluded server-side. */
const DEPOSIT_FEED_OPTIONS = { status: 'COMPLETED' };

/* "Muat Lebih Banyak" reveals the next batch of this many loaded items. */
const HISTORY_PAGE_SIZE = 8;

/* Status group → right-hand state label. */
const STATUS_LABELS = { success: 'Berhasil', pending: 'Diproses', failed: 'Gagal' };

/* One-line card detail: time + backend description (deposit channel). */
function buildSubtitle(trx) {
  return [formatTime(trx.created_at), trx.description].filter(Boolean).join(' • ');
}

export default function RiwayatIsiUlang() {
  const { items, loading, error } = useTransactionFeed(DEPOSIT_TYPES, DEPOSIT_FEED_OPTIONS);
  const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE_SIZE);

  /* Totals for the current calendar month. */
  const now = new Date();
  const monthly = items.filter((trx) => {
    const date = parseDate(trx.created_at);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
  const monthlyTotal = monthly.reduce((sum, trx) => sum + Math.abs(Number(trx.amount) || 0), 0);
  const groups = groupByDay(items.slice(0, visibleCount));

  return (
    <div className="page-riwayat-isi-ulang">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <div className="section-wrapper">
                  <header className="header">
                    <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                      <img src={img_1} alt="" />
                    </button>
                    <h1 className="page-title">Riwayat Isi Ulang</h1>
                  </header>
                </div>
              </section>
              <section id="section-hero">
                <div className="section-wrapper">
                  <div className="hero-container">
                    <div className="summary-card">
                      <div className="summary-content">
                        <p className="summary-label">Total Isi Ulang Bulan Ini</p>
                        <p className="summary-amount">+{formatRupiah(monthlyTotal)}</p>
                        <p className="summary-count">{monthly.length} transaksi</p>
                      </div>
                      <img src={img_2} alt="" className="summary-image" />
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-history">
                <div className="section-wrapper">
                  <div className="history-container">
                    {error ? (
                      <NotifCard variant="error" title="Gagal Memuat Riwayat" description={error} />
                    ) : loading ? (
                      <ListState text="Memuat riwayat…" />
                    ) : groups.length === 0 ? (
                      <ListState text="Belum ada riwayat isi ulang." />
                    ) : (
                      <>
                        {groups.map((group) => (
                          <div className="history-group" key={group.label}>
                            <h2 className="history-date">{group.label}</h2>
                            {group.items.map((trx) => (
                              <div className="history-card" key={trx.id ?? `${trx.type}-${trx.created_at}`}>
                                <img src={img_3} alt="Isi Ulang Icon" className="history-icon" />
                                <div className="history-details">
                                  <p className="history-title">Isi Ulang Saldo</p>
                                  <p className="history-subtitle">{buildSubtitle(trx)}</p>
                                </div>
                                <div className="history-status">
                                  <p className="history-amount">+{formatRupiah(trx.amount)}</p>
                                  <p className="history-state">{STATUS_LABELS[statusKind(trx.status)]}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                        <ListPagination
                          visible={visibleCount}
                          total={items.length}
                          pageSize={HISTORY_PAGE_SIZE}
                          onLoadMore={() => setVisibleCount((count) => count + HISTORY_PAGE_SIZE)}
                        />
                      </>
                    )}
                  </div>
                </div>
              </section>
            </div>

    </div>
  );
}
