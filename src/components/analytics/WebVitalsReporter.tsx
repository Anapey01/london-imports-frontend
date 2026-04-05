'use client';

import { useReportWebVitals } from 'next/web-vitals';

interface WebVitalMetric {
    id: string;
    name: string;
    label: string;
    value: number;
}

/**
 * WebVitalsReporter - London's Imports
 * Pipes Core Web Vitals (SEO health) to GA4
 * 
 * LCP: Largest Contentful Paint (Loading)
 * CLS: Cumulative Layout Shift (Stability) 
 * FID: First Input Delay (Interaction)
 */
export default function WebVitalsReporter() {
    useReportWebVitals((metric: WebVitalMetric) => {
        const { id, name, label, value } = metric;

        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', name, {
                event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
                value: Math.round(name === 'CLS' ? value * 1000 : value), // CLS is a ratio, GA4 likes integers
                event_label: id,
                non_interaction: true, // Don't affect bounce rate
            });
        }
    });

    return null;
}
