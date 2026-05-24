import { useState, useRef, useEffect } from 'react';
import { useAIAnalyst } from '../hooks/useAI';

const QUICK_PROMPTS = [
  'What are the top 3 global threats right now?',
  'Analyze the Russia-Ukraine conflict situation',
  'What is driving tensions in the Middle East?',
  'How might the current geopolitical climate affect global markets?',
  'Which regions are most at risk of new conflicts?',
];

export default function AIAnalyst() {
  const { messages, loading, sendMessage, clearChat } = useAIAnalyst();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">AI Analyst — NEXUS</div>
            <div className="page-subtitle">POWERED BY CLAUDE · CLASSIFIED INTELLIGENCE INTERFACE</div>
          </div>
          <button className="btn-danger" onClick={clearChat} style={{ fontSize: 11 }}>CLEAR SESSION</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, minHeight: 0 }}>
        {messages.length === 0 ? (
          <div style={{ padding: '24px 0' }}>
            <div className="card" style={{ textAlign: 'center', padding: 32, marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--accent)', marginBottom: 8 }}>◎</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--accent)', letterSpacing: 2, marginBottom: 8 }}>NEXUS AI ANALYST</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                I provide real-time geopolitical analysis, threat assessments, and intelligence briefings.<br />
                Ask me anything about global events, conflicts, or security situations.
              </div>
            </div>
            <div className="section-title">Quick Intel Requests</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {QUICK_PROMPTS.map((p, i) => (
                <button key={i} className="card" style={{ textAlign: 'left', cursor: 'pointer', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'var(--font-body)', transition: 'all 0.15s', width: '100%' }}
                  onClick={() => sendMessage(p)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  ▶ {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ paddingBottom: 8 }}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role === 'user' ? 'user' : 'ai'}`}>
                {m.role === 'assistant' && <div className="ai-label">◎ NEXUS ANALYST</div>}
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble ai">
                <div className="ai-label">◎ NEXUS ANALYST</div>
                <span className="ai-typing">Analyzing intelligence</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '12px 0', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <input
          className="input-field"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Request intelligence analysis..."
          style={{ flex: 1 }}
          disabled={loading}
        />
        <button className="btn-primary" onClick={handleSend} disabled={loading || !input.trim()} style={{ whiteSpace: 'nowrap' }}>
          {loading ? '...' : 'SEND ▶'}
        </button>
      </div>
    </div>
  );
}
