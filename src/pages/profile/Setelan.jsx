import { useEffect, useState } from 'react';
import { useShowNotif } from '../../lib/useShowNotif.js';
import { changePassword, getAccountInfo } from '../../lib/authApi.js';
import pkg from '../../../package.json';
import img_1 from '../../assets/images/166_376.svg';
import img_2 from '../../assets/images/165_101.svg';
import img_3 from '../../assets/images/165_101.svg';
import img_4 from '../../assets/images/165_101.svg';
import img_5 from '../../assets/images/165_134.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for Setelan — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-setelan to isolate this page. */

.page-setelan {
  --bg-main: #fffbf4;
  --bg-surface: #ffffff;
  --bg-input: #f6f1e9;
  --text-primary: #1a1410;
  --text-secondary: #514840;
  --text-tertiary: #a79c8f;
  --accent-color: #f1b04a;
  --border-color: #efe7dc;
  --font-family: 'Inter', sans-serif;
  min-height: 100vh;
  width: 100%;
}

.page-setelan, .page-setelan * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-setelan {
  font-family: var(--font-family);
  margin: 0 auto;
  max-width: 100%;
  background-color: var(--bg-main);
  background-image: 
    radial-gradient(circle at 80% 0%, rgba(255, 201, 60, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.6) 0%, transparent 40%);
  min-height: 100vh;
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  display: flex;
  flex-direction: column;
}

.page-setelan button {
  font-family: inherit;
  border: none;
  cursor: pointer;
  background: none;
}

.page-setelan input {
  font-family: inherit;
}

.page-setelan input:focus {
  outline: none;
}

.page-setelan .container {
  padding-left: 20px;
  padding-right: 20px;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-setelan .app-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-top: 20px;
    padding-bottom: 16px;
  }
  .page-setelan .back-button {
    width: 36px;
    height: 36px;
    background-color: var(--bg-input);
    border-radius: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s;
  }
  .page-setelan .back-button:active {
    opacity: 0.7;
  }
  .page-setelan .header-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
  }

/* CSS for section section:ChangePassword */
.page-setelan #section-change-password {
    margin-bottom: 24px;
    margin-top: 8px;
  }
  .page-setelan #section-change-password .section-header {
    margin-bottom: 24px;
  }
  .page-setelan #section-change-password .section-header h2 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
  }
  .page-setelan #section-change-password .section-header p {
    font-size: 14px;
    color: var(--text-tertiary);
    line-height: 1.4;
  }
  .page-setelan .form-group {
    margin-bottom: 16px;
  }
  .page-setelan .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }
  .page-setelan .input-wrapper {
    display: flex;
    align-items: center;
    background-color: var(--bg-input);
    border-radius: 12px;
    padding: 13px 14px;
    gap: 8px;
  }
  .page-setelan .input-wrapper input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 14px;
    color: var(--text-primary);
  }
  .page-setelan .input-wrapper input::placeholder {
    color: var(--text-tertiary);
  }
  .page-setelan .toggle-password {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  .page-setelan .toggle-password:hover {
    opacity: 1;
  }
  .page-setelan .password-requirements {
    list-style: none;
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .page-setelan .password-requirements li {
    font-size: 12px;
    color: var(--text-tertiary);
  }
  .page-setelan .btn-primary {
    width: 100%;
    background-color: var(--accent-color);
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 600;
    padding: 15px;
    border-radius: 14px;
    margin-top: 8px;
    transition: opacity 0.2s;
  }
  .page-setelan .btn-primary:active {
    opacity: 0.8;
  }

/* CSS for section section:ClearCache */
.page-setelan .divider {
    border: none;
    height: 1px;
    background-color: var(--border-color);
    margin: 24px 0;
  }
  .page-setelan #section-clear-cache .section-header {
    margin-bottom: 16px;
  }
  .page-setelan #section-clear-cache .section-header h2 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
  }
  .page-setelan #section-clear-cache .section-header p {
    font-size: 14px;
    color: var(--text-tertiary);
    line-height: 1.4;
  }
  .page-setelan .cache-card {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    padding: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .page-setelan .cache-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-setelan .cache-icon {
    width: 38px;
    height: 38px;
    background-color: var(--bg-input);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .page-setelan .cache-details h3 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
  }
  .page-setelan .cache-details p {
    font-size: 12px;
    color: var(--text-tertiary);
  }
  .page-setelan .btn-secondary {
    background-color: var(--bg-input);
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 600;
    padding: 9px 16px;
    border-radius: 10px;
    transition: background-color 0.2s;
  }
  .page-setelan .btn-secondary:active {
    background-color: #e8e2d8;
  }

/* CSS for section section:Footer */
.page-setelan .app-footer {
    text-align: center;
    margin-top: 42px;
    padding-bottom: 40px;
  }
  .page-setelan .app-footer p {
    font-size: 12px;
    color: var(--text-tertiary);
  }
`;

/* ---- Cache Aplikasi ("Bersihkan Cache") -----------------------------------
   "Cache" = data sementara di browser: cache harga emas (localStorage
   'je_gold_price') dan id handoff antar halaman (sessionStorage 'je_*').
   Browser tidak punya API ukuran storage, jadi ukuran dihitung dari panjang
   key+value (UTF-16 ~ 2 byte per karakter). Sesi login ('je_auth_session')
   dan penanda notif dibaca ('je_notif_seen_at') tidak dihapus — keduanya
   state pengguna, bukan cache. */
const CACHE_LS_KEYS = ['je_gold_price'];
const CACHE_SS_KEYS = ['je_news_id', 'je_asset_product_id', 'je_poinmall_prize_id', 'je_poinmall_result', 'je_withdrawal_id'];

function measureCacheBytes() {
  let bytes = 0;
  const add = (storage, keys) => {
    for (const key of keys) {
      try {
        const value = storage.getItem(key);
        if (value !== null) bytes += (key.length + value.length) * 2;
      } catch {
        /* storage tidak tersedia — lewati */
      }
    }
  };
  add(window.localStorage, CACHE_LS_KEYS);
  add(window.sessionStorage, CACHE_SS_KEYS);
  return bytes;
}

function clearAppCache() {
  const remove = (storage, keys) => {
    for (const key of keys) {
      try {
        storage.removeItem(key);
      } catch {
        /* storage tidak tersedia — lewati */
      }
    }
  };
  remove(window.localStorage, CACHE_LS_KEYS);
  remove(window.sessionStorage, CACHE_SS_KEYS);
}

/* Ukuran cache kecil (< 2 KB), jadi byte/KB sudah cukup; id-ID memakai koma. */
function formatCacheBytes(bytes) {
  if (bytes >= 1048576) return `${(bytes / 1048576).toLocaleString('id-ID', { maximumFractionDigits: 1 })} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toLocaleString('id-ID', { maximumFractionDigits: 1 })} KB`;
  return `${bytes.toLocaleString('id-ID')} byte`;
}

export default function Setelan() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cacheBytes, setCacheBytes] = useState(() => measureCacheBytes());
  const [submitting, setSubmitting] = useState(false);
  /* `phone` untuk payload change-password diambil dari account-info sekali
     saat halaman dibuka (gagal ambil → submit mengingatkan user). */
  const [phone, setPhone] = useState('');
  const showNotif = useShowNotif();

  useEffect(() => {
    let active = true;
    getAccountInfo()
      .then((data) => { if (active && data?.phone) setPhone(String(data.phone)); })
      .catch(() => { /* biarin kosong — submit akan minta coba lagi */ });
    return () => { active = false; };
  }, []);

  /* Submit: POST /api/auth/change-password/ — verifikasi kata sandi lama
     (tanpa OTP). Validasi lokal (kosong, minimal 8 karakter, kombinasi huruf
     & angka, konfirmasi sama) tampil lewat overlay /notif; sukses → notif +
     kembali ke halaman sebelumnya (perilaku lama). */
  const handleSave = async () => {
    if (submitting) return;
    if (!currentPassword) { showNotif({ title: 'Lengkapi Data', description: 'Masukkan kata sandi lama.' }); return; }
    if (!newPassword) { showNotif({ title: 'Lengkapi Data', description: 'Masukkan kata sandi baru.' }); return; }
    if (!confirmPassword) { showNotif({ title: 'Lengkapi Data', description: 'Ulangi kata sandi baru.' }); return; }
    if (newPassword.length < 8) { showNotif({ title: 'Kata Sandi Tidak Sesuai', description: 'Kata sandi baru minimal 8 karakter.' }); return; }
    if (!/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) { showNotif({ title: 'Kata Sandi Tidak Sesuai', description: 'Kata sandi baru harus kombinasi huruf & angka.' }); return; }
    if (newPassword !== confirmPassword) { showNotif({ title: 'Kata Sandi Tidak Sesuai', description: 'Konfirmasi kata sandi tidak sama.' }); return; }
    if (!phone) { showNotif({ title: 'Gagal Mengubah Password', description: 'Data akun belum termuat. Coba lagi sebentar lagi ya.' }); return; }

    setSubmitting(true);
    try {
      await changePassword({ phone, oldPassword: currentPassword, newPassword, newPasswordConfirm: confirmPassword });
      showNotif({ variant: 'success', title: 'Kata Sandi Berhasil Diubah', description: 'Kata sandi kamu berhasil diubah.' });
      window.history.back();
    } catch (err) {
      /* Penanda verifikasi kata sandi lama ada di payload.old_password —
         teks yang tampil tetap ditulis frontend (lihat apiClient). */
      const wrongOldPassword = Boolean(err?.payload && typeof err.payload === 'object' && err.payload.old_password);
      showNotif({
        title: 'Gagal Mengubah Password',
        description: wrongOldPassword ? 'Kata sandi lama tidak sesuai.' : (err?.message || 'Kata sandi gagal diubah. Silakan coba lagi.'),
      });
      setSubmitting(false);
    }
  };

  /* Bersihkan cache lalu ukur ulang; notif menunjukkan ukuran yang dibebaskan
     (atau bahwa cache memang sudah kosong). */
  const handleClearCache = () => {
    const freed = cacheBytes;
    clearAppCache();
    setCacheBytes(measureCacheBytes());
    showNotif({
      variant: 'success',
      title: 'Cache Dibersihkan',
      description: freed > 0
        ? `Data sementara sebesar ${formatCacheBytes(freed)} berhasil dihapus.`
        : 'Tidak ada data sementara yang perlu dihapus.',
    });
  };

  return (
    <div className="page-setelan">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="app-header container">
                  <button className="back-button" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="" />
                  </button>
                  <h1 className="header-title">Setelan</h1>
                </header>
              </section>
              <section id="section-change-password" className="container">
                <div className="section-header">
                  <h2>Ubah Kata Sandi</h2>
                  <p>Gunakan kata sandi yang kuat dan belum pernah dipakai sebelumnya.</p>
                </div>
                <form onSubmit={(e) => e.preventDefault()} className="password-form">
                  <div className="form-group">
                    <label htmlFor="current-password">Kata Sandi Saat Ini</label>
                    <div className="input-wrapper">
                      <input type="password" id="current-password" placeholder="Masukkan kata sandi lama" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                      <button type="button" className="toggle-password" aria-label="Toggle password visibility">
                        <img src={img_2} alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-password">Kata Sandi Baru</label>
                    <div className="input-wrapper">
                      <input type="password" id="new-password" placeholder="Masukkan kata sandi baru" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                      <button type="button" className="toggle-password" aria-label="Toggle password visibility">
                        <img src={img_3} alt="" />
                      </button>
                    </div>
                    <ul className="password-requirements">
                      <li>Minimal 8 karakter</li>
                      <li>Kombinasi huruf &amp; angka</li>
                    </ul>
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</label>
                    <div className="input-wrapper">
                      <input type="password" id="confirm-password" placeholder="Ulangi kata sandi baru" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      <button type="button" className="toggle-password" aria-label="Toggle password visibility">
                        <img src={img_4} alt="" />
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary" onClick={(e) => { e.preventDefault(); handleSave(); }}>Simpan Kata Sandi</button>
                </form>
              </section>
              <section id="section-clear-cache" className="container">
                <hr className="divider" />
                <div className="section-header">
                  <h2>Bersihkan Cache</h2>
                  <p>Hapus data sementara buat bantu aplikasi jalan lebih ringan.</p>
                </div>
                <div className="cache-card">
                  <div className="cache-info">
                    <div className="cache-icon">
                      <img src={img_5} alt="" />
                    </div>
                    <div className="cache-details">
                      <h3>Cache Aplikasi</h3>
                      <p>{formatCacheBytes(cacheBytes)} terpakai</p>
                    </div>
                  </div>
                  <button type="button" className="btn-secondary" onClick={handleClearCache}>Bersihkan</button>
                </div>
              </section>
              <section id="section-footer" className="container">
                <footer className="app-footer">
                  <p>JelajahEmas versi {pkg.version}</p>
                </footer>
              </section>
            </div>

    </div>
  );
}
