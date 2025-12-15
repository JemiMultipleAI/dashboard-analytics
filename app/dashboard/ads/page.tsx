'use client';

import { useState } from 'react';
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
  
  return (
    <DashboardLayout title="Google Ads">
      <div className="space-y-6 animate-fade-in">
        {!connectedAccounts.ads && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-warning">
            <p className="text-sm">⚠️ Google Ads is not connected. Showing mock data for testing. Connect your account to see real data.</p>
          </div>
        )}

        {/* Date Range Picker */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Google Ads Performance</h2>
            <p className="text-sm text-muted-foreground mt-1">Select a date range to view performance metrics</p>
          </div>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
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

