import { getGSCData } from '@/lib/mockData';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatCard } from '../dashboard/StatCard';
import { MousePointer, Eye, Percent, Hash, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const data = getGSCData();

export const GSCOverviewWidget = () => (
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

export const GSCQueriesWidget = () => (
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

export const GSCPagesWidget = () => (
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

export const GSCIndexingWidget = () => (
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

export const GSCVitalsWidget = () => {
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

export const GSCClicksChartWidget = () => (
  <DashboardCard title="Clicks Over Time" subtitle="Weekly performance">
    <div className="h-40">
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
