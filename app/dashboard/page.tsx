'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AccountConnectionCard } from '@/components/dashboard/AccountConnectionCard';
import { useApp } from '@/contexts/AppContext';
import { BarChart3, Search, DollarSign, Layers, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

export default function Dashboard() {
  const router = useRouter();
  const { connectedAccounts, connectAccount, customDashboards } = useApp();

  const handleConnect = (account: 'ga4' | 'gsc' | 'ads') => {
    connectAccount(account);
    toast.success(`${account.toUpperCase()} account connected successfully!`);
  };

  const accounts = [
    {
      key: 'ga4' as const,
      title: 'Google Analytics',
      description: 'Track website traffic, user behavior, and conversion data',
      icon: BarChart3,
      path: '/dashboard/analytics',
      color: 'gradient-primary',
    },
    {
      key: 'gsc' as const,
      title: 'Google Search Console',
      description: 'Monitor search performance, indexing, and SEO insights',
      icon: Search,
      path: '/dashboard/search-console',
      color: 'bg-chart-2',
    },
    {
      key: 'ads' as const,
      title: 'Google Ads',
      description: 'Manage ad campaigns, track spend, and measure ROI',
      icon: DollarSign,
      path: '/dashboard/ads',
      color: 'bg-chart-3',
    },
  ];

  const connectedCount = Object.values(connectedAccounts).filter(Boolean).length;

  return (
    <DashboardLayout title="Overview">
      <div className="space-y-8 animate-fade-in">
        {/* Welcome section */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome to Unified Marketing Hub</h2>
            <p className="text-muted-foreground mt-1">
              {connectedCount === 0
                ? 'Connect your accounts to start viewing your marketing data'
                : `${connectedCount} of 3 accounts connected`}
            </p>
          </div>
          <Button
            onClick={() => router.push('/dashboard/builder')}
            className="gradient-primary text-primary-foreground hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Dashboard
          </Button>
        </div>

        {/* Connection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {accounts.map((account) => (
            <AccountConnectionCard
              key={account.key}
              title={account.title}
              description={account.description}
              icon={account.icon}
              isConnected={connectedAccounts[account.key]}
              onConnect={() => handleConnect(account.key)}
              onOpen={() => router.push(account.path)}
              color={account.color}
            />
          ))}
        </div>

        {/* Custom Dashboards */}
        {customDashboards.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Custom Dashboards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {customDashboards.map((dashboard) => (
                <DashboardCard
                  key={dashboard.id}
                  title={dashboard.name}
                  subtitle={`${dashboard.widgets.length} widgets`}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Layers className="w-4 h-4" />
                    <span className="text-sm">
                      Created {dashboard.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </DashboardCard>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {connectedCount > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <DashboardCard className="bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1,247</p>
                  <p className="text-sm text-muted-foreground">Active Users Now</p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-chart-2 flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">125K</p>
                  <p className="text-sm text-muted-foreground">Total Clicks Today</p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="bg-gradient-to-br from-chart-3/10 to-chart-3/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-chart-3 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">$12.4K</p>
                  <p className="text-sm text-muted-foreground">Ad Spend This Week</p>
                </div>
              </div>
            </DashboardCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

