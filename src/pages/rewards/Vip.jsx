import { useEffect, useState } from 'react';
import { goBack } from '../../lib/backNav.js';
import { getRankLevels, getRankStatus } from '../../lib/authApi.js';
import { formatRupiah } from '../../lib/transactionFormat.js';
import NotifCard from '../../components/NotifCard.jsx';
import img_1 from '../../assets/images/102_1724.svg';
import img_2 from '../../assets/images/915ddfcd2308a67f93cb52100b8c074abaa5928b.webp';
import img_3 from '../../assets/images/97d547b383343261074c45a251276c6f944091c3.webp';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for Vip — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-vip to isolate this page. */

.page-vip {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 80% -10%, rgba(255, 201, 60, 0.2) 0%, transparent 40%),
    radial-gradient(circle at 20% 110%, rgba(255, 159, 28, 0.1) 0%, transparent 40%);
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

.page-vip, .page-vip * {
  box-sizing: border-box;
}

.page-vip section {
  width: 100%;
  max-width: 100%;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-vip .vip-header {
    display: flex;
    align-items: center;
    padding: 20px;
    gap: 14px;
  }
  
  .page-vip .back-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    text-decoration: none;
  }
  
  .page-vip .back-button img {
    width: 16px;
    height: 16px;
  }
  
  .page-vip .header-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }

/* CSS for section section:Hero */
.page-vip .hero-container {
    padding: 0 20px 20px 20px;
  }
  
  .page-vip .hero-card {
    position: relative;
    background: radial-gradient(circle at 40% 50%, #241c16 0%, #1a1410 55%, #120d09 100%);
    border-radius: 20px;
    padding: 20px;
    min-height: 133px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .page-vip .hero-bg-graphic {
    position: absolute;
    right: -40px;
    top: -45px;
    width: 227px;
    height: 227px;
    object-fit: contain;
    z-index: 0;
    pointer-events: none;
  }
  
  .page-vip .hero-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
  }
  
  .page-vip .member-status {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .page-vip .status-icon {
    width: 49px;
    height: 49px;
  }
  
  .page-vip .status-title {
    font-size: 16px;
    font-weight: 700;
    color: #fff9f2;
    margin: 0;
  }
  
  .page-vip .progress-area {
    margin-top: 26px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .page-vip .progress-text-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  
  .page-vip .progress-label {
    font-size: 12px;
    color: rgba(255, 249, 242, 0.6);
  }
  
  .page-vip .progress-amount {
    font-size: 12px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
  }
  
  .page-vip .progress-bar-container {
    width: 100%;
    height: 7px;
    background-color: rgba(255, 249, 242, 0.12);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .page-vip .progress-bar-fill {
    height: 100%;
    width: 35%; /* Approx based on design */
    background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
    border-radius: 4px;
  }

/* CSS for section section:Tiers */
.page-vip .tiers-container {
    padding: 0 20px 40px 20px;
  }
  
  .page-vip .tiers-header {
    margin-bottom: 14px;
  }
  
  .page-vip .tiers-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin: 0 0 4px 0;
  }
  
  .page-vip .tiers-description {
    font-size: 12px;
    color: #a79c8f;
    margin: 0;
    line-height: 1.4;
  }
  
  .page-vip .tiers-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .page-vip .tier-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 14px;
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 14px;
  }
  
  .page-vip .tier-card.active {
    background-color: rgba(255, 159, 28, 0.06);
    border-color: #e8790c;
  }
  
  .page-vip .tier-card.locked {
    opacity: 0.55;
  }
  
  .page-vip .tier-icon {
    width: 49px;
    height: 49px;
    flex-shrink: 0;
  }
  
  .page-vip .tier-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .page-vip .tier-name-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .page-vip .tier-name {
    font-size: 14px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }
  
  .page-vip .current-level-badge {
    background-color: rgba(255, 159, 28, 0.16);
    color: #e8790c;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 6px;
  }
  
  .page-vip .tier-requirement {
    font-size: 12px;
    color: #a79c8f;
    margin: 0;
  }

/* ---- skeleton loading ---- */

/* Bar shimmer selama rank-levels + rank-status dimuat — konvensi skeleton
   halaman Home/Asset/CetakEmas: bar seukuran teks aslinya supaya layout
   tidak bergeser. Kartu hero gelap memakai tint #fff9f2, kartu tingkatan
   terang memakai tint #1a1410. */
.page-vip .skeleton {
  display: block;
  border-radius: 6px;
  flex-shrink: 0;
  background: linear-gradient(90deg, rgba(26, 20, 16, 0.08) 25%, rgba(26, 20, 16, 0.16) 37%, rgba(26, 20, 16, 0.08) 63%);
  background-size: 400% 100%;
  animation: vip-skeleton-shimmer 1.4s ease infinite;
}

.page-vip .hero-card .skeleton {
  background: linear-gradient(90deg, rgba(255, 249, 242, 0.12) 25%, rgba(255, 249, 242, 0.24) 37%, rgba(255, 249, 242, 0.12) 63%);
  background-size: 400% 100%;
}

@keyframes vip-skeleton-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}

.page-vip .skeleton-icon { width: 49px; height: 49px; border-radius: 12px; }
.page-vip .member-status .skeleton-icon { border-radius: 50%; }
.page-vip .skeleton-hero-title { width: 140px; height: 16px; }
.page-vip .skeleton-hero-label { width: 84px; height: 11px; }
.page-vip .skeleton-hero-amount { width: 128px; height: 11px; }
.page-vip .skeleton-bar-fill { width: 100%; height: 100%; border-radius: 4px; }
.page-vip .skeleton-tier-title { width: 92px; height: 13px; }
.page-vip .skeleton-tier-sub { width: 156px; height: 11px; margin-top: 2px; }
`;

/* Cadangan saat rank-status tidak tersedia: endpoint rank-levels tidak
   mengirim flag basis evaluasi yang aktif, jadi basis ditebak dari dimensi
   pertama (urutan flag backend) yang punya syarat > 0 di salah satu level. */
const BASIS_FIELDS = [
  { field: 'missions_required_total', unit: 'misi selesai' },
  { field: 'downlines_total_required', unit: 'downline' },
  { field: 'downlines_active_required', unit: 'downline aktif' },
  { field: 'deposit_self_total_required', unit: 'deposit pribadi', currency: true },
  { field: 'team_deposit_level_1_total_required', unit: 'deposit tim', currency: true },
];

/* Kunci nilai di respons rank-status untuk tiap dimensi evaluasi
   (progress_basis dari server): progress user saat ini + syarat rank
   berikutnya. */
const STATUS_BASIS = {
  missions: { valueKey: 'completed_missions', requiredKey: 'next_required_missions', unit: 'misi selesai' },
  downlines_total: { valueKey: 'downlines_total', requiredKey: 'next_required_downlines_total', unit: 'downline' },
  downlines_active: { valueKey: 'downlines_active', requiredKey: 'next_required_downlines_active', unit: 'downline aktif' },
  deposit_self_total: { valueKey: 'deposit_self_total', requiredKey: 'next_required_deposit_self_total', unit: 'deposit pribadi', currency: true },
  team_deposit_level_1_total: { valueKey: 'team_deposit_level_1_total', requiredKey: 'next_required_team_deposit_level_1_total', unit: 'deposit tim', currency: true },
};

function pickBasis(levels) {
  return BASIS_FIELDS.find((basis) => levels.some((level) => Number(level[basis.field]) > 0)) || null;
}

function formatValue(value, basis) {
  const amount = Number(value) || 0;
  if (basis && basis.currency) return formatRupiah(amount);
  return amount.toLocaleString('id-ID');
}

/* Satu baris syarat per tingkat — deskripsi dari admin dipakai kalau ada,
   kalau tidak dihitung dari field syarat yang aktif. */
function requirementText(level) {
  if (level.description) return level.description;
  for (const basis of BASIS_FIELDS) {
    const value = Number(level[basis.field]) || 0;
    if (value > 0) return `Syarat: ${formatValue(value, basis)} ${basis.unit}`;
  }
  return '';
}

export default function Vip() {
  /* null = request belum selesai (masih dimuat atau gagal). */
  const [levels, setLevels] = useState(null);
  /* Status rank dari /api/auth/rank-status/ — rank yang sudah terpenuhi +
     syarat rank berikutnya; kalau gagal muat, hero memakai rank-levels. */
  const [status, setStatus] = useState(null);
  /* True sampai KEDUA request selesai — hero dan daftar tingkatan memakai
     skeleton selama menunggu, kartu error kalau gagal (tanpa konten mockup). */
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [levelsError, setLevelsError] = useState('');

  useEffect(() => {
    let active = true;
    let pending = 2;
    let successCount = 0;
    let firstError = '';
    const settle = () => {
      pending -= 1;
      if (!active || pending > 0) return;
      setLoading(false);
      /* Dua-duanya gagal = tidak ada data untuk dirender — satu kartu error
         menggantikan hero + daftar tingkatan. */
      if (successCount === 0) setPageError(firstError || 'Gagal memuat data VIP.');
    };
    getRankLevels()
      .then((list) => {
        successCount += 1;
        if (active) setLevels(list);
      })
      .catch((err) => {
        const message = err?.message || 'Gagal memuat data VIP.';
        if (!firstError) firstError = message;
        if (active) setLevelsError(message);
      })
      .finally(settle);
    getRankStatus()
      .then((payload) => {
        successCount += 1;
        if (active && payload) setStatus(payload);
      })
      .catch((err) => {
        if (!firstError) firstError = err?.message || 'Gagal memuat data VIP.';
      })
      .finally(settle);
    return () => {
      active = false;
    };
  }, []);

  const currentLevel = levels !== null ? levels.find((level) => level.is_current_rank) || null : null;
  const nextLevel = levels !== null
    ? currentLevel
      ? levels.find((level) => level.rank > currentLevel.rank) || null
      : levels[0] || null
    : null;

  /* rank-status adalah sumber utama progress: progress_basis menunjuk dimensi
     evaluasi yang aktif lengkap dengan nilai user + syarat rank berikutnya.
     Kalau endpoint itu tidak tersedia, dimensi ditebak dari syarat di
     rank-levels dan nilainya dibaca dari user_progress_val. */
  const statusBasis = status ? STATUS_BASIS[status.progress_basis] || null : null;
  const basis = statusBasis || (levels !== null ? pickBasis(levels) : null);
  const nextTitle = status ? status.next_title : nextLevel?.title || null;
  const progressValue = statusBasis
    ? Number(status[statusBasis.valueKey]) || 0
    : Number((currentLevel || nextLevel || levels?.[0] || {}).user_progress_val) || 0;
  const targetValue = statusBasis
    ? Number(status[statusBasis.requiredKey]) || 0
    : nextLevel && basis
      ? Number(nextLevel[basis.field]) || 0
      : 0;
  const showProgress = Boolean(basis && nextTitle && targetValue > 0);
  const progressPct = showProgress ? Math.min(100, Math.round((progressValue / targetValue) * 100)) : 0;

  /* Hero memprioritaskan rank-status: current_title = rank yang sudah
     terpenuhi. Semua nilai dirender dari data API — konten mockup desain
     (Gold Member / Menuju Platinum / Rp3.512.870 / 35%) sudah dihapus,
     digantikan skeleton lalu kartu error. */
  const heroTitle = status
    ? status.current_title || status.next_title || ''
    : currentLevel?.title || nextLevel?.title || '';
  const progressLabel = nextTitle ? `Menuju ${nextTitle}` : '';
  const progressAmount = `${formatValue(progressValue, basis)} / ${formatValue(targetValue, basis)}${basis && !basis.currency ? ` ${basis.unit}` : ''}`;
  const progressWidth = `${progressPct}%`;

  return (
    <div className="page-vip">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="vip-header">
                  <a href="#" className="back-button" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/home'); }}>
                    <img src={img_1} alt="" />
                  </a>
                  <h1 className="header-title">VIP JelajahEmas</h1>
                </header>
              </section>
              {loading && (
                <>
                  <section id="section-hero">
                    <div className="hero-container">
                      <div className="hero-card">
                        <img src={img_2} alt="" className="hero-bg-graphic" />
                        <div className="hero-content">
                          <div className="member-status">
                            <span className="skeleton skeleton-icon" aria-hidden="true" />
                            <span className="skeleton skeleton-hero-title" aria-hidden="true" />
                          </div>
                          <div className="progress-area">
                            <div className="progress-text-row">
                              <span className="skeleton skeleton-hero-label" aria-hidden="true" />
                              <span className="skeleton skeleton-hero-amount" aria-hidden="true" />
                            </div>
                            <div className="progress-bar-container">
                              <span className="skeleton skeleton-bar-fill" aria-hidden="true" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section id="section-tiers">
                    <div className="tiers-container">
                      <div className="tiers-header">
                        <h2 className="tiers-title">Semua Tingkatan VIP</h2>
                        <p className="tiers-description">Penuhi syarat di tiap tingkatan untuk naik ke tingkat berikutnya.</p>
                      </div>
                      <div className="tiers-list">
                        {/* Kerangka kartu selama tingkatan dimuat dari API. */}
                        {[0, 1, 2, 3].map((index) => (
                          <div className="tier-card" key={index}>
                            <span className="skeleton skeleton-icon" aria-hidden="true" />
                            <div className="tier-info">
                              <span className="skeleton skeleton-tier-title" aria-hidden="true" />
                              <span className="skeleton skeleton-tier-sub" aria-hidden="true" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              )}
              {!loading && pageError && (
                <section id="section-error">
                  <div className="tiers-container">
                    <NotifCard variant="error" title="Gagal Memuat Data VIP" description={pageError} />
                  </div>
                </section>
              )}
              {!loading && !pageError && (
                <>
                  <section id="section-hero">
                    <div className="hero-container">
                      <div className="hero-card">
                        <img src={img_2} alt="" className="hero-bg-graphic" />
                        <div className="hero-content">
                          <div className="member-status">
                            <img src={img_3} alt="Gold Tier Icon" className="status-icon" />
                            <h2 className="status-title">{heroTitle}</h2>
                          </div>
                          {showProgress && (
                            <div className="progress-area">
                              <div className="progress-text-row">
                                <span className="progress-label">{progressLabel}</span>
                                <span className="progress-amount">{progressAmount}</span>
                              </div>
                              <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: progressWidth }} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                  <section id="section-tiers">
                    <div className="tiers-container">
                      <div className="tiers-header">
                        <h2 className="tiers-title">Semua Tingkatan VIP</h2>
                        <p className="tiers-description">Penuhi syarat di tiap tingkatan untuk naik ke tingkat berikutnya.</p>
                      </div>
                      <div className="tiers-list">
                        {/* Kalau hanya rank-levels yang gagal, hero tetap terisi
                            dari rank-status dan daftar tingkatan menampilkan
                            kartu error. */}
                        {levelsError && (
                          <NotifCard variant="error" title="Gagal Memuat Tingkatan VIP" description={levelsError} />
                        )}
                        {levels !== null && levels.length === 0 && (
                          <p className="tier-requirement">Belum ada data tingkatan.</p>
                        )}
                        {levels !== null && levels.map((level) => (
                          <div
                            className={`tier-card${level.is_current_rank ? ' active' : ''}${level.is_unlocked ? '' : ' locked'}`}
                            key={level.rank}
                          >
                            <img src={img_3} alt={`${level.title} Icon`} className="tier-icon" />
                            <div className="tier-info">
                              <div className="tier-name-wrapper">
                                <h3 className="tier-name">{level.title}</h3>
                                {level.is_current_rank && <span className="current-level-badge">Level Kamu</span>}
                              </div>
                              {requirementText(level) && (
                                <p className="tier-requirement">{requirementText(level)}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>

    </div>
  );
}
