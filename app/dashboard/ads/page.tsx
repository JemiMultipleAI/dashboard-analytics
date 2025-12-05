'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  AdsOverviewWidget,
  AdsCampaignsWidget,
  AdsKeywordsWidget,
  AdsRecommendationsWidget,
  AdsSpendChartWidget,
} from '@/components/widgets/AdsWidgets';

export default function AdsDashboard() {
  return (
    <DashboardLayout title="Google Ads">
      <div className="space-y-6 animate-fade-in">
        {/* Overview Stats */}
        <AdsOverviewWidget />

        {/* Main Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AdsCampaignsWidget />
          <AdsKeywordsWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AdsRecommendationsWidget />
          <AdsSpendChartWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}

