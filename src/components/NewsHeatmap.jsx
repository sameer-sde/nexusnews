import { COUNTRIES, THREAT_LEVELS } from '../data/countries';

export default function NewsHeatmap() {
  const maxRisk = Math.max(...COUNTRIES.map(c => c.riskScore));

  const getHeatColor = (score) => {
    const ratio = score / 100;
    if (ratio >= 0.8) return `rgba(255, 71, 87, ${0.3 + ratio * 0.7})`;
    if (ratio >= 0.6) return `rgba(255, 107, 53, ${0.3 + ratio * 0.7})`;
    if (ratio >= 0.4) return `rgba(255, 165, 2, ${0.3 + ratio * 0.7})`;
    if (ratio >= 0.2) return `rgba(46, 213, 115, ${0.3 + ratio * 0.7})`;
    return `rgba(0, 212, 255, ${0.2 + ratio * 0.5})`;
  };

  const regions = ['Americas', 'Europe', 'Middle East', 'Asia', 'Africa', 'Oceania'];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">News Heatmap</div>
        <div className="page-subtitle">GLOBAL RISK INTENSITY MAP · REAL-TIME VISUALIZATION</div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>HEAT INTENSITY:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[10, 25, 40, 60, 80, 95].map(s => (
              <div key={s} style={{ width: 32, height: 20, borderRadius: 3, background: getHeatColor(s), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'white' }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>Low → Critical</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {regions.map(region => {
          const regionCountries = COUNTRIES.filter(c => c.region === region).sort((a, b) => b.riskScore - a.riskScore);
          if (!regionCountries.length) return null;
          const avgRisk = Math.round(regionCountries.reduce((s, c) => s + c.riskScore, 0) / regionCountries.length);
          return (
            <div key={region}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: 2 }}>{region.toUpperCase()}</div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: getHeatColor(avgRisk).replace('rgba', 'rgb').replace(/,\s*[\d.]+\)/, ')') }}>AVG {avgRisk}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                {regionCountries.map(c => (
                  <div key={c.code} style={{
                    background: getHeatColor(c.riskScore),
                    border: `1px solid ${getHeatColor(c.riskScore)}`,
                    borderRadius: 8,
                    padding: '12px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{c.flag}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'white', fontWeight: 600 }}>{c.code}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'white', marginTop: 2 }}>{c.riskScore}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{THREAT_LEVELS[c.threat]?.label}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
