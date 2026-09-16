import { useEffect, useState } from 'react';
import { getRankLevels, getRankStatus } from '../../lib/authApi.js';
import { formatRupiah } from '../../lib/transactionFormat.js';
import img_1 from '../../assets/images/102_1724.svg';
import img_2 from '../../assets/images/915ddfcd2308a67f93cb52100b8c074abaa5928b.png';
import img_3 from '../../assets/images/97d547b383343261074c45a251276c6f944091c3.png';

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
  /* null = API belum termuat/gagal (konten bawaan desain tetap tampil). */
  const [levels, setLevels] = useState(null);
  /* Status rank dari /api/auth/rank-status/ — rank yang sudah terpenuhi +
     syarat rank berikutnya; kalau gagal muat, hero memakai rank-levels. */
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let active = true;
    getRankLevels()
      .then((list) => {
        if (active) setLevels(list);
      })
      .catch(() => {
        /* diamkan — konten bawaan sudah tampil */
      });
    getRankStatus()
      .then((payload) => {
        if (active && payload) setStatus(payload);
      })
      .catch(() => {
        /* diamkan — hero memakai fallback rank-levels */
      });
    return () => {
      active = false;
    };
  }, []);

  const usingData = levels !== null || status !== null;
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

  /* Fallback (API belum termuat/gagal) memakai konten bawaan desain. Hero
     memprioritaskan rank-status: current_title = rank yang sudah terpenuhi. */
  const heroTitle = status
    ? status.current_title || status.next_title || ''
    : usingData
      ? currentLevel?.title || nextLevel?.title || ''
      : 'Gold Member';
  const progressVisible = usingData ? showProgress : true;
  const progressLabel = usingData ? (nextTitle ? `Menuju ${nextTitle}` : '') : 'Menuju Platinum';
  const progressAmount = usingData
    ? `${formatValue(progressValue, basis)} / ${formatValue(targetValue, basis)}${basis && !basis.currency ? ` ${basis.unit}` : ''}`
    : 'Rp3.512.870 / Rp10.000.000';
  const progressWidth = usingData ? `${progressPct}%` : '35%';

  return (
    <div className="page-vip">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="vip-header">
                  <a href="#" className="back-button" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="" />
                  </a>
                  <h1 className="header-title">VIP JelajahEmas</h1>
                </header>
              </section>
              <section id="section-hero">
                <div className="hero-container">
                  <div className="hero-card">
                    <img src={img_2} alt="" className="hero-bg-graphic" />
                    <div className="hero-content">
                      <div className="member-status">
                        <img src={img_3} alt="Gold Tier Icon" className="status-icon" />
                        <h2 className="status-title">{heroTitle}</h2>
                      </div>
                      {progressVisible && (
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
                    {/* Konten bawaan desain tampil selama API belum termuat/gagal;
                        begitu data datang, tingkatan dirender apa adanya dari API. */}
                    {levels === null && (
                      <>
                        {/* Reguler Tier */}
                        <div className="tier-card">
                          <img src={img_3} alt="Reguler Icon" className="tier-icon" />
                          <div className="tier-info">
                            <h3 className="tier-name">Reguler</h3>
                            <p className="tier-requirement">Total aset di bawah Rp1.000.000</p>
                          </div>
                        </div>
                        {/* Silver Tier */}
                        <div className="tier-card">
                          <img src={img_3} alt="Silver Icon" className="tier-icon" />
                          <div className="tier-info">
                            <h3 className="tier-name">Silver</h3>
                            <p className="tier-requirement">Total aset Rp1.000.000 – Rp3.000.000</p>
                          </div>
                        </div>
                        {/* Gold Tier (Active) */}
                        <div className="tier-card active">
                          <img src={img_3} alt="Gold Icon" className="tier-icon" />
                          <div className="tier-info">
                            <div className="tier-name-wrapper">
                              <h3 className="tier-name">Gold</h3>
                              <span className="current-level-badge">Level Kamu</span>
                            </div>
                            <p className="tier-requirement">Total aset Rp3.000.000 – Rp10.000.000</p>
                          </div>
                        </div>
                        {/* Platinum Tier */}
                        <div className="tier-card">
                          <img src={img_3} alt="Platinum Icon" className="tier-icon" />
                          <div className="tier-info">
                            <h3 className="tier-name">Platinum</h3>
                            <p className="tier-requirement">Total aset di atas Rp10.000.000</p>
                          </div>
                        </div>
                      </>
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
            </div>

    </div>
  );
}
