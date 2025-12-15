'use client';

import { useEffect, useState } from 'react';
import { fetchAdsData } from '@/lib/api';
import { getAdsData } from '@/lib/mockData';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatCard } from '../dashboard/StatCard';
import { DollarSign, TrendingUp, Target, Zap, Lightbulb, Play, Pause, MousePointer, Monitor, Smartphone, Tablet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';

interface UseAdsDataProps {
  dateRange?: DateRange;
}

const useAdsData = ({ dateRange }: UseAdsDataProps = {}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);
  const [isMockData, setIsMockData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsMockData(false);
        console.log('🔄 Fetching real Google Ads data...');
        
        const startDate = dateRange?.from;
        const endDate = dateRange?.to;
        
        const realData = await fetchAdsData(startDate, endDate);
        console.log('✅ Received real Google Ads data:', realData);
        
        // Check if API returned an error
        if (realData.error) {
          // Fall back to mock data for testing
          console.warn('⚠️ API returned error, using mock data for testing:', realData.error);
          const mockData = getAdsData();
          setData(mockData);
          setIsRealData(false);
          setIsMockData(true);
          setError(realData.error); // Keep error for user awareness
        } else {
          setData(realData);
          setIsRealData(true);
          setIsMockData(false);
          setError(null);
        }
      } catch (err: any) {
        // Fall back to mock data for testing when API fails
        console.warn('⚠️ Error fetching Google Ads data, using mock data for testing:', err.message);
        const mockData = getAdsData();
        setData(mockData);
        setIsRealData(false);
        setIsMockData(true);
        setError(err.message); // Keep error for user awareness
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dateRange?.from, dateRange?.to]);

  return { data, loading, error, isRealData, isMockData };
};

interface AdsWidgetsProps {
  dateRange?: DateRange;
}

export const AdsOverviewWidget = ({ dateRange }: AdsWidgetsProps) => {
  const { data, loading, error, isRealData, isMockData } = useAdsData({ dateRange });
  
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
            <div className="h-4 bg-secondary rounded w-20 mb-3"></div>
            <div className="h-8 bg-secondary rounded w-24 mb-2"></div>
            <div className="h-4 bg-secondary rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
        <p className="text-sm font-medium">❌ Error loading Google Ads data:</p>
        <p className="text-xs mt-1">{error || 'No data available'}</p>
        {error?.includes('Not authenticated') && (
          <p className="text-xs mt-2">Please connect your Google Ads account from the dashboard.</p>
        )}
      </div>
    );
  }
  
  return (
    <>
      {isRealData && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-2 text-success mb-4 text-xs">
          ✅ Showing real Google Ads data
        </div>
      )}
      {isMockData && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-2 text-warning mb-4 text-xs">
          🧪 Showing mock data for testing. {error && <span className="ml-1">({error})</span>}
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Clicks"
          value={data.overview.clicks?.toLocaleString() || '0'}
          trend={data.overview.clicksTrend}
          trendValue={data.overview.clicksTrend !== undefined ? `${data.overview.clicksTrend > 0 ? '+' : ''}${data.overview.clicksTrend.toFixed(1)}%` : undefined}
          icon={MousePointer}
        />
        <StatCard
          title="Conversions"
          value={data.overview.conversions?.toLocaleString() || data.overview.totalConversions?.toLocaleString() || '0'}
          trend={data.overview.conversionsTrend}
          trendValue={data.overview.conversionsTrend !== undefined ? `${data.overview.conversionsTrend > 0 ? '+' : ''}${data.overview.conversionsTrend.toFixed(1)}%` : 'N/A'}
          icon={Target}
        />
        <StatCard
          title="Cost"
          value={`$${data.overview.cost?.toLocaleString() || data.overview.totalSpend?.toLocaleString() || '0.00'}`}
          trend={data.overview.costTrend}
          trendValue={data.overview.costTrend !== undefined ? `${data.overview.costTrend > 0 ? '+' : ''}$${Math.abs(data.overview.costTrend).toFixed(2)}` : undefined}
          icon={DollarSign}
        />
        <StatCard
          title="Cost / conv."
          value={`$${data.overview.costPerConversion ? data.overview.costPerConversion.toFixed(2) : '0.00'}`}
          trend={data.overview.costPerConversionTrend}
          trendValue={data.overview.costPerConversionTrend !== undefined ? `${data.overview.costPerConversionTrend > 0 ? '+' : ''}$${Math.abs(data.overview.costPerConversionTrend).toFixed(2)}` : '$0.00'}
          icon={TrendingUp}
        />
      </div>
    </>
  );
};

export const AdsCampaignsWidget = ({ dateRange }: AdsWidgetsProps) => {
  const { data, loading } = useAdsData({ dateRange });
  
  if (loading) {
    return (
      <DashboardCard title="Campaign Performance" subtitle="Active and paused campaigns">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }
  
  if (!data) {
    return (
      <DashboardCard title="Campaign Performance" subtitle="Active and paused campaigns">
        <div className="py-8 text-center text-sm text-muted-foreground">
          No data available
        </div>
      </DashboardCard>
    );
  }
  
  return (
    <DashboardCard title="Campaign Performance" subtitle="Active and paused campaigns">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground pb-3">Campaign</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Impressions</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Clicks</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">CTR</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Cost</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Avg. CPC</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Conversions</th>
            </tr>
          </thead>
          <tbody>
            {data.campaigns && data.campaigns.length > 0 ? (
              data.campaigns.map((campaign: any) => (
                <tr key={campaign.name} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 text-sm text-foreground font-medium">{campaign.name}</td>
                  <td className="py-3 text-sm text-right text-foreground">{campaign.impressions?.toLocaleString() || '0'}</td>
                  <td className="py-3 text-sm text-right text-foreground">{campaign.clicks.toLocaleString()}</td>
                  <td className="py-3 text-sm text-right text-foreground">{campaign.ctr ? `${campaign.ctr.toFixed(2)}%` : '0.00%'}</td>
                  <td className="py-3 text-sm text-right text-foreground font-medium">${campaign.spend.toLocaleString()}</td>
                  <td className="py-3 text-sm text-right text-foreground">${campaign.avgCPC ? campaign.avgCPC.toFixed(2) : '0.00'}</td>
                  <td className="py-3 text-sm text-right text-foreground">{campaign.conversions || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No campaign data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export const AdsKeywordsWidget = ({ dateRange }: AdsWidgetsProps) => {
  const { data, loading } = useAdsData({ dateRange });
  
  if (loading || !data) {
    return (
      <DashboardCard title="Keyword Performance" subtitle="Top performing keywords">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }
  
  return (
    <DashboardCard title="Keyword Performance" subtitle="Top performing keywords">
      <div className="space-y-3">
        {data.keywords.map((keyword) => (
          <div key={keyword.keyword} className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-foreground">{keyword.keyword}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{keyword.clicks.toLocaleString()} clicks</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">${keyword.cpc} CPC</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{keyword.conversions} conv.</p>
              <div className="flex items-center gap-1 justify-end mt-1">
                <span className="text-xs text-muted-foreground">Quality:</span>
                <span
                  className={cn(
                    'text-xs font-medium',
                    keyword.quality >= 8 && 'text-success',
                    keyword.quality >= 5 && keyword.quality < 8 && 'text-warning',
                    keyword.quality < 5 && 'text-destructive'
                  )}
                >
                  {keyword.quality}/10
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export const AdsRecommendationsWidget = ({ dateRange }: AdsWidgetsProps) => {
  const { data, loading } = useAdsData({ dateRange });
  
  if (loading || !data) {
    return (
      <DashboardCard title="Recommendations" subtitle="Optimization suggestions">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }
  const getImpactColor = (impact: string) => {
    if (impact === 'high') return 'bg-success/10 text-success border-success/20';
    if (impact === 'medium') return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <DashboardCard title="Recommendations" subtitle="Optimization suggestions">
      <div className="space-y-3">
        {data.recommendations.map((rec, index) => (
          <div key={index} className="p-3 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{rec.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={cn('text-xs border', getImpactColor(rec.impact))}>
                    {rec.impact} impact
                  </Badge>
                  <span className="text-xs text-success font-medium">{rec.potential}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export const AdsAdGroupsWidget = ({ dateRange }: AdsWidgetsProps) => {
  const { data, loading } = useAdsData({ dateRange });
  
  if (loading) {
    return (
      <DashboardCard title="Ad Group Performance" subtitle="Top performing ad groups">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }
  
  if (!data) {
    return (
      <DashboardCard title="Ad Group Performance" subtitle="Top performing ad groups">
        <div className="py-8 text-center text-sm text-muted-foreground">
          No data available
        </div>
      </DashboardCard>
    );
  }
  
  return (
    <DashboardCard title="Ad Group Performance" subtitle="Top performing ad groups">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground pb-3">Ad group</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Impressions</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Clicks</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">CTR</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Cost</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Avg. CPC</th>
              <th className="text-right text-xs font-medium text-muted-foreground pb-3">Conversions</th>
            </tr>
          </thead>
          <tbody>
            {data.adGroups && data.adGroups.length > 0 ? (
              data.adGroups.map((adGroup: any) => (
                <tr key={adGroup.name} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 text-sm text-foreground font-medium">{adGroup.name}</td>
                  <td className="py-3 text-sm text-right text-foreground">{adGroup.impressions?.toLocaleString() || '0'}</td>
                  <td className="py-3 text-sm text-right text-foreground">{adGroup.clicks.toLocaleString()}</td>
                  <td className="py-3 text-sm text-right text-foreground">{adGroup.ctr ? `${adGroup.ctr.toFixed(2)}%` : '0.00%'}</td>
                  <td className="py-3 text-sm text-right text-foreground font-medium">${adGroup.spend.toLocaleString()}</td>
                  <td className="py-3 text-sm text-right text-foreground">${adGroup.avgCPC ? adGroup.avgCPC.toFixed(2) : '0.00'}</td>
                  <td className="py-3 text-sm text-right text-foreground">{adGroup.conversions || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No ad group data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};

export const AdsDeviceBreakdownWidget = ({ dateRange }: AdsWidgetsProps) => {
  const { data, loading } = useAdsData({ dateRange });
  
  if (loading) {
    return (
      <DashboardCard title="Google Ads Device Breakdown" subtitle="Performance by device type">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-secondary/50 rounded animate-pulse"></div>
          ))}
        </div>
      </DashboardCard>
    );
  }
  
  if (!data) {
    return (
      <DashboardCard title="Google Ads Device Breakdown" subtitle="Performance by device type">
        <div className="py-8 text-center text-sm text-muted-foreground">
          No data available
        </div>
      </DashboardCard>
    );
  }
  
  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mobile')) return Smartphone;
    if (device.toLowerCase().includes('tablet')) return Tablet;
    return Monitor;
  };
  
  return (
    <DashboardCard title="Google Ads Device Breakdown" subtitle="Performance by device type">
      <div className="space-y-4">
        {data.devices && data.devices.length > 0 ? (
          data.devices.map((device: any) => {
            const DeviceIcon = getDeviceIcon(device.device);
            return (
              <div key={device.device} className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DeviceIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{device.device}</p>
                      <p className="text-xs text-muted-foreground">{device.percentage}% of traffic</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">${device.spend.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{device.conversions} conversions</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Impressions</p>
                    <p className="text-foreground font-medium mt-1">{device.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Clicks</p>
                    <p className="text-foreground font-medium mt-1">{device.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CTR</p>
                    <p className="text-foreground font-medium mt-1">{device.ctr ? `${device.ctr.toFixed(2)}%` : '0.00%'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg. CPC</p>
                    <p className="text-foreground font-medium mt-1">${device.avgCPC ? device.avgCPC.toFixed(2) : '0.00'}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No device data available
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export const AdsSpendChartWidget = ({ dateRange }: AdsWidgetsProps) => {
  const { data, loading } = useAdsData({ dateRange });
  
  if (loading || !data) {
    return (
      <DashboardCard title="Spend Over Time" subtitle="Daily ad spend">
        <div className="h-40 bg-secondary/50 rounded animate-pulse"></div>
      </DashboardCard>
    );
  }
  
  return (
    <DashboardCard title="Spend Over Time" subtitle="Daily ad spend">
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.spendOverTime}>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`$${value}`, 'Spend']}
            />
            <Bar dataKey="spend" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};
