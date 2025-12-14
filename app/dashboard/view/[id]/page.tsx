'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { WidgetRenderer } from '@/components/builder/WidgetRenderer';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { ArrowLeft, Trash2, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Layout } from 'react-grid-layout';

export default function ViewDashboard() {
  const params = useParams();
  const router = useRouter();
  const { customDashboards, deleteDashboard, updateDashboard } = useApp();
  
  const dashboardId = params.id as string;
  const dashboard = customDashboards.find((d) => d.id === dashboardId);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  if (!dashboard) {
    return (
      <DashboardLayout title="Dashboard Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Dashboard not found</p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this dashboard?')) {
      deleteDashboard(dashboardId);
      toast.success('Dashboard deleted');
      router.push('/dashboard');
    }
  };

  const handleLayoutChange = useCallback(
    (layout: Layout[]) => {
      // Update widgets with new positions and sizes
      const updatedWidgets = dashboard.widgets.map((widget) => {
        const layoutItem = layout.find((item) => item.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          };
        }
        return widget;
      });

      // Update dashboard with new layout (auto-save)
      updateDashboard(dashboardId, {
        widgets: updatedWidgets,
      });

      setHasUnsavedChanges(true);
      
      // Auto-save after a short delay
      setTimeout(() => {
        setHasUnsavedChanges(false);
      }, 2000);
    },
    [dashboard, dashboardId, updateDashboard]
  );

  return (
    <DashboardLayout title={dashboard.name}>
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Save className="w-4 h-4" />
                Saving...
              </span>
            )}
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/builder?edit=${dashboardId}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Widgets
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Dashboard Info */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">
            {dashboard.widgets.length} widget{dashboard.widgets.length !== 1 ? 's' : ''} • 
            Created {dashboard.createdAt.toLocaleDateString()}
          </p>
        </div>

        {/* Widgets Grid */}
        {dashboard.widgets.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>This dashboard has no widgets yet.</p>
            <Button
              className="mt-4"
              onClick={() => router.push(`/dashboard/builder?edit=${dashboardId}`)}
            >
              Add Widgets
            </Button>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              💡 Drag widgets to reorder • Resize by dragging corners • Scroll within resized widgets
            </p>
            <DashboardGrid
              widgets={dashboard.widgets}
              onLayoutChange={handleLayoutChange}
            >
              {(widget) => <WidgetRenderer type={widget.type as any} />}
            </DashboardGrid>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

