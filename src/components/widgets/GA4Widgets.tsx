'use client';

import { useEffect, useState } from 'react';
import { fetchGA4Data } from '@/lib/api';
import { DashboardCard } from '../dashboard/DashboardCard';
import { Activity, Users, FileText, MousePointer, Monitor, Smartphone, Tablet, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const useGA4Data = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const realData = await fetchGA4Data();
        setData(realData);
      } catch (err: any) {
        console.error('Error loading GA4 data:', err);
        setError(err.message || 'Failed to load Google Analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};

export const GA4RealtimeWidget = () => {
  const { data, loading, error } = useGA4Data();
  
  if (loading) {
    return (
      <DashboardCard title="Realtime Overview" subtitle="Live user activity">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-secondary/50 mb-2 animate-pulse">
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              </div>
              <div className="h-8 bg-secondary/50 rounded w-16 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-secondary/50 rounded w-20 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  if (error || !data) {
    return (
      <DashboardCard title="Realtime Overview" subtitle="Live user activity">
        <div className="py-8 text-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }
  
  return (
    <DashboardCard title="Realtime Overview" subtitle="Live user activity">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-success/10 mb-2">
            <Activity className="w-5 h-5 text-success animate-pulse-subtle" />
          </div>
          <p className="text-2xl font-bold text-foreground">{data.realtime?.activeUsers?.toLocaleString() || '0'}</p>
          <p className="text-xs text-muted-foreground">Active Users</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-primary/10 mb-2">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{data.realtime?.pageViews?.toLocaleString() || '0'}</p>
          <p className="text-xs text-muted-foreground">Page Views</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-info/10 mb-2">
            <MousePointer className="w-5 h-5 text-info" />
          </div>
          <p className="text-2xl font-bold text-foreground">{data.realtime?.eventsPerMinute || '0'}</p>
          <p className="text-xs text-muted-foreground">Events/min</p>
        </div>
      </div>
    </DashboardCard>
  );
};

export const GA4AcquisitionWidget = () => {
  const { data, loading, error } = useGA4Data();

  if (loading) {
    return (
      <DashboardCard title="Acquisition Summary" subtitle="Traffic sources breakdown">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-secondary/50 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-secondary/50 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardCard>
    );
  }

  if (error || !data?.acquisition) {
    return (
      <DashboardCard title="Acquisition Summary" subtitle="Traffic sources breakdown">
        <div className="py-8 text-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }

  const acquisitionData = [
    { name: 'Organic', value: data.acquisition.organic, color: 'hsl(var(--chart-1))' },
    { name: 'Direct', value: data.acquisition.direct, color: 'hsl(var(--chart-2))' },
    { name: 'Referral', value: data.acquisition.referral, color: 'hsl(var(--chart-3))' },
    { name: 'Social', value: data.acquisition.social, color: 'hsl(var(--chart-4))' },
    { name: 'Paid', value: data.acquisition.paid, color: 'hsl(var(--chart-5))' },
  ];

  return (
    <DashboardCard title="Acquisition Summary" subtitle="Traffic sources breakdown">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={acquisitionData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                paddingAngle={2}
                dataKey="value"
              >
                {acquisitionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {acquisitionData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};

export const GA4TopPagesWidget = () => {
  const { data, loading, error } = useGA4Data();

  if (loading) {
    return (
      <DashboardCard title="Top Pages" subtitle="Most visited pages">
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
      <DashboardCard title="Top Pages" subtitle="Most visited pages">
        <div className="py-8 text-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }
  
  return (
    <DashboardCard title="Top Pages" subtitle="Most visited pages">
      <div className="space-y-3">
        {data.topPages.slice(0, 5).map((page: any, index: number) => (
        <div key={page.path} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
              {index + 1}
            </span>
            <span className="text-sm text-foreground truncate max-w-32">{page.path}</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{page.views.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{page.avgTime}</p>
          </div>
        </div>
      ))}
    </div>
  </DashboardCard>
  );
};

export const GA4EventsWidget = () => {
  const { data, loading, error } = useGA4Data();

  if (loading) {
    return (
      <DashboardCard title="Events Summary" subtitle="Top events by count">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  if (error || !data?.events) {
    return (
      <DashboardCard title="Events Summary" subtitle="Top events by count">
        <div className="py-8 text-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }
  
  return (
    <DashboardCard title="Events Summary" subtitle="Top events by count">
      <div className="space-y-3">
        {data.events.map((event: any) => (
        <div key={event.name} className="flex items-center justify-between">
          <span className="text-sm text-foreground">{event.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{event.count.toLocaleString()}</span>
            <span
              className={`text-xs font-medium ${
                event.trend > 0 ? 'text-success' : 'text-destructive'
              }`}
            >
              {event.trend > 0 ? '+' : ''}
              {event.trend}%
            </span>
          </div>
        </div>
      ))}
    </div>
  </DashboardCard>
  );
};

export const GA4DevicesWidget = () => {
  const { data, loading, error } = useGA4Data();

  if (loading) {
    return (
      <DashboardCard title="Device Breakdown" subtitle="Users by device type">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  if (error || !data?.devices) {
    return (
      <DashboardCard title="Device Breakdown" subtitle="Users by device type">
        <div className="py-8 text-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }

  const devices = [
    { name: 'Desktop', value: data.devices.desktop, icon: Monitor },
    { name: 'Mobile', value: data.devices.mobile, icon: Smartphone },
    { name: 'Tablet', value: data.devices.tablet, icon: Tablet },
  ];

  return (
    <DashboardCard title="Device Breakdown" subtitle="Users by device type">
      <div className="space-y-4">
        {devices.map((device) => {
          const Icon = device.icon;
          return (
            <div key={device.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{device.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{device.value}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${device.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};

export const GA4DailyUsersWidget = () => {
  const { data, loading, error } = useGA4Data();

  if (loading) {
    return (
      <DashboardCard title="Daily Users" subtitle="Last 7 days">
        <div className="h-40 bg-secondary/50 rounded animate-pulse"></div>
      </DashboardCard>
    );
  }

  if (error || !data?.dailyUsers) {
    return (
      <DashboardCard title="Daily Users" subtitle="Last 7 days">
        <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }
  
  return (
    <DashboardCard title="Daily Users" subtitle="Last 7 days">
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.dailyUsers}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorUsers)"
          />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};
