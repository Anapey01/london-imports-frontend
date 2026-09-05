/**
 * London's Imports - React Query Provider with Safe Persistence Fallback
 */
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { useState, useEffect } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 60 * 2, // 2 hours (better for offline)
                gcTime: 1000 * 60 * 60 * 24, // 24 hours
                refetchOnWindowFocus: false,
                retry: 1, // Minimize network noise when flaky
            },
        },
    }));

    const [persister, setPersister] = useState<any>(null);

    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const testKey = '__storage_test__';
                window.localStorage.setItem(testKey, testKey);
                window.localStorage.removeItem(testKey);

                const syncPersister = createSyncStoragePersister({
                    storage: window.localStorage,
                    key: 'LONDON_IMPORTS_QUERY_CACHE',
                });
                setPersister(syncPersister);
            }
        } catch (e) {
            console.warn('[QueryProvider] Storage persistence unavailable, running in-memory:', e);
        }
    }, []);

    if (persister) {
        return (
            <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{ persister }}
            >
                {children}
            </PersistQueryClientProvider>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
