import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // Service type: 'ga4', 'gsc', or 'ads'

  if (!code || !state) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.BASE_URL || 
                    'http://localhost:3000';
    return NextResponse.redirect(new URL('/dashboard?error=auth_failed', baseUrl));
  }

  // Get environment variables (read at runtime)
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
                      process.env.GOOGLE_REDIRECT_URI || 
                      'http://localhost:3000/api/auth/google/callback';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  process.env.BASE_URL || 
                  'http://localhost:3000';

  console.log('=== OAuth Callback ===');
  console.log('Redirect URI:', redirectUri);
  console.log('Base URL:', baseUrl);

  if (!clientId || !clientSecret) {
    console.error('Missing required OAuth credentials in callback');
    return NextResponse.redirect(new URL('/dashboard?error=config_error', baseUrl));
  }

  // Create OAuth client inside the function
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in httpOnly cookies (in production, use a secure session store)
    const cookieStore = await cookies();
    cookieStore.set(`google_${state}_access_token`, tokens.access_token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    if (tokens.refresh_token) {
      cookieStore.set(`google_${state}_refresh_token`, tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return NextResponse.redirect(new URL(`/dashboard?connected=${state}`, baseUrl));
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    return NextResponse.redirect(new URL('/dashboard?error=auth_failed', baseUrl));
  }
}

