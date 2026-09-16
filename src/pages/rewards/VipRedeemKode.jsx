import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { goBack } from '../../lib/backNav.js';
import { useShowNotif } from '../../lib/useShowNotif.js';
import img_1 from '../../assets/images/102_2017.svg';
import img_2 from '../../assets/images/6ea7969d642adfbb038f569e995e7ac2259bb145.webp';
import img_3 from '../../assets/images/102_2039.svg';
import img_4 from '../../assets/images/102_2053.svg';
import img_5 from '../../assets/images/83771caf3290878852dfea1999f709535d158b8b.png';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for VipRedeemKode — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-vip-redeem-kode to isolate this page. */

.page-vip-redeem-kode {
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.page-vip-redeem-kode {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 80% -10%, rgba(255, 201, 60, 0.28) 0%, transparent 50%),
    radial-gradient(circle at 110% 20%, rgba(255, 159, 28, 0.25) 0%, transparent 60%);
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  position: relative;
  overflow-x: hidden;
  color: #1a1410;
}

.page-vip-redeem-kode, .page-vip-redeem-kode * {
  box-sizing: border-box;
}

.page-vip-redeem-kode h1,.page-vip-redeem-kode  h2,.page-vip-redeem-kode  h3,.page-vip-redeem-kode  h4,.page-vip-redeem-kode  p {
  margin: 0;
}

.page-vip-redeem-kode button {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
}

.page-vip-redeem-kode input {
  border: none;
  background: none;
  outline: none;
  font-family: inherit;
}

.page-vip-redeem-kode .px-20 {
  padding-left: 20px;
  padding-right: 20px;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-vip-redeem-kode .header-container {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 20px 4px 20px;
  }
  .page-vip-redeem-kode .back-btn {
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s;
  }
  .page-vip-redeem-kode .back-btn:hover {
    background-color: #ece5d8;
  }
  .page-vip-redeem-kode .header-title {
    color: #1a1410;
    font-size: 16px;
    font-weight: 700;
  }

/* CSS for section section:Hero */
.page-vip-redeem-kode #section-hero {
    margin-top: 10px;
  }
  .page-vip-redeem-kode .hero-image {
    width: 128px;
    height: 126px;
    object-fit: cover;
    display: block;
    margin-bottom: 8px;
  }
  .page-vip-redeem-kode .hero-title {
    color: #1a1410;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .page-vip-redeem-kode .hero-subtitle {
    color: #514840;
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 22px;
  }

/* CSS for section section:RedeemForm */
.page-vip-redeem-kode .input-label {
    display: block;
    color: #514840;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .page-vip-redeem-kode .input-container {
    background-color: #f6f1e9;
    border-radius: 14px;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 10px;
    margin-bottom: 24px;
  }
  .page-vip-redeem-kode .input-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  .page-vip-redeem-kode .redeem-input {
    flex: 1;
    font-size: 14px;
    color: #1a1410;
    min-width: 0;
  }
  .page-vip-redeem-kode .redeem-input::placeholder {
    color: #a79c8f;
  }
  .page-vip-redeem-kode .paste-btn {
    background-color: #ffffff;
    color: #514840;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 8px;
    flex-shrink: 0;
    transition: background-color 0.2s;
  }
  .page-vip-redeem-kode .paste-btn:hover {
    background-color: #f0f0f0;
  }
  .page-vip-redeem-kode .redeem-btn {
    width: 100%;
    background-color: #f1b04a;
    color: #1a1410;
    font-size: 16px;
    font-weight: 700;
    padding: 15px;
    border-radius: 14px;
    text-align: center;
    margin-bottom: 32px;
    transition: opacity 0.2s;
  }
  .page-vip-redeem-kode .redeem-btn:hover {
    opacity: 0.9;
  }

/* CSS for section section:Info */
.page-vip-redeem-kode .info-box {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 32px;
  }
  .page-vip-redeem-kode .info-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .page-vip-redeem-kode .info-text {
    color: #514840;
    font-size: 12px;
    line-height: 1.5;
  }
  .page-vip-redeem-kode .info-text strong {
    font-weight: 700;
    color: #1a1410;
  }

/* CSS for section section:History */
.page-vip-redeem-kode .history-title {
    color: #1a1410;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .page-vip-redeem-kode .history-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 40px;
  }
  .page-vip-redeem-kode .history-item {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 14px;
    padding: 13px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-vip-redeem-kode .history-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    flex-shrink: 0;
  }
  .page-vip-redeem-kode .history-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .page-vip-redeem-kode .history-code {
    color: #1a1410;
    font-size: 14px;
    font-weight: 700;
  }
  .page-vip-redeem-kode .history-date {
    color: #a79c8f;
    font-size: 12px;
  }
  .page-vip-redeem-kode .history-points {
    color: #3fa66b;
    font-size: 14px;
    font-weight: 700;
  }
`;

export default function VipRedeemKode() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const showNotif = useShowNotif();

  /* Validasi kosong tampil lewat halaman /notif; kode terisi lanjut ke halaman VIP. */
  const handleRedeem = () => {
    if (!code.trim()) {
      showNotif({ title: 'Lengkapi Data', description: 'Masukkan kode redeem terlebih dahulu.' });
      return;
    }
    navigate('/index/rewards/vip');
  };

  return (
    <div className="page-vip-redeem-kode">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header-container">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/rewards/vip'); }}>
                    <img src={img_1} alt="Back" />
                  </button>
                  <h1 className="header-title">Redeem Kode</h1>
                </header>
              </section>
              <section id="section-hero" className="px-20">
                <img src={img_2} alt="Redeem Illustration" className="hero-image" />
                <div className="hero-text">
                  <h2 className="hero-title">Punya Kode Redeem?</h2>
                  <p className="hero-subtitle">Masukkan kode voucher atau<br />kode promo yang kamu punya untuk klaim hadiahnya.</p>
                </div>
              </section>
              <section id="section-redeem-form" className="px-20">
                <label className="input-label">Kode Redeem</label>
                <div className="input-container">
                  <img src={img_3} alt="Icon" className="input-icon" />
                  <input type="text" placeholder="Masukkan kode di sini" className="redeem-input" value={code} onChange={(e) => setCode(e.target.value)} />
                  <button className="paste-btn">Tempel</button>
                </div>
                <button className="redeem-btn" onClick={(e) => { e.preventDefault(); handleRedeem(); }}>Redeem Sekarang</button>
              </section>
              <section id="section-info" className="px-20">
                <div className="info-box">
                  <img src={img_4} alt="Info" className="info-icon" />
                  <p className="info-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Kode redeem bisa kamu dapatkan dari <strong>event, media sosial resmi, atau undangan teman</strong>. Satu kode hanya bisa dipakai sekali.
                  </p>
                </div>
              </section>
              <section id="section-history" className="px-20">
                <h3 className="history-title">Riwayat Redeem</h3>
                <div className="history-list">
                  <div className="history-item">
                    <img src={img_5} alt="Coin" className="history-icon" />
                    <div className="history-details">
                      <div className="history-code">WELCOME2026</div>
                      <div className="history-date">28 Agu 2026</div>
                    </div>
                    <div className="history-points">+100 Poin</div>
                  </div>
                  <div className="history-item">
                    <img src={img_5} alt="Coin" className="history-icon" />
                    <div className="history-details">
                      <div className="history-code">GOLDFEST25</div>
                      <div className="history-date">15 Agu 2026</div>
                    </div>
                    <div className="history-points">+50 Poin</div>
                  </div>
                </div>
              </section>
            </div>

    </div>
  );
}
