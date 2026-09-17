import { useEffect, useState } from 'react';
import { goBack } from '../../../lib/backNav.js';
import img_1 from '../../../assets/images/109_2784.svg';
import img_2 from '../../../assets/images/915ddfcd2308a67f93cb52100b8c074abaa5928b.webp';
import img_3 from '../../../assets/images/b13b7a474443dcb448772d73d8251dbab67b8f14.webp';
import NotifCard from '../../../components/NotifCard.jsx';
import ListPagination from '../../../components/ListPagination.jsx';
import ListState from '../../../components/ListState.jsx';
import { useTransactionFeed } from '../../../lib/useTransactionFeed.js';
import { formatRupiah, formatTime, groupByDay, statusKind } from '../../../lib/transactionFormat.js';
import { getBalanceStatistics } from '../../../lib/authApi.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for RiwayatAsetSaya — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-riwayat-aset-saya to isolate this page. */

.page-riwayat-aset-saya {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 80% 10%, rgba(255, 201, 60, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 100% 20%, rgba(255, 255, 255, 0.5) 0%, transparent 50%);
  background-attachment: fixed;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  width: 100%;
}

.page-riwayat-aset-saya section {
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.page-riwayat-aset-saya, .page-riwayat-aset-saya * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-riwayat-aset-saya .app-header {
    display: flex;
    align-items: center;
    padding: 20px;
    gap: 14px;
  }
  .page-riwayat-aset-saya .back-btn {
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
    transition: background-color 0.2s ease;
  }
  .page-riwayat-aset-saya .back-btn:hover {
    background-color: #e8e2d8;
  }
  .page-riwayat-aset-saya .back-btn img {
    width: 16px;
    height: 16px;
  }
  .page-riwayat-aset-saya .header-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }

/* CSS for section section:Summary */
.page-riwayat-aset-saya #section-summary {
    padding-bottom: 18px;
  }
  .page-riwayat-aset-saya .summary-card {
    margin: 0 20px;
    border-radius: 20px;
    background: radial-gradient(circle at 41% 43%, #241c16 0%, #1a1410 55%, #120d09 100%);
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    min-height: 76px;
  }
  .page-riwayat-aset-saya .summary-bg-img {
    position: absolute;
    right: -38px;
    top: -38px;
    width: 152px;
    height: 152px;
    object-fit: cover;
    pointer-events: none;
  }
  .page-riwayat-aset-saya .summary-content {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
    width: 100%;
  }
  .page-riwayat-aset-saya .stat-col {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }
  .page-riwayat-aset-saya .stat-label {
    font-size: 12px;
    color: rgba(255, 249, 242, 0.5);
    line-height: 1.2;
  }
  .page-riwayat-aset-saya .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #fff9f2;
    line-height: 1.2;
  }
  .page-riwayat-aset-saya .stat-value.green {
    color: #7fd9a6;
  }
  .page-riwayat-aset-saya .divider {
    width: 1px;
    height: 40px;
    background-color: rgba(255, 249, 242, 0.15);
    margin: 0 10px;
  }

/* CSS for section section:Tabs */
.page-riwayat-aset-saya .tabs-nav {
    display: flex;
    gap: 8px;
    margin: 0 20px 18px 20px;
  }
  .page-riwayat-aset-saya .tab {
    flex: 1;
    padding: 9px 4px;
    border-radius: 12px;
    border: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s ease;
  }
  .page-riwayat-aset-saya .tab.active {
    background-color: #1a1410;
    color: #fff9f2;
  }
  .page-riwayat-aset-saya .tab.inactive {
    background-color: #f6f1e9;
    color: #514840;
  }
  .page-riwayat-aset-saya .tab.inactive:hover {
    background-color: #e8e2d8;
  }

/* CSS for section section:History */
.page-riwayat-aset-saya .history-group {
    margin: 0 20px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .page-riwayat-aset-saya .date-header {
    font-size: 13px;
    color: #514840;
    margin: 0;
    font-weight: 600;
    padding-left: 2px;
  }
  .page-riwayat-aset-saya .history-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .page-riwayat-aset-saya .history-item {
    display: flex;
    align-items: center;
    padding: 13px 14px;
    gap: 12px;
    text-decoration: none;
    transition: background-color 0.2s ease;
  }
  .page-riwayat-aset-saya .history-item:hover {
    background-color: #faf8f5;
  }
  .page-riwayat-aset-saya .item-icon {
    width: 43px;
    height: 43px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }
  .page-riwayat-aset-saya .item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .page-riwayat-aset-saya .item-title {
    font-size: 14px;
    color: #1a1410;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .page-riwayat-aset-saya .item-subtitle {
    font-size: 11px;
    color: #a79c8f;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .page-riwayat-aset-saya .item-amounts {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    flex-shrink: 0;
  }
  .page-riwayat-aset-saya .item-amount {
    font-size: 14px;
    font-weight: 700;
  }
  .page-riwayat-aset-saya .item-amount.negative {
    color: #1a1410;
  }
  .page-riwayat-aset-saya .item-amount.positive {
    color: #3fa66b;
  }
  .page-riwayat-aset-saya .item-status {
    font-size: 11px;
    color: #a79c8f;
  }
`;

/* Gold-asset purchases and their profit claims are fetched page-by-page,
   merged newest-first — the tabs slice this one feed. */
const INVESTMENT_TYPES = ['INVESTMENTS', 'INTEREST'];

/* "Muat Lebih Banyak" reveals the next batch of this many loaded items. */
const HISTORY_PAGE_SIZE = 8;

/* Status group → right-hand state label. */
const STATUS_LABELS = { success: 'Berhasil', pending: 'Diproses', failed: 'Gagal' };

/* Wallet origin label shown under the card title. */
const WALLET_LABELS = {
  BALANCE: 'Saldo JelajahEmas',
  BALANCE_DEPOSIT: 'Saldo JelajahEmas',
  BALANCE_CASHBACK: 'Saldo Cashback',
  BALANCE_HOLD: 'Saldo Emas',
};

/* Design tabs: the whole feed, purchases only, profit claims only. */
const TABS = [
  { key: 'all', label: 'Semua' },
  { key: 'buy', label: 'Beli' },
  { key: 'profit', label: 'Keuntungan' },
];

function matchesTab(trx, tab) {
  if (tab === 'buy') return trx.type === 'INVESTMENTS';
  if (tab === 'profit') return trx.type === 'INTEREST';
  return true;
}

/* Both row kinds name their product: "Beli Emas Produk 1" for purchases,
   "Spread dari Produk 1" for profit. The gram quantity remains the purchase
   fallback when no product name is set. */
function buildTitle(trx) {
  const product = (trx.product_name || '').trim();
  if (trx.type === 'INTEREST') return product ? `Spread dari ${product}` : 'Keuntungan Investasi';
  if (product) return `Beli Emas ${product}`;
  const quantity = Number(trx.investment_quantity);
  if (quantity > 0) return `Beli Emas ${quantity.toLocaleString('id-ID', { maximumFractionDigits: 4 })} gram`;
  return 'Beli Emas';
}

/* Automatic profit (profit_method 'auto') is credited to the main saldo by the
   scheduler, so its subtitle says where it landed instead of naming the wallet;
   hold/manual profits and purchases keep the wallet label. */
function buildSubtitle(trx) {
  const automatic = trx.type === 'INTEREST' && trx.profit_method === 'auto';
  const label = automatic ? 'Masuk ke Saldo' : WALLET_LABELS[trx.wallet_type] || 'Saldo JelajahEmas';
  return [formatTime(trx.created_at), label].filter(Boolean).join(' • ');
}

export default function RiwayatAsetSaya() {
  const { items, loading, error } = useTransactionFeed(INVESTMENT_TYPES);
  const [tab, setTab] = useState('all');
  const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE_SIZE);
  const [statsProfit, setStatsProfit] = useState(null);

  /* All-time profit from the statistics endpoint — the complete server-side
     sum over the BALANCE and BALANCE_HOLD wallets (the feed only carries its
     newest pages). Until it lands, fall back to the loaded INTEREST rows. */
  useEffect(() => {
    let active = true;
    getBalanceStatistics('all-time')
      .then((stats) => {
        const value = Number(stats?.interest_total);
        if (active && Number.isFinite(value)) setStatsProfit(value);
      })
      .catch(() => {
        /* offline — the feed-based fallback below stays in place */
      });
    return () => {
      active = false;
    };
  }, []);

  /* Summary: the gold value the user bought (INVESTMENTS rows) and the profit
     claimed from it (INTEREST rows — credited to BALANCE and BALANCE_HOLD). */
  const purchases = items.reduce(
    (sum, trx) => sum + (trx.type === 'INVESTMENTS' && statusKind(trx.status) === 'success' ? Math.abs(Number(trx.amount) || 0) : 0),
    0
  );
  const feedProfit = items.reduce(
    (sum, trx) => sum + (trx.type === 'INTEREST' && statusKind(trx.status) === 'success' ? Math.abs(Number(trx.amount) || 0) : 0),
    0
  );
  const profit = statsProfit ?? feedProfit;

  /* The tapped tab filters the loaded feed and re-slices it from the top. */
  const filtered = items.filter((trx) => matchesTab(trx, tab));
  const groups = groupByDay(filtered.slice(0, visibleCount));

  const switchTab = (key) => {
    setTab(key);
    setVisibleCount(HISTORY_PAGE_SIZE);
  };

  return (
    <div className="page-riwayat-aset-saya">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="app-header">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/assets/all'); }}>
                    <img src={img_1} alt="Back" />
                  </button>
                  <h1 className="header-title">Riwayat Aset Saya</h1>
                </header>
              </section>
              <section id="section-summary">
                <div className="summary-card">
                  {/* <img src={img_2} className="summary-bg-img" alt="" /> */}
                  <div className="summary-content">
                    <div className="stat-col">
                      <span className="stat-label">Total Transaksi Aset</span>
                      <span className="stat-value">{formatRupiah(purchases)}</span>
                    </div>
                    <div className="divider" />
                    <div className="stat-col">
                      <span className="stat-label">Keuntungan Spread</span>
                      <span className="stat-value green">+{formatRupiah(profit)}</span>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-tabs">
                <nav className="tabs-nav">
                  {TABS.map((t) => (
                    <button
                      key={t.key}
                      className={tab === t.key ? 'tab active' : 'tab inactive'}
                      onClick={() => switchTab(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </nav>
              </section>
              <section id="section-history">
                {error ? (
                  <div className="history-group">
                    <NotifCard variant="error" title="Gagal Memuat Riwayat" description={error} />
                  </div>
                ) : loading ? (
                  <ListState text="Memuat riwayat…" />
                ) : groups.length === 0 ? (
                  <ListState text={tab === 'profit' ? 'Belum ada keuntungan.' : 'Belum ada riwayat aset.'} />
                ) : (
                  <>
                    {groups.map((group) => (
                      <div className="history-group" key={group.label}>
                        <h2 className="date-header">{group.label}</h2>
                        <div className="history-card">
                          {group.items.map((trx) => {
                            /* Gold purchases debit the wallet, so they read "-" in
                               black even though the backend stores the amount
                               positive; profit claims credit and stay "+" green. */
                            const raw = Number(trx.amount) || 0;
                            const debit = trx.type === 'INVESTMENTS' || raw < 0;
                            const amount = Math.abs(raw);
                            return (
                              <div className="history-item" key={trx.id ?? `${trx.type}-${trx.created_at}`}>
                                <img src={img_3} className="item-icon" alt="Beli Emas" />
                                <div className="item-details">
                                  <span className="item-title">{buildTitle(trx)}</span>
                                  <span className="item-subtitle">{buildSubtitle(trx)}</span>
                                </div>
                                <div className="item-amounts">
                                  <span className={`item-amount ${debit ? 'negative' : 'positive'}`}>
                                    {debit ? '-' : '+'}{formatRupiah(amount)}
                                  </span>
                                  <span className="item-status">{STATUS_LABELS[statusKind(trx.status)]}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <div className="history-group">
                      <ListPagination
                        visible={visibleCount}
                        total={filtered.length}
                        pageSize={HISTORY_PAGE_SIZE}
                        onLoadMore={() => setVisibleCount((count) => count + HISTORY_PAGE_SIZE)}
                      />
                    </div>
                  </>
                )}
              </section>
            </div>

    </div>
  );
}
