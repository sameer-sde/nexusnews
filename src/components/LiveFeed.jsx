import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import { NEWS_CATEGORIES } from '../data/countries';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function LiveFeed() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { articles, loading, fetchByCategory } = useNews();

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    fetchByCategory(cat);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Live Intelligence Feed</div>
        <div className="page-subtitle">REAL-TIME GLOBAL NEWS · CLASSIFIED SOURCES</div>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {NEWS_CATEGORIES.map(cat => (
          <button key={cat} className={`tag ${activeCategory === cat ? 'active' : ''}`} onClick={() => handleCategory(cat)}>{cat}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card" style={{ height: 100 }}>
              <div className="loading-bar"><div className="loading-bar-fill" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {articles.map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <div className="news-card" style={{ height: '100%' }}>
                {a.urlToImage && (
                  <img src={a.urlToImage} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6, marginBottom: 10 }}
                    onError={e => e.target.style.display = 'none'} />
                )}
                <div className="news-card-source">{a.source?.name}</div>
                <div className="news-card-title">{a.title}</div>
                <div className="news-card-desc">{a.description?.slice(0, 120)}{a.description?.length > 120 ? '...' : ''}</div>
                <div className="news-card-meta">
                  <span>{timeAgo(a.publishedAt)}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>READ →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
