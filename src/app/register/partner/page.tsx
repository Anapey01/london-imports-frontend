'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

export default function PartnerRegisterRedirectPage() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        router.replace('/register/seller');
    }, [router]);

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="text-center max-w-md space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500" />
                <h1 className="text-xl font-semibold">Redirecting to Seller Onboarding...</h1>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    We have unified our partner and seller registrations into one seamless onboarding experience.
                </p>
                <div className="pt-2">
                    <Link
                        href="/register/seller"
                        className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-500"
                    >
                        Click here if you are not redirected automatically
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
