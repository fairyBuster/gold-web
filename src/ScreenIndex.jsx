import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { groups, pages } from './pages-data.js';

export default function ScreenIndex() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (page) =>
        page.label.toLowerCase().includes(q) ||
        page.path.toLowerCase().includes(q) ||
        page.component.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="screen-index">
      <header className="screen-index__header">
        <h1 className="screen-index__title">
          Jelajah Emas <span>React</span>
        </h1>
        <p className="screen-index__subtitle">
          {pages.length} halaman dalam {groups.length} kelompok fitur — peta alur aplikasi
        </p>
        <input
          className="screen-index__search"
          type="search"
          placeholder="Cari halaman, path, atau komponen..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </header>

      {groups.map((group) => {
        const items = filtered.filter((page) => page.group === group.key);
        if (!items.length) return null;
        return (
          <section key={group.key} className="screen-index__group">
            <h2 className="screen-index__group-title">{group.title}</h2>
            <div className="screen-index__grid">
              {items.map((page) => (
                <Link key={page.path} to={page.path} className="screen-index__card">
                  <span className="screen-index__card-label">{page.label}</span>
                  <span className="screen-index__card-path">{page.path}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && <p className="screen-index__empty">Tidak ada hasil untuk "{query}"</p>}
    </div>
  );
}
