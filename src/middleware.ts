import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept stale CSS hashes requested by cached HTML and rewrite to valid legacy-css
  if (pathname === '/_next/static/css/22d843d29efef3ed.css') {
    return NextResponse.rewrite(new URL('/legacy-css/22d843d29efef3ed.css', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/_next/static/css/22d843d29efef3ed.css',
  ],
};
