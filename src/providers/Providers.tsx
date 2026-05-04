'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from "@/providers/ThemeProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ToastProvider } from "@/components/Toast";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics as GoogleAnalyticsTag } from '@next/third-parties/google';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';

const AuthRehydration = dynamic(() => import("@/components/AuthRehydration"), { ssr: false });
const CookieBanner = dynamic(() => import("@/components/CookieBanner"), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <ThemeProvider>
            <QueryProvider>
                <ToastProvider>
                    <AuthRehydration />
                    {children}
                    <CookieBanner />
                    {mounted && (
                        <>
                            <Analytics />
                            <GoogleAnalyticsTag gaId={GA_MEASUREMENT_ID} />
                        </>
                    )}
                </ToastProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}
