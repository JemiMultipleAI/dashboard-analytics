// Mock API functions for GA4, GSC, and Google Ads

export const getGA4Data = () => ({
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
  topPages: [
    { path: "/", views: 12450, avgTime: "2:34" },
    { path: "/products", views: 8920, avgTime: "3:12" },
    { path: "/pricing", views: 6780, avgTime: "1:45" },
    { path: "/blog", views: 5430, avgTime: "4:20" },
    { path: "/contact", views: 3210, avgTime: "1:10" },
  ],
  events: [
    { name: "page_view", count: 45670, trend: 12 },
    { name: "click", count: 23450, trend: 8 },
    { name: "scroll", count: 18900, trend: -3 },
    { name: "form_submit", count: 1240, trend: 24 },
    { name: "video_play", count: 890, trend: 15 },
  ],
  devices: {
    desktop: 58,
    mobile: 35,
    tablet: 7,
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
});

export const getGSCData = () => ({
  overview: {
    totalClicks: 125000,
    totalImpressions: 2450000,
    avgCTR: 5.1,
    avgPosition: 8.3,
    clicksTrend: 15,
    impressionsTrend: 22,
  },
  topQueries: [
    { query: "marketing analytics", clicks: 3420, impressions: 45000, ctr: 7.6, position: 4.2 },
    { query: "unified dashboard", clicks: 2890, impressions: 38000, ctr: 7.6, position: 5.1 },
    { query: "google ads integration", clicks: 2340, impressions: 52000, ctr: 4.5, position: 8.7 },
    { query: "analytics platform", clicks: 1980, impressions: 29000, ctr: 6.8, position: 6.3 },
    { query: "marketing hub", clicks: 1560, impressions: 21000, ctr: 7.4, position: 3.9 },
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
    { date: "Week 1", clicks: 28000 },
    { date: "Week 2", clicks: 31000 },
    { date: "Week 3", clicks: 29500 },
    { date: "Week 4", clicks: 36500 },
  ],
});

export const getAdsData = () => ({
  overview: {
    totalSpend: 12450,
    totalConversions: 892,
    avgCPC: 1.24,
    avgCTR: 4.8,
    roas: 3.2,
    spendTrend: -5,
    conversionsTrend: 18,
  },
  campaigns: [
    { name: "Brand Awareness", spend: 3200, clicks: 8900, conversions: 245, ctr: 5.2, status: "active" },
    { name: "Product Launch", spend: 4500, clicks: 12400, conversions: 389, ctr: 4.9, status: "active" },
    { name: "Retargeting", spend: 2100, clicks: 5600, conversions: 178, ctr: 6.1, status: "active" },
    { name: "Holiday Sale", spend: 2650, clicks: 7200, conversions: 80, ctr: 3.8, status: "paused" },
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
});

export type WidgetType = 
  | 'ga4-realtime'
  | 'ga4-acquisition'
  | 'ga4-top-pages'
  | 'ga4-events'
  | 'ga4-devices'
  | 'ga4-daily-users'
  | 'gsc-overview'
  | 'gsc-queries'
  | 'gsc-pages'
  | 'gsc-indexing'
  | 'gsc-vitals'
  | 'gsc-clicks-chart'
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
  ],
  gsc: [
    { id: 'gsc-overview', name: 'Performance Overview', icon: 'Search' },
    { id: 'gsc-queries', name: 'Top Queries', icon: 'MessageSquare' },
    { id: 'gsc-pages', name: 'Top Pages', icon: 'FileText' },
    { id: 'gsc-indexing', name: 'Indexing Status', icon: 'Database' },
    { id: 'gsc-vitals', name: 'Core Web Vitals', icon: 'Gauge' },
    { id: 'gsc-clicks-chart', name: 'Clicks Over Time', icon: 'LineChart' },
  ],
  ads: [
    { id: 'ads-overview', name: 'Campaign Overview', icon: 'DollarSign' },
    { id: 'ads-campaigns', name: 'Campaign Performance', icon: 'Target' },
    { id: 'ads-keywords', name: 'Keyword Performance', icon: 'Key' },
    { id: 'ads-recommendations', name: 'Recommendations', icon: 'Lightbulb' },
    { id: 'ads-spend-chart', name: 'Spend Over Time', icon: 'AreaChart' },
  ],
};
