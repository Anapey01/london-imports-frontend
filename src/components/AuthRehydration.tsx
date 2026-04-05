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
            console.debug('[AuthRehydration] Token found, initiating session refresh');
            fetchUser().then(() => {
                const user = useAuthStore.getState().user;
                if (user?.id) {
                    setAnalyticsUser(user.id);
                    
                    // Proactive Intelligence: Loyalty Calculation
                    if (user.date_joined) {
                        const joinedDate = new Date(user.date_joined);
                        const today = new Date();
                        const tenureDays = Math.floor((today.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));
                        trackUserLoyalty(user.order_count || 0, tenureDays);
                    }
                }
                console.debug('[AuthRehydration] Session refreshed:', user?.email);
            }).catch((err) => {
                // Verification failed - already handled in fetchUser() if 401
                console.warn('[AuthRehydration] Session refresh failed:', err.message);
            });
        }
    }, [fetchUser]);

    return null;
}
