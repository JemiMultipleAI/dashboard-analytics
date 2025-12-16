import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get('service'); // 'ga4', 'gsc', or 'ads'
  
  if (!service) {
    return NextResponse.json({ error: 'Service parameter is required' }, { status: 400 });
  }

  // Get environment variables (read at runtime, not at module load)
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
                      process.env.GOOGLE_REDIRECT_URI || 
                      'http://localhost:3000/api/auth/google/callback';

  // Debug logging (remove in production)
  console.log('=== OAuth Configuration ===');
  console.log('Client ID:', clientId ? `${clientId.substring(0, 20)}...` : 'MISSING');
  console.log('Client Secret:', clientSecret ? 'SET' : 'MISSING');
  console.log('Redirect URI:', redirectUri);
  console.log('Service:', service);

  if (!clientId || !clientSecret) {
    console.error('Missing required OAuth credentials');
    return NextResponse.json(
      { error: 'OAuth configuration error: Missing client ID or secret' },
      { status: 500 }
    );
  }

  // Create OAuth client inside the function to ensure env vars are loaded
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  const scopes = {
    ga4: ['https://www.googleapis.com/auth/analytics.readonly'],
    gsc: ['https://www.googleapis.com/auth/webmasters.readonly'],
    ads: ['https://www.googleapis.com/auth/adwords'],
  };

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes[service as keyof typeof scopes] || scopes.ga4,
    prompt: 'consent',
    state: service, // Pass service type in state
    redirect_uri: redirectUri, // Explicitly set redirect_uri
  });

  console.log('Generated Auth URL:', authUrl.substring(0, 100) + '...');

  return NextResponse.json({ authUrl });
}

