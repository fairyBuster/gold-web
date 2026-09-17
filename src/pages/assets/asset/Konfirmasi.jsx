import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import ModalKonfirmasi from '../../../components/ModalKonfirmasi.jsx';
import NotifCard from '../../../components/NotifCard.jsx';
import { getProduct, purchaseProduct } from '../../../lib/productsApi.js';
import { formatRupiah } from '../../../lib/transactionFormat.js';
import {
  claimLabel,
  fundSourceLabel,
  profitLabel,
} from '../../../lib/productFormat.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for Konfirmasi — page shell + loading/error states.
   The modal itself lives in src/components/ModalKonfirmasi.jsx (styles inline in that file). */

.page-konfirmasi {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  width: 100%;
}
.page-konfirmasi, .page-konfirmasi * {
  box-sizing: border-box;
}

/* Shown while the product detail loads or when it is missing / failed. */
.page-konfirmasi .status-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 24px;
  text-align: center;
}
.page-konfirmasi .status-text {
  color: #514840;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  max-width: 300px;
}
.page-konfirmasi .primary-btn {
  background-color: #f1b04a;
  color: #1a1410;
  border: none;
  border-radius: 14px;
  padding: 13px 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}
.page-konfirmasi .primary-btn:hover {
  background-color: #e0a03a;
}
`;

export default function Konfirmasi() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /* Product id travels via Link state from Asset02; sessionStorage keeps hard reloads working. */
  const productId =
    location.state?.productId || Number(sessionStorage.getItem('je_asset_product_id')) || 0;

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      setError('Pilih rencana terlebih dahulu dari daftar program.');
      return undefined;
    }
    let active = true;
    getProduct(productId)
      .then((payload) => {
        if (active) setProduct(payload);
      })
      .catch((err) => {
        if (active) setError(err?.message || 'Gagal memuat detail rencana.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [productId]);

  /* "Aktifkan" runs the real purchase; when the backend rejects it (rank,
     balance, stock or purchase limit), the modal stays open with its message. */
  const handleConfirm = () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError('');
    purchaseProduct(productId)
      /* Success replaces the Konfirmasi entry in history so the back button
         can never return to this page once the flow has moved on. */
      .then(() => navigate('/index/assets/all', { replace: true }))
      .catch((err) => {
        /* Rejection copy ships under different payload keys ("product_id"
           for serializer errors, "error" for the view's own checks); scan the
           whole payload so each rejection case gets its own frontend copy. */
        const payloadText =
          err?.payload && typeof err.payload === 'object'
            ? JSON.stringify(err.payload).toLowerCase()
            : '';
        let message = err?.message || 'Aktivasi gagal. Coba lagi.';
        if (payloadText.includes('batas pembelian')) {
          message = 'Kesempatan pengguna baru untuk produk yang sama sudah habis.';
        } else if (payloadText.includes('rank minimal')) {
          message = 'Emas ini belum tersedia untuk anda';
        } else if (payloadText.includes('insufficient balance')) {
          message = 'Saldo tidak mencukupi. Silakan isi ulang.';
        }
        setSubmitError(message);
        setSubmitting(false);
      });
  };

  /* Konfirmasi is a one-shot step of the purchase flow: only a fresh forward
     navigation from the product detail page may open it. Back/forward,
     reloads and direct links bounce to the detail page, because once the flow
     has moved on this page must not be re-enterable. */
  if (navigationType !== 'PUSH') {
    return <Navigate to="/index/assets/asset-02" replace />;
  }

  if (loading) {
    return (
      <div className="page-konfirmasi">
        <style>{styles}</style>
        <div className="status-wrap">
          <p className="status-text">Memuat detail rencana...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-konfirmasi">
        <style>{styles}</style>
        <div className="status-wrap">
          <NotifCard variant="error" title="Rencana Tidak Tersedia" description={error || 'Detail rencana tidak tersedia.'} showClose={false} />
          <button type="button" className="primary-btn" onClick={() => navigate('/index/assets/asset-01')}>
            Lihat Rencana Lain
          </button>
        </div>
      </div>
    );
  }

  /* Modal summary mirrors the asset card semantics:
     Pembagian = the profit per claim, Frekuensi = the claim cycle,
     Estimasi Biaya (total) = the product price. */
  const rows = [
    { label: 'Jenis', value: product.name },
    { label: 'Pembagian manfaat', value: profitLabel(product) },
    // { label: 'Frekuensi', value: claimLabel(product) },
    { label: 'Sumber Dana', value: 'Saldo Jelajah Emas' },
  ];

  return (
    <div className="page-konfirmasi">
      <style>{styles}</style>
      <ModalKonfirmasi
        rows={rows}
        totalValue={formatRupiah(product.price)}
        busy={submitting}
        error={submitError}
        confirmLabel={submitting ? 'Memproses...' : 'Aktifkan'}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
