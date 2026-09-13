import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotifCard from '../../../components/NotifCard.jsx';
import img_1 from '../../../assets/images/41_1038.svg';
/* Shipping address — GET/POST /api/auth/address/ (list + create). */
import { createAddress, listAddresses } from '../../../lib/addressApi.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for AlamatPengiriman — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-alamat-pengiriman to isolate this page. */

.page-alamat-pengiriman {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at top right, rgba(255, 201, 60, 0.15) 0%, transparent 60%),
    radial-gradient(circle at bottom right, rgba(255, 159, 28, 0.15) 0%, transparent 60%);
  box-shadow: 0px 0px 20px rgba(0,0,0,0.05);
  min-height: 100vh;
  color: #1a1410;
  width: 100%;
}
.page-alamat-pengiriman, .page-alamat-pengiriman * {
  box-sizing: border-box;
}
.page-alamat-pengiriman input,.page-alamat-pengiriman  textarea,.page-alamat-pengiriman  button {
  font-family: inherit;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-alamat-pengiriman #section-header {
    width: 100%;
  }
  .page-alamat-pengiriman .app-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 20px 4px 20px;
  }
  .page-alamat-pengiriman .back-btn {
    width: 36px;
    height: 36px;
    border-radius: 11px;
    background-color: #f6f1e9;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
  }
  .page-alamat-pengiriman .page-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
  }

/* CSS for section section:Form */
.page-alamat-pengiriman #section-form {
    width: 100%;
  }
  .page-alamat-pengiriman .form-container {
    padding: 14px 20px 40px 20px;
  }
  .page-alamat-pengiriman .subtitle {
    font-size: 12px;
    color: #a79c8f;
    margin: 0 0 24px 0;
    line-height: 1.5;
  }
  .page-alamat-pengiriman .form-group {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .page-alamat-pengiriman .form-group label {
    font-size: 12px;
    font-weight: 600;
    color: #514840;
  }
  .page-alamat-pengiriman .form-input,.page-alamat-pengiriman  .input-wrapper {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    border: none;
    font-size: 14px;
    color: #1a1410;
    width: 100%;
    transition: outline 0.2s ease;
  }
  .page-alamat-pengiriman .form-input::placeholder {
    color: #a79c8f;
  }
  .page-alamat-pengiriman .form-input:focus,.page-alamat-pengiriman  .input-wrapper:focus-within {
    outline: 1px solid #f1b04a;
  }
  .page-alamat-pengiriman .textarea {
    resize: none;
    height: 92px;
  }
  .page-alamat-pengiriman .input-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-alamat-pengiriman .input-wrapper .unstyled {
    background: transparent;
    border: none;
    padding: 0;
    width: 100%;
    outline: none;
  }
  .page-alamat-pengiriman .phone-prefix {
    color: #514840;
    font-weight: 600;
    font-size: 14px;
  }
  .page-alamat-pengiriman .input-row {
    display: flex;
    gap: 12px;
  }
  .page-alamat-pengiriman .input-row .half {
    flex: 1;
    width: 50%;
  }
  .page-alamat-pengiriman .pill-group {
    display: flex;
    gap: 10px;
  }
  .page-alamat-pengiriman .pill {
    background-color: #f6f1e9;
    border: 1px solid transparent;
    border-radius: 10px;
    padding: 9px 14px;
    font-size: 12px;
    font-weight: 600;
    color: #514840;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .page-alamat-pengiriman .pill.active {
    background-color: rgba(255, 159, 28, 0.14);
    border-color: #e8790c;
    color: #e8790c;
  }
  .page-alamat-pengiriman .checkbox-group {
    margin-top: 24px;
    margin-bottom: 40px;
  }
  .page-alamat-pengiriman .custom-checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    position: relative;
    user-select: none;
  }
  .page-alamat-pengiriman .custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  .page-alamat-pengiriman .checkmark {
    height: 18px;
    width: 18px;
    background-color: #f6f1e9;
    border-radius: 2.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
  }
  .page-alamat-pengiriman .custom-checkbox input:checked ~ .checkmark {
    background-color: #e8790c;
  }
  .page-alamat-pengiriman .checkmark:after {
    content: "";
    display: none;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-bottom: 2px;
  }
  .page-alamat-pengiriman .custom-checkbox input:checked ~ .checkmark:after {
    display: block;
  }
  .page-alamat-pengiriman .checkbox-label {
    font-size: 12px;
    color: #514840;
  }
  .page-alamat-pengiriman .submit-container {
    margin-top: 20px;
  }
  .page-alamat-pengiriman .submit-btn {
    width: 100%;
    background-color: #f1b04a;
    color: #1a1410;
    border: none;
    border-radius: 5px;
    padding: 15px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
  .page-alamat-pengiriman .submit-btn:hover {
    opacity: 0.9;
  }
  .page-alamat-pengiriman .submit-btn:disabled {
    opacity: 0.7;
    cursor: default;
  }
  .page-alamat-pengiriman .error-text {
    color: #e24c4c;
    font-size: 12px;
    font-weight: 600;
    margin: 0 0 10px 0;
    text-align: center;
  }
`;

/* The form's "+62" prefix is a fixed element; strip it from saved numbers. */
function localPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.startsWith('62')) return digits.slice(2);
  return digits.replace(/^0+/, '');
}

const ADDRESS_LABELS = ['Rumah', 'Kantor', 'Lainnya'];

export default function AlamatPengiriman() {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [phone, setPhone] = useState('');
  const [alamat, setAlamat] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [kota, setKota] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kodepos, setKodepos] = useState('');
  const [label, setLabel] = useState('Rumah');
  const [isPrimary, setIsPrimary] = useState(true);
  const [error, setError] = useState('');
  /* API save failures render via the shared NotifCard; client validation stays inline. */
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* Prefill from the saved address (backend returns the primary one first)
     so "Ubah" edits the existing address instead of starting blank. */
  useEffect(() => {
    let active = true;
    listAddresses()
      .then((payload) => {
        if (!active) return;
        const saved = Array.isArray(payload?.results) ? payload.results[0] : null;
        if (!saved) return;
        setNama(saved.recipient_name || '');
        setPhone(localPhone(saved.phone_number));
        setAlamat(saved.address_details || '');
        setIsPrimary(Boolean(saved.is_primary));
      })
      .catch(() => { /* Biarkan form kosong jika gagal memuat. */ });
    return () => {
      active = false;
    };
  }, []);

  /* Validasi ringan di klien; backend tetap jadi penentu akhir. */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const digits = localPhone(phone);
    if (!nama.trim()) { setError('Masukkan nama penerima.'); return; }
    if (digits.length < 9) { setError('Nomor ponsel minimal 9 digit.'); return; }
    if (!alamat.trim()) { setError('Masukkan alamat lengkap.'); return; }

    setError('');
    setSubmitError('');
    setSubmitting(true);
    try {
      /* Provinsi/kota/kecamatan/kode pos tidak punya kolom sendiri di API —
         digabung ke address_details; nomor rumah sudah termasuk di dalamnya. */
      const addressDetails = [alamat, kecamatan, kota, provinsi, kodepos]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(', ');
      await createAddress({
        recipientName: nama.trim(),
        phoneNumber: `+62${digits}`,
        addressDetails,
        houseNumber: '',
        isPrimary,
      });
      navigate('/assets/cetak-emas-01');
    } catch (err) {
      setSubmitError(err?.message || 'Gagal menyimpan alamat. Silakan coba lagi.');
      setSubmitting(false);
    }
  };

  return (
    <div className="page-alamat-pengiriman">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="app-header">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="" />
                  </button>
                  <h1 className="page-title">Alamat Pengiriman</h1>
                </header>
              </section>
              <section id="section-form">
                <div className="form-container">
                  <p className="subtitle">Masukkan alamat lengkap tujuan pengiriman emas fisik kamu.</p>
                  <form onSubmit={handleSubmit} className="address-form">
                    <div className="form-group">
                      <label htmlFor="nama">Nama Penerima</label>
                      <input type="text" id="nama" placeholder="Nama lengkap penerima" className="form-input" value={nama} onChange={(e) => setNama(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Nomor Ponsel</label>
                      <div className="input-wrapper">
                        <span className="phone-prefix">+62</span>
                        <input type="tel" id="phone" inputMode="numeric" placeholder="Nomor ponsel aktif" className="form-input unstyled" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="alamat">Alamat Lengkap</label>
                      <textarea id="alamat" placeholder="Nama jalan, nomor rumah, RT/RW, patokan" className="form-input textarea" value={alamat} onChange={(e) => setAlamat(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Provinsi &amp; Kota</label>
                      <div className="input-row">
                        <input type="text" placeholder="Provinsi" className="form-input half" value={provinsi} onChange={(e) => setProvinsi(e.target.value)} />
                        <input type="text" placeholder="Kota/Kabupaten" className="form-input half" value={kota} onChange={(e) => setKota(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Kecamatan &amp; Kode Pos</label>
                      <div className="input-row">
                        <input type="text" placeholder="Kecamatan" className="form-input half" value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} />
                        <input type="text" placeholder="Kode pos" inputMode="numeric" className="form-input half" value={kodepos} onChange={(e) => setKodepos(e.target.value.replace(/\D/g, ''))} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Label Alamat</label>
                      <div className="pill-group">
                        {ADDRESS_LABELS.map((item) => (
                          <button
                            type="button"
                            key={item}
                            className={`pill${item === label ? ' active' : ''}`}
                            onClick={() => setLabel(item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="checkbox-group">
                      <label className="custom-checkbox">
                        <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} />
                        <span className="checkmark" />
                        <span className="checkbox-label">Jadikan sebagai alamat utama</span>
                      </label>
                    </div>
                    <div className="submit-container">
                      {error ? <p className="error-text">{error}</p> : null}
                      {submitError ? (
                        <NotifCard variant="error" title="Gagal Menyimpan Alamat" description={submitError} onClose={() => setSubmitError('')} />
                      ) : null}
                      <button type="submit" className="submit-btn" disabled={submitting}>
                        {submitting ? 'Menyimpan...' : 'Simpan Alamat'}
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </div>

    </div>
  );
}
