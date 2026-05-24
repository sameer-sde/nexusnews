import { useState } from 'react';
import { COUNTRIES } from '../data/countries';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const ALLIANCES = [
  { name: 'NATO', members: ['US', 'GB', 'FR', 'DE', 'CA'], color: '#00d4ff', type: 'Military' },
  { name: 'BRICS', members: ['RU', 'CN', 'IN', 'BR'], color: '#ffa502', type: 'Economic' },
  { name: 'SCO', members: ['RU', 'CN', 'IN', 'PK'], color: '#ff6b35', type: 'Security' },
  { name: 'Arab League', members: ['SA', 'IR', 'IQ', 'YE', 'SY'], color: '#2ed573', type: 'Political' },
];

async function analyzeRelationship(c1, c2) {
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return {
      relationship: 'HOSTILE',
      score: -75,
      summary: 'Add your Anthropic API key to get real AI relationship analysis between any two countries.',
      keyIssues: ['API key not configured', 'Demo mode active'],
      forecast: 'Configure VITE_ANTHROPIC_API_KEY to enable live analysis.',
    };
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 400,
      system: 'You are a geopolitical analyst. Respond in JSON only.',
      messages: [{ role: 'user', content: `Analyze the current relationship between ${c1.name} and ${c2.name}.\nReturn ONLY: {"relationship": "<ALLIED|FRIENDLY|NEUTRAL|TENSE|HOSTILE>", "score": <-100 to 100>, "summary": "<2 sentences>", "keyIssues": ["<issue1>", "<issue2>"], "forecast": "<one sentence>"}` }],
    }),
  });
  const data = await res.json();
  return JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
}

const REL_COLOR = { ALLIED: 'var(--green)', FRIENDLY: '#7bed9f', NEUTRAL: 'var(--accent)', TENSE: 'var(--accent3)', HOSTILE: 'var(--accent2)' };

export default function AllianceMapper() {
  const [c1, setC1] = useState(null);
  const [c2, setC2] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!c1 || !c2) return;
    setLoading(true); setResult(null);
    const r = await analyzeRelationship(c1, c2);
    setResult(r); setLoading(false);
  };

  const selectCountry = (country, slot) => {
    if (slot === 1) { setC1(country); setResult(null); }
    else { setC2(country); setResult(null); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Alliance Mapper</div>
        <div className="page-subtitle">AI GEOPOLITICAL RELATIONSHIP ANALYZER</div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Country selector 1 */}
        <div className="card">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', marginBottom: 10, letterSpacing: 1 }}>COUNTRY A</div>
          {c1 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{c1.flag}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{c1.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{c1.region}</div>
              </div>
              <button onClick={() => { setC1(null); setResult(null); }} style={{ marginLeft: 'auto', background: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: '3px 8px', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 11 }}>✕</button>
            </div>
          ) : (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginBottom: 10 }}>Select from list →</div>
          )}
        </div>
        <div className="card">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent2)', marginBottom: 10, letterSpacing: 1 }}>COUNTRY B</div>
          {c2 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{c2.flag}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{c2.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{c2.region}</div>
              </div>
              <button onClick={() => { setC2(null); setResult(null); }} style={{ marginLeft: 'auto', background: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: '3px 8px', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 11 }}>✕</button>
            </div>
          ) : (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginBottom: 10 }}>Select from list →</div>
          )}
        </div>
      </div>

      {c1 && c2 && (
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <button className="btn-primary" onClick={analyze} disabled={loading} style={{ padding: '12px 32px', fontSize: 13 }}>
            {loading ? '▌ ANALYZING...' : `▶ ANALYZE ${c1.name} ↔ ${c2.name}`}
          </button>
        </div>
      )}

      {result && (
        <div className="card" style={{ marginBottom: 20, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36 }}>{c1.flag}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{c1.name}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: REL_COLOR[result.relationship] || 'var(--accent)', letterSpacing: 2, padding: '6px 16px', border: `1px solid ${REL_COLOR[result.relationship] || 'var(--accent)'}`, borderRadius: 6, background: `${REL_COLOR[result.relationship]}15` }}>{result.relationship}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: result.score >= 0 ? 'var(--green)' : 'var(--accent2)', marginTop: 8 }}>{result.score > 0 ? '+' : ''}{result.score}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36 }}>{c2.flag}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{c2.name}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16, textAlign: 'left' }}>{result.summary}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 }}>
            {result.keyIssues?.map((issue, i) => <span key={i} className="badge badge-medium">{issue}</span>)}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent3)', textAlign: 'left' }}>▶ FORECAST: {result.forecast}</div>
        </div>
      )}

      <div className="grid-2">
        <div>
          <div className="section-title">Select Country A</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 300, overflowY: 'auto' }}>
            {COUNTRIES.map(c => (
              <button key={c.code} onClick={() => selectCountry(c, 1)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: c1?.code === c.code ? 'var(--accent-dim)' : 'var(--bg-card)', border: `1px solid ${c1?.code === c.code ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 6, cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', textAlign: 'left' }}>
                <span style={{ fontSize: 16 }}>{c.flag}</span>
                <span style={{ fontSize: 12, flex: 1 }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="section-title">Select Country B</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 300, overflowY: 'auto' }}>
            {COUNTRIES.map(c => (
              <button key={c.code} onClick={() => selectCountry(c, 2)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: c2?.code === c.code ? 'rgba(255,71,87,0.1)' : 'var(--bg-card)', border: `1px solid ${c2?.code === c.code ? 'var(--accent2)' : 'var(--border)'}`, borderRadius: 6, cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', textAlign: 'left' }}>
                <span style={{ fontSize: 16 }}>{c.flag}</span>
                <span style={{ fontSize: 12, flex: 1 }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="section-title">Known Alliances</div>
        <div className="grid-2">
          {ALLIANCES.map(a => (
            <div key={a.name} className="card" style={{ borderLeft: `3px solid ${a.color}`, borderRadius: '0 8px 8px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: a.color }}>{a.name}</div>
                <span className="badge badge-info" style={{ fontSize: 9 }}>{a.type}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {a.members.map(code => {
                  const country = COUNTRIES.find(c => c.code === code);
                  return country ? <span key={code} style={{ fontSize: 18 }} title={country.name}>{country.flag}</span> : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
