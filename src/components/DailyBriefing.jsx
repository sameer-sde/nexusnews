import { useState, useEffect } from 'react';
import { useNews } from '../hooks/useNews';
import { generateDailyBriefing } from '../hooks/useAI';

export default function DailyBriefing() {
  const { articles } = useNews();
  const [briefing, setBriefing] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    const text = await generateDailyBriefing(articles);
    setBriefing(text);
    setGenerated(true);
    setLoading(false);
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">Daily Intelligence Briefing</div>
            <div className="page-subtitle">AI-GENERATED · {dateStr.toUpperCase()}</div>
          </div>
          <button className="btn-primary" onClick={generate} disabled={loading}>
            {loading ? '▌ GENERATING...' : generated ? '↻ REGENERATE' : '▶ GENERATE BRIEFING'}
          </button>
        </div>
      </div>

      <div className="card scanline" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--accent2)', letterSpacing: 3 }}>⬛ TOP SECRET // NEXUS // SI-G</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)', marginTop: 4 }}>NEXUS DAILY INTELLIGENCE BRIEFING</div>
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
            <div>CLASSIFICATION: TOP SECRET</div>
            <div>{dateStr}</div>
            <div>NEXUS INTEL NETWORK</div>
          </div>
        </div>

        {!generated && !loading && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-dim)', marginBottom: 12 }}>▣</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', marginBottom: 16 }}>BRIEFING NOT YET GENERATED</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Click "Generate Briefing" to create today's AI intelligence report from live news data.</div>
            <button className="btn-primary" onClick={generate}>▶ GENERATE TODAY'S BRIEFING</button>
          </div>
        )}

        {loading && (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>▌ AI ANALYST COMPILING INTELLIGENCE...</div>
            <div className="loading-bar" style={{ maxWidth: 300, margin: '0 auto' }}><div className="loading-bar-fill" /></div>
          </div>
        )}

        {generated && briefing && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)', lineHeight: 2, whiteSpace: 'pre-wrap' }}>
            {briefing}
          </div>
        )}
      </div>

      {generated && (
        <div className="grid-3" style={{ marginTop: 8 }}>
          <div className="card">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 6 }}>SOURCE ARTICLES</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--accent)' }}>{articles.length}</div>
          </div>
          <div className="card">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 6 }}>GENERATED AT</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--accent)' }}>{now.toTimeString().slice(0, 8)} UTC</div>
          </div>
          <div className="card">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 6 }}>AI MODEL</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--accent)' }}>CLAUDE SONNET</div>
          </div>
        </div>
      )}
    </div>
  );
}
