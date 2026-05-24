import { useState, useEffect } from 'react';
import { useNews } from '../hooks/useNews';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

async function generateMission(articles) {
  const headlines = articles.slice(0, 6).map(a => a.title).join('\n');
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return {
      missionCode: 'OPERATION NEXUS DAWN',
      classification: 'TOP SECRET // SI // TK // NOFORN',
      objective: 'Monitor and assess escalating geopolitical situations across multiple theatres of operation.',
      briefing: [
        'Intelligence confirms elevated activity across three primary zones of interest.',
        'Field assets report unusual troop movements near contested territories.',
        'Cyber intrusion attempts detected on allied infrastructure — attribution ongoing.',
        'Economic indicators suggest coordinated financial warfare is underway.',
        'Diplomatic channels remain open but are strained under current conditions.',
      ],
      primaryThreat: 'Multi-vector destabilization campaign targeting Western alliances.',
      recommendation: 'Increase surveillance posture. Activate secondary intelligence assets. Brief allied partners.',
      clearanceRequired: 'TOP SECRET / SCI',
    };
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 600,
      system: 'You are a CIA mission briefing officer. Generate dramatic spy-movie style mission briefings. Respond in JSON only.',
      messages: [{ role: 'user', content: `Create a cinematic classified mission briefing from these headlines:\n${headlines}\n\nReturn ONLY:\n{\n  "missionCode": "OPERATION <two dramatic words>",\n  "classification": "TOP SECRET // SI // TK // NOFORN",\n  "objective": "<one sentence mission objective>",\n  "briefing": ["<point 1>", "<point 2>", "<point 3>", "<point 4>", "<point 5>"],\n  "primaryThreat": "<one sentence>",\n  "recommendation": "<one sentence action>",\n  "clearanceRequired": "TOP SECRET / SCI"\n}` }],
    }),
  });
  const data = await res.json();
  return JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
}

export default function MissionBriefing() {
  const { articles } = useNews();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [revealedLines, setRevealedLines] = useState(0);

  const generate = async () => {
    setLoading(true);
    const m = await generateMission(articles);
    setMission(m);
    setLoading(false);
    setRevealedLines(0);
  };

  useEffect(() => {
    if (mission && revealedLines < (mission.briefing?.length || 0)) {
      const t = setTimeout(() => setRevealedLines(r => r + 1), 600);
      return () => clearTimeout(t);
    }
  }, [mission, revealedLines]);

  const BriefingContent = () => (
    <div style={{
      background: fullscreen ? '#000' : 'var(--bg-primary)',
      ...(fullscreen ? { position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto', padding: '40px' } : {}),
    }}>
      {fullscreen && (
        <button onClick={() => setFullscreen(false)} style={{ position: 'fixed', top: 20, right: 20, background: 'var(--accent2-dim)', border: '1px solid var(--accent2)', borderRadius: 6, padding: '6px 14px', color: 'var(--accent2)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, zIndex: 101 }}>
          ✕ EXIT BRIEFING
        </button>
      )}

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent2)', letterSpacing: 4, marginBottom: 8 }}>⬛ {mission.classification}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: fullscreen ? 32 : 22, color: 'var(--accent)', letterSpacing: 4, textShadow: '0 0 30px rgba(0,212,255,0.5)', marginBottom: 8 }}>{mission.missionCode}</div>
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, var(--accent), transparent)' }} />
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: 2, marginBottom: 12 }}>MISSION OBJECTIVE</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.8, padding: '16px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8 }}>{mission.objective}</div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: 2, marginBottom: 16 }}>INTELLIGENCE BRIEFING</div>
          {mission.briefing?.map((line, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              padding: '12px 0', borderBottom: '1px solid var(--border)',
              opacity: i < revealedLines ? 1 : 0,
              transform: i < revealedLines ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'all 0.4s ease',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--accent)', minWidth: 20 }}>0{i + 1}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{line}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          <div style={{ background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.2)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent2)', letterSpacing: 2, marginBottom: 8 }}>PRIMARY THREAT</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{mission.primaryThreat}</div>
          </div>
          <div style={{ background: 'rgba(46,213,115,0.08)', border: '1px solid rgba(46,213,115,0.2)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--green)', letterSpacing: 2, marginBottom: 8 }}>RECOMMENDATION</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{mission.recommendation}</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: 2 }}>
          CLEARANCE REQUIRED: {mission.clearanceRequired} · {new Date().toUTCString().slice(0, 25)} UTC
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">Mission Briefing</div>
            <div className="page-subtitle">CINEMATIC AI INTELLIGENCE DEBRIEF · CLASSIFIED</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {mission && <button className="btn-danger" onClick={() => setFullscreen(true)}>⛶ FULLSCREEN</button>}
            <button className="btn-primary" onClick={generate} disabled={loading}>
              {loading ? '▌ COMPILING...' : mission ? '↻ NEW MISSION' : '▶ GENERATE BRIEFING'}
            </button>
          </div>
        </div>
      </div>

      {!mission && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 8 }}>MISSION BRIEFING ENGINE</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>AI generates a cinematic spy-movie style mission briefing from today's live intelligence.</div>
          <button className="btn-primary" onClick={generate} style={{ padding: '12px 32px' }}>▶ START BRIEFING</button>
        </div>
      )}
      {loading && <div className="card" style={{ textAlign: 'center', padding: 40 }}><div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>▌ COMPILING MISSION INTELLIGENCE...</div><div className="loading-bar" style={{ maxWidth: 400, margin: '0 auto' }}><div className="loading-bar-fill" /></div></div>}
      {mission && !loading && !fullscreen && <div className="card scanline"><BriefingContent /></div>}
      {fullscreen && <BriefingContent />}
    </div>
  );
}
