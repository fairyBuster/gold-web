import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NotifCard from '../../components/NotifCard.jsx';
import img_1 from '../../assets/images/41_1038.svg';
import img_2 from '../../assets/images/67_225.svg';
import img_3 from '../../assets/images/7f43db77fdc0a54172b923d3fc56ba8f36714aa6.png';
/* Article detail — GET /api/news/{id}/ (public endpoint). */
import { getNews, listNews } from '../../lib/newsApi.js';

/* Page styles are kept inline in this file so the page is a single-file import. */
const styles = `
/* Scoped styles for DetailBerita — converted from global.css + inline section styles.
   All selectors are pre-fixed with .page-detail-berita to isolate this page. */

.page-detail-berita {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.page-detail-berita .app-wrapper {
  width: 100%;
  max-width: 100%;
  background-color: #fffbf4;
  background-image: 
    radial-gradient(circle at 85% 5%, rgba(255, 201, 60, 0.25) 0%, transparent 50%),
    radial-gradient(circle at 50% 95%, rgba(255, 159, 28, 0.15) 0%, transparent 60%);
  box-shadow: 0px 30px 60px 0px rgba(26, 20, 16, 0.18);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-detail-berita, .page-detail-berita * {
  box-sizing: border-box;
}

/* ---- inline section styles ---- */

/* CSS for section section:Header */
.page-detail-berita #section-header {
    width: 100%;
  }
  .page-detail-berita .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 16px 20px;
  }
  .page-detail-berita .icon-btn {
    background-color: #f6f1e9;
    border: none;
    border-radius: 11px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    transition: background-color 0.2s ease;
  }
  .page-detail-berita .icon-btn:hover {
    background-color: #e8e2d8;
  }
  .page-detail-berita .icon-btn img {
    width: 16px;
    height: 16px;
    display: block;
  }

/* CSS for section section:Article */
.page-detail-berita #section-article {
    width: 100%;
    flex: 1;
  }
  .page-detail-berita .article-container {
    padding: 0 20px 24px 20px;
    display: flex;
    flex-direction: column;
  }
  
  .page-detail-berita .cover-image-placeholder {
    background-color: #f6f1e9;
    border: 1px dashed rgba(26, 20, 16, 0.22);
    border-radius: 16px;
    height: 233.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  .page-detail-berita .cover-image-placeholder span {
    color: #a79c8f;
    font-size: 14px;
    font-weight: 400;
  }

  .page-detail-berita .article-header {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .page-detail-berita .category-badge {
    background-color: rgba(255, 159, 28, 0.14);
    color: #e8790c;
    padding: 3px 9px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .page-detail-berita .article-title {
    color: #1a1410;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
  }

  .page-detail-berita .author-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
  }
  .page-detail-berita .author-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
  .page-detail-berita .author-info {
    display: flex;
    flex-direction: column;
  }
  .page-detail-berita .author-name {
    color: #1a1410;
    font-size: 14px;
    font-weight: 700;
  }
  .page-detail-berita .publish-details {
    color: #a79c8f;
    font-size: 12px;
    margin-top: 2px;
  }

  .page-detail-berita .article-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .page-detail-berita .article-body p {
    color: #514840;
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
  }
  .page-detail-berita .article-body h2 {
    color: #1a1410;
    font-size: 16px;
    font-weight: 700;
    margin: 12px 0 0 0;
  }
  .page-detail-berita .article-body blockquote {
    background-color: #f6f1e9;
    border: 1px solid #e8790c;
    border-radius: 10px;
    padding: 16px 16px 14px 16px;
    margin: 4px 0;
    color: #514840;
    font-size: 14px;
    font-style: italic;
    line-height: 1.5;
  }
  .page-detail-berita .article-status {
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

/* Estimated reading time at ~200 words per minute, never below 1. */
function readingMinutes(body) {
  const words = String(body || '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function DetailBerita() {
  const location = useLocation();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // The card that navigated here hands over the id (Router state, with a
  // sessionStorage backstop for reloads); direct visits fall back to the newest item.
  useEffect(() => {
    let active = true;
    const stateId = location.state?.newsId;
    const storedId = sessionStorage.getItem('je_news_id');
    const requested = stateId || storedId;

    const load = requested
      ? getNews(requested)
      : listNews().then((payload) => {
          const first = Array.isArray(payload?.results) ? payload.results[0] : null;
          if (!first) throw new Error('empty');
          return getNews(first.id);
        });

    load
      .then((item) => {
        if (!active) return;
        setArticle(item);
        if (item && item.id) sessionStorage.setItem('je_news_id', String(item.id));
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
  }, [location.state]);

  const paragraphs = String((article && article.body) || '')
    .split(/\n+/)
    .filter((paragraph) => paragraph.trim());
  const publishLine = article
    ? [formatNewsDate(article.published_at), `${readingMinutes(article.body)} menit baca`]
        .filter(Boolean)
        .join(' • ')
    : '';

  return (
    <div className="page-detail-berita">
      <style>{styles}</style>
      <div>
              <section id="section-header">
                <header className="top-nav">
                  <button className="icon-btn" aria-label="Go back" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                    <img src={img_1} alt="" />
                  </button>
                  <button className="icon-btn" aria-label="Buka menu Tim Afiliasi" onClick={(e) => { e.preventDefault(); navigate('/affiliate/tim-afiliasi'); }}>
                    <img src={img_2} alt="" />
                  </button>
                </header>
              </section>
              <section id="section-article">
                <article className="article-container">
                  {loading && <p className="article-status">Memuat berita...</p>}
                  {!loading && error && (
                    <NotifCard variant="error" title="Gagal Memuat Berita" description={error} />
                  )}
                  {!loading && !error && article && (
                    <>
                      <div className="cover-image-placeholder">
                        <span>+ Gambar Sampul Berita</span>
                      </div>
                      <div className="article-header">
                        <span className="category-badge">{article.category_name}</span>
                        <h1 className="article-title">{article.title}</h1>
                      </div>
                      <div className="author-meta">
                        <img src={img_3} alt="Tim Redaksi JelajahEmas" className="author-avatar" />
                        <div className="author-info">
                          <div className="author-name">{article.author_name || 'Tim Redaksi JelajahEmas'}</div>
                          <div className="publish-details">{publishLine}</div>
                        </div>
                      </div>
                      <div className="article-body">
                        {paragraphs.map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </>
                  )}
                </article>
              </section>
            </div>

    </div>
  );
}
