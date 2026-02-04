import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
    // SIMPLIFIED MODE: Single Vendor (London's Imports) Only
    // We are temporarily disabling all subdomain/tenant logic to focus on the main site stability.
    // DISABLED: This middleware was running on every request and consuming Vercel quotas
    // for no benefit. Kept for future use if needed.

    return NextResponse.next();
}

export const config = {
    // DISABLED: Empty matcher = middleware never runs
    // This saves BOTH function invocations AND edge requests on Vercel
    // Original matcher preserved in comment for reference:
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
    matcher: [],
};
