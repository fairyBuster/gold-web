import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { goBack } from '../../lib/backNav.js';
import { fetchFaqs } from '../../lib/faqApi.js';
import NotifCard from '../../components/NotifCard.jsx';
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

/* Skeleton loading — pengganti data dummy selagi FAQ dimuat dari API.
   Bentuknya meniru chip kategori + kartu pertanyaan supaya layout tidak
   melompat saat data asli muncul. */
.page-pertanyaan-umum .chip-skeleton,
.page-pertanyaan-umum .faq-skeleton-title,
.page-pertanyaan-umum .faq-skeleton-bar {
    display: inline-block;
    background: linear-gradient(90deg, rgba(26, 20, 16, 0.08) 25%, rgba(26, 20, 16, 0.16) 37%, rgba(26, 20, 16, 0.08) 63%);
    background-size: 400% 100%;
    animation: faq-shimmer 1.4s ease infinite;
}
@keyframes faq-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}
.page-pertanyaan-umum .chip-skeleton {
    height: 34px;
    border-radius: 20px;
}
.page-pertanyaan-umum .faq-skeleton-title {
    display: block;
    height: 10px;
    width: 96px;
    margin: 0 0 0 2px;
    border-radius: 5px;
}
.page-pertanyaan-umum .faq-skeleton-card {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border: 1px solid #efe7dc;
    border-radius: 14px;
    padding: 14px 16px;
}
.page-pertanyaan-umum .faq-skeleton-bar {
    height: 14px;
    border-radius: 6px;
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

export default function PertanyaanUmum() {
  const [faqs, setFaqs] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [openId, setOpenId] = useState(null);

  /* FAQ dikelola dari Django admin: skeleton tampil selagi dimuat, kartu
     error kalau request gagal — tidak ada lagi data dummy. */
  useEffect(() => {
    let active = true;
    fetchFaqs()
      .then((list) => {
        if (active) setFaqs(list);
      })
      .catch((err) => {
        if (active) setError(err?.message || 'Gagal memuat pertanyaan.');
      });
    return () => {
      active = false;
    };
  }, []);

  const loading = faqs === null && !error;

  const categories = useMemo(() => {
    const unique = [];
    (faqs || []).forEach((faq) => {
      if (faq.category && !unique.includes(faq.category)) unique.push(faq.category);
    });
    return ['Semua', ...unique];
  }, [faqs]);

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = (faqs || []).filter((faq) => {
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
                  <button className="btn-back" aria-label="Go back" onClick={(e) => { e.preventDefault(); goBack('/index/support/hubungi-cs'); }}>
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
                  {loading
                    ? [72, 96, 84].map((width) => (
                        <span key={width} className="chip-skeleton" style={{ width }} aria-hidden="true" />
                      ))
                    : categories.map((name) => (
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
                <div className="faq-container" aria-busy={loading}>
                  {loading && (
                    <div className="faq-group">
                      <span className="faq-skeleton-title" aria-hidden="true" />
                      {['58%', '76%', '64%', '70%'].map((width) => (
                        <div className="faq-skeleton-card" key={width}>
                          <span className="faq-skeleton-bar" style={{ width }} aria-hidden="true" />
                        </div>
                      ))}
                    </div>
                  )}
                  {error && (
                    <NotifCard variant="error" title="Gagal Memuat Pertanyaan" description={error} />
                  )}
                  {!loading && !error && groups.length === 0 && (
                    <p className="group-title">{query.trim() || category !== 'Semua' ? 'Tidak ada pertanyaan yang cocok.' : 'Belum ada pertanyaan.'}</p>
                  )}
                  {!loading && !error && groups.map((group) => (
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
