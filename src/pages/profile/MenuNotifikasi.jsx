import { useEffect, useState } from 'react';
import { goBack } from '../../lib/backNav.js';
import NotifCard from '../../components/NotifCard.jsx';
import ListPagination from '../../components/ListPagination.jsx';
import ListState from '../../components/ListState.jsx';
import { useTransactionFeed } from '../../lib/useTransactionFeed.js';
import { formatRupiah, formatTime, groupByDay, statusKind } from '../../lib/transactionFormat.js';
import { getSeenAt, isUnseen, markSeenUpTo } from '../../lib/notifSeen.js';
import img_1 from '../../assets/images/156_1523.svg';
import img_2 from '../../assets/images/f9c5183ac158cef9ca41f24d7c27c0a86cc4e6fd.webp';
import img_3 from '../../assets/images/0e9552200559b01fbf7792e280655b0f9c3b5705.webp';
import img_4 from '../../assets/images/1a3342ff63aa8a0ae78e698732cdce70f07c9d3c.webp';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for MenuNotifikasi — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-menu-notifikasi to isolate this page. */

.page-menu-notifikasi {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  min-height: 100vh;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 80% 0%, rgba(255, 159, 28, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.8) 0%, transparent 60%),
    radial-gradient(circle at 100% 20%, rgba(255, 201, 60, 0.15) 0%, transparent 50%);
  box-shadow: 0px 0px 30px rgba(26, 20, 16, 0.1);
  color: #1a1410;
  box-sizing: border-box;
  width: 100%;
}

.page-menu-notifikasi *,.page-menu-notifikasi  *::before,.page-menu-notifikasi  *::after {
  box-sizing: inherit;
}

.page-menu-notifikasi h1,.page-menu-notifikasi  h2,.page-menu-notifikasi  h3,.page-menu-notifikasi  p {
  margin: 0;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-menu-notifikasi #section-header .app-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 20px 16px;
}
.page-menu-notifikasi #section-header .back-button {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(26, 20, 16, 0.06);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;
}
.page-menu-notifikasi #section-header .back-button img {
  width: 18px;
  height: 18px;
}
.page-menu-notifikasi #section-header .header-title {
  color: #1a1410;
  font-size: 18px;
  font-weight: 700;
}

/* CSS for section section:Notifications */
.page-menu-notifikasi #section-notifications .notifications-container {
  padding: 6px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.page-menu-notifikasi #section-notifications .date-header {
  padding-left: 2px;
  margin-bottom: 2px;
}
.page-menu-notifikasi #section-notifications .date-header h2 {
  color: #a79c8f;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.page-menu-notifikasi #section-notifications .notification-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  gap: 12px;
  box-shadow: 0px 2px 10px 0px rgba(26, 20, 16, 0.04);
  position: relative;
}
.page-menu-notifikasi #section-notifications .card-icon {
  width: 54px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
}
.page-menu-notifikasi #section-notifications .card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.page-menu-notifikasi #section-notifications .card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.page-menu-notifikasi #section-notifications .card-title {
  color: #1a1410;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.page-menu-notifikasi #section-notifications .card-time {
  color: #a79c8f;
  font-size: 12px;
  flex-shrink: 0;
  padding-right: 12px;
}
.page-menu-notifikasi #section-notifications .card-desc {
  color: #514840;
  font-size: 13px;
  line-height: 1.4;
  margin-right: 10px;
}
.page-menu-notifikasi #section-notifications .unread-dot {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 7px;
  height: 7px;
  background-color: #e8790c;
  border-radius: 50%;
  z-index: 1;
}
.page-menu-notifikasi #section-notifications .notif-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
`;

/* The notification feed combines three transaction types; each type is
   fetched separately (its own page) and merged into one time-ordered list. */
const NOTIFICATION_TYPES = ['DEPOSIT', 'WITHDRAW', 'INVESTMENTS'];

/* "Muat Lebih Banyak" reveals the next batch of this many loaded items. */
const NOTIFICATION_PAGE_SIZE = 8;

/* GET /api/transactions/ date filter: rolling 7-calendar-day window
   (today + the 6 previous days), formatted as YYYY-MM-DD. */
function startDateParam() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  const pad = (value) => String(value).padStart(2, '0');
  return `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
}

/* Per-type icon + card title, by status group. */
const TYPE_META = {
  DEPOSIT: { icon: img_2, success: 'Sukses Isi Ulang', pending: 'Isi Ulang Diproses', failed: 'Isi Ulang Gagal' },
  WITHDRAW: { icon: img_3, success: 'Sukses Tarik Dana', pending: 'Tarik Dana Diproses', failed: 'Tarik Dana Gagal' },
  INVESTMENTS: { icon: img_4, success: 'Sukses Aktifkan Aset', pending: 'Pembelian Emas Diproses', failed: 'Pembelian Emas Gagal' },
};

/* Human sentence for the card body, per type + status group. */
function buildDescription(trx, kind) {
  const amount = formatRupiah(trx.amount);
  const quantity = Number(trx.investment_quantity);
  const grams = quantity > 0 ? `${quantity.toLocaleString('id-ID', { maximumFractionDigits: 4 })} gr` : '';
  if (trx.type === 'DEPOSIT') {
    if (kind === 'success') return `Saldo kamu berhasil ditambahkan sebesar ${amount}.`;
    if (kind === 'failed') return `Isi ulang saldo sebesar ${amount} tidak berhasil diproses.`;
    return `Isi ulang saldo sebesar ${amount} sedang diproses.`;
  }
  if (trx.type === 'WITHDRAW') {
    if (kind === 'success') return `Penarikan dana sebesar ${amount} telah berhasil diproses ke rekening tujuan.`;
    if (kind === 'failed') return `Penarikan dana sebesar ${amount} tidak berhasil diproses.`;
    return `Penarikan dana sebesar ${amount} sedang diproses.`;
  }
  if (trx.type === 'INVESTMENTS') {
    if (kind === 'success') {
      return grams
        ? `Pembelian emas ${grams} berhasil. Aset emas kamu aktif dan siap digunakan.`
        : 'Aset emas kamu sudah aktif dan siap digunakan.';
    }
    if (kind === 'failed') return `Pembelian emas sebesar ${amount} tidak berhasil diproses.`;
    return `Pembelian emas sebesar ${amount} sedang diproses.`;
  }
  return trx.description || '';
}

export default function MenuNotifikasi() {
  const { items, loading, error } = useTransactionFeed(NOTIFICATION_TYPES, {
    startDate: startDateParam(),
    errorMessage: 'Gagal memuat notifikasi.',
  });
  const [visibleCount, setVisibleCount] = useState(NOTIFICATION_PAGE_SIZE);

  /* Unseen watermark frozen at entry: the dot flags pending items that came
     in after the previous visit. Once the list has been displayed the
     watermark moves up (effect below), so those dots clear next visit. */
  const [seenAt] = useState(getSeenAt);
  useEffect(() => {
    if (!loading && !error) markSeenUpTo(items);
  }, [loading, error, items]);

  /* Newest-first items collapsed into consecutive day groups. */
  const groups = groupByDay(items.slice(0, visibleCount));

  return (
    <div className="page-menu-notifikasi">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="app-header">
                  <button className="back-button" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/profil'); }}>
                    <img src={img_1} alt="Back Icon" />
                  </button>
                  <h1 className="header-title">Notifikasi</h1>
                </header>
              </section>
              <section id="section-notifications">
                <div className="notifications-container">
                  {error ? (
                    <NotifCard variant="error" title="Gagal Memuat Notifikasi" description={error} />
                  ) : loading ? (
                    <ListState text="Memuat notifikasi…" />
                  ) : groups.length === 0 ? (
                    <ListState text="Belum ada notifikasi." />
                  ) : (
                    groups.map((group) => (
                      <div className="notif-group" key={group.label}>
                        <div className="date-header">
                          <h2>{group.label}</h2>
                        </div>
                        {group.items.map((trx) => {
                          const meta = TYPE_META[trx.type] || TYPE_META.DEPOSIT;
                          const kind = statusKind(trx.status);
                          return (
                            <div className="notification-card" key={trx.id ?? `${trx.type}-${trx.created_at}`}>
                              <img src={meta.icon} alt={meta[kind]} className="card-icon" />
                              <div className="card-content">
                                <div className="card-header">
                                  <h3 className="card-title">{meta[kind]}</h3>
                                  <span className="card-time">{formatTime(trx.created_at)}</span>
                                </div>
                                <p className="card-desc">{buildDescription(trx, kind)}</p>
                              </div>
                              {kind === 'pending' && isUnseen(trx, seenAt) && <div className="unread-dot" />}
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                  <ListPagination
                    visible={visibleCount}
                    total={items.length}
                    label="notifikasi"
                    pageSize={NOTIFICATION_PAGE_SIZE}
                    onLoadMore={() => setVisibleCount((count) => count + NOTIFICATION_PAGE_SIZE)}
                  />
                </div>
              </section>
            </div>

    </div>
  );
}
