'use client';

import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  AdsOverviewWidget,
  AdsCampaignsWidget,
  AdsAdGroupsWidget,
  AdsDeviceBreakdownWidget,
  AdsKeywordsWidget,
  AdsRecommendationsWidget,
  AdsSpendChartWidget,
} from '@/components/widgets/AdsWidgets';
import { useApp } from '@/contexts/AppContext';
import { DateRangePicker } from '@/components/dashboard/DateRangePicker';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { fetchAdsData } from '@/lib/api';
import { toast } from 'sonner';

export default function AdsDashboard() {
  const { connectedAccounts } = useApp();
  
  // Default to last 30 days
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: defaultStartDate,
    to: defaultEndDate,
  });
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!connectedAccounts.ads || !dateRange?.from || !dateRange?.to) {
      return;
    }

    try {
      setRefreshing(true);
      // Clear cache before refreshing
      const { clearCache } = await import('@/lib/cache');
      const dateRangeKey = `${dateRange.from.toISOString().split('T')[0]}_${dateRange.to.toISOString().split('T')[0]}`;
      clearCache(`ads_data_${dateRangeKey}`);
      clearCache('ads_data_default'); // Also clear default cache
      
      await fetchAdsData(dateRange.from, dateRange.to, true);
      toast.success('Data refreshed successfully');
      // Force widgets to re-fetch by triggering a re-render
      window.dispatchEvent(new Event('ads-data-refresh'));
    } catch (err: any) {
      console.error('Error refreshing Ads data:', err);
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };
  
  return (
    <DashboardLayout title="Google Ads">
      <div className="space-y-6 animate-fade-in">
        {!connectedAccounts.ads && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-warning">
            <p className="text-sm">Google Ads is not connected. Please connect your account from the dashboard to see Google Ads data.</p>
          </div>
        )}

        {/* Date Range Picker and Refresh Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Google Ads Performance</h2>
            <p className="text-sm text-muted-foreground mt-1">Select a date range to view performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            {connectedAccounts.ads && (
              <Button
                onClick={handleRefresh}
                disabled={refreshing || !dateRange?.from || !dateRange?.to}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            )}
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
        </div>

        {/* Error message will be shown by widgets if there's an API error */}
        
        {/* Overview Stats */}
        <AdsOverviewWidget dateRange={dateRange} />

        {/* Campaign and Ad Group Performance */}
        <div className="grid grid-cols-1 gap-5">
          <AdsCampaignsWidget dateRange={dateRange} />
        </div>

        <div className="grid grid-cols-1 gap-5">
          <AdsAdGroupsWidget dateRange={dateRange} />
        </div>

        {/* Device Breakdown and Other Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AdsDeviceBreakdownWidget dateRange={dateRange} />
          <AdsSpendChartWidget dateRange={dateRange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AdsKeywordsWidget dateRange={dateRange} />
          <AdsRecommendationsWidget dateRange={dateRange} />
        </div>
      </div>
    </DashboardLayout>
  );
}

