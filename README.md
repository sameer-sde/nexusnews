<div align="center">

```
███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗
████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝
██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗
██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║
██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
```

# NexusNews — AI War Room Intelligence Dashboard

> *A cinematic, real-time global intelligence platform powered by Claude AI and live news feeds.*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-nexusnews--six.vercel.app-00D4FF?style=for-the-badge)](https://nexusnews-six.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet_4-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://nexusnews-six.vercel.app)

**[🚀 Live Demo](https://nexusnews-six.vercel.app) · [💻 GitHub](https://github.com/sameer-sde/nexusnews) · [Features](#-features) · [Setup](#-setup)**

</div>

---

## 🧠 What is NexusNews?

NexusNews is a **production-grade AI intelligence dashboard** that transforms real-world breaking news into a cinematic war-room experience. It pulls live news from NewsAPI, processes it through **Anthropic Claude Sonnet**, and presents it across **35+ intelligence pages** — from geopolitical threat maps to psychological world leader profiles to AI-generated mission briefings.

Built as a portfolio project to demonstrate:
- Real AI integration with Claude Sonnet across 20+ distinct use cases
- Live data handling with NewsAPI and intelligent fallback strategies
- Production-level UI engineering with animations, themes, and transitions
- Clean React architecture with custom hooks and state management

---

## ✨ Features

### 🖥️ Operations Center
| Page | Description |
|------|-------------|
| **Command Center** | Live KPI dashboard — breaking alerts ticker, threat countries, real-time stats bar |
| **DEFCON Meter** | AI calculates a live DEFCON level 1–5 from current global threat conditions |
| **Global Tension Index** | Animated composite stress gauge (0–100) with simulated 12-month history chart |
| **Mission Briefing** | Cinematic spy-movie AI briefing with line-by-line reveal animation + fullscreen mode |
| **Crisis Alerts** | AI severity-scored breaking alerts with region tagging |
| **Browser Notifications** | Push alerts for critical events with custom toggle rules |
| **Crisis Feed** | Twitter-style live intel stream with crisis keyword filtering |
| **Ambient Sound** | Web Audio API — cinematic radar pings and drone tones, 4 presets, zero dependencies |

### 🌍 Intelligence & Mapping
| Page | Description |
|------|-------------|
| **Live World Map** | Clickable SVG world map — regions glow by threat level, click for instant country intel |
| **News Heatmap** | Heat intensity visualization of 28 countries by geopolitical risk score |
| **Threat Matrix** | 5-level risk classification system across all monitored regions |
| **Conflict Predictor** | AI forecasts top 5 regions most likely to escalate in the next 90 days |
| **Mentioned Nations** | Live bar chart of which countries appear most in today's news articles |

### 🤖 AI-Powered Analysis
| Page | Description |
|------|-------------|
| **AI Analyst** | Full Claude chat — ask anything about global conflicts, leaders, or events |
| **Leader Profiles** | Psychological dossiers for 16 world leaders — behavioral metrics, negotiation style, aggression index |
| **Country Deep Dive** | Select any country → AI generates a full classified intelligence report |
| **Scenario Simulator** | "What if China blockades Taiwan?" → AI simulates geopolitical consequences step by step |
| **Disinformation Detector** | Paste any headline → AI scores credibility and flags specific propaganda techniques |
| **Alliance Mapper** | Pick any 2 countries → AI rates their relationship score from -100 (hostile) to +100 (allied) |
| **Economic War Tracker** | Live sanctions tracker with intensity scoring and AI economic warfare analysis |
| **AI Image Analyzer** | Paste any image URL → Claude Vision analyzes geopolitical significance |

### 📋 Reports & Briefings
| Page | Description |
|------|-------------|
| **Daily Briefing** | AI-generated classified intel report from today's live news — one click |
| **Weekly Digest** | Full weekly summary — top events, emerging threats, winners, losers, 7-day outlook |
| **AI Newspaper** | Generates a cinematic classified newspaper front page from today's live articles |
| **Bias Detector** | AI scores each article for political bias (-100 left to +100 right), sentiment, and framing |
| **Topic Clusters** | AI reads all current articles and groups them into thematic intelligence clusters |
| **UN Resolution Tracker** | Real UN resolutions with vote breakdowns, veto tracking, and AI impact analysis |

### 🛠️ Tools & Extras
| Page | Description |
|------|-------------|
| **Intel Quiz** | AI generates 5 geopolitics questions from today's live news — scored with explanations |
| **Analytics** | Recharts visualizations — risk by region, threat distribution, country rankings |
| **Global Search** | Full-text search across all indexed articles with keyword highlighting |
| **Intel Dossier** | Bookmark articles and add personal analyst notes — saved to localStorage |
| **Voice Command** | Say "show leaders" or "analyze threats" — navigates the entire app by voice |
| **Theme Switcher** | 4 cinematic themes: War Room (blue), Red Alert, Matrix (green), Ghost |
| **Keyboard Shortcuts** | `g+c` Command Center, `g+a` AI Analyst, `g+l` Leaders, `?` for full help overlay |

---

## 🚀 Setup

### Prerequisites
- Node.js 18+
- Anthropic API key — [console.anthropic.com](https://console.anthropic.com) *(free credits on signup)*
- NewsAPI key — [newsapi.org/register](https://newsapi.org/register) *(100% free tier)*

### Installation

```bash
# Clone the repo
git clone https://github.com/sameer-sde/nexusnews.git
cd nexusnews

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
```

Edit `.env.local` and add your keys:
```env
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
VITE_NEWS_API_KEY=your-newsapi-key-here
```

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

### Demo Login Credentials

| Analyst ID | Password | Clearance Level |
|------------|----------|-----------------|
| `NXS-001` | `nexus` | TOP SECRET |
| `NXS-002` | `warroom` | SECRET |
| `NXS-003` | `admin` | TS/SCI |

---

## 🌐 Deploy to Vercel

```bash
npm run build
```

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard → Settings → Environment Variables:
   - `VITE_ANTHROPIC_API_KEY`
   - `VITE_NEWS_API_KEY`
4. Click Deploy — live in under 60 seconds ✅

**Live deployment:** [nexusnews-six.vercel.app](https://nexusnews-six.vercel.app)

---

## 🛠 Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend Framework** | React 18 + Vite 5 | UI and build tooling |
| **AI Engine** | Anthropic Claude Sonnet 4 | Analysis, generation, vision |
| **News Data** | NewsAPI.org | Live breaking news feed |
| **Charts** | Recharts | Data visualization |
| **Audio** | Web Audio API | Ambient sound (zero dependencies) |
| **Styling** | Pure CSS + CSS variables | Cinematic theming system |
| **Deployment** | Vercel | Hosting and CI/CD |

---

## 📁 Project Structure

```
nexusnews/
├── src/
│   ├── components/        # 41 page components
│   │   ├── CommandCenter.jsx      # Main dashboard
│   │   ├── LeaderProfiles.jsx     # World leader dossiers
│   │   ├── AIAnalyst.jsx          # Claude chat interface
│   │   ├── ScenarioSimulator.jsx  # What-if AI engine
│   │   ├── DefconMeter.jsx        # Defense readiness calculator
│   │   └── ...38 more components
│   ├── hooks/
│   │   ├── useNews.js     # NewsAPI integration + fallback
│   │   └── useAI.js       # Claude API calls + error handling
│   ├── data/
│   │   └── countries.js   # 28 countries with threat data
│   ├── App.jsx            # Routing + boot sequence
│   └── index.css          # War room design system
├── .env.local.example     # Environment variable template
└── package.json
```

---

## 💡 Why This Project Stands Out

Most portfolio projects are todo apps or weather widgets. NexusNews demonstrates:

- **Real AI depth** — Claude used across 20+ distinct tasks: chat, analysis, extraction, vision, JSON generation, classification, and summarization
- **Live data pipeline** — NewsAPI integration with graceful fallback for offline/rate-limited scenarios
- **Production UI quality** — boot animation, page transitions, 4 color themes, keyboard shortcuts, voice navigation, ambient audio
- **Systems thinking** — clean component architecture, custom React hooks, centralized state, error boundaries
- **Shipping velocity** — 35+ fully working pages, zero placeholder content

---

<div align="center">

**Built by [Sameer Ahmed](https://github.com/sameer-sde)**

Powered by [Anthropic Claude](https://anthropic.com) + [NewsAPI](https://newsapi.org) · Deployed on [Vercel](https://vercel.com)

⭐ **Star this repo if you found it useful!**

[![Live Demo](https://img.shields.io/badge/🌐_Try_it_Live-nexusnews--six.vercel.app-00D4FF?style=for-the-badge)](https://nexusnews-six.vercel.app)

</div>

