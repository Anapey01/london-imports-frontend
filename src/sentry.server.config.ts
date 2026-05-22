import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Errors only — no performance tracing to save Neon/Vercel compute
    tracesSampleRate: 0.0,
    debug: false,
});
