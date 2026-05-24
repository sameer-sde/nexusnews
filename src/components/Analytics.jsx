import { COUNTRIES, THREAT_LEVELS } from '../data/countries';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

const COLORS = ['var(--accent2)', '#ff6b35', 'var(--accent3)', 'var(--green)', 'var(--accent)'];

const regionData = ['Americas','Europe','Middle East','Asia','Africa','Oceania'].map(region => ({
  region: region.replace(' ', '\n'),
  avgRisk: Math.round(COUNTRIES.filter(c => c.region === region).reduce((s,c)=>s+c.riskScore,0) / Math.max(COUNTRIES.filter(c=>c.region===region).length, 1)),
  countries: COUNTRIES.filter(c => c.region === region).length,
}));

const threatPieData = [5,4,3,2,1].map(l => ({
  name: THREAT_LEVELS[l].label,
  value: COUNTRIES.filter(c => c.threat === l).length,
  color: THREAT_LEVELS[l].color,
}));

const topRisk = [...COUNTRIES].sort((a,b)=>b.riskScore-a.riskScore).slice(0,8).map(c=>({ name: c.code, score: c.riskScore, flag: c.flag }));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)' }}>
      <div style={{ color: 'var(--accent)', marginBottom: 4 }}>{label}</div>
      {payload.map((p,i) => <div key={i}>{p.name}: {p.value}</div>)}
    </div>
  );
};

export default function Analytics() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Analytics Dashboard</div>
        <div className="page-subtitle">GEOPOLITICAL RISK INTELLIGENCE · DATA VISUALIZATION</div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-title">Avg Risk Score by Region</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regionData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="region" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} domain={[0,100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgRisk" fill="var(--accent)" radius={[4,4,0,0]} name="Risk Score">
                {regionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-title">Countries by Threat Level</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ResponsiveContainer width="60%" height={220}>
              <PieChart>
                <Pie data={threatPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" strokeWidth={0}>
                  {threatPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {threatPieData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: d.color }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Top 8 Highest Risk Countries</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topRisk} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" domain={[0,100]} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[0,4,4,0]} name="Risk Score">
              {topRisk.map((_, i) => <Cell key={i} fill={i < 2 ? 'var(--accent2)' : i < 4 ? '#ff6b35' : i < 6 ? 'var(--accent3)' : 'var(--green)'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-4" style={{ marginTop: 20 }}>
        <div className="kpi-card blue"><div className="kpi-label">Countries Monitored</div><div className="kpi-value blue">{COUNTRIES.length}</div><div className="kpi-sub">active tracking</div></div>
        <div className="kpi-card red"><div className="kpi-label">Critical Risk</div><div className="kpi-value red">{COUNTRIES.filter(c=>c.threat===5).length}</div><div className="kpi-sub">level 5 threats</div></div>
        <div className="kpi-card amber"><div className="kpi-label">Highest Risk</div><div className="kpi-value amber">{Math.max(...COUNTRIES.map(c=>c.riskScore))}</div><div className="kpi-sub">max risk score</div></div>
        <div className="kpi-card green"><div className="kpi-label">Safe Countries</div><div className="kpi-value green">{COUNTRIES.filter(c=>c.threat<=2).length}</div><div className="kpi-sub">threat level ≤ 2</div></div>
      </div>
    </div>
  );
}
