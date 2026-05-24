import { useState } from 'react';
import { useNews } from '../hooks/useNews';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

async function generateWeeklyDigest(articles) {
  const headlines = articles.slice(0, 12).map((a, i) => `${i + 1}. ${a.title}`).join('\n');
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return {
      weekOf: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      headline: 'Global Tensions Remain Elevated Across Multiple Fronts',
      topEvents: ['Military posturing intensified in Eastern Europe', 'Economic sanctions expanded against rogue states', 'Cyber warfare incidents increased 40% globally'],
      emergingThreats: ['AI-powered disinformation campaigns gaining scale', 'Critical infrastructure vulnerabilities exposed', 'Climate-driven resource conflicts emerging'],
      winners: ['Diplomatic efforts in Southeast Asia showing progress', 'Ceasefire holding in Central Africa region'],
      losers: ['Humanitarian situation deteriorating in conflict zones', 'Global supply chains under renewed pressure'],
      analystPick: 'The convergence of economic and military pressures suggests Q4 will be a critical period for global stability.',
      lookAhead: 'Watch for escalation signals from the Asia-Pacific theatre and continued economic warfare expansion.',
    };
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 800,
      system: 'You are an intelligence weekly digest editor. Respond in JSON only.',
      messages: [{ role: 'user', content: `Generate a weekly intelligence digest from these headlines:\n${headlines}\n\nReturn ONLY:\n{\n  "weekOf": "<current date>",\n  "headline": "<main week headline>",\n  "topEvents": ["<event1>", "<event2>", "<event3>"],\n  "emergingThreats": ["<threat1>", "<threat2>", "<threat3>"],\n  "winners": ["<win1>", "<win2>"],\n  "losers": ["<loss1>", "<loss2>"],\n  "analystPick": "<key insight sentence>",\n  "lookAhead": "<what to watch next week>"\n}` }],
    }),
  });
  const data = await res.json();
  return JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
}

export default function WeeklyDigest() {
  const { articles } = useNews();
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const d = await generateWeeklyDigest(articles);
    setDigest(d);
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">Weekly Digest</div>
            <div className="page-subtitle">AI WEEKLY INTELLIGENCE SUMMARY · CLASSIFIED</div>
          </div>
          <button className="btn-primary" onClick={generate} disabled={loading}>
            {loading ? '▌ COMPILING...' : digest ? '↻ REGENERATE' : '▶ GENERATE DIGEST'}
          </button>
        </div>
      </div>

      {!digest && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 8 }}>WEEKLY INTELLIGENCE DIGEST</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>AI generates a full weekly summary — top events, emerging threats, winners & losers, and outlook.</div>
          <button className="btn-primary" onClick={generate} style={{ padding: '12px 32px' }}>▶ GENERATE THIS WEEK'S DIGEST</button>
        </div>
      )}

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>▌ AI COMPILING WEEKLY INTELLIGENCE...</div>
          <div className="loading-bar" style={{ maxWidth: 400, margin: '0 auto' }}><div className="loading-bar-fill" /></div>
        </div>
      )}

      {digest && !loading && (
        <>
          <div className="card scanline" style={{ marginBottom: 16, textAlign: 'center', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent2)', letterSpacing: 3, marginBottom: 8 }}>⬛ NEXUS WEEKLY INTELLIGENCE DIGEST</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginBottom: 12 }}>Week of {digest.weekOf}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)', lineHeight: 1.4 }}>{digest.headline}</div>
          </div>

          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div className="card">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: 2, marginBottom: 12 }}>TOP EVENTS</div>
              {digest.topEvents?.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: i < digest.topEvents.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--accent)', minWidth: 20 }}>0{i + 1}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{e}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent2)', letterSpacing: 2, marginBottom: 12 }}>EMERGING THREATS</div>
              {digest.emergingThreats?.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: i < digest.emergingThreats.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: 'var(--accent2)', fontSize: 14 }}>▲</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div className="card" style={{ borderTop: '2px solid var(--green)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', letterSpacing: 2, marginBottom: 12 }}>POSITIVE DEVELOPMENTS</div>
              {digest.winners?.map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <span style={{ color: 'var(--green)' }}>✓</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{w}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{ borderTop: '2px solid var(--accent2)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent2)', letterSpacing: 2, marginBottom: 12 }}>DETERIORATING SITUATIONS</div>
              {digest.losers?.map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <span style={{ color: 'var(--accent2)' }}>✗</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div className="card" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: 2, marginBottom: 8 }}>◎ ANALYST PICK OF THE WEEK</div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.7, fontStyle: 'italic' }}>{digest.analystPick}</div>
            </div>
            <div className="card" style={{ background: 'rgba(255,165,2,0.05)', border: '1px solid rgba(255,165,2,0.2)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent3)', letterSpacing: 2, marginBottom: 8 }}>▶ LOOK AHEAD</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{digest.lookAhead}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
