import { useState, useEffect, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

const FALLBACK_ARTICLES = [
  { source: { name: 'Reuters' }, title: 'Global leaders gather for emergency climate summit', description: 'World leaders convened in an emergency session to address escalating climate concerns amid record-breaking temperatures.', url: '#', publishedAt: new Date().toISOString(), category: 'Climate' },
  { source: { name: 'AP News' }, title: 'Tensions rise as diplomatic talks break down', description: 'Diplomatic negotiations between major powers collapsed today, raising fears of renewed conflict in the region.', url: '#', publishedAt: new Date().toISOString(), category: 'Politics' },
  { source: { name: 'BBC World' }, title: 'Cybersecurity breach exposes millions of government records', description: 'A sophisticated cyberattack has compromised sensitive government databases across multiple countries.', url: '#', publishedAt: new Date().toISOString(), category: 'Security' },
  { source: { name: 'Al Jazeera' }, title: 'Humanitarian crisis deepens in conflict zone', description: 'Aid agencies warn of catastrophic food shortages as access routes remain blocked by ongoing military operations.', url: '#', publishedAt: new Date().toISOString(), category: 'Conflict' },
  { source: { name: 'Bloomberg' }, title: 'Global markets tumble amid geopolitical uncertainty', description: 'Stock markets worldwide fell sharply as investors reacted to escalating geopolitical tensions and uncertain outlook.', url: '#', publishedAt: new Date().toISOString(), category: 'Economy' },
  { source: { name: 'The Guardian' }, title: 'AI arms race accelerates between superpowers', description: 'Nations are investing billions into artificial intelligence military applications, sparking concerns about autonomous weapons.', url: '#', publishedAt: new Date().toISOString(), category: 'Technology' },
  { source: { name: 'CNN' }, title: 'Sanctions imposed following border violations', description: 'The international community responded with sweeping economic sanctions after repeated territorial violations.', url: '#', publishedAt: new Date().toISOString(), category: 'Politics' },
  { source: { name: 'DW News' }, title: 'Refugee numbers reach unprecedented levels globally', description: 'UNHCR reports record displacement figures as conflicts and climate change drive mass migration across continents.', url: '#', publishedAt: new Date().toISOString(), category: 'Conflict' },
  { source: { name: 'Nikkei' }, title: 'Supply chain disruptions threaten global economy', description: 'Key shipping routes face unprecedented disruption due to regional conflicts and extreme weather events.', url: '#', publishedAt: new Date().toISOString(), category: 'Economy' },
  { source: { name: 'France 24' }, title: 'Nuclear nonproliferation treaty faces collapse', description: 'Analysts warn that decades of nuclear nonproliferation progress may unravel as rogue states accelerate weapons programs.', url: '#', publishedAt: new Date().toISOString(), category: 'Security' },
  { source: { name: 'Times of India' }, title: 'Water scarcity crisis threatens regional stability', description: 'Competing claims over dwindling water resources are driving diplomatic conflicts across drought-stricken regions.', url: '#', publishedAt: new Date().toISOString(), category: 'Climate' },
  { source: { name: 'Politico' }, title: 'Election interference allegations rock allied nations', description: 'Intelligence agencies have confirmed coordinated foreign interference operations targeting upcoming elections.', url: '#', publishedAt: new Date().toISOString(), category: 'Security' },
];

export function useNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async (query = 'geopolitics OR conflict OR security OR diplomacy', pageSize = 20) => {
    setLoading(true);
    setError(null);
    try {
      if (!API_KEY || API_KEY === 'your-newsapi-key-here') {
        await new Promise(r => setTimeout(r, 800));
        setArticles(FALLBACK_ARTICLES);
        setLoading(false);
        return;
      }
      const res = await fetch(
        `${BASE_URL}/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`
      );
      const data = await res.json();
      if (data.status === 'ok' && data.articles?.length) {
        setArticles(data.articles.filter(a => a.title && a.title !== '[Removed]'));
      } else {
        setArticles(FALLBACK_ARTICLES);
      }
    } catch {
      setArticles(FALLBACK_ARTICLES);
      setError('Using cached intelligence data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCategory = useCallback(async (category) => {
    const queries = {
      'All': 'world news conflict politics security',
      'Politics': 'politics government diplomacy elections',
      'Conflict': 'war conflict military combat troops',
      'Economy': 'economy markets trade sanctions financial',
      'Technology': 'technology cyber AI weapons space',
      'Climate': 'climate environment disaster floods drought',
      'Security': 'security terrorism intelligence surveillance',
    };
    await fetchNews(queries[category] || queries['All']);
  }, [fetchNews]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  return { articles, loading, error, refetch: fetchNews, fetchByCategory };
}

export function useTopHeadlines() {
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        if (!API_KEY || API_KEY === 'your-newsapi-key-here') {
          setHeadlines(FALLBACK_ARTICLES.slice(0, 6));
          return;
        }
        const res = await fetch(`${BASE_URL}/top-headlines?category=general&pageSize=10&apiKey=${API_KEY}`);
        const data = await res.json();
        if (data.status === 'ok') setHeadlines(data.articles.filter(a => a.title !== '[Removed]'));
        else setHeadlines(FALLBACK_ARTICLES.slice(0, 6));
      } catch {
        setHeadlines(FALLBACK_ARTICLES.slice(0, 6));
      }
    };
    fetch_();
  }, []);

  return { headlines };
}
