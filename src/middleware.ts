import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const { pathname } = request.nextUrl;

    // Check for subdomains
    // Matches: market.londonsimports.com or store-name.londonsimports.com
    const isSubdomain = hostname.includes('.') && !hostname.startsWith('www.');

    if (isSubdomain) {
        const subdomain = hostname.split('.')[0];

        // Handle specific subdomains
        if (subdomain === 'market') {
            if (pathname === '/') {
                return NextResponse.rewrite(new URL('/market', request.url));
            }
        }
        // Exclude other reserved subdomains
        else if (['admin', 'api', 'www', 'localhost'].includes(subdomain)) {
            // Do nothing, let them pass
        }
        // Handle Partner Store Subdomains (e.g. nike.londonsimports.com -> /store/nike)
        else {
            // Rewrite root to store page
            if (pathname === '/') {
                return NextResponse.rewrite(new URL(`/store/${subdomain}`, request.url));
            }
        }
    } else {
        // Main domain logic
        if (pathname.startsWith('/market')) {
            return NextResponse.redirect(new URL('https://market.londonsimports.com'));
        }
    }

    // Allow all other requests to proceed as normal
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
