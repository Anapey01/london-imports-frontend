'use client';

import { useEffect } from 'react';

/**
 * PWAUpdater - Forces Service Worker updates on every page load.
 * Ensures users always get the latest version, not stale cached content.
 */
export default function PWAUpdater() {
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

        // Check for a waiting SW and activate it immediately
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (const registration of registrations) {
                // Force update check
                registration.update().catch(() => {});

                // If there's already a waiting worker, skip waiting and reload
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                    return;
                }

                // Listen for a new SW becoming available
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                        }
                    });
                });
            }
        }).catch(() => {});

        // Also clear caches that don't match the current deployment
        if ('caches' in window) {
            caches.keys().then((keys) => {
                keys.forEach((key) => {
                    // Keep only the current precache; purge old ones
                    if (!key.includes('workbox-precache') && !key.includes('next-data')) {
                        caches.delete(key);
                    }
                });
            }).catch(() => {});
        }
    }, []); // Run once on mount

    return null;
}
