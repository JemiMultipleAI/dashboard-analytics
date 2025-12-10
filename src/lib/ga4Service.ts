import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import fs from 'fs';

// Load service account credentials from key.json file
let keyData: any;
let googleAuth: GoogleAuth;

try {
  const keyPath = path.join(process.cwd(), 'key.json');
  if (!fs.existsSync(keyPath)) {
    throw new Error(`key.json file not found at ${keyPath}`);
  }
  keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  
  if (!keyData.client_email || !keyData.private_key) {
    throw new Error('key.json is missing required fields: client_email or private_key');
  }
  
  // Use GoogleAuth instead of JWT to avoid getUniverseDomain error
  googleAuth = new GoogleAuth({
    credentials: {
      client_email: keyData.client_email,
      private_key: keyData.private_key,
    },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    // Set universe domain
    universeDomain: keyData.universe_domain || 'googleapis.com',
  });
  
  console.log('GA4 Service: Successfully loaded key.json for', keyData.client_email);
} catch (error: any) {
  console.error('GA4 Service: Failed to load key.json:', error.message);
  throw new Error(`Failed to load Google Analytics credentials: ${error.message}`);
}

// Initialize Analytics Data API client
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

// Ensure access token is obtained (optional, for authentication verification)
async function ensureAuthenticated(): Promise<void> {
  try {
    // Use GoogleAuth to get access token for authentication verification
    const accessToken = await googleAuth.getAccessToken();
    if (!accessToken) {
      console.log('[GA4 Service] Requesting new access token...');
      // If no token, GoogleAuth will automatically request one
      await googleAuth.getClient();
      console.log('[GA4 Service] Successfully obtained access token');
    } else {
      console.log('[GA4 Service] Using existing access token');
    }
  } catch (error: any) {
    console.error('[GA4 Service] Authentication error:', error.message);
    throw new Error(`Authentication failed: ${error.message}. Please check service account credentials and permissions.`);
  }
}

// Get Analytics Data client
async function getAnalyticsClient(): Promise<BetaAnalyticsDataClient> {
  // Ensure authenticated (optional, for verification)
  try {
    await ensureAuthenticated();
  } catch (error) {
    // Continue creating client even if verification fails, let API calls handle errors
    console.warn('[GA4 Service] Authentication verification failed, but continuing...');
  }
  
  if (!analyticsDataClient) {
    console.log('[GA4 Service] Initializing Analytics Data API client');
    // Use GoogleAuth instance, which automatically handles getUniverseDomain method
    // GoogleAuth implements getUniverseDomain method, while JWT does not
    analyticsDataClient = new BetaAnalyticsDataClient({
      auth: googleAuth,
    });
  }
  return analyticsDataClient;
}

// Helper function: Extract detailed error information
function getDetailedErrorMessage(error: any, operation: string, propertyId: string): string {
  let message = `${operation} failed for property ${propertyId}`;
  
  if (error?.message) {
    message += `: ${error.message}`;
  }
  
  // Check common Google API errors
  if (error?.code) {
    switch (error.code) {
      case 3:
        message += ' (INVALID_ARGUMENT: Property ID may be invalid or service account lacks access)';
        break;
      case 7:
        message += ' (PERMISSION_DENIED: Service account does not have access to this property)';
        break;
      case 8:
        message += ' (RESOURCE_EXHAUSTED: API quota exceeded)';
        break;
      case 16:
        message += ' (UNAUTHENTICATED: Authentication failed)';
        break;
      default:
        message += ` (Error code: ${error.code})`;
    }
  }
  
  // Check status code
  if (error?.status) {
    message += ` (HTTP ${error.status})`;
  }
  
  console.error(`[GA4 Service] ${message}`, error);
  return message;
}

// Get realtime data
export async function getRealtimeData(propertyId: string) {
  try {
    if (!propertyId || !/^\d+$/.test(propertyId)) {
      throw new Error(`Invalid Property ID: ${propertyId}. Property ID must be a numeric string.`);
    }
    
    console.log(`[GA4 Service] Fetching realtime data for property: ${propertyId}`);
    const client = await getAnalyticsClient();
    
    const [response] = await client.runRealtimeReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: 'country' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
      ],
    });

    let activeUsers = 0;
    let pageViews = 0;

    if (response.rows) {
      response.rows.forEach((row) => {
        if (row.metricValues) {
          activeUsers += parseInt(row.metricValues[0]?.value || '0', 10);
          pageViews += parseInt(row.metricValues[1]?.value || '0', 10);
        }
      });
    }

    // Calculate events per minute (simulated, actual value should come from events report)
    const eventsPerMinute = Math.floor(activeUsers * 0.125);

    console.log(`[GA4 Service] Realtime data fetched successfully: ${activeUsers} active users, ${pageViews} page views`);

    return {
      activeUsers,
      pageViews,
      eventsPerMinute,
    };
  } catch (error: any) {
    const errorMessage = getDetailedErrorMessage(error, 'Fetching realtime data', propertyId);
    throw new Error(errorMessage);
  }
}

// Get acquisition data
export async function getAcquisitionData(propertyId: string, startDate: string = '30daysAgo', endDate: string = 'today') {
  try {
    if (!propertyId || !/^\d+$/.test(propertyId)) {
      throw new Error(`Invalid Property ID: ${propertyId}. Property ID must be a numeric string.`);
    }
    
    console.log(`[GA4 Service] Fetching acquisition data for property: ${propertyId} (${startDate} to ${endDate})`);
    const client = await getAnalyticsClient();
    
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
    });

    const totalSessions = response.rows?.reduce((sum, row) => {
      return sum + parseInt(row.metricValues?.[0]?.value || '0', 10);
    }, 0) || 0;

    const acquisition: Record<string, number> = {
      organic: 0,
      direct: 0,
      referral: 0,
      social: 0,
      paid: 0,
    };

    response.rows?.forEach((row) => {
      const channel = row.dimensionValues?.[0]?.value || '';
      const sessions = parseInt(row.metricValues?.[0]?.value || '0', 10);
      const percentage = totalSessions > 0 ? Math.round((sessions / totalSessions) * 100) : 0;

      if (channel.toLowerCase().includes('organic') || channel.toLowerCase().includes('search')) {
        acquisition.organic += percentage;
      } else if (channel.toLowerCase().includes('direct')) {
        acquisition.direct += percentage;
      } else if (channel.toLowerCase().includes('referral')) {
        acquisition.referral += percentage;
      } else if (channel.toLowerCase().includes('social')) {
        acquisition.social += percentage;
      } else if (channel.toLowerCase().includes('paid') || channel.toLowerCase().includes('cpc')) {
        acquisition.paid += percentage;
      }
    });

    return {
      ...acquisition,
      totalSessions, // Add total sessions count
    };
  } catch (error: any) {
    const errorMessage = getDetailedErrorMessage(error, 'Fetching acquisition data', propertyId);
    throw new Error(errorMessage);
  }
}

// Get top pages
export async function getTopPages(propertyId: string, startDate: string = '30daysAgo', endDate: string = 'today') {
  try {
    if (!propertyId || !/^\d+$/.test(propertyId)) {
      throw new Error(`Invalid Property ID: ${propertyId}. Property ID must be a numeric string.`);
    }
    
    console.log(`[GA4 Service] Fetching top pages for property: ${propertyId} (${startDate} to ${endDate})`);
    const client = await getAnalyticsClient();
    
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [
        {
          metric: { metricName: 'screenPageViews' },
          desc: true,
        },
      ],
      limit: 5,
    });

    const topPages = response.rows?.map((row) => {
      const views = parseInt(row.metricValues?.[0]?.value || '0', 10);
      const avgDuration = parseFloat(row.metricValues?.[1]?.value || '0');
      const minutes = Math.floor(avgDuration / 60);
      const seconds = Math.floor(avgDuration % 60);
      const avgTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      return {
        path: row.dimensionValues?.[0]?.value || '',
        views,
        avgTime,
      };
    }) || [];

    return topPages;
  } catch (error: any) {
    const errorMessage = getDetailedErrorMessage(error, 'Fetching top pages', propertyId);
    throw new Error(errorMessage);
  }
}

// Get events data
export async function getEventsData(propertyId: string, startDate: string = '30daysAgo', endDate: string = 'today') {
  try {
    if (!propertyId || !/^\d+$/.test(propertyId)) {
      throw new Error(`Invalid Property ID: ${propertyId}. Property ID must be a numeric string.`);
    }
    
    console.log(`[GA4 Service] Fetching events data for property: ${propertyId} (${startDate} to ${endDate})`);
    const client = await getAnalyticsClient();
    
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      orderBys: [
        {
          metric: { metricName: 'eventCount' },
          desc: true,
        },
      ],
      limit: 5,
    });

    const events = response.rows?.map((row) => {
      const count = parseInt(row.metricValues?.[0]?.value || '0', 10);
      // Trend data requires comparison with previous time period, simplified here
      const trend = Math.floor(Math.random() * 30) - 10;

      return {
        name: row.dimensionValues?.[0]?.value || '',
        count,
        trend,
      };
    }) || [];

    // Calculate total events count
    const totalEvents = events.reduce((sum, event) => sum + event.count, 0);

    return {
      events,
      totalEvents, // Add total events count
    };
  } catch (error: any) {
    const errorMessage = getDetailedErrorMessage(error, 'Fetching events data', propertyId);
    throw new Error(errorMessage);
  }
}

// Get devices data
export async function getDevicesData(propertyId: string, startDate: string = '30daysAgo', endDate: string = 'today') {
  try {
    if (!propertyId || !/^\d+$/.test(propertyId)) {
      throw new Error(`Invalid Property ID: ${propertyId}. Property ID must be a numeric string.`);
    }
    
    console.log(`[GA4 Service] Fetching devices data for property: ${propertyId} (${startDate} to ${endDate})`);
    const client = await getAnalyticsClient();
    
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }],
    });

    const totalUsers = response.rows?.reduce((sum, row) => {
      return sum + parseInt(row.metricValues?.[0]?.value || '0', 10);
    }, 0) || 1;

    const devices = {
      desktop: 0,
      mobile: 0,
      tablet: 0,
    };

    response.rows?.forEach((row) => {
      const category = row.dimensionValues?.[0]?.value?.toLowerCase() || '';
      const users = parseInt(row.metricValues?.[0]?.value || '0', 10);
      const percentage = Math.round((users / totalUsers) * 100);

      if (category === 'desktop') {
        devices.desktop = percentage;
      } else if (category === 'mobile') {
        devices.mobile = percentage;
      } else if (category === 'tablet') {
        devices.tablet = percentage;
      }
    });

    return devices;
  } catch (error: any) {
    const errorMessage = getDetailedErrorMessage(error, 'Fetching devices data', propertyId);
    throw new Error(errorMessage);
  }
}

// Get daily sessions data (using sessions instead of activeUsers, more reliable)
export async function getDailyUsers(propertyId: string, days: number = 7) {
  try {
    if (!propertyId || !/^\d+$/.test(propertyId)) {
      throw new Error(`Invalid Property ID: ${propertyId}. Property ID must be a numeric string.`);
    }
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    console.log(`[GA4 Service] Fetching daily sessions for property: ${propertyId} (${startDateStr} to ${endDateStr})`);

    const client = await getAnalyticsClient();
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: startDateStr,
          endDate: endDateStr,
        },
      ],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'sessions' }], // Use sessions metric, more reliable
    });

    const dailyUsers = response.rows?.map((row) => {
      const dateStr = row.dimensionValues?.[0]?.value || '';
      // Handle date format: YYYYMMDD
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const date = new Date(`${year}-${month}-${day}`);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const sessions = parseInt(row.metricValues?.[0]?.value || '0', 10);

      return {
        date: dayName,
        users: sessions, // Keep users field name for compatibility, but actual data is sessions
      };
    }) || [];

    return dailyUsers;
  } catch (error: any) {
    const errorMessage = getDetailedErrorMessage(error, 'Fetching daily sessions', propertyId);
    throw new Error(errorMessage);
  }
}

// Get all GA4 data (comprehensive function)
export async function getAllGA4Data(propertyId: string) {
  try {
    if (!propertyId || !/^\d+$/.test(propertyId)) {
      throw new Error(`Invalid Property ID: ${propertyId}. Property ID must be a numeric string.`);
    }
    
    console.log(`[GA4 Service] Fetching all GA4 data for property: ${propertyId}`);
    const [realtime, acquisition, topPages, events, devices, dailyUsers] = await Promise.all([
      getRealtimeData(propertyId),
      getAcquisitionData(propertyId),
      getTopPages(propertyId),
      getEventsData(propertyId),
      getDevicesData(propertyId),
      getDailyUsers(propertyId, 7),
    ]);

    console.log(`[GA4 Service] Successfully fetched all GA4 data for property: ${propertyId}`);
    return {
      realtime,
      acquisition,
      topPages,
      events,
      devices,
      dailyUsers,
    };
  } catch (error: any) {
    const errorMessage = getDetailedErrorMessage(error, 'Fetching all GA4 data', propertyId);
    throw new Error(errorMessage);
  }
}

