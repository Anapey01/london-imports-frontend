/**
 * London's Imports - Registration Form
 * Hardened for WCAG 'Understandable' & 'Perceivable' Compliance
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { trackSignUp, trackEvent } from '@/lib/analytics';
import { ArrowUpRight, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

export default function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    const { register, isLoading } = useAuthStore();

    useEffect(() => {
        trackEvent('form_start', { form_id: 'register' });
    }, []);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
        phone: '',
    });
    const [error, setError] = useState('');

    // Auto-dismiss error messages
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        trackEvent('form_submit', { form_id: 'register' });

        if (formData.password !== formData.password_confirm) {
            setError('Error: Passwords do not match');
            return;
        }

        try {
            const cleanEmail = formData.email.toLowerCase().trim();
            await register({
                ...formData,
                email: cleanEmail,
                username: cleanEmail,
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
            });
            trackSignUp();
            // Redirect to verify email instead of login, passing the original redirect
            router.push(`/verify-email?new_account=true&redirect=${encodeURIComponent(redirect)}`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: Record<string, string | string[]> }, message?: string };
            const errors = err.response?.data;
            if (errors && typeof errors === 'object') {
                const firstKey = Object.keys(errors)[0];
                const firstError = errors[firstKey];
                const message = Array.isArray(firstError) ? firstError[0] : String(firstError);
                setError(`Error: ${message}`);
            } else {
                setError(err.message || 'Registration failed. Please check your connection.');
            }
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
                        Direct From <br /> Factory.
                    </h2>
                    <p className="max-w-xs text-sm font-medium text-slate-400 leading-relaxed italic border-l border-slate-700 pl-8">
                        From the factory in China to your home in Ghana, made simple for everyone. Reliable and simple.
                    </p>
                </div>
                
                <div className="relative z-10 pt-20 border-t border-white/10 opacity-40">
                      <span className="text-[9px] font-black uppercase tracking-widest block mb-4 text-brand-emerald">Secure Membership</span>
                      <p className="text-xs font-medium text-slate-300">We verify accounts to keep your orders safe and secure.</p>
                </div>

                {/* Subtle Radial Architecture */}
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />
            </div>

            {/* 2. REGISTRATION FORM PANE */}
            <div className="flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface">
                <div className="w-full max-w-sm">
                    <header className="mb-16">
                        <div className="flex items-center gap-3 mb-8 opacity-40">
                             <ShieldCheck className="w-3 h-3 text-content-primary" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-content-primary">Join us</span>
                        </div>
                        <h1 className="text-5xl font-serif font-bold text-content-primary mb-6 tracking-tighter leading-none">Create Account</h1>
                        <p className="text-sm font-medium text-content-secondary italic">
                            Sign up to start shopping directly from China and tracking your shipments.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {error && (
                            <div className="p-6 bg-rose-500/10 border border-rose-500/20 flex items-start gap-4 rounded-2xl animate-in shake duration-500 mb-10" role="alert" aria-live="polite">
                                <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5" />
                                <p className="text-xs font-black text-rose-500 leading-relaxed uppercase tracking-widest">{error}</p>
                            </div>
                        )}

                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="group">
                                    <label 
                                        htmlFor="reg-first-name"
                                        className="block text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary/60 mb-2 transition-colors group-focus-within:text-brand-emerald"
                                    >
                                        First Name
                                    </label>
                                    <input
                                        id="reg-first-name"
                                        type="text"
                                        name="first_name"
                                        autoComplete="given-name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                        placeholder="Your name..."
                                    />
                                </div>
                                <div className="group">
                                    <label 
                                        htmlFor="reg-last-name"
                                        className="block text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary/60 mb-2 transition-colors group-focus-within:text-brand-emerald"
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        id="reg-last-name"
                                        type="text"
                                        name="last_name"
                                        autoComplete="family-name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                        placeholder="Surname..."
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label 
                                    htmlFor="reg-email"
                                    className="block text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary/60 mb-2 transition-colors group-focus-within:text-brand-emerald"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="reg-email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="Enter your email..."
                                />
                            </div>

                            <div className="group">
                                <label 
                                    htmlFor="reg-phone"
                                    className="block text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary/60 mb-2 transition-colors group-focus-within:text-brand-emerald"
                                >
                                    Phone Number
                                </label>
                                <input
                                    id="reg-phone"
                                    type="tel"
                                    name="phone"
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="0XX XXX XXXX"
                                />
                            </div>

                            <div className="space-y-8">
                                <div className="group">
                                    <label 
                                        htmlFor="reg-password"
                                        className="block text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary/60 mb-2 transition-colors group-focus-within:text-brand-emerald"
                                    >
                                        Create Password
                                    </label>
                                    <input
                                        id="reg-password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={8}
                                        className={inputClass}
                                        placeholder="••••••••"
                                        aria-describedby="password-hint"
                                    />
                                    <p id="password-hint" className="mt-2 text-[9px] font-bold text-content-secondary/40 uppercase tracking-widest italic">
                                        Must be at least 8 characters.
                                    </p>
                                </div>

                                <div className="group">
                                    <label 
                                        htmlFor="reg-password-confirm"
                                        className="block text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary/60 mb-2 transition-colors group-focus-within:text-brand-emerald"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        id="reg-password-confirm"
                                        type="password"
                                        name="password_confirm"
                                        autoComplete="new-password"
                                        value={formData.password_confirm}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                        placeholder="Confirm password..."
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group/btn relative w-full h-16 bg-content-primary rounded-none transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-4 overflow-hidden shadow-2xl shadow-content-primary/10 mt-6"
                        >
                            <span className="relative z-10 text-[11px] font-black text-surface uppercase tracking-[0.5em]">
                                {isLoading ? 'Building Account...' : 'Continue'}
                            </span>
                            {!isLoading && <ArrowUpRight className="relative z-10 w-4 h-4 text-surface group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />}
                        </button>

                        <div className="pt-4 border-t border-border-standard">
                            <GoogleLoginButton mode="signup" />
                        </div>
                    </form>

                    <footer className="mt-16 pt-12 border-t border-border-standard flex flex-col items-center gap-6">
                         <p className="text-[10px] font-black text-content-secondary/40 uppercase tracking-widest">Already a member?</p>
                         <Link href="/login" className="group/link inline-flex items-center gap-4 text-[11px] font-black text-content-primary hover:text-brand-emerald transition-all uppercase tracking-[0.3em] pb-1 border-b border-border-standard hover:border-brand-emerald">
                            Sign In Instead
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                         </Link>
                    </footer>
                </div>
            </div>
        </div>
    );
}
