'use client';

import { useCallback, useState, useEffect } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { cn } from '@/lib/utils';

interface DashboardGridProps {
  widgets: Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  onLayoutChange: (layout: Layout[]) => void;
  children: (widget: { id: string; type: string }) => React.ReactNode;
  className?: string;
}

export const DashboardGrid = ({
  widgets,
  onLayoutChange,
  children,
  className,
}: DashboardGridProps) => {
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    setMounted(true);
    
    const updateWidth = () => {
      if (typeof window === 'undefined') return;
      
      // Get the actual container width by finding the main content area
      const mainContent = document.querySelector('[class*="DashboardLayout"]')?.querySelector('main');
      if (mainContent) {
        const rect = mainContent.getBoundingClientRect();
        setWidth(Math.max(rect.width - 64, 800)); // Subtract padding, minimum 800px
      } else {
        // Fallback: calculate based on window width
        // Sidebar is typically 256px, padding is 64px on each side
        const containerWidth = window.innerWidth - 256 - 128;
        setWidth(Math.max(containerWidth, 800));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    // Also update after a short delay to ensure DOM is ready
    const timeout = setTimeout(updateWidth, 100);
    
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timeout);
    };
  }, []);

  const handleLayoutChange = useCallback(
    (layout: Layout[]) => {
      onLayoutChange(layout);
    },
    [onLayoutChange]
  );

  // Convert widgets to grid layout format
  const layout: Layout[] = widgets.map((widget) => ({
    i: widget.id,
    x: widget.x,
    y: widget.y,
    w: widget.w,
    h: widget.h,
    minW: 1,
    minH: 2,
    maxW: 12,
    maxH: 20,
  }));

  if (!mounted) {
    return (
      <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-5', className)}>
        {widgets.map((widget) => (
          <div key={widget.id} className="min-h-[200px]">
            {children(widget)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={60}
        width={width}
        onLayoutChange={handleLayoutChange}
        isDraggable={true}
        isResizable={true}
        draggableHandle=".drag-handle"
        resizeHandles={['se']}
        margin={[20, 20]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
        compactType={null}
        preventCollision={false}
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className="bg-card rounded-xl border border-border shadow-card flex flex-col relative group"
            style={{ height: '100%', position: 'relative', overflow: 'visible' }}
          >
            <div className="drag-handle cursor-move p-2 border-b border-border bg-secondary/30 hover:bg-secondary/50 transition-colors flex-shrink-0 z-0">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"></div>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 rounded-b-xl" style={{ minHeight: 0, position: 'relative', zIndex: 0 }}>
              {children(widget)}
            </div>
            {/* Custom visible resize indicator - always visible */}
            <div 
              className="absolute bottom-0 right-0 w-8 h-8 z-[1002] pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, transparent 50%, hsl(var(--primary) / 0.1) 50%)',
                borderRadius: '0 0 0.75rem 0',
              }}
            >
              <div className="absolute bottom-1 right-1 w-5 h-5 flex items-end justify-end">
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary opacity-60"
                >
                  <path 
                    d="M0 12L12 0M0 12H12M0 12V0" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

