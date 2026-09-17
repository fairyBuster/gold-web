import { useEffect, useState } from 'react';
import { goBack } from '../../lib/backNav.js';
/* Data: GET /api/missions/ drives the hero goal, stats and reward cards, and
   the Klaim button posts to POST /api/missions/claim/. The referral code comes
   from account-info and the Diundang/Bergabung counts from downline-stats —
   same sources as TimAfiliasi. */
import { getMissions, claimMission } from '../../lib/missionsApi.js';
import { getAccountInfo } from '../../lib/authApi.js';
import { getDownlineStats } from '../../lib/affiliateApi.js';
import { formatRupiah } from '../../lib/transactionFormat.js';
/* Action notifications (claim/copy/share) open the shared /notif screen;
   the missions load error keeps the inline NotifCard. */
import NotifCard from '../../components/NotifCard.jsx';
import { useShowNotif } from '../../lib/useShowNotif.js';
import img_1 from '../../assets/images/103_2125.svg';
import img_2 from '../../assets/images/17e7f2f606a56322420437f792ab8f3eef96e321.webp';
import img_3 from '../../assets/images/103_2159.svg';
import img_4 from '../../assets/images/103_2164.svg';
import img_5 from '../../assets/images/103_2198.svg';
import img_6 from '../../assets/images/103_2206.svg';
import img_7 from '../../assets/images/103_2198.svg';
import img_8 from '../../assets/images/103_2224.svg';
import img_11 from '../../assets/images/103_2266.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for Misi — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-misi to isolate this page. */

.page-misi {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 76% 11%, rgba(255, 201, 60, 0.28) 0%, rgba(255, 201, 60, 0) 70%),
    radial-gradient(circle at 111% 25%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 70%),
    radial-gradient(circle at 90% -40%, rgba(255, 159, 28, 0.38) 0%, rgba(255, 159, 28, 0) 70%);
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #1a1410;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  width: 100%;
}

.page-misi section {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.page-misi h1,.page-misi  h2,.page-misi  h3,.page-misi  h4,.page-misi  p {
  margin: 0;
}

.page-misi button {
  font-family: 'Inter', sans-serif;
  cursor: pointer;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-misi #section-header .header {
    display: flex;
    align-items: center;
    padding: 20px;
    gap: 14px;
    height: 72px;
    box-sizing: border-box;
  }
  .page-misi #section-header .back-btn {
    background-color: #f6f1e9;
    border: none;
    border-radius: 11px;
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
  .page-misi #section-header .header-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
  }

/* CSS for section section:Hero */
.page-misi #section-hero .hero-container {
    padding: 0 20px;
  }
  .page-misi #section-hero .hero-card {
    background: radial-gradient(circle at 41% 43%, #241c16 0%, #1a1410 55%, #120d09 100%);
    border-radius: 20px;
    padding: 22px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .page-misi #section-hero .hero-icon {
    width: 56px;
    height: 56px;
    margin-bottom: 8px;
  }
  .page-misi #section-hero .hero-title {
    color: #fff9f2;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .page-misi #section-hero .hero-desc {
    color: rgba(255, 249, 242, 0.6);
    font-size: 12px;
    text-align: center;
    line-height: 1.4;
    margin-bottom: 14px;
    max-width: 280px;
  }
  .page-misi #section-hero .progress-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .page-misi #section-hero .progress-track {
    background-color: rgba(255, 249, 242, 0.12);
    border-radius: 4px;
    height: 8px;
    width: 100%;
    margin-bottom: 8px;
    overflow: hidden;
  }
  .page-misi #section-hero .progress-fill {
    background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
    border-radius: 4px;
    height: 100%;
    width: 20%;
  }
  .page-misi #section-hero .progress-text {
    color: rgba(255, 249, 242, 0.55);
    font-size: 11px;
  }

/* CSS for section section:Stats */
.page-misi #section-stats .stats-container {
    padding: 20px 20px 0;
    display: flex;
    gap: 10px;
    justify-content: space-between;
  }
  .page-misi #section-stats .stat-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 14px;
    padding: 12px 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    gap: 2px;
  }
  .page-misi #section-stats .stat-value {
    color: #1a1410;
    font-size: 16px;
    font-weight: 700;
  }
  .page-misi #section-stats .stat-label {
    color: #a79c8f;
    font-size: 11px;
  }

/* CSS for section section:Referral */
.page-misi #section-referral .referral-container {
    padding: 20px 20px 0;
  }
  .page-misi #section-referral .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #1a1410;
    margin-bottom: 12px;
  }
  .page-misi #section-referral .referral-card {
    background-color: #ffffff;
    border: 1px solid rgba(26, 20, 16, 0.22);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .page-misi #section-referral .referral-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .page-misi #section-referral .referral-label {
    color: #a79c8f;
    font-size: 12px;
  }
  .page-misi #section-referral .referral-code {
    color: #1a1410;
    font-size: 18px;
    font-weight: 700;
  }
  .page-misi #section-referral .referral-actions {
    display: flex;
    gap: 10px;
  }
  .page-misi #section-referral .btn-salin {
    background-color: #f6f1e9;
    color: #514840;
    border: none;
    border-radius: 11px;
    padding: 10px 0;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
  }
  .page-misi #section-referral .btn-bagikan {
    background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
    color: #1a1410;
    border: none;
    border-radius: 11px;
    padding: 10px 0;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
  }

/* CSS for section section:HowItWorks */
.page-misi #section-how-it-works .how-it-works-container {
    padding: 20px 20px 0;
  }
  .page-misi #section-how-it-works .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #1a1410;
    margin-bottom: 12px;
  }
  .page-misi #section-how-it-works .steps-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .page-misi #section-how-it-works .step-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .page-misi #section-how-it-works .step-number {
    background-color: #f6f1e9;
    color: #e8790c;
    width: 24px;
    height: 24px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .page-misi #section-how-it-works .step-text {
    color: #514840;
    font-size: 12px;
    line-height: 1.5;
    padding-top: 2px;
  }

/* CSS for section section:Rewards */
.page-misi #section-rewards .rewards-container {
    padding: 20px 20px 0;
  }
  .page-misi #section-rewards .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #1a1410;
    margin-bottom: 12px;
  }
  .page-misi #section-rewards .rewards-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .page-misi #section-rewards .reward-card {
    border-radius: 14px;
    padding: 13px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .page-misi #section-rewards .reward-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-misi #section-rewards .reward-icon {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }
  .page-misi #section-rewards .reward-icon.gray { background-color: #a79c8f; }
  .page-misi #section-rewards .reward-icon.green { background-color: #3fa66b; }
  .page-misi #section-rewards .reward-icon.light { background-color: #f6f1e9; }
  
  .page-misi #section-rewards .reward-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .page-misi #section-rewards .reward-title {
    font-size: 13px;
    font-weight: 600;
  }
  .page-misi #section-rewards .reward-status {
    font-size: 11px;
  }
  
  .page-misi #section-rewards .reward-points {
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .page-misi #section-rewards .reward-points.gray { color: #a79c8f; }
  .page-misi #section-rewards .reward-points.orange { color: #e8790c; }
  
  .page-misi #section-rewards .reward-action {
    padding-left: 42px; /* Align with text */
  }
  .page-misi #section-rewards .reward-action p {
    color: #e8790c;
    font-size: 11px;
    font-weight: 600;
  }
  .page-misi #section-rewards .status-text {
    font-size: 12px;
    color: #a79c8f;
    padding: 2px 0;
  }
  .page-misi #section-rewards .notice-margin {
    margin-bottom: 12px;
  }

  /* Specific Card Styles */
  .page-misi #section-rewards .reward-card.claimed {
    background-color: #f6f1e9;
    border: 1px solid #efe7dc;
    opacity: 0.6;
  }
  .page-misi #section-rewards .reward-card.claimed .reward-title { color: #514840; }
  .page-misi #section-rewards .reward-card.claimed .reward-status { color: #a79c8f; }

  .page-misi #section-rewards .reward-card.ready {
    background-color: rgba(63, 166, 107, 0.06);
    border: 1px solid #3fa66b;
  }
  .page-misi #section-rewards .reward-card.ready .reward-title { color: #1a1410; }
  .page-misi #section-rewards .reward-card.ready .reward-status { color: #a79c8f; }
  
  .page-misi #section-rewards .btn-claim {
    background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
    border: none;
    border-radius: 10px;
    color: #1a1410;
    font-weight: 700;
    font-size: 12px;
    padding: 7px 16px;
  }
  .page-misi #section-rewards .btn-claim:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .page-misi #section-rewards .reward-card.locked {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
  }
  .page-misi #section-rewards .reward-card.locked .reward-title { color: #1a1410; }
  .page-misi #section-rewards .reward-card.locked .reward-status { color: #514840; }

/* CSS for section section:FooterNote */
.page-misi #section-footer-note .footer-note-container {
    padding: 20px 20px 0;
  }
  .page-misi #section-footer-note .note-card {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .page-misi #section-footer-note .note-icon {
    padding-top: 2px;
    flex-shrink: 0;
  }
  .page-misi #section-footer-note .note-text {
    color: #514840;
    font-size: 11px;
    line-height: 1.5;
  }

/* CSS for section section:BottomButton */
.page-misi #section-bottom-button .bottom-button-container {
    padding: 20px;
  }
  .page-misi #section-bottom-button .btn-large {
    width: 100%;
    background-color: #f1b04a;
    color: #1a1410;
    border: none;
    border-radius: 14px;
    height: 50px;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

/* wallet_type from the claim response -> display label (same wording as the
   fund-source labels across the app). */
const WALLET_LABELS = {
  BALANCE: 'Saldo JelajahEmas',
  BALANCE_DEPOSIT: 'Saldo Deposit',
};

export default function Misi() {
  const [missions, setMissions] = useState(null);
  const [missionsError, setMissionsError] = useState('');
  const [account, setAccount] = useState(null);
  const [downlineStats, setDownlineStats] = useState(null);
  const [claimingId, setClaimingId] = useState(null);
  const [copied, setCopied] = useState(false);
  const showNotif = useShowNotif();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const payload = await getMissions();
        if (!cancelled) {
          setMissions(Array.isArray(payload?.results) ? payload.results : []);
          setMissionsError('');
        }
      } catch (err) {
        if (!cancelled) setMissionsError(err?.message || 'Gagal memuat misi.');
      }
    }
    load();
    getAccountInfo().then((data) => { if (!cancelled) setAccount(data); }).catch(() => {});
    getDownlineStats().then((data) => { if (!cancelled) setDownlineStats(data); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  /* Urutkan misi dari requirement terkecil supaya daftarnya mengikuti alur
     "Ajak 1 Teman" -> "Ajak N Teman". */
  const sortedMissions = (missions || [])
    .slice()
    .sort((a, b) => (Number(a.requirement) || 0) - (Number(b.requirement) || 0) || a.id - b.id);

  /* Misi berikutnya untuk progress bar hero: requirement terkecil yang belum
     diklaim; kalau semua sudah diklaim, pakai misi terakhir. Capaian hero =
     jumlah anggota aktif saat ini (kartu "Bergabung"), targetnya = requirement
     misi berikutnya. */
  const nextMission = sortedMissions.find((m) => m.status !== 'claimed') || sortedMissions[sortedMissions.length - 1] || null;
  const level1 = (downlineStats?.levels || []).find((item) => item.level === 1) || null;
  const activeMembers = Number(level1?.members_active) || 0;
  const heroPercent = nextMission
    ? Math.min(100, Math.max(0, (activeMembers / (Number(nextMission.requirement) || 1)) * 100))
    : 0;

  /* Total bonus = semua reward misi yang sudah diklaim (claimed_count x reward). */
  const claimedBonus = sortedMissions.reduce(
    (sum, m) => sum + (Number(m.claimed_count) || 0) * (Number(m.reward) || 0),
    0,
  );

  const referralCode = String(account?.referral_code || '').trim();
  /* Salin/Bagikan memakai link pendaftaran dengan kode tertanam (?ref=KODE),
     format yang dibaca halaman register untuk mengisi kode promo otomatis.
     Link memakai bentuk hash (/#/index/...) supaya bisa dibuka di host statis
     mana pun tanpa aturan fallback server. */
  const referralLink = referralCode
    ? `${window.location.origin}/#/index/auth/register-01?ref=${encodeURIComponent(referralCode)}`
    : '';

  /* Klaim: POST /api/missions/claim/ — sukses menambah saldo lalu menyegarkan
     daftar misi; kegagalan (400/404) tampil lewat halaman /notif. */
  const handleClaim = async (mission) => {
    if (claimingId) return;
    setClaimingId(mission.id);
    try {
      const data = await claimMission({ missionId: mission.id });
      const walletLabel = WALLET_LABELS[String(data?.wallet_type || '').toUpperCase()] || 'saldo kamu';
      showNotif({
        variant: 'success',
        title: 'Misi Berhasil Diklaim',
        description: `${mission.title} berhasil diklaim. ${formatRupiah(data?.reward_amount)} ditambahkan ke ${walletLabel} — saldo terbaru kamu ${formatRupiah(data?.new_balance)}.`,
      });
      const payload = await getMissions();
      setMissions(Array.isArray(payload?.results) ? payload.results : []);
      setMissionsError('');
    } catch (err) {
      showNotif({
        variant: 'error',
        title: 'Klaim Misi Gagal',
        description: err?.message || 'Misi gagal diklaim. Silakan coba lagi.',
      });
    } finally {
      setClaimingId(null);
    }
  };

  /* "Salin" menyalin link referral ke clipboard; label tombol berubah
     sesaat sebagai umpan balik. */
  const handleCopyCode = async () => {
    if (!referralLink) {
      showNotif({ title: 'Kode Belum Tersedia', description: 'Kode referral belum termuat. Muat ulang halaman ya.' });
      return;
    }
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showNotif({ title: 'Gagal Menyalin', description: 'Tidak dapat menyalin link. Salin manual ya.' });
    }
  };

  /* "Bagikan" memakai Web Share API kalau tersedia (umumnya mobile) dengan
     link referral saja; kalau tidak, link disalin ke clipboard sebagai
     fallback. */
  const handleShare = async () => {
    if (!referralLink) {
      showNotif({ title: 'Kode Belum Tersedia', description: 'Kode referral belum termuat. Muat ulang halaman ya.' });
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Jelajah Emas', url: referralLink });
      } catch {
        /* Pengguna menutup share sheet — tidak ada aksi lanjutan. */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(referralLink);
      showNotif({ variant: 'success', title: 'Link Disalin', description: 'Link referral disalin ke clipboard. Tempel di chat atau media sosial kamu.' });
    } catch {
      showNotif({ title: 'Gagal Membagikan', description: 'Tidak dapat membagikan link. Salin manual ya.' });
    }
  };

  return (
    <div className="page-misi">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/home'); }}>
                    <img src={img_1} alt="" />
                  </button>
                  <h1 className="header-title">Misi</h1>
                </header>
              </section>
              <section id="section-hero">
                <div className="hero-container">
                  <div className="hero-card">
                    <img src={img_2} alt="Ajak Teman Icon" className="hero-icon" />
                    <h2 className="hero-title">Ajak Teman</h2>
                    <p className="hero-desc">Undang temanmu pakai kode referral dan dapatkan bonus buat tiap teman yang bergabung.</p>
                    <div className="progress-wrapper">
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${heroPercent}%` }} />
                      </div>
                      <p className="progress-text">
                        {nextMission ? `${activeMembers} dari ${nextMission.requirement} teman bergabung` : 'Belum ada misi aktif'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-stats">
                <div className="stats-container">
                  <div className="stat-card">
                    <span className="stat-value">{level1 ? level1.members_total : '—'}</span>
                    <span className="stat-label">Diundang</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{level1 ? level1.members_active : '—'}</span>
                    <span className="stat-label">Bergabung</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value" style={{ fontSize: '14px' }}>{missions ? claimedBonus.toLocaleString('id-ID', { maximumFractionDigits: 0 }) : '—'}</span>
                    <span className="stat-label">Bonus Didapat</span>
                  </div>
                </div>
              </section>
              <section id="section-referral">
                <div className="referral-container">
                  <h2 className="section-title">Kode Referral Kamu</h2>
                  <div className="referral-card">
                    <div className="referral-info">
                      <p className="referral-label">Bagikan kode ini ke teman</p>
                      <p className="referral-code">{referralCode || '—'}</p>
                    </div>
                    <div className="referral-actions">
                      <button className="btn-salin" onClick={(e) => { e.preventDefault(); handleCopyCode(); }}>
                        {copied ? 'Tersalin!' : 'Salin'}
                      </button>
                      <button className="btn-bagikan" onClick={(e) => { e.preventDefault(); handleShare(); }}>
                        Bagikan
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-how-it-works">
                <div className="how-it-works-container">
                  <h2 className="section-title">Cara Kerjanya</h2>
                  <div className="steps-list">
                    <div className="step-item">
                      <div className="step-number">1</div>
                      <p className="step-text">Bagikan kode referral kamu ke teman lewat WhatsApp, media sosial, atau link langsung.</p>
                    </div>
                    <div className="step-item">
                      <div className="step-number">2</div>
                      <p className="step-text">Temanmu daftar akun baru dan memasukkan kode referral kamu saat registrasi.</p>
                    </div>
                    <div className="step-item">
                      <div className="step-number">3</div>
                      <p className="step-text">Setelah temanmu bergabung dan aktif, bonusnya siap kamu klaim di halaman ini.</p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-rewards">
                <div className="rewards-container">
                  <h2 className="section-title">Hadiah Tiap Ajakan</h2>
                  <div className="rewards-list">
                    {missionsError ? (
                      <div className="notice-margin">
                        <NotifCard variant="error" title="Gagal Memuat Misi" description={missionsError} />
                      </div>
                    ) : missions === null ? (
                      <p className="status-text">Memuat misi...</p>
                    ) : sortedMissions.length === 0 ? (
                      <p className="status-text">Belum ada misi aktif saat ini.</p>
                    ) : (
                      sortedMissions.map((mission) => {
                        const isAvailable = mission.status === 'available';
                        const isClaimed = !isAvailable && (mission.claimed || mission.status === 'claimed' || mission.status === 'exhausted');
                        const cardClass = isAvailable ? 'reward-card ready' : isClaimed ? 'reward-card claimed' : 'reward-card locked';
                        const rewardText = `+${formatRupiah(mission.reward)}`;
                        return (
                          <div className={cardClass} key={mission.id}>
                            <div className="reward-row">
                              <div className={`reward-icon ${isAvailable ? 'green' : isClaimed ? 'gray' : 'light'}`}>
                                <img src={isAvailable ? img_7 : isClaimed ? img_5 : img_8} alt="" />
                              </div>
                              <div className="reward-info">
                                <h4 className="reward-title">{mission.title}</h4>
                                <p className="reward-status">
                                  {isAvailable
                                    ? 'Sudah tercapai, siap diklaim'
                                    : isClaimed
                                      ? 'Sudah diklaim'
                                      : `Undang ${mission.remaining} teman lagi buat klaim hadiah ini`}
                                </p>
                              </div>
                              {isAvailable ? (
                                <button className="btn-claim" disabled={claimingId === mission.id} onClick={(e) => { e.preventDefault(); handleClaim(mission); }}>
                                  {claimingId === mission.id ? 'Memproses...' : 'Klaim'}
                                </button>
                              ) : isClaimed ? (
                                <div className="reward-points gray"><img src={img_6} alt="" /> {rewardText}</div>
                              ) : (
                                <div className="reward-points orange">{rewardText}</div>
                              )}
                            </div>
                            {!isAvailable && !isClaimed && (
                              <div className="reward-action">
                                <p>Yuk, undang sekarang!</p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </section>
              <section id="section-footer-note">
                <div className="footer-note-container">
                  <div className="note-card">
                    <div className="note-icon">
                      <img src={img_11} alt="Info" />
                    </div>
                    <p className="note-text">Bonus siap diklaim setelah temanmu bergabung dan aktif. Tidak berlaku untuk akun yang sudah pernah terdaftar sebelumnya.</p>
                  </div>
                </div>
              </section>
              <section id="section-bottom-button">
                <div className="bottom-button-container">
                  <button className="btn-large" onClick={(e) => { e.preventDefault(); handleShare(); }}>Bagikan Kode Referral</button>
                </div>
              </section>
            </div>

    </div>
  );
}
