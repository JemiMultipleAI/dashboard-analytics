import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check all environment variables
  const envCheck = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 
      `${process.env.GOOGLE_CLIENT_ID.substring(0, 30)}...` : 'MISSING',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'MISSING',
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'MISSING',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'MISSING',
    NODE_ENV: process.env.NODE_ENV || 'MISSING',
  };

  return NextResponse.json({
    message: 'Environment variables check',
    env: envCheck,
    timestamp: new Date().toISOString(),
  });
}



