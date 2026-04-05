'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GA_MEASUREMENT_ID, trackException } from '@/lib/analytics';

/**
 * London's Imports - Google Analytics Tracker
 * Manually tracks page_view events on navigation in Next.js App Router
 */
export default function GoogleAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleConsent = () => {
            const stored = localStorage.getItem('london_imports_cookie_consent_v2');
            if (stored) {
                try {
                    const consent = JSON.parse(stored);
                    if (consent.analytics) {
                        const url = window.location.pathname + window.location.search;
                        if (typeof window !== 'undefined' && window.gtag) {
                            window.gtag('config', GA_MEASUREMENT_ID, {
                                page_path: url,
                            });
                        }
                    }
                } catch (e) { console.error('Consent Parse Error:', e); }
            } else {
                // Default fallback: No tracking until ack
            }
        };

        handleConsent();
        window.addEventListener('cookieConsentUpdate', handleConsent);

        // 3. Robustness Hardening: Global Error Listener
        const handleError = (event: ErrorEvent) => {
            trackException(event.message, false);
        };
        window.addEventListener('error', handleError);

        return () => {
            window.removeEventListener('cookieConsentUpdate', handleConsent);
            window.removeEventListener('error', handleError);
        };
    }, [pathname, searchParams]);

    return null;
}
