'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { setAnalyticsUser } from '@/lib/analytics';

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
            console.debug('[AuthRehydration] Token found, initiating session refresh');
            fetchUser().then(() => {
                const user = useAuthStore.getState().user;
                if (user?.id) setAnalyticsUser(user.id);
                console.debug('[AuthRehydration] Session refreshed:', user?.email);
            }).catch((err) => {
                // Verification failed - already handled in fetchUser() if 401
                console.warn('[AuthRehydration] Session refresh failed:', err.message);
            });
        }
    }, [fetchUser]);

    return null;
}
