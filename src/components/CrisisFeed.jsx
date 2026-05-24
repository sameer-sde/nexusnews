import { useState, useEffect } from 'react';
import { useNews } from '../hooks/useNews';

// Since X/Twitter API requires paid access, we simulate a tweet-style feed
// using real NewsAPI headlines formatted as tweets from fictional intelligence accounts

const INTEL_ACCOUNTS = [
  { handle: '@NexusIntel', name: 'NEXUS Intelligence', verified: true, avatar: '🔵', followers: '284K' },
  { handle: '@CrisisWatch', name: 'Crisis Watch Network', verified: true, avatar: '🔴', followers: '156K' },
  { handle: '@GeoAnalyst', name: 'Geopolitical Analyst', verified: false, avatar: '🟡', followers: '89K' },
  { handle: '@DefenseDesk', name: 'Defense Intelligence Desk', verified: true, avatar: '⚫', followers: '412K' },
  { handle: '@FieldReport', name: 'Field Intelligence Report', verified: false, avatar: '🟢', followers: '67K' },
  { handle: '@SecCouncil', name: 'Security Council Watch', verified: true, avatar: '🔷', followers: '203K' },
];

const CRISIS_KEYWORDS = ['war', 'conflict', 'attack', 'military', 'crisis', 'sanctions', 'nuclear', 'missile', 'troops', 'invasion', 'ceasefire', 'diplomatic', 'threat', 'security'];

const HASHTAGS = [
  ['#BreakingNews', '#Geopolitics'],
  ['#Crisis', '#Intelligence'],
  ['#WorldNews', '#Security'],
  ['#ConflictAlert', '#OSINT'],
  ['#Geopolitics', '#Analysis'],
  ['#MilitaryAlert', '#Defense'],
];

function timeAgo(date) {
  const mins = Math.floor((Date.now() - date) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h`;
}

function formatAsTweet(article, index) {
  const account = INTEL_ACCOUNTS[index % INTEL_ACCOUNTS.length];
  const tags = HASHTAGS[index % HASHTAGS.length];
  const isCrisis = CRISIS_KEYWORDS.some(k => article.title?.toLowerCase().includes(k));
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date(Date.now() - Math.random() * 3600000);
  const likes = Math.floor(Math.random() * 5000) + 100;
  const retweets = Math.floor(Math.random() * 2000) + 50;
  const replies = Math.floor(Math.random() * 500) + 10;

  return {
    id: index,
    account,
    text: article.title,
    source: article.source?.name,
    tags,
    isCrisis,
    time: publishedDate,
    likes, retweets, replies,
    url: article.url,
  };
}

export default function CrisisFeed() {
  const { articles, loading } = useNews();
  const [filter, setFilter] = useState('All');
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    if (articles.length) {
      setTweets(articles.slice(0, 20).map((a, i) => formatAsTweet(a, i)));
    }
  }, [articles]);

  const filtered = filter === 'Crisis' ? tweets.filter(t => t.isCrisis) : tweets;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Crisis Intelligence Feed</div>
        <div className="page-subtitle">REAL-TIME INTEL STREAM · CRISIS KEYWORD FILTERED</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <button className={`tag ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All Intel</button>
        <button className={`tag ${filter === 'Crisis' ? 'active' : ''}`} onClick={() => setFilter('Crisis')}>🔴 Crisis Only</button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} className="pulse" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>LIVE · {filtered.length} POSTS</span>
        </div>
      </div>

      {loading ? (
        <div className="card"><div className="loading-bar"><div className="loading-bar-fill" /></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filtered.map(tweet => (
            <div key={tweet.id} style={{
              background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
              padding: '16px', transition: 'background 0.15s', cursor: 'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
              onClick={() => window.open(tweet.url, '_blank')}>
              <div style={{ display: 'flex', gap: 12 }}>
                {/* Avatar */}
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {tweet.account.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{tweet.account.name}</span>
                    {tweet.account.verified && <span style={{ fontSize: 12, color: 'var(--accent)' }}>✓</span>}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>{tweet.account.handle}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginLeft: 'auto' }}>{timeAgo(tweet.time)}</span>
                    {tweet.isCrisis && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 6px', background: 'var(--accent2-dim)', color: 'var(--accent2)', borderRadius: 3, border: '1px solid rgba(255,71,87,0.3)' }}>CRISIS</span>}
                  </div>

                  {/* Tweet text */}
                  <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 8 }}>{tweet.text}</div>

                  {/* Tags and source */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    {tweet.tags.map((tag, i) => <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>{tag}</span>)}
                    {tweet.source && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>via {tweet.source}</span>}
                  </div>

                  {/* Engagement */}
                  <div style={{ display: 'flex', gap: 20 }}>
                    {[
                      { icon: '💬', val: tweet.replies },
                      { icon: '🔁', val: tweet.retweets },
                      { icon: '❤️', val: tweet.likes },
                    ].map(({ icon, val }) => (
                      <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
                        <span>{icon}</span>
                        <span>{val.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
