import { useState } from 'react';
import { COUNTRIES, THREAT_LEVELS } from '../data/countries';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

async function predictConflicts() {
  const highRisk = COUNTRIES.filter(c => c.threat >= 3).map(c => `${c.name} (Risk: ${c.riskScore}, Level: ${THREAT_LEVELS[c.threat].label})`).join(', ');

  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return [
      { rank: 1, region: 'Eastern Europe', countries: ['Ukraine', 'Russia'], probability: 87, trend: 'rising', driver: 'Active military conflict with escalation potential', timeframe: '0-30 days' },
      { rank: 2, region: 'Middle East', countries: ['Iran', 'Israel'], probability: 72, trend: 'rising', driver: 'Nuclear program tensions and proxy conflicts', timeframe: '30-60 days' },
      { rank: 3, region: 'East Asia', countries: ['China', 'Taiwan'], probability: 58, trend: 'stable', driver: 'Taiwan Strait military posturing increasing', timeframe: '60-90 days' },
      { rank: 4, region: 'East Africa', countries: ['Ethiopia', 'Sudan'], probability: 64, trend: 'rising', driver: 'Humanitarian crisis and border disputes', timeframe: '0-30 days' },
      { rank: 5, region: 'South Asia', countries: ['Pakistan', 'India'], probability: 41, trend: 'stable', driver: 'Kashmir tensions and nuclear posturing', timeframe: '60-90 days' },
    ];
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
      max_tokens: 800,
      system: 'You are a conflict prediction analyst. Respond in JSON only, no markdown.',
      messages: [{
        role: 'user',
        content: `Based on current geopolitical conditions and these high-risk countries: ${highRisk}

Predict the top 5 regions most likely to see conflict escalation in the next 90 days.

Return ONLY a JSON array:
[{
  "rank": 1,
  "region": "region name",
  "countries": ["country1", "country2"],
  "probability": <0-100>,
  "trend": "rising|stable|declining",
  "driver": "main conflict driver in one sentence",
  "timeframe": "0-30 days|30-60 days|60-90 days"
}]`,
      }],
    }),
  });
  const data = await res.json();
  return JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
}

export default function ConflictPredictor() {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const result = await predictConflicts();
      setPredictions(result);
      setGenerated(true);
    } catch {
      setPredictions(null);
    }
    setLoading(false);
  };

  const trendIcon = (t) => t === 'rising' ? '▲' : t === 'declining' ? '▼' : '●';
  const trendColor = (t) => t === 'rising' ? 'var(--accent2)' : t === 'declining' ? 'var(--green)' : 'var(--accent3)';
  const probColor = (p) => p >= 70 ? 'var(--accent2)' : p >= 50 ? 'var(--accent3)' : 'var(--green)';

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">Conflict Predictor</div>
            <div className="page-subtitle">AI 90-DAY ESCALATION FORECAST · CLASSIFIED ASSESSMENT</div>
          </div>
          <button className="btn-primary" onClick={run} disabled={loading}>
            {loading ? '▌ COMPUTING...' : generated ? '↻ REFRESH FORECAST' : '▶ GENERATE FORECAST'}
          </button>
        </div>
      </div>

      {!generated && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 48, marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-dim)', marginBottom: 12 }}>🔮</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>AI CONFLICT PREDICTION ENGINE</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            AI analyzes current threat levels across 28 countries and predicts which regions are most likely to escalate in the next 90 days.
          </div>
          <button className="btn-primary" onClick={run}>▶ GENERATE 90-DAY FORECAST</button>
        </div>
      )}

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>▌ AI ANALYZING GLOBAL THREAT PATTERNS...</div>
          <div className="loading-bar" style={{ maxWidth: 400, margin: '0 auto' }}><div className="loading-bar-fill" /></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 12 }}>Cross-referencing {COUNTRIES.length} countries...</div>
        </div>
      )}

      {predictions && !loading && (
        <>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent2)', letterSpacing: 2, marginBottom: 16 }}>
            ⬛ TOP SECRET // NEXUS // CONFLICT-FORECAST-90D
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {predictions.map((p, i) => (
              <div key={i} className="card" style={{ borderLeft: `4px solid ${probColor(p.probability)}`, borderRadius: '0 8px 8px 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: probColor(p.probability), minWidth: 40, textAlign: 'center' }}>#{p.rank}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text-primary)' }}>{p.region}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {p.countries?.map((c, j) => (
                          <span key={j} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px', background: 'var(--bg-secondary)', borderRadius: 4, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{c}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>{p.driver}</div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: trendColor(p.trend) }}>{trendIcon(p.trend)} {p.trend?.toUpperCase()}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>📅 {p.timeframe}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 16px', minWidth: 80, flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 4 }}>PROBABILITY</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: probColor(p.probability) }}>{p.probability}%</div>
                    <div className="threat-bar" style={{ marginTop: 6 }}>
                      <div className="threat-fill" style={{ width: `${p.probability}%`, background: probColor(p.probability) }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', textAlign: 'center' }}>
            FORECAST GENERATED: {new Date().toUTCString().slice(0, 25)} UTC · NEXT UPDATE: 24H
          </div>
        </>
      )}
    </div>
  );
}
