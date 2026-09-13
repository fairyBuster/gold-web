import { useEffect, useMemo, useState } from 'react';

import img_1 from '../../assets/images/67_135.svg';
import img_2 from '../../assets/images/53_353.svg';
import img_3 from '../../assets/images/67_142.svg';
import img_4 from '../../assets/images/402d907c628503f9f6fc98788c4a2ed737081803.png';
import img_5 from '../../assets/images/53_389.svg';
import img_8 from '../../assets/images/53_434.svg';
import NotifCard from '../../components/NotifCard.jsx';
import { getDownlineList } from '../../lib/affiliateApi.js';
import { formatRupiah } from '../../lib/transactionFormat.js';

/* Data: GET /api/auth/downline-list/ (the current user's downline) via
   src/lib/affiliateApi.js. The endpoint returns lightweight members without a
   level field, so levels 1-3 (the depth this page shows) are fetched with one
   call each and merged client-side — the same data feeds the per-level stat
   cards. is_active follows the admin-configured active-member definition.
   The response carries no avatar or ownership data, so cards keep the static
   avatar and show "Total investasi:" from total_investment_amount; the status
   chips, the search box, and the level stat cards filter the loaded list
   client-side (tap the active level card again to show all levels). The dark
   card background follows the selected level (default: Level 1 dark).

   Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for LihatDetailTim — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-lihat-detail-tim to isolate this page. */

.page-lihat-detail-tim {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at top right, rgba(255, 201, 60, 0.2) 0%, transparent 50%),
    radial-gradient(circle at top left, rgba(255, 159, 28, 0.1) 0%, transparent 50%);
  min-height: 100vh;
  color: #1a1410;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.05);
  width: 100%;
}

.page-lihat-detail-tim, .page-lihat-detail-tim * {
  box-sizing: inherit;
}

.page-lihat-detail-tim p,.page-lihat-detail-tim  h1,.page-lihat-detail-tim  h2,.page-lihat-detail-tim  h3,.page-lihat-detail-tim  h4,.page-lihat-detail-tim  h5,.page-lihat-detail-tim  h6 {
  margin: 0;
}

.page-lihat-detail-tim button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
}

.page-lihat-detail-tim input {
  font-family: inherit;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-lihat-detail-tim .header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 20px 4px;
}
.page-lihat-detail-tim .back-btn {
  width: 36px;
  height: 36px;
  background-color: #f6f1e9;
  border-radius: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s;
}
.page-lihat-detail-tim .back-btn:active {
  opacity: 0.7;
}
.page-lihat-detail-tim .page-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1410;
}

/* CSS for section section:Intro */
.page-lihat-detail-tim .intro {
  padding: 14px 20px 16px;
}
.page-lihat-detail-tim .intro p {
  font-size: 14px;
  line-height: 1.4;
  color: #a79c8f;
}

/* CSS for section section:Stats */
.page-lihat-detail-tim .stats-container {
  display: flex;
  gap: 8px;
  padding: 0 20px 16px;
}
.page-lihat-detail-tim .stat-card {
  flex: 1;
  border-radius: 12px;
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2px;
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
}
.page-lihat-detail-tim .stat-card.selected {
  box-shadow: 0 0 0 2px #ff9f1c;
}
.page-lihat-detail-tim .stat-card:active {
  opacity: 0.85;
}
.page-lihat-detail-tim .stat-card.dark {
  background-color: #1a1410;
}
.page-lihat-detail-tim .stat-card.light {
  background-color: #f6f1e9;
}
.page-lihat-detail-tim .stat-card.dark .stat-value {
  color: #fff9f2;
}
.page-lihat-detail-tim .stat-card.dark .stat-label {
  color: rgba(255, 249, 242, 0.6);
}
.page-lihat-detail-tim .stat-card.light .stat-value {
  color: #514840;
}
.page-lihat-detail-tim .stat-card.light .stat-label {
  color: #a79c8f;
}
.page-lihat-detail-tim .stat-value {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
}
.page-lihat-detail-tim .stat-label {
  font-size: 12px;
  margin-top: 2px;
}

/* CSS for section section:InfoBanner */
.page-lihat-detail-tim .info-wrapper {
  padding: 0 20px 12px;
}
.page-lihat-detail-tim .info-banner {
  background-color: rgba(255, 159, 28, 0.1);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.page-lihat-detail-tim .info-icon {
  margin-top: 2px;
  flex-shrink: 0;
}
.page-lihat-detail-tim .info-text {
  font-size: 13px;
  line-height: 1.4;
  color: #514840;
}
.page-lihat-detail-tim .info-text strong {
  color: #1a1410;
  font-weight: 600;
}

/* CSS for section section:SearchFilters */
.page-lihat-detail-tim .search-wrapper {
  padding: 0 20px 14px;
}
.page-lihat-detail-tim .search-bar {
  background-color: #f6f1e9;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.page-lihat-detail-tim .search-icon {
  flex-shrink: 0;
}
.page-lihat-detail-tim .search-input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 14px;
  color: #1a1410;
  outline: none;
}
.page-lihat-detail-tim .search-input::placeholder {
  color: #a79c8f;
}
.page-lihat-detail-tim .filters-wrapper {
  padding: 0 20px 14px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}
.page-lihat-detail-tim .filters-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}
.page-lihat-detail-tim .filter-btn {
  background-color: #f6f1e9;
  color: #514840;
  border-radius: 20px;
  padding: 7px 13px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}
.page-lihat-detail-tim .filter-btn.active {
  background-color: rgba(255, 159, 28, 0.14);
  color: #e8790c;
}

/* CSS for section section:MemberList */
.page-lihat-detail-tim .members-list {
  padding: 0 20px 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.page-lihat-detail-tim .member-card {
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  gap: 12px;
}
.page-lihat-detail-tim .member-avatar {
  width: 31px;
  height: 31px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.page-lihat-detail-tim .member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.page-lihat-detail-tim .member-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.page-lihat-detail-tim .member-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1410;
}
.page-lihat-detail-tim .status-badge {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 9px;
  border-radius: 8px;
}
.page-lihat-detail-tim .status-badge.active {
  background-color: rgba(63, 166, 107, 0.14);
  color: #3fa66b;
}
.page-lihat-detail-tim .status-badge.pending {
  background-color: rgba(255, 159, 28, 0.14);
  color: #e8790c;
}
.page-lihat-detail-tim .member-details {
  font-size: 12px;
  line-height: 1.4;
  color: #a79c8f;
}
.page-lihat-detail-tim .member-ownership {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
}
.page-lihat-detail-tim .ownership-label {
  font-size: 12px;
  color: #514840;
}
.page-lihat-detail-tim .ownership-value {
  font-size: 12px;
  font-weight: 600;
  color: #1a1410;
}
.page-lihat-detail-tim .status-text {
  color: #a79c8f;
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
  padding: 20px 0;
}
.page-lihat-detail-tim .error-text {
  color: #e24c4c;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  padding: 20px 0;
}

/* CSS for section section:Footer */
.page-lihat-detail-tim .footer-wrapper {
  padding: 14px 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.page-lihat-detail-tim .load-more-btn {
  border: 1px solid #efe7dc;
  border-radius: 20px;
  padding: 9px 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #514840;
  background-color: transparent;
  transition: background-color 0.2s;
}
.page-lihat-detail-tim .load-more-btn:active {
  background-color: rgba(0,0,0,0.02);
}
.page-lihat-detail-tim .footer-text {
  font-size: 12px;
  color: #a79c8f;
}
`;

/* "Muat Lebih Banyak" reveals the next batch of this many loaded members. */
const HISTORY_PAGE_SIZE = 8;

/* The page shows the network up to 3 levels deep; members carry no level
   field, so each level is fetched with its own call and tagged client-side. */
const DOWNLINE_LEVELS = [1, 2, 3];

/* Status chips → client-side is_active filter. */
const STATUS_FILTERS = [
  { value: 'all', label: 'Semua' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Tidak aktif' },
];

/* "2026-07-16 16:24:59" → Date (the space-separated form does not parse
   reliably across browsers). */
function toDate(value) {
  return new Date(String(value || '').replace(' ', 'T'));
}

/* "16 Jul 2026" from registration_date. */
function formatJoinDate(value) {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* "+62 895-9595-9595" from the E.164/local phone stored by the backend. */
function formatPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '—';
  const national = digits.startsWith('62') ? digits.slice(2) : digits.replace(/^0/, '');
  const parts = [national.slice(0, 3), national.slice(3, 7), national.slice(7)];
  return `+62 ${parts.filter(Boolean).join('-')}`;
}

function memberName(member) {
  return String(member.full_name || '').trim() || member.username || '—';
}

/* The endpoint returns no ownership detail; total invested (IDR) is the
   closest per-member figure the cards can show. */
function memberInvestmentAmount(member) {
  const amount = Number(member.total_investment_amount) || 0;
  return amount > 0 ? formatRupiah(amount) : 'Belum ada';
}

/* Fetches levels 1-3 concurrently and merges them into one list, tagging each
   member with the level they belong to. */
function useDownlineMembers() {
  const [members, setMembers] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const payloads = await Promise.all(DOWNLINE_LEVELS.map((level) => getDownlineList({ level })));
        if (cancelled) return;
        const merged = [];
        const seen = new Set();
        payloads.forEach((payload, index) => {
          const level = DOWNLINE_LEVELS[index];
          const list = Array.isArray(payload?.members) ? payload.members : [];
          for (const member of list) {
            if (seen.has(member.id)) continue;
            seen.add(member.id);
            merged.push({ ...member, level });
          }
        });
        merged.sort((a, b) => a.level - b.level || toDate(b.registration_date) - toDate(a.registration_date));
        setMembers(merged);
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Gagal memuat data tim.');
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { members, error };
}

export default function LihatDetailTim() {
  const { members, error } = useDownlineMembers();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState(null);
  const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE_SIZE);

  const loading = members === null && !error;
  const allMembers = members || [];

  /* Per-level totals for the stat cards. */
  const stats = DOWNLINE_LEVELS.map((level) => {
    const levelMembers = allMembers.filter((member) => member.level === level);
    const activeCount = levelMembers.filter((member) => member.is_active).length;
    return { level, activeCount, pendingCount: levelMembers.length - activeCount };
  });

  /* Level cards + status chips + search filter the loaded list client-side. */
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allMembers.filter((member) => {
      if (levelFilter && member.level !== levelFilter) return false;
      if (statusFilter === 'active' && !member.is_active) return false;
      if (statusFilter === 'inactive' && member.is_active) return false;
      if (!query) return true;
      return [member.full_name, member.username, member.phone]
        .some((value) => String(value || '').toLowerCase().includes(query));
    });
  }, [allMembers, levelFilter, search, statusFilter]);

  /* New filter/search → the revealed window starts over. */
  useEffect(() => {
    setVisibleCount(HISTORY_PAGE_SIZE);
  }, [search, statusFilter, levelFilter]);

  const shownMembers = filtered.slice(0, visibleCount);

  return (
    <div className="page-lihat-detail-tim">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <button className="back-btn" aria-label="Kembali" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="" />
                  </button>
                  <h1 className="page-title">Detail Tim</h1>
                </header>
              </section>
              <section id="section-intro">
                <div className="intro">
                  <p>Ini adalah jaringan komunitas kamu berdasarkan siapa yang mengundang siapa, hingga 3 tingkat kedalaman.</p>
                </div>
              </section>
              <section id="section-stats">
                <div className="stats-container">
                  {stats.map((stat, index) => {
                    const selected = levelFilter === stat.level;
                    const dark = selected || (!levelFilter && index === 0);
                    return (
                      <button
                        type="button"
                        key={stat.level}
                        className={`stat-card ${dark ? 'dark' : 'light'}${selected ? ' selected' : ''}`}
                        aria-pressed={selected}
                        onClick={() => setLevelFilter(selected ? null : stat.level)}
                      >
                        <div className="stat-value">
                          {loading || error
                            ? '—'
                            : <>{stat.activeCount} aktif<br />{stat.pendingCount} belum</>}
                        </div>
                        <div className="stat-label">Level {stat.level}</div>
                      </button>
                    );
                  })}
                </div>
              </section>
              <section id="section-info">
                <div className="info-wrapper">
                  <div className="info-banner">
                    <img src={img_2} alt="Info" className="info-icon" />
                    <p className="info-text"><strong>Level 1</strong> — teman yang kamu ajak langsung menggunakan kode referral kamu.</p>
                  </div>
                </div>
              </section>
              <section id="section-search-filters">
                <div className="search-wrapper">
                  <div className="search-bar">
                    <img src={img_3} alt="Search" className="search-icon" />
                    <input
                      type="text"
                      placeholder="Cari nama anggota"
                      className="search-input"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="filters-wrapper">
                  {STATUS_FILTERS.map((filter) => (
                    <button
                      key={filter.value}
                      className={`filter-btn${statusFilter === filter.value ? ' active' : ''}`}
                      onClick={() => setStatusFilter(filter.value)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </section>
              <section id="section-members">
                <div className="members-list">
                  {loading ? <p className="status-text">Memuat data tim...</p> : null}
                  {error ? <NotifCard variant="error" title="Gagal Memuat Data Tim" description={error} /> : null}
                  {!loading && !error && shownMembers.length === 0 ? (
                    <p className="status-text">Tidak ada anggota yang cocok.</p>
                  ) : null}
                  {shownMembers.map((member) => (
                    <article className="member-card" key={member.id}>
                      <img src={img_4} alt="Avatar" className="member-avatar" />
                      <div className="member-info">
                        <div className="member-header">
                          <h3 className="member-name">{memberName(member)}</h3>
                          <span className={`status-badge ${member.is_active ? 'active' : 'pending'}`}>
                            {member.is_active ? 'Aktif' : 'Tidak aktif'}
                          </span>
                        </div>
                        <p className="member-details">
                          {formatPhone(member.phone)}<br />Bergabung {formatJoinDate(member.registration_date)}
                        </p>
                        <div className="member-ownership">
                          <img src={img_5} alt="" />
                          <span className="ownership-label">Total investasi:</span>
                          <span className="ownership-value">{memberInvestmentAmount(member)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
              <section id="section-footer">
                {!loading && !error ? (
                  <div className="footer-wrapper">
                    {shownMembers.length < filtered.length ? (
                      <button
                        className="load-more-btn"
                        onClick={() => setVisibleCount((count) => count + HISTORY_PAGE_SIZE)}
                      >
                        Muat Lebih Banyak
                        <img src={img_8} alt="" />
                      </button>
                    ) : null}
                    <p className="footer-text">Menampilkan {shownMembers.length} dari {filtered.length} anggota</p>
                  </div>
                ) : null}
              </section>
            </div>

    </div>
  );
}
