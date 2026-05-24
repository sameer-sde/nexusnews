import { useState } from 'react';
import { MOCK_ALERTS } from '../data/countries';

const EXTRA_ALERTS = [
  { id: 7, severity: 'critical', title: 'Nuclear facility security breach — IAEA notified', region: 'Eastern Europe', time: '4 hr ago' },
  { id: 8, severity: 'high', title: 'Pandemic warning issued — novel pathogen detected', region: 'Southeast Asia', time: '5 hr ago' },
  { id: 9, severity: 'medium', title: 'Undersea cable sabotage disrupts communications', region: 'North Atlantic', time: '6 hr ago' },
  { id: 10, severity: 'medium', title: 'Extremist group claims territory in contested zone', region: 'Central Africa', time: '7 hr ago' },
  { id: 11, severity: 'low', title: 'Ceasefire negotiations resume under UN mediation', region: 'Middle East', time: '8 hr ago' },
  { id: 12, severity: 'low', title: 'Intelligence sharing agreement signed between allies', region: 'Europe', time: '10 hr ago' },
];

const ALL_ALERTS = [...MOCK_ALERTS, ...EXTRA_ALERTS];
const SEV_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
const SEV_COLOR = { critical: 'var(--accent2)', high: '#ff6b35', medium: 'var(--accent3)', low: 'var(--green)' };

export default function CrisisAlerts() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const alerts = ALL_ALERTS
    .filter(a => filter === 'All' || a.severity === filter.toLowerCase())
    .sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);

  const counts = { critical: ALL_ALERTS.filter(a => a.severity === 'critical').length, high: ALL_ALERTS.filter(a => a.severity === 'high').length, medium: ALL_ALERTS.filter(a => a.severity === 'medium').length, low: ALL_ALERTS.filter(a => a.severity === 'low').length };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Crisis Alerts</div>
        <div className="page-subtitle">REAL-TIME THREAT NOTIFICATIONS · AI SEVERITY SCORING</div>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        {Object.entries(counts).map(([sev, count]) => (
          <div key={sev} className="kpi-card" style={{ borderTop: `2px solid ${SEV_COLOR[sev]}`, cursor: 'pointer' }} onClick={() => setFilter(sev.charAt(0).toUpperCase() + sev.slice(1))}>
            <div className="kpi-label">{sev.toUpperCase()}</div>
            <div className="kpi-value" style={{ color: SEV_COLOR[sev], fontSize: 24 }}>{count}</div>
            <div className="kpi-sub">active alerts</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {filters.map(f => <button key={f} className={`tag ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {alerts.map(alert => (
          <div key={alert.id} className="card" style={{ borderLeft: `4px solid ${SEV_COLOR[alert.severity]}`, borderRadius: '0 8px 8px 0', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ background: `${SEV_COLOR[alert.severity]}15`, border: `1px solid ${SEV_COLOR[alert.severity]}40`, borderRadius: 6, padding: '8px 10px', textAlign: 'center', minWidth: 70, flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: SEV_COLOR[alert.severity], letterSpacing: 1, textTransform: 'uppercase' }}>{alert.severity}</div>
              <div style={{ fontSize: 20, marginTop: 4 }}>
                {alert.severity === 'critical' ? '🔴' : alert.severity === 'high' ? '🟠' : alert.severity === 'medium' ? '🟡' : '🟢'}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, marginBottom: 4, lineHeight: 1.5 }}>{alert.title}</div>
              <div style={{ display: 'flex', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                <span>📍 {alert.region}</span>
                <span>🕐 {alert.time}</span>
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <span className={`badge badge-${alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'high' : alert.severity === 'medium' ? 'medium' : 'low'}`}>
                {alert.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
