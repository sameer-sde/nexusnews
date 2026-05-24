import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import { generateTopicClusters } from '../hooks/useAI';

const URGENCY_COLOR = { critical: 'var(--accent2)', high: '#ff6b35', medium: 'var(--accent3)', low: 'var(--green)' };

export default function TopicClusters() {
  const { articles, loading } = useNews();
  const [clusters, setClusters] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [selected, setSelected] = useState(null);

  const generate = async () => {
    if (!articles.length) return;
    setGenerating(true);
    const result = await generateTopicClusters(articles);
    setClusters(result);
    setGenerating(false);
  };

  const getArticlesForCluster = (cluster) => {
    return (cluster.articles || []).map(idx => articles[idx]).filter(Boolean);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">Topic Clusters</div>
            <div className="page-subtitle">AI-GROUPED NEWS INTELLIGENCE · PATTERN DETECTION</div>
          </div>
          <button className="btn-primary" onClick={generate} disabled={generating || loading}>
            {generating ? '▌ CLUSTERING...' : clusters ? '↻ RE-CLUSTER' : '▶ CLUSTER TOPICS'}
          </button>
        </div>
      </div>

      {!clusters && !generating && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-dim)', marginBottom: 12 }}>⬡</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>AI TOPIC CLUSTERING ENGINE</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            AI will analyze all current news articles and group them into thematic intelligence clusters.
          </div>
          <button className="btn-primary" onClick={generate} disabled={loading}>▶ RUN CLUSTERING ANALYSIS</button>
        </div>
      )}

      {generating && (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>▌ AI ANALYZING {articles.length} ARTICLES...</div>
          <div className="loading-bar" style={{ maxWidth: 300, margin: '0 auto' }}><div className="loading-bar-fill" /></div>
        </div>
      )}

      {clusters && (
        <div className="grid-2">
          <div>
            <div className="section-title">Intelligence Clusters</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {clusters.map((cluster, i) => (
                <div key={i} className="card" style={{ cursor: 'pointer', borderLeft: `3px solid ${URGENCY_COLOR[cluster.urgency] || 'var(--accent)'}`, borderRadius: '0 8px 8px 0', background: selected === i ? 'var(--bg-card-hover)' : 'var(--bg-card)' }}
                  onClick={() => setSelected(selected === i ? null : i)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-primary)' }}>{cluster.cluster}</div>
                    <span className={`badge badge-${cluster.urgency === 'critical' ? 'critical' : cluster.urgency === 'high' ? 'high' : cluster.urgency === 'medium' ? 'medium' : 'low'}`}>{cluster.urgency}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>{cluster.summary}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{cluster.articles?.length || 0} articles → click to expand</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            {selected !== null && clusters[selected] ? (
              <>
                <div className="section-title">Articles in: {clusters[selected].cluster}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {getArticlesForCluster(clusters[selected]).map((a, j) => (
                    <div key={j} className="news-card">
                      <div className="news-card-source">{a.source?.name}</div>
                      <div className="news-card-title" style={{ fontSize: 13 }}>{a.title}</div>
                    </div>
                  ))}
                  {getArticlesForCluster(clusters[selected]).length === 0 && (
                    <div className="card" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>No article data available for this cluster.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>← Select a cluster to view articles</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
