import { useState } from 'react';
import { useNews } from '../hooks/useNews';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

async function generateQuiz(articles) {
  const headlines = articles.slice(0, 10).map(a => a.title).join('\n');
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    return [
      { question: 'Which country has the highest geopolitical risk score in the NEXUS threat matrix?', options: ['Russia', 'Afghanistan', 'Syria', 'North Korea'], answer: 2, explanation: 'Syria holds a risk score of 93/100 due to ongoing civil conflict, humanitarian crisis, and proxy warfare.' },
      { question: 'What does the NEXUS threat level "Critical" (Level 5) indicate?', options: ['Minor civil unrest', 'Active armed conflict or imminent escalation risk', 'Economic instability', 'Political transition'], answer: 1, explanation: 'Level 5 Critical indicates active armed conflict or a situation with imminent risk of major escalation.' },
      { question: 'Which intelligence discipline focuses on open-source information like news?', options: ['HUMINT', 'SIGINT', 'OSINT', 'GEOINT'], answer: 2, explanation: 'OSINT (Open Source Intelligence) involves gathering intelligence from publicly available sources including news media.' },
      { question: 'Add your Anthropic API key to generate live quiz questions from today\'s real news!', options: ['Configure API key', 'Use demo mode', 'Skip question', 'Learn more'], answer: 0, explanation: 'With an API key, NEXUS AI generates 5 fresh quiz questions from today\'s actual breaking news stories.' },
    ];
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: 'Generate geopolitics quiz questions from news headlines. Respond in JSON only.',
      messages: [{
        role: 'user',
        content: `Generate 5 multiple choice quiz questions from these news headlines:\n${headlines}\n\nReturn ONLY a JSON array:\n[{\n  "question": "<question text>",\n  "options": ["<a>", "<b>", "<c>", "<d>"],\n  "answer": <0-3 index of correct answer>,\n  "explanation": "<one sentence explanation>"\n}]`,
      }],
    }),
  });
  const data = await res.json();
  return JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
}

export default function IntelQuiz() {
  const { articles } = useNews();
  const [questions, setQuestions] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const start = async () => {
    setLoading(true);
    const qs = await generateQuiz(articles);
    setQuestions(qs);
    setCurrent(0); setSelected(null); setScore(0); setAnswered([]); setDone(false);
    setLoading(false);
  };

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === questions[current].answer;
    if (correct) setScore(s => s + 1);
    setAnswered(prev => [...prev, { selected: idx, correct }]);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setDone(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
  };

  const scoreColor = (s, t) => s / t >= 0.8 ? 'var(--green)' : s / t >= 0.5 ? 'var(--accent3)' : 'var(--accent2)';

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Intelligence Quiz</div>
        <div className="page-subtitle">AI-GENERATED DAILY GEOPOLITICS CHALLENGE</div>
      </div>

      {!questions && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🧠</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--accent)', letterSpacing: 2, marginBottom: 8 }}>DAILY INTEL BRIEFING QUIZ</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
            Test your geopolitical knowledge with AI-generated questions<br />based on today's live news stories.
          </div>
          <button className="btn-primary" onClick={start} style={{ padding: '12px 32px', fontSize: 13 }}>▶ START QUIZ</button>
        </div>
      )}

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', marginBottom: 16 }}>▌ AI GENERATING QUIZ FROM LIVE NEWS...</div>
          <div className="loading-bar" style={{ maxWidth: 400, margin: '0 auto' }}><div className="loading-bar-fill" /></div>
        </div>
      )}

      {done && questions && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-dim)', letterSpacing: 3, marginBottom: 16 }}>QUIZ COMPLETE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, color: scoreColor(score, questions.length), marginBottom: 8 }}>{score}/{questions.length}</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {score === questions.length ? '🏆 Perfect score — Elite Analyst!' : score >= questions.length * 0.7 ? '⭐ Strong performance — Senior Analyst' : '📚 Keep studying — Junior Analyst'}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
            {answered.map((a, i) => (
              <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: a.correct ? 'var(--green-dim)' : 'var(--accent2-dim)', border: `1px solid ${a.correct ? 'var(--green)' : 'var(--accent2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: a.correct ? 'var(--green)' : 'var(--accent2)' }}>
                {a.correct ? '✓' : '✗'}
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={start} style={{ padding: '12px 32px' }}>↻ NEW QUIZ</button>
        </div>
      )}

      {questions && !done && !loading && (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>QUESTION {current + 1} OF {questions.length}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--green)' }}>SCORE: {score}</div>
          </div>
          <div className="threat-bar" style={{ marginBottom: 24, height: 3 }}>
            <div className="threat-fill" style={{ width: `${((current) / questions.length) * 100}%`, background: 'var(--accent)' }} />
          </div>

          {/* Question */}
          <div className="card" style={{ marginBottom: 16, padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: 2, marginBottom: 12 }}>INTELLIGENCE ASSESSMENT Q{current + 1}</div>
            <div style={{ fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 500 }}>{questions[current].question}</div>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {questions[current].options.map((opt, i) => {
              const isCorrect = i === questions[current].answer;
              const isSelected = i === selected;
              let bg = 'var(--bg-card)', border = 'var(--border)', color = 'var(--text-primary)';
              if (selected !== null) {
                if (isCorrect) { bg = 'var(--green-dim)'; border = 'var(--green)'; color = 'var(--green)'; }
                else if (isSelected) { bg = 'var(--accent2-dim)'; border = 'var(--accent2)'; color = 'var(--accent2)'; }
              }
              return (
                <button key={i} onClick={() => handleAnswer(i)} style={{
                  background: bg, border: `1px solid ${border}`, borderRadius: 8,
                  padding: '14px 18px', cursor: selected !== null ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s', textAlign: 'left',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color, minWidth: 20 }}>{String.fromCharCode(65 + i)}</span>
                  <span style={{ fontSize: 14, color, flex: 1 }}>{opt}</span>
                  {selected !== null && isCorrect && <span style={{ color: 'var(--green)' }}>✓</span>}
                  {selected !== null && isSelected && !isCorrect && <span style={{ color: 'var(--accent2)' }}>✗</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {selected !== null && (
            <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, padding: '14px 18px', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', marginBottom: 6 }}>◎ INTELLIGENCE BRIEF</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{questions[current].explanation}</div>
            </div>
          )}

          {selected !== null && (
            <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={next}>
              {current + 1 >= questions.length ? '▶ VIEW RESULTS' : '▶ NEXT QUESTION'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
