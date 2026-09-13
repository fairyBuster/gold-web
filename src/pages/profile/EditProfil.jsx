import { useEffect, useRef, useState } from 'react';
/* GET /api/auth/account-info/ untuk prefill form, PUT /api/auth/profile-update/
   untuk menyimpan perubahan (full_name, username, telegram, email,
   date_of_birth, gender), POST /api/auth/profile-photo/ untuk ganti foto. */
import { getAccountInfo, updateProfile, uploadProfilePhoto } from '../../lib/authApi.js';
/* API notifications (success/error) use the shared NotifCard component. */
import NotifCard from '../../components/NotifCard.jsx';
import img_1 from '../../assets/images/166_376.svg';
import img_2 from '../../assets/images/165_16.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for EditProfil — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-edit-profil to isolate this page. */

.page-edit-profil {
  --bg-color: #fffbf4;
  --surface-color: #f6f1e9;
  --text-main: #1a1410;
  --text-secondary: #514840;
  --text-hint: #a79c8f;
  --primary-color: #f1b04a;
  --success-color: #3fa66b;
  --success-bg: rgba(63, 166, 107, 0.14);
  --active-border: #e8790c;
  --active-bg: rgba(255, 159, 28, 0.12);
  --border-color: rgba(26, 20, 16, 0.25);
  min-height: 100vh;
  width: 100%;
}

.page-edit-profil {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-color);
  background-image: 
    radial-gradient(circle at 80% 10%, rgba(255, 201, 60, 0.28) 0%, transparent 50%),
    radial-gradient(circle at 100% 20%, rgba(255, 255, 255, 0.55) 0%, transparent 50%),
    radial-gradient(circle at 90% 0%, rgba(255, 159, 28, 0.38) 0%, transparent 50%);
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.page-edit-profil section,.page-edit-profil  header,.page-edit-profil  footer {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.page-edit-profil input,.page-edit-profil  button {
  font-family: inherit;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-edit-profil .header-section {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 20px 16px 20px;
}

.page-edit-profil .back-btn {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background-color: var(--surface-color);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}

.page-edit-profil .page-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

/* CSS for section section:Profile */
.page-edit-profil .profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 26px 0;
  gap: 10px;
}

.page-edit-profil .avatar-wrapper {
  position: relative;
  width: 84px;
  height: 84px;
}

.page-edit-profil .avatar-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--surface-color);
  border: 1px dashed var(--border-color);
  box-sizing: border-box;
  overflow: hidden;
}

.page-edit-profil .avatar-circle.has-image {
  border-style: solid;
}

.page-edit-profil .avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Hidden file input, triggered by the camera button. */
.page-edit-profil .avatar-input {
  display: none;
}

.page-edit-profil .edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffc93c 0%, #e8790c 100%);
  border: 2px solid #fff9f2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  box-sizing: border-box;
}

.page-edit-profil .avatar-hint {
  font-size: 12px;
  color: var(--text-hint);
  margin: 0;
}

/* CSS for section section:Form */
.page-edit-profil .form-section {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}

.page-edit-profil .form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-edit-profil .label-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-edit-profil .form-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

.page-edit-profil .verified-badge {
  background-color: var(--success-bg);
  color: var(--success-color);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 7px;
  font-weight: 600;
}

.page-edit-profil .form-input {
  background-color: var(--surface-color);
  border: none;
  border-radius: 12px;
  padding: 13px 14px;
  font-size: 14px;
  color: var(--text-main);
  width: 100%;
  box-sizing: border-box;
  outline: none;
}

.page-edit-profil .form-input.muted {
  color: var(--text-hint);
}

.page-edit-profil .gender-options {
  display: flex;
  gap: 10px;
}

.page-edit-profil .gender-btn {
  flex: 1;
  padding: 12px 0;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}

.page-edit-profil .gender-btn.active {
  background-color: var(--active-bg);
  border: 1px solid var(--active-border);
  color: var(--text-main);
  font-weight: 600;
}

.page-edit-profil .gender-btn:not(.active) {
  background-color: var(--surface-color);
  border: 1px solid transparent;
  color: var(--text-secondary);
}

/* CSS for section section:Footer */
.page-edit-profil .footer-section {
  padding: 24px 20px;
  margin-top: auto;
}

.page-edit-profil .save-btn {
  width: 100%;
  background-color: var(--primary-color);
  color: var(--text-main);
  border: none;
  border-radius: 14px;
  padding: 15px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-sizing: border-box;
  transition: opacity 0.2s ease;
}

.page-edit-profil .save-btn:active {
  opacity: 0.8;
}

.page-edit-profil .save-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.page-edit-profil .edit-avatar-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.page-edit-profil .photo-notice-wrapper {
  width: 100%;
  padding: 0 20px 14px;
  box-sizing: border-box;
}

.page-edit-profil .form-error {
  color: #e24c4c;
  font-size: 12px;
  margin: 0 0 10px;
}
`;

/* "+62 812-3456-7890" dari nomor telepon lokal/E.164 yang disimpan backend. */
function formatPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';
  const national = digits.startsWith('62') ? digits.slice(2) : digits.replace(/^0/, '');
  const parts = [national.slice(0, 3), national.slice(3, 7), national.slice(7)];
  return `+62 ${parts.filter(Boolean).join('-')}`;
}

export default function EditProfil() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [photoNotice, setPhotoNotice] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  /* Prefill form dari GET /api/auth/account-info/ (full_name, username, phone,
     email, telegram, avatar). Tanggal lahir & gender tidak dikembalikan API mana pun,
     jadi keduanya mulai kosong dan hanya ikut terkirim kalau diisi user. */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getAccountInfo();
        if (!active || !data) return;
        setFullName(data.full_name || '');
        setUsername(data.username || '');
        setPhone(formatPhone(data.phone));
        setEmail(data.email || '');
        setTelegram(data.telegram || '');
        setAvatarUrl(data.avatar || '');
      } catch { /* biarin form kosong */ }
    })();
    return () => { active = false; };
  }, []);

  /* Simpan: PUT /api/auth/profile-update/ — partial, field kosong dilewati.
     Error lokal (nama kosong dll) tampil inline di atas tombol; hasil API
     sukses/gagal tampil lewat shared NotifCard. */
  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    const name = fullName.trim();
    if (!name) {
      setNotice(null);
      setError('Nama lengkap wajib diisi.');
      return;
    }
    const mail = email.trim();
    if (mail && !mail.includes('@')) {
      setNotice(null);
      setError('Masukkan alamat email yang valid.');
      return;
    }

    const payload = { full_name: name };
    const uname = username.trim();
    const tele = telegram.trim();
    if (uname) payload.username = uname;
    if (mail) payload.email = mail;
    if (tele) payload.telegram = tele;
    if (dateOfBirth) payload.date_of_birth = dateOfBirth;
    if (gender) payload.gender = gender;

    setError('');
    setNotice(null);
    setSaving(true);
    try {
      await updateProfile(payload);
      setNotice({
        variant: 'success',
        title: 'Profil Berhasil Diperbarui',
        description: 'Perubahan data profil kamu sudah tersimpan.',
      });
    } catch (err) {
      setNotice({
        variant: 'error',
        title: 'Gagal Menyimpan Profil',
        description: err?.message || 'Perubahan profil gagal disimpan. Silakan coba lagi.',
      });
    } finally {
      setSaving(false);
    }
  };

  /* Ganti foto: POST /api/auth/profile-photo/ (multipart field 'avatar';
     JPG/JPEG/PNG max 1MB). Validasi lokal meniru serializer backend, lalu
     foto yang terupload langsung tampil di lingkaran avatar. */
  const handlePhotoChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ''; /* biar file yang sama bisa dipilih ulang */
    if (!file || uploading) return;

    if (!['image/jpeg', 'image/png'].includes(String(file.type).toLowerCase())) {
      setPhotoNotice({ variant: 'error', title: 'Upload Foto Gagal', description: 'Format foto harus JPG, JPEG, atau PNG.' });
      return;
    }
    if (file.size > 1024 * 1024) {
      setPhotoNotice({ variant: 'error', title: 'Upload Foto Gagal', description: 'Ukuran foto maksimal 1MB.' });
      return;
    }

    setPhotoNotice(null);
    setUploading(true);
    try {
      const data = await uploadProfilePhoto(file);
      if (data?.avatar) setAvatarUrl(data.avatar);
      setPhotoNotice({
        variant: 'success',
        title: 'Foto Profil Diupload',
        description: data?.message || 'Foto profil berhasil diupload.',
      });
    } catch (err) {
      setPhotoNotice({
        variant: 'error',
        title: 'Upload Foto Gagal',
        description: err?.message || 'Foto profil gagal diupload. Silakan coba lagi.',
      });
    } finally {
      setUploading(false);
    }
  };

  const now = new Date();
  const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <div className="page-edit-profil">
      <style>{styles}</style>
      <div>
              <header id="section-header" className="header-section">
                <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                  <img src={img_1} alt="" />
                </button>
                <h1 className="page-title">Edit Profil</h1>
              </header>
              <section id="section-profile" className="profile-section">
                <div className="avatar-wrapper">
                  <div className={`avatar-circle${avatarUrl ? ' has-image' : ''}`}>
                    {avatarUrl && <img src={avatarUrl} alt="Foto profil" className="avatar-image" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                  </div>
                  <button className="edit-avatar-btn" aria-label="Edit profile picture" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                    <img src={img_2} alt="" />
                  </button>
                  <input type="file" className="avatar-input" accept=".jpg,.jpeg,.png,image/jpeg,image/png" ref={fileInputRef} onChange={handlePhotoChange} />
                </div>
                <p className="avatar-hint">{uploading ? 'Mengunggah foto...' : 'Ketuk ikon buat ganti foto profil'}</p>
              </section>
              {photoNotice && (
                <div className="photo-notice-wrapper">
                  <NotifCard
                    variant={photoNotice.variant}
                    title={photoNotice.title}
                    description={photoNotice.description}
                    onClose={() => setPhotoNotice(null)}
                  />
                </div>
              )}
              <section id="section-form" className="form-section">
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input type="text" className="form-input" value={fullName} onChange={(e) => { setFullName(e.target.value); setError(''); }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-input" autoComplete="off" value={username} onChange={(e) => { setUsername(e.target.value); setError(''); }} />
                </div>
                <div className="form-group">
                  <div className="label-row">
                    <label className="form-label">Nomor Telepon</label>
                    <span className="verified-badge">Terverifikasi</span>
                  </div>
                  <input type="tel" className="form-input muted" value={phone} placeholder="+62 812-0000-0000" readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Telegram</label>
                  <input type="text" className="form-input" autoComplete="off" placeholder="@username (opsional)" value={telegram} onChange={(e) => { setTelegram(e.target.value); setError(''); }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal Lahir</label>
                  <input type="date" className="form-input" max={todayISO} value={dateOfBirth} onChange={(e) => { setDateOfBirth(e.target.value); setError(''); }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Jenis Kelamin</label>
                  <div className="gender-options">
                    <button type="button" className={`gender-btn${gender === 'male' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); setGender('male'); setError(''); setNotice(null); }}>Laki-laki</button>
                    <button type="button" className={`gender-btn${gender === 'female' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); setGender('female'); setError(''); setNotice(null); }}>Perempuan</button>
                  </div>
                </div>
                {notice && (
                  <NotifCard
                    variant={notice.variant}
                    title={notice.title}
                    description={notice.description}
                    onClose={() => setNotice(null)}
                  />
                )}
              </section>
              <footer id="section-footer" className="footer-section">
                {error && <p className="form-error">{error}</p>}
                <button className="save-btn" disabled={saving} onClick={handleSave}>
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </footer>
            </div>

    </div>
  );
}
