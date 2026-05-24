import { useNews } from '../hooks/useNews';
import { COUNTRIES } from '../data/countries';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const THREAT_COLORS = { 1: '#2ed573', 2: '#2ed573', 3: '#ffa502', 4: '#ff6b35', 5: '#ff4757' };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      <div style={{ color: 'var(--accent)' }}>{payload[0].payload.flag} {payload[0].payload.name}</div>
      <div style={{ color: 'var(--text-primary)', marginTop: 4 }}>Mentions: {payload[0].value}</div>
      <div style={{ color: 'var(--text-dim)', marginTop: 2 }}>Risk Score: {payload[0].payload.riskScore}</div>
    </div>
  );
};

export default function MentionedNations() {
  const { articles, loading } = useNews();

  const countMentions = () => {
    const counts = {};
    COUNTRIES.forEach(c => { counts[c.code] = 0; });
    articles.forEach(a => {
      const text = `${a.title} ${a.description || ''}`.toLowerCase();
      COUNTRIES.forEach(c => {
        const name = c.name.toLowerCase();
        if (text.includes(name) || text.includes(c.code.toLowerCase())) {
          counts[c.code] = (counts[c.code] || 0) + 1;
        }
      });
    });
    return COUNTRIES
      .map(c => ({ ...c, mentions: counts[c.code] || 0 }))
      .sort((a, b) => b.mentions - a.mentions)
      .filter(c => c.mentions > 0)
      .slice(0, 15);
  };

  const data = loading ? [] : countMentions();
  const top = data.slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Most Mentioned Nations</div>
        <div className="page-subtitle">LIVE FREQUENCY RANKING · {articles.length} ARTICLES ANALYZED</div>
      </div>

      {loading ? (
        <div className="card"><div className="loading-bar"><div className="loading-bar-fill" /></div></div>
      ) : (
        <>
          {/* Top 5 podium */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-title">Top Mentioned Today</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {top.map((c, i) => (
                <div key={c.code} style={{
                  flex: 1, minWidth: 100, background: 'var(--bg-secondary)',
                  border: `1px solid ${THREAT_COLORS[c.threat]}40`,
                  borderTop: `3px solid ${THREAT_COLORS[c.threat]}`,
                  borderRadius: '0 0 8px 8px', padding: '14px 12px', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-dim)', marginBottom: 6 }}>#{i + 1}</div>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{c.flag}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: THREAT_COLORS[c.threat] }}>{c.mentions}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>mentions</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bar chart */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-title">Mention Frequency Chart</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="code" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="mentions" radius={[4, 4, 0, 0]}>
                  {data.map((c, i) => <Cell key={i} fill={THREAT_COLORS[c.threat]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Full list */}
          <div className="card">
            <div className="section-title">Full Ranking</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.map((c, i) => (
                <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-dim)', minWidth: 24 }}>#{i + 1}</div>
                  <span style={{ fontSize: 18 }}>{c.flag}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>{c.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 80 }} className="threat-bar">
                      <div className="threat-fill" style={{ width: `${(c.mentions / (data[0]?.mentions || 1)) * 100}%`, background: THREAT_COLORS[c.threat] }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: THREAT_COLORS[c.threat], minWidth: 24, textAlign: 'right' }}>{c.mentions}</span>
                  </div>
                </div>
              ))}
              {data.length === 0 && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', padding: 20 }}>No country mentions found in current articles.</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
