import { useState } from 'react';

const NAV_GROUPS = [
  { label: 'OPERATIONS', items: [
    { id: 'command',  icon: '⬡', label: 'Command Center' },
    { id: 'defcon',   icon: '🔴', label: 'DEFCON Meter',     tag: 'NEW' },
    { id: 'tension',  icon: '🌡️', label: 'Tension Index',    tag: 'NEW' },
    { id: 'mission',  icon: '🎬', label: 'Mission Briefing', tag: 'NEW' },
    { id: 'alerts',   icon: '◆', label: 'Crisis Alerts' },
    { id: 'notify',   icon: '🔔', label: 'Notifications',    tag: 'NEW' },
    { id: 'xfeed',    icon: '𝕏',  label: 'Crisis Feed',       tag: 'NEW' },
    { id: 'sound',    icon: '🎵', label: 'Ambient Sound',     tag: 'NEW' },
  ]},
  { label: 'INTELLIGENCE', items: [
    { id: 'feed',     icon: '◈', label: 'Live Feed' },
    { id: 'livemap',  icon: '🗺️', label: 'Live World Map',   tag: 'NEW' },
    { id: 'heatmap',  icon: '▦', label: 'News Heatmap' },
    { id: 'mentions', icon: '📍', label: 'Mentioned Nations', tag: 'NEW' },
    { id: 'threats',  icon: '▲', label: 'Threat Matrix' },
    { id: 'predict',  icon: '🔮', label: 'Conflict Predictor' },
  ]},
  { label: 'AI ANALYSIS', items: [
    { id: 'analyst',  icon: '◎', label: 'AI Analyst' },
    { id: 'leaders',  icon: '👤', label: 'Leader Profiles' },
    { id: 'country',  icon: '🌐', label: 'Country Deep Dive' },
    { id: 'scenario', icon: '📡', label: 'Scenario Simulator' },
    { id: 'disinfo',  icon: '🕵️', label: 'Disinfo Detector' },
    { id: 'alliance', icon: '🤝', label: 'Alliance Mapper' },
    { id: 'economic', icon: '💰', label: 'Economic Wars' },
  ]},
  { label: 'REPORTS', items: [
    { id: 'briefing', icon: '▣', label: 'Daily Briefing' },
    { id: 'weekly',   icon: '📊', label: 'Weekly Digest',    tag: 'NEW' },
    { id: 'newspaper',icon: '📰', label: 'AI Newspaper' },
    { id: 'clusters', icon: '⬡', label: 'Topic Clusters' },
    { id: 'bias',     icon: '◐', label: 'Bias Detector' },
  ]},
  { label: 'TOOLS', items: [
    { id: 'quiz',     icon: '🧠', label: 'Intel Quiz' },
    { id: 'analytics',icon: '📈', label: 'Analytics' },
    { id: 'search',   icon: '◈', label: 'Global Search' },
    { id: 'image',    icon: '📸', label: 'Image Analyzer',   tag: 'NEW' },
    { id: 'un',       icon: '🏛️', label: 'UN Tracker',        tag: 'NEW' },
    { id: 'bookmarks',icon: '📌', label: 'Intel Dossier' },
    { id: 'voice',    icon: '🎙️', label: 'Voice Command' },
    { id: 'theme',    icon: '🌙', label: 'Theme Switcher' },
  ]},
];

export default function Sidebar({ active, onNav, analyst, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{
      width: collapsed ? 56 : 220,
      minWidth: collapsed ? 56 : 220,
      height: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s, min-width 0.3s',
      overflow: 'hidden', flexShrink: 0, zIndex: 10,
    }}>
      {/* Header */}
      <div style={{ padding: collapsed ? '16px 14px' : '16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 900, color: 'var(--accent)', letterSpacing: 3 }}>NEXUS</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 2, marginTop: 2 }}>INTEL NETWORK v4</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 16, padding: 4, cursor: 'pointer', flexShrink: 0 }}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Analyst info */}
      {!collapsed && (
        <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 2 }}>OPERATOR</div>
          <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{analyst?.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)' }}>{analyst?.clearance}</div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 2, padding: '10px 16px 4px', textTransform: 'uppercase' }}>{group.label}</div>
            )}
            {group.items.map(item => (
              <button key={item.id} onClick={() => onNav(item.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : 8, padding: '7px 16px',
                background: active === item.id ? 'var(--accent-dim)' : 'transparent',
                border: 'none',
                borderLeft: active === item.id ? '2px solid var(--accent)' : '2px solid transparent',
                color: active === item.id ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'all 0.15s',
                textAlign: 'left', justifyContent: collapsed ? 'center' : 'flex-start',
                fontFamily: 'var(--font-body)',
              }}
                onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { if (active !== item.id) e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ fontSize: 11, whiteSpace: 'nowrap', flex: 1 }}>{item.label}</span>}
                {!collapsed && item.tag && (
                  <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 3, background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(0,212,255,0.3)', flexShrink: 0 }}>{item.tag}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: collapsed ? 0 : 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} className="pulse" />
          {!collapsed && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>LIVE · Press ? for shortcuts</span>}
        </div>
        {!collapsed && (
          <button onClick={onLogout} style={{ width: '100%', background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '5px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', cursor: 'pointer', letterSpacing: 1 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent2)'; e.currentTarget.style.color = 'var(--accent2)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}>
            DISCONNECT
          </button>
        )}
      </div>
    </div>
  );
}
