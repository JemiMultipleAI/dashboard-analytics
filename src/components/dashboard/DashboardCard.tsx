import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export const DashboardCard = ({
  children,
  className,
  title,
  subtitle,
  action,
}: DashboardCardProps) => {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-300',
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
};
