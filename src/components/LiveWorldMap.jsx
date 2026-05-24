import { useState } from 'react';
import { COUNTRIES, THREAT_LEVELS } from '../data/countries';

const THREAT_COLORS = {
  1: '#2ed573', 2: '#2ed573', 3: '#ffa502', 4: '#ff6b35', 5: '#ff4757'
};

// Simplified world map regions as SVG polygons
const REGIONS_SVG = [
  { id: 'NA', label: 'North America', path: 'M 80,60 L 200,60 L 220,120 L 180,160 L 100,150 L 60,110 Z', countries: ['US', 'CA', 'MX'] },
  { id: 'SA', label: 'South America', path: 'M 140,170 L 200,160 L 230,240 L 200,320 L 150,330 L 120,280 L 130,210 Z', countries: ['BR', 'VE'] },
  { id: 'EU', label: 'Europe', path: 'M 340,50 L 440,45 L 460,90 L 430,120 L 360,115 L 330,85 Z', countries: ['GB', 'FR', 'DE', 'UA'] },
  { id: 'RU', label: 'Russia', path: 'M 440,40 L 680,35 L 690,100 L 600,110 L 460,100 L 445,70 Z', countries: ['RU'] },
  { id: 'ME', label: 'Middle East', path: 'M 430,115 L 530,110 L 550,160 L 500,180 L 430,165 L 415,140 Z', countries: ['IR', 'IQ', 'SA', 'SY', 'IL', 'YE'] },
  { id: 'AF', label: 'Africa', path: 'M 340,130 L 450,125 L 470,170 L 460,280 L 400,300 L 340,270 L 320,200 L 330,155 Z', countries: ['NG', 'ET', 'SD', 'SO'] },
  { id: 'AS', label: 'Asia', path: 'M 530,55 L 680,50 L 700,150 L 650,180 L 570,170 L 530,120 Z', countries: ['CN', 'IN', 'PK', 'AF', 'JP', 'KP', 'MM'] },
  { id: 'OC', label: 'Oceania', path: 'M 660,220 L 740,210 L 750,280 L 700,290 L 655,260 Z', countries: ['AU'] },
];

function getRegionThreat(regionCountries) {
  const matching = COUNTRIES.filter(c => regionCountries.includes(c.code));
  if (!matching.length) return 1;
  return Math.max(...matching.map(c => c.threat));
}

function getRegionRisk(regionCountries) {
  const matching = COUNTRIES.filter(c => regionCountries.includes(c.code));
  if (!matching.length) return 0;
  return Math.round(matching.reduce((s, c) => s + c.riskScore, 0) / matching.length);
}

export default function LiveWorldMap({ onNavigate }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    setSelectedCountry(null);
  };

  const handleCountryClick = (countryCode) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    setSelectedCountry(country);
  };

  const regionCountries = selectedRegion
    ? COUNTRIES.filter(c => selectedRegion.countries.includes(c.code))
    : [];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Live World Map</div>
        <div className="page-subtitle">INTERACTIVE GEOPOLITICAL THREAT VISUALIZATION</div>
      </div>

      <div className="grid-2" style={{ gap: 16, alignItems: 'start' }}>
        {/* SVG Map */}
        <div className="card scanline" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
            <span>NEXUS GLOBAL THREAT MAP</span>
            <span style={{ color: 'var(--accent)' }}>CLICK REGION FOR INTEL</span>
          </div>
          <svg viewBox="0 0 800 360" style={{ width: '100%', background: 'var(--bg-primary)' }}>
            {/* Ocean */}
            <rect width="800" height="360" fill="var(--bg-primary)" />
            {/* Grid lines */}
            {[...Array(8)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 45} x2="800" y2={i * 45} stroke="rgba(0,212,255,0.04)" strokeWidth="1" />
            ))}
            {[...Array(16)].map((_, i) => (
              <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="360" stroke="rgba(0,212,255,0.04)" strokeWidth="1" />
            ))}

            {REGIONS_SVG.map(region => {
              const threat = getRegionThreat(region.countries);
              const color = THREAT_COLORS[threat];
              const isHovered = hoveredRegion === region.id;
              const isSelected = selectedRegion?.id === region.id;
              return (
                <g key={region.id}>
                  <path
                    d={region.path}
                    fill={isSelected ? `${color}40` : isHovered ? `${color}25` : `${color}15`}
                    stroke={isSelected || isHovered ? color : `${color}60`}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    style={{ cursor: 'pointer', transition: 'all 0.2s', filter: isSelected ? `drop-shadow(0 0 8px ${color})` : 'none' }}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => handleRegionClick(region)}
                  />
                  {/* Country dots */}
                  {region.countries.map(code => {
                    const country = COUNTRIES.find(c => c.code === code);
                    if (!country) return null;
                    // Calculate approximate position within region
                    const pathNums = region.path.match(/[\d.]+/g).map(Number);
                    const xs = pathNums.filter((_, i) => i % 2 === 0);
                    const ys = pathNums.filter((_, i) => i % 2 === 1);
                    const cx = xs.reduce((a, b) => a + b, 0) / xs.length + (Math.random() * 20 - 10);
                    const cy = ys.reduce((a, b) => a + b, 0) / ys.length + (Math.random() * 20 - 10);
                    return (
                      <circle
                        key={code} cx={cx} cy={cy} r={4}
                        fill={THREAT_COLORS[country.threat]}
                        style={{ cursor: 'pointer', filter: `drop-shadow(0 0 4px ${THREAT_COLORS[country.threat]})` }}
                        onClick={(e) => { e.stopPropagation(); handleCountryClick(code); }}
                      >
                        <title>{country.name} — Risk {country.riskScore}</title>
                      </circle>
                    );
                  })}
                </g>
              );
            })}

            {/* Legend */}
            {Object.entries(THREAT_LEVELS).reverse().map(([level, info], i) => (
              <g key={level} transform={`translate(16, ${20 + i * 22})`}>
                <rect width="10" height="10" rx="2" fill={info.color} />
                <text x="15" y="9" fill={info.color} fontSize="9" fontFamily="monospace">{info.label}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* Info panel */}
        <div>
          {!selectedRegion && !selectedCountry && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🗺️</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>Click any region on the map for intel</div>
            </div>
          )}

          {selectedCountry && (
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 36 }}>{selectedCountry.flag}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)' }}>{selectedCountry.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{selectedCountry.region}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 4 }}>THREAT</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: THREAT_COLORS[selectedCountry.threat] }}>{selectedCountry.threat}/5</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 4 }}>RISK</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: THREAT_COLORS[selectedCountry.threat] }}>{selectedCountry.riskScore}</div>
                </div>
              </div>
              <div className="threat-bar" style={{ height: 6, marginBottom: 12 }}>
                <div className="threat-fill" style={{ width: `${selectedCountry.riskScore}%`, background: THREAT_COLORS[selectedCountry.threat] }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" style={{ flex: 1, fontSize: 11 }} onClick={() => onNavigate && onNavigate('country')}>🌐 Deep Dive</button>
                <button className="btn-primary" style={{ flex: 1, fontSize: 11 }} onClick={() => onNavigate && onNavigate('leaders')}>👤 Leaders</button>
              </div>
            </div>
          )}

          {selectedRegion && (
            <>
              <div className="card" style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: 2, marginBottom: 8 }}>REGION INTEL</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)', marginBottom: 4 }}>{selectedRegion.label}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-dim)', marginBottom: 3 }}>COUNTRIES</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent)' }}>{regionCountries.length}</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-dim)', marginBottom: 3 }}>MAX THREAT</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: THREAT_COLORS[getRegionThreat(selectedRegion.countries)] }}>{getRegionThreat(selectedRegion.countries)}/5</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', borderRadius: 6, padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-dim)', marginBottom: 3 }}>AVG RISK</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent3)' }}>{getRegionRisk(selectedRegion.countries)}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {regionCountries.sort((a, b) => b.riskScore - a.riskScore).map(c => (
                  <div key={c.code} className="card" style={{ padding: '10px 14px', cursor: 'pointer', borderLeft: `3px solid ${THREAT_COLORS[c.threat]}`, borderRadius: '0 8px 8px 0' }}
                    onClick={() => handleCountryClick(c.code)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{c.flag}</span>
                      <span style={{ fontSize: 13, flex: 1, color: 'var(--text-primary)' }}>{c.name}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: THREAT_COLORS[c.threat] }}>{c.riskScore}</span>
                      <span className={`badge badge-${c.threat >= 5 ? 'critical' : c.threat >= 4 ? 'high' : c.threat >= 3 ? 'medium' : 'low'}`} style={{ fontSize: 9 }}>{THREAT_LEVELS[c.threat]?.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
