// Mock API functions for GA4, GSC, and Google Ads

export const getGA4Data = () => {
  const totalSessions = 789;
  const keyEvents = 2;
  const previousYearKeyEvents = 6;
  const keyEventRate = (keyEvents / totalSessions) * 100;
  const previousYearKeyEventRate = 1.52;
  
  return {
    realtime: {
      activeUsers: 1247,
      pageViews: 3892,
      eventsPerMinute: 156,
    },
    acquisition: {
      organic: 45,
      direct: 28,
      referral: 15,
      social: 8,
      paid: 4,
    },
    sessions: {
      total: totalSessions,
      organic: 77,
      sessionsTrend: 100.8,
      organicSessionsTrend: 2.7,
    },
    trafficSource: [
      { source: "Direct", sessions: 673, percentage: 85.3 },
      { source: "Organic Search", sessions: 77, percentage: 9.76 },
      { source: "Referral", sessions: 32, percentage: 4.06 },
      { source: "Unassigned", sessions: 6, percentage: 0.76 },
      { source: "Paid Search", sessions: 2, percentage: 0.25 },
    ],
    topPages: [
      { path: "/", views: 12450, avgTime: "2:34", keyEvents: 2 },
      { path: "/products", views: 8920, avgTime: "3:12", keyEvents: 0 },
      { path: "/pricing", views: 6780, avgTime: "1:45", keyEvents: 0 },
      { path: "/blog", views: 5430, avgTime: "4:20", keyEvents: 0 },
      { path: "/contact", views: 3210, avgTime: "1:10", keyEvents: 0 },
    ],
    landingPages: {
      servicePages: {
        sessions: 670,
        sessionsTrend: 80.6,
        keyEvents: 2,
        keyEventsTrend: -66.7,
        keyEventRate: 0.30,
        keyEventRateTrend: -1.32,
        pages: [
          { path: "/", sessions: 432, keyEvents: 2 },
          { path: "/industries/web-design-law-firm", sessions: 22, keyEvents: 0 },
          { path: "/industries/web-design-cafes", sessions: 21, keyEvents: 0 },
          { path: "/industries/real-estate-web-design", sessions: 17, keyEvents: 0 },
          { path: "/projects/type/website/page/2", sessions: 17, keyEvents: 0 },
          { path: "/industries/medical-website-design", sessions: 15, keyEvents: 0 },
          { path: "/team/matt-coupar", sessions: 15, keyEvents: 0 },
          { path: "/site.webmanifest", sessions: 10, keyEvents: 0 },
          { path: "/contact", sessions: 8, keyEvents: 0 },
          { path: "/develop/ecommerce", sessions: 8, keyEvents: 0 },
          { path: "/industries/web-design-tradies", sessions: 6, keyEvents: 0 },
        ],
      },
      blogContent: {
        sessions: 121,
        sessionsTrend: 476.2,
        keyEvents: 0,
        keyEventsTrend: 0,
        pagesPerSession: 1.11,
        pagesPerSessionTrend: -19.8,
        pages: [
          { path: "/blog/website-navigation-tips", sessions: 22, keyEvents: 0 },
          { path: "/blog/page/3", sessions: 20, keyEvents: 0 },
          { path: "/blog/what-is-a-web-browser", sessions: 19, keyEvents: 0 },
          { path: "/blog/understanding-website-speed", sessions: 7, keyEvents: 0 },
          { path: "/blog/types-of-websites", sessions: 6, keyEvents: 0 },
          { path: "/blog/user-experience-guide", sessions: 5, keyEvents: 0 },
          { path: "/blog/website-development-costs", sessions: 5, keyEvents: 0 },
          { path: "/blog/how-to-change-hosting-provider", sessions: 4, keyEvents: 0 },
          { path: "/blog/ultimate-domain-name-guide", sessions: 4, keyEvents: 0 },
          { path: "/blog/website-migration-checklist", sessions: 4, keyEvents: 0 },
          { path: "/blog/content-management-system", sessions: 3, keyEvents: 0 },
        ],
      },
    },
    keyEvents: {
      total: keyEvents,
      totalTrend: -66.7,
      sessionKeyEventRate: keyEventRate,
      sessionKeyEventRateTrend: -1.27,
      bySource: [
        { source: "Organic Search", keyEvents: 2, percentage: 100 },
        { source: "Direct", keyEvents: 0, percentage: 0 },
        { source: "Paid Search", keyEvents: 0, percentage: 0 },
        { source: "Referral", keyEvents: 0, percentage: 0 },
        { source: "Unassigned", keyEvents: 0, percentage: 0 },
      ],
      breakdown: [
        { eventName: "Form_submissions", count: 2 },
      ],
      trendOverTime: [
        { month: "Dec 2024", current: 0, previous: 5 },
        { month: "Jan 2025", current: 1, previous: 8 },
        { month: "Feb 2025", current: 2, previous: 4 },
        { month: "Mar 2025", current: 1, previous: 6 },
        { month: "Apr 2025", current: 3, previous: 5 },
        { month: "May 2025", current: 1, previous: 9 },
        { month: "Jun 2025", current: 0, previous: 4 },
        { month: "Jul 2025", current: 2, previous: 6 },
        { month: "Aug 2025", current: 1, previous: 5 },
        { month: "Sep 2025", current: 3, previous: 7 },
        { month: "Oct 2025", current: 1, previous: 5 },
        { month: "Nov 2025", current: 2, previous: 6 },
      ],
    },
    events: [
      { name: "page_view", count: 45670, trend: 12 },
      { name: "click", count: 23450, trend: 8 },
      { name: "scroll", count: 18900, trend: -3 },
      { name: "form_submit", count: 1240, trend: 24 },
      { name: "video_play", count: 890, trend: 15 },
    ],
    audience: {
      byState: [
        { state: "Western Australia", sessions: 44, percentage: 50 },
        { state: "New South Wales", sessions: 17, percentage: 19.32 },
        { state: "Victoria", sessions: 14, percentage: 15.91 },
        { state: "Australian Capital Territory", sessions: 6, percentage: 6.82 },
        { state: "Queensland", sessions: 4, percentage: 4.55 },
        { state: "South Australia", sessions: 3, percentage: 3.41 },
      ],
      byAge: [
        { age: "18-24", percentage: 55 },
        { age: "25-34", percentage: 45 },
      ],
      byGender: [
        { gender: "Male", percentage: 63.6 },
        { gender: "Female", percentage: 36.4 },
      ],
      byLocation: [
        { location: "(not set)", keyEvents: 1 },
        { location: "Adelaide", keyEvents: 0 },
        { location: "Albury", keyEvents: 0 },
        { location: "Brisbane", keyEvents: 0 },
        { location: "Busselton", keyEvents: 0 },
        { location: "Canberra", keyEvents: 0 },
        { location: "Geelong", keyEvents: 0 },
        { location: "Melbourne", keyEvents: 1 },
      ],
    },
    devices: {
      desktop: 95.3,
      mobile: 4.5,
      tablet: 0.2,
    },
    dailyUsers: [
      { date: "Mon", users: 2400 },
      { date: "Tue", users: 2800 },
      { date: "Wed", users: 3200 },
      { date: "Thu", users: 2900 },
      { date: "Fri", users: 3500 },
      { date: "Sat", users: 2100 },
      { date: "Sun", users: 1800 },
    ],
    sessionsOverTime: [
      { month: "Dec 2024", current: 200, previous: 500 },
      { month: "Jan 2025", current: 250, previous: 550 },
      { month: "Feb 2025", current: 300, previous: 600 },
      { month: "Mar 2025", current: 350, previous: 580 },
      { month: "Apr 2025", current: 400, previous: 620 },
      { month: "May 2025", current: 450, previous: 650 },
      { month: "Jun 2025", current: 500, previous: 700 },
      { month: "Jul 2025", current: 550, previous: 680 },
      { month: "Aug 2025", current: 600, previous: 720 },
      { month: "Sep 2025", current: 550, previous: 750 },
      { month: "Oct 2025", current: 750, previous: 800 },
      { month: "Nov 2025", current: 789, previous: 750 },
    ],
    organicSessionsOverTime: [
      { month: "Dec 2024", current: 50, previous: 100 },
      { month: "Jan 2025", current: 55, previous: 110 },
      { month: "Feb 2025", current: 60, previous: 120 },
      { month: "Mar 2025", current: 85, previous: 130 },
      { month: "Apr 2025", current: 80, previous: 125 },
      { month: "May 2025", current: 75, previous: 140 },
      { month: "Jun 2025", current: 70, previous: 135 },
      { month: "Jul 2025", current: 65, previous: 130 },
      { month: "Aug 2025", current: 70, previous: 140 },
      { month: "Sep 2025", current: 75, previous: 145 },
      { month: "Oct 2025", current: 80, previous: 150 },
      { month: "Nov 2025", current: 77, previous: 150 },
    ],
  };
};

export const getGSCData = () => ({
  overview: {
    totalClicks: 49,
    totalImpressions: 47859,
    avgCTR: 0.10,
    avgPosition: 8.3,
    clicksTrend: 0.0,
    impressionsTrend: -11.4,
    ctrTrend: 0.01,
  },
  keywordPositions: {
    focusKeywords: 211,
    averagePosition: 93.4,
    averagePositionTrend: 0.1,
    keywordsOnFirstPage: 5,
    keywordsOnFirstPageTrend: 0,
    totalRankingKeywords: 417,
    totalRankingKeywordsTrend: -34,
    keywords: [
      { keyword: "website migration perth", volume: 10, position: 6, delta: -2 },
      { keyword: "website for tradies", volume: 480, position: 9, delta: -4 },
      { keyword: "website design for tradies", volume: 90, position: 9, delta: 0 },
      { keyword: "ndis web design", volume: 390, position: 10, delta: 1 },
      { keyword: "wordpress development agency", volume: 20, position: 10, delta: -4 },
      { keyword: "ndis website design", volume: 390, position: 11, delta: 3 },
      { keyword: "website migration service", volume: 40, position: 11, delta: 2 },
      { keyword: "custom built website", volume: 40, position: 15, delta: 1 },
      { keyword: "best website migration service", volume: 10, position: 15, delta: 4 },
      { keyword: "website migration", volume: 110, position: 21, delta: -4 },
      { keyword: "ecommerce website design perth", volume: 170, position: 22, delta: 4 },
      { keyword: "ecommerce web design perth", volume: 260, position: 26, delta: 3 },
      { keyword: "small business website near me", volume: 10, position: 28, delta: -42 },
      { keyword: "custom ecommerce website", volume: 10, position: 29, delta: -12 },
      { keyword: "small business websites", volume: 180, position: 30, delta: -5 },
      { keyword: "websites for small business", volume: 480, position: 34, delta: -6 },
      { keyword: "small business website", volume: 480, position: 69, delta: 2 },
      { keyword: "web development company perth", volume: 140, position: 76, delta: -24 },
    ],
  },
  topQueries: [
    { query: "web browser", clicks: 5, impressions: 504, ctr: 0.99, position: 4.2 },
    { query: "what is a web browser", clicks: 2, impressions: 2779, ctr: 0.07, position: 5.1 },
    { query: "browser meaning in computer", clicks: 1, impressions: 26, ctr: 3.85, position: 8.7 },
    { query: "browser.in", clicks: 1, impressions: 1, ctr: 100, position: 6.3 },
    { query: "hosting checker", clicks: 1, impressions: 47, ctr: 2.13, position: 3.9 },
    { query: "how do i find out where a website is hosted", clicks: 1, impressions: 2, ctr: 50, position: 7.2 },
    { query: "ndis provider website design", clicks: 1, impressions: 311, ctr: 0.32, position: 8.5 },
    { query: "ndis website design", clicks: 1, impressions: 789, ctr: 0.13, position: 9.1 },
    { query: "vip lounge karaoke", clicks: 1, impressions: 28, ctr: 3.57, position: 6.8 },
    { query: "website design for tradesmen", clicks: 1, impressions: 189, ctr: 0.53, position: 7.5 },
  ],
  topPages: [
    { page: "/features", clicks: 8900, impressions: 125000, ctr: 7.1 },
    { page: "/pricing", clicks: 6700, impressions: 98000, ctr: 6.8 },
    { page: "/blog/analytics-guide", clicks: 5400, impressions: 78000, ctr: 6.9 },
    { page: "/integrations", clicks: 4200, impressions: 67000, ctr: 6.3 },
    { page: "/", clicks: 3800, impressions: 89000, ctr: 4.3 },
  ],
  indexingStatus: {
    indexed: 1245,
    notIndexed: 89,
    crawled: 1334,
    errors: 12,
  },
  coreWebVitals: {
    lcp: { value: 2.1, status: "good" },
    fid: { value: 45, status: "good" },
    cls: { value: 0.08, status: "good" },
    fcp: { value: 1.2, status: "good" },
    ttfb: { value: 0.4, status: "good" },
  },
  clicksOverTime: [
    { date: "Nov 1", clicks: 2, previous: 3 },
    { date: "Nov 2", clicks: 1, previous: 2 },
    { date: "Nov 3", clicks: 3, previous: 4 },
    { date: "Nov 4", clicks: 2, previous: 3 },
    { date: "Nov 5", clicks: 1, previous: 2 },
    { date: "Nov 6", clicks: 4, previous: 5 },
    { date: "Nov 7", clicks: 2, previous: 3 },
    { date: "Nov 8", clicks: 3, previous: 4 },
    { date: "Nov 9", clicks: 1, previous: 2 },
    { date: "Nov 10", clicks: 2, previous: 3 },
    { date: "Nov 11", clicks: 5, previous: 4 },
    { date: "Nov 12", clicks: 3, previous: 5 },
    { date: "Nov 13", clicks: 2, previous: 3 },
    { date: "Nov 14", clicks: 4, previous: 4 },
    { date: "Nov 15", clicks: 1, previous: 2 },
    { date: "Nov 16", clicks: 3, previous: 4 },
    { date: "Nov 17", clicks: 2, previous: 3 },
    { date: "Nov 18", clicks: 6, previous: 5 },
    { date: "Nov 19", clicks: 5, previous: 4 },
    { date: "Nov 20", clicks: 2, previous: 3 },
    { date: "Nov 21", clicks: 4, previous: 5 },
    { date: "Nov 22", clicks: 3, previous: 4 },
    { date: "Nov 23", clicks: 1, previous: 2 },
    { date: "Nov 24", clicks: 2, previous: 3 },
    { date: "Nov 25", clicks: 3, previous: 4 },
    { date: "Nov 26", clicks: 1, previous: 2 },
    { date: "Nov 27", clicks: 2, previous: 3 },
    { date: "Nov 28", clicks: 4, previous: 5 },
    { date: "Nov 29", clicks: 3, previous: 4 },
  ],
  impressionsOverTime: [
    { date: "Nov 1", impressions: 1500, previous: 1800 },
    { date: "Nov 2", impressions: 1600, previous: 1900 },
    { date: "Nov 3", impressions: 1700, previous: 2000 },
    { date: "Nov 4", impressions: 1650, previous: 1850 },
    { date: "Nov 5", impressions: 1800, previous: 2100 },
    { date: "Nov 6", impressions: 1900, previous: 2200 },
    { date: "Nov 7", impressions: 1750, previous: 1950 },
    { date: "Nov 8", impressions: 1850, previous: 2050 },
    { date: "Nov 9", impressions: 1700, previous: 2000 },
    { date: "Nov 10", impressions: 1800, previous: 2100 },
    { date: "Nov 11", impressions: 2000, previous: 2300 },
    { date: "Nov 12", impressions: 1900, previous: 2200 },
    { date: "Nov 13", impressions: 1750, previous: 1950 },
    { date: "Nov 14", impressions: 1850, previous: 2050 },
    { date: "Nov 15", impressions: 1700, previous: 2000 },
    { date: "Nov 16", impressions: 1800, previous: 2100 },
    { date: "Nov 17", impressions: 1900, previous: 2200 },
    { date: "Nov 18", impressions: 2800, previous: 2000 },
    { date: "Nov 19", impressions: 2700, previous: 2100 },
    { date: "Nov 20", impressions: 1800, previous: 2200 },
    { date: "Nov 21", impressions: 1900, previous: 2300 },
    { date: "Nov 22", impressions: 2000, previous: 2400 },
    { date: "Nov 23", impressions: 1750, previous: 1950 },
    { date: "Nov 24", impressions: 1850, previous: 2050 },
    { date: "Nov 25", impressions: 1700, previous: 2000 },
    { date: "Nov 26", impressions: 1800, previous: 2100 },
    { date: "Nov 27", impressions: 1900, previous: 2200 },
    { date: "Nov 28", impressions: 2000, previous: 2300 },
    { date: "Nov 29", impressions: 1900, previous: 2200 },
  ],
});

export const getAdsData = () => {
  const totalClicks = 34100;
  const totalConversions = 892;
  const totalSpend = 12450;
  const totalImpressions = 710000;
  
  return {
    overview: {
      clicks: totalClicks,
      clicksTrend: -12.5,
      conversions: totalConversions,
      conversionsTrend: 18.2,
      cost: totalSpend,
      costTrend: -5.3,
      costPerConversion: totalConversions > 0 ? totalSpend / totalConversions : 0,
      costPerConversionTrend: -8.1,
      totalSpend: totalSpend,
      totalConversions: totalConversions,
      avgCPC: 1.24,
      avgCTR: 4.8,
      roas: 3.2,
      spendTrend: -5,
    },
    campaigns: [
      { name: "Brand Awareness", impressions: 185000, clicks: 8900, ctr: 4.81, spend: 3200, avgCPC: 0.36, conversions: 245, status: "active" },
      { name: "Product Launch", impressions: 245000, clicks: 12400, ctr: 5.06, spend: 4500, avgCPC: 0.36, conversions: 389, status: "active" },
      { name: "Retargeting", impressions: 125000, clicks: 5600, ctr: 4.48, spend: 2100, avgCPC: 0.38, conversions: 178, status: "active" },
      { name: "Holiday Sale", impressions: 155000, clicks: 7200, ctr: 4.65, spend: 2650, avgCPC: 0.37, conversions: 80, status: "paused" },
    ],
    adGroups: [
      { name: "Brand - Search", impressions: 95000, clicks: 4800, ctr: 5.05, spend: 1650, avgCPC: 0.34, conversions: 145 },
      { name: "Brand - Display", impressions: 90000, clicks: 4100, ctr: 4.56, spend: 1550, avgCPC: 0.38, conversions: 100 },
      { name: "Product - Core", impressions: 130000, clicks: 7200, ctr: 5.54, spend: 2400, avgCPC: 0.33, conversions: 210 },
      { name: "Product - Extended", impressions: 115000, clicks: 5200, ctr: 4.52, spend: 2100, avgCPC: 0.40, conversions: 179 },
      { name: "Retargeting - Cart", impressions: 75000, clicks: 3200, ctr: 4.27, spend: 1200, avgCPC: 0.38, conversions: 98 },
      { name: "Retargeting - Browse", impressions: 50000, clicks: 2400, ctr: 4.80, spend: 900, avgCPC: 0.38, conversions: 80 },
    ],
    devices: [
      { device: "Mobile", impressions: 426000, clicks: 20460, ctr: 4.80, spend: 7470, conversions: 535, percentage: 60 },
      { device: "Desktop", impressions: 213000, clicks: 10230, ctr: 4.80, spend: 3735, conversions: 268, percentage: 30 },
      { device: "Tablet", impressions: 71000, clicks: 3410, ctr: 4.80, spend: 1245, conversions: 89, percentage: 10 },
    ],
    keywords: [
      { keyword: "marketing software", clicks: 4500, cpc: 1.45, conversions: 156, quality: 9 },
      { keyword: "analytics platform", clicks: 3800, cpc: 1.32, conversions: 134, quality: 8 },
      { keyword: "dashboard tool", clicks: 2900, cpc: 0.98, conversions: 98, quality: 7 },
      { keyword: "data visualization", clicks: 2100, cpc: 1.15, conversions: 72, quality: 8 },
      { keyword: "business intelligence", clicks: 1800, cpc: 1.67, conversions: 64, quality: 6 },
    ],
    recommendations: [
      { type: "budget", title: "Increase budget for high-performing campaigns", impact: "high", potential: "+23% conversions" },
      { type: "keyword", title: "Add negative keywords to reduce waste", impact: "medium", potential: "-12% spend" },
      { type: "bid", title: "Adjust bids for mobile devices", impact: "medium", potential: "+15% CTR" },
      { type: "ad", title: "Test new ad copy variations", impact: "low", potential: "+8% CTR" },
    ],
    spendOverTime: [
      { date: "Mon", spend: 1650 },
      { date: "Tue", spend: 1820 },
      { date: "Wed", spend: 1940 },
      { date: "Thu", spend: 1780 },
      { date: "Fri", spend: 2100 },
      { date: "Sat", spend: 1580 },
      { date: "Sun", spend: 1580 },
    ],
  };
};

export type WidgetType = 
  | 'ga4-realtime'
  | 'ga4-acquisition'
  | 'ga4-top-pages'
  | 'ga4-events'
  | 'ga4-devices'
  | 'ga4-daily-users'
  | 'ga4-key-events-summary'
  | 'ga4-key-events-trend'
  | 'ga4-key-events-source'
  | 'ga4-key-events-breakdown'
  | 'ga4-landing-pages'
  | 'ga4-traffic-source'
  | 'ga4-sessions-trend'
  | 'ga4-organic-sessions-trend'
  | 'ga4-audience-geography'
  | 'ga4-audience-age'
  | 'ga4-audience-gender'
  | 'ga4-audience-location-events'
  | 'gsc-overview'
  | 'gsc-queries'
  | 'gsc-pages'
  | 'gsc-indexing'
  | 'gsc-vitals'
  | 'gsc-clicks-chart'
  | 'gsc-keyword-positions'
  | 'gsc-impressions-chart'
  | 'ads-overview'
  | 'ads-campaigns'
  | 'ads-keywords'
  | 'ads-recommendations'
  | 'ads-spend-chart';

export const widgetLibrary = {
  ga4: [
    { id: 'ga4-realtime', name: 'Realtime Overview', icon: 'Activity' },
    { id: 'ga4-acquisition', name: 'Acquisition Summary', icon: 'TrendingUp' },
    { id: 'ga4-top-pages', name: 'Top Pages', icon: 'FileText' },
    { id: 'ga4-events', name: 'Events Summary', icon: 'MousePointer' },
    { id: 'ga4-devices', name: 'Device Breakdown', icon: 'Monitor' },
    { id: 'ga4-daily-users', name: 'Daily Users Chart', icon: 'BarChart3' },
    { id: 'ga4-key-events-summary', name: 'Key Events Summary', icon: 'Target' },
    { id: 'ga4-key-events-trend', name: 'Key Events Trend', icon: 'TrendingUp' },
    { id: 'ga4-key-events-source', name: 'Key Events By Source', icon: 'BarChart3' },
    { id: 'ga4-key-events-breakdown', name: 'Key Event Breakdown', icon: 'PieChart' },
    { id: 'ga4-landing-pages', name: 'Landing Pages Performance', icon: 'FileText' },
    { id: 'ga4-traffic-source', name: 'Traffic Source', icon: 'Network' },
    { id: 'ga4-sessions-trend', name: 'Sessions Trend', icon: 'LineChart' },
    { id: 'ga4-organic-sessions-trend', name: 'Organic Sessions Trend', icon: 'LineChart' },
    { id: 'ga4-audience-geography', name: 'Audience By State', icon: 'MapPin' },
    { id: 'ga4-audience-age', name: 'Audience Age', icon: 'Users' },
    { id: 'ga4-audience-gender', name: 'Audience Gender', icon: 'User' },
    { id: 'ga4-audience-location-events', name: 'Key Events By Location', icon: 'Map' },
  ],
  gsc: [
    { id: 'gsc-overview', name: 'Performance Overview', icon: 'Search' },
    { id: 'gsc-queries', name: 'Top Queries', icon: 'MessageSquare' },
    { id: 'gsc-pages', name: 'Top Pages', icon: 'FileText' },
    { id: 'gsc-indexing', name: 'Indexing Status', icon: 'Database' },
    { id: 'gsc-vitals', name: 'Core Web Vitals', icon: 'Gauge' },
    { id: 'gsc-clicks-chart', name: 'Clicks Over Time', icon: 'LineChart' },
    { id: 'gsc-keyword-positions', name: 'Keyword Positions', icon: 'List' },
    { id: 'gsc-impressions-chart', name: 'Impressions Over Time', icon: 'LineChart' },
  ],
  ads: [
    { id: 'ads-overview', name: 'Campaign Overview', icon: 'DollarSign' },
    { id: 'ads-campaigns', name: 'Campaign Performance', icon: 'Target' },
    { id: 'ads-keywords', name: 'Keyword Performance', icon: 'Key' },
    { id: 'ads-recommendations', name: 'Recommendations', icon: 'Lightbulb' },
    { id: 'ads-spend-chart', name: 'Spend Over Time', icon: 'AreaChart' },
  ],
};
