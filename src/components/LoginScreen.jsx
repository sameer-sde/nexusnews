import { useState } from 'react';
import { ANALYSTS } from '../data/countries';

export default function LoginScreen({ onLogin }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 900));
    const analyst = ANALYSTS.find(a => a.id === id.toUpperCase() && a.password === password.toLowerCase());
    if (analyst) {
      onLogin(analyst);
    } else {
      setError('ACCESS DENIED — Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 60%)',
    }}>
      <div style={{ width: 400, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: 'var(--accent)', letterSpacing: 6, marginBottom: 4 }}>NEXUS</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: 3 }}>GLOBAL INTELLIGENCE NETWORK</div>
          <div style={{ marginTop: 16, height: 1, background: 'linear-gradient(to right, transparent, var(--accent), transparent)' }} />
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 32,
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: 2, marginBottom: 24, textAlign: 'center' }}>
            ANALYST AUTHENTICATION REQUIRED
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: 1, marginBottom: 6 }}>ANALYST ID</div>
              <input
                className="input-field"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="NXS-001"
                autoComplete="off"
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: 2 }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: 1, marginBottom: 6 }}>PASSPHRASE</div>
              <input
                className="input-field"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div style={{ background: 'var(--accent2-dim)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 6, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent2)', marginBottom: 16, textAlign: 'center' }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: 13 }} disabled={loading}>
              {loading ? '▌ AUTHENTICATING...' : '▶ ENTER WAR ROOM'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 6 }}>DEMO CREDENTIALS</div>
            {ANALYSTS.map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 3 }}>
                <span style={{ color: 'var(--accent)' }}>{a.id}</span>
                <span>{a.password}</span>
                <span style={{ color: 'var(--text-dim)' }}>{a.clearance}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: 1 }}>
          NEXUSNEWS v2.4.1 — CLASSIFIED SYSTEM
        </div>
      </div>
    </div>
  );
}
