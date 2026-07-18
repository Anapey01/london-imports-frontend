import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Errors only — no performance tracing to save Vercel compute
    tracesSampleRate: 0.0,
    debug: false,
    replaysOnErrorSampleRate: 0.0,
    replaysSessionSampleRate: 0.0,

    integrations: [
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],

    // Filter out known non-actionable errors to keep Sentry signal clean
    beforeSend(event, hint) {
        const error = hint?.originalException;
        const message = typeof error === 'string' ? error : (error as Error)?.message || '';
        const stackFrames = event.exception?.values?.[0]?.stacktrace?.frames || [];
        const stackStr = stackFrames.map((f) => f.filename || '').join(' ');

        // 1. PWA ServiceWorker registration aborted (expected on slow mobile networks)
        if (message.includes('Failed to register a ServiceWorker')) {
            return null;
        }

        // 2. "Rejected" from Workbox SW registration promise (no message, comes from SW chunk)
        if ((message === 'Rejected' || message === '') && stackStr.includes('serviceWorker')) {
            return null;
        }

        // 3. "Load failed" on iOS — OS kills fetch() when app is backgrounded or network drops
        //    Only suppress if it originates from a SW/Workbox chunk (not real app errors)
        if (message === 'Load failed' && (stackStr.includes('_next/static/chunks') || stackStr === '')) {
            return null;
        }

        // 4. ResizeObserver loop limit (browser internal, not our bug)
        if (message.includes('ResizeObserver loop limit exceeded')) {
            return null;
        }

        // 5. Browser extension interference
        if (message.includes('chrome-extension') || message.includes('__crExtension') || stackStr.includes('chrome-extension')) {
            return null;
        }

        // 6. Snapchat In-App Browser injected bridge errors (non-actionable external code)
        if (message.includes('SCDynimacBridge') || message.includes('SCDynamicBridge')) {
            return null;
        }

        // 7. General client-side network offline/disconnect errors (network dropouts are not app bugs)
        if (message === 'Network Error' || message.includes('NetworkError') || message.includes('Failed to fetch')) {
            return null;
        }

        // 8. Service Worker registration "Rejected" errors (incognito mode/blocked by browser)
        if (message.includes('Rejected') && (stackStr.toLowerCase().includes('serviceworker') || stackStr.includes('register') || stackStr.includes('sw.js'))) {
            return null;
        }

        // 9. Service Worker script load failures (network disconnects/interruptions)
        if (message.includes('sw.js') && (message.includes('load failed') || message.includes('failed to load') || message.includes('Load failed'))) {
            return null;
        }

        return event;
    },
});
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
