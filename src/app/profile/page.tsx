'use client';

/**
 * Root Profile Page
 * On mobile: Acts as the main menu (sidebar is shown by layout, content is hidden).
 * On desktop: Redirects to Overview dashboard.
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();

    useEffect(() => {
        // On desktop, we don't want a "blank" overview, so we redirect to the actual overview
        if (window.innerWidth >= 1024) {
            router.replace('/profile/overview');
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[400px] lg:hidden">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-content-secondary opacity-50 animate-pulse">
                Select an option from the menu
            </p>
        </div>
    );
}
