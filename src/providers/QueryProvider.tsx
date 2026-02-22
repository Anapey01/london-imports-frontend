/**
 * London's Imports - React Query Provider with Persistence
 */
'use client';

import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { useState } from 'react';

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

    // LocalStorage persister for offline data
    const persister = typeof window !== 'undefined'
        ? createSyncStoragePersister({
            storage: window.localStorage,
            key: 'LONDON_IMPORTS_QUERY_CACHE',
        })
        : undefined;

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: persister! }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}
