'use client';

import { useEffect, useState } from 'react';
import { fetchGSCData } from '@/lib/api';
import { DashboardCard } from '../dashboard/DashboardCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

export const GSCImpressionsChartWidget = () => {
  const { data, loading, error } = useGSCData();
  
  if (loading) {
    return (
      <DashboardCard title="Impressions" subtitle="Impressions over time">
        <div className="h-64 bg-secondary/50 rounded animate-pulse"></div>
      </DashboardCard>
    );
  }

  if (error || !data?.impressionsOverTime) {
    return (
      <DashboardCard title="Impressions" subtitle="Impressions over time">
        <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }
  
    return (
      <DashboardCard title="Impressions" subtitle="Impressions over time">
        <div className="h-64 bg-secondary/50 rounded animate-pulse"></div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Impressions" subtitle="Impressions over time">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.impressionsOverTime}>
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
              dataKey="impressions"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Impressions"
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name="Impressions (previous year)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};



