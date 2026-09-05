/**
 * London's Imports - React Query Provider with Safe Persistence
 *
 * IMPORTANT: We always render PersistQueryClientProvider from the very first render.
 * The persister uses a safe wrapper that catches all storage errors so it never
 * crashes in TWA/WebView environments where localStorage may be restricted.
 * This avoids the tree-swap bug where switching QueryClientProvider →
 * PersistQueryClientProvider unmounts the entire React tree and destroys all
 * in-flight queries (causing products to vanish on mobile).
 */
'use client';

import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useState } from 'react';

const CACHE_KEY = 'LONDON_IMPORTS_QUERY_CACHE';

/** Persister that silently no-ops when localStorage is unavailable (TWA, private browsing, etc.) */
function createSafePersister() {
    return {
        persistClient: async (client: unknown) => {
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(client));
            } catch {
                // Storage unavailable or quota exceeded — safe to ignore
            }
        },
        restoreClient: async () => {
            try {
                const raw = localStorage.getItem(CACHE_KEY);
                return raw ? JSON.parse(raw) : undefined;
            } catch {
                return undefined;
            }
        },
        removeClient: async () => {
            try {
                localStorage.removeItem(CACHE_KEY);
            } catch {
                // Safe to ignore
            }
        },
    };
}

// Stable singleton — created once at module level, never changes between renders
const safePersister = createSafePersister();

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 60 * 2, // 2 hours
                        gcTime: 1000 * 60 * 60 * 24,   // 24 hours
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            })
    );

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: safePersister }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}
