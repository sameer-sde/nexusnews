import { useState } from 'react';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const SAMPLE_IMAGES = [
  { label: 'Protest crowd', url: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800' },
  { label: 'Military convoy', url: 'https://images.unsplash.com/photo-1580573087685-eec5b9b42a07?w=800' },
  { label: 'UN Security Council', url: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800' },
  { label: 'Refugee camp', url: 'https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=800' },
];

async function analyzeImage(imageUrl) {
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return {
      description: 'Add your Anthropic API key to enable AI image analysis.',
      geopoliticalContext: 'With an API key, NEXUS AI will analyze images for geopolitical significance, identifying locations, events, actors, and strategic implications.',
      threatAssessment: 'N/A — API key required',
      keyObservations: ['Configure VITE_ANTHROPIC_API_KEY in .env.local', 'Supports news photos, satellite imagery, protest scenes', 'AI identifies geopolitical context from visual cues'],
      urgency: 'LOW',
    };
  }

  // Fetch image as base64
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const base64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });
  const mediaType = blob.type || 'image/jpeg';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514', max_tokens: 600,
      system: 'You are a geopolitical image intelligence analyst. Analyze images for political, military, and humanitarian significance. Respond in JSON only.',
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: 'Analyze this image for geopolitical intelligence.\nReturn ONLY:\n{\n  "description": "<what you see in 2 sentences>",\n  "geopoliticalContext": "<political/military/humanitarian significance 2 sentences>",\n  "threatAssessment": "<threat level and nature 1 sentence>",\n  "keyObservations": ["<observation1>", "<observation2>", "<observation3>"],\n  "urgency": "<CRITICAL|HIGH|MEDIUM|LOW>"\n}' }
        ],
      }],
    }),
  });
  const data = await res.json();
  return JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
}

const URGENCY_COLOR = { CRITICAL: 'var(--accent2)', HIGH: '#ff6b35', MEDIUM: 'var(--accent3)', LOW: 'var(--green)' };

export default function ImageAnalyzer() {
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async (targetUrl) => {
    const u = targetUrl || url.trim();
    if (!u) return;
    setError('');
    setResult(null);
    setImageUrl(u);
    setLoading(true);
    try {
      const r = await analyzeImage(u);
      setResult(r);
    } catch (e) {
      setError('Could not analyze image. Check the URL and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">AI Image Analyzer</div>
        <div className="page-subtitle">GEOPOLITICAL VISUAL INTELLIGENCE · POWERED BY CLAUDE VISION</div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 10, letterSpacing: 1 }}>PASTE IMAGE URL FOR ANALYSIS</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input-field" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyze()} placeholder="https://example.com/news-image.jpg" style={{ flex: 1 }} />
          <button className="btn-primary" onClick={() => analyze()} disabled={loading || !url.trim()}>
            {loading ? '▌' : '▶ ANALYZE'}
          </button>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 8 }}>SAMPLE IMAGES</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SAMPLE_IMAGES.map((s, i) => (
              <button key={i} className="tag" onClick={() => { setUrl(s.url); analyze(s.url); }}>{s.label}</button>
            ))}
          </div>
        </div>
      </div>

      {error && <div style={{ background: 'var(--accent2-dim)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent2)' }}>{error}</div>}

      {(imageUrl || loading) && (
        <div className="grid-2" style={{ gap: 16, alignItems: 'start' }}>
          <div>
            {imageUrl && (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <img src={imageUrl} alt="Analyzed" style={{ width: '100%', maxHeight: 320, objectFit: 'cover', display: 'block' }} onError={() => setError('Image could not be loaded.')} />
                <div style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1 }}>⬛ NEXUS VISUAL INTELLIGENCE ANALYSIS</div>
              </div>
            )}
          </div>

          <div>
            {loading ? (
              <div className="card" style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>▌ AI ANALYZING IMAGE...</div>
                <div className="loading-bar"><div className="loading-bar-fill" /></div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 12 }}>Scanning for geopolitical indicators...</div>
              </div>
            ) : result ? (
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent2)', letterSpacing: 2 }}>VISUAL INTEL REPORT</div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px', borderRadius: 4, background: `${URGENCY_COLOR[result.urgency]}15`, color: URGENCY_COLOR[result.urgency], border: `1px solid ${URGENCY_COLOR[result.urgency]}40` }}>
                    {result.urgency} URGENCY
                  </span>
                </div>

                {[
                  { label: 'VISUAL DESCRIPTION', key: 'description', color: 'var(--accent)' },
                  { label: 'GEOPOLITICAL CONTEXT', key: 'geopoliticalContext', color: 'var(--accent3)' },
                  { label: 'THREAT ASSESSMENT', key: 'threatAssessment', color: 'var(--accent2)' },
                ].map(({ label, key, color }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color, letterSpacing: 2, marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result[key]}</div>
                  </div>
                ))}

                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: 2, marginBottom: 8 }}>KEY OBSERVATIONS</div>
                  {result.keyObservations?.map((obs, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>0{i + 1}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{obs}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {!imageUrl && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📸</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 8 }}>VISUAL INTELLIGENCE ANALYZER</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Paste any news image URL — AI analyzes it for geopolitical significance, threat level, and strategic context.</div>
        </div>
      )}
    </div>
  );
}
