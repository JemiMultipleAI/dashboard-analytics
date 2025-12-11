'use client';

import { useEffect, useState } from 'react';
import { fetchGA4Data } from '@/lib/api';
import { getGA4Data } from '@/lib/mockData';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatCard } from '../dashboard/StatCard';
import { MousePointer, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

export const TrafficSourceWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading || !data?.trafficSource) {
    return (
      <DashboardCard title="Traffic Source" subtitle="Sessions by traffic source">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Traffic Source" subtitle="Sessions by traffic source">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground pb-3">Session default...</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Sessions</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {data.trafficSource.map((source: any) => (
              <tr key={source.source} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="py-3 text-sm text-foreground font-medium">{source.source}</td>
                <td className="py-3 text-sm text-right text-foreground">{source.sessions.toLocaleString()}</td>
                <td className="py-3 text-sm text-right text-foreground">{source.percentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export const SessionsTrendWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading || !data?.sessionsOverTime) {
    return (
      <DashboardCard title="Overall Sessions" subtitle="Sessions over time">
        <div className="h-64 bg-secondary/50 rounded animate-pulse"></div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Overall Sessions" subtitle="Sessions over time">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.sessionsOverTime}>
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
              tickFormatter={(value) => `${value / 1000}K`}
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
              name="Sessions"
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name="Sessions (previous year)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export const OrganicSessionsTrendWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading || !data?.organicSessionsOverTime) {
    return (
      <DashboardCard title="Organic Sessions" subtitle="Organic sessions over time">
        <div className="h-64 bg-secondary/50 rounded animate-pulse"></div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Organic Sessions" subtitle="Organic sessions over time">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.organicSessionsOverTime}>
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
              name="Organic Sessions"
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name="Organic Sessions (previous year)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

