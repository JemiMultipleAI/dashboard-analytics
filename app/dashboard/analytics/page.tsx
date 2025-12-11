'use client';

import { useEffect, useState } from 'react';
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
import { fetchGA4Data } from '@/lib/api';
import { getGA4Data } from '@/lib/mockData';
import { Users, Eye, Clock, MousePointer } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function AnalyticsDashboard() {
  const { connectedAccounts } = useApp();
  const [data, setData] = useState(getGA4Data());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // Only fetch real data if GA4 is connected
      if (!connectedAccounts.ga4) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const realData = await fetchGA4Data();
        setData(realData);
        console.log('✅ Loaded real GA4 data:', realData);
      } catch (err: any) {
        console.error('❌ Error loading GA4 data:', err);
        setError(err.message);
        // Keep using mock data on error
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [connectedAccounts.ga4]);

  return (
    <DashboardLayout title="Google Analytics">
      <div className="space-y-6 animate-fade-in">
        {!connectedAccounts.ga4 && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-warning">
            <p className="text-sm">⚠️ Google Analytics is not connected. Showing mock data. Connect your account to see real analytics.</p>
          </div>
        )}
        
        {error && connectedAccounts.ga4 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
            <p className="text-sm">❌ Error loading data: {error}</p>
          </div>
        )}

        {loading && connectedAccounts.ga4 && (
          <div className="text-center py-4 text-muted-foreground">
            <p>Loading real-time analytics data...</p>
          </div>
        )}

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

