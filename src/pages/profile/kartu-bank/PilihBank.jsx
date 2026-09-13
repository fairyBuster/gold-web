/* ============================================================================
   PilihBank.jsx — bank picker for the "Tambah Rekening Bank" flow.
   Reads the active bank directory from GET /api/banks/ and stores the pick
   in kartuBankFlow so the form (/profil/kartu-bank-02) can read it.
   The "Rekening Bank" / "E-Wallet" tabs split the directory by its
   `category` field (BANK/EWALLET), which admins manage from the admin menu.
   ============================================================================ */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotifCard from '../../../components/NotifCard.jsx';
import img_1 from '../../../assets/images/91_1307.svg';
import img_2 from '../../../assets/images/91_1320.svg';
import { listBanks } from '../../../lib/banksApi.js';
import * as kartuBankFlow from '../../../lib/kartuBankFlow.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for PilihBank — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-pilih-bank to isolate this page. */

.page-pilih-bank, .page-pilih-bank * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.page-pilih-bank {
    font-family: 'Inter', sans-serif;
    background-color: #fffbf4;
    display: flex;
    justify-content: center;
    min-height: 100vh;
  width: 100%;
}

.page-pilih-bank .app-container {
    width: 100%;
    max-width: 100%;
    min-height: 100vh;
    background-color: #fffbf4;
    /* Approximating the warm glow from the design */
    background-image: radial-gradient(circle at 80% 120%, rgba(255, 200, 100, 0.3) 0%, rgba(255, 251, 244, 0) 60%);
    box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
    position: relative;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
}

.page-pilih-bank button {
    font-family: inherit;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-pilih-bank #section-header .app-container {
        min-height: auto;
        box-shadow: none;
        background-image: none;
        background-color: transparent;
    }
    .page-pilih-bank .header-container {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 20px 20px 16px 20px;
    }
    .page-pilih-bank .back-button {
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
    .page-pilih-bank .back-button:hover {
        background-color: #ebe4d8;
    }
    .page-pilih-bank .page-title {
        font-size: 16px;
        font-weight: 700;
        color: #1a1410;
        margin: 0;
        line-height: 1.2;
    }

/* CSS for section section:Tabs */
.page-pilih-bank #section-tabs .app-container {
        min-height: auto;
        box-shadow: none;
        background-image: none;
        background-color: transparent;
    }
    .page-pilih-bank .tabs-wrapper {
        display: flex;
        gap: 8px;
        padding: 0 20px 16px 20px;
    }
    .page-pilih-bank .tab-btn {
        flex: 1;
        height: 38px;
        border-radius: 12px;
        border: none;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s ease;
    }
    .page-pilih-bank .tab-btn.active {
        background-color: #1a1410;
        color: #fff9f2;
    }
    .page-pilih-bank .tab-btn:not(.active) {
        background-color: #f6f1e9;
        color: #514840;
    }
    .page-pilih-bank .tab-btn:not(.active):hover {
        background-color: #ebe4d8;
    }

/* CSS for section section:Search */
.page-pilih-bank #section-search .app-container {
        min-height: auto;
        box-shadow: none;
        background-image: none;
        background-color: transparent;
    }
    .page-pilih-bank .search-wrapper {
        padding: 0 20px 18px 20px;
    }
    .page-pilih-bank .search-input-container {
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: #f6f1e9;
        border-radius: 14px;
        padding: 12px 14px;
    }
    .page-pilih-bank .search-icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
    }
    .page-pilih-bank .search-input {
        border: none;
        background: transparent;
        width: 100%;
        font-size: 14px;
        color: #1a1410;
        outline: none;
        font-family: inherit;
    }
    .page-pilih-bank .search-input::placeholder {
        color: #a79c8f;
    }

/* CSS for section section:BankList */
.page-pilih-bank #section-bank-list .app-container {
        /* This container extends to the bottom, so we keep the background styles from global */
        box-shadow: none; /* Remove shadow for inner sections to avoid stacking */
        flex: 1;
    }
    .page-pilih-bank .bank-list {
        list-style: none;
        padding: 0 20px;
        margin: 0;
        display: flex;
        flex-direction: column;
    }
    .page-pilih-bank .bank-item {
        width: 100%;
        padding: 16px 2px;
        background: none;
        border: none;
        border-top: 1px solid #efe7dc;
        color: #1a1410;
        font-size: 14px;
        font-weight: 500;
        font-family: inherit;
        text-align: left;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .page-pilih-bank .bank-item:hover {
        background-color: rgba(246, 241, 233, 0.5);
    }
    .page-pilih-bank .bank-empty {
        padding: 16px 2px;
        color: #a79c8f;
        font-size: 14px;
    }
`;

export default function PilihBank() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('BANK');
  const [banks, setBanks] = useState(null);
  const [error, setError] = useState('');

  /* Ambil daftar bank aktif dari API. */
  useEffect(() => {
    let active = true;
    listBanks()
      .then((data) => { if (active) setBanks(Array.isArray(data) ? data : []); })
      .catch((err) => { if (active) setError(err?.message || 'Gagal memuat daftar bank.'); });
    return () => { active = false; };
  }, []);

  const keyword = query.trim().toLowerCase();
  const filteredBanks = (banks || []).filter((bank) =>
    (bank.category || 'BANK') === tab &&
    (!keyword ||
      (bank.name || '').toLowerCase().includes(keyword) ||
      (bank.code || '').toLowerCase().includes(keyword))
  );

  /* Pilih bank → simpan ke flow, lanjut ke form tambah rekening. */
  const pick = (bank) => {
    kartuBankFlow.save({ bankId: bank.id, bankName: bank.name, bankCode: bank.code });
    navigate('/profil/kartu-bank-02');
  };

  return (
    <div className="page-pilih-bank">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <div className="app-container">
                  <header className="header-container">
                    <button className="back-button" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                      <img src={img_1} alt="Back Icon" />
                    </button>
                    <h1 className="page-title">Pilih Bank</h1>
                  </header>
                </div>
              </section>
              <section id="section-tabs">
                <div className="app-container">
                  <div className="tabs-wrapper">
                    <button className={`tab-btn${tab === 'BANK' ? ' active' : ''}`} onClick={() => setTab('BANK')}>Rekening Bank</button>
                    <button className={`tab-btn${tab === 'EWALLET' ? ' active' : ''}`} onClick={() => setTab('EWALLET')}>E-Wallet</button>
                  </div>
                </div>
              </section>
              <section id="section-search">
                <div className="app-container">
                  <div className="search-wrapper">
                    <div className="search-input-container">
                      <img src={img_2} alt="Search Icon" className="search-icon" />
                      <input
                        type="text"
                        className="search-input"
                        placeholder="Cari nama bank atau e-wallet"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>
              <section id="section-bank-list">
                <div className="app-container">
                  {error ? (
                    <NotifCard variant="error" title="Gagal Memuat Daftar Bank" description={error} />
                  ) : null}
                  <ul className="bank-list">
                    {!banks && !error && <li className="bank-empty">Memuat daftar bank...</li>}
                    {banks && filteredBanks.map((bank) => (
                      <li key={bank.id}>
                        <button type="button" className="bank-item" onClick={() => pick(bank)}>
                          {bank.name}
                        </button>
                      </li>
                    ))}
                    {banks && filteredBanks.length === 0 && (
                      <li className="bank-empty">
                        {tab === 'EWALLET' ? 'E-Wallet-nya nggak ketemu.' : 'Bank-nya nggak ketemu.'}
                      </li>
                    )}
                  </ul>
                </div>
              </section>
            </div>

    </div>
  );
}
