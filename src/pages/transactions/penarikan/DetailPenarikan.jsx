/* ============================================================================
   DetailPenarikan.jsx — single-file implementation of the withdrawal detail states.
   All steps of this flow live in this one file; the <DetailPenarikan step={n} />
   element passed by App.jsx selects the active step. URL per step:
     1 -> /transactions/detail-penarikan
     2 -> /transactions/detail-penarikan-02
     3 -> /transactions/detail-penarikan-03

   The active step mirrors the REAL withdrawal status (GET
   /api/withdraw/transactions/), not a local demo cycle:
     PENDING                    -> step 1 (orange badge)
     PROCESSING                 -> step 2
     COMPLETED                  -> step 3
     REJECTED / CANCELLED / ... -> step 1 with the red badge
   The target record comes from the row tapped in RiwayatPenarikan
   (location.state.trx), the id handed over by the wizard / loading page
   (location.state.withdrawalId or sessionStorage 'je_withdrawal_id'), or the
   account's newest withdrawal as fallback. The guard in the default export
   redirects to the step that matches the real status; both refresh buttons
   re-fetch the backend instead of reloading the page.
   ============================================================================ */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import NotifCard from '../../../components/NotifCard.jsx';
import { listWithdrawTransactions } from '../../../lib/withdrawApi.js';
import { formatRupiah, formatTime, parseDate } from '../../../lib/transactionFormat.js';
import img_4 from '../../../assets/images/11_384.svg';

/* Step 1 imports (renamed to avoid collisions with other steps) */
import S1_img_1 from '../../../assets/images/7ad23d77f11622cbb0af82a44395f1afe17db1bf.png';
import S1_img_2 from '../../../assets/images/135_337.svg';

/* Step 2 imports (renamed to avoid collisions with other steps) */
import S2_img_1 from '../../../assets/images/2a3095d968e2d2a8159ef070663bf69a50f6efb9.png';
import S2_img_2 from '../../../assets/images/55_592.svg';
import S2_img_3 from '../../../assets/images/55_592.svg';

/* Step 3 imports (renamed to avoid collisions with other steps) */
import S3_img_1 from '../../../assets/images/d0c88bff3940350d94087b6d99bd4af93d239625.png';
import S3_img_2 from '../../../assets/images/11_384.svg';
import S3_img_3 from '../../../assets/images/11_384.svg';

/* ============================ shared helpers ============================ */

/* Withdrawal status -> the step (URL) that should be showing. */
const STAGE_ROUTES = {
  1: '/index/transactions/detail-penarikan',
  2: '/index/transactions/detail-penarikan-02',
  3: '/index/transactions/detail-penarikan-03',
};

const FAILED_STATUSES = ['REJECTED', 'REJECT', 'CANCELLED', 'CANCELED', 'FAILED', 'EXPIRED'];
const SETTLED_STATUSES = ['COMPLETED', 'SUCCESS', 'SUCCESSFUL', ...FAILED_STATUSES];

function stageForStatus(status) {
  const value = String(status || '').toUpperCase();
  if (['COMPLETED', 'SUCCESS', 'SUCCESSFUL'].includes(value)) return 3;
  if (['PROCESSING', 'APPROVED'].includes(value)) return 2;
  return 1;
}

function isFailedStatus(status) {
  return FAILED_STATUSES.includes(String(status || '').toUpperCase());
}

/* Step-1 badge: "Pending", or the red rejection variant. */
function pendingBadge(status) {
  const value = String(status || '').toUpperCase();
  if (value === 'REJECTED') return { key: 'failed', label: 'Ditolak' };
  if (value === 'CANCELLED' || value === 'CANCELED') return { key: 'failed', label: 'Dibatalkan' };
  if (value === 'FAILED' || value === 'EXPIRED') return { key: 'failed', label: 'Gagal' };
  return { key: 'pending', label: 'Pending' };
}

/* Mask the middle digits of the account number: 12 digits -> "8808 **** 5678",
   8 digits -> "87 **** 55" (shorter numbers keep 2 digits on each side). */
function maskAccountNumber(value) {
  const digits = String(value || '').replace(/\s+/g, '');
  if (!digits) return '';
  if (digits.length <= 4) return digits;
  const visible = digits.length > 8 ? 4 : 2;
  return `${digits.slice(0, visible)} **** ${digits.slice(-visible)}`;
}

/* "BCA • 8808 **** 5678" — bank name dropped when unknown. */
function accountLine(trx) {
  const masked = maskAccountNumber(trx?.bank_account_number);
  return [trx?.bank_name, masked].filter(Boolean).join(' • ');
}

/* "13/09/2026 08:42" — transaction-date row. */
function formatDateTime(iso) {
  const date = parseDate(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()} ${formatTime(iso)}`;
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/* "13 Sep 2026, 08:42 WIB" — timeline stamp. */
function formatTimelineStamp(iso) {
  const date = parseDate(iso);
  if (Number.isNaN(date.getTime())) return '';
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}, ${formatTime(iso)} WIB`;
}

/* Real fee / net amount from the linked Withdrawal row (withdrawal_fee and
   withdrawal_net_amount on TransactionSerializer). */
function feeOf(trx) {
  return trx?.withdrawal_fee != null ? Number(trx.withdrawal_fee) : null;
}

function netOf(trx) {
  if (trx?.withdrawal_net_amount != null) return Number(trx.withdrawal_net_amount);
  const fee = feeOf(trx);
  return fee == null ? null : (Number(trx.amount) || 0) - fee;
}

function rupiahOrDash(value) {
  return value == null ? '—' : formatRupiah(value);
}

/* "Terakhir diperbarui HH:mm WIB" / "Menyegarkan status…" — identical label on every step. */
function syncLabelOf(refreshing, lastSync) {
  if (refreshing) return 'Menyegarkan status…';
  const date = lastSync instanceof Date ? lastSync : new Date();
  return `Terakhir diperbarui ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} WIB`;
}

/* ---------------------- withdrawal record + polling ---------------------- */

/* Resolves which withdrawal the user is looking at and keeps its status real.
   Order: the tapped history row (trx_id) > the wizard hand-off id
   (withdrawalId / sessionStorage) > the account's newest withdrawal. Once a
   trx_id is known every re-fetch goes through order_num so it always returns
   exactly this record. Polls every 15s until the payout settles; the refresh
   buttons re-fetch for real instead of the old fake local status cycle. */
function useWithdrawalRecord() {
  const location = useLocation();
  const initial = location.state?.trx || null;
  const handoffId = location.state?.withdrawalId ?? sessionStorage.getItem('je_withdrawal_id') ?? '';
  const [trx, setTrx] = useState(initial);
  const [loading, setLoading] = useState(!initial);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastSync, setLastSync] = useState(() => new Date());
  const trxIdRef = useRef(initial?.trx_id || '');

  const load = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      let record = null;
      if (trxIdRef.current) {
        /* Exact lookup by order number (trx_id). */
        const payload = await listWithdrawTransactions({ orderNum: trxIdRef.current });
        const rows = Array.isArray(payload?.results) ? payload.results : [];
        record = rows.find((row) => row.trx_id === trxIdRef.current) || null;
      } else {
        /* Walk the newest pages until the hand-off id is found. */
        let payload = await listWithdrawTransactions({ page: 1 });
        let rows = Array.isArray(payload?.results) ? payload.results : [];
        const newest = rows[0] || null;
        let page = 1;
        while (!record && handoffId && rows.length > 0 && page < 5) {
          record = rows.find((row) => String(row.withdrawal_id ?? '') === String(handoffId)) || null;
          if (record || !payload?.next) break;
          page += 1;
          payload = await listWithdrawTransactions({ page });
          rows = Array.isArray(payload?.results) ? payload.results : [];
        }
        if (!record) record = newest;
      }
      if (record) {
        trxIdRef.current = record.trx_id || trxIdRef.current;
        setTrx(record);
        setError('');
        if (handoffId && String(record.withdrawal_id ?? '') === String(handoffId)) {
          sessionStorage.removeItem('je_withdrawal_id');
        }
      } else if (!trxIdRef.current && !initial) {
        setTrx(null);
      }
      setLastSync(new Date());
    } catch (err) {
      setError(err?.message || 'Gagal memuat status penarikan.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [handoffId, initial]);

  useEffect(() => {
    load();
  }, [load]);

  /* Keep polling while the payout is still moving (PENDING/PROCESSING). */
  const settled = SETTLED_STATUSES.includes(String(trx?.status || '').toUpperCase());
  useEffect(() => {
    if (settled) return undefined;
    const id = window.setInterval(() => load(true), 15000);
    return () => window.clearInterval(id);
  }, [settled, load]);

  const refresh = useCallback(() => load(false), [load]);

  return { trx, loading, refreshing, error, lastSync, refresh };
}

/* Minimal full-height state screen (loading / empty / error). */
const StateShellStyles = `
.page-detail-penarikan-state {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 0 32px;
  text-align: center;
  background-color: #fffbf4;
}
.page-detail-penarikan-state, .page-detail-penarikan-state * {
  box-sizing: border-box;
}
.page-detail-penarikan-state .state-spinner {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px solid #efe7dc;
  border-top-color: #e8790c;
  animation: dpen-spin 0.9s linear infinite;
}
@keyframes dpen-spin {
  to { transform: rotate(360deg); }
}
.page-detail-penarikan-state .state-message {
  font-size: 14px;
  font-weight: 500;
  color: #514840;
  margin: 0;
  line-height: 1.5;
}
.page-detail-penarikan-state .state-btn {
  border: none;
  cursor: pointer;
  font-family: inherit;
  background-color: #f1b04a;
  color: #1a1410;
  font-size: 14px;
  font-weight: 600;
  padding: 13px 28px;
  border-radius: 14px;
}
.page-detail-penarikan-state .state-btn:active {
  opacity: 0.8;
}
`;

function StateShell({ message, showSpinner = false, actionLabel = '', onAction }) {
  return (
    <div className="page-detail-penarikan-state">
      <style>{StateShellStyles}</style>
      {showSpinner ? <div className="state-spinner" /> : null}
      <p className="state-message">{message}</p>
      {actionLabel ? (
        <button className="state-btn" onClick={onAction}>{actionLabel}</button>
      ) : null}
    </div>
  );
}


/* ================= Step 1 — /transactions/detail-penarikan (was DetailPenarikan.jsx) ================= */

const DetailPenarikan01Styles = `
/* Scoped styles for DetailPenarikan — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-detail-penarikan to isolate this page. */

.page-detail-penarikan {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  min-height: 100vh;
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  display: flex;
  flex-direction: column;
  color: #1a1410;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 76.9% 11.5%, rgba(255, 201, 60, 0.28) 0%, rgba(255, 201, 60, 0) 70%),
    radial-gradient(circle at 111.1% 25.5%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 70%),
    radial-gradient(circle at 90.9% -40.9%, rgba(255, 159, 28, 0.38) 0%, rgba(255, 159, 28, 0) 70%);
  width: 100%;
}

.page-detail-penarikan, .page-detail-penarikan * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Hero */
.page-detail-penarikan #section-hero {
    padding: 36px 22px 22px;
    display: flex;
    justify-content: center;
  }
  .page-detail-penarikan .hero-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 14px;
  }
  .page-detail-penarikan .hero-image {
    width: 126px;
    height: 131px;
    object-fit: contain;
  }
  .page-detail-penarikan .hero-title {
    font-size: 20px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }
  .page-detail-penarikan .hero-subtitle {
    font-size: 14px;
    font-weight: 400;
    color: #514840;
    margin: 0;
    line-height: 1.4;
  }

/* CSS for section section:TransactionDetails */
.page-detail-penarikan #section-transaction-details {
    padding: 0 22px 16px;
  }
  .page-detail-penarikan .details-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
  }
  .page-detail-penarikan .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid #efe7dc;
  }
  .page-detail-penarikan .detail-row.borderless {
    border-bottom: none;
    padding-bottom: 0;
  }
  .page-detail-penarikan .detail-row:first-child {
    padding-top: 0;
  }
  .page-detail-penarikan .detail-label {
    color: #a79c8f;
    font-size: 13px;
    font-weight: 400;
  }
  .page-detail-penarikan .detail-value {
    color: #1a1410;
    font-size: 13px;
    font-weight: 600;
  }
  .page-detail-penarikan .status-badge.pending {
    background-color: rgba(255, 159, 28, 0.14);
    color: #e8790c;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
  }
  .page-detail-penarikan .status-badge.processing {
    background-color: rgba(28, 179, 255, 0.14);
    color: #1c8fe0;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
  }
  .page-detail-penarikan .status-badge.success {
    background-color: rgba(63, 166, 107, 0.14);
    color: #3fa66b;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
  }
  .page-detail-penarikan .status-badge.failed {
    background-color: rgba(226, 76, 76, 0.14);
    color: #e24c4c;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
  }
  .page-detail-penarikan .sync-info {
    text-align: center;
    font-size: 11px;
    color: #a79c8f;
    margin: 0 0 2px 0;
  }

/* CSS for section section:WithdrawalStatus */
.page-detail-penarikan #section-withdrawal-status {
    padding: 0 22px 20px;
  }
  .page-detail-penarikan .status-card {
    background-color: #f6f1e9;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .page-detail-penarikan .status-title {
    font-size: 14px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }
  .page-detail-penarikan .timeline {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .page-detail-penarikan .timeline-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .page-detail-penarikan .timeline-icon {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: #e8790c;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .page-detail-penarikan .timeline-icon img {
    width: 10px;
    height: 10px;
  }
  .page-detail-penarikan .timeline-icon.inactive {
    background-color: #efe7dc;
  }
  .page-detail-penarikan .timeline-icon.failed {
    background-color: #e24c4c;
  }
  .page-detail-penarikan .timeline-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .page-detail-penarikan .timeline-item.active .timeline-step-title {
    color: #1a1410;
    font-weight: 600;
  }
  .page-detail-penarikan .timeline-step-title {
    font-size: 13px;
    color: #a79c8f;
    font-weight: 400;
  }
  .page-detail-penarikan .timeline-step-desc {
    font-size: 12px;
    color: #a79c8f;
    font-weight: 400;
  }

/* CSS for section section:Actions */
.page-detail-penarikan #section-actions {
    padding: 0 22px 24px;
    margin-top: auto;
  }
  .page-detail-penarikan .actions-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .page-detail-penarikan .btn {
    width: 100%;
    padding: 15px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-family: 'Inter', sans-serif;
    text-align: center;
    transition: opacity 0.2s;
  }
  .page-detail-penarikan .btn:active {
    opacity: 0.8;
  }
  .page-detail-penarikan .btn-primary {
    background-color: #f1b04a;
    color: #1a1410;
  }
  .page-detail-penarikan .btn-secondary {
    background-color: transparent;
    border: 1px solid #efe7dc;
    color: #514840;
  }
`;

function DetailPenarikan01({ trx, refreshing, lastSync, onRefresh }) {
  const navigate = useNavigate();

  /* Real record: PENDING shows the orange badge, a rejection/cancellation
     renders the red variant. Values below all come from the backend. */
  const statusValue = String(trx.status || '').toUpperCase();
  const failed = isFailedStatus(statusValue);
  const refunded = ['REJECTED', 'CANCELLED', 'CANCELED'].includes(statusValue);
  const badge = pendingBadge(statusValue);
  const account = accountLine(trx);
  const stamp = formatTimelineStamp(trx.created_at);
  const heroTitle = !failed
    ? 'Penarikan Berhasil Diajukan'
    : statusValue === 'CANCELLED' || statusValue === 'CANCELED'
      ? 'Penarikan Dibatalkan'
      : statusValue === 'REJECTED'
        ? 'Penarikan Ditolak'
        : 'Penarikan Gagal';
  const syncLabel = syncLabelOf(refreshing, lastSync);

  return (
    <div className="page-detail-penarikan">
      <style>{DetailPenarikan01Styles}</style>
      <div>
              <section id="section-hero">
                <div className="hero-container">
                  <img src={S1_img_1} alt="Success Illustration" className="hero-image" />
                  <h1 className="hero-title">{heroTitle}</h1>
                  <p className="hero-subtitle">
                    {failed
                      ? (refunded
                          ? 'Dana kamu dikembalikan ke saldo. Silakan cek riwayat transaksi.'
                          : 'Penarikan tidak berhasil diproses. Silakan cek riwayat transaksi.')
                      : <>Permintaan penarikan kamu<br />sedang kami proses ke rekening tujuan.</>}
                  </p>
                </div>
              </section>
              <section id="section-transaction-details">
                <div className="details-card">
                  <div className="detail-row">
                    <span className="detail-label">Tanggal transaksi</span>
                    <span className="detail-value">{formatDateTime(trx.created_at)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Nominal Ditarik</span>
                    <span className="detail-value">{formatRupiah(trx.amount)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Biaya Admin</span>
                    <span className="detail-value">{rupiahOrDash(feeOf(trx))}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total Diterima</span>
                    <span className="detail-value">{rupiahOrDash(netOf(trx))}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Rekening Tujuan</span>
                    <span className="detail-value">{account || '—'}</span>
                  </div>
                  <div className="detail-row borderless">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge ${badge.key}`}>{badge.label}</span>
                  </div>
                </div>
              </section>
              <section id="section-withdrawal-status">
                <div className="status-card">
                  <h3 className="status-title">Status Penarikan</h3>
                  <div className="timeline">
                    <div className="timeline-item active">
                      <div className="timeline-icon">
                        <img src={S1_img_2} alt="Check" />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-step-title">Permintaan Diajukan</div>
                        <div className="timeline-step-desc">{stamp}</div>
                      </div>
                    </div>
                    <div className={`timeline-item${failed ? ' active' : ''}`}>
                      {failed ? (
                        <div className="timeline-icon failed">
                          <img src={S1_img_2} alt="Status" />
                        </div>
                      ) : (
                        <div className="timeline-icon inactive" />
                      )}
                      <div className="timeline-content">
                        <div className="timeline-step-title">{failed ? badge.label : 'Sedang Diproses Bank'}</div>
                        <div className="timeline-step-desc">
                          {failed
                            ? (refunded ? 'Dana sudah dikembalikan ke saldo kamu' : 'Penarikan tidak berhasil diproses')
                            : 'Estimasi selesai 1–5 jam kerja'}
                        </div>
                      </div>
                    </div>
                    {!failed && (
                      <div className="timeline-item">
                        <div className="timeline-icon inactive" />
                        <div className="timeline-content">
                          <div className="timeline-step-title">Dana Diterima</div>
                          <div className="timeline-step-desc">
                            {account ? `Rekening ${account}` : 'Estimasi masuk 1–5 jam kerja'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
              <section id="section-actions">
                <div className="actions-container">
                  <p className="sync-info">{syncLabel}</p>
                  <button className="btn btn-primary" onClick={onRefresh} disabled={refreshing}>
                    {refreshing ? 'Menyegarkan…' : 'Segarkan Halaman'}
                  </button>
                  <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); navigate('/index/transactions/riwayat-penarikan'); }}>Lihat Detail Transaksi</button>
                </div>
              </section>
            </div>

    </div>
  );
}

/* ================= Step 2 — /transactions/detail-penarikan-02 (was DetailPenarikan02.jsx) ================= */

const DetailPenarikan02Styles = `
/* Scoped styles for DetailPenarikan02 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-detail-penarikan-02 to isolate this page. */

.page-detail-penarikan-02 {
  background-color: #e5e5e5;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.page-detail-penarikan-02 {
  width: 100%;
  max-width: 100%;
  background-color: #fffbf4;
  min-height: 100vh;
  margin: 0;
  position: relative;
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  box-sizing: border-box;
}

.page-detail-penarikan-02::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 76% 11%, rgba(255, 201, 60, 0.28) 0%, rgba(255, 201, 60, 0) 70%),
    radial-gradient(circle at 111% 25%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 70%),
    radial-gradient(circle at 90% -40%, rgba(255, 159, 28, 0.38) 0%, rgba(255, 159, 28, 0) 70%);
  pointer-events: none;
  z-index: -1;
}

.page-detail-penarikan-02 .section-container {
  padding-left: 22px;
  padding-right: 22px;
  box-sizing: border-box;
  width: 100%;
}

/* ---- inline section styles ---- */

/* CSS for section section:Hero */
.page-detail-penarikan-02 .pt-36 { padding-top: 36px; }
.page-detail-penarikan-02 .hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 22px;
}
.page-detail-penarikan-02 .hero-image {
  width: 160px;
  height: 147px;
  object-fit: contain;
  margin-bottom: 15px;
}
.page-detail-penarikan-02 .hero-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1410;
  margin: 0 0 8px 0;
  line-height: 1.3;
  max-width: 316px;
}
.page-detail-penarikan-02 .hero-subtitle {
  font-size: 14px;
  color: #514840;
  margin: 0;
}

/* CSS for section section:TransactionDetails */
.page-detail-penarikan-02 #section-details {
  margin-bottom: 20px;
}
.page-detail-penarikan-02 .details-card {
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
}
.page-detail-penarikan-02 .detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #efe7dc;
}
.page-detail-penarikan-02 .detail-row.no-border {
  border-bottom: none;
  padding-bottom: 0;
}
.page-detail-penarikan-02 .detail-row:first-child {
  padding-top: 0;
}
.page-detail-penarikan-02 .detail-label {
  font-size: 12px;
  color: #a79c8f;
}
.page-detail-penarikan-02 .detail-value {
  font-size: 12px;
  font-weight: 600;
  color: #1a1410;
  text-align: right;
}
.page-detail-penarikan-02 .status-badge {
  background-color: rgba(28, 179, 255, 0.14);
  border-radius: 10px;
  padding: 4px 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.page-detail-penarikan-02 .status-text {
  font-size: 12px;
  font-weight: 600;
  color: #629fce;
}

/* CSS for section section:WithdrawalStatus */
.page-detail-penarikan-02 #section-status {
  margin-bottom: 24px;
}
.page-detail-penarikan-02 .status-card {
  background-color: #f6f1e9;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.page-detail-penarikan-02 .status-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
}
.page-detail-penarikan-02 .status-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.page-detail-penarikan-02 .timeline-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.page-detail-penarikan-02 .timeline-icon {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
.page-detail-penarikan-02 .timeline-icon.active {
  background-color: #e8790c;
}
.page-detail-penarikan-02 .timeline-icon.inactive {
  background-color: #efe7dc;
}
.page-detail-penarikan-02 .timeline-icon img {
  width: 10px;
  height: 10px;
}
.page-detail-penarikan-02 .timeline-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 2px;
}
.page-detail-penarikan-02 .timeline-step-title {
  font-size: 12px;
  font-weight: 600;
  color: #1a1410;
  margin: 0;
}
.page-detail-penarikan-02 .timeline-step-desc {
  font-size: 10px;
  color: #a79c8f;
  margin: 0;
}
.page-detail-penarikan-02 .inactive-text {
  color: #a79c8f;
}

/* CSS for section section:Actions */
.page-detail-penarikan-02 .pb-24 { padding-bottom: 24px; }
.page-detail-penarikan-02 .actions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}
.page-detail-penarikan-02 .sync-info {
  text-align: center;
  font-size: 11px;
  color: #a79c8f;
  margin: 0 0 2px 0;
}
.page-detail-penarikan-02 .btn {
  width: 100%;
  border: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-detail-penarikan-02 .btn-primary {
  background-color: #f1b04a;
  color: #1a1410;
  border-radius: 14px;
  padding: 15px;
}
.page-detail-penarikan-02 .btn-secondary {
  background-color: transparent;
  border: 1px solid #efe7dc;
  color: #514840;
  border-radius: 14px;
  padding: 13px;
}
`;

function DetailPenarikan02({ trx, refreshing, lastSync, onRefresh }) {
  const navigate = useNavigate();

  const account = accountLine(trx);
  const stamp = formatTimelineStamp(trx.created_at);
  const syncLabel = syncLabelOf(refreshing, lastSync);

  return (
    <div className="page-detail-penarikan-02">
      <style>{DetailPenarikan02Styles}</style>
      <div>
              <section id="section-hero" className="section-container pt-36">
                <div className="hero-content">
                  <img src={S2_img_1} alt="Hero Image" className="hero-image" />
                  <h1 className="hero-title">Penarikan Sedang Dalam Pengiriman</h1>
                  <p className="hero-subtitle">Bersiap menerima penarikan kamu?</p>
                </div>
              </section>
              <section id="section-details" className="section-container">
                <div className="details-card">
                  <div className="detail-row">
                    <span className="detail-label">Tanggal transaksi</span>
                    <span className="detail-value">{formatDateTime(trx.created_at)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Nominal Ditarik</span>
                    <span className="detail-value">{formatRupiah(trx.amount)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Biaya Admin</span>
                    <span className="detail-value">{rupiahOrDash(feeOf(trx))}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total Diterima</span>
                    <span className="detail-value">{rupiahOrDash(netOf(trx))}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Rekening Tujuan</span>
                    <span className="detail-value">{account || '—'}</span>
                  </div>
                  <div className="detail-row no-border">
                    <span className="detail-label">Status</span>
                    <div className="status-badge">
                      <span className="status-text">Sedang Diproses</span>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-status" className="section-container">
                <div className="status-card">
                  <h2 className="status-title">Status Penarikan</h2>
                  <div className="status-timeline">
                    <div className="timeline-item">
                      <div className="timeline-icon active">
                        <img src={S2_img_2} alt="Check" />
                      </div>
                      <div className="timeline-content">
                        <h3 className="timeline-step-title">Permintaan Diajukan</h3>
                        <p className="timeline-step-desc">{stamp}</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-icon active">
                        <img src={S2_img_3} alt="Check" />
                      </div>
                      <div className="timeline-content">
                        <h3 className="timeline-step-title">Sedang Diproses Bank</h3>
                        <p className="timeline-step-desc">Estimasi selesai 1–5 jam kerja</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-icon inactive" />
                      <div className="timeline-content">
                        <h3 className="timeline-step-title inactive-text">Dana Diterima</h3>
                        <p className="timeline-step-desc inactive-text">{account ? `Rekening ${account}` : 'Rekening tujuan'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-actions" className="section-container pb-24">
                <div className="actions-wrapper">
                  <p className="sync-info">{syncLabel}</p>
                  <button className="btn btn-primary" onClick={onRefresh} disabled={refreshing}>
                    {refreshing ? 'Menyegarkan…' : 'Segarkan Halaman'}
                  </button>
                  <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); navigate('/index/transactions/riwayat-penarikan'); }}>Lihat Detail Transaksi</button>
                </div>
              </section>
            </div>

    </div>
  );
}

/* ================= Step 3 — /transactions/detail-penarikan-03 (was DetailPenarikan03.jsx) ================= */

const DetailPenarikan03Styles = `
/* Scoped styles for DetailPenarikan03 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-detail-penarikan-03 to isolate this page. */

.page-detail-penarikan-03 {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  max-width: 100%;
  background-color: #fffbf4;
  background-image: radial-gradient(circle at 76% 11%, rgba(255, 201, 60, 0.28) 0%, transparent 70%),
                    radial-gradient(circle at 111% 25%, rgba(255, 255, 255, 0.55) 0%, transparent 70%),
                    radial-gradient(circle at 90% -40%, rgba(255, 159, 28, 0.38) 0%, transparent 70%);
  min-height: 100vh;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.1);
  padding: 36px 22px 24px 22px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.page-detail-penarikan-03, .page-detail-penarikan-03 * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Hero */
.page-detail-penarikan-03 #section-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}
.page-detail-penarikan-03 .hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.page-detail-penarikan-03 .hero-image {
  width: 154px;
  height: 141px;
  object-fit: contain;
  margin-bottom: 16px;
}
.page-detail-penarikan-03 .hero-title {
  color: #1a1410;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
}
.page-detail-penarikan-03 .hero-subtitle {
  color: #514840;
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
  max-width: 280px;
}

/* CSS for section section:TransactionDetails */
.page-detail-penarikan-03 #section-transaction-details {
  margin-bottom: 20px;
}
.page-detail-penarikan-03 .details-card {
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  border-radius: 16px;
  padding: 4px 16px;
  display: flex;
  flex-direction: column;
}
.page-detail-penarikan-03 .detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #efe7dc;
}
.page-detail-penarikan-03 .detail-row.no-border {
  border-bottom: none;
}
.page-detail-penarikan-03 .detail-label {
  color: #a79c8f;
  font-size: 13px;
}
.page-detail-penarikan-03 .detail-value {
  color: #1a1410;
  font-size: 13px;
  font-weight: 600;
}
.page-detail-penarikan-03 .status-badge {
  background-color: rgba(63, 166, 107, 0.14);
  color: #2f8f5a;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

/* CSS for section section:WithdrawalStatus */
.page-detail-penarikan-03 #section-withdrawal-status {
  margin-bottom: 24px;
}
.page-detail-penarikan-03 .status-card {
  background-color: #f6f1e9;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.page-detail-penarikan-03 .status-title {
  color: #1a1410;
  font-size: 14px;
  font-weight: 700;
  margin: 0;
}
.page-detail-penarikan-03 .status-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.page-detail-penarikan-03 .timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.page-detail-penarikan-03 .timeline-icon {
  background-color: #e8790c;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.page-detail-penarikan-03 .timeline-icon img {
  width: 10px;
  height: 10px;
}
.page-detail-penarikan-03 .timeline-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.page-detail-penarikan-03 .timeline-step {
  color: #1a1410;
  font-size: 13px;
  font-weight: 600;
}
.page-detail-penarikan-03 .timeline-time {
  color: #a79c8f;
  font-size: 12px;
}

/* CSS for section section:Actions */
.page-detail-penarikan-03 #section-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}
.page-detail-penarikan-03 .sync-info {
  text-align: center;
  font-size: 11px;
  color: #a79c8f;
  margin: 0 0 2px 0;
}
.page-detail-penarikan-03 .btn {
  width: 100%;
  padding: 15px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: 'Inter', sans-serif;
  text-align: center;
  transition: opacity 0.2s ease;
}
.page-detail-penarikan-03 .btn:active {
  opacity: 0.8;
}
.page-detail-penarikan-03 .btn-primary {
  background-color: #f1b04a;
  color: #1a1410;
}
.page-detail-penarikan-03 .btn-secondary {
  background-color: transparent;
  border: 1px solid #efe7dc;
  color: #514840;
}
`;

function DetailPenarikan03({ trx, refreshing, lastSync, onRefresh }) {
  const navigate = useNavigate();

  const account = accountLine(trx);
  const stamp = formatTimelineStamp(trx.created_at);
  const syncLabel = syncLabelOf(refreshing, lastSync);

  return (
    <div className="page-detail-penarikan-03">
      <style>{DetailPenarikan03Styles}</style>
      <div>
              <section id="section-hero">
                <div className="hero-content">
                  <img src={S3_img_1} alt="Success Illustration" className="hero-image" />
                  <h1 className="hero-title">Penarikan Berhasil Dikirim</h1>
                  <p className="hero-subtitle">Penarikan kamu sudah tiba loh! Yuk periksa detail transaksinya.</p>
                </div>
              </section>
              <section id="section-transaction-details">
                <div className="details-card">
                  <div className="detail-row">
                    <span className="detail-label">Tanggal transaksi</span>
                    <span className="detail-value">{formatDateTime(trx.created_at)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Nominal Ditarik</span>
                    <span className="detail-value">{formatRupiah(trx.amount)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Biaya Admin</span>
                    <span className="detail-value">{rupiahOrDash(feeOf(trx))}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total Diterima</span>
                    <span className="detail-value">{rupiahOrDash(netOf(trx))}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Rekening Tujuan</span>
                    <span className="detail-value">{account || '—'}</span>
                  </div>
                  <div className="detail-row no-border">
                    <span className="detail-label">Status</span>
                    <span className="status-badge">Berhasil</span>
                  </div>
                </div>
              </section>
              <section id="section-withdrawal-status">
                <div className="status-card">
                  <h3 className="status-title">Status Penarikan</h3>
                  <div className="status-timeline">
                    <div className="timeline-item">
                      <div className="timeline-icon">
                        <img src={S3_img_2} alt="Check" />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-step">Permintaan Diajukan</div>
                        <div className="timeline-time">{stamp}</div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-icon">
                        <img src={S3_img_3} alt="Check" />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-step">Sedang Diproses Bank</div>
                        <div className="timeline-time">Selesai diproses bank tujuan</div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-icon">
                        <img src={img_4} alt="Check" />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-step">Dana Diterima</div>
                        <div className="timeline-time">{account ? `Rekening ${account}` : 'Rekening tujuan'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-actions">
                <p className="sync-info">{syncLabel}</p>
                <button className="btn btn-primary" onClick={onRefresh} disabled={refreshing}>
                  {refreshing ? 'Menyegarkan…' : 'Segarkan Halaman'}
                </button>
                <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); navigate('/index/transactions/riwayat-penarikan'); }}>Lihat Detail Transaksi</button>
              </section>
            </div>

    </div>
  );
}

const STEP_COMPONENTS = { 1: DetailPenarikan01, 2: DetailPenarikan02, 3: DetailPenarikan03 };

export default function DetailPenarikan({ step = 1 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { trx, loading, refreshing, error, lastSync, refresh } = useWithdrawalRecord();

  if (loading) {
    return <StateShell message="Memuat status penarikan…" showSpinner />;
  }

  if (!trx) {
    if (error) {
      return (
        <div className="page-detail-penarikan-state">
          <style>{StateShellStyles}</style>
          <NotifCard variant="error" title="Gagal Memuat Status Penarikan" description={error} showClose={false} />
          <button className="state-btn" onClick={refresh}>Coba Lagi</button>
        </div>
      );
    }
    return (
      <StateShell
        message="Belum ada transaksi penarikan."
        actionLabel="Lihat Riwayat Penarikan"
        onAction={() => navigate('/index/transactions/riwayat-penarikan')}
      />
    );
  }

  /* The real status owns the URL: a mismatch redirects to the right step. */
  const stage = stageForStatus(trx.status);
  if (stage !== step) {
    return <Navigate replace to={STAGE_ROUTES[stage]} state={location.state} />;
  }

  const Step = STEP_COMPONENTS[step] ?? STEP_COMPONENTS[1];
  return <Step trx={trx} refreshing={refreshing} lastSync={lastSync} onRefresh={refresh} />;
}
