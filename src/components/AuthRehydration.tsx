'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { setAnalyticsUser, trackUserLoyalty } from '@/lib/analytics';

/**
 * London's Imports - Auth Rehydration
 * Checks for existing session on boot and refreshes user data
 */
export default function AuthRehydration() {
    const { fetchUser } = useAuthStore();

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        // If we have a token but state says not authenticated (or just to be sure on boot)
        if (token) {
            fetchUser().catch(() => {
                // Silently handled in store
            });
        }
    }, [fetchUser]);

    return null;
}
