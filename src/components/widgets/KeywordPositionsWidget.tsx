'use client';

import { useEffect, useState } from 'react';
import { fetchGSCData } from '@/lib/api';
import { DashboardCard } from '../dashboard/DashboardCard';
import { StatCard } from '../dashboard/StatCard';
import { List, TrendingUp, TrendingDown, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

const useGSCData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const realData = await fetchGSCData();
        setData(realData);
      } catch (err: any) {
        console.error('Error loading GSC data:', err);
        setError(err.message || 'Failed to load Search Console data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return { data, loading, error };
};

export const KeywordPositionsWidget = () => {
  const { data, loading, error } = useGSCData();
  
  if (loading) {
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

  if (error || !data?.keywordPositions) {
    return (
      <DashboardCard title="Keyword Positions" subtitle="Keyword ranking positions">
        <div className="py-8 text-center text-sm text-muted-foreground">
          {error || 'No data available'}
        </div>
      </DashboardCard>
    );
  }
  
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



