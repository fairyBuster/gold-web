import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import img_1 from '../../../assets/images/67_135.svg';
import img_2 from '../../../assets/images/cd4321a034b318f75c488cf1f2e3603c65cc1a7f.png';
import img_3 from '../../../assets/images/45c66465850aad401bebf25b861b6f2f05b9a3dd.png';
import NotifCard from '../../../components/NotifCard.jsx';
import ListPagination from '../../../components/ListPagination.jsx';
import ListState from '../../../components/ListState.jsx';
import { useTransactionFeed } from '../../../lib/useTransactionFeed.js';
import { parseDate, statusKind } from '../../../lib/transactionFormat.js';
/* Summary card totals — GET /api/roulette/points/. */
import { getRoulettePoints } from '../../../lib/rouletteApi.js';

/* Points on this page are roulette tickets. The history list below shows the
   redemptions recorded by the transactions API (type REDEEM); the summary
   totals come from GET /api/roulette/points/. */
const POINT_TYPES = ['REDEEM'];

/* "Muat Lebih Banyak" reveals the next batch of this many loaded rows. */
const HISTORY_PAGE_SIZE = 8;

/* Redeem status group → the note next to the date. */
const STATUS_NOTES = { success: 'Ditukar', pending: 'Diproses', failed: 'Gagal' };

/* "1.317" — points are integers shown with Indonesian separators. */
function formatPoints(value) {
  return (Number(value) || 0).toLocaleString('id-ID');
}

/* "04 Sep 2026" — compact date for the card subtitle. */
function formatDay(iso) {
  const date = parseDate(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* Groups a newest-first list into consecutive month sections:
   [{ label: 'September 2026', items: [...] }, ...]. */
function groupByMonth(items) {
  const groups = [];
  for (const trx of items) {
    const date = parseDate(trx.created_at);
    const label = Number.isNaN(date.getTime())
      ? 'Lainnya'
      : date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const current = groups[groups.length - 1];
    if (current && current.label === label) current.items.push(trx);
    else groups.push({ label, items: [trx] });
  }
  return groups;
}

/* REDEEM rows carry the prize name; keep a fallback for stragglers. */
function buildTitle(trx) {
  return String(trx.redeem_prize_name || '').trim() || 'Penukaran Hadiah';
}

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for RiwayatPoin — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-riwayat-poin to isolate this page. */

.page-riwayat-poin, .page-riwayat-poin * {
  box-sizing: border-box;
}

.page-riwayat-poin {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #fffbf4;
  /* Full-bleed page canvas — the opaque base is repeated as a gradient layer
     so the artwork survives the global transparent-root rule. */
  background-image: 
    radial-gradient(circle at 76.9% 11.5%, rgba(255, 201, 60, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 111.1% 25.5%, rgba(255, 255, 255, 0.55) 0%, transparent 60%),
    linear-gradient(#fffbf4, #fffbf4);
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.page-riwayat-poin .app-container {
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 76.9% 11.5%, rgba(255, 201, 60, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 111.1% 25.5%, rgba(255, 255, 255, 0.55) 0%, transparent 60%);
  position: relative;
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

/* Content column stretched to the full viewport; the page background is
   painted on the page root instead (see .page-riwayat-poin above). */
.page-riwayat-poin > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-riwayat-poin #section-header .app-container {
    min-height: auto;
    box-shadow: none;
    background: transparent;
  }
  .page-riwayat-poin .header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 20px 16px 20px;
  }
  .page-riwayat-poin .back-btn {
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.2s;
  }
  .page-riwayat-poin .back-btn:active {
    opacity: 0.7;
  }
  .page-riwayat-poin .page-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }

/* CSS for section section:Summary */
.page-riwayat-poin .summary-wrapper {
    padding: 0 20px 18px 20px;
  }
  .page-riwayat-poin .summary-card {
    background: radial-gradient(circle at 41.6% 50%, #241c16 0%, #1a1410 55%, #120d09 100%);
    border-radius: 20px;
    padding: 18px 20px;
    position: relative;
    display: flex;
    overflow: hidden;
  }
  .page-riwayat-poin .summary-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    padding-right: 82px;
    position: relative;
    z-index: 2;
  }
  .page-riwayat-poin .summary-row {
    background-color: rgba(255, 249, 242, 0.1);
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .page-riwayat-poin .summary-label {
    color: rgba(255, 249, 242, 0.55);
    font-size: 12px;
    font-weight: 400;
  }
  .page-riwayat-poin .summary-value {
    font-size: 14px;
    font-weight: 700;
  }
  .page-riwayat-poin .summary-value.positive {
    color: #7fd9a6;
  }
  .page-riwayat-poin .summary-value.negative {
    color: #f0a0a0;
  }
  .page-riwayat-poin .character-img {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 88px;
    height: 91px;
    object-fit: contain;
    z-index: 1;
  }

/* CSS for section section:History */
.page-riwayat-poin .history-wrapper {
    padding: 0 20px 20px 20px;
  }
  .page-riwayat-poin .month-title {
    color: #a79c8f;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    margin: 0 0 10px 2px;
    letter-spacing: 0.5px;
  }
  .page-riwayat-poin .history-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .page-riwayat-poin .month-group {
    display: flex;
    flex-direction: column;
  }
  .page-riwayat-poin .month-group:not(:first-child) {
    margin-top: 18px;
  }
  .page-riwayat-poin .history-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 14px;
    padding: 13px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-riwayat-poin .card-icon {
    width: 36px;
    height: 36px;
    object-fit: contain;
    flex-shrink: 0;
  }
  .page-riwayat-poin .card-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }
  .page-riwayat-poin .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }
  .page-riwayat-poin .card-title {
    color: #1a1410;
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .page-riwayat-poin .card-points {
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }
  .page-riwayat-poin .card-points.negative {
    color: #e8790c;
  }
  .page-riwayat-poin .card-points.positive {
    color: #3fa66b;
  }
  .page-riwayat-poin .card-date {
    color: #a79c8f;
    font-size: 12px;
    margin: 0;
  }
`;

export default function RiwayatPoin() {
  const { items, loading, error } = useTransactionFeed(POINT_TYPES);
  const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE_SIZE);
  const groups = groupByMonth(items.slice(0, visibleCount));

  /* Summary card totals — GET /api/roulette/points/ ("total_earned" /
     "total_spent", all-time). null while loading or when the request
     fails: both rows then keep the "—" placeholder. */
  const [pointsSummary, setPointsSummary] = useState(null);
  useEffect(() => {
    let active = true;
    getRoulettePoints()
      .then((data) => {
        if (active && data) setPointsSummary(data);
      })
      .catch(() => {
        /* keep the "—" placeholders */
      });
    return () => {
      active = false;
    };
  }, []);
  const totalEarned = pointsSummary ? Number(pointsSummary.total_earned) || 0 : null;
  const totalSpent = pointsSummary ? Number(pointsSummary.total_spent) || 0 : null;

  return (
    <div className="page-riwayat-poin">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <div className="app-container">
                  <header className="header">
                    <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                      <img src={img_1} alt="Back Icon" />
                    </button>
                    <h1 className="page-title">Riwayat Poin</h1>
                  </header>
                </div>
              </section>
              <section id="section-summary">
                <div className="app-container" style={{minHeight: 'auto', boxShadow: 'none', background: 'transparent'}}>
                  <div className="summary-wrapper">
                    <div className="summary-card">
                      <div className="summary-content">
                        <div className="summary-row">
                          <span className="summary-label">Poin Didapat</span>
                          <span className="summary-value positive">{totalEarned === null ? '' : formatPoints(totalEarned)}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Poin Ditukar</span>
                          <span className="summary-value negative">{totalSpent === null ? '' : totalSpent ? `-${formatPoints(totalSpent)}` : '0'}</span>
                        </div>
                      </div>
                      <img src={img_2} alt="Mascot Character" className="character-img" />
                    </div>
                  </div>
                </div>
              </section> 
              <section id="section-history">
                <div className="app-container" style={{minHeight: 'auto', boxShadow: 'none', background: 'transparent', flex: 1}}>
                  <div className="history-wrapper">
                    {error ? (
                      <NotifCard variant="error" title="Gagal Memuat Riwayat" description={error} />
                    ) : loading ? (
                      <ListState text="Memuat riwayat…" />
                    ) : groups.length === 0 ? (
                      <ListState text="Belum ada riwayat." />
                    ) : (
                      <>
                        {groups.map((group) => (
                          <div className="month-group" key={group.label}>
                            <h2 className="month-title">{group.label}</h2>
                            <div className="history-list">
                              {group.items.map((trx) => {
                                const spent = Number(trx.redeem_points_spent) || 0;
                                const note = STATUS_NOTES[statusKind(trx.status)] || 'Ditukar';
                                return (
                                  <Link
                                    to="/index/rewards/detail-riwayat-poin"
                                    state={{ transaction: trx }}
                                    className="history-card"
                                    key={trx.id ?? `REDEEM-${trx.created_at}`}
                                  >
                                    <img src={img_3} alt="Hadiah Penukaran" className="card-icon" />
                                    <div className="card-details">
                                      <div className="card-header">
                                        <h3 className="card-title">{buildTitle(trx)}</h3>
                                        <span className="card-points negative">{spent ? `-${formatPoints(spent)}` : '—'}</span>
                                      </div>
                                      <p className="card-date">
                                        {[formatDay(trx.created_at), note].filter(Boolean).join(' • ')}
                                      </p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        <ListPagination
                          visible={visibleCount}
                          total={items.length}
                          label="penukaran"
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
