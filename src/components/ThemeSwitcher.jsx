import { createContext, useContext, useState } from 'react';

const THEMES = {
  warroom: {
    name: 'War Room',
    icon: '🔵',
    vars: {
      '--bg-primary': '#080c12',
      '--bg-secondary': '#0d1420',
      '--bg-card': '#111827',
      '--bg-card-hover': '#162030',
      '--border': 'rgba(0, 212, 255, 0.12)',
      '--border-bright': 'rgba(0, 212, 255, 0.35)',
      '--accent': '#00d4ff',
      '--accent-dim': 'rgba(0, 212, 255, 0.15)',
    },
  },
  redalert: {
    name: 'Red Alert',
    icon: '🔴',
    vars: {
      '--bg-primary': '#0f0608',
      '--bg-secondary': '#1a0a0d',
      '--bg-card': '#1f0d10',
      '--bg-card-hover': '#2a1015',
      '--border': 'rgba(255, 71, 87, 0.15)',
      '--border-bright': 'rgba(255, 71, 87, 0.4)',
      '--accent': '#ff4757',
      '--accent-dim': 'rgba(255, 71, 87, 0.15)',
    },
  },
  matrix: {
    name: 'Matrix',
    icon: '🟢',
    vars: {
      '--bg-primary': '#000d00',
      '--bg-secondary': '#001500',
      '--bg-card': '#001a00',
      '--bg-card-hover': '#002200',
      '--border': 'rgba(46, 213, 115, 0.12)',
      '--border-bright': 'rgba(46, 213, 115, 0.35)',
      '--accent': '#2ed573',
      '--accent-dim': 'rgba(46, 213, 115, 0.15)',
    },
  },
  ghost: {
    name: 'Ghost',
    icon: '⚪',
    vars: {
      '--bg-primary': '#0a0a0f',
      '--bg-secondary': '#12121a',
      '--bg-card': '#18181f',
      '--bg-card-hover': '#1e1e28',
      '--border': 'rgba(180, 180, 220, 0.1)',
      '--border-bright': 'rgba(180, 180, 220, 0.3)',
      '--accent': '#b4b4dc',
      '--accent-dim': 'rgba(180, 180, 220, 0.1)',
    },
  },
};

const ThemeContext = createContext({ theme: 'warroom', setTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('warroom');

  const applyTheme = (t) => {
    setTheme(t);
    const vars = THEMES[t]?.vars || {};
    Object.entries(vars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: applyTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Theme Switcher</div>
        <div className="page-subtitle">CUSTOMIZE YOUR WAR ROOM INTERFACE</div>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        {Object.entries(themes).map(([key, t]) => (
          <div key={key}
            onClick={() => setTheme(key)}
            className="card"
            style={{
              cursor: 'pointer', padding: 24,
              border: `2px solid ${theme === key ? 'var(--accent)' : 'var(--border)'}`,
              background: theme === key ? 'var(--accent-dim)' : 'var(--bg-card)',
              transition: 'all 0.2s',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>{t.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: theme === key ? 'var(--accent)' : 'var(--text-primary)', letterSpacing: 1 }}>{t.name.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{theme === key ? '● ACTIVE' : '○ INACTIVE'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {Object.values(t.vars).slice(0, 4).map((color, i) => (
                <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: color }} />
              ))}
            </div>
            {theme === key && (
              <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', textAlign: 'center' }}>✓ CURRENTLY ACTIVE</div>
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 8 }}>CURRENT THEME</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent)' }}>{themes[theme]?.name.toUpperCase()} MODE ACTIVE</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Theme changes apply instantly across all pages.</div>
      </div>
    </div>
  );
}
