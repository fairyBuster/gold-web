import { useState } from 'react';
import { goBack } from '../../../lib/backNav.js';
import img_1 from '../../../assets/images/109_2784.svg';
import img_2 from '../../../assets/images/915ddfcd2308a67f93cb52100b8c074abaa5928b.webp';
import img_3 from '../../../assets/images/a0f4e57692255e6234cdb5455f19fda6e1a96e82.webp';
import NotifCard from '../../../components/NotifCard.jsx';
import ListPagination from '../../../components/ListPagination.jsx';
import ListState from '../../../components/ListState.jsx';
import { useTransactionFeed } from '../../../lib/useTransactionFeed.js';
import { formatAmountLabel, formatRupiah, formatTime, parseDate, statusKind } from '../../../lib/transactionFormat.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for RiwayatDetailKomisi — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-riwayat-detail-komisi to isolate this page. */

.page-riwayat-detail-komisi {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 76.9% 11.5%, rgba(255, 201, 60, 0.28) 0%, rgba(255, 201, 60, 0) 70%),
    radial-gradient(circle at 111.1% 25.5%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 70%),
    radial-gradient(circle at 90.9% -40.9%, rgba(255, 159, 28, 0.38) 0%, rgba(255, 159, 28, 0) 70%);
  min-height: 100vh;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.05);
  position: relative;
  overflow-x: hidden;
  box-sizing: border-box;
  width: 100%;
}

.page-riwayat-detail-komisi *,.page-riwayat-detail-komisi  *::before,.page-riwayat-detail-komisi  *::after {
  box-sizing: inherit;
}

.page-riwayat-detail-komisi h1,.page-riwayat-detail-komisi  h2,.page-riwayat-detail-komisi  h3,.page-riwayat-detail-komisi  p {
  margin: 0;
}

.page-riwayat-detail-komisi a {
  text-decoration: none;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-riwayat-detail-komisi #section-header .header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 20px 16px 20px;
  }
  
  .page-riwayat-detail-komisi #section-header .back-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    transition: opacity 0.2s ease;
  }

  .page-riwayat-detail-komisi #section-header .back-btn:active {
    opacity: 0.7;
  }
  
  .page-riwayat-detail-komisi #section-header .header-title {
    color: #1a1410;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.2;
  }

/* CSS for section section:Summary */
.page-riwayat-detail-komisi #section-summary .summary-container {
    padding: 0 20px 20px 20px;
  }
  
  .page-riwayat-detail-komisi #section-summary .summary-card {
    position: relative;
    background-image: radial-gradient(circle at 41.6% 43.7%, #241c16 0%, #1a1410 55%, #120d09 100%);
    border-radius: 20px;
    padding: 18px 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 102px;
  }
  
  .page-riwayat-detail-komisi #section-summary .summary-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .page-riwayat-detail-komisi #section-summary .summary-label {
    color: rgba(255, 249, 242, 0.55);
    font-size: 12px;
    font-weight: 400;
  }
  
  .page-riwayat-detail-komisi #section-summary .summary-amount {
    color: #7fd9a6;
    font-size: 24px;
    font-weight: 700;
    margin: 2px 0;
    letter-spacing: -0.5px;
  }
  
  .page-riwayat-detail-komisi #section-summary .summary-count {
    color: rgba(255, 249, 242, 0.5);
    font-size: 12px;
    font-weight: 400;
  }
  
  .page-riwayat-detail-komisi #section-summary .summary-deco {
    position: absolute;
    right: -56px;
    top: -42px;
    width: 186px;
    height: 186px;
    object-fit: cover;
    z-index: 0;
    pointer-events: none;
  }

/* CSS for section section:History */
.page-riwayat-detail-komisi #section-history .history-container {
    padding: 0 20px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  
  .page-riwayat-detail-komisi #section-history .history-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .page-riwayat-detail-komisi #section-history .history-date {
    color: #514840;
    font-size: 14px;
    font-weight: 600;
    padding-left: 2px;
  }
  
  .page-riwayat-detail-komisi #section-history .history-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    padding: 13px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .page-riwayat-detail-komisi #section-history .history-icon {
    width: 43px;
    height: 43px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }
  
  .page-riwayat-detail-komisi #section-history .history-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0; /* Prevents flex item from overflowing */
  }
  
  .page-riwayat-detail-komisi #section-history .history-title {
    color: #1a1410;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .page-riwayat-detail-komisi #section-history .history-time {
    color: #a79c8f;
    font-size: 12px;
    font-weight: 400;
  }
  
  .page-riwayat-detail-komisi #section-history .history-status-col {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }
  
  .page-riwayat-detail-komisi #section-history .history-amount {
    color: #3fa66b;
    font-size: 14px;
    font-weight: 700;
  }
  
  .page-riwayat-detail-komisi #section-history .history-status {
    color: #a79c8f;
    font-size: 12px;
    font-weight: 400;
  }
`;

/* Both rebate flavours are shown as one commission feed. */
const COMMISSION_TYPES = ['PROFIT_COMMISSION', 'PURCHASE_COMMISSION'];

/* "Muat Lebih Banyak" reveals the next batch of this many loaded items. */
const HISTORY_PAGE_SIZE = 8;

/* Status group → right-hand label. */
const STATUS_LABELS = { success: 'Berhasil', pending: 'Diproses', failed: 'Gagal' };

/* Product behind the commission: product_name when present (purchase rebates),
   else parsed from the description ("... - Nebulizer"). */
function productName(trx) {
  const direct = String(trx.product_name || '').trim();
  if (direct) return direct;
  const match = String(trx.description || '').match(/-\s*(.+)$/);
  return match ? match[1].trim() : '';
}

/* Member phone whose activity generated the commission. */
function memberPhone(trx) {
  const direct = String(trx.upline_phone || '').trim();
  if (direct) return direct;
  const match = String(trx.description || '').match(/from\s+(\+?\d+)/i);
  return match ? match[1] : '';
}

/* Card title mirroring the design: purchases name the product, profit
   rebates say what the member earned. */
function buildTitle(trx) {
  const product = productName(trx);
  if (trx.type === 'PURCHASE_COMMISSION') {
    return product ? `Teman kamu membeli ${product}` : 'Teman kamu membeli produk';
  }
  return product ? `Bonus profit dari ${product}` : 'Bonus profit';
}

/* "10:24 • 6283009xxxxx" — time plus the member phone (without the +). */
function buildSubtitle(trx) {
  const phone = memberPhone(trx).replace(/^\+/, '');
  return [formatTime(trx.created_at), phone].filter(Boolean).join(' • ');
}

/* "Hari Ini, 04 September" / "Kemarin, ..." / "25 Agustus" — day label. */
function dayGroupLabel(iso) {
  const date = parseDate(iso);
  if (Number.isNaN(date.getTime())) return 'Lainnya';
  const day = `${String(date.getDate()).padStart(2, '0')} ${date.toLocaleDateString('id-ID', { month: 'long' })}`;
  const startOfDay = (value) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000);
  if (diffDays === 0) return `Hari Ini, ${day}`;
  if (diffDays === 1) return `Kemarin, ${day}`;
  return day;
}

/* Collapses a newest-first list into consecutive day groups. */
function groupByDay(items) {
  const groups = [];
  for (const item of items) {
    const label = dayGroupLabel(item.created_at);
    const current = groups[groups.length - 1];
    if (current && current.label === label) current.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

function isCurrentMonth(iso) {
  const date = parseDate(iso);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export default function RiwayatDetailKomisi() {
  const { items, loading, error } = useTransactionFeed(COMMISSION_TYPES);
  const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE_SIZE);

  const groups = groupByDay(items.slice(0, visibleCount));
  const monthItems = items.filter((trx) => isCurrentMonth(trx.created_at));
  const monthTotal = monthItems.reduce((sum, trx) => sum + (Number(trx.amount) || 0), 0);

  return (
    <div className="page-riwayat-detail-komisi">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <a href="#" className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/affiliate/riwayat-komisi'); }}>
                    <img src={img_1} alt="" />
                  </a>
                  <h1 className="header-title">Riwayat Komisi Afiliasi</h1>
                </header>
              </section>
              <section id="section-summary">
                <div className="summary-container">
                  <div className="summary-card">
                    <div className="summary-content">
                      <p className="summary-label">Total Komisi Afiliasi Bulan Ini</p>
                      <p className="summary-amount">{loading ? '\u2014' : `+${formatRupiah(monthTotal)}`}</p>
                      <p className="summary-count">{loading ? '\u2014' : `${monthItems.length} transaksi`}</p>
                    </div>
                    <img src={img_2} alt="" className="summary-deco" aria-hidden="true" />
                  </div>
                </div>
              </section>
              <section id="section-history">
                <div className="history-container">
                  {error ? (
                    <NotifCard variant="error" title="Gagal Memuat Riwayat" description={error} />
                  ) : loading ? (
                    <ListState text="Memuat riwayat\u2026" />
                  ) : groups.length === 0 ? (
                    <ListState text="Belum ada komisi." />
                  ) : (
                    <>
                      {groups.map((group) => (
                        <div className="history-group" key={group.label}>
                          <h2 className="history-date">{group.label}</h2>
                          {group.items.map((trx) => {
                            const kind = statusKind(trx.status);
                            return (
                              <div className="history-card" key={trx.id ?? `${trx.trx_id}-${trx.created_at}`}>
                                <img src={img_3} alt="Product Icon" className="history-icon" />
                                <div className="history-info">
                                  <p className="history-title">{buildTitle(trx)}</p>
                                  <p className="history-time">{buildSubtitle(trx)}</p>
                                </div>
                                <div className="history-status-col">
                                  <p className="history-amount">{formatAmountLabel(trx.amount, trx.currency_code)}</p>
                                  <p className="history-status">{STATUS_LABELS[kind]}</p>
                                </div>
                              </div>
                            );
                          })}
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
 