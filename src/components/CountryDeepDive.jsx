import { useState } from 'react';
import { COUNTRIES, THREAT_LEVELS } from '../data/countries';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

async function getCountryIntel(country) {
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return `COUNTRY INTELLIGENCE REPORT — ${country.name.toUpperCase()}\n\nCLASSIFICATION: TOP SECRET // NEXUS\n\nEXECUTIVE SUMMARY\nAdd your Anthropic API key to generate real AI intelligence reports for ${country.name}.\n\nCURRENT THREAT ASSESSMENT\nRisk Score: ${country.riskScore}/100\nThreat Level: ${THREAT_LEVELS[country.threat].label}\nRegion: ${country.region}\n\nOnce configured, NEXUS AI will generate detailed analysis covering political stability, military posture, economic vulnerabilities, key power brokers, and 30-day conflict forecasts.`;
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
      max_tokens: 1000,
      system: 'You are a senior intelligence analyst. Generate classified country intelligence reports in a professional, structured format. No markdown. Use section headers in ALL CAPS followed by a newline.',
      messages: [{
        role: 'user',
        content: `Generate a classified intelligence report for ${country.name} (Risk Score: ${country.riskScore}/100, Threat Level: ${THREAT_LEVELS[country.threat].label}, Region: ${country.region}).

Include these sections:
EXECUTIVE SUMMARY
POLITICAL SITUATION
MILITARY POSTURE
ECONOMIC VULNERABILITIES
KEY POWER BROKERS
ACTIVE THREATS
30-DAY FORECAST

Keep each section to 2-3 sentences. Professional intelligence tone.`
      }],
    }),
  });
  const data = await res.json();
  return data.content[0].text;
}

export default function CountryDeepDive() {
  const [selected, setSelected] = useState(null);
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.region.toLowerCase().includes(search.toLowerCase())
  );

  const analyze = async (country) => {
    setSelected(country);
    setReport('');
    setLoading(true);
    const text = await getCountryIntel(country);
    setReport(text);
    setLoading(false);
  };

  const threatColor = (t) => THREAT_LEVELS[t]?.color || 'var(--text-dim)';

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Country Deep Dive</div>
        <div className="page-subtitle">AI-GENERATED FULL INTELLIGENCE REPORTS PER COUNTRY</div>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div>
          <input
            className="input-field"
            placeholder="Search country or region..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: 12 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 600, overflowY: 'auto' }}>
            {filtered.sort((a,b) => b.riskScore - a.riskScore).map(c => (
              <div key={c.code}
                className="card"
                style={{
                  cursor: 'pointer', padding: '10px 14px',
                  borderLeft: `3px solid ${selected?.code === c.code ? threatColor(c.threat) : 'transparent'}`,
                  borderRadius: '0 8px 8px 0',
                  background: selected?.code === c.code ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                }}
                onClick={() => analyze(c)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{c.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{c.region}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: threatColor(c.threat) }}>{c.riskScore}</div>
                    <span className={`badge badge-${c.threat >= 5 ? 'critical' : c.threat >= 4 ? 'high' : c.threat >= 3 ? 'medium' : 'low'}`} style={{ fontSize: 9 }}>
                      {THREAT_LEVELS[c.threat]?.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {!selected && (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-dim)', marginBottom: 12 }}>🌐</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>Select a country for full AI intel report</div>
            </div>
          )}

          {selected && (
            <div className="card scanline">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 36 }}>{selected.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)' }}>{selected.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{selected.region} · RISK {selected.riskScore}/100</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: threatColor(selected.threat) }}>{selected.threat}/5</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: threatColor(selected.threat) }}>{THREAT_LEVELS[selected.threat]?.label}</div>
                </div>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent2)', letterSpacing: 2, marginBottom: 12 }}>
                ⬛ TOP SECRET // NEXUS // {selected.code}-INTEL
              </div>

              {loading ? (
                <div style={{ padding: '32px 0', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>▌ COMPILING INTELLIGENCE...</div>
                  <div className="loading-bar"><div className="loading-bar-fill" /></div>
                </div>
              ) : (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 2, whiteSpace: 'pre-wrap', maxHeight: 500, overflowY: 'auto' }}>
                  {report.split('\n').map((line, i) => {
                    const isHeader = line === line.toUpperCase() && line.trim().length > 3 && !line.startsWith('⬛') && !line.startsWith('•');
                    return (
                      <div key={i} style={{ color: isHeader ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: isHeader ? 700 : 400, marginTop: isHeader ? 12 : 0, letterSpacing: isHeader ? 1 : 0 }}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              )}

              {!loading && report && (
                <button className="btn-primary" style={{ marginTop: 16, width: '100%' }} onClick={() => analyze(selected)}>
                  ↻ REGENERATE REPORT
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
