import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraggableWidgetProps {
  id: string;
  children: ReactNode;
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export const DraggableWidget = ({
  id,
  children,
  onRemove,
  onDragStart,
  onDragEnd,
}: DraggableWidgetProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    onDragEnd(e);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        'relative group transition-all duration-200',
        isDragging && 'opacity-50 scale-95'
      )}
    >
      {/* Controls */}
      <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 rounded-full shadow-md cursor-grab active:cursor-grabbing"
        >
          <Move className="w-3 h-3" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="h-6 w-6 rounded-full shadow-md"
          onClick={() => onRemove(id)}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Widget content */}
      <div className="ring-2 ring-transparent group-hover:ring-primary/20 rounded-xl transition-all">
        {children}
      </div>
    </div>
  );
};
