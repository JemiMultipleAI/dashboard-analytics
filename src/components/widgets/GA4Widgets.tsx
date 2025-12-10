import { DashboardCard } from '../dashboard/DashboardCard';
import { Activity, Users, FileText, MousePointer, Monitor, Smartphone, Tablet, Loader2, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useGA4Realtime, useGA4Acquisition, useGA4TopPages, useGA4Events, useGA4Devices, useGA4DailyUsers } from '@/hooks/useGA4Data';

export const GA4RealtimeWidget = () => {
  const { data, isLoading, error } = useGA4Realtime();

  if (isLoading) {
    return (
      <DashboardCard title="Realtime Overview" subtitle="Live user activity">
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardCard>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
    const errorDetails = (error as any)?.details;
    const troubleshooting = (error as any)?.troubleshooting;
    return (
      <DashboardCard title="Realtime Overview" subtitle="Live user activity">
        <div className="flex flex-col items-center justify-center min-h-24 gap-2 text-destructive text-center px-4 py-4">
          <AlertCircle className="w-5 h-5" />
          <span className="text-xs font-medium">{errorMessage.split('\n')[0]}</span>
          {errorDetails && (
            <span className="text-xs text-muted-foreground mt-1">{errorDetails}</span>
          )}
          {troubleshooting && Array.isArray(troubleshooting) && troubleshooting.length > 0 && (
            <div className="text-xs text-muted-foreground mt-2 text-left">
              <div className="font-medium mb-1">Troubleshooting:</div>
              <ul className="list-disc list-inside space-y-0.5">
                {troubleshooting.map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DashboardCard>
    );
  }

  const realtime = data || { activeUsers: 0, pageViews: 0, eventsPerMinute: 0 };

  return (
    <DashboardCard title="Realtime Overview" subtitle="Live user activity">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-success/10 mb-2">
            <Activity className="w-5 h-5 text-success animate-pulse-subtle" />
          </div>
          <p className="text-2xl font-bold text-foreground">{realtime.activeUsers.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Active Users</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-primary/10 mb-2">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{realtime.pageViews.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Page Views</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-info/10 mb-2">
            <MousePointer className="w-5 h-5 text-info" />
          </div>
          <p className="text-2xl font-bold text-foreground">{realtime.eventsPerMinute}</p>
          <p className="text-xs text-muted-foreground">Events/min</p>
        </div>
      </div>
    </DashboardCard>
  );
};

export const GA4AcquisitionWidget = () => {
  const { data, isLoading, error } = useGA4Acquisition();

  if (isLoading) {
    return (
      <DashboardCard title="Acquisition Summary" subtitle="Traffic sources breakdown">
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardCard>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
    const errorDetails = (error as any)?.details;
    const troubleshooting = (error as any)?.troubleshooting;
    return (
      <DashboardCard title="Acquisition Summary" subtitle="Traffic sources breakdown">
        <div className="flex flex-col items-center justify-center min-h-24 gap-2 text-destructive text-center px-4 py-4">
          <AlertCircle className="w-5 h-5" />
          <span className="text-xs font-medium">{errorMessage.split('\n')[0]}</span>
          {errorDetails && (
            <span className="text-xs text-muted-foreground mt-1">{errorDetails}</span>
          )}
          {troubleshooting && Array.isArray(troubleshooting) && troubleshooting.length > 0 && (
            <div className="text-xs text-muted-foreground mt-2 text-left">
              <div className="font-medium mb-1">Troubleshooting:</div>
              <ul className="list-disc list-inside space-y-0.5">
                {troubleshooting.map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DashboardCard>
    );
  }

  const acquisition = data || { organic: 0, direct: 0, referral: 0, social: 0, paid: 0, totalSessions: 0 };
  const acquisitionData = [
    { name: 'Organic', value: acquisition.organic, color: 'hsl(var(--chart-1))' },
    { name: 'Direct', value: acquisition.direct, color: 'hsl(var(--chart-2))' },
    { name: 'Referral', value: acquisition.referral, color: 'hsl(var(--chart-3))' },
    { name: 'Social', value: acquisition.social, color: 'hsl(var(--chart-4))' },
    { name: 'Paid', value: acquisition.paid, color: 'hsl(var(--chart-5))' },
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
  const { data, isLoading, error } = useGA4TopPages();

  if (isLoading) {
    return (
      <DashboardCard title="Top Pages" subtitle="Most visited pages">
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardCard>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
    const errorDetails = (error as any)?.details;
    const troubleshooting = (error as any)?.troubleshooting;
    return (
      <DashboardCard title="Top Pages" subtitle="Most visited pages">
        <div className="flex flex-col items-center justify-center min-h-24 gap-2 text-destructive text-center px-4 py-4">
          <AlertCircle className="w-5 h-5" />
          <span className="text-xs font-medium">{errorMessage.split('\n')[0]}</span>
          {errorDetails && (
            <span className="text-xs text-muted-foreground mt-1">{errorDetails}</span>
          )}
          {troubleshooting && Array.isArray(troubleshooting) && troubleshooting.length > 0 && (
            <div className="text-xs text-muted-foreground mt-2 text-left">
              <div className="font-medium mb-1">Troubleshooting:</div>
              <ul className="list-disc list-inside space-y-0.5">
                {troubleshooting.map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DashboardCard>
    );
  }

  const topPages = data || [];

  return (
    <DashboardCard title="Top Pages" subtitle="Most visited pages">
      <div className="space-y-3">
        {topPages.slice(0, 5).map((page, index) => (
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
  const { data, isLoading, error } = useGA4Events();

  if (isLoading) {
    return (
      <DashboardCard title="Events Summary" subtitle="Top events by count">
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardCard>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
    const errorDetails = (error as any)?.details;
    const troubleshooting = (error as any)?.troubleshooting;
    return (
      <DashboardCard title="Events Summary" subtitle="Top events by count">
        <div className="flex flex-col items-center justify-center min-h-24 gap-2 text-destructive text-center px-4 py-4">
          <AlertCircle className="w-5 h-5" />
          <span className="text-xs font-medium">{errorMessage.split('\n')[0]}</span>
          {errorDetails && (
            <span className="text-xs text-muted-foreground mt-1">{errorDetails}</span>
          )}
          {troubleshooting && Array.isArray(troubleshooting) && troubleshooting.length > 0 && (
            <div className="text-xs text-muted-foreground mt-2 text-left">
              <div className="font-medium mb-1">Troubleshooting:</div>
              <ul className="list-disc list-inside space-y-0.5">
                {troubleshooting.map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DashboardCard>
    );
  }

  // Handle new data structure: could be array or object
  const events = Array.isArray(data) ? data : (data?.events || []);

  return (
    <DashboardCard title="Events Summary" subtitle="Top events by count">
      <div className="space-y-3">
        {events.map((event) => (
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
  const { data, isLoading, error } = useGA4Devices();

  if (isLoading) {
    return (
      <DashboardCard title="Device Breakdown" subtitle="Users by device type">
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardCard>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
    const errorDetails = (error as any)?.details;
    const troubleshooting = (error as any)?.troubleshooting;
    return (
      <DashboardCard title="Device Breakdown" subtitle="Users by device type">
        <div className="flex flex-col items-center justify-center min-h-24 gap-2 text-destructive text-center px-4 py-4">
          <AlertCircle className="w-5 h-5" />
          <span className="text-xs font-medium">{errorMessage.split('\n')[0]}</span>
          {errorDetails && (
            <span className="text-xs text-muted-foreground mt-1">{errorDetails}</span>
          )}
          {troubleshooting && Array.isArray(troubleshooting) && troubleshooting.length > 0 && (
            <div className="text-xs text-muted-foreground mt-2 text-left">
              <div className="font-medium mb-1">Troubleshooting:</div>
              <ul className="list-disc list-inside space-y-0.5">
                {troubleshooting.map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DashboardCard>
    );
  }

  const devicesData = data || { desktop: 0, mobile: 0, tablet: 0 };
  const devices = [
    { name: 'Desktop', value: devicesData.desktop, icon: Monitor },
    { name: 'Mobile', value: devicesData.mobile, icon: Smartphone },
    { name: 'Tablet', value: devicesData.tablet, icon: Tablet },
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
  const { data, isLoading, error } = useGA4DailyUsers(7);

  if (isLoading) {
    return (
      <DashboardCard title="Daily Sessions" subtitle="Sessions over last 7 days">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardCard>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
    const errorDetails = (error as any)?.details;
    const troubleshooting = (error as any)?.troubleshooting;
    return (
      <DashboardCard title="Daily Sessions" subtitle="Sessions over last 7 days">
        <div className="flex flex-col items-center justify-center min-h-40 gap-2 text-destructive text-center px-4 py-4">
          <AlertCircle className="w-5 h-5" />
          <span className="text-xs font-medium">{errorMessage.split('\n')[0]}</span>
          {errorDetails && (
            <span className="text-xs text-muted-foreground mt-1">{errorDetails}</span>
          )}
          {troubleshooting && Array.isArray(troubleshooting) && troubleshooting.length > 0 && (
            <div className="text-xs text-muted-foreground mt-2 text-left">
              <div className="font-medium mb-1">Troubleshooting:</div>
              <ul className="list-disc list-inside space-y-0.5">
                {troubleshooting.map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DashboardCard>
    );
  }

  const dailyUsers = data || [];

  return (
    <DashboardCard title="Daily Sessions" subtitle="Sessions over last 7 days">
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyUsers}>
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
              formatter={(value: any) => [value.toLocaleString(), 'Sessions']}
              labelFormatter={(label: string) => `Date: ${label}`}
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
