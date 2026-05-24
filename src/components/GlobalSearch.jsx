import { useState } from 'react';
import { useNews } from '../hooks/useNews';

export default function GlobalSearch() {
  const { articles, loading } = useNews();
  const [query, setQuery] = useState('');

  const results = query.trim().length > 1
    ? articles.filter(a =>
        a.title?.toLowerCase().includes(query.toLowerCase()) ||
        a.description?.toLowerCase().includes(query.toLowerCase()) ||
        a.source?.name?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Global Search</div>
        <div className="page-subtitle">SEARCH ACROSS ALL INDEXED INTELLIGENCE</div>
      </div>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 16 }}>◈</span>
        <input
          className="input-field"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search news, sources, topics..."
          style={{ paddingLeft: 44, fontSize: 15, height: 48 }}
          autoFocus
        />
        {query && <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>{results.length} results</span>}
      </div>

      {!query && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-dim)', marginBottom: 12 }}>◈</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>NEXUS GLOBAL SEARCH</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Search across {articles.length} indexed intelligence articles.</div>
          <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Russia', 'Ukraine', 'Iran', 'NATO', 'cyber', 'sanctions', 'AI', 'climate'].map(t => (
              <button key={t} className="tag" onClick={() => setQuery(t)}>{t}</button>
            ))}
          </div>
        </div>
      )}

      {query && results.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>No intelligence found for "{query}"</div>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <div className="news-card">
                <div className="news-card-source">{a.source?.name}</div>
                <div className="news-card-title" dangerouslySetInnerHTML={{
                  __html: a.title?.replace(new RegExp(`(${query})`, 'gi'), '<mark style="background:rgba(0,212,255,0.2);color:var(--accent);border-radius:2px;">$1</mark>')
                }} />
                <div className="news-card-desc">{a.description?.slice(0, 140)}...</div>
                <div className="news-card-meta"><span style={{ color: 'var(--accent)' }}>READ →</span></div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
