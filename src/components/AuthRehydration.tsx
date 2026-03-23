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
            fetchUser().then(() => {
                const user = useAuthStore.getState().user;
                if (user?.id) setAnalyticsUser(user.id);
            }).catch(() => {
                // Verification failed, store will clear itself
                console.warn('Auth rehydration failed: Session potentially expired');
            });
        }
    }, [fetchUser]);

    return null;
}
