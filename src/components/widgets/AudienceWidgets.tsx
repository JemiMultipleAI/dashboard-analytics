'use client';

import { useEffect, useState } from 'react';
import { fetchGA4Data } from '@/lib/api';
import { getGA4Data } from '@/lib/mockData';
import { DashboardCard } from '../dashboard/DashboardCard';
import { MapPin, Users, User, Map } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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

const COLORS = ['hsl(var(--primary))', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

export const AudienceByStateWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading || !data?.audience?.byState) {
    return (
      <DashboardCard title="Audience By State" subtitle="Geographic distribution">
        <div className="space-y-3">
          <div className="h-48 bg-secondary/50 rounded animate-pulse"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-secondary/50 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Audience By State" subtitle="Geographic distribution">
      <div className="space-y-4">
        <div className="h-48 bg-secondary/20 rounded-lg flex items-center justify-center border border-border">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Map visualization</p>
            <p className="text-xs text-muted-foreground mt-1">Geographic data available in table below</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground pb-3">Region</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Sessions</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Sessions %</th>
              </tr>
            </thead>
            <tbody>
              {data.audience.byState.map((state: any) => (
                <tr key={state.state} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 text-sm text-foreground font-medium">{state.state}</td>
                  <td className="py-3 text-sm text-right text-foreground">{state.sessions.toLocaleString()}</td>
                  <td className="py-3 text-sm text-right text-foreground">{state.percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardCard>
  );
};

export const AudienceAgeWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading || !data?.audience?.byAge) {
    return (
      <DashboardCard title="Audience Age" subtitle="Age distribution">
        <div className="h-48 bg-secondary/50 rounded animate-pulse"></div>
      </DashboardCard>
    );
  }

  const chartData = data.audience.byAge.map((item: any) => ({
    name: item.age,
    value: item.percentage,
  }));

  return (
    <DashboardCard title="Audience Age" subtitle="Age distribution">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export const AudienceGenderWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading || !data?.audience?.byGender) {
    return (
      <DashboardCard title="Audience Gender" subtitle="Gender distribution">
        <div className="h-48 bg-secondary/50 rounded animate-pulse"></div>
      </DashboardCard>
    );
  }

  const chartData = data.audience.byGender.map((item: any) => ({
    name: item.gender,
    value: item.percentage,
  }));

  return (
    <DashboardCard title="Audience Gender" subtitle="Gender distribution">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export const AudienceLocationEventsWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading || !data?.audience?.byLocation) {
    return (
      <DashboardCard title="Key Events Based on Location" subtitle="Key events by geographic location">
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Key Events Based on Location" subtitle="Key events by geographic location">
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {data.audience.byLocation.map((location: any, index: number) => (
          <div key={location.location} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-foreground flex-1">{location.location}</span>
            <span className="text-sm text-muted-foreground">{location.keyEvents} events</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};



