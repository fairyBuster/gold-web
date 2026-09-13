/* ============================================================================
   TarikDana.jsx — single-file implementation of the gold withdrawal wizard.
   All steps of this flow live in this one file; the <TarikDana step={n} />
   element passed by App.jsx selects the active step. URL per step:
     1 -> /transactions/tarik-dana-01
     2 -> /transactions/tarik-dana-02
     3 -> /transactions/tarik-dana-03
     4 -> /transactions/tarik-dana-04
   Steps 1, 3 and 4 are wired to the live API (account-info, banks and
   /api/withdraw/); step 2 is an "add first bank" page that is skipped
   entirely once the user has a saved bank (step 3 then picks the bank).
   PIN and withdrawal-service selection are intentionally NOT part of the
   flow — both are optional features toggled from the admin withdrawal
   settings.
   ============================================================================ */

import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import NotifCard from '../../../components/NotifCard.jsx';
import img_4 from '../../../assets/images/33_71.svg';

/* Withdrawal API + the cross-step store for the wizard. */
import { getAccountInfo } from '../../../lib/authApi.js';
import { createWithdrawal, getWithdrawSettings, listBanks, listUserBanks } from '../../../lib/withdrawApi.js';
import * as withdrawFlow from '../../../lib/withdrawFlow.js';

/* Step 1 imports (renamed to avoid collisions with other steps) */
import S1_img_1 from '../../../assets/images/91_1307.svg';
import S1_img_2 from '../../../assets/images/56_737.svg';
import S1_img_3 from '../../../assets/images/2fda28c0e5f311c7fab98e8bdc58fe3c951564bf.png';

/* Step 2 imports (renamed to avoid collisions with other steps) */
import S2_img_1 from '../../../assets/images/67_61.svg';
import S2_img_2 from '../../../assets/images/3a72c27da1899801de05252ae1048c69d8c58ce0.png';
import S2_img_3 from '../../../assets/images/56_799.svg';

/* Step 3 imports (renamed to avoid collisions with other steps) */
import S3_img_1 from '../../../assets/images/67_61.svg';
import S3_img_2 from '../../../assets/images/56_799.svg';
import S3_img_3 from '../../../assets/images/33_71.svg';

/* Step 4 imports (renamed to avoid collisions with other steps) */
import S4_img_1 from '../../../assets/images/67_61.svg';
import S4_img_2 from '../../../assets/images/58_873.svg';
import S4_img_3 from '../../../assets/images/4ff45e57bc897e30533b9ea96068fac470c7dbbe.png';


/* ================= shared helpers for the wizard ================= */

/* "Rp 250.000" — the wizard pages render rupiah with a space after "Rp". */
function formatRupiahSpaced(value) {
  return `Rp ${Math.abs(Number(value) || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
}

/* "250.000" — grouped digits for the controlled amount input. */
function formatGroupedAmount(value) {
  return Number(value).toLocaleString('id-ID');
}

/* Parses the controlled input text ("250.000") back into a number. */
function parseAmount(text) {
  const digits = String(text || '').replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

/* Fee estimate — mirrors WithdrawalSerializer: amount × percent/100 + fixed. */
function estimateWithdrawFee(amount, feePercent, feeFixed) {
  const fee = ((Number(amount) || 0) * (Number(feePercent) || 0)) / 100 + (Number(feeFixed) || 0);
  return Math.round(fee * 100) / 100;
}

/* Quick-pick amount chips shown under the input. */
const QUICK_AMOUNTS = [
  { label: 'Rp35rb', value: 35000 },
  { label: 'Rp100rb', value: 100000 },
  { label: 'Rp500rb', value: 500000 },
  { label: 'Rp1jt', value: 1000000 },
];


/* ================= Step 1 — /transactions/tarik-dana-01 (was TarikDana01.jsx) ================= */

const TarikDana01Styles = `
/* Scoped styles for TarikDana01 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-tarik-dana-01 to isolate this page. */

.page-tarik-dana-01 {
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', sans-serif;
  max-width: 100%;
  min-height: 100vh;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 100% 20%, rgba(255, 201, 60, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 80% 80%, rgba(255, 159, 28, 0.15) 0%, transparent 60%);
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  width: 100%;
}

.page-tarik-dana-01, .page-tarik-dana-01 * {
  box-sizing: border-box;
}

.page-tarik-dana-01 button,.page-tarik-dana-01  input {
  font-family: 'Inter', sans-serif;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-tarik-dana-01 #section-header {
  width: 100%;
}
.page-tarik-dana-01 .header-container {
  padding: 20px 0 22px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.page-tarik-dana-01 .top-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 20px;
}
.page-tarik-dana-01 .back-btn {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background-color: #f6f1e9;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;
}
.page-tarik-dana-01 .page-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
}
.page-tarik-dana-01 .progress-bar {
  display: flex;
  gap: 6px;
  padding: 0 20px;
}
.page-tarik-dana-01 .progress-step {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background-color: #efe7dc;
}
.page-tarik-dana-01 .progress-step.active {
  background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
}

/* CSS for section section:Content */
.page-tarik-dana-01 #section-content {
  width: 100%;
  flex: 1;
}
.page-tarik-dana-01 .content-container {
  padding: 0 20px 24px 20px;
  display: flex;
  flex-direction: column;
}
.page-tarik-dana-01 .step-text {
  color: #e8790c;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
}
.page-tarik-dana-01 .main-title {
  color: #1a1410;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  line-height: 1.2;
}
.page-tarik-dana-01 .subtitle {
  color: #514840;
  font-size: 14px;
  margin: 0 0 24px 0;
  line-height: 1.5;
}
.page-tarik-dana-01 .balance-box {
  background-color: #f6f1e9;
  border-radius: 14px;
  padding: 13px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-tarik-dana-01 .balance-label {
  color: #a79c8f;
  font-size: 14px;
}
.page-tarik-dana-01 .balance-amount {
  color: #1a1410;
  font-size: 14px;
  font-weight: 700;
}
.page-tarik-dana-01 .input-container {
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.page-tarik-dana-01 .currency-prefix {
  color: #514840;
  font-size: 24px;
  font-weight: 700;
}
.page-tarik-dana-01 .amount-input {
  border: none;
  outline: none;
  font-size: 24px;
  font-weight: 700;
  color: #a79c8f;
  width: 100%;
  background: transparent;
}
.page-tarik-dana-01 .amount-input:focus {
  color: #1a1410;
}
.page-tarik-dana-01 .min-withdrawal {
  color: #a79c8f;
  font-size: 12px;
  margin-bottom: 22px;
}
.page-tarik-dana-01 .quick-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 26px;
}
.page-tarik-dana-01 .chip {
  background-color: #f6f1e9;
  border: 1px solid transparent;
  border-radius: 20px;
  padding: 10px 16px;
  color: #514840;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.page-tarik-dana-01 .chip.active {
  background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
  color: #1a1410;
}
.page-tarik-dana-01 .info-box {
  background-color: #f6f1e9;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.page-tarik-dana-01 .info-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}
.page-tarik-dana-01 .info-text {
  color: #514840;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
}
.page-tarik-dana-01 .info-text strong {
  color: #1a1410;
}
.page-tarik-dana-01 .error-text {
  color: #e24c4c;
  font-size: 12px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

/* CSS for section section:Footer */
.page-tarik-dana-01 #section-footer {
  width: 100%;
  position: relative;
  margin-top: auto;
}
.page-tarik-dana-01 .footer-container {
  padding: 20px;
  position: relative;
}
.page-tarik-dana-01 .character-img {
  position: absolute;
  right: -10px;
  bottom: 80px;
  width: 135px;
  height: auto;
  z-index: 1;
  pointer-events: none;
}
.page-tarik-dana-01 .button-wrapper {
  position: relative;
  z-index: 2;
}
.page-tarik-dana-01 .submit-btn {
  width: 100%;
  background-color: #f1b04a;
  color: #1a1410;
  font-size: 16px;
  font-weight: 700;
  padding: 16px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
}
`;

function TarikDana01() {
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [settings, setSettings] = useState(null);
  const [userBanks, setUserBanks] = useState([]);
  const [banks, setBanks] = useState([]);
  const [amountText, setAmountText] = useState(() => {
    const stored = Number(withdrawFlow.get().amount) || 0;
    return stored > 0 ? formatGroupedAmount(stored) : '';
  });
  const [error, setError] = useState('');

  // Live data for the step: wallet balance, admin settings, the user's saved
  // banks (min/fee hints) and the public bank metadata. Failures leave the
  // static placeholder values untouched.
  useEffect(() => {
    let active = true;
    Promise.all([getAccountInfo(), getWithdrawSettings(), listUserBanks(), listBanks()])
      .then(([accountData, settingsData, userBanksData, banksData]) => {
        if (!active) return;
        setAccount(accountData || null);
        setSettings(settingsData || null);
        setUserBanks(Array.isArray(userBanksData) ? userBanksData : []);
        setBanks(Array.isArray(banksData) ? banksData : []);
      })
      .catch(() => {
        /* keep the placeholders when the API is unreachable */
      });
    return () => {
      active = false;
    };
  }, []);

  const walletField = settings?.balance_source === 'balance_deposit' ? 'balance_deposit' : 'balance';
  const balance = Number(account?.[walletField]) || 0;
  const allBalance = Math.floor(balance);
  const defaultBank = userBanks.find((item) => item.is_default) || userBanks[0] || null;
  const bankMeta = defaultBank ? banks.find((item) => item.id === defaultBank.bank) : null;
  const minAmount = Number(bankMeta?.min_withdrawal) || 0;
  const maxAmount = Number(bankMeta?.max_withdrawal) || 0;
  const feePercent = Number(defaultBank?.withdrawal_fee) || 0;
  const feeFixed = Number(defaultBank?.withdrawal_fee_fixed) || 0;
  const feeInfo = [
    feePercent > 0 ? `${feePercent}%` : '',
    feeFixed > 0 ? formatRupiahSpaced(feeFixed) : '',
  ].filter(Boolean).join(' + ');
  const minText = bankMeta
    ? (minAmount > 0 ? `Minimal penarikan ${formatRupiahSpaced(minAmount)}` : '')
    : 'Minimal penarikan Rp 50.000';
  const amount = parseAmount(amountText);

  const applyAmount = (value) => {
    setAmountText(value > 0 ? formatGroupedAmount(value) : '');
    setError('');
  };

  const handleAmountChange = (event) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 12);
    setAmountText(digits ? formatGroupedAmount(Number(digits)) : '');
    setError('');
  };

  const handleContinue = () => {
    if (settings && settings.is_active === false) {
      setError('Penarikan sedang dinonaktifkan oleh admin.');
      return;
    }
    if (amount <= 0) {
      setError('Masukkan nominal penarikan.');
      return;
    }
    if (account && amount > balance) {
      setError('Saldo tidak mencukupi.');
      return;
    }
    if (minAmount > 0 && amount < minAmount) {
      setError(`Minimal penarikan ${formatRupiahSpaced(minAmount)}.`);
      return;
    }
    if (maxAmount > 0 && amount > maxAmount) {
      setError(`Maksimal penarikan ${formatRupiahSpaced(maxAmount)}.`);
      return;
    }
    withdrawFlow.save({ amount });
    /* Sudah punya rekening tersimpan? Lewati halaman tambah rekening. */
    navigate(userBanks.length > 0 ? '/transactions/tarik-dana-03' : '/transactions/tarik-dana-02');
  };

  return (
    <div className="page-tarik-dana-01">
      <style>{TarikDana01Styles}</style>
      <div>
              <section id="section-header">
                <header className="header-container">
                  <div className="top-bar">
                    <button className="back-btn" aria-label="Back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                      <img src={S1_img_1} alt="" />
                    </button>
                    <h1 className="page-title">Tarik Dana</h1>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-step active" />
                    <div className="progress-step" />
                    <div className="progress-step" />
                  </div>
                </header>
              </section>
              <section id="section-content">
                <div className="content-container">
                  <div className="step-text">Langkah 1 dari 3</div>
                  <h2 className="main-title">Berapa yang mau ditarik?</h2>
                  <p className="subtitle">Masukkan nominal yang ingin kamu tarik ke rekening bank kamu.</p>
                  <div className="balance-box">
                    <span className="balance-label">Saldo tersedia</span>
                    <span className="balance-amount">{account ? formatRupiahSpaced(balance) : '—'}</span>
                  </div>
                  <div className="input-container">
                    <span className="currency-prefix">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="amount-input"
                      placeholder="0"
                      value={amountText}
                      onChange={handleAmountChange}
                    />
                  </div>
                  {minText ? <div className="min-withdrawal">{minText}</div> : null}
                  <div className="quick-amounts">
                    {QUICK_AMOUNTS.map((item) => (
                      <button
                        key={item.value}
                        className={`chip${amount === item.value ? ' active' : ''}`}
                        onClick={(e) => { e.preventDefault(); applyAmount(item.value); }}
                      >
                        {item.label}
                      </button>
                    ))}
                    <button
                      className={`chip${allBalance > 0 && amount === allBalance ? ' active' : ''}`}
                      onClick={(e) => { e.preventDefault(); applyAmount(allBalance); }}
                    >
                      Semua Saldo
                    </button>
                  </div>
                  <div className="info-box">
                    <img src={S1_img_2} alt="Info" className="info-icon" />
                    {feeInfo ? (
                      <p className="info-text">Biaya admin <strong>{feeInfo}</strong> dari nominal penarikan, diproses dalam 1–24 jam kerja pada jam operasional 08:00–20:00 WIB.</p>
                    ) : (
                      <p className="info-text">Biaya admin <strong>Rp 2.500</strong> berlaku untuk setiap penarikan, diproses dalam 1–24 jam kerja pada jam operasional 08:00–20:00 WIB.</p>
                    )}
                  </div>
                </div>
              </section>
              <section id="section-footer">
                <div className="footer-container">
                  <img src={S1_img_3} alt="Mascot" className="character-img" />
                  <div className="button-wrapper">
                    {error ? <p className="error-text">{error}</p> : null}
                    <button className="submit-btn" onClick={(e) => { e.preventDefault(); handleContinue(); }}>Lanjutkan</button>
                  </div>
                </div>
              </section>
            </div>

    </div>
  );
}

/* ================= Step 2 — /transactions/tarik-dana-02 (was TarikDana02.jsx) ================= */

const TarikDana02Styles = `
/* Scoped styles for TarikDana02 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-tarik-dana-02 to isolate this page. */

.page-tarik-dana-02 {
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', sans-serif;
  max-width: 100%;
  min-height: 100vh;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 80% 20%, rgba(255, 201, 60, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(255, 159, 28, 0.1) 0%, transparent 50%);
  box-shadow: 0px 0px 20px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
}

.page-tarik-dana-02 *,.page-tarik-dana-02  *::before,.page-tarik-dana-02  *::after {
  box-sizing: inherit;
}

.page-tarik-dana-02 button {
  font-family: inherit;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-tarik-dana-02 #section-header {
  width: 100%;
}
.page-tarik-dana-02 .header-container {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 20px 16px 20px;
}
.page-tarik-dana-02 .back-btn {
  background-color: #f6f1e9;
  border: none;
  border-radius: 11px;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;
}
.page-tarik-dana-02 .header-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
}

/* CSS for section section:Progress */
.page-tarik-dana-02 #section-progress {
  width: 100%;
}
.page-tarik-dana-02 .progress-container {
  display: flex;
  gap: 6px;
  padding: 0 20px 22px 20px;
}
.page-tarik-dana-02 .progress-bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
}
.page-tarik-dana-02 .progress-bar.active {
  background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
}
.page-tarik-dana-02 .progress-bar.inactive {
  background-color: #efe7dc;
}

/* CSS for section section:Titles */
.page-tarik-dana-02 #section-titles {
  width: 100%;
}
.page-tarik-dana-02 .titles-container {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}
.page-tarik-dana-02 .step-text {
  color: #e8790c;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
  display: block;
}
.page-tarik-dana-02 .main-title {
  color: #1a1410;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px 0;
}
.page-tarik-dana-02 .subtitle {
  color: #514840;
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}

/* CSS for section section:Illustration */
.page-tarik-dana-02 #section-illustration {
  width: 100%;
}
.page-tarik-dana-02 .illustration-container {
  padding: 24px 20px;
  display: flex;
  justify-content: flex-start;
}
.page-tarik-dana-02 .illustration-container img {
  width: 120px;
  height: auto;
  object-fit: contain;
}

/* CSS for section section:Actions */
.page-tarik-dana-02 #section-actions {
  width: 100%;
}
.page-tarik-dana-02 .actions-container {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.page-tarik-dana-02 .add-account-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background-color: transparent;
  border: 1px dashed rgba(26, 20, 16, 0.25);
  border-radius: 16px;
  cursor: pointer;
  color: #e8790c;
  font-weight: 700;
  font-size: 14px;
  transition: background-color 0.2s;
}
.page-tarik-dana-02 .add-account-btn:hover {
  background-color: rgba(232, 121, 12, 0.05);
}
.page-tarik-dana-02 .info-box {
  background-color: #f6f1e9;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.page-tarik-dana-02 .info-icon {
  padding-top: 2px;
  flex-shrink: 0;
}
.page-tarik-dana-02 .info-text {
  margin: 0;
  color: #514840;
  font-size: 12px;
  line-height: 1.5;
}
.page-tarik-dana-02 .info-text strong {
  font-weight: 700;
  color: #1a1410;
}

/* CSS for section section:Footer */
.page-tarik-dana-02 #section-footer {
  width: 100%;
  margin-top: auto;
}
.page-tarik-dana-02 .footer-container {
  padding: 20px;
  padding-top: 40px;
}
.page-tarik-dana-02 .continue-btn {
  width: 100%;
  background-color: #f1b04a;
  color: #1a1410;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s;
}
.page-tarik-dana-02 .continue-btn:hover {
  opacity: 0.9;
}

/* Shown briefly while checking whether the user already has a saved bank. */
.page-tarik-dana-02 .checking-text {
  padding: 24px 20px;
  margin: 0;
  font-size: 13px;
  color: #8a7a68;
}
`;

function TarikDana02() {
  const navigate = useNavigate();
  /* null = masih memeriksa rekening tersimpan; true/false = hasil cek. */
  const [hasBank, setHasBank] = useState(null);

  /* Halaman ini hanya untuk user yang belum punya rekening tersimpan —
     kalau sudah pernah ikat bank, langsung lompat ke langkah 3. */
  useEffect(() => {
    let active = true;
    listUserBanks()
      .then((data) => {
        if (active) setHasBank(Array.isArray(data) && data.length > 0);
      })
      .catch(() => {
        /* Gagal memeriksa? Tampilkan halaman apa adanya. */
        if (active) setHasBank(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (hasBank === true) {
    return <Navigate to="/transactions/tarik-dana-03" replace />;
  }

  if (hasBank === null) {
    return (
      <div className="page-tarik-dana-02">
        <style>{TarikDana02Styles}</style>
        <p className="checking-text">Memuat rekening...</p>
      </div>
    );
  }

  return (
    <div className="page-tarik-dana-02">
      <style>{TarikDana02Styles}</style>
      <div>
              <section id="section-header">
                <header className="header-container">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={S2_img_1} alt="" />
                  </button>
                  <h1 className="header-title">Tarik Dana</h1>
                </header>
              </section>
              <section id="section-progress">
                <div className="progress-container">
                  <div className="progress-bar active" />
                  <div className="progress-bar active" />
                  <div className="progress-bar inactive" />
                </div>
              </section>
              <section id="section-titles">
                <div className="titles-container">
                  <span className="step-text">Langkah 2 dari 3</span>
                  <h2 className="main-title">Ke rekening mana?</h2>
                  <p className="subtitle">Pilih rekening bank tujuan penarikan dana kamu.</p>
                </div>
              </section>
              <section id="section-illustration">
                <div className="illustration-container">
                  <img src={S2_img_2} alt="Illustration of a person thinking" />
                </div>
              </section>
              <section id="section-actions">
                <div className="actions-container">
                  <button className="add-account-btn" onClick={(e) => { e.preventDefault(); navigate('/profil/kartu-bank-02'); }}>
                    <img src={S2_img_3} alt="" />
                    <span>Tambah Rekening Baru</span>
                  </button>
                  <div className="info-box">
                    <div className="info-icon">
                      <img src={img_4} alt="" />
                    </div>
                    <p className="info-text">
                      Pastikan rekening yang dipilih <strong>aktif dan atas nama sendiri</strong>. Penarikan ke rekening orang lain tidak diperkenankan.
                    </p>
                  </div>
                </div>
              </section>
              <section id="section-footer">
                <div className="footer-container">
                  <button className="continue-btn" onClick={(e) => { e.preventDefault(); navigate('/transactions/tarik-dana-03'); }}>Lanjutkan</button>
                </div>
              </section>
            </div>

    </div>
  );
}

/* ================= Step 3 — /transactions/tarik-dana-03 (was TarikDana03.jsx) ================= */

const TarikDana03Styles = `
/* Scoped styles for TarikDana03 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-tarik-dana-03 to isolate this page. */

.page-tarik-dana-03 {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f5f5f5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  width: 100%;
}

.page-tarik-dana-03, .page-tarik-dana-03 * {
  box-sizing: border-box;
}

.page-tarik-dana-03 .mobile-container {
  max-width: 100%;
  margin: 0 auto;
  background-color: #fffbf4;
  position: relative;
}

/* Desktop/Tablet view enhancements */
/* Full-bleed layout: desktop frame styling removed */

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-tarik-dana-03 .header-bg {
  background: 
    radial-gradient(circle at 80% 0%, rgba(255, 159, 28, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.6) 0%, transparent 40%),
    #fffbf4;
  padding-top: 20px;
}
.page-tarik-dana-03 .top-nav {
  display: flex;
  align-items: center;
  padding: 0 20px 16px 20px;
  gap: 14px;
}
.page-tarik-dana-03 .back-btn {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background-color: #f6f1e9;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}
.page-tarik-dana-03 .back-btn:hover {
  background-color: #efe7dc;
}
.page-tarik-dana-03 .nav-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
}
.page-tarik-dana-03 .progress-container {
  padding: 0 20px 22px 20px;
}
.page-tarik-dana-03 .progress-bar {
  display: flex;
  gap: 6px;
}
.page-tarik-dana-03 .progress-step {
  height: 4px;
  flex: 1;
  border-radius: 2px;
}
.page-tarik-dana-03 .progress-step.active {
  background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
}
.page-tarik-dana-03 .progress-step.inactive {
  background-color: #efe7dc;
}

/* CSS for section section:MainContent */
.page-tarik-dana-03 .main-content {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 220px);
}
@media (min-width: 413px) {
  .page-tarik-dana-03 .main-content {
    min-height: 500px;
  }
}
.page-tarik-dana-03 .step-text {
  color: #e8790c;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
}
.page-tarik-dana-03 .main-title {
  color: #1a1410;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 10px 0;
  line-height: 1.2;
}
.page-tarik-dana-03 .sub-title {
  color: #514840;
  font-size: 14px;
  margin: 0 0 24px 0;
  line-height: 1.5;
}
.page-tarik-dana-03 .bank-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.page-tarik-dana-03 .bank-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.page-tarik-dana-03 .bank-card.selected {
  background-color: rgba(255, 159, 28, 0.06);
  border: 1px solid #e8790c;
}
.page-tarik-dana-03 .bank-card:not(.selected) {
  background-color: #ffffff;
  border: 1px solid #efe7dc;
}
.page-tarik-dana-03 .bank-card:not(.selected):hover {
  border-color: #e8790c;
}
.page-tarik-dana-03 .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
.page-tarik-dana-03 .bank-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #f6f1e9;
  border: 1px solid rgba(26, 20, 16, 0.22);
  flex-shrink: 0;
}
.page-tarik-dana-03 .bank-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.page-tarik-dana-03 .bank-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.page-tarik-dana-03 .bank-name {
  font-size: 14px;
  font-weight: 700;
  color: #1a1410;
}
.page-tarik-dana-03 .badge {
  background-color: rgba(255, 159, 28, 0.14);
  color: #e8790c;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
}
.page-tarik-dana-03 .bank-acc {
  font-size: 14px;
  color: #a79c8f;
  margin-top: 2px;
}
.page-tarik-dana-03 .bank-owner {
  font-size: 12px;
  color: #a79c8f;
}
.page-tarik-dana-03 .bank-status {
  color: #a79c8f;
  font-size: 12px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}
.page-tarik-dana-03 .radio-custom {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
.page-tarik-dana-03 .bank-card.selected .radio-custom {
  border: 1px solid #e8790c;
}
.page-tarik-dana-03 .bank-card:not(.selected) .radio-custom {
  border: 1px solid #a79c8f;
}
.page-tarik-dana-03 .radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e8790c;
}
.page-tarik-dana-03 .add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: 1px dashed rgba(26, 20, 16, 0.25);
  background-color: transparent;
  color: #e8790c;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 24px;
  transition: background-color 0.2s;
}
.page-tarik-dana-03 .add-btn:hover {
  background-color: rgba(255, 159, 28, 0.05);
}
.page-tarik-dana-03 .info-alert {
  background-color: #f6f1e9;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.page-tarik-dana-03 .info-icon {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}
.page-tarik-dana-03 .info-text {
  margin: 0;
  font-size: 12px;
  color: #514840;
  line-height: 1.5;
}
.page-tarik-dana-03 .info-text strong {
  font-weight: 700;
  color: #1a1410;
}
.page-tarik-dana-03 .error-text {
  color: #e24c4c;
  font-size: 12px;
  margin: 0 0 10px 0;
}
.page-tarik-dana-03 .spacer {
  flex: 1;
  min-height: 40px;
}

/* CSS for section section:Footer */
.page-tarik-dana-03 .footer-container {
  padding: 20px;
  padding-bottom: 34px;
}
.page-tarik-dana-03 .btn-primary {
  width: 100%;
  background-color: #f1b04a;
  color: #1a1410;
  font-size: 16px;
  font-weight: 700;
  padding: 16px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.page-tarik-dana-03 .btn-primary:hover {
  background-color: #e5a038;
}
`;

function TarikDana03() {
  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selectedId, setSelectedId] = useState(() => Number(withdrawFlow.get().bankAccountId) || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  /* API load failures render via the shared NotifCard; client validation stays inline. */
  const [loadError, setLoadError] = useState('');

  // Saved bank accounts of the current user (backend returns default first).
  useEffect(() => {
    let active = true;
    Promise.all([listUserBanks(), getWithdrawSettings()])
      .then(([userBanksData, settingsData]) => {
        if (!active) return;
        const list = Array.isArray(userBanksData) ? userBanksData : [];
        setBanks(list);
        setSettings(settingsData || null);
        setSelectedId((current) => {
          if (current && list.some((item) => item.id === current)) return current;
          const preferred = list.find((item) => item.is_default) || list[0];
          return preferred ? preferred.id : null;
        });
      })
      .catch(() => {
        if (active) setLoadError('Gagal memuat rekening.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Whether a bank is mandatory comes from the admin settings; default on.
  const requireBank = settings ? settings.require_bank_account !== false : true;

  const handleContinue = () => {
    if (loading) return;
    if (banks.length === 0) {
      if (requireBank) {
        setError('Tambahkan rekening bank terlebih dahulu.');
        return;
      }
    } else if (!selectedId) {
      setError('Pilih rekening bank terlebih dahulu.');
      return;
    }
    withdrawFlow.save({ bankAccountId: selectedId || null });
    navigate('/transactions/tarik-dana-04');
  };

  return (
    <div className="page-tarik-dana-03">
      <style>{TarikDana03Styles}</style>
      <div>
              <section id="section-header">
                <div className="mobile-container header-bg">
                  <header className="top-nav">
                    <button className="back-btn" aria-label="Kembali" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                      <img src={S3_img_1} alt="Back Icon" />
                    </button>
                    <h1 className="nav-title">Tarik Dana</h1>
                  </header>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-step active" />
                      <div className="progress-step active" />
                      <div className="progress-step inactive" />
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-main">
                <div className="mobile-container main-content">
                  <div className="step-text">Langkah 2 dari 3</div>
                  <h2 className="main-title">Ke rekening mana?</h2>
                  <p className="sub-title">Pilih rekening bank tujuan penarikan dana kamu.</p>
                  <div className="bank-options">
                    {loading ? <p className="bank-status">Memuat rekening...</p> : null}
                    {!loading && loadError ? (
                      <NotifCard variant="error" title="Gagal Memuat Rekening" description={loadError} />
                    ) : null}
                    {!loading && !loadError && banks.length === 0 ? (
                      <p className="bank-status">
                        {requireBank
                          ? 'Belum ada rekening tersimpan. Tambahkan rekening baru untuk melanjutkan.'
                          : 'Kamu belum memiliki rekening tersimpan. Kamu tetap bisa melanjutkan tanpa rekening.'}
                      </p>
                    ) : null}
                    {banks.map((bank) => {
                      const isSelected = bank.id === selectedId;
                      return (
                        <label key={bank.id} className={`bank-card${isSelected ? ' selected' : ''}`}>
                          <input
                            type="radio"
                            name="bank_selection"
                            value={bank.id}
                            checked={isSelected}
                            onChange={() => { setSelectedId(bank.id); setError(''); }}
                            className="sr-only"
                          />
                          {/* <div className="bank-icon" /> */}
                          <div className="bank-info">
                            <div className="bank-header">
                              <span className="bank-name">{bank.bank_name}</span>
                              {bank.is_default ? <span className="badge">Utama</span> : null}
                            </div>
                            <div className="bank-acc">{bank.account_number}</div>
                            <div className="bank-owner">a.n. {bank.account_name}</div>
                          </div>
                          <div className="radio-custom">{isSelected ? <div className="radio-dot" /> : null}</div>
                        </label>
                      );
                    })}
                  </div>
                  <button className="add-btn" onClick={(e) => { e.preventDefault(); navigate('/profil/kartu-bank-02'); }}>
                    <img src={S3_img_2} alt="Add Icon" />
                    <span>Tambah Rekening Baru</span>
                  </button>
                  <div className="info-alert">
                    <img src={S3_img_3} alt="Info Icon" className="info-icon" />
                    <p className="info-text">Pastikan rekening yang dipilih <strong>aktif dan atas nama sendiri</strong>. Penarikan ke rekening orang lain tidak diperkenankan.</p>
                  </div>
                  <div className="spacer" />
                </div>
              </section>
              <section id="section-footer">
                <div className="mobile-container footer-container">
                  {error ? <p className="error-text">{error}</p> : null}
                  <button className="btn-primary" disabled={loading} onClick={(e) => { e.preventDefault(); handleContinue(); }}>Lanjutkan</button>
                </div>
              </section>
            </div>

    </div>
  );
}

/* ================= Step 4 — /transactions/tarik-dana-04 (was TarikDana04.jsx) ================= */

const TarikDana04Styles = `
/* Scoped styles for TarikDana04 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-tarik-dana-04 to isolate this page. */

.page-tarik-dana-04, .page-tarik-dana-04 * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.page-tarik-dana-04 {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  max-width: 100%;
  min-height: 100vh;
  background-color: #fffbf4;
  background-image: radial-gradient(circle at top right, rgba(255, 201, 60, 0.15), transparent 60%);
  box-shadow: 0px 0px 20px rgba(0,0,0,0.05);
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.page-tarik-dana-04 a {
  text-decoration: none;
}
.page-tarik-dana-04 button {
  cursor: pointer;
  font-family: inherit;
}

/* Section wrapper — keeps the flex column chain intact so the main content
   grows and the footer (button) sticks to the bottom of the page. */
.page-tarik-dana-04 .page-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-tarik-dana-04 #section-header {
  padding-top: 20px;
}
.page-tarik-dana-04 .top-nav {
  display: flex;
  align-items: center;
  padding: 0 20px 16px;
  gap: 14px;
}
.page-tarik-dana-04 .back-btn {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background-color: #f6f1e9;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-tarik-dana-04 .page-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
}
.page-tarik-dana-04 .progress-bars {
  display: flex;
  gap: 6px;
  padding: 0 20px 22px;
}
.page-tarik-dana-04 .progress-bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
}

/* CSS for section section:MainContent */
.page-tarik-dana-04 #section-main-content {
  padding: 0 20px;
  flex: 1;
}
.page-tarik-dana-04 .header-info {
  margin-bottom: 24px;
}
.page-tarik-dana-04 .step-text {
  color: #e8790c;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
}
.page-tarik-dana-04 .main-title {
  color: #1a1410;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
}
.page-tarik-dana-04 .desc-text {
  color: #514840;
  font-size: 14px;
  line-height: 1.5;
}

.page-tarik-dana-04 .bank-card {
  background-color: #ffffff;
  border: 1px solid #efe7dc;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.page-tarik-dana-04 .bank-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #f6f1e9;
  border: 1px solid rgba(26, 20, 16, 0.22);
  flex-shrink: 0;
}
.page-tarik-dana-04 .bank-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.page-tarik-dana-04 .bank-name {
  color: #1a1410;
  font-size: 14px;
  font-weight: 700;
}
.page-tarik-dana-04 .bank-acc,.page-tarik-dana-04  .bank-owner {
  color: #a79c8f;
  font-size: 12px;
}
.page-tarik-dana-04 .btn-ubah {
  color: #e8790c;
  font-size: 14px;
  font-weight: 700;
  margin-left: auto;
}

.page-tarik-dana-04 .amount-card {
  background-color: #f6f1e9;
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.page-tarik-dana-04 .amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-tarik-dana-04 .amount-row .label {
  color: #514840;
  font-size: 14px;
}
.page-tarik-dana-04 .amount-row .value {
  color: #1a1410;
  font-size: 14px;
  font-weight: 700;
}
.page-tarik-dana-04 .divider {
  border-top: 1px dashed rgba(26, 20, 16, 0.18);
  margin: 2px 0;
}
.page-tarik-dana-04 .total-row {
  margin-top: 2px;
}
.page-tarik-dana-04 .total-row .label {
  color: #1a1410;
  font-weight: 700;
}
.page-tarik-dana-04 .total-row .value.highlight {
  color: #e8790c;
  font-size: 16px;
}

.page-tarik-dana-04 .info-box {
  background-color: rgba(255, 159, 28, 0.1);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 24px;
}
.page-tarik-dana-04 .info-icon-wrapper {
  padding-top: 2px;
  flex-shrink: 0;
}
.page-tarik-dana-04 .info-text {
  color: #514840;
  font-size: 12px;
  line-height: 1.5;
}
.page-tarik-dana-04 .info-text strong {
  font-weight: 700;
  color: #1a1410;
}

.page-tarik-dana-04 .terms-box {
  margin-bottom: 40px;
}
.page-tarik-dana-04 .terms-text {
  color: #514840;
  font-size: 12px;
  line-height: 1.5;
}
.page-tarik-dana-04 .terms-text a {
  color: #e8790c;
  font-weight: 700;
}

/* CSS for section section:Footer */
.page-tarik-dana-04 #section-footer {
  margin-top: auto;
}
.page-tarik-dana-04 .action-wrapper {
  position: relative;
  padding: 0 20px 16px;
  margin-top: 60px;
}
.page-tarik-dana-04 .character-img {
  position: absolute;
  bottom: 16px;
  left: 9px;
  width: 85px;
  height: 90px;
  z-index: 1;
  pointer-events: none;
}
.page-tarik-dana-04 .btn-confirm {
  width: 100%;
  background-color: #f1b04a;
  color: #1a1410;
  font-size: 16px;
  font-weight: 700;
  padding: 16px;
  border-radius: 14px;
  border: none;
  position: relative;
  z-index: 2;
}
.page-tarik-dana-04 .btn-confirm:disabled {
  opacity: 0.7;
  cursor: default;
}
.page-tarik-dana-04 .error-text {
  color: #e24c4c;
  font-size: 12px;
  margin: 0 0 10px 0;
}
`;

function TarikDana04() {
  const navigate = useNavigate();
  const stored = withdrawFlow.get();
  const amount = Number(stored.amount) || 0;
  const storedBankId = Number(stored.bankAccountId) || null;

  const [banks, setBanks] = useState([]);
  const [settings, setSettings] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  /* API failures (load/submit) render via the shared NotifCard; client checks stay inline. */
  const [notice, setNotice] = useState(null);

  // Live banks + settings so the confirmation card shows the real target
  // account and the exact fee the backend will charge.
  useEffect(() => {
    if (!amount) return undefined;
    let active = true;
    Promise.all([listUserBanks(), getWithdrawSettings()])
      .then(([userBanksData, settingsData]) => {
        if (!active) return;
        const list = Array.isArray(userBanksData) ? userBanksData : [];
        setBanks(list);
        setSettings(settingsData || null);
        if (settingsData?.require_bank_account !== false && list.length === 0) {
          setError('Rekening tujuan tidak ditemukan. Tambahkan rekening terlebih dahulu.');
        }
      })
      .catch(() => {
        if (active) setNotice({ title: 'Gagal Memuat Data Penarikan', description: 'Gagal memuat data penarikan.' });
      });
    return () => {
      active = false;
    };
  }, [amount]);

  // Direct visits without a collected amount start over at step 1.
  if (!amount) {
    return <Navigate to="/transactions/tarik-dana-01" replace />;
  }

  const bank =
    (storedBankId ? banks.find((item) => item.id === storedBankId) : null) ||
    banks.find((item) => item.is_default) ||
    banks[0] ||
    null;
  const requireBank = settings ? settings.require_bank_account !== false : true;
  const fee = bank ? estimateWithdrawFee(amount, bank.withdrawal_fee, bank.withdrawal_fee_fixed) : 0;
  const netAmount = Math.max(amount - fee, 0);

  const handleConfirm = async () => {
    if (submitting) return;
    if (settings && settings.is_active === false) {
      setError('Penarikan sedang dinonaktifkan oleh admin.');
      return;
    }
    if (requireBank && !bank) {
      setError('Rekening tujuan tidak ditemukan. Pilih rekening terlebih dahulu.');
      return;
    }
    setSubmitting(true);
    setError('');
    setNotice(null);
    try {
      // PIN and service (service_id) are intentionally omitted: both are
      // optional and controlled by the admin withdrawal settings.
      const created = await createWithdrawal({ amount, bankAccountId: bank ? bank.id : null });
      withdrawFlow.clear();
      try {
        sessionStorage.setItem('je_withdrawal_id', String(created?.id ?? ''));
      } catch {
        /* storage unavailable */
      }
      navigate('/transactions/loading-penarikan', { state: { withdrawalId: created?.id } });
    } catch (err) {
      setNotice({ title: 'Penarikan Gagal', description: err?.message || 'Penarikan gagal. Silakan coba lagi.' });
      setSubmitting(false);
    }
  };

  return (
    <div className="page-tarik-dana-04">
      <style>{TarikDana04Styles}</style>
      <div className="page-body">
              <section id="section-header">
                <header className="top-nav">
                  <button className="back-btn" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={S4_img_1} alt="Back" />
                  </button>
                  <h1 className="page-title">Tarik Dana</h1>
                </header>
                <div className="progress-bars">
                  <div className="progress-bar active" />
                  <div className="progress-bar active" />
                  <div className="progress-bar active" />
                </div>
              </section>
              <section id="section-main-content">
                <div className="header-info">
                  <div className="step-text">Langkah 3 dari 3</div>
                  <h2 className="main-title">Periksa &amp; konfirmasi</h2>
                  <p className="desc-text">Pastikan semua detail penarikan sudah benar sebelum melanjutkan.</p>
                </div>
                {bank ? (
                  <div className="bank-card">
                    <div className="bank-icon" />
                    <div className="bank-details">
                      <div className="bank-name">{bank.bank_name}</div>
                      <div className="bank-acc">{bank.account_number}</div>
                      <div className="bank-owner">a.n. {bank.account_name}</div>
                    </div>
                    <Link to="/transactions/tarik-dana-03" className="btn-ubah">Ubah</Link>
                  </div>
                ) : null}
                <div className="amount-card">
                  <div className="amount-row">
                    <span className="label">Nominal Penarikan</span>
                    <span className="value">{formatRupiahSpaced(amount)}</span>
                  </div>
                  <div className="amount-row">
                    <span className="label">Biaya Admin</span>
                    <span className="value">{formatRupiahSpaced(fee)}</span>
                  </div>
                  <div className="divider" />
                  <div className="amount-row total-row">
                    <span className="label">Total Diterima</span>
                    <span className="value highlight">{formatRupiahSpaced(netAmount)}</span>
                  </div>
                </div>
                <div className="info-box">
                  <div className="info-icon-wrapper">
                    <img src={S4_img_2} alt="Info" />
                  </div>
                  <p className="info-text">Dana akan diproses dalam <strong>1–2 jam kerja</strong> pada jam operasional (08:00–20:00 WIB). Penarikan tidak dapat dibatalkan setelah dikonfirmasi.</p>
                </div>
                <div className="terms-box">
                  <p className="terms-text">Saya telah memeriksa detail penarikan dan menyetujui <Link to="/support/syarat-dan-ketentuan">Syarat &amp; Ketentuan</Link> penarikan dana.</p>
                </div>
              </section>
              <section id="section-footer">
                <div className="action-wrapper">
                  <img src={S4_img_3} alt="Character" className="character-img" />
                  {error ? <p className="error-text">{error}</p> : null}
                  {notice ? (
                    <NotifCard variant="error" title={notice.title} description={notice.description} onClose={() => setNotice(null)} />
                  ) : null}
                  <button className="btn-confirm" disabled={submitting} onClick={(e) => { e.preventDefault(); handleConfirm(); }}>
                    {submitting ? 'Memproses...' : 'Konfirmasi Penarikan'}
                  </button>
                </div>
              </section>
            </div>

    </div>
  );
}

const STEP_COMPONENTS = { 1: TarikDana01, 2: TarikDana02, 3: TarikDana03, 4: TarikDana04 };

export default function TarikDana({ step = 1 }) {
  const Step = STEP_COMPONENTS[step] ?? STEP_COMPONENTS[1];
  return <Step />;
}
