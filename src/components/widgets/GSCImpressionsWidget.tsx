'use client';

import { useEffect, useState } from 'react';
import { fetchGSCData } from '@/lib/api';
import { getGSCData } from '@/lib/mockData';
import { DashboardCard } from '../dashboard/DashboardCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const useGSCData = () => {
  const [data, setData] = useState(getGSCData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const realData = await fetchGSCData();
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

export const GSCImpressionsChartWidget = () => {
  const { data, loading } = useGSCData();
  
  if (loading || !data?.impressionsOverTime) {
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

