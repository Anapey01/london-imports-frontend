import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const { pathname } = request.nextUrl;

    // Check if we are on the market subdomain
    // Matches: market.londonsimports.com, market.localhost:3000
    const isMarketSubdomain = hostname.startsWith('market.');

    // Force non-www redirect
    if (hostname.startsWith('www.')) {
        const newUrl = new URL(request.url);
        newUrl.hostname = hostname.replace('www.', '');
        return NextResponse.redirect(newUrl);
    }

    if (isMarketSubdomain) {
        // Rewrite the root path to /market
        if (pathname === '/') {
            return NextResponse.rewrite(new URL('/market', request.url));
        }
    } else {
        // Redirect /market path on main domain to the subdomain
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
