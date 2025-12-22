import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { service } = await request.json(); // 'ga4', 'gsc', or 'ads'
    
    if (!service || !['ga4', 'gsc', 'ads'].includes(service)) {
      return NextResponse.json(
        { error: 'Invalid service. Must be ga4, gsc, or ads' },
        { status: 400 }
      );
    }

    // Get pre-authorized refresh tokens from environment
    const refreshTokens: Record<string, string | undefined> = {
      ga4: process.env.GOOGLE_GA4_REFRESH_TOKEN,
      gsc: process.env.GOOGLE_GSC_REFRESH_TOKEN,
      ads: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    };

    const refreshToken = refreshTokens[service];
    
    if (!refreshToken) {
      console.warn(`⚠️ No pre-authorized refresh token found for ${service}`);
      return NextResponse.json(
        { 
          error: `No pre-authorized refresh token found for ${service}`,
          message: `Please set GOOGLE_${service.toUpperCase()}_REFRESH_TOKEN in your environment variables`
        },
        { status: 400 }
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
                        process.env.GOOGLE_REDIRECT_URI || 
                        'http://localhost:3000/api/auth/google/callback';

    if (!clientId || !clientSecret) {
      console.error('❌ Missing OAuth configuration');
      return NextResponse.json(
        { error: 'OAuth configuration incomplete. Missing client ID or secret.' },
        { status: 500 }
      );
    }

    console.log(`🔄 Pre-authenticating ${service.toUpperCase()} with refresh token...`);

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // Use the refresh token to get a new access token
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    
    if (!credentials.access_token) {
      console.error(`❌ Failed to get access token for ${service}`);
      return NextResponse.json(
        { error: 'Failed to obtain access token from refresh token' },
        { status: 500 }
      );
    }
    
    // Store tokens in cookies
    const cookieStore = await cookies();
    cookieStore.set(`google_${service}_access_token`, credentials.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Store refresh token if provided (or keep existing one)
    const tokenToStore = credentials.refresh_token || refreshToken;
    if (tokenToStore) {
      cookieStore.set(`google_${service}_refresh_token`, tokenToStore, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }

    console.log(`✅ ${service.toUpperCase()} pre-authenticated successfully`);

    return NextResponse.json({ 
      success: true, 
      service,
      message: `${service.toUpperCase()} account pre-authenticated successfully` 
    });
  } catch (error: any) {
    console.error('❌ Pre-auth error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to pre-authenticate', 
        details: error.message || 'Unknown error occurred',
        code: error.code || 'PRE_AUTH_ERROR'
      },
      { status: 500 }
    );
  }
}

