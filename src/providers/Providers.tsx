'use client';

import React from 'react';
import { ThemeProvider } from "@/providers/ThemeProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ToastProvider } from "@/components/Toast";
import dynamic from "next/dynamic";
import AuthRehydration from "@/components/AuthRehydration";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics as GoogleAnalyticsTag } from '@next/third-parties/google';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';

const CookieBanner = dynamic(() => import("@/components/CookieBanner"), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <QueryProvider>
                <ToastProvider>
                    <AuthRehydration />
                    {children}
                    <CookieBanner />
                    <Analytics />
                    <GoogleAnalyticsTag gaId={GA_MEASUREMENT_ID} />
                </ToastProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}
