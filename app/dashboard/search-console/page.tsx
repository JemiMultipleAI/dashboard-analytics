'use client';

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

export default function SearchConsoleDashboard() {
  const { connectedAccounts } = useApp();
  
  return (
    <DashboardLayout title="Google Search Console">
      <div className="space-y-6 animate-fade-in">
        {!connectedAccounts.gsc && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-warning">
            <p className="text-sm">⚠️ Google Search Console is not connected. Showing mock data. Connect your account to see real data.</p>
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

