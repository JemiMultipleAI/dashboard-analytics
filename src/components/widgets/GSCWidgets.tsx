'use client';

import { useEffect, useState } from 'react';
import { fetchGSCData } from '@/lib/api';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatCard } from '../dashboard/StatCard';
import { MousePointer, Eye, Percent, Hash, CheckCircle, AlertCircle, Clock, Zap, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

const useGSCData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const realData = await fetchGSCData();
        setData(realData);
      } catch (err: any) {
        console.error('Error loading GSC data:', err);
        setError(err.message || 'Failed to load Search Console data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};

export const GSCOverviewWidget = () => {
  const { data, loading, error } = useGSCData();
  
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
            <div className="h-4 bg-secondary/50 rounded w-20 mb-3"></div>
            <div className="h-8 bg-secondary/50 rounded w-24 mb-2"></div>
            <div className="h-4 bg-secondary/50 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
        <p className="text-sm font-medium">Error loading Search Console data:</p>
        <p className="text-xs mt-1">{error || 'No data available'}</p>
        {error?.includes('Not authenticated') && (
          <p className="text-xs mt-2">Please connect your Google Search Console account from the dashboard.</p>
        )}
        {error?.includes('No sites found') && (
          <p className="text-xs mt-2">Please add a property to Google Search Console first.</p>
        )}
        {error?.includes('Access denied') && (
          <p className="text-xs mt-2">Please ensure the Search Console API is enabled in Google Cloud Console.</p>
        )}
      </div>
    );
  }
  
  return (
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
);
};

export const GSCQueriesWidget = () => {
  const { data, loading, error } = useGSCData();

  if (loading) {
    return (
      <DashboardCard title="Top Queries" subtitle="Best performing search queries">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  if (error || !data?.topQueries) {
    return (
      <DashboardCard title="Top Queries" subtitle="Best performing search queries">
        <div className="py-8 text-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }

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
            {data.topQueries.map((query: any) => (
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
  const { data, loading, error } = useGSCData();

  if (loading) {
    return (
      <DashboardCard title="Top Pages" subtitle="Best performing pages">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  if (error || !data?.topPages) {
    return (
      <DashboardCard title="Top Pages" subtitle="Best performing pages">
        <div className="py-8 text-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Top Pages" subtitle="Best performing pages">
      <div className="space-y-3">
        {data.topPages.map((page: any) => (
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
  const { data, loading, error } = useGSCData();

  if (loading) {
    return (
      <DashboardCard title="Indexing Status" subtitle="Page coverage overview">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border animate-pulse">
              <div className="h-4 bg-secondary rounded w-16 mb-2"></div>
              <div className="h-8 bg-secondary rounded w-20"></div>
            </div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  if (error || !data?.indexingStatus) {
    return (
      <DashboardCard title="Indexing Status" subtitle="Page coverage overview">
        <div className="py-8 text-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Indexing Status" subtitle="Page coverage overview">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm text-success">Indexed</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{data.indexingStatus.indexed?.toLocaleString() || '0'}</p>
        </div>
        <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            <span className="text-sm text-warning">Not Indexed</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{data.indexingStatus.notIndexed || '0'}</p>
        </div>
        <div className="p-3 rounded-lg bg-info/10 border border-info/20">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-info" />
            <span className="text-sm text-info">Crawled</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{data.indexingStatus.crawled?.toLocaleString() || '0'}</p>
        </div>
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">Errors</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{data.indexingStatus.errors || '0'}</p>
        </div>
      </div>
    </DashboardCard>
  );
};

export const GSCVitalsWidget = () => {
  const { data, loading, error } = useGSCData();

  if (loading) {
    return (
      <DashboardCard title="Core Web Vitals" subtitle="Page experience metrics">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border animate-pulse">
              <div className="h-5 w-5 bg-secondary rounded mx-auto mb-2"></div>
              <div className="h-6 bg-secondary rounded w-16 mx-auto mb-1"></div>
              <div className="h-4 bg-secondary rounded w-12 mx-auto"></div>
            </div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  if (error || !data?.coreWebVitals) {
    return (
      <DashboardCard title="Core Web Vitals" subtitle="Page experience metrics">
        <div className="py-8 text-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }

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
  const { data, loading, error } = useGSCData();

  if (loading) {
    return (
      <DashboardCard title="Clicks" subtitle="Clicks over time">
        <div className="h-64 bg-secondary/50 rounded animate-pulse"></div>
      </DashboardCard>
    );
  }

  if (error || !data?.clicksOverTime) {
    return (
      <DashboardCard title="Clicks" subtitle="Clicks over time">
        <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }
  
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
