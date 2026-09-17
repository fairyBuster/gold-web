import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { goBack } from '../../lib/backNav.js';
import { listSupportLinks } from '../../lib/supportLinksApi.js';
import img_1 from '../../assets/images/102_1724.svg';
import img_2 from '../../assets/images/7f43db77fdc0a54172b923d3fc56ba8f36714aa6.webp';
import img_3 from '../../assets/images/105_2312.svg';
import img_4 from '../../assets/images/d9af9b39efedfae7ea21b76fa659e5a945332389.webp';
import img_5 from '../../assets/images/109_2563.svg';
import img_6 from '../../assets/images/339e4d5bd714d7d8036056a2b0878ac61e305d28.png';
import img_7 from '../../assets/images/109_2563.svg';
import img_8 from '../../assets/images/9248a93a677bc363e73808d6da7651b37a1c67e1.webp';
import img_9 from '../../assets/images/109_2563.svg';
import img_10 from '../../assets/images/109_2563.svg';
import img_11 from '../../assets/images/488ceb8a244e7d386619c31c6d4e0de7cea5748b.webp';
import img_12 from '../../assets/images/109_2563.svg';
import img_13 from '../../assets/images/4b58d96ea77e63381c68a7f8cef8cc166f671df9.png';
import img_14 from '../../assets/images/109_2563.svg';
import img_15 from '../../assets/images/109_2563.svg';
import img_16 from '../../assets/images/109_2563.svg';
import img_17 from '../../assets/images/109_2563.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for HubungiCs — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-hubungi-cs to isolate this page. */

.page-hubungi-cs, .page-hubungi-cs * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    margin: 0;
    padding: 0;
}

.page-hubungi-cs {
  min-height: 100vh;
  width: 100%;
}

.page-hubungi-cs {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100%; /* Based on Figma design width */
    min-height: 100vh;
    background-color: #fffbf4;
    background-image: 
        radial-gradient(circle at 80% 0%, rgba(255, 201, 60, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 20% 10%, rgba(255, 159, 28, 0.08) 0%, transparent 50%);
    box-shadow: 0px 0px 30px rgba(26, 20, 16, 0.1);
    position: relative;
    overflow-x: hidden;
    color: #1a1410;
}

.page-hubungi-cs h1,.page-hubungi-cs  h2,.page-hubungi-cs  h3,.page-hubungi-cs  h4,.page-hubungi-cs  p {
    margin: 0;
}

/* Keep the content wrapper full-width so the page never collapses into a
   narrow centered column on wide screens. */
.page-hubungi-cs > div {
  width: 100%;
}

.page-hubungi-cs a {
    text-decoration: none;
    color: inherit;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-hubungi-cs #section-header {
    padding: 20px 0px 4px 20px;
}
.page-hubungi-cs .app-header {
    display: flex;
    align-items: center;
    gap: 14px;
}
.page-hubungi-cs .btn-back {
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s;
}
.page-hubungi-cs .btn-back:active {
    opacity: 0.7;
}
.page-hubungi-cs .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1410;
}

/* CSS for section section:Hero */
.page-hubungi-cs #section-hero {
    padding: 13px 20px 22px 20px;
}
.page-hubungi-cs .hero-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.page-hubungi-cs .hero-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 16px;
}
.page-hubungi-cs .hero-title {
    font-size: 22px;
    font-weight: 700;
    color: #1a1410;
    margin-bottom: 8px;
}
.page-hubungi-cs .hero-subtitle {
    font-size: 14px;
    color: #514840;
    line-height: 1.4;
    margin-bottom: 22px;
}
.page-hubungi-cs .operational-hours {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 13px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
}
.page-hubungi-cs .icon-clock {
    width: 18px;
    height: 18px;
}
.page-hubungi-cs .operational-hours p {
    font-size: 12px;
    color: #1a1410;
}

/* CSS for section section:Channels */
.page-hubungi-cs #section-channels {
    padding: 0 20px 24px 20px;
}
.page-hubungi-cs .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin-bottom: 12px;
}
.page-hubungi-cs .channel-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.page-hubungi-cs .channel-card {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 14px;
    padding: 13px 14px;
    gap: 12px;
    transition: background-color 0.2s ease;
}
.page-hubungi-cs .channel-card:active {
    background-color: #f9f6f1;
}
.page-hubungi-cs .channel-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    flex-shrink: 0;
}
.page-hubungi-cs .channel-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.page-hubungi-cs .channel-info h4 {
    font-size: 14px;
    font-weight: 600;
    color: #1a1410;
}
.page-hubungi-cs .channel-info p {
    font-size: 12px;
    color: #a79c8f;
}
.page-hubungi-cs .icon-arrow {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

/* CSS for section section:FAQ */
.page-hubungi-cs #section-faq {
    padding: 0 20px 40px 20px;
}
.page-hubungi-cs .faq-list {
    display: flex;
    flex-direction: column;
}
.page-hubungi-cs .faq-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 2px;
    border-bottom: 1px solid #efe7dc;
    transition: opacity 0.2s;
}
.page-hubungi-cs .faq-item:active {
    opacity: 0.6;
}
.page-hubungi-cs .faq-item:last-child {
    border-bottom: none;
}
.page-hubungi-cs .faq-text {
    font-size: 14px;
    font-weight: 500;
    color: #1a1410;
}
`;

/* Entri tujuan kartu channel di GET /api/support/links/ (ganti id bila entri
   di backend berubah): id 11 "Layanan Bantuan" → Call Center & CS Jelajah,
   id 13 "Saluran Telegram" → Saluran Komunitas, id 12 "Saluran WhatsApp" →
   WhatsApp. */
const HELP_LINK_ID = 11;
const COMMUNITY_LINK_ID = 13;
const WHATSAPP_LINK_ID = 12;

export default function HubungiCs() {
  const [supportLinks, setSupportLinks] = useState([]);

  /* Kanal bantuan dari backend; sampai termuat (atau bila gagal) kartu channel
     tetap memakai href '#' seperti mockup. */
  useEffect(() => {
    let active = true;
    listSupportLinks()
      .then((links) => {
        if (active) setSupportLinks(links);
      })
      .catch(() => { /* biarkan fallback '#' */ });
    return () => {
      active = false;
    };
  }, []);

  /* id 11 dipakai dua kartu (Call Center & CS Jelajah) — satu hasil find. */
  const helpLink = supportLinks.find((item) => item.id === HELP_LINK_ID && item.is_active !== false);
  const communityLink = supportLinks.find((item) => item.id === COMMUNITY_LINK_ID && item.is_active !== false);
  const whatsappLink = supportLinks.find((item) => item.id === WHATSAPP_LINK_ID && item.is_active !== false);

  return (
    <div className="page-hubungi-cs">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="app-header">
                  <a href="#" className="btn-back" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/home'); }}>
                    <img src={img_1} alt="" />
                  </a>
                  <h1 className="header-title">Hubungi CS</h1>
                </header>
              </section>
              <section id="section-hero">
                <div className="hero-content">
                  <img className="hero-avatar" src={img_2} alt="Customer Service Avatar" />
                  <h2 className="hero-title">Butuh Bantuan?</h2>
                  <p className="hero-subtitle">Tim Customer Service kami siap<br />bantu kamu lewat beberapa channel di bawah ini.</p>
                  <div className="operational-hours">
                    <img src={img_3} alt="Clock Icon" className="icon-clock" />
                    <p>Jam operasional: <strong>Senin–Minggu, 08:00–20:00 WIB</strong></p>
                  </div>
                </div>
              </section>
              <section id="section-channels">
                <h3 className="section-title">Pilih Channel</h3>
                <div className="channel-list">
                  <a href={communityLink?.url || '#'} className="channel-card" onClick={(e) => { if (!communityLink?.url) e.preventDefault(); }}>
                    <img className="channel-icon" src={img_4} alt="Saluran Komunitas" />
                    <div className="channel-info">
                      <h4>Saluran Komunitas</h4>
                      <p>Gabung diskusi &amp; info terbaru di Telegram</p>
                    </div>
                    <img className="icon-arrow" src={img_5} alt="" />
                  </a>
                  <a href={whatsappLink?.url || '#'} className="channel-card" onClick={(e) => { if (!whatsappLink?.url) e.preventDefault(); }}>
                    <img className="channel-icon" src={img_6} alt="WhatsApp" />
                    <div className="channel-info">
                      <h4>WhatsApp</h4>
                      <p>Gabung diskusi &amp; info terbaru di WhatsApp</p>
                    </div>
                    <img className="icon-arrow" src={img_7} alt="" />
                  </a>
                  <a href={helpLink?.url || '#'} className="channel-card" onClick={(e) => { if (!helpLink?.url) e.preventDefault(); }}>
                    <img className="channel-icon" src={img_8} alt="CS Jelajah" />
                    <div className="channel-info">
                      <h4>CS Jelajah</h4>
                      <p>Akun resmi terverifikasi, hati-hati akun palsu</p>
                    </div>
                    <img className="icon-arrow" src={img_9} alt="" />
                  </a>
                  <Link to="/index/support/livechat" className="channel-card">
                    <img className="channel-icon" src={img_2} alt="Live Chat di Aplikasi" />
                    <div className="channel-info">
                      <h4>Live Chat di Aplikasi</h4>
                      <p>Chat langsung dengan CS kami</p>
                    </div>
                    <img className="icon-arrow" src={img_10} alt="" />
                  </Link>
                  <a href="#" className="channel-card" onClick={(e) => e.preventDefault()}>
                    <img className="channel-icon" src={img_11} alt="Email" />
                    <div className="channel-info">
                      <h4>Email</h4>
                      <p>cs@jelajahemas.com</p>
                    </div>
                    <img className="icon-arrow" src={img_12} alt="" />
                  </a>
                  <a href={helpLink?.url || '#'} className="channel-card" onClick={(e) => { if (!helpLink?.url) e.preventDefault(); }}>
                    <img className="channel-icon" src={img_13} alt="Call Center" />
                    <div className="channel-info">
                      <h4>Call Center</h4>
                      <p>Tarif sesuai operator</p>
                    </div>
                    <img className="icon-arrow" src={img_14} alt="" />
                  </a>
                </div>
              </section>
              <section id="section-faq">
                <h3 className="section-title">Pertanyaan Umum</h3>
                <div className="faq-list">
                  <Link to="/index/support/pertanyaan-umum" className="faq-item">
                    <span className="faq-text">Bagaimana cara isi ulang saldo?</span>
                    <img src={img_15} alt="" className="icon-arrow" />
                  </Link>
                  <Link to="/index/support/pertanyaan-umum" className="faq-item">
                    <span className="faq-text">Berapa lama proses tarik dana?</span>
                    <img src={img_16} alt="" className="icon-arrow" />
                  </Link>
                  <Link to="/index/support/pertanyaan-umum" className="faq-item">
                    <span className="faq-text">Apakah emas digital aman?</span>
                    <img src={img_17} alt="" className="icon-arrow" />
                  </Link>
                </div>
              </section>
            </div>

    </div>
  );
}
