import { useState, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

async function callClaude(messages, system, maxTokens = 1024) {
  if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
    throw new Error('NO_KEY');
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
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`API ${res.status}: ${err?.error?.message || 'Unknown'}`);
  }
  const data = await res.json();
  return data.content[0].text;
}

export function useAIAnalyst() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (userMsg) => {
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    const system = `You are NEXUS, an elite AI intelligence analyst for a global news war room.
You analyze geopolitical events, conflicts, security threats, and world affairs with sharp, concise analysis.
Respond in a professional intelligence briefing style — factual, structured, insightful.
Use short paragraphs. Be direct. Highlight key risks and strategic implications.
Format key points clearly. Never use markdown headers, just clean prose with occasional [ALERT] or [KEY FINDING] tags.`;
    try {
      if (!API_KEY || API_KEY === 'your-anthropic-key-here') {
        await new Promise(r => setTimeout(r, 800));
        setMessages(prev => [...prev, { role: 'assistant', content: '[NEXUS] API key not configured.' }]);
        return;
      }
      const reply = await callClaude(newMessages, system);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      const msg = err.message?.includes('401')
        ? '[SYSTEM] Invalid API key — check VITE_ANTHROPIC_API_KEY in Vercel environment variables.'
        : err.message?.includes('403')
        ? '[SYSTEM] API key blocked — generate a new key at console.anthropic.com.'
        : `[SYSTEM] Error: ${err.message} — open Chrome DevTools console for details.`;
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const clearChat = () => setMessages([]);
  return { messages, loading, sendMessage, clearChat };
}

export async function generateDailyBriefing(articles) {
  const system = `You are the Chief Intelligence Officer generating a classified daily briefing. Write in formal intelligence report style.`;
  const headlines = articles.slice(0, 8).map(a => a.title).join('\n');
  const prompt = `Generate a CLASSIFIED DAILY INTELLIGENCE BRIEFING based on these headlines:\n${headlines}\n\nStructure: EXECUTIVE SUMMARY (2 sentences), TOP THREATS (3 bullet points), REGIONAL HOTSPOTS (3 regions with 1 line each), ANALYST ASSESSMENT (2 sentences). Keep it sharp and professional. No markdown formatting.`;
  try {
    return await callClaude([{ role: 'user', content: prompt }], system, 600);
  } catch {
    return `NEXUS INTELLIGENCE NETWORK — DAILY BRIEFING\n\nAPI key error. Check VITE_ANTHROPIC_API_KEY in Vercel environment variables.`;
  }
}

export async function analyzeBias(article) {
  const system = `You are a media bias analyst. Respond in JSON only.`;
  const prompt = `Analyze this article for bias and sentiment:\nTitle: ${article.title}\nDescription: ${article.description || 'N/A'}\nSource: ${article.source?.name || 'Unknown'}\n\nReturn ONLY this JSON:\n{"biasScore": <-100 to 100, negative=left, positive=right>, "sentiment": "positive|negative|neutral", "sentimentScore": <0-100>, "framing": "<one word>", "biasLabel": "<Far Left|Left|Center-Left|Center|Center-Right|Right|Far Right>", "keyInsight": "<one sentence>"}`;
  try {
    const text = await callClaude([{ role: 'user', content: prompt }], system, 200);
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return { biasScore: 0, sentiment: 'neutral', sentimentScore: 50, framing: 'neutral', biasLabel: 'Center', keyInsight: 'API error.' };
  }
}

export async function generateTopicClusters(articles) {
  const system = `You are a news analyst. Respond in JSON only, no markdown.`;
  const titles = articles.slice(0, 15).map((a, i) => `${i}: ${a.title}`).join('\n');
  const prompt = `Group these news articles into 5-6 topic clusters:\n${titles}\n\nReturn ONLY this JSON array:\n[{"cluster": "cluster name", "articles": [indices], "summary": "brief description", "urgency": "critical|high|medium|low"}]`;
  try {
    const text = await callClaude([{ role: 'user', content: prompt }], system, 500);
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return [
      { cluster: 'Geopolitical Conflicts', articles: [0,1,2], summary: 'Active conflicts and military tensions', urgency: 'critical' },
      { cluster: 'Economic Security', articles: [3,4], summary: 'Financial markets and trade disputes', urgency: 'high' },
      { cluster: 'Cyber & Technology', articles: [5,6], summary: 'Cyber threats and AI developments', urgency: 'high' },
      { cluster: 'Humanitarian Crisis', articles: [7,8], summary: 'Refugee flows and aid access', urgency: 'medium' },
      { cluster: 'Climate & Environment', articles: [9,10], summary: 'Climate impacts on stability', urgency: 'medium' },
    ];
  }
}

export async function generateThreatAnalysis(countryName, recentNews) {
  const system = `You are a geopolitical risk analyst. Generate a concise threat assessment in JSON format only. No markdown, just raw JSON.`;
  const prompt = `Analyze the geopolitical threat level for ${countryName}. Recent context: ${recentNews?.slice(0,2).map(a=>a.title).join('. ') || 'General regional tensions'}.\nReturn ONLY this JSON:\n{"threatLevel": <1-5>, "riskScore": <0-100>, "primaryRisks": ["risk1","risk2","risk3"], "summary": "<2 sentence assessment>", "trend": "rising|stable|declining"}`;
  try {
    const text = await callClaude([{ role: 'user', content: prompt }], system, 300);
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return { threatLevel: 3, riskScore: 50, primaryRisks: ['Political instability', 'Economic tensions', 'Regional conflict'], summary: 'AI analysis unavailable.', trend: 'stable' };
  }
}
