import { useState, useEffect } from 'react';
import { COUNTRIES } from '../data/countries';
import { useNews } from '../hooks/useNews';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function calcIndex(countries) {
  const avgRisk = countries.reduce((s, c) => s + c.riskScore, 0) / countries.length;
  const criticalWeight = countries.filter(c => c.threat === 5).length * 3;
  const highWeight = countries.filter(c => c.threat === 4).length * 1.5;
  return Math.min(100, Math.round(avgRisk * 0.6 + criticalWeight + highWeight));
}

function generateHistory(baseIndex) {
  return Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    index: Math.max(20, Math.min(95, baseIndex + (Math.random() * 20 - 10) - (11 - i) * 0.5)),
  }));
}

const ZONE_LABELS = [
  { min: 80, max: 100, label: 'CRITICAL', color: 'var(--accent2)' },
  { min: 60, max: 79, label: 'HIGH', color: '#ff6b35' },
  { min: 40, max: 59, label: 'ELEVATED', color: 'var(--accent3)' },
  { min: 20, max: 39, label: 'MODERATE', color: 'var(--green)' },
  { min: 0, max: 19, label: 'LOW', color: 'var(--accent)' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      <div style={{ color: 'var(--accent)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--text-primary)' }}>Index: {Math.round(payload[0].value)}</div>
    </div>
  );
};

export default function TensionIndex() {
  const { articles } = useNews();
  const [index] = useState(() => calcIndex(COUNTRIES));
  const [history] = useState(() => generateHistory(index));
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setAnimated(a => { if (a >= index) { clearInterval(t); return index; } return a + 2; }), 20);
    return () => clearInterval(t);
  }, [index]);

  const zone = ZONE_LABELS.find(z => index >= z.min && index <= z.max);
  const circumference = 2 * Math.PI * 80;
  const strokeDash = (animated / 100) * circumference;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Global Tension Index</div>
        <div className="page-subtitle">COMPOSITE GEOPOLITICAL STRESS INDICATOR · LIVE</div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Gauge */}
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 20 }}>GLOBAL TENSION INDEX</div>
          <svg width="200" height="200" viewBox="0 0 200 200" style={{ margin: '0 auto', display: 'block' }}>
            <circle cx="100" cy="100" r="80" fill="none" stroke="var(--border)" strokeWidth="12" />
            <circle cx="100" cy="100" r="80" fill="none"
              stroke={zone?.color || 'var(--accent)'}
              strokeWidth="12"
              strokeDasharray={`${strokeDash} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              style={{ filter: `drop-shadow(0 0 8px ${zone?.color})`, transition: 'stroke-dasharray 0.1s' }}
            />
            <text x="100" y="90" textAnchor="middle" fill={zone?.color || 'var(--accent)'} fontSize="36" fontFamily="var(--font-display)" fontWeight="700">{animated}</text>
            <text x="100" y="112" textAnchor="middle" fill="var(--text-dim)" fontSize="11" fontFamily="monospace">/100</text>
            <text x="100" y="132" textAnchor="middle" fill={zone?.color || 'var(--accent)'} fontSize="10" fontFamily="monospace" letterSpacing="1">{zone?.label}</text>
          </svg>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginTop: 12 }}>
            Based on {COUNTRIES.length} countries · {articles.length} intel sources
          </div>
        </div>

        {/* Zone breakdown */}
        <div className="card">
          <div className="section-title">Tension Zones</div>
          {ZONE_LABELS.map(z => {
            const count = COUNTRIES.filter(c => {
              const score = c.riskScore;
              return score >= z.min && score <= z.max;
            }).length;
            return (
              <div key={z.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: z.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: z.color }}>{z.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>{count} countries</span>
                  </div>
                  <div className="threat-bar">
                    <div className="threat-fill" style={{ width: `${(count / COUNTRIES.length) * 100}%`, background: z.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History chart */}
      <div className="card">
        <div className="section-title">12-Month Tension History (Simulated)</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={history} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <XAxis dataKey="month" tick={{ fill: 'var(--text-dim)', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={60} stroke="rgba(255,165,2,0.3)" strokeDasharray="4 4" />
            <ReferenceLine y={80} stroke="rgba(255,71,87,0.3)" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="index" stroke="var(--accent)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-4" style={{ marginTop: 16 }}>
        <div className="kpi-card red"><div className="kpi-label">Critical Zones</div><div className="kpi-value red">{COUNTRIES.filter(c => c.threat === 5).length}</div><div className="kpi-sub">active</div></div>
        <div className="kpi-card amber"><div className="kpi-label">High Risk</div><div className="kpi-value amber">{COUNTRIES.filter(c => c.threat === 4).length}</div><div className="kpi-sub">countries</div></div>
        <div className="kpi-card blue"><div className="kpi-label">Avg Risk Score</div><div className="kpi-value blue">{Math.round(COUNTRIES.reduce((s, c) => s + c.riskScore, 0) / COUNTRIES.length)}</div><div className="kpi-sub">/ 100</div></div>
        <div className="kpi-card green"><div className="kpi-label">Stable Zones</div><div className="kpi-value green">{COUNTRIES.filter(c => c.threat <= 2).length}</div><div className="kpi-sub">countries</div></div>
      </div>
    </div>
  );
}
