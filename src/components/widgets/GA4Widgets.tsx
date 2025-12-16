'use client';

import { useEffect, useState } from 'react';
import { fetchGA4Data } from '@/lib/api';
import { getGA4Data } from '@/lib/mockData';
import { DashboardCard } from '../dashboard/DashboardCard';
import { Activity, Users, FileText, MousePointer, Monitor, Smartphone, Tablet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const useGA4Data = () => {
  const [data, setData] = useState(getGA4Data());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching real GA4 data...');
        const realData = await fetchGA4Data();
        console.log('✅ Received real GA4 data:', realData);
        setData(realData);
        setIsRealData(true);
        setError(null);
      } catch (err: any) {
        console.warn('⚠️ Using mock GA4 data:', err.message);
        if (err.message !== 'Not authenticated') {
          console.error('Error loading GA4 data:', err);
          setError(err.message);
        }
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

export const GA4RealtimeWidget = () => {
  const { data } = useGA4Data();
  
  return (
    <DashboardCard title="Realtime Overview" subtitle="Live user activity">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-success/10 mb-2">
            <Activity className="w-5 h-5 text-success animate-pulse-subtle" />
          </div>
          <p className="text-2xl font-bold text-foreground">{data.realtime.activeUsers.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Active Users</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-primary/10 mb-2">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{data.realtime.pageViews.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Page Views</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-info/10 mb-2">
            <MousePointer className="w-5 h-5 text-info" />
          </div>
          <p className="text-2xl font-bold text-foreground">{data.realtime.eventsPerMinute}</p>
          <p className="text-xs text-muted-foreground">Events/min</p>
        </div>
      </div>
    </DashboardCard>
  );
};

export const GA4AcquisitionWidget = () => {
  const { data } = useGA4Data();
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
  const { data } = useGA4Data();
  
  return (
    <DashboardCard title="Top Pages" subtitle="Most visited pages">
      <div className="space-y-3">
        {data.topPages.slice(0, 5).map((page, index) => (
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
  const { data } = useGA4Data();
  
  return (
    <DashboardCard title="Events Summary" subtitle="Top events by count">
      <div className="space-y-3">
        {data.events.map((event) => (
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
  const { data } = useGA4Data();
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
  const { data } = useGA4Data();
  
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
