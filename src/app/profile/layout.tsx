'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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
        <div className="min-h-screen pb-20 bg-white font-sans text-slate-900 overflow-x-hidden">
            {/* Architectural Header Bridge */}
            <div className="w-full bg-white border-b border-slate-100/80 pt-20 md:pt-24 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
                        {/* Identity Node */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-full border border-slate-200 p-1 bg-white shadow-sm transition-transform duration-500 group-hover:rotate-6">
                                    <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                                        <span className="text-3xl font-serif font-black text-slate-300">
                                            {user.first_name?.[0] || user.username?.[0]}
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-brand-emerald text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                </div>
                            </div>
                            
                            <div className="text-center sm:text-left pt-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2">Customer Profile</p>
                                <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none mb-3">
                                    {user.first_name} {user.last_name}
                                </h1>
                                <div className="flex items-center justify-center sm:justify-start gap-4">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Verified Member</span>
                                </div>
                            </div>
                        </div>

                        {/* Operational Metrics (Architectural Grid) */}
                        <div className="hidden md:flex items-stretch border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
                            <div className="px-8 py-6 border-r border-slate-100">
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Member Since</p>
                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                    {user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Pending'}
                                </p>
                            </div>
                            <div className="px-8 py-6 bg-slate-50/50">
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Member ID</p>
                                <p className="text-sm font-black text-slate-800 tabular-nums">
                                    #{user.id?.toString().slice(-4).toUpperCase() || 'STND'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.4] pointer-events-none" />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Sidebar Anchor */}
                    <div className={`w-full lg:w-52 shrink-0 ${pathname === '/profile' ? 'block' : 'hidden lg:block'} pt-8`}>
                        <div className="sticky top-24">
                            <SidebarNav handleLogout={handleLogout} />
                        </div>
                    </div>

                    {/* Operational Viewport */}
                    <div className={`flex-1 py-8 min-h-[600px] ${pathname === '/profile' ? 'hidden lg:block' : 'block'}`}>
                        {/* Navigation Node */}
                        {pathname !== '/profile' && (
                            <Link 
                                href="/profile"
                                className="lg:hidden inline-flex items-center gap-3 mb-10 group"
                            >
                                <div className="p-2 rounded-full border border-slate-200 group-hover:bg-slate-50 transition-colors">
                                    <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-900 transition-colors">Back to Dashboard</span>
                            </Link>
                        )}
                        <div className="animate-fade-in-up">
                            {children}
                        </div>
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
