'use client';

import { useEffect, useState } from 'react';
import { fetchGA4Data } from '@/lib/api';
import { getGA4Data } from '@/lib/mockData';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatCard } from '../dashboard/StatCard';
import { FileText, TrendingUp, TrendingDown, Target } from 'lucide-react';

const useGA4Data = () => {
  const [data, setData] = useState(getGA4Data());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const realData = await fetchGA4Data();
        setData(realData);
        setIsRealData(true);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setIsRealData(false);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return { data, loading, error, isRealData };
};

export const LandingPagesServiceWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading || !data?.landingPages?.servicePages) {
    return (
      <DashboardCard title="Service Pages" subtitle="Service landing pages performance">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  const servicePages = data.landingPages.servicePages;

  return (
    <DashboardCard title="Service Pages" subtitle="Service landing pages performance">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            title="Sessions"
            value={servicePages.sessions.toLocaleString()}
            trend={servicePages.sessionsTrend}
            trendValue={servicePages.sessionsTrend !== undefined ? `${servicePages.sessionsTrend > 0 ? '+' : ''}${servicePages.sessionsTrend.toFixed(1)}%` : undefined}
            icon={FileText}
          />
          <StatCard
            title="Key events"
            value={servicePages.keyEvents.toLocaleString()}
            trend={servicePages.keyEventsTrend}
            trendValue={servicePages.keyEventsTrend !== undefined ? `${servicePages.keyEventsTrend > 0 ? '+' : ''}${servicePages.keyEventsTrend.toFixed(1)}%` : undefined}
            icon={Target}
          />
          <StatCard
            title="Key Event Rate"
            value={`${servicePages.keyEventRate.toFixed(2)}%`}
            trend={servicePages.keyEventRateTrend}
            trendValue={servicePages.keyEventRateTrend !== undefined ? `${servicePages.keyEventRateTrend > 0 ? '+' : ''}${servicePages.keyEventRateTrend.toFixed(2)}%` : undefined}
            icon={Target}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground pb-3">Landing page</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Sessions</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Key events</th>
              </tr>
            </thead>
            <tbody>
              {servicePages.pages.map((page: any) => (
                <tr key={page.path} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 text-sm text-foreground font-medium">{page.path}</td>
                  <td className="py-3 text-sm text-right text-foreground">{page.sessions.toLocaleString()}</td>
                  <td className="py-3 text-sm text-right text-foreground">{page.keyEvents || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardCard>
  );
};

export const LandingPagesBlogWidget = () => {
  const { data, loading } = useGA4Data();
  
  if (loading || !data?.landingPages?.blogContent) {
    return (
      <DashboardCard title="Blog Content" subtitle="Blog landing pages performance">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  const blogContent = data.landingPages.blogContent;

  return (
    <DashboardCard title="Blog Content" subtitle="Blog landing pages performance">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            title="Sessions"
            value={blogContent.sessions.toLocaleString()}
            trend={blogContent.sessionsTrend}
            trendValue={blogContent.sessionsTrend !== undefined ? `${blogContent.sessionsTrend > 0 ? '+' : ''}${blogContent.sessionsTrend.toFixed(1)}%` : undefined}
            icon={FileText}
          />
          <StatCard
            title="Key events"
            value={blogContent.keyEvents.toLocaleString()}
            trend={blogContent.keyEventsTrend}
            trendValue={blogContent.keyEventsTrend !== undefined ? (blogContent.keyEventsTrend === 0 ? 'N/A' : `${blogContent.keyEventsTrend > 0 ? '+' : ''}${blogContent.keyEventsTrend.toFixed(1)}%`) : 'N/A'}
            icon={Target}
          />
          <StatCard
            title="Pages/Sessions"
            value={blogContent.pagesPerSession.toFixed(2)}
            trend={blogContent.pagesPerSessionTrend}
            trendValue={blogContent.pagesPerSessionTrend !== undefined ? `${blogContent.pagesPerSessionTrend > 0 ? '+' : ''}${blogContent.pagesPerSessionTrend.toFixed(1)}%` : undefined}
            icon={FileText}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground pb-3">Landing page</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Sessions</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Key events</th>
              </tr>
            </thead>
            <tbody>
              {blogContent.pages.map((page: any) => (
                <tr key={page.path} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 text-sm text-foreground font-medium">{page.path}</td>
                  <td className="py-3 text-sm text-right text-foreground">{page.sessions.toLocaleString()}</td>
                  <td className="py-3 text-sm text-right text-foreground">{page.keyEvents || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardCard>
  );
};



