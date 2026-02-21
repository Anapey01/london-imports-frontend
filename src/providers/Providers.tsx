'use client';

import { ThemeProvider } from "@/providers/ThemeProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ToastProvider } from "@/components/Toast";
import dynamic from "next/dynamic";

const AuthRehydration = dynamic(() => import("@/components/AuthRehydration"), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <QueryProvider>
                <ToastProvider>
                    <AuthRehydration />
                    {children}
                </ToastProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}
