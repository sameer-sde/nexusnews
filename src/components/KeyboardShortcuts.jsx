import { useEffect, useState } from 'react';

const SHORTCUTS = [
  { keys: ['g', 'c'], page: 'command',   label: 'Command Center' },
  { keys: ['g', 'f'], page: 'feed',      label: 'Live Feed' },
  { keys: ['g', 'm'], page: 'livemap',   label: 'Live World Map' },
  { keys: ['g', 'a'], page: 'analyst',   label: 'AI Analyst' },
  { keys: ['g', 't'], page: 'threats',   label: 'Threat Matrix' },
  { keys: ['g', 'l'], page: 'alerts',    label: 'Crisis Alerts' },
  { keys: ['g', 'p'], page: 'leaders',   label: 'Leader Profiles' },
  { keys: ['g', 'b'], page: 'briefing',  label: 'Daily Briefing' },
  { keys: ['g', 's'], page: 'search',    label: 'Global Search' },
  { keys: ['g', 'n'], page: 'newspaper', label: 'AI Newspaper' },
  { keys: ['g', 'q'], page: 'quiz',      label: 'Intel Quiz' },
  { keys: ['g', 'd'], page: 'defcon',    label: 'DEFCON Meter' },
  { keys: ['g', 'x'], page: 'scenario',  label: 'Scenario Simulator' },
  { keys: ['?'],      page: null,        label: 'Show shortcuts' },
];

export function useKeyboardShortcuts(onNavigate) {
  const [lastKey, setLastKey] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === '?') { setShowHelp(h => !h); return; }
      if (e.key === 'Escape') { setShowHelp(false); return; }

      const current = e.key.toLowerCase();
      if (lastKey === 'g') {
        const match = SHORTCUTS.find(s => s.keys[0] === 'g' && s.keys[1] === current);
        if (match && match.page) { onNavigate(match.page); setLastKey(''); return; }
      }
      setLastKey(current);
      setTimeout(() => setLastKey(''), 1000);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lastKey, onNavigate]);

  return { showHelp, setShowHelp };
}

export function KeyboardShortcutsOverlay({ showHelp, onClose }) {
  if (!showHelp) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 32px', minWidth: 400, maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--accent)', letterSpacing: 2 }}>KEYBOARD SHORTCUTS</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {SHORTCUTS.filter(s => s.page).map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {s.keys.map((k, j) => (
                  <kbd key={j} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 7px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', minWidth: 22, textAlign: 'center' }}>{k}</kbd>
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', textAlign: 'center' }}>
          Press <kbd style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 3, padding: '1px 5px', color: 'var(--accent)', fontSize: 10 }}>?</kbd> to toggle · <kbd style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 3, padding: '1px 5px', color: 'var(--accent)', fontSize: 10 }}>Esc</kbd> to close
        </div>
      </div>
    </div>
  );
}
