'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  GA4RealtimeWidget,
  GA4AcquisitionWidget,
  GA4TopPagesWidget,
  GA4EventsWidget,
  GA4DevicesWidget,
  GA4DailyUsersWidget,
} from '@/components/widgets/GA4Widgets';
import { StatCard } from '@/components/dashboard/StatCard';
import { getGA4Data } from '@/lib/mockData';
import { Users, Eye, Clock, MousePointer } from 'lucide-react';

export default function AnalyticsDashboard() {
  const data = getGA4Data();

  return (
    <DashboardLayout title="Google Analytics">
      <div className="space-y-6 animate-fade-in">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Active Users"
            value={data.realtime.activeUsers.toLocaleString()}
            trend={12}
            icon={Users}
          />
          <StatCard
            title="Page Views"
            value={data.realtime.pageViews.toLocaleString()}
            trend={8}
            icon={Eye}
          />
          <StatCard
            title="Avg. Session"
            value="2m 34s"
            trend={-3}
            icon={Clock}
          />
          <StatCard
            title="Events/min"
            value={data.realtime.eventsPerMinute.toString()}
            trend={15}
            icon={MousePointer}
          />
        </div>

        {/* Main Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <GA4RealtimeWidget />
          <GA4AcquisitionWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <GA4TopPagesWidget />
          <GA4EventsWidget />
          <GA4DevicesWidget />
        </div>

        {/* Chart */}
        <div className="grid grid-cols-1 gap-5">
          <GA4DailyUsersWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}

