'use client';

import { useEffect, useState, useCallback } from 'react';
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
import { Users, Eye, Clock, MousePointer, RefreshCw, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AnalyticsDashboard() {
  const { connectedAccounts } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (forceRefresh: boolean = false) => {
    // Only fetch real data if GA4 is connected
    if (!connectedAccounts.ga4) {
      setLoading(false);
      setError('Please connect your Google Analytics account from the dashboard.');
      return;
    }

    try {
      if (forceRefresh) {
        setRefreshing(true);
        // Clear cache before refreshing
        const { clearCache } = await import('@/lib/cache');
        clearCache('ga4_data');
      } else {
        setLoading(true);
      }
      setError(null);
      const realData = await fetchGA4Data(forceRefresh);
      setData(realData);
      if (forceRefresh) {
        toast.success('Data refreshed successfully');
        // Force widgets to re-fetch by triggering a re-render
        window.dispatchEvent(new Event('ga4-data-refresh'));
      }
    } catch (err: any) {
      console.error('Error loading GA4 data:', err);
      const errorMessage = err.message || 'Failed to fetch GA4 data. Please check your connection and try again.';
      setError(errorMessage);
      if (forceRefresh) {
        toast.error('Failed to refresh data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [connectedAccounts.ga4]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    loadData(true);
  };

  return (
    <DashboardLayout title="Google Analytics">
      <div className="space-y-6 animate-fade-in">
        {/* Refresh Button */}
        {connectedAccounts.ga4 && (
          <div className="flex justify-end">
            <Button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        )}
        {!connectedAccounts.ga4 && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-warning">
            <p className="text-sm">Google Analytics is not connected. Please connect your account from the dashboard to see analytics data.</p>
          </div>
        )}

        {loading && connectedAccounts.ga4 && !error && (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading analytics data...</p>
          </div>
        )}
        
        {error && connectedAccounts.ga4 && !loading && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
            <p className="text-sm font-medium">Error loading data:</p>
            <p className="text-sm mt-1">{error}</p>
            {error.includes('quota') && (
              <div className="mt-3 p-3 bg-background rounded border border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Quota Limit Reached:</strong> Google Analytics API has rate limits to prevent abuse. 
                  The quota will refresh automatically in under an hour. Please try again later.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Only show widgets if not loading and no error, or if widgets handle their own loading states */}
        {(!loading || connectedAccounts.ga4) && (
          <>
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

