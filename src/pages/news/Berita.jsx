import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NotifCard from '../../components/NotifCard.jsx';
import img_1 from '../../assets/images/67_135.svg';
import img_2 from '../../assets/images/67_142.svg';
/* News list — GET /api/news/ (public endpoint). */
import { listNews } from '../../lib/newsApi.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for Berita — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-berita to isolate this page. */

.page-berita {
  background-color: #f0f0f0;
  min-height: 100vh;
  width: 100%;
}

.page-berita {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  background-color: #fffbf4;
  background-image: radial-gradient(circle at top right, rgba(255, 200, 100, 0.15), transparent 60%);
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  min-height: 100vh;
  color: #1a1410;
  box-sizing: border-box;
}

.page-berita *,.page-berita  *:before,.page-berita  *:after {
  box-sizing: inherit;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-berita .header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 20px 16px 20px;
}
.page-berita .back-btn {
  background-color: #f6f1e9;
  border: none;
  border-radius: 11px;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.page-berita .page-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #1a1410;
}

/* CSS for section section:Search */
.page-berita #search-section {
  padding: 0 20px;
  margin-bottom: 14px;
}
.page-berita .search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f6f1e9;
  border-radius: 14px;
  padding: 12px 14px;
}
.page-berita .search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #1a1410;
  width: 100%;
  font-family: inherit;
}
.page-berita .search-box input::placeholder {
  color: #a79c8f;
}

/* CSS for section section:Categories */
.page-berita #categories-section {
  margin-bottom: 18px;
}
.page-berita .categories-scroll {
  display: flex;
  gap: 8px;
  padding: 0 20px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}
.page-berita .categories-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
.page-berita .category-chip {
  background-color: #f6f1e9;
  color: #514840;
  border: none;
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  font-family: inherit;
}
.page-berita .category-chip.active {
  background-color: rgba(255, 159, 28, 0.14);
  color: #e8790c;
}

/* CSS for section section:NewsList */
.page-berita #news-list-section {
  padding: 0 20px 162px 20px;
  display: flex;
  flex-direction: column;
}
.page-berita .news-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.page-berita .news-image {
  width: 88px;
  height: 88px;
  background-color: #f6f1e9;
  border: 1px solid rgba(26, 20, 16, 0.22);
  border-radius: 14px;
  flex-shrink: 0;
}
.page-berita .news-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 5px 0;
}
.page-berita .news-tag {
  align-self: flex-start;
  background-color: rgba(255, 159, 28, 0.14);
  color: #e8790c;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}
.page-berita .news-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1410;
  margin: 0;
  line-height: 1.3;
}
.page-berita .news-date {
  font-size: 12px;
  color: #a79c8f;
  margin-top: auto;
}
.page-berita .news-divider {
  height: 1px;
  background-color: #efe7dc;
  border: none;
  margin: 0 0 16px 0;
  width: 100%;
}
.page-berita .news-status {
  color: #a79c8f;
  font-size: 14px;
  margin: 0;
  padding: 8px 0;
}
`;

/* "YYYY-MM-DD HH:mm:ss" -> "27 Agu 2026" (mockup date style). Parsed manually so
   iOS Safari never sees the non-ISO space separator. */
const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatNewsDate(value) {
  const [year, month, day] = String(value || '').split(' ')[0].split('-');
  const monthName = MONTHS_ID[Number(month) - 1];
  if (!year || !monthName || !day) return '';
  return `${day} ${monthName} ${year}`;
}

export default function Berita() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Whole feed, newest first — GET /api/news/ (public endpoint).
  useEffect(() => {
    let active = true;
    listNews()
      .then((payload) => {
        if (!active) return;
        setNews(Array.isArray(payload?.results) ? payload.results : []);
      })
      .catch(() => {
        if (active) setError('Gagal memuat berita.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Chip list follows the categories actually present in the feed.
  const categoryOptions = ['Semua'];
  news.forEach((item) => {
    if (item.category_name && !categoryOptions.includes(item.category_name)) {
      categoryOptions.push(item.category_name);
    }
  });

  // The backend ignores ?search=/?category=, so both filters run client-side.
  const queryNorm = query.trim().toLowerCase();
  const visibleNews = news.filter(
    (item) =>
      (activeCategory === 'Semua' || item.category_name === activeCategory) &&
      (!queryNorm || String(item.title || '').toLowerCase().includes(queryNorm))
  );

  return (
    <div className="page-berita">
      <style>{styles}</style>
      <div>
              <section id="header-section">
                <header className="header">
                  <button className="back-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="" />
                  </button>
                  <h1 className="page-title">Berita</h1>
                </header>
              </section>
              <section id="search-section">
                <div className="search-container">
                  <div className="search-box">
                    <img src={img_2} alt="" />
                    <input
                      type="text"
                      placeholder="Cari berita"
                      aria-label="Search news"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
              </section>
              <section id="categories-section">
                <nav className="categories-scroll" aria-label="News categories">
                  {categoryOptions.map((category) => (
                    <button
                      key={category}
                      className={`category-chip${category === activeCategory ? ' active' : ''}`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </nav>
              </section>
              <section id="news-list-section">
                {loading && <p className="news-status">Memuat berita...</p>}
                {!loading && error && (
                  <NotifCard variant="error" title="Gagal Memuat Berita" description={error} />
                )}
                {!loading && !error && news.length === 0 && (
                  <p className="news-status">Belum ada berita.</p>
                )}
                {!loading && !error && news.length > 0 && visibleNews.length === 0 && (
                  <p className="news-status">Berita tidak ditemukan.</p>
                )}
                {!loading &&
                  !error &&
                  visibleNews.map((item, index) => (
                    <Fragment key={item.id}>
                      {index > 0 && <hr className="news-divider" />}
                      <Link
                        to="/index/berita/detail"
                        state={{ newsId: item.id }}
                        className="news-item"
                        onClick={() => sessionStorage.setItem('je_news_id', String(item.id))}
                      >
                        <div className="news-image" />
                        <div className="news-content">
                          <span className="news-tag">{item.category_name}</span>
                          <h2 className="news-title">{item.title}</h2>
                          <time className="news-date">{formatNewsDate(item.published_at)}</time>
                        </div>
                      </Link>
                    </Fragment>
                  ))}
              </section>
            </div>

    </div>
  );
}
