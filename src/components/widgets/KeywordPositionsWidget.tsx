'use client';

import { useEffect, useState } from 'react';
import { fetchGSCData } from '@/lib/api';
import { getGSCData } from '@/lib/mockData';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatCard } from '../dashboard/StatCard';
import { List, TrendingUp, TrendingDown, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

const useGSCData = () => {
  const [data, setData] = useState(getGSCData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const realData = await fetchGSCData();
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

export const KeywordPositionsWidget = () => {
  const { data, loading } = useGSCData();
  
  if (loading || !data?.keywordPositions) {
    return (
      <DashboardCard title="Keyword Positions" subtitle="Keyword ranking positions">
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-secondary/50 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-secondary/50 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardCard>
    );
  }

  const positions = data.keywordPositions;

  return (
    <DashboardCard title="Keyword Positions" subtitle="Keyword ranking positions">
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Focus Keywords"
            value={positions.focusKeywords.toLocaleString()}
            icon={List}
          />
          <StatCard
            title="Average Position"
            value={positions.averagePosition.toFixed(1)}
            trend={positions.averagePositionTrend}
            trendValue={positions.averagePositionTrend !== undefined ? `${positions.averagePositionTrend > 0 ? '↑' : '↓'} ${Math.abs(positions.averagePositionTrend).toFixed(1)}` : undefined}
            icon={Hash}
          />
          <StatCard
            title="Keywords on First Page"
            value={positions.keywordsOnFirstPage.toLocaleString()}
            trend={positions.keywordsOnFirstPageTrend}
            trendValue={positions.keywordsOnFirstPageTrend !== undefined ? `${positions.keywordsOnFirstPageTrend > 0 ? '+' : ''}${positions.keywordsOnFirstPageTrend.toFixed(1)}` : '0.0'}
            icon={TrendingUp}
          />
          <StatCard
            title="Total Ranking Keywords"
            value={positions.totalRankingKeywords.toLocaleString()}
            trend={positions.totalRankingKeywordsTrend}
            trendValue={positions.totalRankingKeywordsTrend !== undefined ? `${positions.totalRankingKeywordsTrend > 0 ? '+' : ''}${positions.totalRankingKeywordsTrend}` : undefined}
            icon={List}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground pb-3">Keyword</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Volume</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Position</th>
                <th className="text-right text-xs font-medium text-muted-foreground pb-3">Δ</th>
              </tr>
            </thead>
            <tbody>
              {positions.keywords.map((keyword: any) => (
                <tr key={keyword.keyword} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 text-sm text-foreground font-medium">{keyword.keyword}</td>
                  <td className="py-3 text-sm text-right text-foreground">{keyword.volume.toLocaleString()}</td>
                  <td className="py-3 text-sm text-right text-foreground">{keyword.position}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {keyword.delta > 0 && <TrendingUp className="w-4 h-4 text-success" />}
                      {keyword.delta < 0 && <TrendingDown className="w-4 h-4 text-destructive" />}
                      {keyword.delta === 0 && <span className="w-4 h-4 text-muted-foreground">—</span>}
                      <span
                        className={cn(
                          'text-sm font-medium',
                          keyword.delta > 0 && 'text-success',
                          keyword.delta < 0 && 'text-destructive',
                          keyword.delta === 0 && 'text-muted-foreground'
                        )}
                      >
                        {keyword.delta > 0 ? '+' : ''}{keyword.delta}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardCard>
  );
};



