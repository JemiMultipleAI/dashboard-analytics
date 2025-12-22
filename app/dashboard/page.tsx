'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AccountConnectionCard } from '@/components/dashboard/AccountConnectionCard';
import { useApp } from '@/contexts/AppContext';
import { BarChart3, Search, DollarSign, Layers, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { fetchGA4Data, fetchGSCData, fetchAdsData } from '@/lib/api';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { connectedAccounts, connectAccount, customDashboards } = useApp();
  
  // Stats state
  const [stats, setStats] = useState({
    activeUsers: '1,247',
    totalClicks: '125K',
    adSpend: '$12.4K',
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Check if we just returned from OAuth callback
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');
    
    if (connected) {
      const account = connected as 'ga4' | 'gsc' | 'ads';
      // Only connect if not already connected to prevent infinite loops
      if (!connectedAccounts[account]) {
        connectAccount(account);
        toast.success(`${account.toUpperCase()} account connected successfully!`);
      }
      // Clean up URL
      router.replace('/dashboard');
    } else if (error) {
      toast.error('Authentication failed. Please try again.');
      router.replace('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only depend on searchParams to avoid infinite loops

  // Auto-connect using pre-authorized refresh tokens from environment
  useEffect(() => {
    const autoConnectPreAuth = async () => {
      // Only try auto-connect if no accounts are connected
      const connectedCount = Object.values(connectedAccounts).filter(Boolean).length;
      if (connectedCount > 0) return;

      const services: Array<'ga4' | 'gsc' | 'ads'> = ['ga4', 'gsc', 'ads'];
      
      for (const service of services) {
        try {
          const response = await fetch('/api/auth/google/pre-auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ service }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              connectAccount(service);
              console.log(`✅ Auto-connected ${service.toUpperCase()} using pre-authorized token`);
            }
          }
        } catch (error) {
          // Silently fail - this is expected if refresh tokens are not set
          console.debug(`Pre-auth not available for ${service}`);
        }
      }
    };

    // Only run auto-connect once on mount
    autoConnectPreAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Fetch real stats when accounts are connected
  useEffect(() => {
    const loadStats = async () => {
      if (!connectedAccounts.ga4 && !connectedAccounts.gsc && !connectedAccounts.ads) {
        return; // No accounts connected, keep default values
      }

      setStatsLoading(true);
      
      try {
        // Fetch GA4 data for active users
        if (connectedAccounts.ga4) {
          try {
            const ga4Data = await fetchGA4Data();
            if (ga4Data?.realtime?.activeUsers !== undefined) {
              setStats(prev => ({
                ...prev,
                activeUsers: ga4Data.realtime.activeUsers.toLocaleString(),
              }));
            }
          } catch (err) {
            console.warn('Failed to fetch GA4 stats:', err);
            // Keep default value on error
          }
        }

        // Fetch GSC data for total clicks
        if (connectedAccounts.gsc) {
          try {
            const gscData = await fetchGSCData();
            if (gscData?.overview?.totalClicks !== undefined) {
              const clicks = gscData.overview.totalClicks;
              setStats(prev => ({
                ...prev,
                totalClicks: clicks >= 1000 ? `${(clicks / 1000).toFixed(0)}K` : clicks.toLocaleString(),
              }));
            }
          } catch (err) {
            console.warn('Failed to fetch GSC stats:', err);
            // Keep default value on error
          }
        }

        // Fetch Ads data for ad spend
        if (connectedAccounts.ads) {
          try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7); // Last 7 days
            
            const adsData = await fetchAdsData(startDate, endDate);
            if (adsData?.overview?.cost !== undefined) {
              const cost = adsData.overview.cost;
              setStats(prev => ({
                ...prev,
                adSpend: cost >= 1000 ? `$${(cost / 1000).toFixed(1)}K` : `$${cost.toFixed(0)}`,
              }));
            }
          } catch (err) {
            console.warn('Failed to fetch Ads stats:', err);
            // Keep default value on error
          }
        }
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [connectedAccounts.ga4, connectedAccounts.gsc, connectedAccounts.ads]);

  const handleRefreshStats = async () => {
    if (connectedCount === 0) return;

    setRefreshing(true);
    
    try {
      const { clearCache } = await import('@/lib/cache');
      
      // Fetch fresh data for all connected accounts
      if (connectedAccounts.ga4) {
        try {
          clearCache('ga4_data');
          const ga4Data = await fetchGA4Data(true);
          if (ga4Data?.realtime?.activeUsers !== undefined) {
            setStats(prev => ({
              ...prev,
              activeUsers: ga4Data.realtime.activeUsers.toLocaleString(),
            }));
          }
        } catch (err) {
          console.warn('Failed to refresh GA4 stats:', err);
        }
      }

      if (connectedAccounts.gsc) {
        try {
          clearCache('gsc_data');
          const gscData = await fetchGSCData(true);
          if (gscData?.overview?.totalClicks !== undefined) {
            const clicks = gscData.overview.totalClicks;
            setStats(prev => ({
              ...prev,
              totalClicks: clicks >= 1000 ? `${(clicks / 1000).toFixed(0)}K` : clicks.toLocaleString(),
            }));
          }
        } catch (err) {
          console.warn('Failed to refresh GSC stats:', err);
        }
      }

      if (connectedAccounts.ads) {
        try {
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          
          const dateRangeKey = `${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`;
          clearCache(`ads_data_${dateRangeKey}`);
          clearCache('ads_data_default');
          
          const adsData = await fetchAdsData(startDate, endDate, true);
          if (adsData?.overview?.cost !== undefined) {
            const cost = adsData.overview.cost;
            setStats(prev => ({
              ...prev,
              adSpend: cost >= 1000 ? `$${(cost / 1000).toFixed(1)}K` : `$${cost.toFixed(0)}`,
            }));
          }
        } catch (err) {
          console.warn('Failed to refresh Ads stats:', err);
        }
      }

      toast.success('Stats refreshed successfully');
    } catch (err) {
      console.error('Error refreshing stats:', err);
      toast.error('Failed to refresh some stats');
    } finally {
      setRefreshing(false);
    }
  };

  const handleConnect = async (account: 'ga4' | 'gsc' | 'ads') => {
    try {
      const { initiateGoogleAuth } = await import('@/lib/api');
      const authUrl = await initiateGoogleAuth(account);
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      toast.error('Failed to initiate authentication');
    }
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
    <>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome section */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome to Unified Analytics</h2>
            <p className="text-muted-foreground mt-1">
              {connectedCount === 0
                ? 'Connect your accounts to start viewing your marketing data'
                : `${connectedCount} of 3 accounts connected`}
            </p>
          </div>
          <div className="flex gap-2">
            {connectedCount > 0 && (
              <Button
                onClick={handleRefreshStats}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Stats'}
              </Button>
            )}
            <Button
              onClick={() => router.push('/dashboard/builder')}
              className="gradient-primary text-primary-foreground hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Dashboard
            </Button>
          </div>
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
                <div
                  key={dashboard.id}
                  onClick={() => router.push(`/dashboard/view/${dashboard.id}`)}
                  className="cursor-pointer"
                >
                  <DashboardCard
                    title={dashboard.name}
                    subtitle={`${dashboard.widgets.length} widgets`}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Layers className="w-4 h-4" />
                      <span className="text-sm">
                        Created {dashboard.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </DashboardCard>
                </div>
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
                  {statsLoading && connectedAccounts.ga4 ? (
                    <div className="h-8 w-20 bg-secondary animate-pulse rounded mb-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{stats.activeUsers}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Active Users Now
                    {connectedAccounts.ga4 && !statsLoading && (
                      <span className="ml-2 text-xs text-success">● Live</span>
                    )}
                  </p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-chart-2 flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  {statsLoading && connectedAccounts.gsc ? (
                    <div className="h-8 w-20 bg-secondary animate-pulse rounded mb-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{stats.totalClicks}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Total Clicks Today
                    {connectedAccounts.gsc && !statsLoading && (
                      <span className="ml-2 text-xs text-success">● Live</span>
                    )}
                  </p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="bg-gradient-to-br from-chart-3/10 to-chart-3/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-chart-3 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  {statsLoading && connectedAccounts.ads ? (
                    <div className="h-8 w-20 bg-secondary animate-pulse rounded mb-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{stats.adSpend}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Ad Spend This Week
                    {connectedAccounts.ads && !statsLoading && (
                      <span className="ml-2 text-xs text-success">● Live</span>
                    )}
                  </p>
                </div>
              </div>
            </DashboardCard>
          </div>
        )}
      </div>
    </>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout title="Overview">
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <DashboardContent />
      </Suspense>
    </DashboardLayout>
  );
}

