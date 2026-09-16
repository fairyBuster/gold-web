import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFaqs } from '../../lib/faqApi.js';
import img_1 from '../../assets/images/109_2465.svg';
import img_2 from '../../assets/images/109_2472.svg';
import img_3 from '../../assets/images/109_2498.svg';
import img_4 from '../../assets/images/109_2506.svg';
import img_11 from '../../assets/images/109_2556.svg';
import img_12 from '../../assets/images/109_2563.svg';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for PertanyaanUmum — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-pertanyaan-umum to isolate this page. */

.page-pertanyaan-umum {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #fffbf4;
    background-image: radial-gradient(circle at top right, rgba(255, 201, 60, 0.2) 0%, transparent 50%),
                      radial-gradient(circle at 80% 10%, rgba(255, 159, 28, 0.15) 0%, transparent 40%);
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  width: 100%;
}

.page-pertanyaan-umum section {
    max-width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    width: 100%;
}

.page-pertanyaan-umum, .page-pertanyaan-umum * {
    box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-pertanyaan-umum #header .top-bar {
    display: flex;
    align-items: center;
    padding: 20px;
    gap: 14px;
}
.page-pertanyaan-umum #header .btn-back {
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
.page-pertanyaan-umum #header .btn-back:hover {
    background-color: #ebe4d8;
}
.page-pertanyaan-umum #header .title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1410;
    margin: 0;
}

/* CSS for section section:Search */
.page-pertanyaan-umum #search .search-container {
    padding: 0 20px 16px;
}
.page-pertanyaan-umum #search .search-box {
    display: flex;
    align-items: center;
    background-color: #f6f1e9;
    border-radius: 14px;
    padding: 12px 14px;
    gap: 10px;
}
.page-pertanyaan-umum #search .search-input {
    border: none;
    background: transparent;
    font-size: 14px;
    color: #1a1410;
    width: 100%;
    outline: none;
    font-family: inherit;
}
.page-pertanyaan-umum #search .search-input::placeholder {
    color: #a79c8f;
}

/* CSS for section section:Categories */
.page-pertanyaan-umum #categories .categories-scroll {
    display: flex;
    gap: 6px;
    padding: 0 20px 18px;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
}
.page-pertanyaan-umum #categories .categories-scroll::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
}
.page-pertanyaan-umum #categories .chip {
    padding: 8px 14px;
    border-radius: 20px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    font-family: inherit;
    transition: all 0.2s ease;
}
.page-pertanyaan-umum #categories .chip.active {
    background-color: #1a1410;
    color: #fff9f2;
}
.page-pertanyaan-umum #categories .chip:not(.active) {
    background-color: #f6f1e9;
    color: #514840;
}
.page-pertanyaan-umum #categories .chip:not(.active):hover {
    background-color: #ebe4d8;
}

/* CSS for section section:FAQ */
.page-pertanyaan-umum #faq .faq-container {
    padding: 0 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.page-pertanyaan-umum #faq .faq-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.page-pertanyaan-umum #faq .group-title {
    font-size: 12px;
    font-weight: 700;
    color: #a79c8f;
    text-transform: uppercase;
    margin: 0 0 0 2px;
    letter-spacing: 0.5px;
}
.page-pertanyaan-umum #faq .card {
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s ease;
}
.page-pertanyaan-umum #faq .card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.page-pertanyaan-umum #faq .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    cursor: pointer;
    gap: 16px;
}
.page-pertanyaan-umum #faq .question {
    font-size: 14px;
    font-weight: 600;
    color: #1a1410;
    line-height: 1.3;
}
.page-pertanyaan-umum #faq .card-body {
    padding: 0 16px 16px;
}
.page-pertanyaan-umum #faq .card-body p {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: #514840;
}

/* CSS for section section:Contact */
.page-pertanyaan-umum #contact .contact-container {
    padding: 6px 20px 24px;
}
.page-pertanyaan-umum #contact .contact-card {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border: 1px solid rgba(26, 20, 16, 0.22);
    border-radius: 16px;
    padding: 16px;
    text-decoration: none;
    gap: 12px;
    transition: background-color 0.2s ease;
}
.page-pertanyaan-umum #contact .contact-card:hover {
    background-color: #fafafa;
}
.page-pertanyaan-umum #contact .icon-wrapper {
    width: 38px;
    height: 38px;
    border-radius: 19px;
    background-color: rgba(255, 159, 28, 0.14);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}
.page-pertanyaan-umum #contact .text-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex-grow: 1;
}
.page-pertanyaan-umum #contact .title {
    font-size: 14px;
    font-weight: 600;
    color: #1a1410;
}
.page-pertanyaan-umum #contact .subtitle {
    font-size: 12px;
    color: #a79c8f;
}
.page-pertanyaan-umum #contact .arrow {
    flex-shrink: 0;
}
`;

/* Dipakai kalau API belum bisa dihubungi — biar halaman tetap ada isinya. */
const FALLBACK_FAQS = [
  { id: 'a1', category: 'Akun', question: 'Bagaimana cara verifikasi akun?', answer: 'Buka menu Edit Profil, lalu unggah KTP dan foto selfie. Verifikasi biasanya selesai dalam 1x24 jam kerja.' },
  { id: 'a2', category: 'Akun', question: 'Bisakah ganti nomor telepon terdaftar?', answer: 'Bisa. Hubungi CS lewat menu Hubungi CS dengan menyertakan nomor lama dan nomor baru.' },
  { id: 's1', category: 'Saldo & Transaksi', question: 'Bagaimana cara isi ulang saldo?', answer: 'Masuk ke menu Isi Ulang, pilih nominal, lalu bayar lewat QRIS atau Virtual Account.' },
  { id: 's2', category: 'Saldo & Transaksi', question: 'Berapa lama proses tarik dana?', answer: 'Diproses 1-24 jam kerja pada jam operasional 08:00-20:00 WIB.' },
  { id: 's3', category: 'Saldo & Transaksi', question: 'Kenapa transaksi saya gagal?', answer: 'Penyebab umum: saldo tidak cukup, rekening tujuan tidak valid, atau batas transaksi harian tercapai.' },
  { id: 'e1', category: 'Emas Digital', question: 'Apakah emas digital aman?', answer: 'Emas digital disimpan di fasilitas penyimpanan berizin dan diasuransikan penuh.' },
  { id: 'e2', category: 'Emas Digital', question: 'Bagaimana cara cetak emas fisik?', answer: 'Buka menu Emas Digital, pilih Cetak Emas, tentukan pecahan dan alamat pengiriman.' },
];

export default function PertanyaanUmum() {
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [openId, setOpenId] = useState(null);

  /* FAQ dikelola dari Django admin; kalau gagal, pakai daftar bawaan di atas. */
  useEffect(() => {
    let active = true;
    fetchFaqs()
      .then((list) => {
        if (active && list.length) setFaqs(list);
      })
      .catch(() => {
        /* diamkan — fallback sudah tampil */
      });
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = [];
    faqs.forEach((faq) => {
      if (faq.category && !unique.includes(faq.category)) unique.push(faq.category);
    });
    return ['Semua', ...unique];
  }, [faqs]);

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = faqs.filter((faq) => {
      const matchCategory = category === 'Semua' || faq.category === category;
      const matchQuery = !needle
        || String(faq.question).toLowerCase().includes(needle)
        || String(faq.answer).toLowerCase().includes(needle);
      return matchCategory && matchQuery;
    });
    const byCategory = new Map();
    filtered.forEach((faq) => {
      if (!byCategory.has(faq.category)) byCategory.set(faq.category, []);
      byCategory.get(faq.category).push(faq);
    });
    return Array.from(byCategory.entries()).map(([title, items]) => ({ title, items }));
  }, [faqs, query, category]);

  return (
    <div className="page-pertanyaan-umum">
      <style>{styles}</style>
      <div>
              <section id="header">
                <header className="top-bar">
                  <button className="btn-back" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="Back Icon" />
                  </button>
                  <h1 className="title">Pusat Bantuan</h1>
                </header>
              </section>
              <section id="search">
                <div className="search-container">
                  <div className="search-box">
                    <img src={img_2} alt="Search Icon" />
                    <input
                      type="text"
                      placeholder="Cari pertanyaan"
                      className="search-input"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
              </section>
              <section id="categories">
                <div className="categories-scroll">
                  {categories.map((name) => (
                    <button
                      key={name}
                      className={`chip${category === name ? ' active' : ''}`}
                      onClick={() => setCategory(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </section>
              <section id="faq">
                <div className="faq-container">
                  {groups.length === 0 && (
                    <p className="group-title">Tidak ada pertanyaan yang cocok.</p>
                  )}
                  {groups.map((group) => (
                    <div className="faq-group" key={group.title}>
                      <h2 className="group-title">{group.title.toUpperCase()}</h2>
                      {group.items.map((faq) => {
                        const isOpen = openId === faq.id;
                        return (
                          <div className={`card${isOpen ? ' expanded' : ''}`} key={faq.id}>
                            <div
                              className="card-header"
                              onClick={() => setOpenId(isOpen ? null : faq.id)}
                            >
                              <span className="question">{faq.question}</span>
                              <img src={isOpen ? img_3 : img_4} alt={isOpen ? 'Collapse Icon' : 'Expand Icon'} />
                            </div>
                            {isOpen && (
                              <div className="card-body">
                                <p>{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </section>
              <section id="contact">
                <div className="contact-container">
                  <Link to="/index/support/hubungi-cs" className="contact-card">
                    <div className="icon-wrapper">
                      <img src={img_11} alt="Chat Icon" />
                    </div>
                    <div className="text-content">
                      <span className="title">Masih butuh bantuan?</span>
                      <span className="subtitle">Hubungi tim CS kami langsung</span>
                    </div>
                    <img src={img_12} alt="Arrow Right Icon" className="arrow" />
                  </Link>
                </div>
              </section>
            </div>

    </div>
  );
}
