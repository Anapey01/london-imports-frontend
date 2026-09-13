'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import SidebarNav, { MobileProfileNav } from '@/components/profile/SidebarNav';

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isLoading: authLoading, fetchUser, logout } = useAuthStore();
    const router = useRouter();

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        <div className="w-full lg:w-56 shrink-0 space-y-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-9 rounded-sm animate-pulse bg-surface-card" />
                            ))}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="h-7 w-40 rounded animate-pulse bg-surface-card" />
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-20 rounded-sm animate-pulse bg-surface-card" />
                                ))}
                            </div>
                            <div className="h-64 rounded-sm animate-pulse bg-surface-card" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-16 bg-surface font-sans text-content-primary overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 md:pt-6">
                {/* Mobile Tab Navigation Bar (Immediate 1-tap switching) */}
                <MobileProfileNav />

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Desktop Sidebar Navigation */}
                    <aside className="hidden lg:block w-56 shrink-0">
                        <div className="sticky top-28">
                            <SidebarNav handleLogout={handleLogout} user={user} />
                        </div>
                    </aside>

                    {/* Operational Viewport */}
                    <main className="flex-1 min-w-0 min-h-[500px]">
                        <div className="animate-fade-in-up">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
