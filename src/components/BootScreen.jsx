import { useState, useEffect } from 'react';

const BOOT_LINES = [
  { text: 'NEXUS INTELLIGENCE NETWORK v2.4.1', delay: 0, color: 'var(--accent)' },
  { text: 'Initializing secure boot sequence...', delay: 300 },
  { text: 'Loading cryptographic modules... OK', delay: 600 },
  { text: 'Establishing satellite uplink... OK', delay: 900 },
  { text: 'Connecting to global news feeds... OK', delay: 1200 },
  { text: 'Loading threat assessment engine... OK', delay: 1500 },
  { text: 'Calibrating geopolitical risk matrix... OK', delay: 1800 },
  { text: 'Activating AI analyst — Claude Sonnet... OK', delay: 2100 },
  { text: 'Decrypting intelligence archives... OK', delay: 2400 },
  { text: 'Running security diagnostics... PASSED', delay: 2700 },
  { text: 'All systems nominal.', delay: 3000, color: 'var(--green)' },
  { text: 'NEXUS ONLINE — AWAITING ANALYST AUTHENTICATION', delay: 3400, color: 'var(--accent)', bold: true },
];

export default function BootScreen({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => setDone(true), 600);
        }
      }, line.delay);
    });
  }, []);

  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(onComplete, 600);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>
      <div style={{ width: '100%', maxWidth: 640, padding: '0 32px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 900,
            color: 'var(--accent)', letterSpacing: 12,
            textShadow: '0 0 40px rgba(0,212,255,0.4)',
            animation: 'pulse 2s infinite',
          }}>NEXUS</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', letterSpacing: 4, marginTop: 4 }}>
            GLOBAL INTELLIGENCE NETWORK
          </div>
        </div>

        {/* Boot terminal */}
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '24px 28px',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          lineHeight: 2.2,
          minHeight: 320,
          position: 'relative',
          overflow: 'hidden',
        }} className="scanline">
          <div style={{ position: 'absolute', top: 12, right: 16, display: 'flex', gap: 6 }}>
            {['var(--accent2)', 'var(--accent3)', 'var(--green)'].map((c, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.6 }} />
            ))}
          </div>
          <div style={{ color: 'var(--text-dim)', marginBottom: 8, fontSize: 11 }}>nexus@warroom:~$ boot --secure --classified</div>
          {BOOT_LINES.map((line, i) => (
            <div key={i} style={{
              color: visibleLines.includes(i) ? (line.color || 'var(--text-secondary)') : 'transparent',
              fontWeight: line.bold ? 700 : 400,
              transition: 'color 0.2s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {visibleLines.includes(i) && (
                <>
                  <span style={{ color: 'var(--text-dim)' }}>{'>'}</span>
                  <span>{line.text}</span>
                  {i === visibleLines.length - 1 && !done && (
                    <span style={{ display: 'inline-block', width: 8, height: 14, background: 'var(--accent)', animation: 'blink 1s infinite' }} />
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Enter button */}
        {done && (
          <div style={{ textAlign: 'center', marginTop: 32, animation: 'fadeIn 0.5s ease' }}>
            <button onClick={handleEnter} style={{
              background: 'transparent',
              border: '1px solid var(--accent)',
              borderRadius: 6,
              padding: '12px 48px',
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              color: 'var(--accent)',
              letterSpacing: 4,
              cursor: 'pointer',
              textTransform: 'uppercase',
              boxShadow: '0 0 20px rgba(0,212,255,0.2)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,212,255,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.2)'; }}
            >
              ▶ ENTER WAR ROOM
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
