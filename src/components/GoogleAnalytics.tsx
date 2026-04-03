'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';

/**
 * London's Imports - Google Analytics Tracker
 * Manually tracks page_view events on navigation in Next.js App Router
 */
export default function GoogleAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            const url = pathname + searchParams.toString();
            window.gtag('config', GA_MEASUREMENT_ID, {
                page_path: url,
            });
        }
    }, [pathname, searchParams]);

    return null;
}
