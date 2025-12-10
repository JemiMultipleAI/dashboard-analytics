import { NextRequest, NextResponse } from 'next/server';
import { getAllGA4Data, getRealtimeData, getAcquisitionData, getTopPages, getEventsData, getDevicesData, getDailyUsers } from '@/lib/ga4Service';
import { getPropertyId } from '@/lib/getPropertyId';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const propertyId = searchParams.get('propertyId') || getPropertyId();

    console.log(`[GA4 API] Request received - endpoint: ${endpoint || 'all'}, propertyId: ${propertyId}`);

    if (!propertyId) {
      const errorMsg = 'Property ID is required. Please configure NEXT_PUBLIC_GA4_PROPERTY_ID in .env.local or set it in the API route.';
      console.error(`[GA4 API] ${errorMsg}`);
      return NextResponse.json({ 
        success: false, 
        error: errorMsg,
        details: 'Property ID not found in configuration'
      }, { status: 400 });
    }

    // Validate Property ID format
    if (!/^\d+$/.test(propertyId)) {
      const errorMsg = `Invalid Property ID format: ${propertyId}. Property ID must be a numeric string.`;
      console.error(`[GA4 API] ${errorMsg}`);
      return NextResponse.json({ 
        success: false, 
        error: errorMsg,
        details: 'Property ID must contain only digits'
      }, { status: 400 });
    }

    let data;
    try {
      switch (endpoint) {
        case 'realtime':
          data = await getRealtimeData(propertyId);
          break;
        case 'acquisition':
          data = await getAcquisitionData(propertyId);
          break;
        case 'topPages':
          data = await getTopPages(propertyId);
          break;
        case 'events':
          data = await getEventsData(propertyId);
          break;
        case 'devices':
          data = await getDevicesData(propertyId);
          break;
        case 'dailyUsers':
          const days = parseInt(searchParams.get('days') || '7', 10);
          data = await getDailyUsers(propertyId, days);
          break;
        default:
          data = await getAllGA4Data(propertyId);
      }
      
      console.log(`[GA4 API] Successfully fetched data for endpoint: ${endpoint || 'all'}`);
      return NextResponse.json({ success: true, data });
    } catch (apiError: any) {
      // Catch GA4 API call errors
      const errorMessage = apiError?.message || 'Unknown error occurred while fetching GA4 data';
      console.error(`[GA4 API] Error fetching data for endpoint ${endpoint || 'all'}:`, errorMessage);
      
      // Check if it's a permission error
      if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('does not have access')) {
        return NextResponse.json({ 
          success: false, 
          error: errorMessage,
          details: `Service account may not have access to property ${propertyId}. Please check Google Analytics permissions.`,
          troubleshooting: [
            '1. Go to Google Analytics Admin',
            '2. Navigate to Property Access Management',
            `3. Add service account: dashboard-connect@mineral-liberty-476714-k9.iam.gserviceaccount.com`,
            '4. Grant at least "Viewer" role'
          ]
        }, { status: 403 });
      }
      
      // Check if it's an invalid Property ID
      if (errorMessage.includes('INVALID_ARGUMENT') || errorMessage.includes('Invalid Property ID')) {
        return NextResponse.json({ 
          success: false, 
          error: errorMessage,
          details: `Property ID ${propertyId} may be invalid or does not exist.`,
          troubleshooting: [
            '1. Verify the Property ID in Google Analytics',
            '2. Ensure you are using the correct numeric Property ID (not Measurement ID)',
            '3. Check that the property exists and is active'
          ]
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        success: false, 
        error: errorMessage,
        details: apiError?.details || 'An error occurred while fetching GA4 data'
      }, { status: 500 });
    }
  } catch (error: any) {
    // Catch other unexpected errors
    const errorMessage = error?.message || 'An unexpected error occurred';
    console.error(`[GA4 API] Unexpected error:`, errorMessage, error);
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      details: 'An unexpected error occurred while processing the request'
    }, { status: 500 });
  }
}
