import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendValue?: string | number; // Optional absolute change value (e.g., "-$39.74" or "+23")
  icon?: LucideIcon;
  className?: string;
}

export const StatCard = ({ title, value, trend, trendValue, icon: Icon, className }: StatCardProps) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {(trend !== undefined || trendValue !== undefined) && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && <TrendingUp className="w-4 h-4 text-success" />}
              {isNegative && <TrendingDown className="w-4 h-4 text-destructive" />}
              {!isPositive && !isNegative && trend !== undefined && (
                <span className="w-4 h-4 text-muted-foreground">—</span>
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive && 'text-success',
                  isNegative && 'text-destructive',
                  !isPositive && !isNegative && 'text-muted-foreground'
                )}
              >
                {trendValue !== undefined ? (
                  trendValue
                ) : trend !== undefined ? (
                  <>
                    {isPositive && '+'}
                    {trend}%
                  </>
                ) : (
                  'N/A'
                )}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 ml-3">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};
