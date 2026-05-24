import { useState } from 'react';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const EXAMPLES = [
  'BREAKING: Government secretly putting chemicals in water supply to control population',
  'Scientists confirm 5G towers are causing cancer and governments are hiding it',
  'NATO forces massing at border for surprise attack next week, sources say',
  'Leaked documents reveal election was stolen by foreign operatives',
];

async function detectDisinfo(headline) {
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return {
      credibilityScore: 45,
      verdict: 'UNVERIFIED',
      verdictColor: 'var(--accent3)',
      techniques: ['Sensationalism', 'Vague sources', 'Fear mongering'],
      redFlags: ['No named sources', 'Absolute claims', 'Emotional language'],
      analysis: 'Add your Anthropic API key to enable real disinformation detection.',
      recommendation: 'Configure VITE_ANTHROPIC_API_KEY in .env.local',
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
      max_tokens: 600,
      system: 'You are a disinformation analyst. Analyze headlines for credibility and propaganda techniques. Respond in JSON only, no markdown.',
      messages: [{
        role: 'user',
        content: `Analyze this headline for disinformation: "${headline}"

Return ONLY this JSON:
{
  "credibilityScore": <0-100, higher=more credible>,
  "verdict": "<CREDIBLE|LIKELY TRUE|UNVERIFIED|SUSPICIOUS|DISINFORMATION>",
  "techniques": ["<technique1>", "<technique2>"],
  "redFlags": ["<flag1>", "<flag2>"],
  "analysis": "<2 sentence analysis>",
  "recommendation": "<one sentence advice>"
}`,
      }],
    }),
  });
  const data = await res.json();
  const text = data.content[0].text.replace(/```json|```/g, '').trim();
  const result = JSON.parse(text);
  const colors = { CREDIBLE: 'var(--green)', 'LIKELY TRUE': 'var(--green)', UNVERIFIED: 'var(--accent3)', SUSPICIOUS: '#ff6b35', DISINFORMATION: 'var(--accent2)' };
  result.verdictColor = colors[result.verdict] || 'var(--accent3)';
  return result;
}

export default function DisinfoDetector() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState('');

  const analyze = async (text) => {
    const t = text || input.trim();
    if (!t) return;
    setAnalyzed(t);
    setResult(null);
    setLoading(true);
    try {
      const r = await detectDisinfo(t);
      setResult(r);
    } catch {
      setResult({ credibilityScore: 0, verdict: 'ERROR', verdictColor: 'var(--accent2)', techniques: [], redFlags: [], analysis: 'Analysis failed. Check API key.', recommendation: 'Verify your Anthropic API key.' });
    }
    setLoading(false);
  };

  const scoreColor = (s) => s >= 70 ? 'var(--green)' : s >= 40 ? 'var(--accent3)' : 'var(--accent2)';

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Disinformation Detector</div>
        <div className="page-subtitle">AI CREDIBILITY ANALYSIS · PROPAGANDA DETECTION ENGINE</div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 10, letterSpacing: 1 }}>PASTE HEADLINE OR CLAIM TO ANALYZE</div>
        <textarea
          className="input-field"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste any news headline, social media claim, or article title..."
          style={{ minHeight: 80, resize: 'vertical', lineHeight: 1.6 }}
        />
        <button className="btn-primary" style={{ marginTop: 10 }} onClick={() => analyze()} disabled={loading || !input.trim()}>
          {loading ? '▌ ANALYZING...' : '▶ DETECT DISINFORMATION'}
        </button>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 8 }}>TEST EXAMPLES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {EXAMPLES.map((e, i) => (
              <button key={i} onClick={() => { setInput(e); analyze(e); }}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                ▶ {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>▌ SCANNING FOR DISINFORMATION MARKERS...</div>
          <div className="loading-bar" style={{ maxWidth: 400, margin: '0 auto' }}><div className="loading-bar-fill" /></div>
        </div>
      )}

      {result && !loading && (
        <div className="card">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 8 }}>ANALYZED CLAIM</div>
          <div style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 20, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 6, fontStyle: 'italic' }}>
            "{analyzed}"
          </div>

          <div className="grid-3" style={{ marginBottom: 20 }}>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 6 }}>CREDIBILITY SCORE</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: scoreColor(result.credibilityScore) }}>{result.credibilityScore}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>/ 100</div>
              <div className="threat-bar" style={{ marginTop: 8 }}>
                <div className="threat-fill" style={{ width: `${result.credibilityScore}%`, background: scoreColor(result.credibilityScore) }} />
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '14px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 10 }}>VERDICT</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: result.verdictColor, letterSpacing: 1, padding: '6px 12px', border: `1px solid ${result.verdictColor}40`, borderRadius: 6, background: `${result.verdictColor}15` }}>
                {result.verdict}
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 8 }}>PROPAGANDA TECHNIQUES</div>
              {result.techniques?.map((t, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent3)', marginBottom: 4 }}>⚠ {t}</div>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 8 }}>RED FLAGS DETECTED</div>
              {result.redFlags?.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent2)' }}>
                  <span>◆</span> {f}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 8 }}>ANALYST ASSESSMENT</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>{result.analysis}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', padding: '8px 12px', background: 'var(--green-dim)', borderRadius: 6 }}>
                ▶ {result.recommendation}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
