'use client';

import { useEffect, useState } from 'react';
import { fetchGA4Data } from '@/lib/api';
import { getGA4Data } from '@/lib/mockData';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatCard } from '../dashboard/StatCard';
import { Target, TrendingDown, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

const useGA4Data = () => {
  const [data, setData] = useState(getGA4Data());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const realData = await fetchGA4Data();
        setData(realData);
        setIsRealData(true);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setIsRealData(false);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return { data, loading, error, isRealData };
};

export const KeyEventsSummaryWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
            <div className="h-4 bg-secondary rounded w-20 mb-3"></div>
            <div className="h-8 bg-secondary rounded w-24 mb-2"></div>
            <div className="h-4 bg-secondary rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const keyEvents = data.keyEvents || { total: 0, totalTrend: 0, sessionKeyEventRate: 0, sessionKeyEventRateTrend: 0 };

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        title="Key events"
        value={keyEvents.total.toLocaleString()}
        trend={keyEvents.totalTrend}
        trendValue={keyEvents.totalTrend !== undefined ? `${keyEvents.totalTrend > 0 ? '+' : ''}${keyEvents.totalTrend.toFixed(1)}%` : undefined}
        icon={Target}
      />
      <StatCard
        title="Session key event rate"
        value={`${keyEvents.sessionKeyEventRate.toFixed(2)}%`}
        trend={keyEvents.sessionKeyEventRateTrend}
        trendValue={keyEvents.sessionKeyEventRateTrend !== undefined ? `${keyEvents.sessionKeyEventRateTrend > 0 ? '+' : ''}${keyEvents.sessionKeyEventRateTrend.toFixed(2)}%` : undefined}
        icon={Target}
      />
    </div>
  );
};

export const KeyEventsTrendWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading || !data?.keyEvents?.trendOverTime) {
    return (
      <DashboardCard title="Overall Key Events" subtitle="Key events over time">
        <div className="h-64 bg-secondary/50 rounded animate-pulse"></div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Overall Key Events" subtitle="Key events over time">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.keyEvents.trendOverTime}>
            <XAxis
              dataKey="month"
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
              dataKey="current"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Key events"
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name="Key events (previous year)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export const KeyEventsBySourceWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading || !data?.keyEvents?.bySource) {
    return (
      <DashboardCard title="Key Events By Source" subtitle="Key events breakdown by traffic source">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Key Events By Source" subtitle="Key events breakdown by traffic source">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground pb-3">Session default...</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Key events</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Key event %</th>
            </tr>
          </thead>
          <tbody>
            {data.keyEvents.bySource.map((item: any) => (
              <tr key={item.source} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="py-3 text-sm text-foreground font-medium">{item.source}</td>
                <td className="py-3 text-sm text-right text-foreground">{item.keyEvents.toLocaleString()}</td>
                <td className="py-3 text-sm text-right text-foreground">{item.percentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export const KeyEventBreakdownWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading || !data?.keyEvents?.breakdown) {
    return (
      <DashboardCard title="Key Event Breakdown" subtitle="Key events by event type">
        <div className="h-48 bg-secondary/50 rounded animate-pulse"></div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Key Event Breakdown" subtitle="Key events by event type">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.keyEvents.breakdown}>
            <XAxis
              dataKey="eventName"
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
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};


