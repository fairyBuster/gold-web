import img_1 from '../../assets/images/156_1523.svg';
import img_2 from '../../assets/images/6cc160dc9332040e2f6f3ee84020aa0a2519653a.png';
import img_3 from '../../assets/images/0df4ee1cbf5b1725acac2d9d08fb45019361fa6e.png';
import img_4 from '../../assets/images/77d24c42cf84c32b2b4b166aa82a20eab63965b9.png';
import img_5 from '../../assets/images/6cb5bd9ac1f6d69bd474bb083eb9aef1b43ece63.png';
import img_6 from '../../assets/images/91d0ab97f9ac67690ef668b9d7be1822064ebf26.png';
import img_7 from '../../assets/images/ea189c93af3cf445b247df84a4c0aac9334bc27d.png';
import img_8 from '../../assets/images/26_530.svg';
import img_9 from '../../assets/images/26_537.svg';
/* Full-page background artwork (same asset as the login screen). */
import img_10 from '../../assets/images/083535.png';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for TentangKami — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-tentang-kami to isolate this page. */

.page-tentang-kami {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  background-color: #fffbf4;
  /* Background artwork (assigned inline from the imported asset) is a
     full-page image with glows anchored to the top/bottom — stretch it. */
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: top center;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.1);
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;
}

.page-tentang-kami, .page-tentang-kami * {
  box-sizing: inherit;
}

.page-tentang-kami .section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.page-tentang-kami .dot {
  width: 6px;
  height: 6px;
  background-color: #e8790c;
  border-radius: 3px;
}

.page-tentang-kami .section-title h3 {
  font-size: 12px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
  text-transform: uppercase;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-tentang-kami #section-header {
    width: 100%;
  }
  .page-tentang-kami .header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 22px 20px 16px 20px;
  }
  .page-tentang-kami .back-btn {
    background-color: #f6f1e9;
    border: none;
    border-radius: 12px;
    width: 38px;
    height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .page-tentang-kami .header-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }

/* CSS for section section:Hero */
.page-tentang-kami #section-hero {
    padding: 14px 22px 0 22px;
  }
  .page-tentang-kami .hero-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-tentang-kami .hero-logo {
    width: 49px;
    height: 58px;
    border-radius: 5px;
    object-fit: cover;
  }
  .page-tentang-kami .hero-title-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .page-tentang-kami .hero-title {
    font-size: 18px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }
  .page-tentang-kami .hero-subtitle {
    font-size: 12px;
    color: #a79c8f;
    margin: 0;
  }
  .page-tentang-kami .hero-description {
    background-color: #f6f1e9;
    border: 1px solid #e8790c;
    border-radius: 10px;
    padding: 14px 16px;
    margin-top: 18px;
  }
  .page-tentang-kami .hero-description p {
    font-size: 12px;
    line-height: 1.5;
    color: #514840;
    margin: 0;
  }

/* CSS for section section:CompanyInfo */
.page-tentang-kami #section-company-info {
    padding: 18px 22px 0 22px;
  }
  .page-tentang-kami .info-list {
    display: flex;
    flex-direction: column;
    border-top: 1px solid #efe7dc;
  }
  .page-tentang-kami .info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 11px 0;
    border-bottom: 1px solid #efe7dc;
    gap: 16px;
  }
  .page-tentang-kami .info-label {
    font-size: 12px;
    color: #a79c8f;
    flex-shrink: 0;
  }
  .page-tentang-kami .info-value {
    font-size: 12px;
    font-weight: 700;
    color: #1a1410;
    text-align: right;
    word-break: break-word;
  }
  .page-tentang-kami .text-right {
    text-align: right;
  }

/* CSS for section section:Legality */
.page-tentang-kami #section-legality {
    padding: 18px 22px 0 22px;
  }
  .page-tentang-kami .legality-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 14px;
  }
  .page-tentang-kami .legality-card {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-tentang-kami .card-logo {
    object-fit: contain;
  }
  .page-tentang-kami .ojk-logo {
    width: 40px;
    height: 17px;
  }
  .page-tentang-kami .bappebti-logo {
    width: 50px;
    height: 17px;
  }
  .page-tentang-kami .card-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .page-tentang-kami .card-text h4 {
    font-size: 12px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }
  .page-tentang-kami .card-text p {
    font-size: 11px;
    color: #a79c8f;
    margin: 0;
  }
  .page-tentang-kami .document-images {
    display: flex;
    gap: 14px;
    margin-bottom: 14px;
    align-items: flex-start;
  }
  .page-tentang-kami .doc-img-main {
    width: 214px;
    height: auto;
    border-radius: 0;
  }
  .page-tentang-kami .doc-img-qr {
    width: 126px;
    height: 126px;
    border-radius: 0;
  }
  .page-tentang-kami .npwp-cards-img {
    width: 100%;
    height: auto;
    border-radius: 0;
    display: block;
  }

/* CSS for section section:Contact */
.page-tentang-kami #section-contact {
    padding: 18px 22px 40px 22px;
  }
  .page-tentang-kami .contact-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .page-tentang-kami .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-tentang-kami .contact-icon {
    width: 34px;
    height: 34px;
    background-color: #f6f1e9;
    border-radius: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .page-tentang-kami .contact-icon img {
    width: 16px;
    height: 16px;
  }
  .page-tentang-kami .contact-text {
    font-size: 12px;
    color: #1a1410;
  }
  .page-tentang-kami .contact-text strong {
    font-weight: 700;
  }
`;

export default function TentangKami() {
  return (
    <div className="page-tentang-kami" style={{ backgroundImage: `url(${img_10})` }}>
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <button className="back-btn" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="Back" />
                  </button>
                  <h1 className="header-title">Tentang Kami</h1>
                </header>
              </section>
              <section id="section-hero">
                <div className="hero-content">
                  <div className="hero-header">
                    <img src={img_2} alt="JelajahEmas Logo" className="hero-logo" />
                    <div className="hero-title-group">
                      <h2 className="hero-title">JelajahEmas</h2>
                      <p className="hero-subtitle">Dibawah naungan PT Jelajah Emas Digital Indonesia</p>
                    </div>
                  </div>
                  <div className="hero-description">
                    <p>JelajahEmas hadir sebagai platform informasi dan layanan emas digital yang memudahkan masyarakat untuk mengenal, memahami, serta melakukan transaksi emas secara praktis. Kami berkomitmen menghadirkan pengalaman yang aman, transparan, dan mudah diakses kapan saja.</p>
                  </div>
                </div>
              </section>
              <section id="section-company-info">
                <div className="section-title">
                  <span className="dot" />
                  <h3>Informasi Perusahaan</h3>
                </div>
                <div className="info-list">
                  <div className="info-row">
                    <span className="info-label">Nama Perusahaan</span>
                    <span className="info-value">PT JELAJAH EMAS DIGITAL INDONESIA</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Nomor AHU</span>
                    <span className="info-value">AHU-A11995.AH.01.30 tahun 2026</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">NPWP</span>
                    <span className="info-value">1000000011096252</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Alamat Kantor</span>
                    <span className="info-value text-right">District 8 SCBD Lot 28, Jl. Tulodong Atas 2 No.28, RT.5/RW.3, RT 005, RW 003, Senayan, Kebayoran Baru, Kota Administrasi Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12190</span>
                  </div>
                </div>
              </section>
              <section id="section-legality">
                <div className="section-title">
                  <span className="dot" />
                  <h3>Legalitas &amp; Perizinan</h3>
                </div>
                <div className="legality-cards">
                  <div className="legality-card">
                    <img src={img_3} alt="OJK Logo" className="card-logo ojk-logo" />
                    <div className="card-text">
                      <h4>Otoritas Jasa Keuangan</h4>
                      {/* <p>No. Izin: [Nomor Izin OJK]</p> */}
                    </div>
                  </div>
                  <div className="legality-card">
                    <img src={img_4} alt="Bappebti Logo" className="card-logo bappebti-logo" />
                    <div className="card-text">
                      <h4>Badan Pengawas Perdagangan Berjangka Komoditi</h4>
                    </div>
                  </div>
                </div>
                <div className="document-images">
                  <img src={img_5} alt="Sertifikat" className="doc-img-main" />
                  <img src={img_6} alt="QR Code" className="doc-img-qr" />
                </div>
                <img src={img_7} alt="NPWP Cards" className="npwp-cards-img" />
              </section>
              <section id="section-contact">
                <div className="section-title">
                  <span className="dot" />
                  <h3>Hubungi Kami</h3>
                </div>
                <div className="contact-list">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <img src={img_8} alt="Email Icon" />
                    </div>
                    <span className="contact-text"><strong>Email:</strong> cs@jelajahemas.com</span>
                  </div>
                  <div className="contact-item">
                    {/* <div className="contact-icon">
                      <img src={img_9} alt="Phone Icon" />
                    </div>
                    <span className="contact-text"><strong>Telepon:</strong> (021) 000-0000</span> */}
                  </div>
                </div>
              </section>
            </div>

    </div>
  );
}
