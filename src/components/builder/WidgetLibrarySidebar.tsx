import { widgetLibrary } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import {
  Activity,
  TrendingUp,
  FileText,
  MousePointer,
  Monitor,
  BarChart3,
  Search,
  MessageSquare,
  Database,
  Gauge,
  LineChart,
  DollarSign,
  Target,
  Key,
  Lightbulb,
  AreaChart,
  GripVertical,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  TrendingUp,
  FileText,
  MousePointer,
  Monitor,
  BarChart3,
  Search,
  MessageSquare,
  Database,
  Gauge,
  LineChart,
  DollarSign,
  Target,
  Key,
  Lightbulb,
  AreaChart,
};

interface WidgetLibrarySidebarProps {
  onDragStart: (e: React.DragEvent, widgetId: string) => void;
}

export const WidgetLibrarySidebar = ({ onDragStart }: WidgetLibrarySidebarProps) => {
  const categories = [
    { key: 'ga4', label: 'Google Analytics', color: 'bg-chart-1/10 text-chart-1' },
    { key: 'gsc', label: 'Search Console', color: 'bg-chart-2/10 text-chart-2' },
    { key: 'ads', label: 'Google Ads', color: 'bg-chart-3/10 text-chart-3' },
  ];

  return (
    <div className="w-72 border-r border-border bg-card h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Widget Library</h2>
        <p className="text-sm text-muted-foreground mt-1">Drag widgets to add them</p>
      </div>

      <div className="p-4 space-y-6">
        {categories.map((category) => {
          const widgets = widgetLibrary[category.key as keyof typeof widgetLibrary];
          return (
            <div key={category.key}>
              <h3 className={cn('text-xs font-semibold uppercase tracking-wider mb-3', category.color)}>
                {category.label}
              </h3>
              <div className="space-y-2">
                {widgets.map((widget) => {
                  const Icon = iconMap[widget.icon] || Activity;
                  return (
                    <div
                      key={widget.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, widget.id)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border border-border',
                        'bg-secondary/50 hover:bg-secondary cursor-grab active:cursor-grabbing',
                        'transition-all duration-200 hover:shadow-sm'
                      )}
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', category.color)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-foreground">{widget.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
