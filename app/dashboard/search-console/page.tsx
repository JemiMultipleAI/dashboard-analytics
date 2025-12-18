'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  GSCOverviewWidget,
  GSCQueriesWidget,
  GSCPagesWidget,
  GSCIndexingWidget,
  GSCVitalsWidget,
  GSCClicksChartWidget,
} from '@/components/widgets/GSCWidgets';
import { useApp } from '@/contexts/AppContext';
import { fetchGSCData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function SearchConsoleDashboard() {
  const { connectedAccounts } = useApp();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (forceRefresh: boolean = false) => {
    // Only fetch real data if GSC is connected
    if (!connectedAccounts.gsc) {
      setLoading(false);
      return;
    }

    try {
      if (forceRefresh) {
        setRefreshing(true);
        // Clear cache before refreshing
        const { clearCache } = await import('@/lib/cache');
        clearCache('gsc_data');
      } else {
        setLoading(true);
      }
      setError(null);
      await fetchGSCData(forceRefresh);
      console.log('✅ Loaded real GSC data');
      if (forceRefresh) {
        toast.success('Data refreshed successfully');
        // Force widgets to re-fetch by triggering a re-render
        window.dispatchEvent(new Event('gsc-data-refresh'));
      }
    } catch (err: any) {
      console.error('❌ Error loading GSC data:', err);
      setError(err.message);
      if (forceRefresh) {
        toast.error('Failed to refresh data');
      }
      // Keep using mock data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [connectedAccounts.gsc]);

  const handleRefresh = () => {
    loadData(true);
  };
  
  return (
    <DashboardLayout title="Google Search Console">
      <div className="space-y-6 animate-fade-in">
        {/* Refresh Button */}
        {connectedAccounts.gsc && (
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
        {!connectedAccounts.gsc && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-warning">
            <p className="text-sm">⚠️ Google Search Console is not connected. Showing mock data. Connect your account to see real data.</p>
          </div>
        )}
        
        {error && connectedAccounts.gsc && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
            <p className="text-sm font-medium">❌ Error loading data:</p>
            <p className="text-sm mt-1">{error}</p>
            {error.includes('Access denied') && (
              <div className="mt-3 p-3 bg-background rounded border border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Quick Fix:</strong> Go to Google Cloud Console → APIs & Services → Library → 
                  Search for "Google Search Console API" → Click Enable. Wait 2-3 minutes and refresh.
                </p>
              </div>
            )}
            {error.includes('quota') && (
              <div className="mt-3 p-3 bg-background rounded border border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Quota Limit:</strong> Google APIs have rate limits. The quota will reset automatically 
                  in under an hour. You can continue using mock data in the meantime.
                </p>
              </div>
            )}
          </div>
        )}

        {loading && connectedAccounts.gsc && (
          <div className="text-center py-4 text-muted-foreground">
            <p>Loading real-time analytics data...</p>
          </div>
        )}
        
        {/* Overview Stats */}
        <GSCOverviewWidget />

        {/* Main Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <GSCQueriesWidget />
          <GSCPagesWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <GSCIndexingWidget />
          <GSCVitalsWidget />
        </div>

        {/* Chart */}
        <div className="grid grid-cols-1 gap-5">
          <GSCClicksChartWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}

