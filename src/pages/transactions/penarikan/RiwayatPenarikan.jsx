import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { goBack } from '../../../lib/backNav.js';
import img_1 from '../../../assets/images/109_2465.svg';
import img_2 from '../../../assets/images/915ddfcd2308a67f93cb52100b8c074abaa5928b.webp';
import img_3 from '../../../assets/images/26f0f85c3f131cbe6775a26cf4afe79775404786.webp';
import NotifCard from '../../../components/NotifCard.jsx';
import ListPagination from '../../../components/ListPagination.jsx';
import ListState from '../../../components/ListState.jsx';
import { useTransactionFeed } from '../../../lib/useTransactionFeed.js';
import { formatRupiah, formatTime, groupByDay, parseDate, statusKind } from '../../../lib/transactionFormat.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for RiwayatPenarikan — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-riwayat-penarikan to isolate this page. */

.page-riwayat-penarikan {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  /* Opaque canvas on the root so it stays full-bleed on desktop. */
  background-image: linear-gradient(#fffbf4, #fffbf4);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  width: 100%;
}

.page-riwayat-penarikan, .page-riwayat-penarikan * {
  box-sizing: border-box;
}

.page-riwayat-penarikan .app-section {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-riwayat-penarikan #section-header {
  background-image: 
    radial-gradient(circle at 80% -20%, rgba(255, 201, 60, 0.3) 0%, transparent 60%),
    radial-gradient(circle at 110% 20%, rgba(255, 255, 255, 0.6) 0%, transparent 50%);
}
.page-riwayat-penarikan .header-content {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 20px 16px 20px;
}
.page-riwayat-penarikan .back-btn {
  width: 36px;
  height: 36px;
  background-color: #f6f1e9;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: background-color 0.2s ease;
}
.page-riwayat-penarikan .back-btn:hover {
  background-color: #ebe4d8;
}
.page-riwayat-penarikan .page-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
}

/* CSS for section section:Summary */
.page-riwayat-penarikan .summary-content {
  padding: 0 20px 20px 20px;
}
.page-riwayat-penarikan .summary-card {
  position: relative;
  background: radial-gradient(circle at 41.6% 43.7%, #241c16 0%, #1a1410 55%, #120d09 100%);
  border-radius: 20px;
  padding: 18px 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  min-height: 102px;
}
.page-riwayat-penarikan .summary-text {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.page-riwayat-penarikan .summary-label {
  color: rgba(255, 249, 242, 0.55);
  font-size: 12px;
  font-weight: 400;
}
.page-riwayat-penarikan .summary-amount {
  color: #fff9f2;
  font-size: 22px;
  font-weight: 700;
  margin: 2px 0;
  letter-spacing: -0.5px;
}
.page-riwayat-penarikan .summary-count {
  color: rgba(255, 249, 242, 0.5);
  font-size: 12px;
  font-weight: 400;
}
.page-riwayat-penarikan .summary-bg-img {
  position: absolute;
  right: -50px;
  top: -50px;
  width: 227px;
  height: 227px;
  z-index: 1;
  pointer-events: none;
}

/* CSS for section section:History */
.page-riwayat-penarikan .history-content {
  padding: 0 20px 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: calc(100vh - 200px);
}
.page-riwayat-penarikan .history-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.page-riwayat-penarikan .date-header {
  font-size: 13px;
  font-weight: 600;
  color: #514840;
  margin: 0;
  padding-left: 2px;
}
.page-riwayat-penarikan .transaction-card {
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  border-radius: 16px;
  padding: 13px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: inherit;
  transition: background-color 0.2s ease;
}
.page-riwayat-penarikan .transaction-card:active {
  background-color: #f6f1e9;
}
.page-riwayat-penarikan .tx-icon {
  width: 43px;
  height: 43px;
  object-fit: contain;
  flex-shrink: 0;
}
.page-riwayat-penarikan .tx-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.page-riwayat-penarikan .tx-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1410;
}
.page-riwayat-penarikan .tx-desc {
  font-size: 11px;
  line-height: 1.4;
  color: #a79c8f;
  white-space: pre-line;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.page-riwayat-penarikan .tx-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
  margin-left: auto;
}
.page-riwayat-penarikan .tx-amount {
  font-size: 14px;
  font-weight: 700;
  color: #1a1410;
}
.page-riwayat-penarikan .tx-status {
  font-size: 12px;
  font-weight: 500;
}
.page-riwayat-penarikan .status-pending {
  color: #e8790c;
}
.page-riwayat-penarikan .status-success {
  color: #207dff;
}
.page-riwayat-penarikan .status-failed {
  color: #e24c4c;
}
`;

/* Every withdrawal is fetched page-by-page and merged newest-first. */
const WITHDRAW_TYPES = ['WITHDRAW'];

/* "Muat Lebih Banyak" reveals the next batch of this many loaded items. */
const HISTORY_PAGE_SIZE = 8;

/* Status group → right-hand pill label. */
const STATUS_LABELS = { success: 'Sukses', pending: 'Diproses', failed: 'Gagal' };

/* Real fee / net amount from the linked Withdrawal row (withdrawal_fee and
   withdrawal_net_amount on TransactionSerializer); net falls back to
   amount - fee. Withdrawals without a Withdrawal row yield null for both. */
function feeOf(trx) {
  return trx.withdrawal_fee != null ? Number(trx.withdrawal_fee) : null;
}

function netOf(trx) {
  if (trx.withdrawal_net_amount != null) return Number(trx.withdrawal_net_amount);
  const fee = feeOf(trx);
  return fee == null ? null : (Number(trx.amount) || 0) - fee;
}

/* Card detail: time + masked destination account, the service used, then the
   amount breakdown (gross / fee / net) once the payout row exists. */
function buildDetail(trx) {
  const account = trx.bank_account_number ? `••${String(trx.bank_account_number).slice(-4)}` : '';
  const bank = [trx.bank_name, account].filter(Boolean).join(' ');
  const lines = [`${formatTime(trx.created_at)}${bank ? ` • ${bank}` : ''}`.trim()];
  if (trx.withdrawal_service_name) lines.push(`Layanan ${trx.withdrawal_service_name}`);
  const fee = feeOf(trx);
  const net = netOf(trx);
  if (fee != null && net != null) {
    lines.push(`Nominal sebelum potongan: ${formatRupiah(trx.amount)}`);
    lines.push(`Biaya: ${formatRupiah(fee)}`);
    lines.push(`Nominal sebenarnya: ${formatRupiah(net)}`);
  }
  return lines.filter(Boolean).join('\n');
}

export default function RiwayatPenarikan() {
  const { items, loading, error } = useTransactionFeed(WITHDRAW_TYPES);
  const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE_SIZE);
  const navigate = useNavigate();

  /* Tapping a card opens the detail page for that withdrawal. */
  const openDetail = (trx) => {
    navigate('/index/transactions/detail-penarikan', { state: { trx } });
  };

  /* Totals for the current calendar month. */
  const now = new Date();
  const monthly = items.filter((trx) => {
    const date = parseDate(trx.created_at);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
  const monthlyTotal = monthly.reduce((sum, trx) => sum + Math.abs(Number(trx.amount) || 0), 0);
  const groups = groupByDay(items.slice(0, visibleCount));

  return (
    <div className="page-riwayat-penarikan">
      <style>{styles}</style>
      <div>
              <section id="section-header" className="app-section">
                <header className="header-content">
                  <a href="#" className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/home'); }}>
                    <img src={img_1} alt="" />
                  </a>
                  <h1 className="page-title">Riwayat Penarikan</h1>
                </header>
              </section>
              <section id="section-summary" className="app-section">
                <div className="summary-content">
                  <div className="summary-card">
                    <div className="summary-text">
                      <span className="summary-label">Total Penarikan Bulan Ini</span>
                      <strong className="summary-amount">{formatRupiah(monthlyTotal)}</strong>
                      <span className="summary-count">{monthly.length} transaksi</span>
                    </div>
                    <img src={img_2} alt="" className="summary-bg-img" aria-hidden="true" />
                  </div>
                </div>
              </section>
              <section id="section-history" className="app-section">
                <div className="history-content">
                  {error ? (
                    <NotifCard variant="error" title="Gagal Memuat Riwayat" description={error} />
                  ) : loading ? (
                    <ListState text="Memuat riwayat…" />
                  ) : groups.length === 0 ? (
                    <ListState text="Belum ada riwayat penarikan." />
                  ) : (
                    <>
                      {groups.map((group) => (
                        <div className="history-group" key={group.label}>
                          <h2 className="date-header">{group.label}</h2>
                          {group.items.map((trx) => {
                            const kind = statusKind(trx.status);
                            return (
                              <button
                                type="button"
                                className="transaction-card"
                                key={trx.id ?? `${trx.type}-${trx.created_at}`}
                                onClick={() => openDetail(trx)}
                              >
                                <img src={img_3} alt="Icon" className="tx-icon" />
                                <div className="tx-details">
                                  <div className="tx-title">Tarik Dana</div>
                                  <div className="tx-desc">{buildDetail(trx)}</div>
                                </div>
                                <div className="tx-meta">
                                  <div className="tx-amount">-{formatRupiah(trx.amount)}</div>
                                  <div className={`tx-status status-${kind}`}>{STATUS_LABELS[kind]}</div>
                                </div>
                              </button>
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
