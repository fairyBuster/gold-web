import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import img_1 from '../../../assets/images/55_536.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for LoadingPenarikan — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-loading-penarikan to isolate this page. */

.page-loading-penarikan {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  /* Artwork + base on the root so they stay full-bleed on desktop. */
  background-image: radial-gradient(circle at 80% 10%, rgba(255, 201, 60, 0.28) 0%, rgba(255, 201, 60, 0) 50%),
                    radial-gradient(circle at 20% 90%, rgba(255, 159, 28, 0.25) 0%, rgba(255, 159, 28, 0) 50%),
                    linear-gradient(#fffbf4, #fffbf4);
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}
.page-loading-penarikan, .page-loading-penarikan * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Loading */
.page-loading-penarikan #section-loading {
    width: 100%;
    max-width: 100%; /* Based on Figma design width */
    position: relative;
    overflow: hidden;
    box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  }

  /* Simulating the complex radial gradients from Figma */
  .page-loading-penarikan .loading-screen {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .page-loading-penarikan .content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0 36px;
    z-index: 2;
  }

  .page-loading-penarikan .spinner-wrapper {
    margin-bottom: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .page-loading-penarikan .spinner {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    border: 4px solid #f6f1e9;
    border-top-color: #e8790c;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .page-loading-penarikan .heading-wrapper {
    margin-bottom: 10px;
    text-align: center;
  }

  .page-loading-penarikan .heading {
    color: #1a1410;
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    line-height: 1.4;
  }

  .page-loading-penarikan .subheading-wrapper {
    margin-bottom: 24px;
    text-align: center;
  }

  .page-loading-penarikan .subheading {
    color: #514840;
    font-size: 13px;
    font-weight: 400;
    margin: 0;
    line-height: 1.5;
  }

  .page-loading-penarikan .info-box {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
  }

  .page-loading-penarikan .icon-wrapper {
    display: flex;
    padding-top: 2px;
  }

  .page-loading-penarikan .info-icon {
    width: 16px;
    height: 16px;
    display: block;
  }

  .page-loading-penarikan .info-text-wrapper {
    flex: 1;
  }

  .page-loading-penarikan .info-text {
    color: #a79c8f;
    font-size: 12px;
    font-weight: 400;
    margin: 0;
    line-height: 1.5;
  }

  .page-loading-penarikan .countdown-wrapper {
    margin-top: 20px;
    margin-bottom: 12.5px;
    text-align: center;
  }

  .page-loading-penarikan .countdown-text {
    color: #e8790c;
    font-size: 13px;
    font-weight: 600;
    margin: 0;
  }

  /* Responsive adjustments for smaller screens if needed */
  @media (max-width: 360px) {
    .page-loading-penarikan .content-container {
      padding: 0 24px;
    }
  }
`;

export default function LoadingPenarikan() {
  const navigate = useNavigate();
  const location = useLocation();

  /* Forward the withdrawal created by the wizard so the detail page opens the
     exact record instead of guessing (falls back to sessionStorage after a
     reload, where route state may be gone). */
  const withdrawalId = location.state?.withdrawalId ?? sessionStorage.getItem('je_withdrawal_id') ?? '';

  useEffect(() => {
    const timer = setTimeout(
      () => navigate('/index/transactions/detail-penarikan', { state: { withdrawalId } }),
      2000
    );
    return () => clearTimeout(timer);
  }, [navigate, withdrawalId]);

  return (
    <div className="page-loading-penarikan">
      <style>{styles}</style>
      <section id="section-loading">
              <div className="loading-screen">
                <div className="content-container">
                  <div className="spinner-wrapper">
                    <div className="spinner" />
                  </div>
                  <div className="heading-wrapper">
                    <h1 className="heading">Memproses Penarikan Kamu</h1>
                  </div>
                  <div className="subheading-wrapper">
                    <p className="subheading">Mohon tunggu sebentar, jangan tutup halaman ini.</p>
                  </div>
                  <div className="info-box">
                    <div className="icon-wrapper">
                      <img src={img_1} alt="Info" className="info-icon" />
                    </div>
                    <div className="info-text-wrapper">
                      <p className="info-text">Sistem sedang memverifikasi transaksi kamu untuk memastikan keamanan dana, sebagai bagian dari perlindungan anti-penipuan.</p>
                    </div>
                  </div>
                  <div className="countdown-wrapper">
                    <p className="countdown-text">Mengalihkan dalam 2 detik...</p>
                  </div>
                </div>
              </div>
            </section>

    </div>
  );
}
