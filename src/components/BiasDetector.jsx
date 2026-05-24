import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import { analyzeBias } from '../hooks/useAI';

export default function BiasDetector() {
  const { articles, loading: newsLoading } = useNews();
  const [results, setResults] = useState({});
  const [analyzing, setAnalyzing] = useState(null);

  const analyze = async (article, idx) => {
    if (results[idx] || analyzing === idx) return;
    setAnalyzing(idx);
    const result = await analyzeBias(article);
    setResults(prev => ({ ...prev, [idx]: result }));
    setAnalyzing(null);
  };

  const biasColor = (score) => {
    if (score < -40) return '#ff6b9d';
    if (score < -15) return '#a78bfa';
    if (score > 40) return '#f97316';
    if (score > 15) return '#fb923c';
    return 'var(--green)';
  };

  const sentimentColor = (s) => s === 'positive' ? 'var(--green)' : s === 'negative' ? 'var(--accent2)' : 'var(--accent)';

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Bias Detector</div>
        <div className="page-subtitle">AI-POWERED MEDIA BIAS & SENTIMENT ANALYSIS</div>
      </div>

      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>BIAS SCALE:</div>
        {[['Far Left', '#ff6b9d'], ['Left', '#a78bfa'], ['Center', 'var(--green)'], ['Right', '#fb923c'], ['Far Right', '#f97316']].map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>{label}</span>
          </div>
        ))}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginLeft: 'auto' }}>Click any article to analyze →</div>
      </div>

      {newsLoading ? (
        <div className="card"><div className="loading-bar"><div className="loading-bar-fill" /></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {articles.slice(0, 12).map((a, i) => {
            const result = results[i];
            const isAnalyzing = analyzing === i;
            return (
              <div key={i} className="card" style={{ cursor: result ? 'default' : 'pointer' }}
                onClick={() => !result && analyze(a, i)}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div className="news-card-source">{a.source?.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 8 }}>{a.title}</div>
                    {isAnalyzing && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>
                        ▌ Analyzing bias pattern...
                      </div>
                    )}
                    {!result && !isAnalyzing && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>Click to analyze →</div>
                    )}
                    {result && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
                        <span style={{ background: `${biasColor(result.biasScore)}20`, border: `1px solid ${biasColor(result.biasScore)}50`, borderRadius: 4, padding: '3px 8px', fontFamily: 'var(--font-mono)', fontSize: 11, color: biasColor(result.biasScore) }}>{result.biasLabel}</span>
                        <span style={{ background: `${sentimentColor(result.sentiment)}15`, border: `1px solid ${sentimentColor(result.sentiment)}40`, borderRadius: 4, padding: '3px 8px', fontFamily: 'var(--font-mono)', fontSize: 11, color: sentimentColor(result.sentiment) }}>{result.sentiment}</span>
                        <span style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 4, padding: '3px 8px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>{result.framing}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>{result.keyInsight}</span>
                      </div>
                    )}
                  </div>
                  {result && (
                    <div style={{ flexShrink: 0, textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', minWidth: 70 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 4 }}>BIAS</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: biasColor(result.biasScore) }}>{result.biasScore > 0 ? '+' : ''}{result.biasScore}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginTop: 4 }}>SENT {result.sentimentScore}%</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
