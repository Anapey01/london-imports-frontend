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

    // Filter out known non-actionable errors to reduce noise
    beforeSend(event, hint) {
        const error = hint?.originalException;
        const message = typeof error === 'string' ? error : (error as Error)?.message || '';

        // 1. PWA ServiceWorker registration aborted (expected on slow mobile networks)
        if (message.includes('Failed to register a ServiceWorker') && message.includes('Operation has been aborted')) {
            return null;
        }

        // 2. ResizeObserver loop limit (browser internal, not our bug)
        if (message.includes('ResizeObserver loop limit exceeded')) {
            return null;
        }

        // 3. Browser extension interference
        if (message.includes('chrome-extension') || message.includes('__crExtension')) {
            return null;
        }

        return event;
    },
});
