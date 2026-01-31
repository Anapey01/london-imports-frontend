import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const { pathname } = request.nextUrl;

    // Check for subdomains
    // Matches: market.londonsimports.com or store-name.londonsimports.com
    // BUT EXCLUDE: londonsimports.com (root) and www.londonsimports.com

    let isTenantSubdomain = false;
    let subdomain = '';

    // Explicitly check if it is NOT the root domain
    if (hostname === 'londonsimports.com' || hostname === 'www.londonsimports.com') {
        isTenantSubdomain = false;
    }
    // If it has a subdomain part ...
    else if (hostname.includes('.') && !hostname.startsWith('www.')) {
        // Split parts
        const parts = hostname.split('.');
        // If it ends with londonsimports.com, the first part is the subdomain
        if (hostname.endsWith('.londonsimports.com')) {
            subdomain = parts[0];
            isTenantSubdomain = true;
        }
        // Handle localhost subdomains (e.g. nike.localhost:3000)
        else if (hostname.includes('localhost') && parts.length > 1 && parts[0] !== 'localhost') {
            subdomain = parts[0];
            isTenantSubdomain = true;
        }
        // Handle Vercel previews or custom domains
        // Assume any other domain structure with > 2 parts is a potential subdomain
        // BUT be careful not to break vercel.app
        else if (hostname.endsWith('.vercel.app')) {
            // Do nothing for vercel.app previews unless we explicitly want to test subdomains there
        }
    }

    if (isTenantSubdomain) {

        // Handle specific subdomains
        if (subdomain === 'market') {
            if (pathname === '/') {
                return NextResponse.rewrite(new URL('/market', request.url));
            }
        }
        // Exclude other reserved subdomains
        else if (['admin', 'api', 'www'].includes(subdomain)) {
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
        // Main domain logic (londonsimports.com)
        if (pathname.startsWith('/market')) {
            // Redirect /market path on main domain to the subdomain
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
