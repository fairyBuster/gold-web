import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import img_1 from '../../assets/images/109_2465.svg';
import img_2 from '../../assets/images/77ee91c8dada95217ef849cd09311a9e69dfd60e.png';
import img_3 from '../../assets/images/109_2590.svg';
import img_4 from '../../assets/images/26f0f85c3f131cbe6775a26cf4afe79775404786.png';
import img_5 from '../../assets/images/109_2590.svg';
import img_6 from '../../assets/images/b13b7a474443dcb448772d73d8251dbab67b8f14.png';
import img_7 from '../../assets/images/109_2590.svg';
import img_8 from '../../assets/images/a0f4e57692255e6234cdb5455f19fda6e1a96e82.png';
import img_9 from '../../assets/images/109_2590.svg';
import img_10 from '../../assets/images/3996294870fd174373ab40264b02a36e21eea57f.png';
import img_11 from '../../assets/images/109_2590.svg';
import pageBg from '../../assets/images/083535.png';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for RiwayatTransaksi — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-riwayat-transaksi to isolate this page. */

.page-riwayat-transaksi {
    font-family: 'Inter', sans-serif;
    margin: 0 auto;
    padding: 0;
    max-width: 100%;
    min-height: 100vh;
    background-color: #fffbf4;
    /* Latar artwork 083535.png (dipasang inline di root), direntangkan penuh. */
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: top center;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
    color: #1a1410;
    box-sizing: border-box;
  width: 100%;
}

.page-riwayat-transaksi *,.page-riwayat-transaksi  *::before,.page-riwayat-transaksi  *::after {
    box-sizing: inherit;
}

.page-riwayat-transaksi h1,.page-riwayat-transaksi  h2,.page-riwayat-transaksi  h3,.page-riwayat-transaksi  p {
    margin: 0;
}

.page-riwayat-transaksi a {
    text-decoration: none;
    color: inherit;
    -webkit-tap-highlight-color: transparent;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-riwayat-transaksi #section-header {
    padding: 20px 20px 16px 20px;
}
.page-riwayat-transaksi .header {
    display: flex;
    align-items: center;
    gap: 14px;
}
.page-riwayat-transaksi .back-btn {
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
    transition: background-color 0.2s ease;
}
.page-riwayat-transaksi .back-btn:hover,.page-riwayat-transaksi  .back-btn:active {
    background-color: #ebe3d5;
}
.page-riwayat-transaksi .back-btn img {
    width: 16px;
    height: 16px;
}
.page-riwayat-transaksi .page-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
}

/* CSS for section section:Description */
.page-riwayat-transaksi #section-description {
    padding: 0 20px 20px 20px;
}
.page-riwayat-transaksi .description-text {
    font-size: 14px;
    line-height: 1.5;
    color: #a79c8f;
    font-weight: 400;
}

/* CSS for section section:HistoryList */
.page-riwayat-transaksi #section-history-list {
    padding: 0 20px 40px 20px;
}
.page-riwayat-transaksi .list-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.page-riwayat-transaksi .history-card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 16px;
    padding: 13px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background-color 0.2s ease;
}
.page-riwayat-transaksi .history-card:hover {
    background-color: #fdfaf3;
}
.page-riwayat-transaksi .card-icon {
    width: 43px;
    height: 43px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
}
.page-riwayat-transaksi .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}
.page-riwayat-transaksi .card-title {
    font-size: 14px;
    font-weight: 700;
    color: #1a1410;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.page-riwayat-transaksi .card-subtitle {
    font-size: 12px;
    font-weight: 400;
    color: #a79c8f;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.page-riwayat-transaksi .card-subtitle span {
    display: inline-block;
}
/* Teks yang lebih panjang dari kartunya berjalan bolak-balik (bukan
   terpotong) — jarak geser (--slide) dihitung dari overflow di JS. */
.page-riwayat-transaksi .card-subtitle.is-marquee span {
    animation: rtrans-subtitle-slide 8s ease-in-out infinite;
}
@keyframes rtrans-subtitle-slide {
    0%, 12% { transform: translateX(0); }
    46%, 58% { transform: translateX(var(--slide, 0px)); }
    92%, 100% { transform: translateX(0); }
}
.page-riwayat-transaksi .card-arrow {
    width: 16px;
    height: 16px;
    object-fit: contain;
    flex-shrink: 0;
}
`;

export default function RiwayatTransaksi() {
  const rootRef = useRef(null);

  /* Teks subtitel yang melebihi lebar kartunya diberi class "is-marquee"
     supaya berjalan bolak-balik, bukan terpotong "...". Diukur ulang saat
     resize dan setelah font Inter selesai dimuat. */
  useEffect(() => {
    const measure = () => {
      const items = rootRef.current?.querySelectorAll('.card-subtitle') ?? [];
      items.forEach((el) => {
        const span = el.firstElementChild;
        if (!span) return;
        const overflow = el.scrollWidth - el.clientWidth;
        if (overflow > 0) {
          span.style.setProperty('--slide', `${-overflow}px`);
          el.classList.add('is-marquee');
        } else {
          el.classList.remove('is-marquee');
          span.style.removeProperty('--slide');
        }
      });
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div className="page-riwayat-transaksi" ref={rootRef} style={{ backgroundImage: `url(${pageBg})` }}>
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="header">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="Back Icon" />
                  </button>
                  <h1 className="page-title">Riwayat Transaksi</h1>
                </header>
              </section>
              <section id="section-description">
                <p className="description-text">
               Plih kategori riwayat yang mau kamu lihat.
                </p>
              </section>
              <section id="section-history-list">
                <div className="list-container">
                  <Link to="/index/transactions/riwayat-isi-ulang" className="history-card">
                    <img src={img_2} alt="Riwayat Isi Ulang" className="card-icon" />
                    <div className="card-content">
                      <h2 className="card-title">Riwayat Isi Ulang</h2>
                      <p className="card-subtitle"><span>Semua transaksi penambahan saldo</span></p>
                    </div>
                    <img src={img_3} alt="Arrow Right" className="card-arrow" />
                  </Link>
                  <Link to="/index/transactions/riwayat-penarikan" className="history-card">
                    <img src={img_4} alt="Riwayat Penarikan" className="card-icon" />
                    <div className="card-content">
                      <h2 className="card-title">Riwayat Penarikan</h2>
                      <p className="card-subtitle"><span>Semua transaksi tarik dana ke rekening</span></p>
                    </div>
                    <img src={img_5} alt="Arrow Right" className="card-arrow" />
                  </Link>
                  <Link to="/index/assets/riwayat-aset-saya" className="history-card">
                    <img src={img_6} alt="Riwayat Aset Saya" className="card-icon" />
                    <div className="card-content">
                      <h2 className="card-title">Riwayat Aset Saya</h2>
                      <p className="card-subtitle"><span>Transaksi beli/jual emas &amp; keuntungan spread</span></p>
                    </div>
                    <img src={img_7} alt="Arrow Right" className="card-arrow" />
                  </Link>
                  <Link to="/index/affiliate/riwayat-komisi" className="history-card">
                    <img src={img_8} alt="Riwayat Komisi" className="card-icon" />
                    <div className="card-content">
                      <h2 className="card-title">Riwayat Komisi</h2>
                      <p className="card-subtitle"><span>Komisi dari Tim &amp; Afiliasi kamu</span></p>
                    </div>
                    <img src={img_9} alt="Arrow Right" className="card-arrow" />
                  </Link>
                  <Link to="/index/rewards/riwayat-lainnya" className="history-card">
                    <img src={img_10} alt="Riwayat Lainnya" className="card-icon" />
                    <div className="card-content">
                      <h2 className="card-title">Riwayat Lainnya</h2>
                      <p className="card-subtitle"><span>Cetak emas, investasi rutin, dan penukaran poin</span></p>
                    </div>
                    <img src={img_11} alt="Arrow Right" className="card-arrow" />
                  </Link>
                </div>
              </section>
            </div>

    </div>
  );
}
