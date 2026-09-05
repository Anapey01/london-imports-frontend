'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * London's Imports - Auth Rehydration
 * Checks for existing session on boot and refreshes user data
 */
export default function AuthRehydration() {
    const { fetchUser, isAuthenticated } = useAuthStore();

    useEffect(() => {
        // If persisted session is authenticated, refresh profile on boot
        if (isAuthenticated) {
            fetchUser().catch(() => {
                // Silently handled in store (cleans up if session expired)
            });
        }
    }, [isAuthenticated, fetchUser]);

    return null;
}
