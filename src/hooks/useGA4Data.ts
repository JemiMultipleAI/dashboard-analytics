import { useQuery } from '@tanstack/react-query';

interface GA4Data {
  realtime: {
    activeUsers: number;
    pageViews: number;
    eventsPerMinute: number;
  };
  acquisition: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
    paid: number;
    totalSessions?: number;
  };
  topPages: Array<{
    path: string;
    views: number;
    avgTime: string;
  }>;
  events: Array<{
    name: string;
    count: number;
    trend: number;
  }> | {
    events: Array<{
      name: string;
      count: number;
      trend: number;
    }>;
    totalEvents: number;
  };
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  dailyUsers: Array<{
    date: string;
    users: number;
  }>;
}

interface GA4ApiResponse {
  success: boolean;
  data: GA4Data;
  error?: string;
  details?: string;
  troubleshooting?: string[];
}

// Get Property ID first
async function getPropertyId(): Promise<string> {
  const response = await fetch('/api/ga4/config');
  if (!response.ok) {
    throw new Error('Failed to get Property ID from config');
  }
  const config = await response.json();
  if (!config.propertyId) {
    throw new Error('Property ID not found in config');
  }
  return config.propertyId;
}

async function fetchGA4Data(endpoint: string = 'all'): Promise<GA4Data> {
  // Get Property ID first
  const propertyId = await getPropertyId();
  
  const params = new URLSearchParams();
  if (endpoint !== 'all') {
    params.append('endpoint', endpoint);
  }
  params.append('propertyId', propertyId);

  const url = `/api/ga4?${params.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    // Build detailed error message
    let errorMessage = error.error || error.details || `HTTP ${response.status}: Failed to fetch GA4 data`;
    if (error.details) {
      errorMessage += `\n\nDetails: ${error.details}`;
    }
    if (error.troubleshooting && Array.isArray(error.troubleshooting)) {
      errorMessage += `\n\nTroubleshooting:\n${error.troubleshooting.join('\n')}`;
    }
    const errorObj = new Error(errorMessage);
    // Attach additional information to error object for frontend access
    (errorObj as any).details = error.details;
    (errorObj as any).troubleshooting = error.troubleshooting;
    throw errorObj;
  }

  const result: GA4ApiResponse = await response.json();
  
  if (!result.success) {
    let errorMessage = result.error || 'Failed to fetch GA4 data';
    if (result.details) {
      errorMessage += `\n\nDetails: ${result.details}`;
    }
    if (result.troubleshooting && Array.isArray(result.troubleshooting)) {
      errorMessage += `\n\nTroubleshooting:\n${result.troubleshooting.join('\n')}`;
    }
    const errorObj = new Error(errorMessage);
    (errorObj as any).details = result.details;
    (errorObj as any).troubleshooting = result.troubleshooting;
    throw errorObj;
  }

  return result.data;
}

// Get all GA4 data
export function useGA4Data() {
  return useQuery({
    queryKey: ['ga4', 'all'],
    queryFn: () => fetchGA4Data('all'),
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

// Get realtime data
export function useGA4Realtime() {
  return useQuery({
    queryKey: ['ga4', 'realtime'],
    queryFn: () => fetchGA4Data('realtime'),
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

// Get acquisition data
export function useGA4Acquisition() {
  return useQuery({
    queryKey: ['ga4', 'acquisition'],
    queryFn: () => fetchGA4Data('acquisition'),
    refetchInterval: 300000,
    staleTime: 120000,
  });
}

// Get top pages
export function useGA4TopPages() {
  return useQuery({
    queryKey: ['ga4', 'topPages'],
    queryFn: () => fetchGA4Data('topPages'),
    refetchInterval: 300000,
    staleTime: 120000,
  });
}

// Get events data
export function useGA4Events() {
  return useQuery({
    queryKey: ['ga4', 'events'],
    queryFn: () => fetchGA4Data('events'),
    refetchInterval: 300000,
    staleTime: 120000,
  });
}

// Get devices data
export function useGA4Devices() {
  return useQuery({
    queryKey: ['ga4', 'devices'],
    queryFn: () => fetchGA4Data('devices'),
    refetchInterval: 300000,
    staleTime: 120000,
  });
}

// Get daily users data
export function useGA4DailyUsers(days: number = 7) {
  return useQuery({
    queryKey: ['ga4', 'dailyUsers', days],
    queryFn: async () => {
      // Get Property ID first
      const propertyId = await getPropertyId();
      
      const params = new URLSearchParams();
      params.append('endpoint', 'dailyUsers');
      params.append('days', days.toString());
      params.append('propertyId', propertyId);

      const url = `/api/ga4?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        // Build detailed error message
        let errorMessage = error.error || error.details || `HTTP ${response.status}: Failed to fetch daily users data`;
        if (error.details) {
          errorMessage += `\n\nDetails: ${error.details}`;
        }
        if (error.troubleshooting && Array.isArray(error.troubleshooting)) {
          errorMessage += `\n\nTroubleshooting:\n${error.troubleshooting.join('\n')}`;
        }
        const errorObj = new Error(errorMessage);
        // Attach additional information to error object for frontend access
        (errorObj as any).details = error.details;
        (errorObj as any).troubleshooting = error.troubleshooting;
        throw errorObj;
      }

      const result: GA4ApiResponse = await response.json();
      
      if (!result.success) {
        let errorMessage = result.error || 'Failed to fetch daily users data';
        if (result.details) {
          errorMessage += `\n\nDetails: ${result.details}`;
        }
        if (result.troubleshooting && Array.isArray(result.troubleshooting)) {
          errorMessage += `\n\nTroubleshooting:\n${result.troubleshooting.join('\n')}`;
        }
        const errorObj = new Error(errorMessage);
        (errorObj as any).details = result.details;
        (errorObj as any).troubleshooting = result.troubleshooting;
        throw errorObj;
      }

      // API returns data directly as array when endpoint is 'dailyUsers'
      // Type assertion needed because GA4ApiResponse.data is typed as GA4Data, but for dailyUsers endpoint it's actually an array
      return (result.data as any) as Array<{ date: string; users: number }>;
    },
    refetchInterval: 300000,
    staleTime: 120000,
  });
}

