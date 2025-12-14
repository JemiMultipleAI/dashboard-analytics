'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WidgetLibrarySidebar } from '@/components/builder/WidgetLibrarySidebar';
import { DraggableWidget } from '@/components/builder/DraggableWidget';
import { WidgetRenderer } from '@/components/builder/WidgetRenderer';
import { WidgetType } from '@/lib/mockData';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface PlacedWidget {
  id: string;
  type: WidgetType;
}

export default function DashboardBuilder() {
  const [widgets, setWidgets] = useState<PlacedWidget[]>([]);
  const [dashboardName, setDashboardName] = useState('My Custom Dashboard');
  const [isDragOver, setIsDragOver] = useState(false);
  const { addDashboard } = useApp();
  const router = useRouter();

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    e.dataTransfer.setData('widgetType', widgetId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const widgetType = e.dataTransfer.getData('widgetType') as WidgetType;
    if (widgetType) {
      const newWidget: PlacedWidget = {
        id: `${widgetType}-${Date.now()}`,
        type: widgetType,
      };
      setWidgets((prev) => [...prev, newWidget]);
      toast.success('Widget added!');
    }
  };

  const handleWidgetDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('reorderWidgetId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleWidgetDragEnd = () => {
    // Optional: handle reorder logic
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    toast.success('Widget removed');
  };

  const handleSave = () => {
    if (widgets.length === 0) {
      toast.error('Add at least one widget before saving');
      return;
    }

    addDashboard({
      id: `dashboard-${Date.now()}`,
      name: dashboardName,
      widgets: widgets.map((w, i) => {
        // Arrange widgets in a 2-column grid with better default sizes
        const col = i % 2;
        const row = Math.floor(i / 2);
        return {
          id: w.id,
          type: w.type,
          x: col * 6, // 6 columns per widget (half width)
          y: row * 4, // 4 rows per widget
          w: 6, // Half width (6 out of 12 columns)
          h: 4, // Default height of 4 rows
        };
      }),
      createdAt: new Date(),
    });

    toast.success('Dashboard saved successfully!');
    setWidgets([]);
    setDashboardName('My Custom Dashboard');
    router.push('/dashboard');
  };

  const handleClear = () => {
    setWidgets([]);
    toast.success('Canvas cleared');
  };

  return (
    <DashboardLayout title="Dashboard Builder">
      <div className="flex h-[calc(100vh-8rem)] -mx-6 -mt-6">
        {/* Widget Library Sidebar */}
        <WidgetLibrarySidebar onDragStart={handleDragStart} />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Toolbar */}
          <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                className="w-64 font-medium"
                placeholder="Dashboard name"
              />
              <span className="text-sm text-muted-foreground">
                {widgets.length} widget{widgets.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleClear} disabled={widgets.length === 0}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button
                onClick={handleSave}
                className="gradient-primary text-primary-foreground hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Dashboard
              </Button>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            className={cn(
              'flex-1 p-6 overflow-y-auto transition-colors duration-200',
              isDragOver && 'bg-primary/5'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {widgets.length === 0 ? (
              <div
                className={cn(
                  'h-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-colors',
                  isDragOver ? 'border-primary bg-primary/5' : 'border-border'
                )}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Start Building Your Dashboard
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Drag widgets from the left sidebar and drop them here to create your custom dashboard.
                  Mix and match data from GA4, Search Console, and Google Ads.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {widgets.map((widget) => (
                  <DraggableWidget
                    key={widget.id}
                    id={widget.id}
                    onRemove={handleRemoveWidget}
                    onDragStart={handleWidgetDragStart}
                    onDragEnd={handleWidgetDragEnd}
                  >
                    <WidgetRenderer type={widget.type} />
                  </DraggableWidget>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

