'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * PWAUpdater - Forces Service Worker updates on critical routes
 * Ensures that users on the checkout page always have the latest payment logic
 */
export default function PWAUpdater() {
    const pathname = usePathname();

    useEffect(() => {
        // Only run on client and if service workers are supported
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {

            // On critical routes like checkout, force a check for SW updates
            if (pathname?.includes('/checkout')) {
                console.log("[PWA] Critical route detected, checking for Service Worker updates...");

                navigator.serviceWorker.getRegistrations().then((registrations) => {
                    for (const registration of registrations) {
                        registration.update().then(() => {
                            // If a new worker is found and waiting, force a reload to let it take control
                            if (registration.waiting) {
                                console.log("[PWA] New version found, reloading to apply...");
                                // We don't reload immediately unless we are sure, 
                                // but we notify the user or just postMessage 'SKIP_WAITING'
                                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        });
                    }
                });
            }
        }
    }, [pathname]);

    return null;
}
