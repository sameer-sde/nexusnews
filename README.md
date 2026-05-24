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

**A cinematic, real-time global intelligence platform powered by Claude AI and live news feeds.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com/)
[![NewsAPI](https://img.shields.io/badge/NewsAPI-Live-00D4FF?style=for-the-badge)](https://newsapi.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[Live Demo](#) · [Features](#features) · [Setup](#setup) · [Tech Stack](#tech-stack)

</div>

---

## What is NexusNews?

NexusNews is a **full-stack AI intelligence dashboard** that transforms real-world news into a cinematic war-room experience. It pulls live breaking news from NewsAPI, processes it through Claude AI, and presents it across 35+ intelligence pages — from geopolitical threat maps to psychological leader profiles to AI-generated mission briefings.

Built to demonstrate production-grade AI integration, real-time data handling, and advanced UI engineering — the kind of project that gets you shortlisted at Amazon, Google, and Microsoft.

---

## Features

### 🖥️ Operations Center
| Page | Description |
|------|-------------|
| **Command Center** | Live KPI dashboard with breaking alerts ticker and top threat countries |
| **DEFCON Meter** | AI calculates live DEFCON level 1–5 from current global conditions |
| **Global Tension Index** | Animated composite stress gauge (0–100) with 12-month history chart |
| **Mission Briefing** | Cinematic spy-movie style AI briefing with fullscreen mode |
| **Crisis Alerts** | Severity-scored breaking alerts with AI urgency classification |
| **Browser Notifications** | Push alerts for critical events with custom toggle rules |

### 🌍 Intelligence Maps
| Page | Description |
|------|-------------|
| **Live World Map** | Clickable SVG map — regions glow by threat level, click for instant intel |
| **News Heatmap** | Heat intensity visualization of all 28 countries by risk score |
| **Threat Matrix** | 5-level geopolitical risk classification across regions |
| **Conflict Predictor** | AI predicts top 5 regions most likely to escalate in 90 days |

### 🤖 AI Analysis
| Page | Description |
|------|-------------|
| **AI Analyst** | Full Claude chat — ask anything about global events |
| **Leader Profiles** | Psychological dossiers for 16 world leaders with behavioral metrics |
| **Country Deep Dive** | Click any country → full AI classified intelligence report |
| **Scenario Simulator** | "What if Russia invades NATO?" → AI simulates consequences |
| **Disinformation Detector** | Paste any headline → AI scores credibility, flags propaganda techniques |
| **Alliance Mapper** | Pick any 2 countries → AI rates relationship score (-100 to +100) |
| **Economic War Tracker** | Sanctions tracker with intensity bars and AI warfare analysis |
| **AI Image Analyzer** | Paste any image URL → Claude Vision analyzes geopolitical significance |

### 📋 Reports & Briefings
| Page | Description |
|------|-------------|
| **Daily Briefing** | AI-generated classified intel report from today's live news |
| **Weekly Digest** | Full weekly summary — events, threats, winners, losers, outlook |
| **AI Newspaper** | One click generates a cinematic front-page newspaper from live news |
| **Bias Detector** | AI scores each article for political bias, sentiment, and framing |
| **Topic Clusters** | AI groups all current articles into thematic intelligence clusters |

### 🛠️ Tools & Extras
| Page | Description |
|------|-------------|
| **Crisis Feed** | Twitter-style live intel stream with crisis keyword filtering |
| **UN Resolution Tracker** | Real UN resolutions with vote breakdowns and AI impact analysis |
| **Intel Quiz** | AI-generated daily geopolitics quiz from live news |
| **Analytics** | Charts — risk by region, threat distribution, country rankings |
| **Global Search** | Search across all indexed articles with keyword highlighting |
| **Intel Dossier** | Bookmark articles and add personal analyst notes |
| **Voice Command** | Say "show leaders" or "analyze threats" — navigates the app |
| **Ambient Sound** | Web Audio API — cinematic radar pings, drone tones, 4 presets |
| **Theme Switcher** | 4 themes: War Room, Red Alert, Matrix, Ghost |

---

## Setup

### Prerequisites
- Node.js 18+
- Anthropic API key — [console.anthropic.com](https://console.anthropic.com)
- NewsAPI key — [newsapi.org/register](https://newsapi.org/register) (free)

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

Edit `.env.local`:
```env
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
VITE_NEWS_API_KEY=your-newsapi-key-here
```

```bash
# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Login Credentials

| Analyst ID | Password | Clearance |
|------------|----------|-----------|
| `NXS-001` | `nexus` | TOP SECRET |
| `NXS-002` | `warroom` | SECRET |
| `NXS-003` | `admin` | TS/SCI |

---

## Deploy to Vercel

```bash
npm run build
```

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard:
   - `VITE_ANTHROPIC_API_KEY`
   - `VITE_NEWS_API_KEY`
4. Deploy — live in 60 seconds

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, Vite 5 |
| **AI** | Anthropic Claude Sonnet (claude-sonnet-4) |
| **News Data** | NewsAPI.org |
| **Charts** | Recharts |
| **Audio** | Web Audio API (zero dependencies) |
| **Styling** | Pure CSS with CSS variables |
| **Deployment** | Vercel |

---

## Project Structure

```
nexusnews/
├── src/
│   ├── components/        # 41 page components
│   │   ├── CommandCenter.jsx
│   │   ├── LeaderProfiles.jsx
│   │   ├── AIAnalyst.jsx
│   │   └── ...
│   ├── hooks/
│   │   ├── useNews.js     # NewsAPI integration
│   │   └── useAI.js       # Claude API calls
│   ├── data/
│   │   └── countries.js   # 28 countries with threat data
│   ├── App.jsx            # Main routing
│   └── index.css          # Global war room theme
├── .env.local.example
└── package.json
```

---

## Why This Project

NexusNews was built to demonstrate:

- **Real AI integration** — not just a wrapper, but multi-feature Claude usage across analysis, extraction, generation, and vision
- **Live data handling** — real NewsAPI feeds with fallback strategies
- **Production UI quality** — cinematic design system with animations, transitions, and themes
- **System design thinking** — clean component architecture, custom hooks, state management
- **Breadth of features** — 35+ pages showing ability to ship at scale

---

## Screenshots

> *War Room dark theme with live intelligence feed, threat matrix, and AI analyst chat*

---

<div align="center">

Built by [Sameer Ahmed](https://github.com/sameer-sde) · Powered by [Anthropic Claude](https://anthropic.com) · [NewsAPI](https://newsapi.org)

⭐ Star this repo if you found it useful!

</div>

