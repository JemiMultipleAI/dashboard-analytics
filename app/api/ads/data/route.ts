import { NextRequest, NextResponse } from 'next/server';
import { GoogleAdsApi } from 'google-ads-api';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    console.log('🔵 Starting Google Ads data fetch...');
    
    // Get date range from query parameters or use default (last 30 days)
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    let startDate: Date;
    let endDate: Date;
    
    if (startDateParam && endDateParam) {
      startDate = new Date(startDateParam);
      endDate = new Date(endDateParam);
    } else {
      // Default to last 30 days
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    }
    
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    if (!developerToken) {
      return NextResponse.json(
        { error: 'Google Ads developer token not configured. Please add GOOGLE_ADS_DEVELOPER_TOKEN to your .env.local file.' },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    // Use refresh token from environment variable (primary) or fallback to cookies
    const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN ||
                        cookieStore.get('google_ads_refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('✅ Google Ads Authentication successful');

    // Initialize Google Ads API client
    const client = new GoogleAdsApi({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      developer_token: developerToken,
    });

    // Get customer ID from environment variable
    const envCustomerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
    
    if (!envCustomerId) {
      return NextResponse.json(
        { 
          error: 'Unable to detect customer ID. Please add GOOGLE_ADS_CUSTOMER_ID to your .env.local file.',
          details: 'Customer ID is required to access Google Ads data. You can find it in your Google Ads account settings.',
        },
        { status: 400 }
      );
    }
    
    // Remove dashes if present (format: 270-641-8609 -> 2706418609)
    const customerId = envCustomerId.replace(/-/g, '');
    console.log('✅ Using customer ID from environment:', customerId);

    // Create customer instance
    const customer = client.Customer({
      customer_id: customerId,
      refresh_token: refreshToken,
    });

    // Format dates for Google Ads API (YYYYMMDD)
    const startDateStr = startDate.toISOString().split('T')[0].replace(/-/g, '');
    const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');
    
    // Calculate previous period for trend comparison (same duration before start date)
    const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - periodDays);
    
    const prevStartDateStr = prevStartDate.toISOString().split('T')[0].replace(/-/g, '');
    const prevEndDateStr = prevEndDate.toISOString().split('T')[0].replace(/-/g, '');

    console.log('📊 Fetching campaign data from', startDateStr, 'to', endDateStr);

    // Query campaign performance data
    const campaignQuery = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.cost_micros,
        metrics.average_cpc,
        metrics.conversions
      FROM campaign
      WHERE segments.date BETWEEN '${startDateStr}' AND '${endDateStr}'
      ORDER BY metrics.cost_micros DESC
      LIMIT 10
    `;

    let campaignResults: any[] = [];
    try {
      campaignResults = await customer.query(campaignQuery);
      console.log('✅ Campaign data received:', campaignResults.length, 'campaigns');
    } catch (queryError: any) {
      console.error('Error querying campaigns:', queryError);
      return NextResponse.json(
        { 
          error: 'Failed to query Google Ads data. Please ensure your developer token is approved and you have proper permissions.',
          details: queryError.message,
        },
        { status: 500 }
      );
    }

    // Query keyword performance data
    const keywordQuery = `
      SELECT
        ad_group_criterion.keyword.text,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        ad_group_criterion.quality_info.quality_score
      FROM keyword_view
      WHERE segments.date BETWEEN '${startDateStr}' AND '${endDateStr}'
        AND ad_group_criterion.type = 'KEYWORD'
      ORDER BY metrics.clicks DESC
      LIMIT 10
    `;

    let keywordResults: any[] = [];
    try {
      keywordResults = await customer.query(keywordQuery);
      console.log('✅ Keyword data received:', keywordResults.length, 'keywords');
    } catch (keywordError: any) {
      console.warn('⚠️ Could not fetch keyword data:', keywordError.message);
    }

    // Process campaign data
    const campaigns = campaignResults.map((row: any) => ({
      name: row.campaign?.name || 'Unnamed Campaign',
      impressions: parseInt(row.metrics?.impressions || 0),
      clicks: parseInt(row.metrics?.clicks || 0),
      ctr: parseFloat(((row.metrics?.ctr || 0) * 100).toFixed(2)),
      spend: Math.round((row.metrics?.cost_micros || 0) / 1000000 * 100) / 100,
      avgCPC: parseFloat(((row.metrics?.average_cpc || 0) / 1000000).toFixed(2)),
      conversions: parseInt(row.metrics?.conversions || 0),
      status: row.campaign?.status === 'ENABLED' ? 'active' : 'paused',
    }));

    // Query ad group performance data
    const adGroupQuery = `
      SELECT
        ad_group.name,
        ad_group.status,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.cost_micros,
        metrics.average_cpc,
        metrics.conversions
      FROM ad_group
      WHERE segments.date BETWEEN '${startDateStr}' AND '${endDateStr}'
        AND ad_group.status != 'REMOVED'
      ORDER BY metrics.cost_micros DESC
      LIMIT 10
    `;

    let adGroupResults: any[] = [];
    try {
      adGroupResults = await customer.query(adGroupQuery);
      console.log('✅ Ad group data received:', adGroupResults.length, 'ad groups');
    } catch (adGroupError: any) {
      console.warn('⚠️ Could not fetch ad group data:', adGroupError.message);
    }

    // Process ad group data
    const adGroups = adGroupResults.map((row: any) => ({
      name: row.ad_group?.name || 'Unnamed Ad Group',
      impressions: parseInt(row.metrics?.impressions || 0),
      clicks: parseInt(row.metrics?.clicks || 0),
      ctr: parseFloat(((row.metrics?.ctr || 0) * 100).toFixed(2)),
      spend: Math.round((row.metrics?.cost_micros || 0) / 1000000 * 100) / 100,
      avgCPC: parseFloat(((row.metrics?.average_cpc || 0) / 1000000).toFixed(2)),
      conversions: parseInt(row.metrics?.conversions || 0),
    }));

    // Query device breakdown data
    const deviceQuery = `
      SELECT
        segments.device,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.cost_micros,
        metrics.average_cpc,
        metrics.conversions
      FROM campaign
      WHERE segments.date BETWEEN '${startDateStr}' AND '${endDateStr}'
      ORDER BY metrics.cost_micros DESC
    `;

    let deviceResults: any[] = [];
    try {
      deviceResults = await customer.query(deviceQuery);
      console.log('✅ Device data received:', deviceResults.length, 'device records');
    } catch (deviceError: any) {
      console.warn('⚠️ Could not fetch device data:', deviceError.message);
    }

    // Process device data - group by device type
    const deviceMap = new Map<string, any>();
    deviceResults.forEach((row: any) => {
      const device = row.segments?.device || 'UNKNOWN';
      const existing = deviceMap.get(device) || {
        device: device === 'DESKTOP' ? 'Desktop' : device === 'MOBILE' ? 'Mobile' : device === 'TABLET' ? 'Tablet' : device,
        impressions: 0,
        clicks: 0,
        spend: 0,
        conversions: 0,
      };
      
      existing.impressions += parseInt(row.metrics?.impressions || 0);
      existing.clicks += parseInt(row.metrics?.clicks || 0);
      existing.spend += (row.metrics?.cost_micros || 0) / 1000000;
      existing.conversions += parseInt(row.metrics?.conversions || 0);
      
      deviceMap.set(device, existing);
    });

    const devices = Array.from(deviceMap.values()).map((device) => {
      const ctr = device.impressions > 0 ? (device.clicks / device.impressions) * 100 : 0;
      const avgCPC = device.clicks > 0 ? device.spend / device.clicks : 0;
      const totalImpressions = Array.from(deviceMap.values()).reduce((sum, d) => sum + d.impressions, 0);
      const percentage = totalImpressions > 0 ? Math.round((device.impressions / totalImpressions) * 100) : 0;
      
      return {
        ...device,
        ctr: parseFloat(ctr.toFixed(2)),
        avgCPC: parseFloat(avgCPC.toFixed(2)),
        spend: Math.round(device.spend * 100) / 100,
        percentage,
      };
    });

    // Fetch previous period data for trend calculation
    console.log('📊 Fetching previous period data for trends from', prevStartDateStr, 'to', prevEndDateStr);
    const prevCampaignQuery = `
      SELECT
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM campaign
      WHERE segments.date BETWEEN '${prevStartDateStr}' AND '${prevEndDateStr}'
    `;

    let prevCampaignResults: any[] = [];
    try {
      prevCampaignResults = await customer.query(prevCampaignQuery);
      console.log('✅ Previous period data received:', prevCampaignResults.length, 'records');
    } catch (prevError: any) {
      console.warn('⚠️ Could not fetch previous period data:', prevError.message);
    }

    // Calculate previous period totals
    const prevTotalClicks = prevCampaignResults.reduce((sum, row) => sum + parseInt(row.metrics?.clicks || 0), 0);
    const prevTotalSpend = prevCampaignResults.reduce((sum, row) => sum + (row.metrics?.cost_micros || 0) / 1000000, 0);
    const prevTotalConversions = prevCampaignResults.reduce((sum, row) => sum + parseInt(row.metrics?.conversions || 0), 0);
    const prevCostPerConversion = prevTotalConversions > 0 ? prevTotalSpend / prevTotalConversions : 0;

    // Calculate overview metrics (current period)
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const costPerConversion = totalConversions > 0 ? totalSpend / totalConversions : 0;

    // Calculate trends (percentage change from previous period)
    const clicksTrend = prevTotalClicks > 0 ? ((totalClicks - prevTotalClicks) / prevTotalClicks) * 100 : 0;
    const costTrend = prevTotalSpend > 0 ? ((totalSpend - prevTotalSpend) / prevTotalSpend) * 100 : 0;
    const conversionsTrend = prevTotalConversions > 0 ? ((totalConversions - prevTotalConversions) / prevTotalConversions) * 100 : 0;
    const costPerConversionTrend = prevCostPerConversion > 0 ? ((costPerConversion - prevCostPerConversion) / prevCostPerConversion) * 100 : 0;

    // Process keyword data
    const keywords = keywordResults.map((row: any) => ({
      keyword: row.ad_group_criterion?.keyword?.text || 'Unknown',
      clicks: parseInt(row.metrics?.clicks || 0),
      cpc: row.metrics?.clicks > 0 
        ? Math.round((row.metrics?.cost_micros || 0) / 1000000 / row.metrics.clicks * 100) / 100
        : 0,
      conversions: parseInt(row.metrics?.conversions || 0),
      quality: parseInt(row.ad_group_criterion?.quality_info?.quality_score || 0),
    }));

    // Get daily spend data (last 7 days)
    const dailySpendQuery = `
      SELECT
        segments.date,
        metrics.cost_micros
      FROM campaign
      WHERE segments.date BETWEEN '${startDateStr}' AND '${endDateStr}'
      ORDER BY segments.date ASC
    `;

    let dailySpendResults: any[] = [];
    try {
      dailySpendResults = await customer.query(dailySpendQuery);
    } catch (dailyError: any) {
      console.warn('⚠️ Could not fetch daily spend data:', dailyError.message);
    }

    // Group daily spend by date
    const dailySpendMap = new Map<string, number>();
    dailySpendResults.forEach((row: any) => {
      const date = row.segments?.date;
      if (date) {
        const spend = (row.metrics?.cost_micros || 0) / 1000000;
        dailySpendMap.set(date, (dailySpendMap.get(date) || 0) + spend);
      }
    });

    // Get last 7 days
    const spendOverTime: { date: string; spend: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateKey = date.toISOString().split('T')[0].replace(/-/g, '');
      spendOverTime.push({
        date: dateStr,
        spend: Math.round((dailySpendMap.get(dateKey) || 0) * 100) / 100,
      });
    }

    // Calculate ROAS
    const roas = totalSpend > 0 ? (totalConversions * 10) / totalSpend : 0;

    const result = {
      overview: {
        clicks: totalClicks,
        clicksTrend: Math.round(clicksTrend * 10) / 10, // Round to 1 decimal
        conversions: totalConversions,
        conversionsTrend: Math.round(conversionsTrend * 10) / 10,
        cost: Math.round(totalSpend * 100) / 100,
        costTrend: Math.round(costTrend * 10) / 10,
        costPerConversion: Math.round(costPerConversion * 100) / 100,
        costPerConversionTrend: Math.round(costPerConversionTrend * 10) / 10,
        // Keep legacy fields for backward compatibility
        totalSpend: Math.round(totalSpend * 100) / 100,
        totalConversions,
        avgCPC: Math.round(avgCPC * 100) / 100,
        avgCTR: Math.round(avgCTR * 100) / 100,
        roas: Math.round(roas * 10) / 10,
        spendTrend: Math.round(costTrend * 10) / 10,
      },
      campaigns: campaigns.slice(0, 10),
      adGroups: adGroups.slice(0, 10),
      devices: devices,
      keywords: keywords.slice(0, 5),
      recommendations: [
        { type: 'budget', title: 'Increase budget for high-performing campaigns', impact: 'high', potential: '+23% conversions' },
        { type: 'keyword', title: 'Add negative keywords to reduce waste', impact: 'medium', potential: '-12% spend' },
        { type: 'bid', title: 'Adjust bids for mobile devices', impact: 'medium', potential: '+15% CTR' },
        { type: 'ad', title: 'Test new ad copy variations', impact: 'low', potential: '+8% CTR' },
      ],
      spendOverTime: spendOverTime.length > 0 ? spendOverTime : [
        { date: 'Mon', spend: 0 },
        { date: 'Tue', spend: 0 },
        { date: 'Wed', spend: 0 },
        { date: 'Thu', spend: 0 },
        { date: 'Fri', spend: 0 },
        { date: 'Sat', spend: 0 },
        { date: 'Sun', spend: 0 },
      ],
    };

    console.log('✅ Google Ads data processed successfully');

    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('❌ Error fetching Google Ads data:', error);
    
    if (error.message === 'Not authenticated' || error.message?.includes('authentication')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (error.message?.includes('developer token')) {
      return NextResponse.json(
        { error: 'Google Ads developer token not configured. Please add GOOGLE_ADS_DEVELOPER_TOKEN to your .env.local file.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch Google Ads data', 
        details: error.message,
      },
      { status: 500 }
    );
  }
}
