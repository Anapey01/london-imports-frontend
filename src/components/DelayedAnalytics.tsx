'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function DelayedAnalytics({ gaId }: { gaId: string }) {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        // Delay loading by 5 seconds OR until user interaction
        const timer = setTimeout(() => setShouldLoad(true), 5000);

        const handleInteraction = () => {
            setShouldLoad(true);
            clearTimeout(timer);
            cleanup();
        };

        const cleanup = () => {
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('click', handleInteraction);
        };

        window.addEventListener('scroll', handleInteraction, { passive: true });
        window.addEventListener('mousemove', handleInteraction, { passive: true });
        window.addEventListener('touchstart', handleInteraction, { passive: true });
        window.addEventListener('click', handleInteraction, { passive: true });

        return () => {
            clearTimeout(timer);
            cleanup();
        };
    }, []);

    if (!shouldLoad) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
            </Script>
        </>
    );
}
