import { useNews, useTopHeadlines } from '../hooks/useNews';
import { MOCK_ALERTS, COUNTRIES } from '../data/countries';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function CommandCenter({ analyst }) {
  const { articles, loading } = useNews();
  const { headlines } = useTopHeadlines();

  const criticalCountries = COUNTRIES.filter(c => c.threat >= 4).length;
  const avgRisk = Math.round(COUNTRIES.reduce((s, c) => s + c.riskScore, 0) / COUNTRIES.length);

  const tickerItems = [
    ...MOCK_ALERTS.map(a => ({ text: a.title, type: a.severity === 'critical' ? 'red' : a.severity === 'high' ? 'amber' : 'blue' })),
    ...(articles.slice(0, 5).map(a => ({ text: a.title, type: 'blue' }))),
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Command Center</div>
            <div className="page-subtitle">NEXUS GLOBAL INTELLIGENCE — LIVE OPERATIONS</div>
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
            <div style={{ color: 'var(--accent)' }}>{analyst?.name}</div>
            <div>{new Date().toUTCString().slice(0, 25)} UTC</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="ticker-item">
                <span className={`dot dot-${item.type}`} />
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="kpi-card red">
          <div className="kpi-label">Critical Threats</div>
          <div className="kpi-value red">{criticalCountries}</div>
          <div className="kpi-sub">Active hotspots</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">Avg Risk Score</div>
          <div className="kpi-value amber">{avgRisk}</div>
          <div className="kpi-sub">Global index / 100</div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-label">Live Articles</div>
          <div className="kpi-value blue">{loading ? '...' : articles.length}</div>
          <div className="kpi-sub">Indexed this session</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">Alert Level</div>
          <div className="kpi-value green">HIGH</div>
          <div className="kpi-sub">Global status</div>
        </div>
      </div>

      <div className="grid-2">
        <div>
          <div className="section-title">Breaking Alerts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MOCK_ALERTS.map(alert => (
              <div key={alert.id} className="card" style={{ borderLeft: `3px solid ${alert.severity === 'critical' ? 'var(--accent2)' : alert.severity === 'high' ? '#ff6b35' : alert.severity === 'medium' ? 'var(--accent3)' : 'var(--green)'}`, borderRadius: '0 8px 8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <span className={`badge badge-${alert.severity}`} style={{ marginBottom: 6, display: 'inline-block' }}>{alert.severity}</span>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{alert.title}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>{alert.region} · {alert.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-title">Top Threat Countries</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {COUNTRIES.filter(c => c.threat >= 4).slice(0, 8).map(c => (
              <div key={c.code} className="card" style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{c.flag}</span>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{c.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{c.region}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: c.threat === 5 ? 'var(--accent2)' : 'var(--accent3)' }}>{c.riskScore}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>RISK</div>
                  </div>
                </div>
                <div className="threat-bar" style={{ marginTop: 8 }}>
                  <div className="threat-fill" style={{ width: `${c.riskScore}%`, background: c.threat === 5 ? 'var(--accent2)' : c.threat === 4 ? '#ff6b35' : 'var(--accent3)' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="section-title" style={{ marginTop: 20 }}>Latest Intelligence</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {loading ? (
              <div className="card"><div className="loading-bar"><div className="loading-bar-fill" /></div></div>
            ) : articles.slice(0, 4).map((a, i) => (
              <div key={i} className="news-card">
                <div className="news-card-source">{a.source?.name}</div>
                <div className="news-card-title" style={{ fontSize: 13 }}>{a.title}</div>
                <div className="news-card-meta">
                  <span>{timeAgo(a.publishedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
