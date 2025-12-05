import { getAdsData } from '@/lib/mockData';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatCard } from '../dashboard/StatCard';
import { DollarSign, TrendingUp, Target, Zap, Lightbulb, Play, Pause } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const data = getAdsData();

export const AdsOverviewWidget = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      title="Total Spend"
      value={`$${data.overview.totalSpend.toLocaleString()}`}
      trend={data.overview.spendTrend}
      icon={DollarSign}
    />
    <StatCard
      title="Conversions"
      value={data.overview.totalConversions.toLocaleString()}
      trend={data.overview.conversionsTrend}
      icon={Target}
    />
    <StatCard
      title="Avg. CPC"
      value={`$${data.overview.avgCPC}`}
      icon={TrendingUp}
    />
    <StatCard
      title="ROAS"
      value={`${data.overview.roas}x`}
      icon={Zap}
    />
  </div>
);

export const AdsCampaignsWidget = () => (
  <DashboardCard title="Campaign Performance" subtitle="Active and paused campaigns">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-medium text-muted-foreground pb-3">Campaign</th>
            <th className="text-right text-xs font-medium text-muted-foreground pb-3">Spend</th>
            <th className="text-right text-xs font-medium text-muted-foreground pb-3">Clicks</th>
            <th className="text-right text-xs font-medium text-muted-foreground pb-3">Conv.</th>
            <th className="text-right text-xs font-medium text-muted-foreground pb-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.campaigns.map((campaign) => (
            <tr key={campaign.name} className="border-b border-border/50 last:border-0">
              <td className="py-3 text-sm text-foreground">{campaign.name}</td>
              <td className="py-3 text-sm text-right text-foreground">${campaign.spend.toLocaleString()}</td>
              <td className="py-3 text-sm text-right text-foreground">{campaign.clicks.toLocaleString()}</td>
              <td className="py-3 text-sm text-right text-foreground">{campaign.conversions}</td>
              <td className="py-3 text-right">
                <Badge
                  variant={campaign.status === 'active' ? 'default' : 'secondary'}
                  className={cn(
                    'text-xs',
                    campaign.status === 'active' && 'bg-success text-success-foreground'
                  )}
                >
                  {campaign.status === 'active' ? (
                    <><Play className="w-3 h-3 mr-1" /> Active</>
                  ) : (
                    <><Pause className="w-3 h-3 mr-1" /> Paused</>
                  )}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardCard>
);

export const AdsKeywordsWidget = () => (
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

export const AdsRecommendationsWidget = () => {
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

export const AdsSpendChartWidget = () => (
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
