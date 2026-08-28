import { NextResponse } from 'next/server';

/**
 * Vercel Cron → Django Webhook
 * 
 * Triggered daily at 6 AM GMT by Vercel Cron (see vercel.json).
 * Calls the backend's /api/v1/orders/cron/daily/ endpoint which
 * runs all scheduled maintenance tasks (batch cutoffs, cart cleanup,
 * delivery reminders, auto-confirmations, review requests, birthday
 * wishes, reservation sync, etc.)
 * 
 * Security: Validated by CRON_SECRET on both Vercel and Render.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://london-imports-api.onrender.com/api/v1';
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');

    if (!CRON_SECRET) {
        console.error('[Cron] CRON_SECRET is not configured');
        return NextResponse.json(
            { error: 'CRON_SECRET not configured' },
            { status: 500 }
        );
    }

    if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        // Strip /api/v1 suffix if present to build the base URL
        const baseUrl = BACKEND_URL.replace(/\/api\/v1\/?$/, '');
        const cronUrl = `${baseUrl}/api/v1/orders/cron/daily/`;

        console.log(`[Cron] Triggering daily tasks at ${new Date().toISOString()}`);

        const response = await fetch(cronUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CRON_SECRET}`,
            },
            // Vercel serverless functions have a 10s default timeout on Hobby
            // The backend has a 120s Gunicorn timeout
            signal: AbortSignal.timeout(60000),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[Cron] Backend returned ${response.status}:`, data);
            return NextResponse.json(
                { error: 'Backend task execution failed', details: data },
                { status: response.status }
            );
        }

        console.log('[Cron] Daily tasks completed successfully:', data);

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            results: data,
        });
    } catch (error) {
        console.error('[Cron] Failed to trigger daily tasks:', error);
        return NextResponse.json(
            { error: 'Failed to reach backend', message: String(error) },
            { status: 500 }
        );
    }
}
