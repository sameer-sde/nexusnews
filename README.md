# NexusNews — AI War Room Dashboard

A cinematic global intelligence dashboard with real-time news, AI-powered threat analysis, and geopolitical risk scoring.

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add API Keys
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste your keys:
```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
VITE_NEWS_API_KEY=your-newsapi-key-here
```

**Get your keys:**
- Anthropic: https://console.anthropic.com → API Keys
- NewsAPI: https://newsapi.org/register (free)

### 3. Run
```bash
npm run dev
```

Open http://localhost:5173

### 4. Login
Use any demo credential from the login screen:
- `NXS-001` / `nexus`
- `NXS-002` / `warroom`
- `NXS-003` / `admin`

## 🌍 Features
- **Command Center** — Live KPI dashboard, breaking alerts ticker
- **Live Feed** — Real news from NewsAPI with category filters
- **World Map** — Country threat visualization with risk scores
- **AI Analyst** — Chat with Claude about any geopolitical topic
- **Threat Matrix** — 5-level risk classification for 28 countries
- **Crisis Alerts** — AI-severity-scored breaking alerts
- **Daily Briefing** — AI-generated classified intelligence report
- **Bias Detector** — AI media bias and sentiment analysis per article
- **Topic Clusters** — AI groups news into thematic clusters
- **Analytics** — Charts and data visualizations
- **Global Search** — Search across all indexed articles

## 🛠 Tech Stack
- React 18 + Vite
- Claude Sonnet (Anthropic API)
- NewsAPI.org
- Recharts
- Deployed on Vercel

## 🚢 Deploy to Vercel
```bash
npm run build
```
Then push to GitHub and import in Vercel. Add your env vars in Vercel dashboard under Settings → Environment Variables.
