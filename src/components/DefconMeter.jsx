import { useState } from 'react';
import { COUNTRIES } from '../data/countries';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const DEFCON_INFO = {
  1: { label: 'MAXIMUM READINESS', desc: 'Nuclear war is imminent', color: '#ff0000', bg: 'rgba(255,0,0,0.15)', icon: '☢️' },
  2: { label: 'ARMED FORCES READY', desc: 'Next step to nuclear war', color: '#ff4757', bg: 'rgba(255,71,87,0.15)', icon: '⚠️' },
  3: { label: 'INCREASED READINESS', desc: 'Air power ready in 15 min', color: '#ff6b35', bg: 'rgba(255,107,53,0.15)', icon: '🔶' },
  4: { label: 'ELEVATED THREAT', desc: 'Above normal readiness', color: '#ffa502', bg: 'rgba(255,165,2,0.15)', icon: '🟡' },
  5: { label: 'NORMAL PEACETIME', desc: 'Standard military readiness', color: '#2ed573', bg: 'rgba(46,213,115,0.15)', icon: '🟢' },
};

async function calculateDefcon(countries) {
  const criticals = countries.filter(c => c.threat === 5).length;
  const highs = countries.filter(c => c.threat === 4).length;
  const avgRisk = Math.round(countries.reduce((s, c) => s + c.riskScore, 0) / countries.length);

  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    const level = criticals >= 5 ? 2 : criticals >= 3 ? 3 : avgRisk >= 60 ? 4 : 5;
    return { level, reasoning: `${criticals} critical threat zones detected. Average global risk index: ${avgRisk}/100. ${highs} high-threat regions requiring monitoring. Add Anthropic API key for live AI DEFCON assessment.` };
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 300,
      system: 'You are a defense readiness analyst. Respond in JSON only.',
      messages: [{ role: 'user', content: `Based on current global conditions: ${criticals} critical threat zones, ${highs} high threat zones, average risk index ${avgRisk}/100.\n\nCalculate DEFCON level (1=worst, 5=peacetime).\nReturn ONLY: {"level": <1-5>, "reasoning": "<2 sentence explanation>"}` }],
    }),
  });
  const data = await res.json();
  return JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
}

export default function DefconMeter() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    const r = await calculateDefcon(COUNTRIES);
    setResult(r);
    setLoading(false);
  };

  const info = result ? DEFCON_INFO[result.level] : null;

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">DEFCON Meter</div>
            <div className="page-subtitle">AI GLOBAL DEFENSE READINESS CALCULATOR</div>
          </div>
          <button className="btn-primary" onClick={calculate} disabled={loading}>
            {loading ? '▌ CALCULATING...' : result ? '↻ RECALCULATE' : '▶ CALCULATE DEFCON'}
          </button>
        </div>
      </div>

      {/* DEFCON Scale */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title">DEFCON SCALE</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map(level => {
            const d = DEFCON_INFO[level];
            const isActive = result?.level === level;
            return (
              <div key={level} style={{
                flex: 1, minWidth: 120,
                background: isActive ? d.bg : 'var(--bg-secondary)',
                border: `2px solid ${isActive ? d.color : 'var(--border)'}`,
                borderRadius: 8, padding: '12px',
                textAlign: 'center', transition: 'all 0.3s',
                boxShadow: isActive ? `0 0 20px ${d.color}40` : 'none',
                animation: isActive && level <= 2 ? 'pulse 1s infinite' : 'none',
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{d.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: d.color, marginBottom: 4 }}>DEFCON {level}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: d.color, letterSpacing: 1, marginBottom: 4 }}>{d.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.4 }}>{d.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {!result && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: 'var(--text-dim)', marginBottom: 12 }}>🔴</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', marginBottom: 20 }}>AI analyzes 28 countries and calculates current global defense readiness level</div>
          <button className="btn-primary" onClick={calculate} style={{ padding: '12px 32px' }}>▶ CALCULATE NOW</button>
        </div>
      )}

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>▌ AI ANALYZING GLOBAL THREAT CONDITIONS...</div>
          <div className="loading-bar" style={{ maxWidth: 400, margin: '0 auto' }}><div className="loading-bar-fill" /></div>
        </div>
      )}

      {result && info && !loading && (
        <div className="card" style={{ textAlign: 'center', background: info.bg, border: `2px solid ${info.color}`, boxShadow: `0 0 40px ${info.color}30` }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: info.color, letterSpacing: 3, marginBottom: 16 }}>⬛ NEXUS DEFENSE READINESS ASSESSMENT</div>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{info.icon}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: info.color, letterSpacing: 4, marginBottom: 4, textShadow: `0 0 30px ${info.color}` }}>DEFCON {result.level}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: info.color, letterSpacing: 3, marginBottom: 20 }}>{info.label}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 500, margin: '0 auto' }}>{result.reasoning}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 20 }}>ASSESSED: {new Date().toUTCString().slice(0, 25)} UTC</div>
        </div>
      )}
    </div>
  );
}
