/**
 * London's Imports - Admin Login Page
 * Dedicated login portal for administrators
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';

export default function AdminLoginPage() {
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';

    const { login } = useAuthStore();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Yield to browser to paint loading spinner (fixes INP)
        await new Promise(resolve => setTimeout(resolve, 10));

        try {
            // Use unified authStore to handle login and persistence
            await login(formData.username, formData.password);
            
            // The store's login method calls fetchUser automatically, 
            // so we can now check the user from the store
            const user = useAuthStore.getState().user;

            if (!user || (user.role !== 'ADMIN' && !user.is_staff && !user.is_superuser)) {
                // Not an admin - log out and show error
                await useAuthStore.getState().logout();
                setError('Access denied. This portal is for administrators only.');
                setLoading(false);
                return;
            }

            // Success - redirect to admin dashboard
            router.push('/dashboard/admin');
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { detail?: string } } };
            setError(errorObj.response?.data?.detail || 'Invalid credentials or network error');
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 lg:p-8 transition-colors duration-700 ${isDark ? 'bg-slate-950' : 'bg-slate-50'} relative overflow-hidden`}>
            {/* Background Architectural Grid Pattern */}
            <div className={`absolute inset-0 pointer-events-none ${isDark ? 'opacity-[0.03]' : 'opacity-[0.02]'}`} 
                 style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} 
            />

            {/* Glowing Accent Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/20 rounded-full blur-[120px] pointer-events-none opacity-50" />

            <div className="w-full max-w-lg relative z-10">
                <div className="flex flex-col items-center mb-12 relative">
                    <div className="absolute w-px h-16 bg-slate-200 dark:bg-slate-800 -top-16 left-1/2 -translate-x-1/2" />
                    <div className={`w-16 h-16 border flex items-center justify-center mb-8 relative z-10 bg-white dark:bg-slate-950 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                        <svg className={`w-6 h-6 ${isDark ? 'text-white' : 'text-slate-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div className="absolute -inset-1 border border-slate-900/5 dark:border-white/5" />
                    </div>
                    <h1 className={`text-3xl font-serif font-bold tracking-tight text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        System Authentication
                    </h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="h-px w-8 bg-rose-500" />
                        <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                            AUTHORIZED PERSONNEL ONLY
                        </p>
                        <div className="h-px w-8 bg-rose-500" />
                    </div>
                </div>

                {/* Login Form Card */}
                <div className={`bg-white dark:bg-slate-950 border ${isDark ? 'border-slate-800' : 'border-slate-200'} p-8 sm:p-12 relative group`}>
                    {/* Decorative Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-slate-900 dark:border-white opacity-20 -translate-x-px -translate-y-px" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-900 dark:border-white opacity-20 translate-x-px -translate-y-px" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-slate-900 dark:border-white opacity-20 -translate-x-px translate-y-px" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-slate-900 dark:border-white opacity-20 translate-x-px translate-y-px" />

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
                            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <p className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest leading-relaxed">
                                {error}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="relative">
                                <label className={`absolute -top-2.5 left-4 px-1 text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500 bg-slate-950' : 'text-slate-600 bg-white'}`}>
                                    Access ID
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    spellCheck={false}
                                    className={`w-full px-5 py-4 bg-transparent border text-sm transition-all outline-none ${isDark
                                        ? 'border-slate-800 text-white placeholder:text-slate-700 focus:border-rose-500'
                                        : 'border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-rose-500'
                                        }`}
                                    placeholder="Enter your system username"
                                />
                            </div>

                            <div className="relative">
                                <label className={`absolute -top-2.5 left-4 px-1 text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500 bg-slate-950' : 'text-slate-600 bg-white'}`}>
                                    Passkey
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className={`w-full px-5 py-4 bg-transparent border text-sm transition-all outline-none tracking-[0.2em] ${isDark
                                        ? 'border-slate-800 text-white placeholder:text-slate-700 focus:border-rose-500'
                                        : 'border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-rose-500'
                                        }`}
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <Link
                                href="/admin/forgot-password"
                                className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Recover Passkey
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 flex items-center justify-center gap-3 transition-all ${
                                isDark ? 'bg-white hover:bg-slate-200 text-slate-950' : 'bg-slate-950 hover:bg-slate-800 text-white'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <>
                                    <div className={`w-3 h-3 border-2 border-t-transparent rounded-full animate-spin ${isDark ? 'border-slate-900' : 'border-white'}`} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">VERIFYING...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">INITIALIZE SESSION</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className={`mt-10 pt-6 border-t ${isDark ? 'border-slate-800/50' : 'border-slate-100'} flex items-center gap-4`}>
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                            <svg className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className={`text-[9px] font-bold uppercase tracking-widest leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                            Secure Node. All authentication <br />
                            attempts are logged and monitored.
                        </p>
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
                    <Link
                        href="/"
                        className={`text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        RETURN TO PUBLIC SITE
                    </Link>
                    
                    <Link
                        href="/admin/signup"
                        className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isDark ? 'text-rose-500 hover:text-rose-400' : 'text-rose-700 hover:text-rose-600'}`}
                    >
                        REQUEST CLEARANCE
                    </Link>
                </div>
            </div>
        </div>
    );
}
