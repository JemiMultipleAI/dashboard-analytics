'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopNavProps {
  title: string;
}

export const TopNav = ({ title }: TopNavProps) => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="h-full flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-64 pl-9 bg-secondary/50 border-transparent focus:border-primary"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {/* User */}
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
