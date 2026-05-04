/**
 * London's Imports - Login Form
 * Hardened for WCAG 'Understandable' Compliance
 */
'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { setAnalyticsUser, trackLogin, trackEvent } from '@/lib/analytics';
import { ArrowUpRight, ArrowRight, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
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

    useEffect(() => {
        trackEvent('form_start', { form_id: 'login' });
    }, []);

    // Auto-dismiss errors/success messages
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

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
        trackEvent('form_submit', { form_id: 'login' });
        setError('');
        setSuccess('');

        try {
            // Defense in depth: normalize inputs before sending to API
            const normalizedUsername = username.toLowerCase().trim();
            await login(normalizedUsername, password);
            const user = useAuthStore.getState().user;
            if (user?.id) {
                setAnalyticsUser(user.id);
                trackLogin();
                
                // If user is not verified, send them to verification first
                if (!user.email_verified) {
                    router.push(`/verify-email?redirect=${encodeURIComponent(redirect)}`);
                    return;
                }
            }
            router.push(redirect);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { detail?: string } }, message?: string };
            setError(err.response?.data?.detail || 'Login failed. Please check your email and password.');
        }
    };

    const inputClass = "block w-full text-[12px] font-black bg-surface-card border border-border-standard rounded-none py-3.5 px-4 institutional-focus transition-all placeholder:text-content-secondary/30 text-content-primary uppercase tracking-widest";

    return (
        <div className="min-h-screen bg-surface grid lg:grid-cols-2 selection:bg-emerald-100/30">
            {/* 1. EDITORIAL BRAND PANE (Signature Dark Anchor) */}
            <div className="hidden lg:flex flex-col justify-between p-20 bg-[#0a0f1d] text-white relative overflow-hidden border-r border-white/5">
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
                
                <div className="relative z-10 pt-20 border-t border-white/10 opacity-40">
                      <span className="text-[9px] font-black uppercase tracking-widest block mb-4 text-brand-emerald">Safe & Secure</span>
                      <p className="text-xs font-medium text-slate-300">Your orders are 100% insured and protected through SHA-256 encrypted protocols.</p>
                </div>

                {/* Subtle Radial Architecture */}
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />
            </div>

            {/* 2. PROTOCOL FORM PANE */}
            <div className="flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface">
                <div className="w-full max-w-sm">
                    <header className="mb-20">
                        <div className="flex items-center gap-3 mb-8 opacity-40">
                             <Lock className="w-3 h-3 text-content-primary" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-content-primary">Secure Login</span>
                        </div>
                        <h1 className="text-5xl font-serif font-bold text-content-primary mb-6 tracking-tighter leading-none">{getTitle()}</h1>
                        <p className="text-sm font-medium text-content-secondary italic">
                            {role ? `Enter your ${role} credentials to access the secure portal.` : 'Sign in to track your orders and shop from China.'}
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        {success && (
                            <div className="p-6 bg-brand-emerald/10 border border-brand-emerald/20 flex items-start gap-4 rounded-none animate-in fade-in slide-in-from-top-2 duration-500">
                                <CheckCircle2 className="w-4 h-4 text-brand-emerald mt-0.5" />
                                <p className="text-xs font-black text-brand-emerald leading-relaxed uppercase tracking-widest">{success}</p>
                            </div>
                        )}
                        {error && (
                            <div className="p-6 bg-rose-500/10 border border-rose-500/20 flex items-start gap-4 rounded-none animate-in shake duration-500" role="alert" aria-live="polite">
                                <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5" />
                                <p className="text-xs font-black text-rose-500 leading-relaxed uppercase tracking-widest">{error}</p>
                            </div>
                        )}

                        <div className="space-y-10">
                            <div className="group">
                                <label 
                                    htmlFor="login-username"
                                    className="block text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary/60 mb-4 group-focus-within:text-brand-emerald transition-colors"
                                >
                                    Email or Username
                                </label>
                                <input
                                    id="login-username"
                                    type="text"
                                    name="username"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className={inputClass}
                                    placeholder="Enter your email..."
                                />
                            </div>

                            <div className="group">
                                <div className="flex items-center justify-between mb-4">
                                    <label 
                                        htmlFor="login-password"
                                        className="text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary/60 group-focus-within:text-brand-emerald transition-colors"
                                    >
                                        Your Password
                                    </label>
                                    <Link href="/password-reset" className="text-[9px] font-black text-content-secondary/40 hover:text-brand-emerald transition-colors uppercase tracking-widest border-b border-transparent hover:border-brand-emerald">
                                        Forgot password?
                                    </Link>
                                </div>
                                <input
                                    id="login-password"
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={inputClass}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group/btn relative w-full h-16 bg-content-primary rounded-none transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-4 overflow-hidden shadow-2xl shadow-content-primary/10 mt-6"
                        >
                            <span className="relative z-10 text-[11px] font-black text-surface uppercase tracking-[0.5em]">
                                {isLoading ? 'Verifying...' : 'Sign In Now'}
                            </span>
                            {!isLoading && <ArrowUpRight className="relative z-10 w-4 h-4 text-surface group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />}
                        </button>

                        <div className="pt-6 border-t border-border-standard">
                            <GoogleProtocolButton mode="signin" />
                        </div>
                    </form>

                    <footer className="mt-20 pt-16 border-t border-border-standard flex flex-col items-center gap-8">
                         <p className="text-[10px] font-black text-content-secondary/40 uppercase tracking-widest">New to London&apos;s Imports?</p>
                         <Link href="/register" className="group/link inline-flex items-center gap-4 text-[11px] font-black text-content-primary hover:text-brand-emerald transition-all uppercase tracking-[0.3em] pb-2 border-b border-border-standard hover:border-brand-emerald">
                            Create Account
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
        <Suspense fallback={<div className="min-h-screen bg-surface" />}>
            <LoginFormContent />
        </Suspense>
    );
}
