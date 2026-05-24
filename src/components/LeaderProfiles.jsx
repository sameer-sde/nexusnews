import { useState } from 'react';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const LEADERS = [
  { id: 'trump',     name: 'Donald Trump',          country: 'United States', flag: '🇺🇸', title: 'President',              threat: 2, since: '2025', age: 78, ideology: 'MAGA Nationalist',       style: 'Transactional' },
  { id: 'putin',     name: 'Vladimir Putin',         country: 'Russia',        flag: '🇷🇺', title: 'President',              threat: 5, since: '2000', age: 72, ideology: 'Nationalist',            style: 'Authoritarian' },
  { id: 'xi',        name: 'Xi Jinping',             country: 'China',         flag: '🇨🇳', title: 'General Secretary',      threat: 4, since: '2013', age: 71, ideology: 'Communist',              style: 'Technocratic' },
  { id: 'khamenei',  name: 'Ali Khamenei',           country: 'Iran',          flag: '🇮🇷', title: 'Supreme Leader',         threat: 4, since: '1989', age: 85, ideology: 'Theocratic',             style: 'Clerical' },
  { id: 'kim',       name: 'Kim Jong-un',            country: 'North Korea',   flag: '🇰🇵', title: 'Supreme Leader',         threat: 5, since: '2011', age: 41, ideology: 'Juche',                  style: 'Totalitarian' },
  { id: 'modi',      name: 'Narendra Modi',          country: 'India',         flag: '🇮🇳', title: 'Prime Minister',         threat: 2, since: '2014', age: 74, ideology: 'Hindu Nationalist',       style: 'Populist' },
  { id: 'erdogan',   name: 'Recep Tayyip Erdoğan',  country: 'Turkey',        flag: '🇹🇷', title: 'President',              threat: 3, since: '2014', age: 71, ideology: 'Islamic Conservative',    style: 'Strongman' },
  { id: 'mbs',       name: 'Mohammed bin Salman',    country: 'Saudi Arabia',  flag: '🇸🇦', title: 'Crown Prince / PM',      threat: 3, since: '2017', age: 39, ideology: 'Monarchist',             style: 'Reformist-Autocratic' },
  { id: 'zelensky',  name: 'Volodymyr Zelensky',     country: 'Ukraine',       flag: '🇺🇦', title: 'President',              threat: 5, since: '2019', age: 47, ideology: 'Democratic',             style: 'Crisis Leader' },
  { id: 'macron',    name: 'Emmanuel Macron',        country: 'France',        flag: '🇫🇷', title: 'President',              threat: 1, since: '2017', age: 47, ideology: 'Centrist',               style: 'Technocratic' },
  { id: 'netanyahu', name: 'Benjamin Netanyahu',     country: 'Israel',        flag: '🇮🇱', title: 'Prime Minister',         threat: 4, since: '2022', age: 75, ideology: 'Right-wing',             style: 'Hawkish' },
  { id: 'starmer',   name: 'Keir Starmer',           country: 'United Kingdom',flag: '🇬🇧', title: 'Prime Minister',         threat: 1, since: '2024', age: 62, ideology: 'Centre-Left Labour',     style: 'Pragmatic' },
  { id: 'scholz',    name: 'Olaf Scholz',            country: 'Germany',       flag: '🇩🇪', title: 'Chancellor',             threat: 1, since: '2021', age: 66, ideology: 'Social Democrat',        style: 'Consensus-driven' },
  { id: 'meloni',    name: 'Giorgia Meloni',         country: 'Italy',         flag: '🇮🇹', title: 'Prime Minister',         threat: 2, since: '2022', age: 47, ideology: 'National Conservative',  style: 'Populist Right' },
  { id: 'milei',     name: 'Javier Milei',           country: 'Argentina',     flag: '🇦🇷', title: 'President',              threat: 2, since: '2023', age: 54, ideology: 'Libertarian',            style: 'Anarcho-Capitalist' },
  { id: 'lula',      name: 'Luiz Inácio Lula',       country: 'Brazil',        flag: '🇧🇷', title: 'President',              threat: 2, since: '2023', age: 79, ideology: 'Left-wing',             style: 'Pragmatic Left' },
];

const THREAT_COLORS = { 1: '#2ed573', 2: '#2ed573', 3: '#ffa502', 4: '#ff6b35', 5: '#ff4757' };
const THREAT_LABELS = { 1: 'MINIMAL', 2: 'LOW', 3: 'MEDIUM', 4: 'HIGH', 5: 'CRITICAL' };

const AVATARS = {
  trump: 'DT', putin: 'VP', xi: 'XJ', khamenei: 'AK', kim: 'KJ',
  modi: 'NM', erdogan: 'RE', mbs: 'MS', zelensky: 'VZ',
  macron: 'EM', netanyahu: 'BN', starmer: 'KS', scholz: 'OS',
  meloni: 'GM', milei: 'JM', lula: 'LL',
};

async function getLeaderProfile(leader) {
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return {
      personality: 'Strategic thinker with strong popular appeal. Known for unconventional decision-making and high media presence.',
      decisionStyle: 'Centralized decision-making with close inner circle. Prioritizes speed and impact over consensus.',
      motivations: 'National interest, personal legacy, domestic political base, and geopolitical influence.',
      negotiationTactic: 'Transactional approach — maximizes leverage and seeks deals that project strength.',
      keyRisks: 'Unpredictability in high-stakes diplomatic situations and potential for policy escalation.',
      globalImpact: 'Significant influence on global alliances, trade policy, and geopolitical order.',
      analystNote: 'Add your Anthropic API key for real AI-generated leader profiles.',
      threatScore: leader.threat * 20,
      predictability: 45,
      aggressionIndex: 55,
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
      max_tokens: 700,
      system: 'You are a political psychology analyst for an intelligence agency. Generate concise, insightful leader profiles. Respond in JSON only. Be factual and neutral.',
      messages: [{
        role: 'user',
        content: `Generate an intelligence profile for ${leader.name}, ${leader.title} of ${leader.country} (in power since ${leader.since}, age ${leader.age}, ideology: ${leader.ideology}, style: ${leader.style}).

Return ONLY this JSON:
{
  "personality": "<2 sentence psychological profile>",
  "decisionStyle": "<2 sentence decision-making analysis>",
  "motivations": "<key motivations in one sentence>",
  "negotiationTactic": "<negotiation approach in one sentence>",
  "keyRisks": "<main risks they pose in one sentence>",
  "globalImpact": "<global influence assessment in one sentence>",
  "analystNote": "<sharp one-sentence analyst insight>",
  "threatScore": <0-100>,
  "predictability": <0-100>,
  "aggressionIndex": <0-100>
}`,
      }],
    }),
  });
  const data = await res.json();
  return JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
}

function RadarBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: 1 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color }}>{'█'.repeat(Math.round(value / 10))}</span>
      </div>
      <div style={{ height: 4, background: 'var(--bg-primary)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 2, transition: 'width 0.8s ease', boxShadow: `0 0 8px ${color}60` }} />
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginTop: 2, textAlign: 'right' }}>{value}/100</div>
    </div>
  );
}

function LeaderAvatar({ leader, size = 80 }) {
  const color = THREAT_COLORS[leader.threat];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(135deg, ${color}30, ${color}10)`,
      border: `2px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, position: 'relative',
      boxShadow: `0 0 20px ${color}30`,
    }}>
      <span style={{ fontSize: size * 0.3, fontFamily: 'var(--font-display)', color, fontWeight: 700, letterSpacing: 1 }}>
        {AVATARS[leader.id] || leader.name.slice(0, 2).toUpperCase()}
      </span>
      <div style={{
        position: 'absolute', bottom: 2, right: 2,
        width: size * 0.2, height: size * 0.2,
        borderRadius: '50%', background: color,
        boxShadow: `0 0 6px ${color}`,
      }} className="pulse" />
    </div>
  );
}

export default function LeaderProfiles() {
  const [selected, setSelected] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filters = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const filterMap = { All: [1,2,3,4,5], Critical: [5], High: [4], Medium: [3], Low: [1,2] };

  const filtered = LEADERS
    .filter(l => filterMap[filter].includes(l.threat))
    .filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.country.toLowerCase().includes(search.toLowerCase()));

  const analyze = async (leader) => {
    if (selected?.id === leader.id) return;
    setSelected(leader);
    setProfile(null);
    setLoading(true);
    const data = await getLeaderProfile(leader);
    setProfile(data);
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Leader Profiles</div>
        <div className="page-subtitle">AI PSYCHOLOGICAL INTELLIGENCE · {LEADERS.length} WORLD LEADER DOSSIERS · 2025</div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} className={`tag ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <input
          className="input-field"
          placeholder="Search leader or country..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginLeft: 8, height: 30, fontSize: 12, padding: '4px 12px', flex: 1, maxWidth: 220 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, alignItems: 'start' }}>
        {/* Leader list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 700, overflowY: 'auto' }}>
          {filtered.map(leader => (
            <div key={leader.id}
              onClick={() => analyze(leader)}
              style={{
                background: selected?.id === leader.id ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                border: `1px solid ${selected?.id === leader.id ? THREAT_COLORS[leader.threat] : 'var(--border)'}`,
                borderRadius: 10, padding: '12px 14px',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 12,
              }}
              onMouseEnter={e => { if (selected?.id !== leader.id) e.currentTarget.style.borderColor = 'var(--border-bright)'; }}
              onMouseLeave={e => { if (selected?.id !== leader.id) e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <LeaderAvatar leader={leader} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{leader.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>{leader.flag} {leader.country}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginTop: 2 }}>{leader.title} · Since {leader.since}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: THREAT_COLORS[leader.threat], padding: '2px 6px', border: `1px solid ${THREAT_COLORS[leader.threat]}40`, borderRadius: 3, background: `${THREAT_COLORS[leader.threat]}10` }}>
                  {THREAT_LABELS[leader.threat]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Profile panel */}
        <div>
          {!selected && (
            <div className="card" style={{ textAlign: 'center', padding: 64 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-dim)', letterSpacing: 2 }}>SELECT A WORLD LEADER</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginTop: 8 }}>AI will generate a full psychological intelligence dossier</div>
            </div>
          )}

          {selected && (
            <div className="card scanline" style={{ position: 'relative', overflow: 'hidden' }}>
              {/* Classified stamp */}
              <div style={{
                position: 'absolute', top: 20, right: 20,
                fontFamily: 'var(--font-display)', fontSize: 10,
                color: 'var(--accent2)', letterSpacing: 3,
                border: '2px solid var(--accent2)', padding: '4px 10px',
                borderRadius: 4, opacity: 0.4, transform: 'rotate(12deg)',
              }}>TOP SECRET</div>

              {/* Header */}
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                <LeaderAvatar leader={selected} size={90} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent2)', letterSpacing: 3, marginBottom: 6 }}>⬛ NEXUS INTELLIGENCE DOSSIER · 2025</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-primary)', marginBottom: 4 }}>{selected.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{selected.title}, {selected.flag} {selected.country}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 8px', background: 'var(--bg-secondary)', borderRadius: 4, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>Since {selected.since}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 8px', background: 'var(--bg-secondary)', borderRadius: 4, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>Age {selected.age}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 8px', background: 'var(--bg-secondary)', borderRadius: 4, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{selected.ideology}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 8px', background: `${THREAT_COLORS[selected.threat]}15`, borderRadius: 4, color: THREAT_COLORS[selected.threat], border: `1px solid ${THREAT_COLORS[selected.threat]}40` }}>{THREAT_LABELS[selected.threat]} THREAT</span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>▌ COMPILING PSYCHOLOGICAL PROFILE...</div>
                  <div className="loading-bar"><div className="loading-bar-fill" /></div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 12 }}>Analyzing behavioral patterns...</div>
                </div>
              ) : profile ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {/* Left — text analysis */}
                  <div>
                    {[
                      { label: 'PSYCHOLOGICAL PROFILE', key: 'personality', color: 'var(--accent)' },
                      { label: 'DECISION-MAKING STYLE', key: 'decisionStyle', color: 'var(--accent)' },
                      { label: 'CORE MOTIVATIONS', key: 'motivations', color: 'var(--accent3)' },
                      { label: 'NEGOTIATION TACTICS', key: 'negotiationTactic', color: 'var(--accent3)' },
                      { label: 'KEY RISKS', key: 'keyRisks', color: 'var(--accent2)' },
                      { label: 'GLOBAL IMPACT', key: 'globalImpact', color: 'var(--accent2)' },
                    ].map(({ label, key, color }) => (
                      <div key={key} style={{ marginBottom: 16 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color, letterSpacing: 2, marginBottom: 5 }}>{label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{profile[key]}</div>
                      </div>
                    ))}
                    <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 6, padding: '10px 14px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: 2, marginBottom: 6 }}>◎ ANALYST NOTE</div>
                      <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.7, fontStyle: 'italic' }}>{profile.analystNote}</div>
                    </div>
                  </div>

                  {/* Right — metrics */}
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 16 }}>BEHAVIORAL METRICS</div>
                    <RadarBar label="THREAT SCORE" value={profile.threatScore || selected.threat * 20} color={THREAT_COLORS[selected.threat]} />
                    <RadarBar label="PREDICTABILITY" value={profile.predictability || 50} color="var(--accent)" />
                    <RadarBar label="AGGRESSION INDEX" value={profile.aggressionIndex || 60} color="var(--accent2)" />

                    <div style={{ marginTop: 24, background: 'var(--bg-secondary)', borderRadius: 8, padding: '16px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 12 }}>QUICK INTEL</div>
                      {[
                        { label: 'STYLE', value: selected.style },
                        { label: 'IDEOLOGY', value: selected.ideology },
                        { label: 'IN POWER', value: `${new Date().getFullYear() - parseInt(selected.since)} years` },
                        { label: 'COUNTRY', value: selected.country },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-primary)' }}>{value}</span>
                        </div>
                      ))}
                    </div>

                    <button className="btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => analyze(selected)}>
                      ↻ REGENERATE PROFILE
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
