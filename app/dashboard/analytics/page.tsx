'use client';

import React from 'react';
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
import { useGA4Realtime, useGA4Acquisition, useGA4Events } from '@/hooks/useGA4Data';
import { Users, Eye, Users as SessionsIcon, MousePointer, Loader2 } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { data: realtimeData, isLoading: isLoadingRealtime } = useGA4Realtime();
  const { data: acquisitionData, isLoading: isLoadingAcquisition } = useGA4Acquisition();
  const { data: eventsData, isLoading: isLoadingEvents } = useGA4Events();
  
  const isLoading = isLoadingRealtime || isLoadingAcquisition || isLoadingEvents;

  return (
    <DashboardLayout title="Unified Marketing Hub">
      <div className="space-y-6 animate-fade-in">

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-center h-24 border rounded-lg">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ))}
            </>
          ) : (
            <>
              <StatCard
                title="Active Users"
                value={realtimeData?.activeUsers.toLocaleString() || '0'}
                icon={Users}
              />
              <StatCard
                title="Page Views"
                value={realtimeData?.pageViews.toLocaleString() || '0'}
                icon={Eye}
              />
              <StatCard
                title="Total Sessions"
                value={acquisitionData?.totalSessions?.toLocaleString() || '0'}
                icon={SessionsIcon}
              />
              <StatCard
                title="Total Events"
                value={Array.isArray(eventsData) 
                  ? eventsData.reduce((sum, event) => sum + (event.count || 0), 0).toLocaleString()
                  : ((eventsData as any)?.totalEvents?.toLocaleString() || '0')}
                icon={MousePointer}
              />
            </>
          )}
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

