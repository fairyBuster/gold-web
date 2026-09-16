/* ============================================================================
   LupaPassword.jsx — single-file implementation of the password-reset wizard.
   All steps of this flow live in this one file; the <LupaPassword step={n} />
   element passed by App.jsx selects the active step. URL per step:
     1 -> /auth/lupa-password
     2 -> /auth/lupa-password-02
     3 -> /auth/lupa-password-03
     4 -> /auth/lupa-password-04
   ============================================================================ */

import { useNavigate, Link } from 'react-router-dom';
import { goBack } from '../../../lib/backNav.js';
import { useEffect, useRef, useState } from 'react';
import img_4 from '../../../assets/images/11_364.svg';
import img_5 from '../../../assets/images/11_358.svg';
import img_6 from '../../../assets/images/11_364.svg';
import img_7 from '../../../assets/images/11_384.svg';
import img_8 from '../../../assets/images/11_384.svg';

/* Step 1 imports (renamed to avoid collisions with other steps) */
import S1_img_1 from '../../../assets/images/156_1523.svg';
import S1_img_2 from '../../../assets/images/e1b6a897bc21b04dbaf80b15b093a845dcebf04d.webp';
import S1_img_3 from '../../../assets/images/11_243.svg';

/* Step 2 imports (renamed to avoid collisions with other steps) */
import S2_img_1 from '../../../assets/images/156_1523.svg';
import S2_img_2 from '../../../assets/images/ea1bb9cef82aba4ecc7496b3f5ea8102b089a13d.webp';

/* Step 3 imports (renamed to avoid collisions with other steps) */
import S3_img_1 from '../../../assets/images/156_1523.svg';
import S3_img_2 from '../../../assets/images/e1b6a897bc21b04dbaf80b15b093a845dcebf04d.webp';
import S3_img_3 from '../../../assets/images/11_358.svg';

/* Step 4 imports (renamed to avoid collisions with other steps) */
import S4_img_1 from '../../../assets/images/7ad23d77f11622cbb0af82a44395f1afe17db1bf.webp';

/* API layer — used by this flow. Step 1 requests the WhatsApp OTP
   (POST /api/auth/request-otp-registered/), step 3 submits the new password
   (POST /api/auth/change-password-otp/). */
import { requestOtpRegistered, changePasswordOtp } from '../../../lib/authApi.js';
import * as lupaPasswordFlow from '../../../lib/lupaPasswordFlow.js';
import { useShowNotif } from '../../../lib/useShowNotif.js';


/* ================= Step 1 — /auth/lupa-password (was LupaPassword.jsx) ================= */

const LupaPassword01Styles = `
/* Scoped styles for LupaPassword — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-lupa-password to isolate this page. */

.page-lupa-password, .page-lupa-password * {
  box-sizing: border-box;
}

.page-lupa-password {
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #fff9f2;
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
}

@media (min-width: 413px) {
  .page-lupa-password {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  }
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-lupa-password .header {
  display: flex;
  align-items: center;
  padding: 22px 20px 16px 20px;
  gap: 14px;
}
.page-lupa-password .back-btn {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background-color: #f6f1e9;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0;
}
.page-lupa-password .back-btn img {
  width: 18px;
  height: 18px;
}
.page-lupa-password .header-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1410;
  margin: 0;
}

/* CSS for section section:Progress */
.page-lupa-password .progress-container {
  display: flex;
  gap: 6px;
  padding: 0 20px 20px 20px;
}
.page-lupa-password .progress-bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background-color: #efe7dc;
}
.page-lupa-password .progress-bar.active {
  background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
}

/* CSS for section section:Hero */
.page-lupa-password .hero-container {
  padding: 4px 24px 0 24px;
  display: flex;
  justify-content: flex-start;
}
.page-lupa-password .hero-image {
  width: 199px;
  height: 214px;
  object-fit: contain;
}

/* CSS for section section:Form */
.page-lupa-password .form-section {
  padding: 0 24px;
}
.page-lupa-password .form-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1410;
  margin: 0 0 10px 0;
}
.page-lupa-password .form-desc {
  font-size: 14px;
  line-height: 1.5;
  color: #514840;
  margin: 0 0 27px 0;
}
.page-lupa-password .input-group {
  display: flex;
  flex-direction: column;
}
.page-lupa-password .input-label {
  font-size: 14px;
  font-weight: 600;
  color: #514840;
  margin-bottom: 8px;
}
.page-lupa-password .input-wrapper {
  display: flex;
  align-items: center;
  background-color: #f6f1e9;
  border-radius: 14px;
  padding: 14px 16px;
  gap: 12px;
}
.page-lupa-password .input-icon {
  width: 20px;
  height: 20px;
}
.page-lupa-password .input-field {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #1a1410;
  outline: none;
}
.page-lupa-password .input-field::placeholder {
  color: #a79c8f;
}

/* CSS for section section:Footer */
.page-lupa-password .footer-section {
  margin-top: auto;
  padding: 24px 24px 28px 24px;
}
.page-lupa-password .submit-btn {
  width: 100%;
  background-color: #f1b04a;
  color: #1a1410;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 5px;
  padding: 15px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
}
.page-lupa-password .submit-btn:hover {
  background-color: #e0a03a;
}
.page-lupa-password .submit-btn:disabled {
  opacity: 0.7;
  cursor: default;
}
`;

/* Field rule for the phone input: the displayed value must always read as a
   local "08..." number — users may type the short form ("8...") or paste the
   international form ("+62 8...", "62 8..."), and it is normalized on every
   change. The API payload is unchanged: handleSubmit still builds `62${digits}`. */
const normalizePhoneInput = (raw) => {
  let digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('62')) digits = digits.slice(2);
  if (!digits.startsWith('0')) digits = `0${digits}`;
  // Force the mobile prefix once a second digit exists ("07..." -> "087...").
  // A lone "0" is left as-is so typing the natural "08..." sequence is not
  // disturbed (otherwise the user's "8" after "0" would build "088").
  if (digits.length >= 2 && digits[1] !== '8') digits = `08${digits.slice(1)}`;
  return digits;
};

function LupaPassword01() {
  const navigate = useNavigate();
  const showNotif = useShowNotif();
  const [phone, setPhone] = useState(normalizePhoneInput(lupaPasswordFlow.get().phone || ''));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    const digits = phone.replace(/\D/g, '').replace(/^0+/, '');
    if (digits.length < 9 || digits.length > 13) {
      showNotif({ title: 'Lengkapi Data', description: 'Masukkan nomor ponsel yang valid.' });
      return;
    }
    setLoading(true);
    try {
      const normalized = `62${digits}`;
      await requestOtpRegistered({ phone: normalized });
      lupaPasswordFlow.save({ phone: normalized });
      navigate('/index/auth/lupa-password-02');
    } catch (err) {
      showNotif({ title: 'Kode Gagal Terkirim', description: err?.message || 'Kode verifikasi gagal dikirim. Periksa koneksi lalu coba lagi.' });
      setLoading(false);
    }
  };

  return (
    <div className="page-lupa-password">
      <style>{LupaPassword01Styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <button className="back-btn" aria-label="Kembali" onClick={(e) => { e.preventDefault(); goBack('/index/auth/login'); }}>
                    <img src={S1_img_1} alt="" />
                  </button>
                  <h1 className="header-title">Lupa Password</h1>
                </header>
              </section>
              <section id="section-progress">
                <div className="progress-container">
                  <div className="progress-bar active" />
                  <div className="progress-bar" />
                  <div className="progress-bar" />
                </div>
              </section>
              <section id="section-hero">
                <div className="hero-container">
                  <img src={S1_img_2} alt="Ilustrasi Lupa Password" className="hero-image" />
                </div>
              </section>
              <section id="section-form" className="form-section">
                <h2 className="form-title">Lupa Kata Sandi?</h2>
                <p className="form-desc">Masukkan nomor ponsel yang terdaftar pada akun Jelajah Emas. Kami akan mengirimkan kode verifikasi untuk mengatur ulang kata sandi Anda.</p>
                <div className="input-group">
                  <label htmlFor="phone-input" className="input-label">Nomor Ponsel</label>
                  <div className="input-wrapper">
                    <img src={S1_img_3} alt="" className="input-icon" aria-hidden="true" />
                    <input
                      type="tel"
                      id="phone-input"
                      placeholder="nomor ponsel Anda"
                      className="input-field"
                      value={phone}
                      disabled={loading}
                      onChange={(e) => setPhone(normalizePhoneInput(e.target.value))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); } }}
                    />
                  </div>
                </div>
              </section>
              <section id="section-footer" className="footer-section">
                <button className="submit-btn" disabled={loading} onClick={(e) => { e.preventDefault(); handleSubmit(); }}>{loading ? 'Mengirim...' : 'Kirim Kode Verifikasi'}</button>
              </section>
            </div>

    </div>
  );
}

/* ================= Step 2 — /auth/lupa-password-02 (was LupaPassword02.jsx) ================= */

const LupaPassword02Styles = `
/* Scoped styles for LupaPassword02 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-lupa-password-02 to isolate this page. */

.page-lupa-password-02 {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #e5e5e5;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.page-lupa-password-02, .page-lupa-password-02 * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:VerificationScreen */
.page-lupa-password-02 .app-container {
  width: 100%;
  max-width: 100%;
  background-color: #fff9f2;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

.page-lupa-password-02 .header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 20px 16px;
}

.page-lupa-password-02 .back-btn {
  width: 38px;
  height: 38px;
  background-color: #f6f1e9;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  padding: 0;
}

.page-lupa-password-02 .back-btn img {
  width: 18px;
  height: 18px;
}

.page-lupa-password-02 .header-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
}

.page-lupa-password-02 .progress-bar {
  display: flex;
  gap: 6px;
  padding: 0 20px 20px;
}

.page-lupa-password-02 .progress-step {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background-color: #efe7dc;
}

.page-lupa-password-02 .progress-step.active {
  background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
}

.page-lupa-password-02 .main-content {
  display: flex;
  flex-direction: column;
  padding: 4px 24px 28px;
  flex-grow: 1;
}

.page-lupa-password-02 .illustration {
  width: 208px;
  height: 190px;
  object-fit: contain;
  margin-bottom: 0;
}

.page-lupa-password-02 .main-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1410;
  margin: 0 0 10px 0;
}

.page-lupa-password-02 .description {
  font-size: 14px;
  color: #514840;
  margin: 0 0 27px 0;
  line-height: 1.5;
}

.page-lupa-password-02 .otp-container {
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
  justify-content: space-between;
}

.page-lupa-password-02 .otp-input {
  width: 42px;
  height: 48px;
  background-color: #f6f1e9;
  border-radius: 12px;
  border: none;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #1a1410;
  outline: none;
}

.page-lupa-password-02 .otp-input:focus {
  border: 2px solid #f1b04a;
}

.page-lupa-password-02 .resend-text {
  font-size: 14px;
  color: #514840;
  margin: 0 0 24px 0;
  text-align: center;
}

.page-lupa-password-02 .resend-link {
  color: #e8790c;
  font-weight: 700;
  cursor: pointer;
}

.page-lupa-password-02 .spacer {
  flex-grow: 1;
  min-height: 40px;
}

.page-lupa-password-02 .verify-btn {
  background-color: #f1b04a;
  color: #1a1410;
  padding: 15px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  width: 100%;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;
}

.page-lupa-password-02 .verify-btn:hover {
  background-color: #e0a03a;
}
.page-lupa-password-02 .resend-link.disabled {
  color: #a79c8f;
  cursor: default;
  font-weight: 600;
}
`;

function LupaPassword02() {
  const navigate = useNavigate();
  const showNotif = useShowNotif();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(59);
  const [resending, setResending] = useState(false);
  const otpRefs = useRef([]);

  const stored = lupaPasswordFlow.get();
  const localDigits = (stored.phone || '').replace(/^62/, '');
  const maskedPhone = localDigits.length >= 8
    ? `+62${localDigits.slice(0, 4)}****${localDigits.slice(-4)}`
    : `+62${localDigits}`;

  // Direct visits / refreshes have no phone number. Restart from step 1.
  useEffect(() => {
    if (!lupaPasswordFlow.get().phone) {
      navigate('/index/auth/lupa-password', { replace: true });
    }
  }, [navigate]);

  // Resend cooldown — "Kirim Ulang" becomes active again after 59 seconds.
  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 6) {
      showNotif({ title: 'Kode Belum Lengkap', description: 'Masukkan 6 digit kode verifikasi.' });
      return;
    }
    lupaPasswordFlow.save({ otp: code });
    navigate('/index/auth/lupa-password-03');
  };

  const handleResend = async () => {
    if (resending || secondsLeft > 0) return;
    setResending(true);
    try {
      await requestOtpRegistered({ phone: lupaPasswordFlow.get().phone });
      setSecondsLeft(59);
      showNotif({
        variant: 'success',
        title: 'Kode Terkirim',
        description: 'Kode verifikasi baru telah dikirim ke WhatsApp kamu.',
      });
    } catch (err) {
      showNotif({
        title: 'Gagal Kirim Ulang',
        description: err?.message || 'Kode verifikasi gagal dikirim ulang. Silakan coba lagi.',
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="page-lupa-password-02">
      <style>{LupaPassword02Styles}</style>
      <section id="verification-screen" className="app-container">
              <header className="header">
                <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/auth/lupa-password'); }}>
                  <img src={S2_img_1} alt="Back Icon" />
                </button>
                <h1 className="header-title">Verifikasi Kode</h1>
              </header>
              <div className="progress-bar">
                <div className="progress-step active" />
                <div className="progress-step active" />
                <div className="progress-step" />
              </div>
              <main className="main-content">
                <img className="illustration" src={S2_img_2} alt="Verification Illustration" />
                <h2 className="main-title">Masukkan Kode</h2>
                <p className="description">Kode verifikasi 6 digit telah dikirim ke {maskedPhone}. Masukkan kode tersebut untuk melanjutkan.</p>
                <div className="otp-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      className="otp-input"
                      maxLength={1}
                      value={digit}
                      aria-label={`Digit ${index + 1}`}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                <p className="resend-text">Tidak menerima kode?{' '}
                  {secondsLeft > 0 ? (
                    <span className="resend-link disabled">Kirim Ulang (00:{String(secondsLeft).padStart(2, '0')})</span>
                  ) : (
                    <span className="resend-link" role="button" tabIndex={0} onClick={handleResend} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleResend(); } }}>{resending ? 'Mengirim...' : 'Kirim Ulang'}</span>
                  )}
                </p>
                <div className="spacer" />
                <button className="verify-btn" onClick={(e) => { e.preventDefault(); handleVerify(); }}>Verifikasi</button>
              </main>
            </section>

    </div>
  );
}

/* ================= Step 3 — /auth/lupa-password-03 (was LupaPassword03.jsx) ================= */

const LupaPassword03Styles = `
/* Scoped styles for LupaPassword03 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-lupa-password-03 to isolate this page. */

.page-lupa-password-03, .page-lupa-password-03 * {
  box-sizing: border-box;
}
.page-lupa-password-03 {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  min-height: 100vh;
  background-color: #fff9f2;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
  width: 100%;
}
.page-lupa-password-03 .main-content {
  padding: 4px 24px 28px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-lupa-password-03 #section-header {
  width: 100%;
}
.page-lupa-password-03 .header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 20px 16px;
}
.page-lupa-password-03 .back-btn {
  width: 38px;
  height: 38px;
  background-color: #f6f1e9;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}
.page-lupa-password-03 .back-btn img {
  width: 18px;
  height: 18px;
}
.page-lupa-password-03 .header-title {
  color: #1a1410;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
.page-lupa-password-03 .progress-container {
  display: flex;
  gap: 6px;
  padding: 0 20px 20px;
}
.page-lupa-password-03 .progress-bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #ffc93c 0%, #e8790c 100%);
}

/* CSS for section section:Hero */
.page-lupa-password-03 #section-hero {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 4px;
}
.page-lupa-password-03 .hero-image {
  width: 199px;
  height: 214px;
  object-fit: contain;
}

/* CSS for section section:Content */
.page-lupa-password-03 .title-margin {
  padding-bottom: 10px;
}
.page-lupa-password-03 .main-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
  line-height: 1.2;
}
.page-lupa-password-03 .desc-margin {
  padding-bottom: 27px;
}
.page-lupa-password-03 .main-desc {
  font-size: 14px;
  color: #514840;
  margin: 0;
  line-height: 1.5;
}

/* CSS for section section:Form */
.page-lupa-password-03 .label-margin {
  padding: 16px 0 8px 0;
}
.page-lupa-password-03 .form-label {
  font-size: 12px;
  font-weight: 700;
  color: #514840;
  display: block;
}
.page-lupa-password-03 .input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #f6f1e9;
  border-radius: 14px;
  padding: 14px 16px;
}
.page-lupa-password-03 .input-icon {
  width: 20px;
  height: 20px;
}
.page-lupa-password-03 .form-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: #1a1410;
  font-family: 'Inter', sans-serif;
  width: 100%;
}
.page-lupa-password-03 .form-input::placeholder {
  color: #a79c8f;
}
.page-lupa-password-03 .icon-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-lupa-password-03 .icon-btn img {
  width: 20px;
  height: 20px;
}
.page-lupa-password-03 .rules-margin {
  padding-top: 16px;
}
.page-lupa-password-03 .validation-rules {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.page-lupa-password-03 .rule-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.page-lupa-password-03 .check-circle {
  width: 16px;
  height: 16px;
  background-color: #3fa66b;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
.page-lupa-password-03 .check-circle img {
  width: 10px;
  height: 10px;
}
.page-lupa-password-03 .rule-text {
  font-size: 12px;
  color: #514840;
}

/* CSS for section section:Footer */
.page-lupa-password-03 #section-footer {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.page-lupa-password-03 .spacer {
  flex: 1;
  min-height: 40px;
}
.page-lupa-password-03 .submit-btn {
  background-color: #f1b04a;
  color: #1a1410;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 5px;
  padding: 15px;
  width: 100%;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  text-align: center;
  transition: background-color 0.2s;
}
.page-lupa-password-03 .submit-btn:hover {
  background-color: #e0a03a;
}
.page-lupa-password-03 .submit-btn:disabled {
  opacity: 0.7;
  cursor: default;
}
`;

function LupaPassword03() {
  const navigate = useNavigate();
  const showNotif = useShowNotif();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Direct visits / refreshes have no verified OTP. Restart from step 1.
  useEffect(() => {
    const flowData = lupaPasswordFlow.get();
    if (!flowData.phone || !flowData.otp) {
      navigate('/index/auth/lupa-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (loading) return;
    if (!oldPassword) {
      showNotif({ title: 'Password Tidak Sesuai', description: 'Masukkan password lama kamu.' });
      return;
    }
    if (newPassword.length < 6) {
      showNotif({ title: 'Password Tidak Sesuai', description: 'Password baru minimal 6 karakter.' });
      return;
    }
    if (!/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      showNotif({ title: 'Password Tidak Sesuai', description: 'Password baru harus kombinasi huruf & angka.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotif({ title: 'Password Tidak Sesuai', description: 'Konfirmasi password tidak sama.' });
      return;
    }
    setLoading(true);
    try {
      const flowData = lupaPasswordFlow.get();
      await changePasswordOtp({
        phone: flowData.phone,
        oldPassword,
        newPassword,
        newPasswordConfirm: confirmPassword,
        otp: flowData.otp,
      });
      lupaPasswordFlow.clear();
      navigate('/index/auth/lupa-password-04');
    } catch (err) {
      showNotif({ title: 'Gagal Mengubah Password', description: err?.message || 'Password gagal diubah. Silakan coba lagi.' });
      setLoading(false);
    }
  };

  return (
    <div className="page-lupa-password-03">
      <style>{LupaPassword03Styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <a href="#" className="back-btn" onClick={(e) => { e.preventDefault(); goBack('/index/auth/lupa-password-02'); }}>
                    <img src={S3_img_1} alt="Back" />
                  </a>
                  <h1 className="header-title">Buat Password Baru</h1>
                </header>
                <div className="progress-container">
                  <div className="progress-bar" />
                  <div className="progress-bar" />
                  <div className="progress-bar" />
                </div>
              </section>
              <main className="main-content">
                <section id="section-hero">
                  <img src={S3_img_2} alt="Illustration" className="hero-image" />
                </section>
                <section id="section-content">
                  <div className="title-margin">
                    <h2 className="main-title">Buat Password Baru</h2>
                  </div>
                  <div className="desc-margin">
                    <p className="main-desc">Buat kata sandi baru untuk akun Anda. Pastikan kata sandi berbeda dari yang pernah digunakan sebelumnya.</p>
                  </div>
                </section>
                <section id="section-form">
                  <div className="label-margin">
                    <label className="form-label">Password Lama</label>
                  </div>
                  <div className="input-container">
                    <img src={img_5} alt="Lock" className="input-icon" />
                    <input
                      type={showOld ? 'text' : 'password'}
                      placeholder="Masukkan password lama"
                      className="form-input"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <button type="button" className="icon-btn" aria-label="Tampilkan password lama" onClick={() => setShowOld((v) => !v)}><img src={img_6} alt="Toggle Visibility" /></button>
                  </div>
                  <div className="label-margin">
                    <label className="form-label">Password Baru</label>
                  </div>
                  <div className="input-container">
                    <img src={S3_img_3} alt="Lock" className="input-icon" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      placeholder="Masukkan password baru"
                      className="form-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button type="button" className="icon-btn" aria-label="Tampilkan password baru" onClick={() => setShowNew((v) => !v)}><img src={img_4} alt="Toggle Visibility" /></button>
                  </div>
                  <div className="label-margin">
                    <label className="form-label">Konfirmasi Password</label>
                  </div>
                  <div className="input-container">
                    <img src={img_5} alt="Lock" className="input-icon" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Ulangi password baru"
                      className="form-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="button" className="icon-btn" aria-label="Tampilkan konfirmasi password" onClick={() => setShowConfirm((v) => !v)}><img src={img_6} alt="Toggle Visibility" /></button>
                  </div>
                  <div className="rules-margin">
                    <ul className="validation-rules">
                      <li className="rule-item">
                        <div className="check-circle">
                          <img src={img_7} alt="Check" />
                        </div>
                        <span className="rule-text">Minimal 6 karakter</span>
                      </li>
                      <li className="rule-item">
                        <div className="check-circle">
                          <img src={img_8} alt="Check" />
                        </div>
                        <span className="rule-text">Kombinasi huruf &amp; angka</span>
                      </li>
                    </ul>
                  </div>
                </section>
                <section id="section-footer">
                  <div className="spacer" />
                  <button className="submit-btn" disabled={loading} onClick={(e) => { e.preventDefault(); handleSubmit(); }}>{loading ? 'Menyimpan...' : 'Simpan Password'}</button>
                </section>
              </main>
            </div>

    </div>
  );
}

/* ================= Step 4 — /auth/lupa-password-04 (was LupaPassword04.jsx) ================= */

const LupaPassword04Styles = `
/* Scoped styles for LupaPassword04 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-lupa-password-04 to isolate this page. */

.page-lupa-password-04 {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  /* Opaque canvas on the root so it stays full-bleed on desktop. */
  background-image: linear-gradient(#fff9f2, #fff9f2);
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.page-lupa-password-04, .page-lupa-password-04 * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Main */
.page-lupa-password-04 .mobile-screen {
    width: 100%;
    max-width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 33px 24px 126px 24px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
    position: relative;
  }

  .page-lupa-password-04 .content-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .page-lupa-password-04 .success-image {
    width: 126px;
    height: 131px;
    object-fit: contain;
    margin-bottom: 0;
  }

  .page-lupa-password-04 .text-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
  }

  .page-lupa-password-04 .heading {
    color: #1a1410;
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 10px 0;
    line-height: 1.25;
  }

  .page-lupa-password-04 .description {
    color: #514840;
    font-size: 14px;
    font-weight: 400;
    margin: 0;
    line-height: 1.5;
    max-width: 330px;
    padding: 0 4px;
  }

  .page-lupa-password-04 .btn-primary {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    background-color: #f1b04a;
    color: #1a1410;
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    border-radius: 5px;
    flex-shrink: 0;
    transition: background-color 0.2s ease;
  }

  .page-lupa-password-04 .btn-primary:hover {
    background-color: #e0a03a;
  }

  @media (max-width: 412px) {
    .page-lupa-password-04 .mobile-screen {
      padding-bottom: 40px;
      box-shadow: none;
      min-height: 100dvh;
    }
  }
`;

function LupaPassword04() {
  return (
    <div className="page-lupa-password-04">
      <style>{LupaPassword04Styles}</style>
      <section id="section-main" className="mobile-screen">
              <div className="content-container">
                <img src={S4_img_1} alt="Success Illustration" className="success-image" />
                <div className="text-container">
                  <h1 className="heading">Password Berhasil Diubah</h1>
                  <p className="description">Kata sandi Anda berhasil diperbarui. Silakan masuk kembali menggunakan kata sandi baru.</p>
                </div>
              </div>
              <Link to="/index/auth/login" className="btn-primary">Kembali ke Login</Link>
            </section>

    </div>
  );
}

const STEP_COMPONENTS = { 1: LupaPassword01, 2: LupaPassword02, 3: LupaPassword03, 4: LupaPassword04 };

export default function LupaPassword({ step = 1 }) {
  const Step = STEP_COMPONENTS[step] ?? STEP_COMPONENTS[1];
  return <Step />;
}
