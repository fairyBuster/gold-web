import { useCallback, useEffect, useRef, useState } from 'react';
import { goBack } from '../../lib/backNav.js';
/* Data: GET /api/attendance/logs/calendar/ drives the streak card and the
   monthly grid, and the Absen Sekarang button posts to
   POST /api/attendance/logs/claim/. The calendar follows the server date
   (WIB) and the month arrows only browse other months — attendance can
   never be claimed for another date. */
import { getAttendanceCalendar, claimAttendance } from '../../lib/attendanceApi.js';
import { formatRupiah } from '../../lib/transactionFormat.js';
/* Action notifications (claim success/failure) open the shared /notif screen;
   the calendar load error keeps the inline NotifCard. */
import NotifCard from '../../components/NotifCard.jsx';
import ListState from '../../components/ListState.jsx';
import { useShowNotif } from '../../lib/useShowNotif.js';
import img_1 from '../../assets/images/102_1724.svg';
import img_2 from '../../assets/images/f8f1a5b57a11f48b4845177ed85bf0e0ce6512a1.webp';
import img_3 from '../../assets/images/102_1732.svg';
import img_4 from '../../assets/images/102_1737.svg';
import img_check from '../../assets/images/102_1782.svg';
import img_missed from '../../assets/images/absen-terlewat.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for AbsenHarian — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-absen-harian to isolate this page. */

.page-absen-harian {
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 80% 10%, rgba(255, 201, 60, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 20% 90%, rgba(255, 159, 28, 0.15) 0%, transparent 40%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100%;
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  overflow-x: hidden;
  width: 100%;
}

.page-absen-harian, .page-absen-harian * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-absen-harian .header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 20px 16px 20px;
  }
  .page-absen-harian .back-btn {
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
  }
  .page-absen-harian .header-title {
    color: #1a1410;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }

/* CSS for section section:StreakCard */
.page-absen-harian .streak-card-wrapper {
    padding: 0 20px 20px 20px;
  }
  .page-absen-harian .streak-card {
    background: radial-gradient(circle at 50% 50%, #241c16 0%, #1a1410 55%, #120d09 100%);
    border-radius: 20px;
    padding: 22px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .page-absen-harian .streak-icon {
    width: 56px;
    height: 56px;
    margin-bottom: 10px;
    object-fit: contain;
  }
  .page-absen-harian .streak-title {
    color: #fff9f2;
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 4px 0;
  }
  .page-absen-harian .streak-subtitle {
    color: rgba(255, 249, 242, 0.55);
    font-size: 12px;
    margin: 0;
    line-height: 1.4;
  }

/* CSS for section section:Calendar */
.page-absen-harian .calendar-section {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
  }
  .page-absen-harian .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .page-absen-harian .month-nav-btn {
    width: 28px;
    height: 28px;
    background-color: #f6f1e9;
    border-radius: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
  }
  .page-absen-harian .current-month {
    color: #1a1410;
    font-weight: 600;
    font-size: 14px;
  }
  .page-absen-harian .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 10px;
  }
  .page-absen-harian .weekday {
    text-align: center;
    color: #a79c8f;
    font-size: 12px;
  }
  .page-absen-harian .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 48.86px);
    justify-content: space-between;
    row-gap: 5px;
  }
  .page-absen-harian .day-cell {
    width: 48.86px;
    height: 48.86px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2px;
    box-sizing: border-box;
  }
  .page-absen-harian .day-cell.empty {
    background: transparent;
    border: none;
  }
  .page-absen-harian .day-text {
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
  }
  
  .page-absen-harian .day-completed {
    background-color: rgba(63, 166, 107, 0.1);
    border: 1px solid rgba(63, 166, 107, 0.3);
  }
  .page-absen-harian .day-completed .day-text {
    color: #3fa66b;
  }
  .page-absen-harian .check-icon-wrapper {
    width: 14px;
    height: 14px;
    background-color: #3fa66b;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .page-absen-harian .check-icon-wrapper img {
    width: 10px;
    height: 10px;
  }

  /* Terlewat (tidak absen) — mirror of day-completed in red. */
  .page-absen-harian .day-missed {
    background-color: rgba(226, 76, 76, 0.1);
    border: 1px solid rgba(226, 76, 76, 0.3);
  }
  .page-absen-harian .day-missed .day-text {
    color: #e24c4c;
  }
  .page-absen-harian .miss-icon-wrapper {
    width: 14px;
    height: 14px;
    background-color: #e24c4c;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .page-absen-harian .miss-icon-wrapper img {
    width: 10px;
    height: 10px;
  }

  .page-absen-harian .day-current {
    background-color: rgba(255, 159, 28, 0.1);
    border: 1px solid #e8790c;
  }
  .page-absen-harian .day-current .day-text {
    color: #e8790c;
  }
  .page-absen-harian .dot-current {
    width: 5px;
    height: 5px;
    background-color: #e8790c;
    border-radius: 2.5px;
  }

  .page-absen-harian .day-future {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
  }
  .page-absen-harian .day-future .day-text {
    color: #a79c8f;
  }
  .page-absen-harian .dot-future {
    width: 4px;
    height: 4px;
    background-color: #efe7dc;
    border-radius: 2px;
  }
  .page-absen-harian .notice-margin {
    margin-bottom: 12px;
  }

/* CSS for section section:BottomAction */
.page-absen-harian .bottom-action-wrapper {
    padding: 20px;
    margin-top: auto;
    padding-top: 40px;
  }
  .page-absen-harian .btn-primary {
    width: 100%;
    background-color: #f1b04a;
    color: #1a1410;
    border: none;
    border-radius: 14px;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s;
  }
  .page-absen-harian .btn-primary:active {
    opacity: 0.8;
  }
  .page-absen-harian .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f1b04a;
  }
`;

/* claim response balance_type -> display label (same wording as the
   fund-source labels across the app). */
const BALANCE_LABELS = {
  balance: 'Saldo JelajahEmas',
  balance_deposit: 'Saldo Deposit',
};

/* Day state -> cell modifier; states without a status (future days and
   dates before the user's first attendance) reuse the neutral future look. */
const CELL_CLASS = {
  completed: 'day-completed',
  current: 'day-current',
  missed: 'day-missed',
};

export default function AbsenHarian() {
  const [calendar, setCalendar] = useState(null);
  const [calendarError, setCalendarError] = useState('');
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const showNotif = useShowNotif();
  /* Guards against out-of-order month responses when arrows are clicked fast. */
  const requestSeq = useRef(0);

  /* Tanpa year/month backend memakai bulan berjalan (WIB); parameter hanya
     memilih bulan yang dilihat, tidak mengubah data absen. */
  const loadCalendar = useCallback(async (year, month) => {
    const seq = ++requestSeq.current;
    setLoading(true);
    try {
      const data = await getAttendanceCalendar(year && month ? { year, month } : undefined);
      if (seq !== requestSeq.current) return;
      setCalendar(data);
      setCalendarError('');
    } catch (err) {
      if (seq !== requestSeq.current) return;
      setCalendarError(err?.message || 'Gagal memuat kalender absen.');
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  /* Panah bulan hanya mengganti bulan yang dilihat (bisa lintas tahun). */
  const shiftMonth = (delta) => {
    if (!calendar) return;
    const shifted = (calendar.month - 1) + delta;
    const year = calendar.year + Math.floor(shifted / 12);
    const month = ((shifted % 12) + 12) % 12 + 1;
    loadCalendar(year, month);
  };

  /* Klaim: POST /api/attendance/logs/claim/ — tanggal ditentukan server,
     sekali per hari. Sukses menyegarkan kalender lalu membuka /notif;
     kegagalan (400/401) juga tampil lewat /notif. */
  const handleClaim = async () => {
    if (claiming || !calendar?.can_claim_today) return;
    setClaiming(true);
    try {
      const data = await claimAttendance();
      await loadCalendar(calendar.year, calendar.month);
      const walletLabel = BALANCE_LABELS[String(data?.balance_type || '').toLowerCase()] || 'saldo kamu';
      showNotif({
        variant: 'success',
        title: 'Absen Berhasil',
        description: `Absen hari ini tercatat dengan streak ${Number(data?.streak) || 0} hari. ${formatRupiah(data?.claimed_amount)} ditambahkan ke ${walletLabel} — saldo terbaru kamu ${formatRupiah(data?.balance_after)}.`,
      });
    } catch (err) {
      showNotif({
        variant: 'error',
        title: 'Absen Gagal',
        description: err?.message || 'Absen gagal dicatat. Silakan coba lagi.',
      });
    } finally {
      setClaiming(false);
    }
  };

  /* Sel grid: hijau ✓ sudah absen, merah terlewat, oranye hari ini (belum
     absen), abu-abu belum tersedia (setelah hari ini / sebelum absen
     pertama). */
  const cells = [];
  if (calendar) {
    const attended = new Set(calendar.attended_dates || []);
    const missed = new Set(calendar.missed_dates || []);
    const today = String(calendar.today || '');
    const lead = (new Date(calendar.year, calendar.month - 1, 1).getDay() + 6) % 7;
    const total = new Date(calendar.year, calendar.month, 0).getDate();
    for (let i = 0; i < lead; i += 1) cells.push(null);
    for (let day = 1; day <= total; day += 1) {
      const iso = `${calendar.year}-${String(calendar.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let state = 'plain';
      if (attended.has(iso)) state = 'completed';
      else if (iso === today) state = 'current';
      else if (missed.has(iso)) state = 'missed';
      else if (iso > today) state = 'future';
      cells.push({ day, state });
    }
  }

  const monthLabel = calendar
    ? new Date(calendar.year, calendar.month - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    : '';
  const streak = Number(calendar?.streak) || 0;
  const hasClaimed = Boolean(calendar?.has_claimed_today);
  const canClaim = Boolean(calendar?.can_claim_today);

  return (
    <div className="page-absen-harian">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/home'); }}>
                    <img src={img_1} alt="" />
                  </button>
                  <h1 className="header-title">Absen Harian</h1>
                </header>
              </section>
              <section id="section-streak-card" className="streak-card-wrapper">
                <div className="streak-card">
                  <img src={img_2} alt="Streak Icon" className="streak-icon" />
                  <h2 className="streak-title">{calendar ? `${streak} Hari Berturut-turut` : '—'}</h2>
                  <p className="streak-subtitle">Jangan putus streak kamu, rajin absen setiap hari ya!</p>
                </div>
              </section>
              <section id="section-calendar" className="calendar-section">
                <div className="calendar-header">
                  <button className="month-nav-btn" aria-label="Previous Month" onClick={() => shiftMonth(-1)}>
                    <img src={img_3} alt="" />
                  </button>
                  <span className="current-month">{monthLabel}</span>
                  <button className="month-nav-btn" aria-label="Next Month" onClick={() => shiftMonth(1)}>
                    <img src={img_4} alt="" />
                  </button>
                </div>
                <div className="weekdays">
                  <div className="weekday">Sen</div>
                  <div className="weekday">Sel</div>
                  <div className="weekday">Rab</div>
                  <div className="weekday">Kam</div>
                  <div className="weekday">Jum</div>
                  <div className="weekday">Sab</div>
                  <div className="weekday">Min</div>
                </div>
                {calendarError ? (
                  <div className="notice-margin">
                    <NotifCard variant="error" title="Gagal Memuat Kalender Absen" description={calendarError} />
                  </div>
                ) : null}
                {!calendar ? (
                  loading ? <ListState text="Memuat kalender absen…" /> : null
                ) : (
                  <div className="calendar-grid">
                    {cells.map((cell, index) => cell === null ? (
                      <div key={`empty-${index}`} className="day-cell empty" />
                    ) : (
                      <div key={cell.day} className={`day-cell ${CELL_CLASS[cell.state] || 'day-future'}`}>
                        <span className="day-text">{cell.day}</span>
                        {cell.state === 'completed' ? (
                          <div className="check-icon-wrapper"><img src={img_check} alt="Sudah absen" /></div>
                        ) : null}
                        {cell.state === 'missed' ? (
                          <div className="miss-icon-wrapper"><img src={img_missed} alt="Terlewat" /></div>
                        ) : null}
                        {cell.state === 'current' ? <div className="dot-current" /> : null}
                        {cell.state === 'future' || cell.state === 'plain' ? <div className="dot-future" /> : null}
                      </div>
                    ))}
                  </div>
                )}
              </section>
              <section id="section-bottom-action" className="bottom-action-wrapper">
                <button className="btn-primary" disabled={!canClaim || claiming} onClick={handleClaim}>
                  {claiming ? 'Memproses...' : hasClaimed ? 'Sudah Absen Hari Ini' : 'Absen Sekarang'}
                </button>
              </section>
            </div>

    </div>
  );
}
