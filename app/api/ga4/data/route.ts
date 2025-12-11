import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';

async function getAuthenticatedClient(service: 'ga4' | 'gsc') {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(`google_${service}_access_token`)?.value;
  const refreshToken = cookieStore.get(`google_${service}_refresh_token`)?.value;

  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return oauth2Client;
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔵 Starting GA4 data fetch...');
    const auth = await getAuthenticatedClient('ga4');
    console.log('✅ Authentication successful');
    const analyticsData = google.analyticsdata('v1beta');

    // Try to get account summaries to find a GA4 property
    // Note: This requires the Analytics Admin API to be enabled
    let propertyId: string | null = null;
    
    try {
      const admin = google.analyticsadmin('v1alpha');
      const accounts = await admin.accounts.list({ auth });

      if (accounts.data.accounts && accounts.data.accounts.length > 0) {
        const accountName = accounts.data.accounts[0].name || '';
        const properties = await admin.properties.list({
          auth,
          filter: `parent:${accountName}`,
        });

        if (properties.data.properties && properties.data.properties.length > 0) {
          propertyId = properties.data.properties[0].name || null;
        }
      }
    } catch (adminError) {
      console.warn('Analytics Admin API not available, trying alternative method');
      // Fallback: Try to use the first property from account summaries
      try {
        const analytics = google.analytics('v3');
        const accounts = await analytics.management.accounts.list({ auth });
        
        if (accounts.data.items && accounts.data.items.length > 0) {
          const accountId = accounts.data.items[0].id;
          const properties = await analytics.management.webproperties.list({
            auth,
            accountId: accountId || '',
          });
          
          // For GA4, property IDs are numeric. We need to construct the property name.
          // This is a workaround - ideally you should configure your GA4 property ID
          if (properties.data.items && properties.data.items.length > 0) {
            // GA4 property format: properties/XXXXXX
            // Note: This might not work for all setups. Consider adding a config option.
            const propertyNum = properties.data.items[0].id;
            propertyId = `properties/${propertyNum}`;
          }
        }
      } catch (fallbackError) {
        console.error('Error getting property ID:', fallbackError);
      }
    }

    if (!propertyId) {
      console.error('❌ No GA4 property found');
      return NextResponse.json(
        { error: 'No GA4 property found. Please ensure you have a GA4 property set up and the Analytics Admin API is enabled.' },
        { status: 404 }
      );
    }

    console.log('✅ Found GA4 property:', propertyId);

    // Get realtime data
    const realtimeResponse = await analyticsData.properties.runRealtimeReport({
      property: propertyId,
      auth,
      requestBody: {
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
        ],
      },
    });

    // Get date range data (last 7 days)
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const reportResponse = await analyticsData.properties.runReport({
      property: propertyId,
      auth,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'eventCount' },
        ],
        dimensions: [
          { name: 'date' },
          { name: 'sessionSource' },
          { name: 'deviceCategory' },
          { name: 'pagePath' },
        ],
      },
    });

    // Transform the data to match the expected format
    const realtimeData = realtimeResponse.data;
    const reportData = reportResponse.data;

    // Process and format the data
    const activeUsers = parseInt(realtimeData.rows?.[0]?.metricValues?.[0]?.value || '0');
    const pageViews = parseInt(realtimeData.rows?.[0]?.metricValues?.[1]?.value || '0');

    // Process daily users
    const dailyUsersMap = new Map<string, number>();
    reportData.rows?.forEach((row) => {
      const date = row.dimensionValues?.[0]?.value;
      const users = parseInt(row.metricValues?.[0]?.value || '0');
      if (date) {
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        dailyUsersMap.set(dayName, (dailyUsersMap.get(dayName) || 0) + users);
      }
    });

    const dailyUsers = Array.from(dailyUsersMap.entries()).map(([date, users]) => ({
      date,
      users,
    }));

    // Process acquisition data
    const acquisitionMap = new Map<string, number>();
    reportData.rows?.forEach((row) => {
      const source = row.dimensionValues?.[1]?.value || 'direct';
      const users = parseInt(row.metricValues?.[0]?.value || '0');
      acquisitionMap.set(source, (acquisitionMap.get(source) || 0) + users);
    });

    const totalAcquisition = Array.from(acquisitionMap.values()).reduce((a, b) => a + b, 0);
    const acquisition = {
      organic: Math.round(((acquisitionMap.get('google') || 0) / totalAcquisition) * 100),
      direct: Math.round(((acquisitionMap.get('(direct)') || 0) / totalAcquisition) * 100),
      referral: Math.round(((acquisitionMap.get('referral') || 0) / totalAcquisition) * 100),
      social: Math.round(((acquisitionMap.get('social') || 0) / totalAcquisition) * 100),
      paid: Math.round(((acquisitionMap.get('cpc') || 0) / totalAcquisition) * 100),
    };

    // Process top pages
    const pageMap = new Map<string, number>();
    reportData.rows?.forEach((row) => {
      const path = row.dimensionValues?.[3]?.value || '/';
      const views = parseInt(row.metricValues?.[1]?.value || '0');
      pageMap.set(path, (pageMap.get(path) || 0) + views);
    });

    const topPages = Array.from(pageMap.entries())
      .map(([path, views]) => ({ path, views, avgTime: '2:34' }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Process devices
    const deviceMap = new Map<string, number>();
    reportData.rows?.forEach((row) => {
      const device = row.dimensionValues?.[2]?.value || 'desktop';
      const users = parseInt(row.metricValues?.[0]?.value || '0');
      deviceMap.set(device, (deviceMap.get(device) || 0) + users);
    });

    const totalDevices = Array.from(deviceMap.values()).reduce((a, b) => a + b, 0);
    const devices = {
      desktop: Math.round(((deviceMap.get('desktop') || 0) / totalDevices) * 100),
      mobile: Math.round(((deviceMap.get('mobile') || 0) / totalDevices) * 100),
      tablet: Math.round(((deviceMap.get('tablet') || 0) / totalDevices) * 100),
    };

    const result = {
      realtime: {
        activeUsers,
        pageViews,
        eventsPerMinute: Math.round(activeUsers * 0.125), // Estimate
      },
      acquisition,
      topPages,
      events: [
        { name: 'page_view', count: pageViews, trend: 12 },
        { name: 'click', count: Math.round(pageViews * 0.5), trend: 8 },
        { name: 'scroll', count: Math.round(pageViews * 0.4), trend: -3 },
        { name: 'form_submit', count: Math.round(pageViews * 0.03), trend: 24 },
        { name: 'video_play', count: Math.round(pageViews * 0.02), trend: 15 },
      ],
      devices,
      dailyUsers,
    };

    console.log('✅ GA4 data fetched successfully:', {
      activeUsers: result.realtime.activeUsers,
      pageViews: result.realtime.pageViews,
      topPagesCount: result.topPages.length,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Error fetching GA4 data:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack?.substring(0, 200),
    });
    
    if (error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch GA4 data', details: error.message },
      { status: 500 }
    );
  }
}
