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
        if (typeof window === 'undefined') return;

        const authStorage = localStorage.getItem('auth-storage');
        let hasToken = false;
        
        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage);
                hasToken = !!parsed.state?.accessToken;
            } catch (e) {
                console.debug('[AuthRehydration] No valid auth storage found');
            }
        }

        if (hasToken) {
            fetchUser().catch(() => {
                // Silently handled in store (cleans up if token is expired)
            });
        }
    }, [fetchUser]);

    return null;
}
