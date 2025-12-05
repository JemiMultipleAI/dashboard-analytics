import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This is a basic middleware - in a real app, you'd check authentication
  // For now, we'll let the client-side handle redirects via AppContext
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};

