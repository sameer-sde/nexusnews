import { useState } from 'react';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const PRESETS = [
  'What if Russia invades a NATO member state?',
  'What if China blockades Taiwan?',
  'What if Iran develops a nuclear weapon?',
  'What if the US withdraws from NATO?',
  'What if a major cyberattack takes down global banking?',
  'What if North Korea launches a missile at Japan?',
  'What if oil prices hit $300 per barrel?',
  'What if a new pandemic emerges in 2025?',
];

async function simulate(scenario) {
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return `SCENARIO SIMULATION — CLASSIFIED\n\nSCENARIO: ${scenario}\n\nAdd your Anthropic API key to run live geopolitical scenario simulations.\n\nOnce configured, NEXUS AI will simulate immediate reactions, short-term consequences, long-term implications, and affected nations for any geopolitical scenario you input.`;
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
      system: 'You are a senior geopolitical scenario analyst. Simulate the consequences of hypothetical geopolitical events with structured, realistic analysis. No markdown. Use ALL CAPS section headers.',
      messages: [{
        role: 'user',
        content: `Simulate this geopolitical scenario: "${scenario}"\n\nProvide analysis in these sections:\nSCENARIO ASSESSMENT\nIMMEDIATE REACTIONS (first 72 hours)\nSHORT-TERM CONSEQUENCES (1-3 months)\nLONG-TERM IMPLICATIONS (1-5 years)\nMOST AFFECTED NATIONS\nWILDCARD FACTORS\nANALYST VERDICT\n\nBe specific, realistic, and insightful. 2-3 sentences per section.`,
      }],
    }),
  });
  const data = await res.json();
  return data.content[0].text;
}

export default function ScenarioSimulator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentScenario, setCurrentScenario] = useState('');

  const run = async (scenario) => {
    const s = scenario || input.trim();
    if (!s) return;
    setCurrentScenario(s);
    setResult('');
    setLoading(true);
    const text = await simulate(s);
    setResult(text);
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Scenario Simulator</div>
        <div className="page-subtitle">AI GEOPOLITICAL CONSEQUENCE ENGINE — CLASSIFIED</div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 10, letterSpacing: 1 }}>ENTER HYPOTHETICAL SCENARIO</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input-field"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="What if... (describe any geopolitical scenario)"
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={() => run()} disabled={loading || !input.trim()}>
            {loading ? '▌' : '▶ SIMULATE'}
          </button>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 8 }}>PRESET SCENARIOS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PRESETS.map((p, i) => (
              <button key={i} className="tag" onClick={() => { setInput(p); run(p); }} style={{ fontSize: 11 }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>
            ▌ SIMULATING: "{currentScenario}"
          </div>
          <div className="loading-bar" style={{ maxWidth: 400, margin: '0 auto' }}><div className="loading-bar-fill" /></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 12 }}>
            Analyzing geopolitical consequences...
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="card scanline">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent2)', letterSpacing: 2, marginBottom: 6 }}>⬛ CLASSIFIED SIMULATION // NEXUS</div>
              <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5 }}>"{currentScenario}"</div>
            </div>
            <span className="badge badge-critical">SIMULATED</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 2, whiteSpace: 'pre-wrap' }}>
            {result.split('\n').map((line, i) => {
              const isHeader = line === line.toUpperCase() && line.trim().length > 3;
              return (
                <div key={i} style={{ color: isHeader ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: isHeader ? 700 : 400, marginTop: isHeader ? 14 : 0, letterSpacing: isHeader ? 1 : 0 }}>
                  {line}
                </div>
              );
            })}
          </div>
          <button className="btn-danger" style={{ marginTop: 16 }} onClick={() => { setResult(''); setCurrentScenario(''); setInput(''); }}>
            ↻ RUN NEW SCENARIO
          </button>
        </div>
      )}

      {!result && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-dim)', marginBottom: 12 }}>📡</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', marginBottom: 6 }}>SCENARIO ENGINE READY</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Enter any "what if" scenario above or pick a preset to simulate geopolitical consequences.</div>
        </div>
      )}
    </div>
  );
}
