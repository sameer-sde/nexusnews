import { COUNTRIES, THREAT_LEVELS, REGIONS } from '../data/countries';
import { useState } from 'react';

export default function ThreatMatrix() {
  const [selectedRegion, setSelectedRegion] = useState('All');

  const filtered = selectedRegion === 'All' ? COUNTRIES : COUNTRIES.filter(c => c.region === selectedRegion);

  const byLevel = [5, 4, 3, 2, 1].map(level => ({
    level,
    info: THREAT_LEVELS[level],
    countries: filtered.filter(c => c.threat === level),
  }));

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Threat Matrix</div>
        <div className="page-subtitle">5-LEVEL GEOPOLITICAL RISK CLASSIFICATION SYSTEM</div>
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
        {REGIONS.map(r => (
          <button key={r} className={`tag ${selectedRegion === r ? 'active' : ''}`} onClick={() => setSelectedRegion(r)}>{r}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {byLevel.map(({ level, info, countries }) => (
          <div key={level} className="card" style={{ borderLeft: `4px solid ${info.color}`, borderRadius: '0 8px 8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: countries.length ? 12 : 0 }}>
              <div style={{ background: info.bg, border: `1px solid ${info.color}`, borderRadius: 6, padding: '6px 12px', minWidth: 120 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: info.color, letterSpacing: 2 }}>LEVEL {level}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: info.color, marginTop: 2 }}>{info.label}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
                {countries.length} {countries.length === 1 ? 'country' : 'countries'}
              </div>
            </div>
            {countries.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {countries.sort((a, b) => b.riskScore - a.riskScore).map(c => (
                  <div key={c.code} style={{ background: 'var(--bg-secondary)', border: `1px solid ${info.color}30`, borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{c.flag}</span>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: info.color }}>{c.riskScore}/100</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid-4" style={{ marginTop: 20 }}>
        {[5,4,3,2,1].map(level => (
          <div key={level} className="kpi-card" style={{ borderTop: `2px solid ${THREAT_LEVELS[level].color}` }}>
            <div className="kpi-label">{THREAT_LEVELS[level].label}</div>
            <div className="kpi-value" style={{ color: THREAT_LEVELS[level].color, fontSize: 24 }}>
              {COUNTRIES.filter(c => c.threat === level).length}
            </div>
            <div className="kpi-sub">countries</div>
          </div>
        ))}
      </div>
    </div>
  );
}
