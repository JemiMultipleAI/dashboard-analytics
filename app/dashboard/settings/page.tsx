'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Search, DollarSign, Moon, Key, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { connectedAccounts, disconnectAccount, isDarkMode, toggleDarkMode } = useApp();

  const accounts = [
    {
      key: 'ga4' as const,
      title: 'Google Analytics',
      icon: BarChart3,
      color: 'text-primary bg-primary/10',
    },
    {
      key: 'gsc' as const,
      title: 'Google Search Console',
      icon: Search,
      color: 'text-chart-2 bg-chart-2/10',
    },
    {
      key: 'ads' as const,
      title: 'Google Ads',
      icon: DollarSign,
      color: 'text-chart-3 bg-chart-3/10',
    },
  ];

  const handleDisconnect = (account: 'ga4' | 'gsc' | 'ads', title: string) => {
    disconnectAccount(account);
    toast.success(`${title} disconnected`);
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-3xl space-y-6 animate-fade-in">
        {/* Appearance */}
        <DashboardCard title="Appearance" subtitle="Customize the look and feel">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Moon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
              </div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </DashboardCard>

        {/* Connected Accounts */}
        <DashboardCard title="Connected Accounts" subtitle="Manage your data source connections">
          <div className="space-y-4">
            {accounts.map((account) => {
              const Icon = account.icon;
              const isConnected = connectedAccounts[account.key];

              return (
                <div
                  key={account.key}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', account.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{account.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {isConnected ? (
                          <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                            <Check className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            <X className="w-3 h-3 mr-1" />
                            Not Connected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {isConnected && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDisconnect(account.key, account.title)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </DashboardCard>

        {/* API Keys */}
        <DashboardCard title="API Keys" subtitle="Manage your API credentials (placeholder)">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ga4-key" className="flex items-center gap-2">
                <Key className="w-4 h-4 text-muted-foreground" />
                Google Analytics API Key
              </Label>
              <Input
                id="ga4-key"
                type="password"
                placeholder="Enter your GA4 API key"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gsc-key" className="flex items-center gap-2">
                <Key className="w-4 h-4 text-muted-foreground" />
                Search Console API Key
              </Label>
              <Input
                id="gsc-key"
                type="password"
                placeholder="Enter your GSC API key"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ads-key" className="flex items-center gap-2">
                <Key className="w-4 h-4 text-muted-foreground" />
                Google Ads API Key
              </Label>
              <Input
                id="ads-key"
                type="password"
                placeholder="Enter your Ads API key"
                className="font-mono"
              />
            </div>
            <Button className="gradient-primary text-primary-foreground hover:opacity-90">
              Save API Keys
            </Button>
          </div>
        </DashboardCard>

        {/* Danger Zone */}
        <DashboardCard className="border-destructive/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-destructive">Delete Account</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}

