import { cn } from '@/lib/utils';
import { Check, Plus, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccountConnectionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isConnected: boolean;
  onConnect: () => void;
  onOpen: () => void;
  color: string;
}

export const AccountConnectionCard = ({
  title,
  description,
  icon: Icon,
  isConnected,
  onConnect,
  onOpen,
  color,
}: AccountConnectionCardProps) => {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group cursor-pointer',
        isConnected && 'hover:border-primary/30'
      )}
      onClick={isConnected ? onOpen : undefined}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105',
            color
          )}
        >
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            {isConnected && (
              <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" />
                Connected
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      <div className="mt-4">
        {isConnected ? (
          <Button
            variant="secondary"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            View Dashboard
          </Button>
        ) : (
          <Button
            className="w-full gradient-primary text-primary-foreground hover:opacity-90"
            onClick={(e) => {
              e.stopPropagation();
              onConnect();
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Connect Account
          </Button>
        )}
      </div>
    </div>
  );
};
