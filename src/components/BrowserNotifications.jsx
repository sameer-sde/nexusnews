import { useState, useEffect } from 'react';
import { MOCK_ALERTS } from '../data/countries';

export function useBrowserNotifications() {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const sendNotification = (title, body, icon = '🔴') => {
    if (permission === 'granted') {
      new Notification(`${icon} NEXUS ALERT: ${title}`, { body, icon: '/favicon.ico' });
    }
  };

  return { permission, requestPermission, sendNotification };
}

export default function BrowserNotifications() {
  const { permission, requestPermission, sendNotification } = useBrowserNotifications();
  const [enabled, setEnabled] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [rules, setRules] = useState([
    { id: 1, label: 'Critical alerts', active: true },
    { id: 2, label: 'New crisis events', active: true },
    { id: 3, label: 'Threat level changes', active: false },
    { id: 4, label: 'Daily briefing ready', active: false },
  ]);

  const toggleRule = (id) => setRules(r => r.map(rule => rule.id === id ? { ...rule, active: !rule.active } : rule));

  const handleEnable = async () => {
    const result = await requestPermission();
    if (result === 'granted') setEnabled(true);
  };

  const handleTest = () => {
    sendNotification('Military mobilization detected', 'Unusual troop movements reported near disputed border — Eastern Europe', '🔴');
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  // Simulate periodic alerts
  useEffect(() => {
    if (!enabled || permission !== 'granted') return;
    const interval = setInterval(() => {
      const alert = MOCK_ALERTS[Math.floor(Math.random() * MOCK_ALERTS.length)];
      if (alert.severity === 'critical' && rules.find(r => r.id === 1)?.active) {
        sendNotification(alert.title, `Region: ${alert.region}`, '🔴');
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [enabled, permission, rules]);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Browser Notifications</div>
        <div className="page-subtitle">REAL-TIME PUSH ALERTS · NEXUS NOTIFICATION CENTER</div>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 32 }}>🔔</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text-primary)' }}>Notification Status</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: permission === 'granted' ? 'var(--green)' : permission === 'denied' ? 'var(--accent2)' : 'var(--accent3)', marginTop: 2 }}>
                  {permission === 'granted' ? '● ENABLED' : permission === 'denied' ? '● BLOCKED' : '● NOT CONFIGURED'}
                </div>
              </div>
            </div>

            {permission === 'denied' && (
              <div style={{ background: 'var(--accent2-dim)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent2)' }}>
                Notifications blocked by browser. Enable in browser settings → Site Permissions.
              </div>
            )}

            {permission !== 'granted' && permission !== 'denied' && (
              <button className="btn-primary" style={{ width: '100%', marginBottom: 8 }} onClick={handleEnable}>
                🔔 ENABLE NOTIFICATIONS
              </button>
            )}

            {permission === 'granted' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 22, borderRadius: 11, background: enabled ? 'var(--green)' : 'var(--bg-secondary)', border: `1px solid ${enabled ? 'var(--green)' : 'var(--border)'}`, cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }} onClick={() => setEnabled(e => !e)}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: enabled ? 20 : 2, transition: 'left 0.2s' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: enabled ? 'var(--green)' : 'var(--text-secondary)' }}>{enabled ? 'ACTIVE — Monitoring threats' : 'INACTIVE — Enable to monitor'}</span>
                </div>
                <button className="btn-primary" onClick={handleTest} disabled={testSent} style={{ width: '100%' }}>
                  {testSent ? '✓ TEST SENT' : '▶ SEND TEST ALERT'}
                </button>
              </>
            )}
          </div>

          <div className="card">
            <div className="section-title">Notification Rules</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rules.map(rule => (
                <div key={rule.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: rule.active ? 'var(--text-primary)' : 'var(--text-dim)' }}>{rule.label}</span>
                  <div style={{ width: 40, height: 22, borderRadius: 11, background: rule.active ? 'var(--accent)' : 'var(--bg-primary)', border: `1px solid ${rule.active ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }} onClick={() => toggleRule(rule.id)}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: rule.active ? 20 : 2, transition: 'left 0.2s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Recent Alert Log</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MOCK_ALERTS.map(alert => (
              <div key={alert.id} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8, borderLeft: `3px solid ${alert.severity === 'critical' ? 'var(--accent2)' : alert.severity === 'high' ? '#ff6b35' : 'var(--accent3)'}` }}>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 4 }}>{alert.title}</div>
                <div style={{ display: 'flex', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                  <span className={`badge badge-${alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'high' : 'medium'}`}>{alert.severity}</span>
                  <span>{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
