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

export default function SearchConsoleDashboard() {
  return (
    <DashboardLayout title="Google Search Console">
      <div className="space-y-6 animate-fade-in">
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

