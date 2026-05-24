import { useState } from 'react';
import { ThemeProvider } from './components/ThemeSwitcher';
import { useKeyboardShortcuts, KeyboardShortcutsOverlay } from './components/KeyboardShortcuts';
import BootScreen from './components/BootScreen';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import StatsBar from './components/StatsBar';
import PageTransition from './components/PageTransition';
import CommandCenter from './components/CommandCenter';
import LiveFeed from './components/LiveFeed';
import WorldMap from './components/WorldMap';
import LiveWorldMap from './components/LiveWorldMap';
import AIAnalyst from './components/AIAnalyst';
import ThreatMatrix from './components/ThreatMatrix';
import TopicClusters from './components/TopicClusters';
import DailyBriefing from './components/DailyBriefing';
import BiasDetector from './components/BiasDetector';
import CrisisAlerts from './components/CrisisAlerts';
import Analytics from './components/Analytics';
import GlobalSearch from './components/GlobalSearch';
import CountryDeepDive from './components/CountryDeepDive';
import ScenarioSimulator from './components/ScenarioSimulator';
import DisinfoDetector from './components/DisinfoDetector';
import ConflictPredictor from './components/ConflictPredictor';
import NewsHeatmap from './components/NewsHeatmap';
import LeaderProfiles from './components/LeaderProfiles';
import AINewspaper from './components/AINewspaper';
import IntelQuiz from './components/IntelQuiz';
import AllianceMapper from './components/AllianceMapper';
import EconomicWarTracker from './components/EconomicWarTracker';
import Bookmarks from './components/Bookmarks';
import ThemeSwitcher from './components/ThemeSwitcher';
import VoiceCommand from './components/VoiceCommand';
import DefconMeter from './components/DefconMeter';
import MissionBriefing from './components/MissionBriefing';
import TensionIndex from './components/TensionIndex';
import MentionedNations from './components/MentionedNations';
import WeeklyDigest from './components/WeeklyDigest';
import BrowserNotifications from './components/BrowserNotifications';
import UNTracker from './components/UNTracker';
import ImageAnalyzer from './components/ImageAnalyzer';
import AmbientSound from './components/AmbientSound';
import CrisisFeed from './components/CrisisFeed';
import { useNews } from './hooks/useNews';

function AppShell() {
  const [analyst, setAnalyst] = useState(null);
  const [page, setPage] = useState('command');
  const { articles } = useNews();
  const { showHelp, setShowHelp } = useKeyboardShortcuts(setPage);

  if (!analyst) return <LoginScreen onLogin={setAnalyst} />;

  const renderPage = () => {
    switch (page) {
      case 'command':    return <CommandCenter analyst={analyst} />;
      case 'feed':       return <LiveFeed />;
      case 'map':        return <WorldMap onNavigate={setPage} />;
      case 'livemap':    return <LiveWorldMap onNavigate={setPage} />;
      case 'analyst':    return <AIAnalyst />;
      case 'threats':    return <ThreatMatrix />;
      case 'clusters':   return <TopicClusters />;
      case 'briefing':   return <DailyBriefing />;
      case 'bias':       return <BiasDetector />;
      case 'alerts':     return <CrisisAlerts />;
      case 'analytics':  return <Analytics />;
      case 'search':     return <GlobalSearch />;
      case 'country':    return <CountryDeepDive />;
      case 'scenario':   return <ScenarioSimulator />;
      case 'disinfo':    return <DisinfoDetector />;
      case 'predict':    return <ConflictPredictor />;
      case 'heatmap':    return <NewsHeatmap />;
      case 'leaders':    return <LeaderProfiles />;
      case 'newspaper':  return <AINewspaper />;
      case 'quiz':       return <IntelQuiz />;
      case 'alliance':   return <AllianceMapper />;
      case 'economic':   return <EconomicWarTracker />;
      case 'bookmarks':  return <Bookmarks />;
      case 'theme':      return <ThemeSwitcher />;
      case 'voice':      return <VoiceCommand onNavigate={setPage} />;
      case 'defcon':     return <DefconMeter />;
      case 'mission':    return <MissionBriefing />;
      case 'tension':    return <TensionIndex />;
      case 'mentions':   return <MentionedNations />;
      case 'weekly':     return <WeeklyDigest />;
      case 'notify':     return <BrowserNotifications />;
      case 'un':        return <UNTracker />;
      case 'image':     return <ImageAnalyzer />;
      case 'sound':     return <AmbientSound />;
      case 'xfeed':     return <CrisisFeed />;
      default:           return <CommandCenter analyst={analyst} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar active={page} onNav={setPage} analyst={analyst} onLogout={() => { setAnalyst(null); setPage('command'); }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <StatsBar articleCount={articles.length} />
        <div className="main-content" style={{ flex: 1 }}>
          <PageTransition pageKey={page}>{renderPage()}</PageTransition>
        </div>
      </div>
      <KeyboardShortcutsOverlay showHelp={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

export default function App() {
  const [booted, setBooted] = useState(false);
  return (
    <ThemeProvider>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}
      {booted && <AppShell />}
    </ThemeProvider>
  );
}
