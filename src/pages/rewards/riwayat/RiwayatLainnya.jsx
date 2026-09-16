import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import img_1 from '../../../assets/images/109_2784.svg';
import img_2 from '../../../assets/images/3996294870fd174373ab40264b02a36e21eea57f.png';
import NotifCard from '../../../components/NotifCard.jsx';
import ListPagination from '../../../components/ListPagination.jsx';
import ListState from '../../../components/ListState.jsx';
import { useTransactionFeed } from '../../../lib/useTransactionFeed.js';
import { formatAmountLabel, formatTime, groupByDay, statusKind } from '../../../lib/transactionFormat.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for RiwayatLainnya — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-riwayat-lainnya to isolate this page. */

.page-riwayat-lainnya {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  /* Opaque canvas on the root so it stays full-bleed on desktop. */
  background-image: linear-gradient(#fffbf4, #fffbf4);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.page-riwayat-lainnya, .page-riwayat-lainnya * {
  box-sizing: border-box;
}

.page-riwayat-lainnya .app-section {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-riwayat-lainnya .header-section {
  background-image: radial-gradient(circle at 100% 0%, rgba(255, 201, 60, 0.25) 0%, transparent 70%);
}

.page-riwayat-lainnya .header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 20px 16px 20px;
}

.page-riwayat-lainnya .back-btn {
  width: 36px;
  height: 36px;
  background-color: #f6f1e9;
  border-radius: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

.page-riwayat-lainnya .back-btn img {
  width: 16px;
  height: 16px;
}

.page-riwayat-lainnya .page-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
}

/* CSS for section section:HistoryList */
.page-riwayat-lainnya .history-section {
  min-height: calc(100vh - 72px);
  padding-bottom: 40px;
}

.page-riwayat-lainnya .history-list {
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-riwayat-lainnya .date-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.page-riwayat-lainnya .date-label {
  font-size: 14px;
  font-weight: 600;
  color: #514840;
  margin: 0;
  padding-left: 2px;
}

.page-riwayat-lainnya .cards-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-riwayat-lainnya .history-card {
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  border-radius: 16px;
  padding: 13px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.page-riwayat-lainnya .card-icon {
  width: 43px;
  height: 43px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.page-riwayat-lainnya .card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.page-riwayat-lainnya .card-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-riwayat-lainnya .card-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: #a79c8f;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-riwayat-lainnya .card-subtitle span {
  display: inline-block;
}

/* Teks yang lebih panjang dari kartunya berjalan bolak-balik (bukan
   terpotong) — jarak geser (--slide) dihitung dari overflow di JS. */
.page-riwayat-lainnya .card-subtitle.is-marquee span {
  animation: rlain-subtitle-slide 8s ease-in-out infinite;
}

@keyframes rlain-subtitle-slide {
  0%, 12% { transform: translateX(0); }
  46%, 58% { transform: translateX(var(--slide, 0px)); }
  92%, 100% { transform: translateX(0); }
}

.page-riwayat-lainnya .card-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.page-riwayat-lainnya .amount {
  font-size: 14px;
  font-weight: 700;
  color: #1a1410;
}

.page-riwayat-lainnya .amount.positive {
  color: #3fa66b;
}

.page-riwayat-lainnya .amount.negative {
  color: #1a1410;
}

.page-riwayat-lainnya .status {
  font-size: 12px;
  font-weight: 400;
  color: #a79c8f;
}
`;

/* The page merges the reward & balance transaction types into one feed. */
const OTHER_TYPES = ['ATTENDANCE', 'TRANSFER', 'CASHBACK_DEPOSIT', 'BONUS', 'CREDIT', 'REJECT', 'RETURN', 'VOUCHER', 'MISSIONS', 'SWAP'];

/* "Muat Lebih Banyak" reveals the next batch of this many loaded items. */
const HISTORY_PAGE_SIZE = 8;

/* Status group → right-hand label. */
const STATUS_LABELS = { success: 'Berhasil', pending: 'Diproses', failed: 'Gagal' };

/* Card title per type — app copy for each reward/balance category (the raw
   backend descriptions are system strings, not display copy). TRANSFER and
   RETURN keep their existing labels; every other type uses the app wording. */
const TYPE_TITLES = {
  ATTENDANCE: 'Absensi Jelajah Emas',
  VOUCHER: 'Menukarkan Kode',
  CREDIT: 'Ditambahkan Saldo',
  MISSIONS: 'Menyelesaikan Tugas',
  CASHBACK_DEPOSIT: 'Mendapatkan Poin Isi Ulang',
  BONUS: 'Menukarkan Poin',
  REJECT: 'Dikembalikan ke Saldo',
  TRANSFER: 'Tukar poin',
  RETURN: 'Refund',
  SWAP: 'Tukar Emas',
};

/* Short status sentence shown after the time in the subtitle. */
const TYPE_NOTES = {
  ATTENDANCE: { success: 'Absensi berhasil dicatat', pending: 'Absensi sedang diproses', failed: 'Absensi tidak berhasil' },
  TRANSFER: { success: 'Poin berhasil ditukar', pending: 'Penukaran poin sedang diproses', failed: 'Penukaran poin tidak berhasil' },
  CASHBACK_DEPOSIT: { success: 'Poin berhasil diterima', pending: 'Poin sedang diproses', failed: 'Poin tidak berhasil diterima' },
  BONUS: { success: 'Bonus berhasil diterima', pending: 'Bonus sedang diproses', failed: 'Bonus tidak berhasil' },
  CREDIT: { success: 'Saldo berhasil ditambahkan', pending: 'Saldo sedang ditambahkan', failed: 'Saldo tidak berhasil ditambahkan' },
  REJECT: { success: 'Refund berhasil diterima', pending: 'Refund sedang diproses', failed: 'Refund tidak berhasil' },
  RETURN: { success: 'Refund berhasil diterima', pending: 'Refund sedang diproses', failed: 'Refund tidak berhasil' },
  VOUCHER: { success: 'Voucher berhasil diproses', pending: 'Voucher sedang diproses', failed: 'Voucher tidak berhasil' },
  MISSIONS: { success: 'Reward misi berhasil diterima', pending: 'Reward misi sedang diproses', failed: 'Reward misi tidak berhasil' },
  SWAP: { success: 'Penukaran emas berhasil', pending: 'Penukaran emas sedang diproses', failed: 'Penukaran emas tidak berhasil' },
};

/* Card title per type — the design label (not the raw backend description).
   A swap posts two rows: the gold value debited from balance_hold and the
   swap fee debited from balance_deposit — the fee row gets its own label. */
function buildTitle(trx) {
  if (trx.type === 'SWAP' && trx.wallet_type === 'BALANCE_DEPOSIT') return 'Biaya Tukar Emas';
  return TYPE_TITLES[trx.type] || 'Transaksi';
}

/* Swap rows carry no gram field — the amount lives inside the backend
   description ("Tukar 0.5000 gram emas ..." / "... tukar emas 0.5000 gram
   ..."), so it is parsed out for display, like RiwayatIsiUlang parses the
   deposit provider. "0.5000" renders as "0,5 gram" (trailing zeros trimmed). */
function swapGramLabel(trx) {
  if (trx.type !== 'SWAP') return '';
  const match = String(trx.description || '').match(/(\d+(?:\.\d+)?)\s*gram/i);
  const grams = match ? Number(match[1]) : NaN;
  if (!Number.isFinite(grams) || grams <= 0) return '';
  return `${String(grams).replace('.', ',')} gram`;
}

function buildSubtitle(trx, kind) {
  const note = TYPE_NOTES[trx.type] ? TYPE_NOTES[trx.type][kind] : '';
  return [formatTime(trx.created_at), swapGramLabel(trx), note].filter(Boolean).join(' • ');
}

export default function RiwayatLainnya() {
  const { items, loading, error } = useTransactionFeed(OTHER_TYPES);
  const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE_SIZE);
  const groups = groupByDay(items.slice(0, visibleCount));
  const rootRef = useRef(null);

  /* Teks subtitel yang melebihi lebar kartunya berjalan bolak-balik (bukan
     terpotong "...") — pola yang sama dengan RiwayatTransaksi. Diukur ulang
     saat daftar berubah (feed masuk bertahap / Muat Lebih Banyak), saat
     resize, dan setelah font Inter selesai dimuat. */
  useEffect(() => {
    const measure = () => {
      const subtitles = rootRef.current?.querySelectorAll('.card-subtitle') ?? [];
      subtitles.forEach((el) => {
        const span = el.firstElementChild;
        if (!span) return;
        const overflow = el.scrollWidth - el.clientWidth;
        if (overflow > 0) {
          span.style.setProperty('--slide', `${-overflow}px`);
          el.classList.add('is-marquee');
        } else {
          el.classList.remove('is-marquee');
          span.style.removeProperty('--slide');
        }
      });
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [items, visibleCount]);

  return (
    <div className="page-riwayat-lainnya" ref={rootRef}>
      <style>{styles}</style>
      <div>
              <section id="section-header" className="app-section header-section">
                <header className="header">
                  <a href="#" className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="" />
                  </a>
                  <h1 className="page-title">Riwayat Lainnya</h1>
                </header>
              </section>
              <section id="section-history-list" className="app-section history-section">
                <div className="history-list">
                  {error ? (
                    <NotifCard variant="error" title="Gagal Memuat Riwayat" description={error} />
                  ) : loading ? (
                    <ListState text="Memuat riwayat…" />
                  ) : groups.length === 0 ? (
                    <ListState text="Belum ada riwayat." />
                  ) : (
                    <>
                      {groups.map((group) => (
                        <div className="date-group" key={group.label}>
                          <h2 className="date-label">{group.label}</h2>
                          <div className="cards-container">
                            {group.items.map((trx) => {
                              const kind = statusKind(trx.status);
                              /* A swap debits both wallets (gold value + swap
                                 fee), so it reads "-" in black even though the
                                 backend stores the amount positive. */
                              const raw = Number(trx.amount) || 0;
                              const amount = trx.type === 'SWAP' && raw > 0 ? -raw : raw;
                              /* Baris SWAP membuka detail pesanan cetak emas
                                 (layar step 3 CetakEmas): gold_order_id dari
                                 backend menunjuk order yang sama untuk baris
                                 nilai emas maupun baris biaya. */
                              const swapOrderId = trx.type === 'SWAP' && trx.gold_order_id != null ? trx.gold_order_id : null;
                              const CardTag = swapOrderId ? Link : 'div';
                              return (
                                <CardTag
                                  {...(swapOrderId ? { to: '/index/assets/cetak-emas-03', state: { goldOrderId: swapOrderId } } : {})}
                                  className="history-card"
                                  key={trx.id ?? `${trx.type}-${trx.created_at}`}
                                >
                                  <img src={img_2} alt={buildTitle(trx)} className="card-icon" />
                                  <div className="card-content">
                                    <h3 className="card-title">{buildTitle(trx)}</h3>
                                    <p className="card-subtitle"><span>{buildSubtitle(trx, kind)}</span></p>
                                  </div>
                                  <div className="card-action">
                                    <span className={`amount ${amount < 0 ? 'negative' : 'positive'}`}>
                                      {formatAmountLabel(amount, trx.currency_code)}
                                    </span>
                                    <span className="status">{STATUS_LABELS[kind]}</span>
                                  </div>
                                </CardTag>
                              );
                            })}
                          </div>
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
              </section>
            </div>

    </div>
  );
}
 