'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import SidebarNav from '@/components/profile/SidebarNav';

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isLoading: authLoading, fetchUser, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }
        
        if (isAuthenticated) {
            fetchUser();
        }
    }, [isAuthenticated, authLoading, router, fetchUser]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-surface">
                <div className="w-full border-b border-border-standard pt-24 md:pt-28">
                    <div className="max-w-6xl mx-auto px-6 py-10">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="h-20 w-20 rounded-full animate-pulse bg-surface-card" />
                            <div className="flex-1 text-center sm:text-left space-y-3">
                                <div className="h-8 w-48 rounded animate-pulse bg-surface-card" />
                                <div className="h-4 w-32 rounded animate-pulse bg-surface-card" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-52 shrink-0 space-y-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-10 rounded-lg animate-pulse bg-surface-card" />
                            ))}
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="h-8 w-32 rounded animate-pulse bg-surface-card" />
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-20 rounded-xl animate-pulse bg-surface-card" />
                                ))}
                            </div>
                            <div className="h-64 rounded-xl animate-pulse bg-surface-card" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 bg-surface">
            <div className="max-w-6xl mx-auto px-6 relative z-20 pt-20 md:pt-24">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Sidebar */}
                    <SidebarNav handleLogout={handleLogout} />

                    {/* Content Area */}
                    <div className="flex-1 py-8 min-h-[600px]">
                        {children}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
