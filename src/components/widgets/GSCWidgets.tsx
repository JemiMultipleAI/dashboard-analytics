'use client';

import { useEffect, useState } from 'react';
import { fetchGSCData } from '@/lib/api';
import { getGSCData } from '@/lib/mockData';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatCard } from '../dashboard/StatCard';
import { MousePointer, Eye, Percent, Hash, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

const useGSCData = () => {
  const [data, setData] = useState(getGSCData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Fetching real GSC data...');
        const realData = await fetchGSCData();
        console.log('✅ Received real GSC data:', realData);
        setData(realData);
        setIsRealData(true);
        setError(null);
      } catch (err: any) {
        console.warn('⚠️ Using mock GSC data:', err.message);
        // Always set error message so user knows what went wrong
        const errorMessage = err.message || 'Failed to load Search Console data';
        setError(errorMessage);
        setIsRealData(false);
        // Keep using mock data if not authenticated or on error
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error, isRealData };
};

export const GSCOverviewWidget = () => {
  const { data, error, isRealData } = useGSCData();
  
  return (
    <>
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive mb-4">
          <p className="text-sm font-medium">❌ Error loading Search Console data:</p>
          <p className="text-xs mt-1">{error}</p>
          {error.includes('Not authenticated') && (
            <p className="text-xs mt-2">Please connect your Google Search Console account from the dashboard.</p>
          )}
          {error.includes('No sites found') && (
            <p className="text-xs mt-2">Please add a property to Google Search Console first.</p>
          )}
          {error.includes('Access denied') && (
            <p className="text-xs mt-2">Please ensure the Search Console API is enabled in Google Cloud Console.</p>
          )}
        </div>
      )}
      {isRealData && !error && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-2 text-success mb-4 text-xs">
          ✅ Showing real Search Console data
        </div>
      )}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      title="Total Clicks"
      value={data.overview.totalClicks.toLocaleString()}
      trend={data.overview.clicksTrend}
      icon={MousePointer}
    />
    <StatCard
      title="Impressions"
      value={data.overview.totalImpressions.toLocaleString()}
      trend={data.overview.impressionsTrend}
      icon={Eye}
    />
    <StatCard
      title="Avg. CTR"
      value={`${data.overview.avgCTR}%`}
      icon={Percent}
    />
    <StatCard
      title="Avg. Position"
      value={data.overview.avgPosition.toFixed(1)}
      icon={Hash}
    />
  </div>
    </>
);
};

export const GSCQueriesWidget = () => {
  const { data } = useGSCData();

  return (
  <DashboardCard title="Top Queries" subtitle="Best performing search queries">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-medium text-muted-foreground pb-3">Query</th>
            <th className="text-right text-xs font-medium text-muted-foreground pb-3">Clicks</th>
            <th className="text-right text-xs font-medium text-muted-foreground pb-3">CTR</th>
            <th className="text-right text-xs font-medium text-muted-foreground pb-3">Position</th>
          </tr>
        </thead>
        <tbody>
          {data.topQueries.map((query) => (
            <tr key={query.query} className="border-b border-border/50 last:border-0">
              <td className="py-3 text-sm text-foreground truncate max-w-40">{query.query}</td>
              <td className="py-3 text-sm text-right text-foreground">{query.clicks.toLocaleString()}</td>
              <td className="py-3 text-sm text-right text-foreground">{query.ctr}%</td>
              <td className="py-3 text-sm text-right text-foreground">{query.position.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardCard>
);
};

export const GSCPagesWidget = () => {
  const { data } = useGSCData();

  return (
  <DashboardCard title="Top Pages" subtitle="Best performing pages">
    <div className="space-y-3">
      {data.topPages.map((page) => (
        <div key={page.page} className="flex items-center justify-between">
          <span className="text-sm text-foreground truncate max-w-40">{page.page}</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{page.clicks.toLocaleString()} clicks</span>
            <span className="text-sm font-medium text-foreground">{page.ctr}% CTR</span>
          </div>
        </div>
      ))}
    </div>
  </DashboardCard>
);
};

export const GSCIndexingWidget = () => {
  const { data } = useGSCData();

  return (
  <DashboardCard title="Indexing Status" subtitle="Page coverage overview">
    <div className="grid grid-cols-2 gap-4">
      <div className="p-3 rounded-lg bg-success/10 border border-success/20">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-success" />
          <span className="text-sm text-success">Indexed</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{data.indexingStatus.indexed.toLocaleString()}</p>
      </div>
      <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-warning" />
          <span className="text-sm text-warning">Not Indexed</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{data.indexingStatus.notIndexed}</p>
      </div>
      <div className="p-3 rounded-lg bg-info/10 border border-info/20">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-info" />
          <span className="text-sm text-info">Crawled</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{data.indexingStatus.crawled.toLocaleString()}</p>
      </div>
      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className="text-sm text-destructive">Errors</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{data.indexingStatus.errors}</p>
      </div>
    </div>
  </DashboardCard>
);
};

export const GSCVitalsWidget = () => {
  const { data } = useGSCData();
  const vitals = [
    { key: 'lcp', label: 'LCP', value: `${data.coreWebVitals.lcp.value}s`, status: data.coreWebVitals.lcp.status, icon: Clock },
    { key: 'fid', label: 'FID', value: `${data.coreWebVitals.fid.value}ms`, status: data.coreWebVitals.fid.status, icon: Zap },
    { key: 'cls', label: 'CLS', value: data.coreWebVitals.cls.value.toString(), status: data.coreWebVitals.cls.status, icon: Hash },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'good') return 'text-success bg-success/10 border-success/20';
    if (status === 'needs-improvement') return 'text-warning bg-warning/10 border-warning/20';
    return 'text-destructive bg-destructive/10 border-destructive/20';
  };

  return (
    <DashboardCard title="Core Web Vitals" subtitle="Page experience metrics">
      <div className="grid grid-cols-3 gap-3">
        {vitals.map((vital) => {
          const Icon = vital.icon;
          return (
            <div
              key={vital.key}
              className={cn(
                'p-3 rounded-lg border text-center',
                getStatusColor(vital.status)
              )}
            >
              <Icon className="w-5 h-5 mx-auto mb-2" />
              <p className="text-lg font-bold text-foreground">{vital.value}</p>
              <p className="text-xs">{vital.label}</p>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};

export const GSCClicksChartWidget = () => {
  const { data } = useGSCData();
  
  return (
    <DashboardCard title="Clicks" subtitle="Clicks over time">
      <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.clicksOverTime}>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Clicks"
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
            name="Clicks (previous year)"
          />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </DashboardCard>
);
};
