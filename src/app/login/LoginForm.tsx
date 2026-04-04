'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { setAnalyticsUser, trackLogin } from '@/lib/analytics';
import { ArrowUpRight, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import GoogleProtocolButton from '@/components/auth/GoogleProtocolButton';

function LoginFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    const role = searchParams.get('role');
    const emailParam = searchParams.get('email');
    const isRegistered = searchParams.get('registered') === 'true';

    const { login, isLoading } = useAuthStore();
    const [username, setUsername] = useState(emailParam || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(isRegistered ? "Account created! Please sign in to start." : "");

    const getTitle = () => {
        switch (role) {
            case 'vendor': return 'Seller Portal';
            case 'partner': return 'Partner Portal';
            case 'admin': return 'Admin Dashboard';
            default: return 'Welcome Back';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await login(username, password);
            const user = useAuthStore.getState().user;
            if (user?.id) {
                setAnalyticsUser(user.id);
                trackLogin();
            }
            router.push(redirect);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { detail?: string } }, message?: string };
            setError(err.response?.data?.detail || 'Login failed. Please check your email and password.');
        }
    };

    return (
        <div className="min-h-screen bg-white grid lg:grid-cols-2 selection:bg-emerald-100">
            {/* 1. EDITORIAL BRAND PANE (Hidden on Mobile) */}
            <div className="hidden lg:flex flex-col justify-between p-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-16 opacity-30">
                        <div className="h-px w-12 bg-white" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">London&apos;s Imports / 2026 Edition</span>
                    </div>
                    <h2 className="text-7xl lg:text-9xl font-serif font-bold leading-[0.8] tracking-tighter mb-20 italic opacity-20">
                        Direct to Your <br /> Door.
                    </h2>
                    <p className="max-w-xs text-sm font-medium text-slate-400 leading-relaxed italic border-l border-slate-700 pl-8">
                        Every order is a safe and verified step in our shipping network. Reliable and secure.
                    </p>
                </div>
                
                <div className="relative z-10 pt-20 border-t border-slate-800 opacity-20">
                      <span className="text-[9px] font-black uppercase tracking-widest block mb-4">Safe & Secure</span>
                      <p className="text-xs font-medium">Your orders are 100% insured and protected.</p>
                </div>

                {/* Subtle Radial Architecture */}
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />
            </div>

            {/* 2. PROTOCOL FORM PANE */}
            <div className="flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white">
                <div className="w-full max-w-sm">
                    <header className="mb-20">
                        <div className="flex items-center gap-3 mb-8 opacity-20">
                             <div className="h-px w-8 bg-slate-900" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Sign In</span>
                        </div>
                        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tighter leading-none">{getTitle()}</h1>
                        <p className="text-sm font-medium text-slate-400 italic">
                            {role ? `Enter your ${role} details to proceed` : 'Sign in to track your orders and shop.'}
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        {success && (
                            <div className="p-6 bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                                <p className="text-xs font-bold text-emerald-700 leading-relaxed uppercase tracking-tighter">{success}</p>
                            </div>
                        )}
                        {error && (
                            <div className="p-6 bg-slate-50 border border-slate-900/10 flex items-start gap-4">
                                <AlertCircle className="w-4 h-4 text-slate-900 mt-0.5" />
                                <p className="text-xs font-bold text-slate-900 leading-relaxed uppercase tracking-tighter">{error}</p>
                            </div>
                        )}

                        <div className="space-y-10">
                            <div className="group">
                                <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-4 group-focus-within:text-slate-900 transition-colors">
                                    Email or Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="block w-full text-[13px] font-black text-slate-900 bg-transparent border-0 border-b border-slate-100 rounded-none py-4 focus:border-slate-900 focus:ring-0 focus:outline-none transition-all placeholder-slate-200 uppercase tracking-widest"
                                    placeholder="Enter your email..."
                                />
                            </div>

                            <div className="group">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 group-focus-within:text-slate-900 transition-colors">
                                        Your Password
                                    </label>
                                    <Link href="/password-reset" className="text-[9px] font-black text-slate-200 hover:text-slate-900 transition-colors uppercase tracking-widest">
                                        Forgot password?
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full text-[13px] font-black text-slate-900 bg-transparent border-0 border-b border-slate-100 rounded-none py-4 focus:border-slate-900 focus:ring-0 focus:outline-none transition-all placeholder-slate-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group/btn relative w-full h-16 border border-slate-900 transition-all hover:bg-slate-900 flex items-center justify-center gap-4 overflow-hidden"
                        >
                            <span className="relative z-10 text-[11px] font-black text-slate-900 uppercase tracking-[0.5em] group-hover/btn:text-white transition-colors">
                                {isLoading ? 'Checking...' : 'Sign In Now'}
                            </span>
                            {!isLoading && <ArrowUpRight className="relative z-10 w-4 h-4 text-slate-900 group-hover/btn:text-white transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />}
                            <div className="absolute inset-0 bg-slate-900 transition-transform translate-y-full group-hover/btn:translate-y-0" />
                        </button>

                        <div className="pt-6">
                            <GoogleProtocolButton mode="signin" />
                        </div>
                    </form>

                     <footer className="mt-20 pt-16 border-t border-slate-50 flex flex-col items-center gap-8">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">New to London&apos;s?</p>
                          <Link href="/register" className="group/link inline-flex items-center gap-4 text-[11px] font-black text-slate-900 border-b border-black pb-2 hover:opacity-60 transition-all uppercase tracking-[0.3em]">
                             Join Us Today
                             <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                          </Link>
                     </footer>
                </div>
            </div>
        </div>
    );
}

export default function LoginForm() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <LoginFormContent />
        </Suspense>
    );
}
