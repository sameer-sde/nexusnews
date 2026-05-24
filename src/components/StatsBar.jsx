import { useState, useEffect } from 'react';
import { COUNTRIES, MOCK_ALERTS } from '../data/countries';

export default function StatsBar({ articleCount }) {
  const [time, setTime] = useState(new Date());
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const g = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 8000);
    return () => { clearInterval(t); clearInterval(g); };
  }, []);

  const criticals = COUNTRIES.filter(c => c.threat === 5).length;
  const activeAlerts = MOCK_ALERTS.filter(a => a.severity === 'critical' || a.severity === 'high').length;

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      padding: '6px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      flexShrink: 0,
      flexWrap: 'wrap',
    }}>
      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent2)', boxShadow: '0 0 6px var(--accent2)' }} className="pulse" />
        <span style={{ color: 'var(--accent2)', letterSpacing: 1 }}>LIVE</span>
      </div>

      <div style={{ width: 1, height: 14, background: 'var(--border)' }} />

      {/* UTC Clock */}
      <div style={{ color: 'var(--text-secondary)' }}>
        <span style={{ color: 'var(--text-dim)' }}>UTC </span>
        <span style={{ color: glitch ? 'var(--accent2)' : 'var(--accent)', letterSpacing: 1 }}>
          {time.toUTCString().slice(17, 25)}
        </span>
      </div>

      <div style={{ width: 1, height: 14, background: 'var(--border)' }} />

      {/* Articles */}
      <div style={{ color: 'var(--text-secondary)' }}>
        <span style={{ color: 'var(--text-dim)' }}>INTEL </span>
        <span style={{ color: 'var(--accent)' }}>{articleCount || 0}</span>
        <span style={{ color: 'var(--text-dim)' }}> articles</span>
      </div>

      <div style={{ width: 1, height: 14, background: 'var(--border)' }} />

      {/* Critical threats */}
      <div style={{ color: 'var(--text-secondary)' }}>
        <span style={{ color: 'var(--text-dim)' }}>CRITICAL </span>
        <span style={{ color: 'var(--accent2)' }}>{criticals}</span>
        <span style={{ color: 'var(--text-dim)' }}> zones</span>
      </div>

      <div style={{ width: 1, height: 14, background: 'var(--border)' }} />

      {/* Alerts */}
      <div style={{ color: 'var(--text-secondary)' }}>
        <span style={{ color: 'var(--text-dim)' }}>ALERTS </span>
        <span style={{ color: 'var(--accent3)' }}>{activeAlerts}</span>
        <span style={{ color: 'var(--text-dim)' }}> active</span>
      </div>

      {/* Threat level */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--text-dim)' }}>GLOBAL THREAT</span>
        <span style={{
          background: 'var(--accent2-dim)',
          border: '1px solid rgba(255,71,87,0.4)',
          borderRadius: 4,
          padding: '1px 8px',
          color: 'var(--accent2)',
          letterSpacing: 1,
          fontSize: 10,
        }}>HIGH</span>
      </div>
    </div>
  );
}
