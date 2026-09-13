/* ============================================================================
   CetakEmas.jsx — single-file implementation of the physical gold printing wizard.
   All steps of this flow live in this one file; the <CetakEmas step={n} />
   element passed by App.jsx selects the active step. URL per step:
     1 -> /assets/cetak-emas-01
     2 -> /assets/cetak-emas-02
     3 -> /assets/cetak-emas-03
   ============================================================================ */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* Step 1 imports (renamed to avoid collisions with other steps) */
import S1_img_1 from '../../../assets/images/36_668.svg';
import S1_img_2 from '../../../assets/images/4ff45e57bc897e30533b9ea96068fac470c7dbbe.png';
import S1_img_3 from '../../../assets/images/97196130a1fd8b9d5ad63809c0373395554691fe.png';

/* Step 2 imports (renamed to avoid collisions with other steps) */
import S2_img_1 from '../../../assets/images/34_305.svg';
import S2_img_2 from '../../../assets/images/97196130a1fd8b9d5ad63809c0373395554691fe.png';

/* Step 3 imports (renamed to avoid collisions with other steps) */
import S3_img_1 from '../../../assets/images/7ad23d77f11622cbb0af82a44395f1afe17db1bf.png';
import S3_img_2 from '../../../assets/images/40_904.svg';
import S3_img_3 from '../../../assets/images/40_904.svg';


/* ================= Step 1 — /assets/cetak-emas-01 (was CetakEmas01.jsx) ================= */

const CetakEmas01Styles = `
/* Scoped styles for CetakEmas01 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-cetak-emas-01 to isolate this page. */

.page-cetak-emas-01 {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #e0e0e0;
    display: flex;
    justify-content: center;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  width: 100%;
}

.page-cetak-emas-01 .app-container {
    width: 100%;
    max-width: 100%;
    background-color: #fffbf4;
    background-image: 
        radial-gradient(circle at 76% 11%, rgba(255, 201, 60, 0.28) 0%, rgba(255, 201, 60, 0) 70%),
        radial-gradient(circle at 111% 25%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 70%),
        radial-gradient(circle at 90% 50%, rgba(255, 159, 28, 0.38) 0%, rgba(255, 159, 28, 0) 70%);
    min-height: 100vh;
    box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
    position: relative;
    display: flex;
    flex-direction: column;
}

.page-cetak-emas-01 .section-container {
    padding: 0 20px;
    margin-bottom: 20px;
}

.page-cetak-emas-01 h2 {
    font-size: 14px;
    font-weight: 700;
    color: #1a1410;
    margin: 0 0 8px 0;
}

.page-cetak-emas-01 p {
    margin: 0;
}

.page-cetak-emas-01, .page-cetak-emas-01 * {
    box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-cetak-emas-01 .header {
        display: flex;
        align-items: center;
        padding: 20px;
        gap: 14px;
    }
    .page-cetak-emas-01 .back-btn {
        background-color: #f6f1e9;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 0;
    }
    .page-cetak-emas-01 .page-title {
        font-size: 16px;
        font-weight: 700;
        color: #1a1410;
        margin: 0;
    }

/* CSS for section section:Balance */
.page-cetak-emas-01 .balance-card {
        background: radial-gradient(circle at 41% 50%, #241c16 0%, #1a1410 55%, #120d09 100%);
        border-radius: 10px;
        padding: 18px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        overflow: hidden;
        min-height: 91px;
    }
    .page-cetak-emas-01 .balance-info {
        z-index: 2;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .page-cetak-emas-01 .balance-label {
        color: rgba(255, 249, 242, 0.55);
        font-size: 12px;
    }
    .page-cetak-emas-01 .balance-amount {
        color: #fff9f2;
        font-size: 24px;
        font-weight: 700;
    }
    .page-cetak-emas-01 .balance-img {
        position: absolute;
        right: 0;
        bottom: 0;
        height: 90px;
        width: 85px;
        object-fit: cover;
        z-index: 1;
    }

/* CSS for section section:WeightSelection */
.page-cetak-emas-01 .subtitle {
        color: #a79c8f;
        font-size: 12px;
        line-height: 1.4;
        margin-bottom: 14px;
    }
    .page-cetak-emas-01 .weight-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }
    .page-cetak-emas-01 .weight-option {
        background-color: #ffffff;
        border: 1px solid #efe7dc;
        border-radius: 14px;
        padding: 14px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        cursor: pointer;
        height: 66px;
    }
    .page-cetak-emas-01 .weight-option.selected {
        border-color: #e8790c;
        box-shadow: 0px 0px 0px 3px rgba(232, 121, 12, 0.1);
        position: relative;
    }
    .page-cetak-emas-01 .weight-val {
        color: #1a1410;
        font-weight: 700;
        font-size: 14px;
    }
    .page-cetak-emas-01 .weight-status {
        color: #a79c8f;
        font-size: 10px;
    }

/* CSS for section section:PrintDetails */
.page-cetak-emas-01 .details-card {
        background-color: #ffffff;
        border: 1px solid #efe7dc;
        border-radius: 16px;
        padding: 4px 16px;
        display: flex;
        flex-direction: column;
    }
    .page-cetak-emas-01 .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #efe7dc;
    }
    .page-cetak-emas-01 .detail-row.no-border {
        border-bottom: none;
    }
    .page-cetak-emas-01 .detail-label {
        color: #a79c8f;
        font-size: 12px;
    }
    .page-cetak-emas-01 .detail-value {
        color: #1a1410;
        font-size: 12px;
        font-weight: 700;
    }

/* CSS for section section:ShippingAddress */
.page-cetak-emas-01 .address-card {
        background-color: #ffffff;
        border: 1px solid #efe7dc;
        border-radius: 16px;
        padding: 15px 17px;
        display: flex;
        align-items: flex-start;
        gap: 17px;
    }
    .page-cetak-emas-01 .address-icon {
        width: 48px;
        height: 48px;
        object-fit: contain;
    }
    .page-cetak-emas-01 .address-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding-top: 2px;
    }
    .page-cetak-emas-01 .address-name {
        color: #1a1410;
        font-size: 12px;
        font-weight: 700;
    }
    .page-cetak-emas-01 .address-text {
        color: #a79c8f;
        font-size: 12px;
        line-height: 1.5;
    }
    .page-cetak-emas-01 .address-change {
        color: #e8790c;
        font-size: 12px;
        font-weight: 700;
        text-decoration: none;
        align-self: center;
    }

/* CSS for section section:Summary */
.page-cetak-emas-01 .summary-card {
        background-color: #f6f1e9;
        border-radius: 16px;
        padding: 16px 18px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .page-cetak-emas-01 .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .page-cetak-emas-01 .summary-label {
        color: #514840;
        font-size: 12px;
    }
    .page-cetak-emas-01 .summary-value {
        color: #1a1410;
        font-size: 12px;
        font-weight: 700;
    }
    .page-cetak-emas-01 .summary-divider {
        border-top: 1px dashed rgba(26, 20, 16, 0.18);
        margin: 2px 0;
    }
    .page-cetak-emas-01 .total-row {
        margin-top: 2px;
    }
    .page-cetak-emas-01 .total-label {
        color: #1a1410;
        font-weight: 700;
    }
    .page-cetak-emas-01 .total-value {
        color: #e8790c;
        font-size: 14px;
    }

/* CSS for section section:Notes */
.page-cetak-emas-01 .notes-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .page-cetak-emas-01 .notes-list li {
        color: #a79c8f;
        font-size: 11px;
        line-height: 1.5;
        position: relative;
        padding-left: 16px;
    }
    .page-cetak-emas-01 .notes-list li::before {
        content: "•";
        position: absolute;
        left: 4px;
        top: 0;
        color: #a79c8f;
        font-size: 14px;
    }

/* CSS for section section:Footer */
.page-cetak-emas-01 .primary-btn {
        background-color: #f1b04a;
        color: #1a1410;
        font-weight: 700;
        font-size: 14px;
        border: none;
        border-radius: 5px;
        width: 100%;
        padding: 15px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    .page-cetak-emas-01 .primary-btn:hover {
        background-color: #e5a33d;
    }
`;

/* Printable weights (grams) offered on step 1, with the reference gold price
   per gram carried over from the previous 1-gram mockup value. */
const PRINT_WEIGHTS = [0.5, 1, 2, 5, 10, 25];
const GOLD_PRICE_PER_GRAM = 1569270;

/* "0,5" / "2" — Indonesian decimal comma for gram labels. */
const formatGrams = (grams) => String(grams).replace('.', ',');
const formatRupiah = (value) => `Rp ${Math.round(value).toLocaleString('id-ID')}`;

function CetakEmas01() {
  const navigate = useNavigate();
  const [weight, setWeight] = useState(1);

  return (
    <div className="page-cetak-emas-01">
      <style>{CetakEmas01Styles}</style>
      <div className="app-container">
              <section id="section-header">
                <header className="header">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={S1_img_1} alt="" />
                  </button>
                  <h1 className="page-title">Cetak Emas</h1>
                </header>
              </section>
              <section id="section-balance" className="section-container">
                <div className="balance-card">
                  <div className="balance-info">
                    <p className="balance-label">Saldo Emas Tersedia</p>
                    <p className="balance-amount">2,145 gram</p>
                  </div>
                  <img className="balance-img" src={S1_img_2} alt="Character holding gold" />
                </div>
              </section>
              <section id="section-weight" className="section-container">
                <h2>Pilih Berat Cetak</h2>
                <p className="subtitle">Pilih berat emas fisik yang ingin kamu cetak dari saldo emas yang tersedia.</p>
                <div className="weight-grid">
                  {PRINT_WEIGHTS.map((grams) => (
                    <div
                      className={`weight-option${grams === weight ? ' selected' : ''}`}
                      key={grams}
                      onClick={() => setWeight(grams)}
                    >
                      <span className="weight-val">{formatGrams(grams)} gr</span>
                      <span className="weight-status">Tersedia</span>
                    </div>
                  ))}
                </div>
              </section>
              <section id="section-details" className="section-container">
                <h2>Detail Pencetakan</h2>
                <div className="details-card">
                  <div className="detail-row">
                    <span className="detail-label">Berat Dicetak</span>
                    <span className="detail-value">{formatGrams(weight)} gram</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Biaya Cetak</span>
                    <span className="detail-value">Rp 45.000</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Estimasi Proses</span>
                    <span className="detail-value">45 hari kerja</span>
                  </div>
                  <div className="detail-row no-border">
                    <span className="detail-label">Sertifikat Keaslian</span>
                    <span className="detail-value">Disertakan</span>
                  </div>
                </div>
              </section>
              <section id="section-address" className="section-container">
                <h2>Alamat Pengiriman</h2>
                <div className="address-card">
                  <img className="address-icon" src={S1_img_3} alt="Map Pin" />
                  <div className="address-info">
                    <span className="address-name">[Nama Penerima]</span>
                    <span className="address-text">Jl. [Nama Jalan] No. [123], [Kecamatan],<br />[Kota], [Kode Pos]</span>
                  </div>
                  <Link to="/assets/alamat-pengiriman" className="address-change">Ubah</Link>
                </div>
              </section>
              <section id="section-summary" className="section-container">
                <h2>Ringkasan</h2>
                <div className="summary-card">
                  <div className="summary-row">
                    <span className="summary-label">Berat Emas ({formatGrams(weight)} gr)</span>
                    <span className="summary-value">{formatRupiah(weight * GOLD_PRICE_PER_GRAM)}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Biaya Cetak</span>
                    <span className="summary-value">Rp 45.000</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Ongkos Kirim</span>
                    <span className="summary-value">Rp 20.000</span>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-row total-row">
                    <span className="summary-label total-label">Total Biaya</span>
                    <span className="summary-value total-value">Rp 65.000</span>
                  </div>
                </div>
              </section>
              <section id="section-notes" className="section-container">
                <h2>Catatan Penting</h2>
                <ul className="notes-list">
                  <li>Saldo emas kamu akan otomatis terpotong sesuai berat yang dicetak begitu pesanan dikonfirmasi.</li>
                  <li>Emas fisik akan dikirim dalam kemasan tersegel lengkap dengan sertifikat keaslian.</li>
                  <li>Proses pencetakan tidak dapat dibatalkan setelah pembayaran biaya cetak berhasil dikonfirmasi.</li>
                  <li>Pastikan alamat pengiriman sudah benar sebelum melanjutkan pesanan.</li>
                </ul>
              </section>
              <section id="section-footer" className="section-container" style={{marginTop: 'auto', paddingBottom: 20}}>
                <button className="primary-btn" onClick={(e) => { e.preventDefault(); navigate('/assets/cetak-emas-02'); }}>Lanjutkan Pencetakan</button>
              </section>
            </div> {/* Close app-container */}

    </div>
  );
}

/* ================= Step 2 — /assets/cetak-emas-02 (was CetakEmas02.jsx) ================= */

const CetakEmas02Styles = `
/* Scoped styles for CetakEmas02 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-cetak-emas-02 to isolate this page. */

.page-cetak-emas-02 {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #fffbf4;
  -webkit-font-smoothing: antialiased;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}
.page-cetak-emas-02 .mobile-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background-color: #fffbf4;
  box-sizing: border-box;
  padding: 0 20px;
}
.page-cetak-emas-02 h2.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1410;
  margin: 0 0 10px 0;
}
.page-cetak-emas-02 .card {
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  border-radius: 16px;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-cetak-emas-02 .header-container {
  padding-top: 20px;
  padding-bottom: 14px;
  /* Subtle top-left glow to approximate the complex Figma gradient */
  background: #fffbf4 radial-gradient(circle at 80% -20%, rgba(255, 201, 60, 0.2) 0%, transparent 60%);
}
.page-cetak-emas-02 .header {
  display: flex;
  align-items: center;
  gap: 14px;
}
.page-cetak-emas-02 .back-btn {
  width: 36px;
  height: 36px;
  background-color: #f6f1e9;
  border-radius: 11px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}
.page-cetak-emas-02 .page-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
}

/* CSS for section section:DetailEmas */
.page-cetak-emas-02 .detail-emas-container {
  padding-bottom: 18px;
}
.page-cetak-emas-02 .detail-emas-card {
  display: flex;
  gap: 14px;
  padding: 16px;
}
.page-cetak-emas-02 .emas-icon {
  width: 56px;
  height: 56px;
  background-color: #f6f1e9;
  border: 1px solid rgba(26, 20, 16, 0.22);
  border-radius: 14px;
  flex-shrink: 0;
}
.page-cetak-emas-02 .emas-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.page-cetak-emas-02 .emas-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1410;
}
.page-cetak-emas-02 .emas-desc {
  font-size: 12px;
  color: #a79c8f;
  line-height: 1.4;
  margin-bottom: 4px;
}
.page-cetak-emas-02 .emas-tag {
  background-color: rgba(255, 159, 28, 0.12);
  color: #e8790c;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 8px;
  align-self: flex-start;
}

/* CSS for section section:DetailPencetakan */
.page-cetak-emas-02 .detail-pencetakan-container {
  padding-bottom: 18px;
}
.page-cetak-emas-02 .detail-pencetakan-card {
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
}
.page-cetak-emas-02 .detail-pencetakan-card .row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 0;
  border-bottom: 1px solid #efe7dc;
}
.page-cetak-emas-02 .detail-pencetakan-card .row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.page-cetak-emas-02 .detail-pencetakan-card .row:first-child {
  padding-top: 0;
}
.page-cetak-emas-02 .detail-pencetakan-card .label {
  font-size: 12px;
  color: #a79c8f;
}
.page-cetak-emas-02 .detail-pencetakan-card .value {
  font-size: 12px;
  font-weight: 700;
  color: #1a1410;
}

/* CSS for section section:AlamatPengiriman */
.page-cetak-emas-02 .alamat-container {
  padding-bottom: 18px;
}
.page-cetak-emas-02 .alamat-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  position: relative;
}
.page-cetak-emas-02 .map-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
}
.page-cetak-emas-02 .alamat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 40px;
}
.page-cetak-emas-02 .alamat-name {
  font-size: 12px;
  font-weight: 700;
  color: #1a1410;
}
.page-cetak-emas-02 .alamat-detail {
  font-size: 12px;
  color: #a79c8f;
  line-height: 1.4;
}
.page-cetak-emas-02 .ubah-btn {
  background: none;
  border: none;
  color: #e8790c;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

/* CSS for section section:RincianBiaya */
.page-cetak-emas-02 .rincian-container {
  padding-bottom: 18px;
}
.page-cetak-emas-02 .rincian-card {
  background-color: #f6f1e9;
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
}
.page-cetak-emas-02 .rincian-card .row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}
.page-cetak-emas-02 .rincian-card .label-dark {
  font-size: 12px;
  color: #514840;
}
.page-cetak-emas-02 .rincian-card .value {
  font-size: 12px;
  font-weight: 700;
  color: #1a1410;
}
.page-cetak-emas-02 .rincian-card .divider {
  height: 0;
  border-top: 1px dashed rgba(26, 20, 16, 0.18);
  margin: 10px 0;
}
.page-cetak-emas-02 .rincian-card .total-row {
  padding-top: 10px;
  padding-bottom: 0;
}
.page-cetak-emas-02 .rincian-card .total-label {
  font-size: 14px;
  font-weight: 700;
  color: #1a1410;
}
.page-cetak-emas-02 .rincian-card .total-value {
  font-size: 14px;
  font-weight: 700;
  color: #e8790c;
}

/* CSS for section section:Footer */
.page-cetak-emas-02 .footer-container {
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.page-cetak-emas-02 .terms-container {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 4px;
}
.page-cetak-emas-02 .checkbox {
  width: 18px;
  height: 18px;
  background-color: #e8790c;
  border-radius: 2.5px;
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-cetak-emas-02 .checkbox::after {
  content: '';
  width: 4px;
  height: 8px;
  border: solid #ffffff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}
.page-cetak-emas-02 .terms-text {
  font-size: 12px;
  color: #514840;
  line-height: 1.5;
}
.page-cetak-emas-02 .terms-text .highlight {
  color: #e8790c;
  font-weight: 700;
}
.page-cetak-emas-02 .btn-primary {
  background-color: #f1b04a;
  color: #1a1410;
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 5px;
  padding: 15px;
  width: 100%;
  cursor: pointer;
  text-align: center;
}
.page-cetak-emas-02 .btn-secondary {
  background-color: transparent;
  color: #514840;
  font-size: 14px;
  font-weight: 700;
  border: 1px solid #efe7dc;
  border-radius: 14px;
  padding: 13px;
  width: 100%;
  cursor: pointer;
  text-align: center;
}
`;

function CetakEmas02() {
  const navigate = useNavigate();

  return (
    <div className="page-cetak-emas-02">
      <style>{CetakEmas02Styles}</style>
      <div>
              <section id="section-header" style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div className="mobile-container header-container">
                  <header className="header">
                    <button className="back-btn" aria-label="Back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                      <img src={S2_img_1} alt="Back Icon" />
                    </button>
                    <h1 className="page-title">Ringkasan Pesanan</h1>
                  </header>
                </div>
              </section>
              <section id="section-detail-emas" style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div className="mobile-container detail-emas-container">
                  <h2 className="section-title">Detail Emas</h2>
                  <div className="card detail-emas-card">
                    <div className="emas-icon" />
                    <div className="emas-info">
                      <div className="emas-title">Emas Cetak 1 gram</div>
                      <div className="emas-desc">Emas fisik 1 gram dengan kadar dan spesifikasi sesuai produk yang dipilih.</div>
                      <div className="emas-tag">Sertifikat Disertakan</div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-detail-pencetakan" style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div className="mobile-container detail-pencetakan-container">
                  <h2 className="section-title">Detail Pencetakan</h2>
                  <div className="card detail-pencetakan-card">
                    <div className="row">
                      <span className="label">Berat Dicetak</span>
                      <span className="value">1 gram</span>
                    </div>
                    <div className="row">
                      <span className="label">Estimasi Proses</span>
                      <span className="value">3–5 hari kerja</span>
                    </div>
                    <div className="row">
                      <span className="label">Estimasi Tiba</span>
                      <span className="value">10–12 Sep 2026</span>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-alamat" style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div className="mobile-container alamat-container">
                  <h2 className="section-title">Alamat Pengiriman</h2>
                  <div className="card alamat-card">
                    <img src={S2_img_2} alt="Map Icon" className="map-icon" />
                    <div className="alamat-info">
                      <div className="alamat-name">[Nama Penerima]</div>
                      <div className="alamat-detail">Jl. [Nama Jalan] No. [123], [Kecamatan],<br />[Kota], [Kode Pos]</div>
                    </div>
                    <button className="ubah-btn" onClick={(e) => { e.preventDefault(); navigate('/assets/alamat-pengiriman'); }}>Ubah</button>
                  </div>
                </div>
              </section>
              <section id="section-rincian-biaya" style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div className="mobile-container rincian-container">
                  <h2 className="section-title">Rincian Biaya</h2>
                  <div className="rincian-card">
                    <div className="row">
                      <span className="label-dark">Harga Emas (1 gr)</span>
                      <span className="value">Rp 1.569.270</span>
                    </div>
                    <div className="row">
                      <span className="label-dark">Biaya Cetak</span>
                      <span className="value">Rp 45.000</span>
                    </div>
                    <div className="row">
                      <span className="label-dark">Ongkos Kirim</span>
                      <span className="value">Rp 20.000</span>
                    </div>
                    <div className="divider" />
                    <div className="row total-row">
                      <span className="total-label">Total Dibayar</span>
                      <span className="total-value">Rp 65.000</span>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-footer" style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div className="mobile-container footer-container">
                  <div className="terms-container">
                    <div className="checkbox" />
                    <div className="terms-text">
                      Saya telah memeriksa detail pesanan dan menyetujui <span className="highlight">Syarat &amp; Ketentuan</span> pencetakan emas.
                    </div>
                  </div>
                  <button className="btn-primary" onClick={(e) => { e.preventDefault(); navigate('/assets/cetak-emas-03'); }}>Bayar Sekarang</button>
                  <button className="btn-secondary" onClick={(e) => { e.preventDefault(); navigate('/assets/cetak-emas-01'); }}>Kembali &amp; Ubah Pesanan</button>
                </div>
              </section>
            </div>

    </div>
  );
}

/* ================= Step 3 — /assets/cetak-emas-03 (was CetakEmas03.jsx) ================= */

const CetakEmas03Styles = `
/* Scoped styles for CetakEmas03 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-cetak-emas-03 to isolate this page. */

.page-cetak-emas-03 {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #e5e5e5; /* Background outside the app container */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  width: 100%;
}

.page-cetak-emas-03, .page-cetak-emas-03 * {
  box-sizing: border-box;
}

/* Utility classes for typography */
.page-cetak-emas-03 .text-dark { color: #1a1410; }
.page-cetak-emas-03 .text-medium { color: #514840; }
.page-cetak-emas-03 .text-light { color: #a79c8f; }
.page-cetak-emas-03 .text-success { color: #3fa66b; }

.page-cetak-emas-03 .font-bold { font-weight: 700; }
.page-cetak-emas-03 .font-semibold { font-weight: 600; }
.page-cetak-emas-03 .font-medium { font-weight: 500; }
.page-cetak-emas-03 .font-regular { font-weight: 400; }

.page-cetak-emas-03 .text-center { text-align: center; }

/* ---- inline section styles ---- */

/* CSS for section section:Hero */
.page-cetak-emas-03 #section-hero {
    max-width: 100%;
    margin: 0 auto;
    background-color: #fffbf4;
    /* Approximating the soft radial gradient from the design */
    background-image: radial-gradient(circle at 50% 0%, rgba(255, 201, 60, 0.15) 0%, rgba(255, 255, 255, 0) 60%);
    padding: 40px 22px 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .page-cetak-emas-03 .hero-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .page-cetak-emas-03 .hero-image {
    width: 120px;
    height: 125px;
    object-fit: contain;
    margin-bottom: 16px;
  }

  .page-cetak-emas-03 .hero-title {
    font-size: 20px;
    margin: 0 0 8px 0;
    line-height: 1.4;
    text-align: center;
  }

  .page-cetak-emas-03 .hero-subtitle {
    font-size: 14px;
    margin: 0;
    line-height: 1.5;
    text-align: center;
    max-width: 320px;
  }

/* CSS for section section:OrderDetails */
.page-cetak-emas-03 #section-order-details {
    max-width: 100%;
    margin: 0 auto;
    background-color: #fffbf4;
    padding: 0 22px 16px;
  }

  .page-cetak-emas-03 .order-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
  }

  .page-cetak-emas-03 .order-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
  }

  .page-cetak-emas-03 .order-row.border-bottom {
    border-bottom: 1px solid #efe7dc;
  }

  .page-cetak-emas-03 .order-row:first-child {
    padding-top: 0;
  }

  .page-cetak-emas-03 .order-row:last-child {
    padding-bottom: 0;
  }

  .page-cetak-emas-03 .row-label {
    font-size: 13px;
  }

  .page-cetak-emas-03 .row-value {
    font-size: 13px;
  }

  .page-cetak-emas-03 .status-badge {
    background-color: rgba(63, 166, 107, 0.14);
    padding: 4px 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page-cetak-emas-03 .status-badge span {
    font-size: 12px;
  }

/* CSS for section section:Tracking */
.page-cetak-emas-03 #section-tracking {
    max-width: 100%;
    margin: 0 auto;
    background-color: #fffbf4;
    padding: 0 22px 20px;
  }

  .page-cetak-emas-03 .tracking-card {
    background-color: #f6f1e9;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .page-cetak-emas-03 .tracking-title {
    font-size: 14px;
    margin: 0;
  }

  .page-cetak-emas-03 .timeline {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .page-cetak-emas-03 .timeline-item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
  }

  .page-cetak-emas-03 .timeline-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .page-cetak-emas-03 .timeline-icon.active {
    background-color: #e8790c;
  }

  .page-cetak-emas-03 .timeline-icon.inactive {
    background-color: #efe7dc;
  }

  .page-cetak-emas-03 .timeline-icon img {
    width: 10px;
    height: 10px;
  }

  .page-cetak-emas-03 .timeline-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .page-cetak-emas-03 .item-title {
    font-size: 13px;
  }

  .page-cetak-emas-03 .item-desc {
    font-size: 12px;
  }

/* CSS for section section:Actions */
.page-cetak-emas-03 #section-actions {
    max-width: 100%;
    margin: 0 auto;
    background-color: #fffbf4;
    padding: 0 22px 40px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* Ensure it covers the bottom of the screen if content is short */
    min-height: calc(100vh - 600px); 
  }

  .page-cetak-emas-03 .btn {
    width: 100%;
    border: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    transition: opacity 0.2s ease;
  }

  .page-cetak-emas-03 .btn:active {
    opacity: 0.8;
  }

  .page-cetak-emas-03 .btn-primary {
    background-color: #f1b04a;
    color: #1a1410;
    padding: 15px;
    border-radius: 5px;
  }

  .page-cetak-emas-03 .btn-secondary {
    background-color: transparent;
    border: 1px solid #efe7dc;
    color: #514840;
    padding: 13px;
    border-radius: 14px;
  }
`;

function CetakEmas03() {
  const navigate = useNavigate();

  return (
    <div className="page-cetak-emas-03">
      <style>{CetakEmas03Styles}</style>
      <div>
              <section id="section-hero">
                <div className="hero-container">
                  <img src={S3_img_1} alt="Success Illustration" className="hero-image" />
                  <h1 className="hero-title text-dark font-bold">Pesanan Berhasil Dibuat</h1>
                  <p className="hero-subtitle text-medium font-regular">Pembayaran kamu telah kami<br />terima. Pesanan cetak emas kamu sedang diproses.</p>
                </div>
              </section>
              <section id="section-order-details">
                <div className="order-card">
                  <div className="order-row border-bottom">
                    <span className="row-label text-light font-regular">ID Pesanan</span>
                    <span className="row-value text-dark font-bold">#CTK-20260904-0091</span>
                  </div>
                  <div className="order-row border-bottom">
                    <span className="row-label text-light font-regular">Emas Dicetak</span>
                    <span className="row-value text-dark font-bold">1 gram</span>
                  </div>
                  <div className="order-row border-bottom">
                    <span className="row-label text-light font-regular">Total Dibayar</span>
                    <span className="row-value text-dark font-bold">Rp 65.000</span>
                  </div>
                  <div className="order-row">
                    <span className="row-label text-light font-regular">Status</span>
                    <div className="status-badge">
                      <span className="text-success font-semibold">Sedang Diproses</span>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-tracking">
                <div className="tracking-card">
                  <h2 className="tracking-title text-dark font-bold">Status Pesanan</h2>
                  <div className="timeline">
                    {/* Item 1 */}
                    <div className="timeline-item">
                      <div className="timeline-icon active">
                        <img src={S3_img_2} alt="Check" />
                      </div>
                      <div className="timeline-content">
                        <div className="item-title text-dark font-semibold">Pembayaran Diterima</div>
                        <div className="item-desc text-light font-regular">04 Sep 2026, 14:32 WIB</div>
                      </div>
                    </div>
                    {/* Item 2 */}
                    <div className="timeline-item">
                      <div className="timeline-icon active">
                        <img src={S3_img_3} alt="Check" />
                      </div>
                      <div className="timeline-content">
                        <div className="item-title text-dark font-semibold">Emas Sedang Dicetak</div>
                        <div className="item-desc text-light font-regular">Estimasi selesai 3–5 hari kerja</div>
                      </div>
                    </div>
                    {/* Item 3 */}
                    <div className="timeline-item">
                      <div className="timeline-icon inactive" />
                      <div className="timeline-content">
                        <div className="item-title text-light font-semibold">Dikirim ke Alamat Kamu</div>
                        <div className="item-desc text-light font-regular">Estimasi tiba 10–12 Sep 2026</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-actions">
                <button className="btn btn-primary font-bold" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>Kembali ke Beranda</button>
                <button className="btn btn-secondary font-bold" onClick={(e) => { e.preventDefault(); navigate('/rewards/riwayat-lainnya'); }}>Lihat Detail Pesanan</button>
              </section>
            </div>

    </div>
  );
}

const STEP_COMPONENTS = { 1: CetakEmas01, 2: CetakEmas02, 3: CetakEmas03 };

export default function CetakEmas({ step = 1 }) {
  const Step = STEP_COMPONENTS[step] ?? STEP_COMPONENTS[1];
  return <Step />;
}
