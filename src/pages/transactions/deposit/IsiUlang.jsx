import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { goBack } from '../../../lib/backNav.js';
import img_1 from '../../../assets/images/41_1038.svg';
import img_2 from '../../../assets/images/33_71.svg';
/* Page background artwork — assigned inline on the root node (see styles). */
import img_3 from '../../../assets/images/083535.webp';
import { useShowNotif } from '../../../lib/useShowNotif.js';
/* Saldo dompet isi ulang — GET /api/auth/account-info/. */
import { getAccountInfo } from '../../../lib/authApi.js';
import { formatIDR } from '../../../lib/goldPriceApi.js';
/* VA channels create their deposit through ATPAY; QRIS channels through MGM,
   LPAY, or FF Pay (initiate + select-method); Bank Transfer BRI through
   BankPay (nomor rekening tujuan). */
import { extractBankpayInfo, extractExpireTime, extractMethodGuide, extractQrisData, extractRefId, extractVaNumber, initiateDepositBankpay, initiateDepositFfpay, initiateDepositLpay, initiateDepositQris, initiateDepositVa, selectFfpayMethod } from '../../../lib/depositsApi.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for IsiUlang — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-isi-ulang to isolate this page. */

.page-isi-ulang, .page-isi-ulang * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-isi-ulang {
  font-family: 'Inter', sans-serif;
  background-color: #fffbf4;
  /* Background artwork (assigned inline from the imported asset) is a
     full-page image with glows anchored to the top/bottom — stretch it. */
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

.page-isi-ulang section {
  width: 100%;
  max-width: 100%;
}

.page-isi-ulang h1,.page-isi-ulang  h2,.page-isi-ulang  h3,.page-isi-ulang  h4,.page-isi-ulang  p {
  margin: 0;
}

.page-isi-ulang button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.page-isi-ulang input {
  font-family: inherit;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-isi-ulang #section-header {
    padding: 20px 20px 4px 20px;
  }
  .page-isi-ulang .header {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .page-isi-ulang .back-btn {
    width: 36px;
    height: 36px;
    background-color: #f6f1e9;
    border-radius: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .page-isi-ulang .header-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
  }

/* CSS for section section:TopUpInput */
.page-isi-ulang #section-topup-input {
    padding: 20px;
    display: flex;
    justify-content: center;
  }
  .page-isi-ulang .topup-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 372px;
  }
  .page-isi-ulang .input-label {
    font-size: 14px;
    color: #a79c8f;
    margin-bottom: 20px;
  }
  .page-isi-ulang .input-wrapper {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 8px;
    margin-bottom: 24px;
  }
  .page-isi-ulang .currency-symbol {
    font-size: 24px;
    font-weight: 700;
    color: #514840;
  }
  /* Kursor dekoratif kedip-kedip: penanda kolom nominal bisa diketik.
     Disembunyikan saat kolom difokuskan (kursor asli tampil) atau sudah
     ada isinya. */
  .page-isi-ulang .focus-caret {
    font-size: 20px;
    font-weight: 400;
    line-height: 1;
    color: #1a1410;
    animation: page-isi-ulang-caret-blink 1s infinite;
  }
  .page-isi-ulang .input-wrapper:focus-within .focus-caret,
  .page-isi-ulang .input-wrapper:has(.amount-input:not(:placeholder-shown)) .focus-caret {
    display: none;
  }
  @keyframes page-isi-ulang-caret-blink {
    0%, 49% {
      opacity: 1;
    }
    50%, 100% {
      opacity: 0;
    }
  }
  .page-isi-ulang .amount-input {
    font-size: 20px;
    /* Nominal yang diketik hitam biar kebaca; placeholder tetap abu (rule di bawah). */
    color: #1a1410;
    border: none;
    background: transparent;
    outline: none;
    width: 220px;
  }
  .page-isi-ulang .amount-input::placeholder {
    color: #a79c8f;
    font-size: 15px;
  }
  .page-isi-ulang .helper-texts {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .page-isi-ulang .min-amount,.page-isi-ulang  .current-balance {
    font-size: 12px;
    color: #a79c8f;
  }

/* CSS for section section:PaymentMethods */
.page-isi-ulang #section-payment-methods {
    padding: 0 20px;
  }
  .page-isi-ulang .payment-header {
    margin-bottom: 22px;
  }
  .page-isi-ulang .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin-bottom: 4px;
  }
  .page-isi-ulang .section-subtitle {
    font-size: 12px;
    color: #a79c8f;
    line-height: 1.4;
  }
  .page-isi-ulang .payment-category {
    margin-bottom: 18px;
  }
  .page-isi-ulang .category-title {
    font-size: 10px;
    font-weight: 600;
    color: #a79c8f;
    text-transform: uppercase;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }
  .page-isi-ulang .payment-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 14px;
    border-radius: 14px;
    border: 1px solid #efe7dc;
    background-color: #ffffff;
    margin-bottom: 8px;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
  }
  .page-isi-ulang .payment-card:last-child {
    margin-bottom: 0;
  }
  .page-isi-ulang .payment-card.selected {
    border-color: #e8790c;
    background-color: rgba(255, 159, 28, 0.06);
  }
  .page-isi-ulang .card-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    padding-right: 12px;
  }
  .page-isi-ulang .method-name {
    font-size: 14px;
    font-weight: 600;
    color: #1a1410;
  }
  .page-isi-ulang .method-desc {
    font-size: 11px;
    color: #a79c8f;
    line-height: 1.3;
  }
  .page-isi-ulang .radio-btn {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #a79c8f;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }
  .page-isi-ulang .radio-btn.selected {
    border-color: #e8790c;
  }
  .page-isi-ulang .radio-inner {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #e8790c;
  }
  /* Keeps the native radio input rendered but invisible — display:none would
     stop some browsers from activating it through label clicks. */
  .page-isi-ulang .method-input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

/* CSS for section section:Information */
.page-isi-ulang #section-information {
    padding: 20px;
    margin-top: 10px;
  }
  .page-isi-ulang .warning-box {
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 24px;
  }
  .page-isi-ulang .icon-wrapper {
    padding-top: 2px;
    flex-shrink: 0;
  }
  .page-isi-ulang .warning-text {
    font-size: 12px;
    color: #1a1410;
    line-height: 1.5;
  }
  .page-isi-ulang .warning-text strong {
    font-weight: 700;
  }
  .page-isi-ulang .disclaimer-text {
    font-size: 10px;
    color: #a79c8f;
    text-align: center;
    line-height: 1.5;
    padding: 0 8px;
  }

/* CSS for section section:Footer */
.page-isi-ulang #section-footer {
    margin-top: auto;
    padding-bottom: 20px;
  }
  .page-isi-ulang .footer-divider {
    height: 1px;
    background-color: #efe7dc;
    margin: 0 20px 18px 20px;
  }
  .page-isi-ulang .footer-content {
    padding: 0 20px;
  }
  .page-isi-ulang .btn-primary {
    width: 100%;
    background-color: #f1b04a;
    color: #1a1410;
    font-size: 14px;
    font-weight: 700;
    padding: 15px;
    border-radius: 5px;
    text-align: center;
    transition: background-color 0.2s;
  }
  .page-isi-ulang .btn-primary:hover {
    background-color: #e0a03a;
  }
`;

/* Deposit channels, grouped per category; each channel opens its payment page.
   VA channels carry the ATPAY `method` bank code used by
   POST /api/deposits/atpay/initiate-va/; `qris: true` channels go through
   POST /api/deposits/mgm/initiate/; `lpay: true` channels through
   POST /api/deposits/lpay/initiate/; `ffpayQris: true` channels through
   POST /api/deposits/ffpay/initiate/ + select-method; `bankpay: true` channel
   through POST /api/deposits/bankpay/initiate/ (nomor rekening). */
const PAYMENT_CATEGORIES = ['VIRTUAL ACCOUNT', 'E-WALLET & QRIS'];
const MIN_DEPOSIT = 10000;
/* Batas maksimal pengisian lewat jalur QRIS (LPAY, MGM, FF Pay) + copy
   peringatannya. VA dan Bank Transfer BRI tidak dibatasi di sini. */
const MAX_QRIS_DEPOSIT = 10000000;
const QRIS_LIMIT_NOTIF = {
  title: 'Nominal Melebihi Batas',
  description: 'Melebihi batas nominal maksimal pengisian dengan QRIS.',
};
/* Gateway menonaktifkan jalur QRIS sementara: payload error
   { detail: "Pengisian ulang tertunda hari ini. Silakan coba 30 menit
   selanjutnya" } diganti copy yang mengarahkan user ke metode lain. */
const QRIS_DISABLED_NOTIF = {
  title: 'QRIS Tidak Tersedia',
  description: 'QRIS ini tidak tersedia, yuk coba pembayaran lainnya.',
};
const PAYMENT_METHODS = [
  {
    id: 'va_bri',
    category: 'VIRTUAL ACCOUNT',
    name: 'VA BRI',
    method: 'BRI',
    desc: 'Bayar melalui ATM, m-Banking, atau Internet Banking BRI.',
    route: '/index/transactions/virtual-account',
  },
  {
    id: 'va_permata',
    category: 'VIRTUAL ACCOUNT',
    name: 'VA Permata',
    method: 'PERMATA',
    desc: "Bayar melalui ATM, Mbanking Permata, atau Internet Banking Permata.",
    route: '/index/transactions/virtual-account',
  },
  {
    id: 'va_mandiri',
    category: 'VIRTUAL ACCOUNT',
    name: 'VA Mandiri',
    method: 'MANDIRI',
    desc: 'Bayar melalui ATM, m-Banking, atau Internet Banking Mandiri.',
    route: '/index/transactions/virtual-account',
  },
  {
    id: 'va_danamon',
    category: 'VIRTUAL ACCOUNT',
    name: 'VA Danamon',
    method: 'DANAMON',
    desc: 'Bayar melalui ATM, m-Banking, atau Internet Banking Danamon.',
    route: '/index/transactions/virtual-account',
  },
  {
    id: 'qris_0',
    category: 'E-WALLET & QRIS',
    name: 'Bank Transfer BRI',
    bankpay: true,
    desc: 'Transfer ke rekening BRI melalui ATM, m-Banking, atau Internet Banking.',
    route: '/index/transactions/virtual-account',
  },

  {
    id: 'qris_1',
    category: 'E-WALLET & QRIS',
    name: 'QRIS 1',
    lpay: true,
    desc: 'Pindai kode QR menggunakan aplikasi e-wallet atau m-Banking apa pun.',
    route: '/index/transactions/qris',
  },
  {
    id: 'qris_2',
    category: 'E-WALLET & QRIS',
    name: 'QRIS 2',
    qris: true,
    desc: 'Pindai kode QR menggunakan aplikasi e-wallet atau m-Banking apa pun.',
    route: '/index/transactions/qris',
  },
  {
    id: 'qris_3',
    category: 'E-WALLET & QRIS',
    name: 'QRIS 3',
    qris: true,
    desc: 'Pindai kode QR menggunakan aplikasi e-wallet atau m-Banking apa pun.',
    route: '/index/transactions/qris',
  },
  {
    id: 'qris_4',
    category: 'E-WALLET & QRIS',
    name: 'QRIS 4',
    ffpayQris: true,
    desc: 'Pindai kode QR menggunakan aplikasi e-wallet atau m-Banking apa pun.',
    route: '/index/transactions/qris',
  },
];

/* Channel QRIS: LPAY (QRIS 1), MGM (QRIS 2 & 3), FF Pay (QRIS 4). */
const isQrisMethod = (item) => Boolean(item.qris || item.lpay || item.ffpayQris);

/* QRIS nonaktif sementara di sisi gateway — dikenali dari payload error
   JSON { detail: "Pengisian ulang tertunda hari ini..." }. */
const isQrisTempDisabled = (payload) => {
  const detail = payload && typeof payload === 'object' ? String(payload.detail || '') : '';
  return /pengisian ulang tertunda/i.test(detail);
};

export default function IsiUlang() {
  const navigate = useNavigate();
  const [methodId, setMethodId] = useState(PAYMENT_METHODS[0].id);
  const [amountText, setAmountText] = useState('');
  /* Saldo dompet isi ulang — `balance_deposit` dari GET /api/auth/account-info/.
     "—" tampil sampai datanya landing. */
  const [account, setAccount] = useState(null);
  /* Tombol Lanjutkan terkunci selama deposit dibuat (VA/QRIS, cegah dobel). */
  const [submitting, setSubmitting] = useState(false);
  const showNotif = useShowNotif();
  const method = PAYMENT_METHODS.find((item) => item.id === methodId) || PAYMENT_METHODS[0];
  const depositBalanceText = account ? formatIDR(Number(account.balance_deposit) || 0) : '';

  useEffect(() => {
    let active = true;
    getAccountInfo()
      .then((data) => {
        if (active && data) setAccount(data);
      })
      .catch(() => {
        /* placeholder "—" bertahan kapan API tidak terjangkau */
      });
    return () => {
      active = false;
    };
  }, []);

  /* Pilih channel; kalau nominal yang sudah diketik di atas batas QRIS dan
     channel QRIS yang dipilih, tampilkan peringatan lewat notifikasi. */
  const handleSelectMethod = (item) => {
    setMethodId(item.id);
    if (isQrisMethod(item) && Number(amountText.replace(/\D/g, '')) > MAX_QRIS_DEPOSIT) {
      showNotif(QRIS_LIMIT_NOTIF);
    }
  };

  /* Validasi tampil lewat notifikasi mengambang; channel VA, QRIS, dan bank
     transfer membuat depositnya dulu (ATPAY initiate-va / MGM initiate / LPAY
     initiate / FF Pay initiate + select-method / BankPay initiate) lalu data
     bayaran dari gateway diteruskan ke halaman instruksi lewat route state.
     Channel tanpa flow khusus lanjut seperti biasa. Saat gateway menonaktifkan
     QRIS sementara, tiap langkah QRIS berhenti dengan QRIS_DISABLED_NOTIF. */
  const handleContinue = async () => {
    const digits = amountText.replace(/\D/g, '');
    if (!digits) {
      showNotif({ title: 'Lengkapi Data', description: 'Masukkan nominal isi ulang.' });
      return;
    }
    if (Number(digits) < MIN_DEPOSIT) {
      showNotif({ title: 'Nominal Terlalu Kecil', description: `Minimal pengisian ${formatIDR(MIN_DEPOSIT)}.` });
      return;
    }
    /* Di atas batas maksimal QRIS: hanya beri notifikasi, jangan buat deposit. */
    if (isQrisMethod(method) && Number(digits) > MAX_QRIS_DEPOSIT) {
      showNotif(QRIS_LIMIT_NOTIF);
      return;
    }
    if (!method.method && !method.qris && !method.ffpayQris && !method.bankpay && !method.lpay) {
      navigate(method.route);
      return;
    }
    setSubmitting(true);
    try {
      if (method.bankpay) {
        /* Bank transfer BRI: BankPay mengembalikan nomor rekening tujuan +
           nominal unik (display_amount) + halaman bayar gateway (pay_url) →
           halaman instruksi; `bankTransfer` menandai copy rekening (bukan
           Virtual Account) di halaman instruksi. */
        const payload = await initiateDepositBankpay({ amount: Number(digits) });
        const info = extractBankpayInfo(payload);
        if (!info.vaNumber) {
          setSubmitting(false);
          showNotif({ title: 'Gagal Membuat Instruksi Transfer', description: 'Nomor rekening tidak diterima dari server. Coba lagi ya.' });
          return;
        }
        const bankCode = info.bank || 'BRI';
        navigate(method.route, {
          state: {
            vaNumber: info.vaNumber,
            amount: info.amount || Number(digits),
            methodCode: bankCode,
            methodName: `Bank Transfer ${bankCode}`,
            bankTransfer: true,
            expireTime: '',
            methodGuide: [],
            vaName: info.vaName,
            payUrl: info.payUrl,
          },
        });
        return;
      }
      if (method.ffpayQris) {
        /* FF Pay: initiate dulu (dapat ref_id), lalu select-method 'QRIS'
           untuk mendapat konten QR; masa berlaku dari respons initiate. */
        const initiated = await initiateDepositFfpay({ amount: Number(digits) });
        /* Balasan bisa berisi penanda penonaktifan QRIS, bukan data deposit. */
        if (isQrisTempDisabled(initiated)) {
          setSubmitting(false);
          showNotif(QRIS_DISABLED_NOTIF);
          return;
        }
        const refId = extractRefId(initiated);
        if (!refId) {
          setSubmitting(false);
          showNotif({ title: 'Gagal Membuat Kode QRIS', description: 'Ref ID pembayaran tidak diterima dari server. Coba lagi ya.' });
          return;
        }
        const selected = await selectFfpayMethod({ refId, method: 'QRIS' });
        if (isQrisTempDisabled(selected)) {
          setSubmitting(false);
          showNotif(QRIS_DISABLED_NOTIF);
          return;
        }
        const qris = { ...extractQrisData(selected), expiresAt: extractQrisData(initiated).expiresAt };
        if (!qris.qrImageUrl && !qris.qrContent && !qris.qrUrl) {
          setSubmitting(false);
          showNotif({ title: 'Gagal Membuat Kode QRIS', description: 'Data pembayaran tidak diterima dari server. Coba lagi ya.' });
          return;
        }
        navigate(method.route, { state: { amount: Number(digits), ...qris } });
        return;
      }
      if (method.qris || method.lpay) {
        /* QRIS: deposit dibuat lewat MGM (`qris`) atau LPAY (`lpay`) — satu
           panggilan initiate langsung membawa data QR; nominal dikirim
           sebagai number. */
        const payload = method.lpay
          ? await initiateDepositLpay({ amount: Number(digits) })
          : await initiateDepositQris({ amount: Number(digits) });
        /* Payload penonaktifan QRIS bisa datang sebagai balasan sukses (200). */
        if (isQrisTempDisabled(payload)) {
          setSubmitting(false);
          showNotif(QRIS_DISABLED_NOTIF);
          return;
        }
        const qris = extractQrisData(payload);
        if (!qris.qrImageUrl && !qris.qrContent && !qris.qrUrl) {
          setSubmitting(false);
          showNotif({ title: 'Gagal Membuat Kode QRIS', description: 'Data pembayaran tidak diterima dari server. Coba lagi ya.' });
          return;
        }
        navigate(method.route, { state: { amount: Number(digits), ...qris } });
        return;
      }
      const payload = await initiateDepositVa({ amount: Number(digits).toFixed(2), method: method.method });
      const vaNumber = extractVaNumber(payload);
      if (!vaNumber) {
        setSubmitting(false);
        showNotif({ title: 'Gagal Membuat Virtual Account', description: 'Nomor Virtual Account tidak diterima dari server. Coba lagi ya.' });
        return;
      }
      navigate(method.route, {
        state: {
          vaNumber,
          amount: Number(digits),
          methodCode: method.method,
          methodName: method.name,
          expireTime: extractExpireTime(payload),
          methodGuide: extractMethodGuide(payload),
        },
      });
    } catch (err) {
      setSubmitting(false);
      /* Jalur QRIS nonaktif sementara di gateway (payload error berisi
         detail "Pengisian ulang tertunda…") → arahkan user ke metode
         pembayaran lain, bukan kegagalan generik. */
      if (isQrisMethod(method) && isQrisTempDisabled(err?.payload)) {
        showNotif(QRIS_DISABLED_NOTIF);
        return;
      }
      /* LPAY & FF Pay juga alur QRIS, BankPay alur transfer rekening —
         judul notifikasi ikut menyesuaikan. */
      const failTitle = (method.qris || method.lpay || method.ffpayQris)
        ? 'Gagal Membuat Kode QRIS'
        : method.bankpay
          ? 'Gagal Membuat Instruksi Transfer'
          : 'Gagal Membuat Virtual Account';
      showNotif({ title: failTitle, description: err?.message || 'Coba lagi beberapa saat lagi ya.' });
    }
  };

  return (
    <div className="page-isi-ulang" style={{ backgroundImage: `url(${img_3})` }}>
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/home'); }}>
                    <img src={img_1} alt="Back Icon" />
                  </button>
                  <h1 className="header-title">Isi Ulang Saldo</h1>
                </header>
              </section>
              <section id="section-topup-input">
                <div className="topup-container">
                  <p className="input-label">Masukkan Nominal Isi Ulang</p>
                  <div className="input-wrapper">
                    <span className="currency-symbol">Rp</span>
                    {/* Kursor dekoratif kedip-kedip penanda kolom bisa diketik. */}
                    <span className="focus-caret" aria-hidden="true">|</span>
                    <input type="text" inputMode="numeric" className="amount-input" placeholder="Masukkan nominal di sini" value={amountText} onChange={(e) => setAmountText(e.target.value.replace(/\D/g, ''))} />
                  </div>
                  <div className="helper-texts">
                    <p className="min-amount">Minimal pengisian {formatIDR(MIN_DEPOSIT)}</p>
                    <p className="current-balance">Saldo saat ini {depositBalanceText}</p>
                  </div>
                </div>
              </section>
              <section id="section-payment-methods">
                <div className="payment-header">
                  <h2 className="section-title">Pilih Metode Pembayaran</h2>
                  <p className="section-subtitle">Pilih metode pembayaran yang kamu inginkan untuk melanjutkan proses isi ulang saldo.</p>
                </div>
                {PAYMENT_CATEGORIES.map((category) => (
                  <div className="payment-category" key={category}>
                    <h3 className="category-title">{category}</h3>
                    {PAYMENT_METHODS.filter((item) => item.category === category).map((item) => {
                      const isSelected = item.id === methodId;
                      return (
                        <label
                          className={`payment-card${isSelected ? ' selected' : ''}`}
                          key={item.id}
                          onClick={() => handleSelectMethod(item)}
                        >
                          <div className="card-content">
                            <h4 className="method-name">{item.name}</h4>
                            <p className="method-desc">{item.desc}</p>
                          </div>
                          <div className={`radio-btn${isSelected ? ' selected' : ''}`}>
                            {isSelected && <div className="radio-inner" />}
                          </div>
                          <input
                            type="radio"
                            name="payment_method"
                            value={item.id}
                            checked={isSelected}
                            onChange={() => handleSelectMethod(item)}
                            className="method-input"
                          />
                        </label>
                      );
                    })}
                  </div>
                ))}
              </section>
              <section id="section-information">
                <div className="warning-box">
                  <div className="icon-wrapper">
                    <img src={img_2} alt="Info" />
                  </div>
                  <p className="warning-text">
                    Pastikan nominal dan metode pembayaran sudah sesuai sebelum melanjutkan, karena <strong>estimasi waktu proses berbeda-beda</strong> untuk setiap metode.
                  </p>
                </div>
                <p className="disclaimer-text">
                  Layanan pengisian ulang saldo ini bekerja sama dengan pihak penyedia jasa pembayaran (payment gateway) pihak ketiga yang telah terverifikasi dan berizin resmi.
                </p>
              </section>
              <section id="section-footer">
                <div className="footer-divider" />
                <div className="footer-content">
                  <button className="btn-primary" disabled={submitting} onClick={(e) => { e.preventDefault(); handleContinue(); }}>{submitting ? 'Memproses...' : 'Lanjutkan Pembayaran'}</button>
                </div>
              </section>
            </div>

    </div>
  );
}
