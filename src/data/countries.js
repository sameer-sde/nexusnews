export const COUNTRIES = [
  { code: 'US', name: 'United States', region: 'Americas', threat: 2, riskScore: 28, flag: '🇺🇸', lat: 38, lng: -97 },
  { code: 'RU', name: 'Russia', region: 'Europe', threat: 5, riskScore: 91, flag: '🇷🇺', lat: 61, lng: 105 },
  { code: 'CN', name: 'China', region: 'Asia', threat: 4, riskScore: 74, flag: '🇨🇳', lat: 35, lng: 105 },
  { code: 'UA', name: 'Ukraine', region: 'Europe', threat: 5, riskScore: 95, flag: '🇺🇦', lat: 49, lng: 32 },
  { code: 'IR', name: 'Iran', region: 'Middle East', threat: 4, riskScore: 82, flag: '🇮🇷', lat: 32, lng: 53 },
  { code: 'KP', name: 'North Korea', region: 'Asia', threat: 5, riskScore: 88, flag: '🇰🇵', lat: 40, lng: 127 },
  { code: 'SY', name: 'Syria', region: 'Middle East', threat: 5, riskScore: 93, flag: '🇸🇾', lat: 35, lng: 38 },
  { code: 'IN', name: 'India', region: 'Asia', threat: 2, riskScore: 35, flag: '🇮🇳', lat: 20, lng: 77 },
  { code: 'PK', name: 'Pakistan', region: 'Asia', threat: 3, riskScore: 61, flag: '🇵🇰', lat: 30, lng: 70 },
  { code: 'IQ', name: 'Iraq', region: 'Middle East', threat: 4, riskScore: 78, flag: '🇮🇶', lat: 33, lng: 44 },
  { code: 'AF', name: 'Afghanistan', region: 'Asia', threat: 5, riskScore: 96, flag: '🇦🇫', lat: 33, lng: 65 },
  { code: 'SD', name: 'Sudan', region: 'Africa', threat: 4, riskScore: 79, flag: '🇸🇩', lat: 15, lng: 30 },
  { code: 'SO', name: 'Somalia', region: 'Africa', threat: 5, riskScore: 90, flag: '🇸🇴', lat: 6, lng: 46 },
  { code: 'YE', name: 'Yemen', region: 'Middle East', threat: 5, riskScore: 92, flag: '🇾🇪', lat: 15, lng: 48 },
  { code: 'DE', name: 'Germany', region: 'Europe', threat: 1, riskScore: 12, flag: '🇩🇪', lat: 51, lng: 10 },
  { code: 'FR', name: 'France', region: 'Europe', threat: 2, riskScore: 22, flag: '🇫🇷', lat: 46, lng: 2 },
  { code: 'GB', name: 'UK', region: 'Europe', threat: 2, riskScore: 20, flag: '🇬🇧', lat: 54, lng: -2 },
  { code: 'BR', name: 'Brazil', region: 'Americas', threat: 2, riskScore: 38, flag: '🇧🇷', lat: -14, lng: -51 },
  { code: 'MX', name: 'Mexico', region: 'Americas', threat: 3, riskScore: 55, flag: '🇲🇽', lat: 23, lng: -102 },
  { code: 'IL', name: 'Israel', region: 'Middle East', threat: 4, riskScore: 76, flag: '🇮🇱', lat: 31, lng: 35 },
  { code: 'SA', name: 'Saudi Arabia', region: 'Middle East', threat: 3, riskScore: 52, flag: '🇸🇦', lat: 24, lng: 45 },
  { code: 'JP', name: 'Japan', region: 'Asia', threat: 1, riskScore: 15, flag: '🇯🇵', lat: 36, lng: 138 },
  { code: 'AU', name: 'Australia', region: 'Oceania', threat: 1, riskScore: 10, flag: '🇦🇺', lat: -25, lng: 133 },
  { code: 'CA', name: 'Canada', region: 'Americas', threat: 1, riskScore: 11, flag: '🇨🇦', lat: 60, lng: -96 },
  { code: 'NG', name: 'Nigeria', region: 'Africa', threat: 3, riskScore: 60, flag: '🇳🇬', lat: 10, lng: 8 },
  { code: 'ET', name: 'Ethiopia', region: 'Africa', threat: 4, riskScore: 72, flag: '🇪🇹', lat: 9, lng: 40 },
  { code: 'VE', name: 'Venezuela', region: 'Americas', threat: 3, riskScore: 58, flag: '🇻🇪', lat: 8, lng: -66 },
  { code: 'MM', name: 'Myanmar', region: 'Asia', threat: 4, riskScore: 80, flag: '🇲🇲', lat: 17, lng: 96 },
];

export const THREAT_LEVELS = {
  1: { label: 'Minimal', color: 'var(--threat-minimal)', bg: 'rgba(0,212,255,0.1)' },
  2: { label: 'Low', color: 'var(--threat-low)', bg: 'rgba(46,213,115,0.1)' },
  3: { label: 'Medium', color: 'var(--threat-medium)', bg: 'rgba(255,165,2,0.1)' },
  4: { label: 'High', color: 'var(--threat-high)', bg: 'rgba(255,107,53,0.1)' },
  5: { label: 'Critical', color: 'var(--threat-critical)', bg: 'rgba(255,71,87,0.1)' },
};

export const REGIONS = ['All', 'Americas', 'Europe', 'Middle East', 'Asia', 'Africa', 'Oceania'];

export const ANALYSTS = [
  { id: 'NXS-001', password: 'nexus', name: 'Analyst Sharma', rank: 'Senior Intelligence Analyst', clearance: 'TOP SECRET' },
  { id: 'NXS-002', password: 'warroom', name: 'Analyst Patel', rank: 'Field Intelligence Officer', clearance: 'SECRET' },
  { id: 'NXS-003', password: 'admin', name: 'Director Chen', rank: 'Chief Intelligence Director', clearance: 'TS/SCI' },
];

export const NEWS_CATEGORIES = ['All', 'Politics', 'Conflict', 'Economy', 'Technology', 'Climate', 'Security'];

export const MOCK_ALERTS = [
  { id: 1, severity: 'critical', title: 'Military mobilization detected near disputed border', region: 'Eastern Europe', time: '2 min ago' },
  { id: 2, severity: 'high', title: 'Cyber intrusion attempt on critical infrastructure', region: 'North America', time: '14 min ago' },
  { id: 3, severity: 'high', title: 'Humanitarian crisis escalating — aid access blocked', region: 'East Africa', time: '31 min ago' },
  { id: 4, severity: 'medium', title: 'Diplomatic talks collapse — trade sanctions imminent', region: 'Asia-Pacific', time: '1 hr ago' },
  { id: 5, severity: 'medium', title: 'Protest movement growing — government response unclear', region: 'South America', time: '2 hr ago' },
  { id: 6, severity: 'low', title: 'Parliamentary elections scheduled amid rising tensions', region: 'Western Europe', time: '3 hr ago' },
];
