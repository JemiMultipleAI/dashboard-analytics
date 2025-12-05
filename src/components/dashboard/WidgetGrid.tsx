import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WidgetGridProps {
  children: ReactNode;
  className?: string;
}

export const WidgetGrid = ({ children, className }: WidgetGridProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5',
        className
      )}
    >
      {children}
    </div>
  );
};
