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

        // Purge only stale HTML navigation cache so users get fresh HTML while preserving static assets and images
        if ('caches' in window) {
            caches.keys().then((keys) => {
                keys.forEach((key) => {
                    if (key === 'pages-cache') {
                        caches.delete(key);
                    }
                });
            }).catch(() => {});
        }
    }, []); // Run once on mount

    return null;
}
