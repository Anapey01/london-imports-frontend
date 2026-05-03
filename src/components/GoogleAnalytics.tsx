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
            if (typeof window === 'undefined') return;
            
            // Ensure gtag is available
            const gtag = (window as any).gtag || function() { (window as any).dataLayer.push(arguments); };
            
            const stored = localStorage.getItem('london_imports_cookie_consent_v2');
            if (stored) {
                try {
                    const consent = JSON.parse(stored);
                    
                    // Update Google Consent Mode effectively
                    gtag('consent', 'update', {
                        'analytics_storage': consent.analytics ? 'granted' : 'denied',
                        'ad_storage': consent.marketing ? 'granted' : 'denied',
                        'personalization_storage': consent.personalization ? 'granted' : 'denied',
                    });

                    // Consent mode is now updated. 
                    // Page views are handled automatically by the tag in layout.tsx.
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
