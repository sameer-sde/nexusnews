import { useState } from 'react';
import { useNews } from '../hooks/useNews';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

async function generateNewspaper(articles) {
  const headlines = articles.slice(0, 8).map((a, i) => `${i + 1}. ${a.title}`).join('\n');
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return {
      masthead: 'THE NEXUS GLOBAL TRIBUNE',
      edition: 'CLASSIFIED INTELLIGENCE EDITION',
      headline: 'GLOBAL TENSIONS REACH CRITICAL THRESHOLD AS MULTIPLE CRISES CONVERGE',
      subheadline: 'Intelligence analysts warn of unprecedented simultaneous pressure across three major theatres',
      story1: 'World leaders convened in emergency session today as diplomatic channels strained under the weight of overlapping crises. Senior intelligence officials described the current geopolitical environment as among the most complex in recent decades, with flashpoints in Eastern Europe, the Middle East, and the Asia-Pacific demanding simultaneous attention from major powers.',
      story2: 'Economic warfare intensifies as sanctions regimes expand. Markets respond with volatility not seen since 2020.',
      column1Title: 'ANALYST DISPATCH',
      column1: 'The convergence of military, economic, and information warfare represents a new paradigm. Traditional deterrence models require urgent reassessment.',
      column2Title: 'FIELD INTELLIGENCE',
      column2: 'Ground reports confirm movement of assets in three contested zones. Diplomatic back-channels remain active despite public posturing.',
      weatherLine: 'THREAT CLIMATE: SEVERE · VISIBILITY: LIMITED · FORECAST: DETERIORATING',
    };
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 900,
      system: 'You are an intelligence newspaper editor. Generate dramatic, journalistic newspaper content from news headlines. Respond in JSON only.',
      messages: [{
        role: 'user',
        content: `Create a classified intelligence newspaper front page from these headlines:\n${headlines}\n\nReturn ONLY this JSON:\n{\n  "masthead": "THE NEXUS GLOBAL TRIBUNE",\n  "edition": "<creative edition subtitle>",\n  "headline": "<dramatic all-caps main headline>",\n  "subheadline": "<one sentence subheadline>",\n  "story1": "<2 paragraph lead story based on top news>",\n  "story2": "<one paragraph second story>",\n  "column1Title": "<column title>",\n  "column1": "<analyst column 2 sentences>",\n  "column2Title": "<column title>",\n  "column2": "<field report 2 sentences>",\n  "weatherLine": "<creative threat weather report one line>"\n}`,
      }],
    }),
  });
  const data = await res.json();
  return JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
}

export default function AINewspaper() {
  const { articles, loading: newsLoading } = useNews();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const result = await generateNewspaper(articles);
    setPaper(result);
    setLoading(false);
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">AI Newspaper</div>
            <div className="page-subtitle">AI-GENERATED INTELLIGENCE FRONT PAGE · CLASSIFIED EDITION</div>
          </div>
          <button className="btn-primary" onClick={generate} disabled={loading || newsLoading}>
            {loading ? '▌ PRINTING...' : paper ? '↻ NEW EDITION' : '▶ GENERATE FRONT PAGE'}
          </button>
        </div>
      </div>

      {!paper && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📰</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 8 }}>AI NEWSPAPER GENERATOR</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>AI reads today's live news and generates a cinematic classified intelligence newspaper front page.</div>
          <button className="btn-primary" onClick={generate}>▶ PRINT TODAY'S EDITION</button>
        </div>
      )}

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>▌ AI EDITOR COMPOSING FRONT PAGE...</div>
          <div className="loading-bar" style={{ maxWidth: 400, margin: '0 auto' }}><div className="loading-bar-fill" /></div>
        </div>
      )}

      {paper && !loading && (
        <div style={{
          background: '#f5f0e8',
          border: '2px solid #2a2a2a',
          borderRadius: 4,
          padding: '32px',
          color: '#1a1a1a',
          fontFamily: 'Georgia, serif',
          maxWidth: 900,
          margin: '0 auto',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}>
          {/* Masthead */}
          <div style={{ textAlign: 'center', borderBottom: '3px solid #1a1a1a', paddingBottom: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: '#555', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>⬛ CLASSIFIED · {paper.edition}</div>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 3, lineHeight: 1, fontFamily: 'var(--font-display)', color: '#1a1a1a' }}>{paper.masthead}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, fontFamily: 'var(--font-mono)', color: '#555' }}>
              <span>NEXUS INTELLIGENCE NETWORK</span>
              <span>{today}</span>
              <span>PRICE: CLASSIFIED</span>
            </div>
          </div>

          {/* Weather / threat line */}
          <div style={{ textAlign: 'center', background: '#1a1a1a', color: '#f5f0e8', padding: '4px 12px', fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 16 }}>
            {paper.weatherLine}
          </div>

          {/* Main headline */}
          <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #999' }}>
            <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, letterSpacing: 1, marginBottom: 8 }}>{paper.headline}</div>
            <div style={{ fontSize: 14, color: '#444', fontStyle: 'italic' }}>{paper.subheadline}</div>
          </div>

          {/* Main story columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #999' }}>
            <div>
              <div style={{ fontSize: 12, lineHeight: 1.9, color: '#1a1a1a' }}>{paper.story1}</div>
            </div>
            <div style={{ borderLeft: '1px solid #999', paddingLeft: 20 }}>
              <div style={{ fontSize: 12, lineHeight: 1.9, color: '#333' }}>{paper.story2}</div>
            </div>
          </div>

          {/* Bottom columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ borderTop: '2px solid #1a1a1a', paddingTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>{paper.column1Title}</div>
              <div style={{ fontSize: 12, lineHeight: 1.9, color: '#333' }}>{paper.column1}</div>
            </div>
            <div style={{ borderTop: '2px solid #1a1a1a', paddingTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>{paper.column2Title}</div>
              <div style={{ fontSize: 12, lineHeight: 1.9, color: '#333' }}>{paper.column2}</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 12, borderTop: '2px solid #1a1a1a', fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: '#888' }}>
            NEXUS INTELLIGENCE NETWORK · CLASSIFIED DISTRIBUTION ONLY · UNAUTHORIZED DISCLOSURE PROHIBITED
          </div>
        </div>
      )}
    </div>
  );
}
