import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  /* "Aktifkan" runs the real purchase; when the backend rejects it (balance,
     stock or purchase limit), the modal stays open with its message. */
  const handleConfirm = () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError('');
    purchaseProduct(productId)
      .then(() => navigate('/assets/aset-saya-01'))
      .catch((err) => {
        setSubmitError(err?.message || 'Aktivasi gagal. Coba lagi.');
        setSubmitting(false);
      });
  };

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
          <button type="button" className="primary-btn" onClick={() => navigate('/assets/asset-01')}>
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
    { label: 'Pembagian', value: profitLabel(product) },
    { label: 'Frekuensi', value: claimLabel(product) },
    { label: 'Sumber Dana', value: fundSourceLabel(product) },
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
