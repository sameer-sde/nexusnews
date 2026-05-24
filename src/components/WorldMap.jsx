import { useState } from 'react';
import { COUNTRIES, THREAT_LEVELS, REGIONS } from '../data/countries';

export default function WorldMap({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [regionFilter, setRegionFilter] = useState('All');

  const filtered = regionFilter === 'All' ? COUNTRIES : COUNTRIES.filter(c => c.region === regionFilter);

  const threatColor = (threat) => THREAT_LEVELS[threat]?.color || 'var(--text-dim)';

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">World Threat Map</div>
        <div className="page-subtitle">GEOPOLITICAL RISK ASSESSMENT · {COUNTRIES.length} COUNTRIES MONITORED</div>
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
        {REGIONS.map(r => (
          <button key={r} className={`tag ${regionFilter === r ? 'active' : ''}`} onClick={() => setRegionFilter(r)}>{r}</button>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div>
          {/* Visual threat grid as map substitute */}
          <div className="card scanline" style={{ marginBottom: 16, padding: 20, minHeight: 300, position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 16, letterSpacing: 1 }}>GLOBAL THREAT VISUALIZATION</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))', gap: 6 }}>
              {filtered.map(c => (
                <button key={c.code} onClick={() => setSelected(c)} style={{
                  background: selected?.code === c.code ? THREAT_LEVELS[c.threat]?.bg : 'rgba(0,0,0,0.3)',
                  border: `1px solid ${selected?.code === c.code ? threatColor(c.threat) : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 6, padding: '8px 4px', cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                }}>
                  <span style={{ fontSize: 18 }}>{c.flag}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: threatColor(c.threat) }}>{c.code}</span>
                  <div style={{ width: '100%', height: 2, borderRadius: 1, background: threatColor(c.threat), opacity: c.riskScore / 100 }} />
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-title">Threat Level Legend</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(THREAT_LEVELS).reverse().map(([level, info]) => (
                <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: info.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: info.color }}>Level {level} — {info.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginLeft: 'auto' }}>
                    {COUNTRIES.filter(c => c.threat === parseInt(level)).length} countries
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {selected ? (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 40 }}>{selected.flag}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)' }}>{selected.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{selected.region}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: '10px 12px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 4 }}>THREAT LEVEL</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: threatColor(selected.threat) }}>{selected.threat}/5</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: threatColor(selected.threat) }}>{THREAT_LEVELS[selected.threat]?.label}</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: '10px 12px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 4 }}>RISK SCORE</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: threatColor(selected.threat) }}>{selected.riskScore}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>/ 100</div>
                </div>
              </div>
              <div className="threat-bar" style={{ height: 6, marginBottom: 16 }}>
                <div className="threat-fill" style={{ width: `${selected.riskScore}%`, background: threatColor(selected.threat) }} />
              </div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => onNavigate && onNavigate('analyst')}>
                ◎ ANALYZE WITH AI ANALYST
              </button>
            </div>
          ) : (
            <div className="card" style={{ marginBottom: 16, textAlign: 'center', padding: 40 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>◉ Select a country for intel</div>
            </div>
          )}

          <div className="section-title">Highest Risk Countries</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[...COUNTRIES].sort((a, b) => b.riskScore - a.riskScore).slice(0, 10).map(c => (
              <div key={c.code} className="card" style={{ padding: '10px 14px', cursor: 'pointer', borderLeft: `3px solid ${threatColor(c.threat)}` }}
                onClick={() => setSelected(c)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{c.flag}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>{c.name}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: threatColor(c.threat) }}>{c.riskScore}</span>
                  <span className={`badge badge-${c.threat >= 5 ? 'critical' : c.threat >= 4 ? 'high' : c.threat >= 3 ? 'medium' : 'low'}`}>
                    {THREAT_LEVELS[c.threat]?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
