'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

interface ScrollDepthTrackerProps {
    pageName: string;
}

/**
 * ScrollDepthTracker - London's Imports
 * Tracks content resonance (how far they read)
 */
const THRESHOLDS = [25, 50, 75, 100];

export default function ScrollDepthTracker({ pageName }: ScrollDepthTrackerProps) {
    const trackedThresholds = useRef<Set<number>>(new Set());

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) return;

            const scrollPercent = (window.scrollY / scrollHeight) * 100;

            THRESHOLDS.forEach(threshold => {
                if (scrollPercent >= threshold && !trackedThresholds.current.has(threshold)) {
                    trackEvent('scroll_depth', {
                        page_name: pageName,
                        depth: threshold,
                        depth_label: `${threshold}%`
                    });
                    trackedThresholds.current.add(threshold);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check in case the page is short or already scrolled
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [pageName]);

    return null;
}
