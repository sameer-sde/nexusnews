import { useState } from 'react';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const SANCTIONS = [
  { id: 1, from: '🇺🇸🇪🇺', target: '🇷🇺 Russia', type: 'Comprehensive', intensity: 92, status: 'ACTIVE', items: ['Energy exports', 'Banking system', 'Tech imports', 'Oligarch assets'], since: '2022' },
  { id: 2, from: '🇺🇸', target: '🇮🇷 Iran', type: 'Nuclear/Oil', intensity: 88, status: 'ACTIVE', items: ['Oil exports', 'SWIFT access', 'Arms embargo', 'Financial institutions'], since: '2018' },
  { id: 3, from: '🇺🇸', target: '🇰🇵 North Korea', type: 'Comprehensive', intensity: 95, status: 'ACTIVE', items: ['Coal/minerals', 'Arms/military', 'Luxury goods', 'Financial transfers'], since: '2006' },
  { id: 4, from: '🇺🇸🇪🇺', target: '🇧🇾 Belarus', type: 'Political', intensity: 65, status: 'ACTIVE', items: ['Potash exports', 'Finance sector', 'Aviation'], since: '2021' },
  { id: 5, from: '🇨🇳', target: '🇦🇺 Australia', type: 'Trade War', intensity: 48, status: 'EASING', items: ['Wine tariffs', 'Barley tariffs', 'Coal ban'], since: '2020' },
  { id: 6, from: '🇺🇸', target: '🇨🇳 China', type: 'Tech/Trade', intensity: 71, status: 'ESCALATING', items: ['Semiconductor chips', 'AI tech exports', 'Telecom equipment'], since: '2018' },
];

const STATUS_COLOR = { ACTIVE: 'var(--accent2)', ESCALATING: 'var(--accent3)', EASING: 'var(--green)', LIFTED: 'var(--text-dim)' };

async function getEconomicAnalysis(sanction) {
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return `ECONOMIC WARFARE ASSESSMENT\n\nTarget: ${sanction.target}\nType: ${sanction.type}\nIntensity: ${sanction.intensity}/100\n\nAdd your Anthropic API key to generate real AI economic warfare analysis including effectiveness scores, circumvention routes, and geopolitical impact assessments.`;
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 400,
      system: 'You are an economic warfare analyst. Be concise and factual.',
      messages: [{ role: 'user', content: `Analyze the ${sanction.type} sanctions on ${sanction.target} (intensity: ${sanction.intensity}/100, since ${sanction.since}, targeting: ${sanction.items.join(', ')}).\n\nCover: effectiveness, circumvention methods, economic impact, and 6-month outlook. 3-4 sentences total.` }],
    }),
  });
  const data = await res.json();
  return data.content[0].text;
}

export default function EconomicWarTracker() {
  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const analyze = async (s) => {
    setSelected(s); setAnalysis(''); setLoading(true);
    const text = await getEconomicAnalysis(s);
    setAnalysis(text); setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Economic War Tracker</div>
        <div className="page-subtitle">SANCTIONS · TRADE WARS · ECONOMIC WARFARE INTELLIGENCE</div>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="kpi-card red"><div className="kpi-label">Active Sanctions</div><div className="kpi-value red">{SANCTIONS.filter(s=>s.status==='ACTIVE').length}</div><div className="kpi-sub">regimes</div></div>
        <div className="kpi-card amber"><div className="kpi-label">Escalating</div><div className="kpi-value amber">{SANCTIONS.filter(s=>s.status==='ESCALATING').length}</div><div className="kpi-sub">conflicts</div></div>
        <div className="kpi-card green"><div className="kpi-label">Easing</div><div className="kpi-value green">{SANCTIONS.filter(s=>s.status==='EASING').length}</div><div className="kpi-sub">regimes</div></div>
        <div className="kpi-card blue"><div className="kpi-label">Avg Intensity</div><div className="kpi-value blue">{Math.round(SANCTIONS.reduce((s,r)=>s+r.intensity,0)/SANCTIONS.length)}</div><div className="kpi-sub">/ 100</div></div>
      </div>

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SANCTIONS.map(s => (
            <div key={s.id} className="card" style={{ cursor: 'pointer', borderLeft: `3px solid ${STATUS_COLOR[s.status]}`, borderRadius: '0 8px 8px 0', background: selected?.id === s.id ? 'var(--bg-card-hover)' : 'var(--bg-card)' }} onClick={() => analyze(s)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{s.from} → {s.target}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{s.type} · Since {s.since}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${STATUS_COLOR[s.status]}15`, color: STATUS_COLOR[s.status], border: `1px solid ${STATUS_COLOR[s.status]}40` }}>{s.status}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                {s.items.map((item, i) => <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 6px', background: 'var(--bg-secondary)', borderRadius: 3, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{item}</span>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>INTENSITY</span>
                <div style={{ flex: 1 }} className="threat-bar">
                  <div className="threat-fill" style={{ width: `${s.intensity}%`, background: STATUS_COLOR[s.status] }} />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: STATUS_COLOR[s.status] }}>{s.intensity}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          {!selected ? (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>💰</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>Select a sanctions regime for AI analysis</div>
            </div>
          ) : (
            <div className="card">
              <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent2)', letterSpacing: 2, marginBottom: 6 }}>⬛ ECONOMIC WARFARE ANALYSIS</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{selected.from} → {selected.target}</div>
              </div>
              {loading ? (
                <div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 12 }}>▌ ANALYZING ECONOMIC WARFARE...</div><div className="loading-bar"><div className="loading-bar-fill" /></div></div>
              ) : (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 2, whiteSpace: 'pre-wrap' }}>{analysis}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
