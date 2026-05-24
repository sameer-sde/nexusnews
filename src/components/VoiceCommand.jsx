import { useState, useEffect, useRef } from 'react';

const COMMANDS = [
  { phrases: ['command center', 'home', 'dashboard'], page: 'command', label: 'Command Center' },
  { phrases: ['live feed', 'news feed', 'news'], page: 'feed', label: 'Live Feed' },
  { phrases: ['world map', 'map', 'globe'], page: 'map', label: 'World Map' },
  { phrases: ['threat matrix', 'threats', 'threat'], page: 'threats', label: 'Threat Matrix' },
  { phrases: ['crisis alerts', 'alerts', 'crisis'], page: 'alerts', label: 'Crisis Alerts' },
  { phrases: ['ai analyst', 'analyst', 'chat'], page: 'analyst', label: 'AI Analyst' },
  { phrases: ['daily briefing', 'briefing'], page: 'briefing', label: 'Daily Briefing' },
  { phrases: ['bias detector', 'bias'], page: 'bias', label: 'Bias Detector' },
  { phrases: ['topic clusters', 'clusters', 'topics'], page: 'clusters', label: 'Topic Clusters' },
  { phrases: ['analytics', 'charts', 'data'], page: 'analytics', label: 'Analytics' },
  { phrases: ['global search', 'search'], page: 'search', label: 'Global Search' },
  { phrases: ['country deep dive', 'country', 'deep dive'], page: 'country', label: 'Country Deep Dive' },
  { phrases: ['scenario simulator', 'scenario', 'what if'], page: 'scenario', label: 'Scenario Simulator' },
  { phrases: ['disinformation', 'disinfo', 'fake news'], page: 'disinfo', label: 'Disinfo Detector' },
  { phrases: ['conflict predictor', 'predict', 'forecast'], page: 'predict', label: 'Conflict Predictor' },
  { phrases: ['heatmap', 'heat map'], page: 'heatmap', label: 'News Heatmap' },
  { phrases: ['leader profiles', 'leaders', 'profiles'], page: 'leaders', label: 'Leader Profiles' },
  { phrases: ['newspaper', 'paper', 'front page'], page: 'newspaper', label: 'AI Newspaper' },
  { phrases: ['quiz', 'intelligence quiz'], page: 'quiz', label: 'Intel Quiz' },
  { phrases: ['alliance mapper', 'alliances'], page: 'alliance', label: 'Alliance Mapper' },
  { phrases: ['economic war', 'sanctions', 'trade war'], page: 'economic', label: 'Economic War Tracker' },
  { phrases: ['bookmarks', 'dossier', 'saved'], page: 'bookmarks', label: 'Intel Dossier' },
  { phrases: ['theme', 'themes', 'appearance'], page: 'theme', label: 'Theme Switcher' },
];

export default function VoiceCommand({ onNavigate }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [supported, setSupported] = useState(true);
  const [history, setHistory] = useState([]);
  const recogRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recog = new SR();
    recogRef.current = recog;
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = 'en-US';

    recog.onstart = () => { setListening(true); setTranscript(''); setResult(null); };
    recog.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        processCommand(t.toLowerCase());
      }
    };
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);
    recog.start();
  };

  const stopListening = () => {
    recogRef.current?.stop();
    setListening(false);
  };

  const processCommand = (text) => {
    const matched = COMMANDS.find(cmd => cmd.phrases.some(p => text.includes(p)));
    if (matched) {
      setResult({ success: true, label: matched.label, page: matched.page });
      setHistory(h => [{ text, matched: matched.label, time: new Date().toTimeString().slice(0, 8) }, ...h.slice(0, 4)]);
      setTimeout(() => onNavigate(matched.page), 800);
    } else {
      setResult({ success: false });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Voice Command</div>
        <div className="page-subtitle">SPEAK TO NAVIGATE · AI WAR ROOM VOICE INTERFACE</div>
      </div>

      {!supported ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎙️</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent2)' }}>Voice recognition not supported in this browser.</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>Use Chrome or Edge for voice command support.</div>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <button
              onClick={listening ? stopListening : startListening}
              style={{
                width: 120, height: 120, borderRadius: '50%',
                background: listening ? 'var(--accent2-dim)' : 'var(--accent-dim)',
                border: `3px solid ${listening ? 'var(--accent2)' : 'var(--accent)'}`,
                cursor: 'pointer', fontSize: 40,
                boxShadow: listening ? '0 0 40px rgba(255,71,87,0.4)' : '0 0 20px rgba(0,212,255,0.2)',
                transition: 'all 0.3s',
                animation: listening ? 'pulse 1s infinite' : 'none',
              }}>
              {listening ? '⏹' : '🎙️'}
            </button>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: listening ? 'var(--accent2)' : 'var(--accent)', letterSpacing: 3, marginTop: 20 }}>
              {listening ? 'LISTENING...' : 'TAP TO SPEAK'}
            </div>
            {transcript && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)', marginTop: 16, padding: '10px 20px', background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)', display: 'inline-block' }}>
                "{transcript}"
              </div>
            )}
            {result && (
              <div style={{ marginTop: 16 }}>
                {result.success ? (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--green)' }}>✓ Navigating to {result.label}...</div>
                ) : (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent2)' }}>✗ Command not recognized. Try again.</div>
                )}
              </div>
            )}
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="section-title">Voice Commands</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {COMMANDS.map((c, i) => (
                  <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 8px', background: 'var(--bg-secondary)', borderRadius: 4, color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}
                    onClick={() => { processCommand(c.phrases[0]); }}>
                    "{c.phrases[0]}"
                  </span>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="section-title">Command History</div>
              {history.length === 0 ? (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>No commands yet. Say something!</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {history.map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 6 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)' }}>"{h.text}"</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', marginTop: 2 }}>→ {h.matched}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>{h.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
