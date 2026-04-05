'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

interface PropensityTrackerProps {
    productId: string;
    productName: string;
    category?: string;
}

/**
 * PropensityTracker - London's Imports
 * Tracks 'Active Interest' to enable GA4 Predictive Analysis
 */
export default function PropensityTracker({ productId, productName, category }: PropensityTrackerProps) {
    const startTime = useRef(Date.now());
    const hasTrackedHighPropensity = useRef(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const duration = Math.floor((Date.now() - startTime.current) / 1000);
            
            // If they spend more than 60s, it's a High Propensity signal
            if (duration >= 60 && !hasTrackedHighPropensity.current) {
                trackEvent('high_propensity_view', {
                    item_id: productId,
                    item_name: productName,
                    item_category: category,
                    duration_seconds: duration,
                    interest_score: 'High'
                });
                hasTrackedHighPropensity.current = true;
                clearInterval(timer);
            }
        }, 5000); // Check every 5 seconds

        return () => {
            clearInterval(timer);
            const totalDuration = Math.floor((Date.now() - startTime.current) / 1000);
            
            // Always track view duration on unmount if it's significant
            if (totalDuration > 5) {
                trackEvent('product_view_duration', {
                    item_id: productId,
                    item_name: productName,
                    duration_seconds: totalDuration
                });
            }
        };
    }, [productId, productName, category]);

    return null;
}
