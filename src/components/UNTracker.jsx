import { useState } from 'react';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const UN_RESOLUTIONS = [
  {
    id: 'S/2024/312', council: 'Security Council', date: '2024-03-22',
    title: 'Immediate ceasefire in Gaza — humanitarian corridors',
    votes: { yes: 14, no: 1, abstain: 0 },
    yesVotes: ['France', 'UK', 'China', 'Russia', 'Algeria', 'Guyana', 'Japan', 'Malta', 'Mozambique', 'Ecuador', 'Sierra Leone', 'Slovenia', 'South Korea', 'Switzerland'],
    noVotes: ['United States'],
    abstainVotes: [],
    vetoed: false, passed: true,
    topic: 'Middle East / Gaza',
  },
  {
    id: 'S/2024/198', council: 'Security Council', date: '2024-02-20',
    title: 'Condemnation of military operations in Ukraine — withdrawal of forces',
    votes: { yes: 13, no: 2, abstain: 0 },
    yesVotes: ['France', 'UK', 'USA', 'Algeria', 'Guyana', 'Japan', 'Malta', 'Mozambique', 'Ecuador', 'Sierra Leone', 'Slovenia', 'South Korea', 'Switzerland'],
    noVotes: ['Russia', 'China'],
    abstainVotes: [],
    vetoed: true, passed: false,
    topic: 'Ukraine',
  },
  {
    id: 'A/ES-11/6', council: 'General Assembly', date: '2024-01-15',
    title: 'Right of Palestinian people to self-determination',
    votes: { yes: 157, no: 8, abstain: 10 },
    yesVotes: ['Majority of member states'],
    noVotes: ['USA', 'Israel', 'Hungary', 'Guatemala', 'Nauru', 'Palau', 'Papua New Guinea', 'Tonga'],
    abstainVotes: ['UK', 'Germany', 'Italy', 'Canada', 'Australia', 'Ukraine', 'Netherlands', 'Austria', 'Sweden', 'Finland'],
    vetoed: false, passed: true,
    topic: 'Palestine / Self-determination',
  },
  {
    id: 'S/2023/891', council: 'Security Council', date: '2023-11-30',
    title: 'Humanitarian pauses and corridors in Gaza Strip',
    votes: { yes: 12, no: 0, abstain: 3 },
    yesVotes: ['France', 'Russia', 'China', 'Algeria', 'Gabon', 'Ghana', 'Japan', 'Malta', 'Mozambique', 'Ecuador', 'Switzerland', 'UAE'],
    noVotes: [],
    abstainVotes: ['USA', 'UK', 'Brazil'],
    vetoed: false, passed: true,
    topic: 'Middle East / Gaza',
  },
  {
    id: 'A/RES/78/240', council: 'General Assembly', date: '2023-12-12',
    title: 'Suspension of Russia from Human Rights Council',
    votes: { yes: 93, no: 24, abstain: 58 },
    yesVotes: ['USA', 'UK', 'France', 'Germany', 'Japan', 'Australia', 'Canada', 'Ukraine'],
    noVotes: ['Russia', 'China', 'Cuba', 'North Korea', 'Iran', 'Syria', 'Belarus'],
    abstainVotes: ['India', 'Brazil', 'South Africa', 'Pakistan', 'Indonesia'],
    vetoed: false, passed: true,
    topic: 'Ukraine / Human Rights',
  },
  {
    id: 'S/2023/574', council: 'Security Council', date: '2023-08-08',
    title: 'Extension of MINUSMA mandate in Mali',
    votes: { yes: 13, no: 1, abstain: 1 },
    yesVotes: ['USA', 'UK', 'France', 'Japan', 'Switzerland', 'Ecuador', 'Ghana', 'Gabon', 'UAE', 'Malta', 'Albania', 'Brazil', 'Mozambique'],
    noVotes: ['Russia'],
    abstainVotes: ['China'],
    vetoed: false, passed: true,
    topic: 'Africa / Mali',
  },
];

async function analyzeResolution(resolution) {
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return `RESOLUTION ANALYSIS — ${resolution.id}\n\nAdd your Anthropic API key to get AI analysis of UN resolutions including geopolitical significance, voting bloc analysis, and strategic implications.\n\nBasic data: ${resolution.passed ? 'PASSED' : 'FAILED/VETOED'} with ${resolution.votes.yes} yes votes, ${resolution.votes.no} no votes, ${resolution.votes.abstain} abstentions.`;
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 500,
      system: 'You are a UN analyst. Be concise and analytical.',
      messages: [{ role: 'user', content: `Analyze this UN resolution:\nID: ${resolution.id}\nTitle: ${resolution.title}\nCouncil: ${resolution.council}\nResult: ${resolution.passed ? 'PASSED' : 'FAILED'} (${resolution.vetoed ? 'VETOED' : 'not vetoed'})\nVotes: ${resolution.votes.yes} yes, ${resolution.votes.no} no, ${resolution.votes.abstain} abstain\nNo votes: ${resolution.noVotes.join(', ')}\nAbstentions: ${resolution.abstainVotes.join(', ')}\n\nProvide: geopolitical significance (2 sentences), voting bloc analysis (2 sentences), strategic implications (1 sentence). Total ~5 sentences.` }],
    }),
  });
  const data = await res.json();
  return data.content[0].text;
}

export default function UNTracker() {
  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  const topics = ['All', ...new Set(UN_RESOLUTIONS.map(r => r.topic.split(' / ')[0]))];
  const filtered = filter === 'All' ? UN_RESOLUTIONS : UN_RESOLUTIONS.filter(r => r.topic.startsWith(filter));

  const analyze = async (res) => {
    setSelected(res); setAnalysis(''); setLoading(true);
    const text = await analyzeResolution(res);
    setAnalysis(text); setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">UN Resolution Tracker</div>
        <div className="page-subtitle">SECURITY COUNCIL & GENERAL ASSEMBLY · AI IMPACT ANALYSIS</div>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="kpi-card blue"><div className="kpi-label">Resolutions</div><div className="kpi-value blue">{UN_RESOLUTIONS.length}</div><div className="kpi-sub">tracked</div></div>
        <div className="kpi-card green"><div className="kpi-label">Passed</div><div className="kpi-value green">{UN_RESOLUTIONS.filter(r => r.passed).length}</div><div className="kpi-sub">adopted</div></div>
        <div className="kpi-card red"><div className="kpi-label">Vetoed</div><div className="kpi-value red">{UN_RESOLUTIONS.filter(r => r.vetoed).length}</div><div className="kpi-sub">blocked</div></div>
        <div className="kpi-card amber"><div className="kpi-label">Topics</div><div className="kpi-value amber">{new Set(UN_RESOLUTIONS.map(r => r.topic.split(' / ')[0])).size}</div><div className="kpi-sub">active areas</div></div>
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16 }}>
        {topics.map(t => <button key={t} className={`tag ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>)}
      </div>

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(r => (
            <div key={r.id} className="card" style={{ cursor: 'pointer', borderLeft: `3px solid ${r.passed ? 'var(--green)' : 'var(--accent2)'}`, borderRadius: '0 8px 8px 0', background: selected?.id === r.id ? 'var(--bg-card-hover)' : 'var(--bg-card)' }} onClick={() => analyze(r)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', marginBottom: 4, letterSpacing: 1 }}>{r.id} · {r.council.toUpperCase()}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{r.date} · {r.topic}</div>
                </div>
                <span className={`badge ${r.passed ? 'badge-low' : 'badge-critical'}`} style={{ flexShrink: 0, marginLeft: 8 }}>{r.vetoed ? 'VETOED' : r.passed ? 'PASSED' : 'FAILED'}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                <span style={{ color: 'var(--green)' }}>✓ {r.votes.yes}</span>
                <span style={{ color: 'var(--accent2)' }}>✗ {r.votes.no}</span>
                <span style={{ color: 'var(--accent3)' }}>○ {r.votes.abstain}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          {!selected ? (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🏛️</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>Select a resolution for AI analysis</div>
            </div>
          ) : (
            <div className="card">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent2)', letterSpacing: 2, marginBottom: 8 }}>⬛ NEXUS · UN RESOLUTION ANALYSIS</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.5 }}>{selected.title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 16 }}>{selected.id} · {selected.date}</div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
                {[['YES', selected.votes.yes, 'var(--green)'], ['NO', selected.votes.no, 'var(--accent2)'], ['ABSTAIN', selected.votes.abstain, 'var(--accent3)']].map(([label, val, color]) => (
                  <div key={label} style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color }}>{val}</div>
                  </div>
                ))}
              </div>

              {selected.noVotes.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent2)', marginBottom: 6 }}>VOTED NO</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {selected.noVotes.map((v, i) => <span key={i} className="badge badge-critical" style={{ fontSize: 9 }}>{v}</span>)}
                  </div>
                </div>
              )}
              {selected.abstainVotes.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent3)', marginBottom: 6 }}>ABSTAINED</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {selected.abstainVotes.map((v, i) => <span key={i} className="badge badge-medium" style={{ fontSize: 9 }}>{v}</span>)}
                  </div>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', marginBottom: 8 }}>◎ AI ANALYSIS</div>
                {loading ? <div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 8 }}>▌ Analyzing resolution...</div><div className="loading-bar"><div className="loading-bar-fill" /></div></div>
                  : <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 2, whiteSpace: 'pre-wrap' }}>{analysis}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
