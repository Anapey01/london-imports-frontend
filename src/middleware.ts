import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const host = request.headers.get('host') || '';

    // Route market.londonsimports.com to Local Market directory
    if (host.startsWith('market.')) {
        const { pathname } = request.nextUrl;
        if (pathname === '/') {
            return NextResponse.rewrite(new URL('/market', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/'],
};
