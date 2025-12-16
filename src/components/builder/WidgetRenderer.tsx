import { WidgetType } from '@/lib/mockData';
import {
  GA4RealtimeWidget,
  GA4AcquisitionWidget,
  GA4TopPagesWidget,
  GA4EventsWidget,
  GA4DevicesWidget,
  GA4DailyUsersWidget,
} from '../widgets/GA4Widgets';
import {
  KeyEventsSummaryWidget,
  KeyEventsTrendWidget,
  KeyEventsBySourceWidget,
  KeyEventBreakdownWidget,
} from '../widgets/KeyEventsWidgets';
import {
  LandingPagesServiceWidget,
  LandingPagesBlogWidget,
} from '../widgets/LandingPagesWidgets';
import {
  AudienceByStateWidget,
  AudienceAgeWidget,
  AudienceGenderWidget,
  AudienceLocationEventsWidget,
} from '../widgets/AudienceWidgets';
import {
  TrafficSourceWidget,
  SessionsTrendWidget,
  OrganicSessionsTrendWidget,
} from '../widgets/TrafficWidgets';
import {
  GSCQueriesWidget,
  GSCPagesWidget,
  GSCIndexingWidget,
  GSCVitalsWidget,
  GSCClicksChartWidget,
} from '../widgets/GSCWidgets';
import { KeywordPositionsWidget } from '../widgets/KeywordPositionsWidget';
import { GSCImpressionsChartWidget } from '../widgets/GSCImpressionsWidget';
import {
  AdsCampaignsWidget,
  AdsKeywordsWidget,
  AdsRecommendationsWidget,
  AdsSpendChartWidget,
} from '../widgets/AdsWidgets';
import { StatCard } from '../dashboard/StatCard';
import { MousePointer, Eye, DollarSign, Target } from 'lucide-react';
import { getGSCData, getAdsData } from '@/lib/mockData';

interface WidgetRendererProps {
  type: WidgetType;
}

export const WidgetRenderer = ({ type }: WidgetRendererProps) => {
  const gscData = getGSCData();
  const adsData = getAdsData();

  switch (type) {
    // GA4 Widgets
    case 'ga4-realtime':
      return <GA4RealtimeWidget />;
    case 'ga4-acquisition':
      return <GA4AcquisitionWidget />;
    case 'ga4-top-pages':
      return <GA4TopPagesWidget />;
    case 'ga4-events':
      return <GA4EventsWidget />;
    case 'ga4-devices':
      return <GA4DevicesWidget />;
    case 'ga4-daily-users':
      return <GA4DailyUsersWidget />;
    case 'ga4-key-events-summary':
      return <KeyEventsSummaryWidget />;
    case 'ga4-key-events-trend':
      return <KeyEventsTrendWidget />;
    case 'ga4-key-events-source':
      return <KeyEventsBySourceWidget />;
    case 'ga4-key-events-breakdown':
      return <KeyEventBreakdownWidget />;
    case 'ga4-landing-pages':
      return (
        <div className="space-y-4">
          <LandingPagesServiceWidget />
          <LandingPagesBlogWidget />
        </div>
      );
    case 'ga4-traffic-source':
      return <TrafficSourceWidget />;
    case 'ga4-sessions-trend':
      return <SessionsTrendWidget />;
    case 'ga4-organic-sessions-trend':
      return <OrganicSessionsTrendWidget />;
    case 'ga4-audience-geography':
      return <AudienceByStateWidget />;
    case 'ga4-audience-age':
      return <AudienceAgeWidget />;
    case 'ga4-audience-gender':
      return <AudienceGenderWidget />;
    case 'ga4-audience-location-events':
      return <AudienceLocationEventsWidget />;

    // GSC Widgets
    case 'gsc-overview':
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Total Clicks"
            value={gscData.overview.totalClicks.toLocaleString()}
            icon={MousePointer}
          />
          <StatCard
            title="Impressions"
            value={gscData.overview.totalImpressions.toLocaleString()}
            icon={Eye}
          />
        </div>
      );
    case 'gsc-queries':
      return <GSCQueriesWidget />;
    case 'gsc-pages':
      return <GSCPagesWidget />;
    case 'gsc-indexing':
      return <GSCIndexingWidget />;
    case 'gsc-vitals':
      return <GSCVitalsWidget />;
    case 'gsc-clicks-chart':
      return <GSCClicksChartWidget />;
    case 'gsc-keyword-positions':
      return <KeywordPositionsWidget />;
    case 'gsc-impressions-chart':
      return <GSCImpressionsChartWidget />;

    // Ads Widgets
    case 'ads-overview':
      return (
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Total Spend"
            value={`$${adsData.overview.totalSpend.toLocaleString()}`}
            icon={DollarSign}
          />
          <StatCard
            title="Conversions"
            value={adsData.overview.totalConversions.toLocaleString()}
            icon={Target}
          />
        </div>
      );
    case 'ads-campaigns':
      return <AdsCampaignsWidget />;
    case 'ads-keywords':
      return <AdsKeywordsWidget />;
    case 'ads-recommendations':
      return <AdsRecommendationsWidget />;
    case 'ads-spend-chart':
      return <AdsSpendChartWidget />;

    default:
      return (
        <div className="p-4 text-center text-muted-foreground">
          Widget not found
        </div>
      );
  }
};
