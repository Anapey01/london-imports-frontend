'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GA_MEASUREMENT_ID, trackException } from '@/lib/analytics';

/**
 * London's Imports - Consent & Error Tracker
 * Synchronizes cookie consent with GTM/GA4 and tracks client-side exceptions.
 * Page views are handled automatically by @next/third-parties/google.
 */
export default function GoogleAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleConsent = () => {
            const stored = localStorage.getItem('london_imports_cookie_consent_v2');
            if (stored && typeof window !== 'undefined' && window.gtag) {
                try {
                    const consent = JSON.parse(stored);
                    
                    // Update Google Consent Mode effectively
                    window.gtag('consent', 'update', {
                        'analytics_storage': consent.analytics ? 'granted' : 'denied',
                        'ad_storage': consent.marketing ? 'granted' : 'denied',
                        'personalization_storage': consent.personalization ? 'granted' : 'denied',
                    });

                    // Log virtual page view for SPA navigation if GTM isn't auto-tracking history
                    if (consent.analytics) {
                        window.gtag('event', 'page_view', {
                            page_location: window.location.href,
                            page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
                            send_to: GA_MEASUREMENT_ID
                        });
                    }
                } catch (e) { 
                    console.error('Consent Sync Error:', e); 
                }
            }
        };

        handleConsent();
        window.addEventListener('cookieConsentUpdate', handleConsent);

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
