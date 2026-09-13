import { useState } from 'react';
import { Link } from 'react-router-dom';
import img_1 from '../../../assets/images/67_135.svg';
import img_2 from '../../../assets/images/d8da7d40a36530662fd38ce2db2d88617de3e965.png';
import img_3 from '../../../assets/images/402d907c628503f9f6fc98788c4a2ed737081803.png';
import NotifCard from '../../../components/NotifCard.jsx';
import ListPagination from '../../../components/ListPagination.jsx';
import ListState from '../../../components/ListState.jsx';
import { useTransactionFeed } from '../../../lib/useTransactionFeed.js';
import { formatAmountLabel, formatRupiah, parseDate } from '../../../lib/transactionFormat.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for RiwayatKomisi — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-riwayat-komisi to isolate this page. */

.page-riwayat-komisi {
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  background-color: #fffbf4;
  background-image:
    radial-gradient(circle at 76% 11%, rgba(255, 201, 60, 0.28) 0%, rgba(255, 201, 60, 0) 70%),
    radial-gradient(circle at 111% 25%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 70%),
    radial-gradient(circle at 90% -40%, rgba(255, 159, 28, 0.38) 0%, rgba(255, 159, 28, 0) 70%);
  position: relative;
  overflow-x: hidden;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.05);
}

.page-riwayat-komisi, .page-riwayat-komisi * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-riwayat-komisi .header {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 14px;
}
.page-riwayat-komisi .back-btn {
  width: 36px;
  height: 36px;
  background-color: #f6f1e9;
  border-radius: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s;
}
.page-riwayat-komisi .back-btn:active {
  opacity: 0.7;
}
.page-riwayat-komisi .page-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
}

/* CSS for section section:Summary */
.page-riwayat-komisi .summary-section {
  padding: 0 20px;
  position: relative;
  margin-top: 4px;
}
.page-riwayat-komisi .summary-illustration {
  position: absolute;
  top: -45px;
  right: 20px;
  width: 99px;
  height: 103px;
  z-index: 10;
  pointer-events: none;
}
.page-riwayat-komisi .summary-card {
  background: radial-gradient(circle at 41% 43%, #241c16 0%, #1a1410 55%, #120d09 100%);
  border-radius: 8px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
}
.page-riwayat-komisi .summary-title {
  color: rgba(255, 249, 242, 0.55);
  font-size: 12px;
  margin-bottom: 10px;
}
.page-riwayat-komisi .summary-row {
  background-color: rgba(255, 249, 242, 0.1);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-riwayat-komisi .summary-label {
  color: rgba(255, 249, 242, 0.55);
  font-size: 14px;
}
.page-riwayat-komisi .summary-value {
  color: #fff9f2;
  font-size: 14px;
  font-weight: 700;
}

/* CSS for section section:Filters */
.page-riwayat-komisi .filters-section {
  padding: 16px 20px;
}
.page-riwayat-komisi .filter-nav {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}
.page-riwayat-komisi .filter-nav::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
.page-riwayat-komisi .filter-pill {
  background-color: #f6f1e9;
  color: #514840;
  border: none;
  border-radius: 20px;
  padding: 8px 13px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}
.page-riwayat-komisi .filter-pill.active {
  background-color: rgba(255, 159, 28, 0.14);
  color: #e8790c;
  font-weight: 600;
}

/* CSS for section section:History */
.page-riwayat-komisi .history-section {
  padding: 0 20px 20px 20px;
}
.page-riwayat-komisi .month-group {
  margin-bottom: 24px;
}
.page-riwayat-komisi .month-title {
  color: #a79c8f;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin: 0 0 10px 2px;
  letter-spacing: 0.5px;
}
.page-riwayat-komisi .history-card {
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  border-radius: 14px;
  padding: 13px 14px;
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: flex-start;
}
.page-riwayat-komisi .history-card:last-child {
  margin-bottom: 0;
}
.page-riwayat-komisi .avatar {
  width: 31px;
  height: 31px;
  border-radius: 50%;
  object-fit: cover;
}
.page-riwayat-komisi .card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.page-riwayat-komisi .card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}
.page-riwayat-komisi .card-title {
  color: #1a1410;
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
}
.page-riwayat-komisi .card-amount {
  color: #3fa66b;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}
.page-riwayat-komisi .card-date {
  color: #a79c8f;
  font-size: 11px;
  margin-bottom: 4px;
}
.page-riwayat-komisi .card-badge {
  background-color: #f6f1e9;
  color: #514840;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  align-self: flex-start;
}
`;

/* Both rebate flavours are shown as one commission feed. */
const COMMISSION_TYPES = ['PROFIT_COMMISSION', 'PURCHASE_COMMISSION'];

/* Level pills of the design; levels 4-5 (rare) still appear under Semua Level. */
const LEVEL_FILTERS = [
  { value: 'all', label: 'Semua Level' },
  { value: 1, label: 'Level 1' },
  { value: 2, label: 'Level 2' },
  { value: 3, label: 'Level 3' },
];

/* "Muat Lebih Banyak" reveals the next batch of this many loaded items. */
const HISTORY_PAGE_SIZE = 8;

/* Member phone whose activity generated the commission: upline_phone when the
   backend fills it (purchase rebates), else parsed from the description
   ("Profit rebate L3 from +62xxx - Nebulizer"). */
function memberPhone(trx) {
  const direct = String(trx.upline_phone || '').trim();
  if (direct) return direct;
  const match = String(trx.description || '').match(/from\s+(\+?\d+)/i);
  return match ? match[1] : '';
}

/* "04 Sep 2026" — date shown on each card. */
function cardDate(iso) {
  const date = parseDate(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* "September 2026" — month section label. */
function monthLabel(iso) {
  const date = parseDate(iso);
  if (Number.isNaN(date.getTime())) return 'Lainnya';
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

/* Collapses a newest-first list into consecutive month groups. */
function groupByMonth(items) {
  const groups = [];
  for (const item of items) {
    const label = monthLabel(item.created_at);
    const current = groups[groups.length - 1];
    if (current && current.label === label) current.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

/* Amount sums for the summary card. */
const sumAmount = (list) => list.reduce((sum, trx) => sum + (Number(trx.amount) || 0), 0);

function isToday(iso) {
  const date = parseDate(iso);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isCurrentMonth(iso) {
  const date = parseDate(iso);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export default function RiwayatKomisi() {
  const { items, loading, error } = useTransactionFeed(COMMISSION_TYPES);
  const [level, setLevel] = useState('all');
  const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE_SIZE);

  const filtered = level === 'all' ? items : items.filter((trx) => trx.commission_level === level);
  const groups = groupByMonth(filtered.slice(0, visibleCount));
  const todayTotal = sumAmount(items.filter((trx) => isToday(trx.created_at)));
  const monthTotal = sumAmount(items.filter((trx) => isCurrentMonth(trx.created_at)));

  return (
    <div className="page-riwayat-komisi">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <a href="#" className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="" />
                  </a>
                  <h1 className="page-title">Riwayat Komisi</h1>
                </header>
              </section>
              <section id="section-summary" className="summary-section">
                <img src={img_2} alt="Illustration of people" className="summary-illustration" />
                <div className="summary-card">
                  <div className="summary-title">Ringkasan Komisi</div>
                  <div className="summary-row">
                    <span className="summary-label">Hari Ini</span>
                    <span className="summary-value">{loading ? '\u2014' : formatRupiah(todayTotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Bulan Ini</span>
                    <span className="summary-value">{loading ? '\u2014' : formatRupiah(monthTotal)}</span>
                  </div>
                </div>
              </section>
              <section id="section-filters" className="filters-section">
                <nav className="filter-nav" aria-label="Level filters">
                  {LEVEL_FILTERS.map((filter) => (
                    <button
                      key={filter.label}
                      className={`filter-pill${level === filter.value ? ' active' : ''}`}
                      onClick={() => { setLevel(filter.value); setVisibleCount(HISTORY_PAGE_SIZE); }}
                    >
                      {filter.label}
                    </button>
                  ))}
                </nav>
              </section>
              <section id="section-history" className="history-section">
                {error ? (
                  <NotifCard variant="error" title="Gagal Memuat Riwayat" description={error} />
                ) : loading ? (
                  <ListState text="Memuat riwayat\u2026" />
                ) : groups.length === 0 ? (
                  <ListState text={level === 'all' ? 'Belum ada komisi.' : 'Belum ada komisi di level ini.'} />
                ) : (
                  <>
                    {groups.map((group) => (
                      <div className="month-group" key={group.label}>
                        <h2 className="month-title">{group.label}</h2>
                        {group.items.map((trx) => {
                          const phone = memberPhone(trx);
                          return (
                            <Link to="/affiliate/riwayat-detail-komisi" className="history-card" key={trx.id ?? `${trx.trx_id}-${trx.created_at}`}>
                              <img src={img_3} alt="Avatar" className="avatar" />
                              <div className="card-content">
                                <div className="card-header">
                                  <h3 className="card-title">{phone ? `Bonusku dari ${phone}` : 'Bonus komisi'}</h3>
                                  <span className="card-amount">{formatAmountLabel(trx.amount, trx.currency_code)}</span>
                                </div>
                                <div className="card-date">{cardDate(trx.created_at)}</div>
                                {trx.commission_level ? <div className="card-badge">Level {trx.commission_level}</div> : null}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                    <ListPagination
                      visible={visibleCount}
                      total={filtered.length}
                      pageSize={HISTORY_PAGE_SIZE}
                      onLoadMore={() => setVisibleCount((count) => count + HISTORY_PAGE_SIZE)}
                    />
                  </>
                )}
              </section>
            </div>

    </div>
  );
}
