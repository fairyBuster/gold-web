/* ============================================================================
   KartuBank.jsx — single-file implementation of the bank account management.
   All steps of this flow live in this one file; the <KartuBank step={n} />
   element passed by App.jsx selects the active step. URL per step:
     1 -> /profil/kartu-bank
     2 -> /profil/kartu-bank-02
     3 -> /profil/kartu-bank-03

   Steps 1 and 3 read the saved accounts from GET /api/banks/user/; step 2
   posts the new account to POST /api/banks/user/ (bank chosen via the
   /profil/pilih-bank picker, carried through kartuBankFlow.js).
   ============================================================================ */

import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { goBack } from '../../../lib/backNav.js';
import NotifCard from '../../../components/NotifCard.jsx';
import { useShowNotif } from '../../../lib/useShowNotif.js';
import { createUserBank, listUserBanks } from '../../../lib/banksApi.js';
import * as kartuBankFlow from '../../../lib/kartuBankFlow.js';
import img_1 from '../../../assets/images/67_61.svg';

/* Step artwork. The chip and info icons are shared by several steps, so each
   of those files is imported once under a shared name. */
import S1_img_2 from '../../../assets/images/3a72c27da1899801de05252ae1048c69d8c58ce0.webp';
import S1_img_3 from '../../../assets/images/62_921.svg';
import S2_img_2 from '../../../assets/images/67_79.svg';
import S2_img_3 from '../../../assets/images/67_101.svg';
import S3_img_3 from '../../../assets/images/67_44.svg';
import img_chip from '../../../assets/images/b15f014d3ad142c30cb1cf658c988af94fb62319.png';
import img_info from '../../../assets/images/33_71.svg';

/* 880812345678 -> "88081 ••••". Everything from the 6th digit on is masked,
   whatever the number's length; numbers up to 5 digits are shown as-is. */
function maskAccountNumber(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '—';
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ••••`;
}

/* Nama pemilik disensor setengah (aturan sama dgn TarikDana): kata kedua dst
   hanya huruf awal ("Budi Santoso" -> "Budi S••••••"); nama satu kata disensor
   separuh ("Ahmad" -> "Ahm••"). */
function maskAccountName(value) {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '—';
  if (words.length === 1) {
    const keep = Math.max(1, Math.ceil(words[0].length / 2));
    return words[0].slice(0, keep) + '•'.repeat(words[0].length - keep);
  }
  return words
    .map((word, index) => (index === 0 ? word : word.slice(0, 1) + '•'.repeat(Math.max(0, word.length - 1))))
    .join(' ');
}

/* Steps 1 and 3 show the same saved-accounts data, so they share this hook. */
function useUserBanks() {
  const [userBanks, setUserBanks] = useState(null);
  const [error, setError] = useState('');

  /* Ambil rekening tersimpan milik user. */
  useEffect(() => {
    let active = true;
    listUserBanks()
      .then((data) => { if (active) setUserBanks(Array.isArray(data) ? data : []); })
      .catch((err) => { if (active) setError(err?.message || 'Gagal memuat rekening.'); });
    return () => { active = false; };
  }, []);

  return {
    userBanks,
    error,
    loading: !userBanks && !error,
    hasBanks: Boolean(userBanks && userBanks.length > 0),
  };
}

/* One saved account card. Steps 1 and 3 use identical class names, so each
   page's own scoped stylesheet styles this markup within its own scope. */
function BankCard({ bank }) {
  return (
    <article className="bank-card">
      {!bank.is_default ? <div className="card-glow" /> : null}
      <div className="card-top">
        <span className="bank-name">{bank.bank_name}</span>
        {bank.is_default ? <span className="badge-utama">Utama</span> : null}
      </div>
      <img src={img_chip} alt="Chip" className="chip-icon" />
      <div className="card-bottom">
        <span className="account-number">{maskAccountNumber(bank.account_number)}</span>
        <span className="account-name">a.n. {maskAccountName(bank.account_name)}</span>
      </div>
    </article>
  );
}

/* Horizontally scrollable row of saved account cards. Touch devices swipe
   natively; with a mouse the row is drag-slidable (the scrollbar is hidden),
   snapping onto the nearest card when the drag ends. */
function BankCardList({ banks }) {
  const containerRef = useRef(null);
  const drag = useRef(null);

  const endDrag = () => {
    const el = containerRef.current;
    const state = drag.current;
    if (!el || !state) return;
    drag.current = null;
    el.classList.remove('dragging');
    el.style.scrollSnapType = '';

    /* Settle onto the nearest card so a slide always ends aligned. The far
       end of the row is a resting spot too, so the last card is never stuck
       half-hidden when it cannot be left-aligned. */
    const cards = el.querySelectorAll('.bank-card');
    if (cards.length > 1) {
      const step = cards[1].offsetLeft - cards[0].offsetLeft;
      if (step > 0) {
        const max = el.scrollWidth - el.clientWidth;
        const stepped = Math.max(0, Math.min(Math.round(el.scrollLeft / step) * step, max));
        const target = max - el.scrollLeft < Math.abs(el.scrollLeft - stepped) ? max : stepped;
        el.scrollTo({ left: target, behavior: 'smooth' });
      }
    }
  };

  const onPointerDown = (e) => {
    const el = containerRef.current;
    if (!el || e.pointerType === 'touch' || e.button !== 0) return;
    drag.current = { pointerId: e.pointerId, startX: e.clientX, startScroll: el.scrollLeft };
    el.classList.add('dragging');
    el.style.scrollSnapType = 'none';
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic events have no active pointer — drag still works */
    }
  };

  const onPointerMove = (e) => {
    const el = containerRef.current;
    if (!el || !drag.current || drag.current.pointerId !== e.pointerId) return;
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  };

  return (
    <div
      className={banks.length > 1 ? 'cards-container slidable' : 'cards-container'}
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onDragStart={(e) => e.preventDefault()}
    >
      {banks.map((bank) => (
        <BankCard key={bank.id} bank={bank} />
      ))}
    </div>
  );
}


/* ================= Step 1 — /profil/kartu-bank (was KartuBank.jsx) ================= */

const KartuBank01Styles = `
/* Scoped styles for KartuBank — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-kartu-bank to isolate this page. */

.page-kartu-bank {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  /* Artwork + base moved onto the root so they stay full-bleed on desktop. */
  background-image: radial-gradient(circle at 80% 10%, rgba(241, 176, 74, 0.15) 0%, transparent 40%),
                    radial-gradient(circle at 20% 90%, rgba(241, 176, 74, 0.1) 0%, transparent 40%),
                    linear-gradient(#fffbf4, #fffbf4);
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.page-kartu-bank, .page-kartu-bank * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:App */
.page-kartu-bank #section-app {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .page-kartu-bank .mobile-app-container {
    width: 100%;
    max-width: 100%; /* Based on Figma root frame width */
    min-height: 100vh;
    /* Canvas sits on the page root; no shadow on desktop (see index.css). */
    box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .page-kartu-bank .app-header {
    display: flex;
    align-items: center;
    padding: 20px;
    gap: 14px;
  }

  .page-kartu-bank .btn-back {
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

  .page-kartu-bank .header-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }

  .page-kartu-bank .app-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px 24px;
  }

  .page-kartu-bank .illustration-wrapper {
    width: 120px;
    height: 133px;
    margin-top: 120px; /* Adjusted to match visual spacing */
    margin-bottom: 40px;
  }

  .page-kartu-bank .illustration-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .page-kartu-bank .empty-state-text {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
  }

  .page-kartu-bank .empty-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin: 0 0 8px 0;
  }

  .page-kartu-bank .empty-subtitle {
    font-size: 14px;
    color: #a79c8f;
    line-height: 1.5;
    margin: 0;
    max-width: 280px;
  }

  .page-kartu-bank .btn-add-account {
    background-color: #f1b04a;
    color: #1a1410;
    font-size: 14px;
    font-weight: 700;
    border: none;
    border-radius: 14px;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    max-width: 240px;
    cursor: pointer;
    margin-bottom: 48px;
    transition: opacity 0.2s;
  }

  .page-kartu-bank .btn-add-account:hover {
    opacity: 0.9;
  }

  .page-kartu-bank .info-card {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
  }

  .page-kartu-bank .info-icon {
    flex-shrink: 0;
    margin-top: 2px;
    display: flex;
  }

  .page-kartu-bank .info-text {
    font-size: 12px;
    color: #1a1410;
    line-height: 1.5;
    margin: 0;
    text-align: left;
  }

  .page-kartu-bank .status-text {
    margin-top: 120px;
    font-size: 14px;
    color: #a79c8f;
    text-align: center;
  }

  .page-kartu-bank .cards-container {
    display: flex;
    gap: 14px;
    /* Sits centered under the heading while the cards fit;
       max-width keeps the row scrollable from the left once they overflow. */
    width: fit-content;
    max-width: 100%;
    margin: 0 auto;
    padding: 4px 0 16px 0;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    scroll-snap-type: x mandatory;
  }

  /* Grab affordance only when the row actually has cards to slide through. */
  .page-kartu-bank .cards-container.slidable {
    cursor: grab;
  }

  .page-kartu-bank .cards-container.dragging {
    cursor: grabbing;
    user-select: none;
    -webkit-user-select: none;
  }

  .page-kartu-bank .cards-container::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }

  .page-kartu-bank .bank-card {
    width: 260px;
    height: 150px;
    flex-shrink: 0;
    border-radius: 18px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    background: radial-gradient(circle at 41.6% 43.7%, #241c16 0%, #1a1410 55%, #120d09 100%);
    scroll-snap-align: start;
  }

  .page-kartu-bank .card-glow {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 120px;
    height: 120px;
    border-radius: 60px;
    background: radial-gradient(circle, rgba(255,201,60,1) 0%, rgba(232,121,12,1) 70%, rgba(232,121,12,0) 78%);
    opacity: 0.55;
    z-index: 0;
  }

  .page-kartu-bank .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    z-index: 1;
  }

  .page-kartu-bank .bank-name {
    font-size: 14px;
    font-weight: 700;
    color: #fff9f2;
  }

  .page-kartu-bank .badge-utama {
    background-color: rgba(255, 249, 242, 0.15);
    color: #fff9f2;
    font-size: 10px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
  }

  .page-kartu-bank .chip-icon {
    width: 35px;
    height: 35px;
    margin-top: 14px;
    position: relative;
    z-index: 1;
  }

  .page-kartu-bank .card-bottom {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    z-index: 1;
  }

  .page-kartu-bank .account-number {
    font-size: 14px;
    font-weight: 700;
    color: #fff9f2;
    letter-spacing: 1px;
  }

  .page-kartu-bank .account-name {
    font-size: 10px;
    color: rgba(255, 249, 242, 0.55);
  }
`;

function KartuBank01() {
  const navigate = useNavigate();
  const { userBanks, error, loading, hasBanks } = useUserBanks();

  return (
    <div className="page-kartu-bank">
      <style>{KartuBank01Styles}</style>
      <section id="section-app">
        <div className="mobile-app-container">
          <header className="app-header">
            <button className="btn-back" aria-label="Kembali" onClick={(e) => { e.preventDefault(); goBack('/index/profil'); }}>
              <img src={img_1} alt="" />
            </button>
            <h1 className="header-title">Rekening Bank</h1>
          </header>
          <main className="app-content">
            {loading ? <p className="status-text">Memuat rekening...</p> : null}
            {error ? <NotifCard variant="error" title="Gagal Memuat Rekening" description={error} /> : null}
            {!loading && !error && !hasBanks ? (
              <>
                <div className="illustration-wrapper">
                  <img src={S1_img_2} alt="Ilustrasi belum ada rekening" />
                </div>
                <div className="empty-state-text">
                  <h2 className="empty-title">Belum Ada Rekening Tersimpan</h2>
                  <p className="empty-subtitle">Tambahkan rekening bank kamu untuk mempercepat proses penarikan dana ke depannya.</p>
                </div>
              </>
            ) : null}
            {hasBanks ? (
              <>
                <div className="empty-state-text">
                  <h2 className="empty-title">Rekening Tersimpan</h2>
                  <p className="empty-subtitle">Geser untuk lihat semua rekening kamu.</p>
                </div>
                <BankCardList banks={userBanks} />
              </>
            ) : null}
            {!loading && !error ? (
              <>
                <button className="btn-add-account" onClick={(e) => { e.preventDefault(); navigate('/index/profil/kartu-bank-02'); }}>
                  <img src={S1_img_3} alt="" />
                  <span>Tambah Rekening Baru</span>
                </button>
                <div className="info-card">
                  <div className="info-icon">
                    <img src={img_info} alt="Info" />
                  </div>
                  <p className="info-text">Rekening yang ditambahkan harus <strong>atas nama sendiri</strong> dan akan diverifikasi otomatis.</p>
                </div>
              </>
            ) : null}
          </main>
        </div>
      </section>
    </div>
  );
}

/* ================= Step 2 — /profil/kartu-bank-02 (was KartuBank02.jsx) ================= */

const KartuBank02Styles = `
/* Scoped styles for KartuBank02 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-kartu-bank-02 to isolate this page. */

.page-kartu-bank-02 {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(76.92% 178.57% at 0% -128.57%, rgba(255, 201, 60, 0.28) 0%, rgba(255, 201, 60, 0) 70%),
    radial-gradient(111.11% 142.86% at 25.56% 24.29%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 70%),
    radial-gradient(90.91% 125% at -40.91% 50%, rgba(255, 159, 28, 0.38) 0%, rgba(255, 159, 28, 0) 70%);
  background-repeat: no-repeat;
  min-height: 100vh;
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  display: flex;
  flex-direction: column;
  width: 100%;
}

.page-kartu-bank-02, .page-kartu-bank-02 * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-kartu-bank-02 #section-header {
    position: relative;
    z-index: 1;
  }
  .page-kartu-bank-02 .site-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 20px 18px 20px;
  }
  .page-kartu-bank-02 .back-button {
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0;
  }
  .page-kartu-bank-02 .page-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }

/* CSS for section section:Form */
.page-kartu-bank-02 #section-form {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .page-kartu-bank-02 .form-container {
    padding: 0 20px 24px 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .page-kartu-bank-02 .header-text {
    margin-bottom: 16px;
  }
  .page-kartu-bank-02 .header-text h2 {
    font-size: 14px;
    font-weight: 700;
    color: #1a1410;
    margin: 0 0 4px 0;
  }
  .page-kartu-bank-02 .header-text p {
    font-size: 12px;
    color: #a79c8f;
    margin: 0;
    line-height: 1.4;
  }
  .page-kartu-bank-02 .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }
  .page-kartu-bank-02 .form-group label {
    font-size: 12px;
    font-weight: 600;
    color: #514840;
  }
  .page-kartu-bank-02 .input-box {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    min-height: 48px;
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
    text-align: left;
  }
  .page-kartu-bank-02 .input-box.dropdown {
    justify-content: space-between;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .page-kartu-bank-02 .input-box.dropdown:active {
    background-color: #ebe4d8;
  }
  .page-kartu-bank-02 .input-box .value {
    font-size: 14px;
    color: #1a1410;
  }
  .page-kartu-bank-02 .input-box .placeholder {
    font-size: 14px;
    color: #a79c8f;
  }
  .page-kartu-bank-02 .info-box {
    background-color: rgba(63, 166, 107, 0.1);
    border-radius: 14px;
    padding: 16px 14px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin-top: 2px;
  }
  .page-kartu-bank-02 .info-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  .page-kartu-bank-02 .info-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .page-kartu-bank-02 .info-title {
    font-size: 12px;
    font-weight: 600;
    color: #3fa66b;
  }
  .page-kartu-bank-02 .info-desc {
    font-size: 12px;
    color: #514840;
    margin: 0;
    line-height: 1.4;
  }
  .page-kartu-bank-02 .divider-container {
    padding: 22px 0;
  }
  .page-kartu-bank-02 .divider {
    border: none;
    height: 1px;
    background-color: #efe7dc;
    margin: 0;
  }
  .page-kartu-bank-02 .toggle-card {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-kartu-bank-02 .card-icon {
    width: 35px;
    height: 35px;
    border-radius: 4px;
    object-fit: cover;
  }
  .page-kartu-bank-02 .card-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .page-kartu-bank-02 .card-text h3 {
    font-size: 12px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }
  .page-kartu-bank-02 .card-text p {
    font-size: 10px;
    color: #a79c8f;
    margin: 0;
    line-height: 1.3;
  }
  .page-kartu-bank-02 .toggle-switch {
    width: 42px;
    height: 24px;
    background-color: #efe7dc;
    border-radius: 20px;
    padding: 3px;
    display: flex;
    align-items: center;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .page-kartu-bank-02 .toggle-switch.on {
    background-color: #f1b04a;
  }
  .page-kartu-bank-02 .toggle-thumb {
    width: 18px;
    height: 18px;
    background-color: #ffffff;
    border-radius: 50%;
    box-shadow: 0px 1px 3px 0px rgba(26, 20, 16, 0.2);
    transition: transform 0.2s ease;
  }
  .page-kartu-bank-02 .toggle-switch.on .toggle-thumb {
    transform: translateX(18px);
  }
  .page-kartu-bank-02 .input-field {
    border: none;
    background: transparent;
    width: 100%;
    font-size: 14px;
    color: #1a1410;
    font-family: inherit;
    outline: none;
    padding: 0;
  }
  .page-kartu-bank-02 .input-field::placeholder {
    color: #a79c8f;
  }
  .page-kartu-bank-02 .submit-button:disabled {
    opacity: 0.7;
    cursor: default;
  }
  .page-kartu-bank-02 .spacer {
    height: 105px;
  }
  .page-kartu-bank-02 .disclaimer {
    font-size: 10px;
    color: #a79c8f;
    text-align: center;
    line-height: 1.5;
    margin: 0 0 24px 0;
    padding: 0 4px;
  }
  .page-kartu-bank-02 .submit-button {
    background-color: #f1b04a;
    color: #1a1410;
    font-size: 14px;
    font-weight: 700;
    border: none;
    border-radius: 14px;
    padding: 15px;
    width: 100%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

function KartuBank02() {
  const navigate = useNavigate();
  const { state } = useLocation();

  /* Bank pilihan dari halaman Pilih Bank (via kartuBankFlow); fallback ke state navigasi lama. */
  const stored = kartuBankFlow.get();
  const bankId = stored.bankId ?? null;
  const bankName = stored.bankName || state?.bank || '';

  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const showNotif = useShowNotif();

  /* Validasi ringan di klien; backend tetap jadi penentu akhir. */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const digits = accountNumber.replace(/\D/g, '');
    if (!bankId) { showNotif({ title: 'Lengkapi Data', description: 'Pilih bank terlebih dahulu.' }); return; }
    if (digits.length < 6) { showNotif({ title: 'Lengkapi Data', description: 'Nomor rekening minimal 6 digit.' }); return; }
    if (!accountName.trim()) { showNotif({ title: 'Lengkapi Data', description: 'Masukkan nama pemilik rekening.' }); return; }

    setSubmitting(true);
    try {
      await createUserBank({
        bankId,
        accountName: accountName.trim(),
        accountNumber: digits,
        phone: '',
        isDefault,
      });
      kartuBankFlow.clear();
      navigate('/index/profil/kartu-bank');
    } catch (err) {
      showNotif({
        title: 'Gagal Menyimpan Rekening',
        description: err?.message || 'Gagal menyimpan rekening. Silakan coba lagi.',
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="page-kartu-bank-02">
      <style>{KartuBank02Styles}</style>
      <section id="section-header">
        <header className="site-header">
          <button className="back-button" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/profil/kartu-bank'); }}>
            <img src={img_1} alt="Back" />
          </button>
          <h1 className="page-title">Tambah Rekening Bank</h1>
        </header>
      </section>
      <section id="section-form">
        <div className="form-container">
          <div className="header-text">
            <h2>Detail Rekening</h2>
            <p>Tambahkan rekening bank atas nama sendiri untuk keperluan penarikan dana.</p>
          </div>
          <div className="form-group">
            <label>Pilih Bank</label>
            <button
              type="button"
              className="input-box dropdown"
              onClick={() => navigate('/index/profil/pilih-bank')}
            >
              <span className={bankName ? 'value' : 'placeholder'}>{bankName || 'Pilih bank'}</span>
              <img src={S2_img_2} alt="Dropdown" />
            </button>
          </div>
          <div className="form-group">
            <label>Nomor Rekening</label>
            <div className="input-box">
              <input
                type="text"
                className="input-field"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Masukkan nomor rekening"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Nama Pemilik Rekening</label>
            <div className="input-box">
              <input
                type="text"
                className="input-field"
                autoComplete="off"
                maxLength={100}
                placeholder="Sesuai nama di buku tabungan"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>
            <div className="info-box">
              <img src={S2_img_3} alt="Info" className="info-icon" />
              <div className="info-content">
                <span className="info-title">Nama sesuai catatan bank</span>
                <p className="info-desc">Pastikan nama yang kamu masukkan sama persis dengan nama pemilik rekening di bank.</p>
              </div>
            </div>
          </div>
          <div className="divider-container">
            <hr className="divider" />
          </div>
          <div className="toggle-card">
            <img src={img_chip} alt="Chip" className="card-icon" />
            <div className="card-text">
              <h3>Jadikan Rekening Utama</h3>
              <p>Rekening ini akan dipakai sebagai default saat penarikan dana.</p>
            </div>
            <button
              type="button"
              className={`toggle-switch${isDefault ? ' on' : ''}`}
              aria-pressed={isDefault}
              aria-label="Jadikan Rekening Utama"
              onClick={() => setIsDefault((v) => !v)}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
          <div className="spacer" />
          <p className="disclaimer">
            Demi keamanan akun, pastikan rekening yang didaftarkan benar milik kamu sendiri. Penggunaan rekening atas nama orang lain dapat memicu proses verifikasi tambahan atau pemblokiran sementara sesuai kebijakan platform.
          </p>
          <button className="submit-button" disabled={submitting} onClick={handleSubmit}>
            {submitting ? 'Menyimpan...' : 'Simpan Rekening'}
          </button>
        </div>
      </section>
    </div>
  );
}

/* ================= Step 3 — /profil/kartu-bank-03 (was KartuBank03.jsx) ================= */

const KartuBank03Styles = `
/* Scoped styles for KartuBank03 — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-kartu-bank-03 to isolate this page. */

.page-kartu-bank-03, .page-kartu-bank-03 * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-kartu-bank-03 {
  background-color: #f0f0f0;
  min-height: 100vh;
  width: 100%;
}

.page-kartu-bank-03 {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  max-width: 100%;
  min-height: 100vh;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 80% 10%, rgba(255, 201, 60, 0.2) 0%, transparent 40%),
    radial-gradient(circle at 100% 30%, rgba(255, 159, 28, 0.15) 0%, transparent 50%);
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  position: relative;
  overflow-x: hidden;
}

.page-kartu-bank-03 button {
  font-family: inherit;
  cursor: pointer;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-kartu-bank-03 .app-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px;
  }
  .page-kartu-bank-03 .back-btn {
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s;
  }
  .page-kartu-bank-03 .back-btn:active {
    background-color: #e8e2d8;
  }
  .page-kartu-bank-03 .header-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
  }

/* CSS for section section:SavedAccounts */
.page-kartu-bank-03 .saved-accounts-section {
    padding-bottom: 20px;
  }
  .page-kartu-bank-03 .section-header {
    padding: 0 20px;
    margin-bottom: 16px;
  }
  .page-kartu-bank-03 .section-header h2 {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin-bottom: 4px;
  }
  .page-kartu-bank-03 .section-header p {
    font-size: 12px;
    color: #a79c8f;
  }
  .page-kartu-bank-03 .cards-container {
    display: flex;
    gap: 14px;
    /* Sits centered under the heading while the cards fit;
       max-width keeps the row scrollable from the left once they overflow. */
    width: fit-content;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 20px;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    scroll-snap-type: x mandatory;
    /* Pairs with the row padding so snapped cards keep the side gutter. */
    scroll-padding-left: 20px;
  }

  /* Grab affordance only when the row actually has cards to slide through. */
  .page-kartu-bank-03 .cards-container.slidable {
    cursor: grab;
  }

  .page-kartu-bank-03 .cards-container.dragging {
    cursor: grabbing;
    user-select: none;
    -webkit-user-select: none;
  }
  .page-kartu-bank-03 .cards-container::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }
  .page-kartu-bank-03 .bank-card {
    width: 260px;
    height: 150px;
    flex-shrink: 0;
    border-radius: 18px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    background: radial-gradient(circle at 41.6% 43.7%, #241c16 0%, #1a1410 55%, #120d09 100%);
    scroll-snap-align: start;
  }
  .page-kartu-bank-03 .card-glow {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 120px;
    height: 120px;
    border-radius: 60px;
    background: radial-gradient(circle, rgba(255,201,60,1) 0%, rgba(232,121,12,1) 70%, rgba(232,121,12,0) 78%);
    opacity: 0.55;
    z-index: 0;
  }
  .page-kartu-bank-03 .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    z-index: 1;
  }
  .page-kartu-bank-03 .bank-name {
    font-size: 14px;
    font-weight: 700;
    color: #fff9f2;
  }
  .page-kartu-bank-03 .badge-utama {
    background-color: rgba(255, 249, 242, 0.15);
    color: #fff9f2;
    font-size: 10px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
  }
  .page-kartu-bank-03 .chip-icon {
    width: 35px;
    height: 35px;
    margin-top: 14px;
    position: relative;
    z-index: 1;
  }
  .page-kartu-bank-03 .card-bottom {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    z-index: 1;
  }
  .page-kartu-bank-03 .account-number {
    font-size: 14px;
    font-weight: 700;
    color: #fff9f2;
    letter-spacing: 1px;
  }
  .page-kartu-bank-03 .account-name {
    font-size: 10px;
    color: rgba(255, 249, 242, 0.55);
  }

/* CSS for section section:AddAccount */
.page-kartu-bank-03 .add-account-section {
    padding: 0 20px;
    margin-top: 2px;
  }
  .page-kartu-bank-03 .add-account-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 15px;
    background-color: transparent;
    border: 1px dashed rgba(26, 20, 16, 0.25);
    border-radius: 16px;
    transition: background-color 0.2s;
  }
  .page-kartu-bank-03 .add-account-btn:active {
    background-color: rgba(0,0,0,0.02);
  }
  .page-kartu-bank-03 .add-account-btn span {
    color: #e8790c;
    font-size: 14px;
    font-weight: 600;
  }

/* CSS for section section:Info */
.page-kartu-bank-03 .info-section {
    padding: 0 20px;
    margin-top: 24px;
  }
  .page-kartu-bank-03 .info-box {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .page-kartu-bank-03 .info-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .page-kartu-bank-03 .info-text {
    font-size: 12px;
    color: #1a1410;
    line-height: 1.5;
  }
  .page-kartu-bank-03 .info-text strong {
    font-weight: 700;
  }
  .page-kartu-bank-03 .status-text {
    padding: 0 20px;
    font-size: 14px;
    color: #a79c8f;
  }
`;

function KartuBank03() {
  const navigate = useNavigate();
  const { userBanks, error, loading, hasBanks } = useUserBanks();

  return (
    <div className="page-kartu-bank-03">
      <style>{KartuBank03Styles}</style>
      <section id="section-header">
        <header className="app-header">
          <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/profil/kartu-bank-02'); }}>
            <img src={img_1} alt="" />
          </button>
          <h1 className="header-title">Rekening Bank</h1>
        </header>
      </section>
      <section id="section-saved-accounts" className="saved-accounts-section">
        <div className="section-header">
          <h2>Rekening Tersimpan</h2>
          <p>Geser untuk lihat semua rekening kamu.</p>
        </div>
        {loading ? <p className="status-text">Memuat rekening...</p> : null}
        {error ? <NotifCard variant="error" title="Gagal Memuat Rekening" description={error} /> : null}
        {!loading && !error && !hasBanks ? <p className="status-text">Belum ada rekening tersimpan.</p> : null}
        {hasBanks ? <BankCardList banks={userBanks} /> : null}
      </section>
      <section id="section-add-account" className="add-account-section">
        <button className="add-account-btn" onClick={(e) => { e.preventDefault(); navigate('/index/profil/kartu-bank-02'); }}>
          <img src={S3_img_3} alt="" />
          <span>Tambah Rekening Baru</span>
        </button>
      </section>
      <section id="section-info" className="info-section">
        <div className="info-box">
          <img src={img_info} alt="Info" className="info-icon" />
          <p className="info-text">
            Rekening yang ditambahkan harus <strong>atas nama sendiri</strong> dan akan diverifikasi otomatis.
          </p>
        </div>
      </section>
    </div>
  );
}

const STEP_COMPONENTS = { 1: KartuBank01, 2: KartuBank02, 3: KartuBank03 };

export default function KartuBank({ step = 1 }) {
  const Step = STEP_COMPONENTS[step] ?? STEP_COMPONENTS[1];
  return <Step />;
}
