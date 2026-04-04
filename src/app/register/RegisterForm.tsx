'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { trackSignUp } from '@/lib/analytics';
import { ArrowUpRight, ArrowRight, AlertCircle } from 'lucide-react';
import GoogleProtocolButton from '@/components/auth/GoogleProtocolButton';

export default function RegisterForm() {
    const router = useRouter();
    const { register, logout, isLoading } = useAuthStore();

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirm) {
            setError('Error: Passwords do not match');
            return;
        }

        try {
            await register({
                ...formData,
                username: formData.email
            });
            trackSignUp();
            logout(); // Clear the automatic login session for immediate verification
            router.push(`/login?email=${encodeURIComponent(formData.email)}&registered=true&welcome=true`);
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

    return (
        <div className="min-h-screen bg-white grid lg:grid-cols-2 selection:bg-emerald-100">
            {/* 1. EDITORIAL BRAND PANE (Hidden on Mobile) */}
            <div className="hidden lg:flex flex-col justify-between p-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-16 opacity-30">
                        <div className="h-px w-12 bg-white" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">London&apos;s Imports / 2026 Edition</span>
                    </div>
                        Direct From <br /> Factory.
                    <p className="max-w-xs text-sm font-medium text-slate-400 leading-relaxed italic border-l border-slate-700 pl-8">
                        From the factory in China to your home in Ghana, made simple for everyone.
                    </p>
                </div>
                
                <div className="relative z-10 pt-20 border-t border-slate-800 opacity-20">
                     <span className="text-[9px] font-black uppercase tracking-widest block mb-4">Safe & Secure</span>
                     <p className="text-xs font-medium">Safe login and verified accounts required for your protection.</p>
                </div>

                {/* Subtle Radial Architecture */}
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />
            </div>

            {/* 2. PROTOCOL FORM PANE */}
            <div className="flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white">
                <div className="w-full max-w-sm">
                    <header className="mb-16">
                        <div className="flex items-center gap-3 mb-8 opacity-20">
                             <div className="h-px w-8 bg-slate-900" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Join Us</span>
                        </div>
                        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tighter leading-none">Create Account</h1>
                        <p className="text-sm font-medium text-slate-400 italic">
                            Sign up to start shopping from China.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {error && (
                            <div className="p-6 bg-slate-50 border border-slate-900/10 flex items-start gap-4 mb-10">
                                <AlertCircle className="w-4 h-4 text-slate-900 mt-0.5" />
                                <p className="text-xs font-bold text-slate-900 leading-relaxed uppercase tracking-tighter">{error}</p>
                            </div>
                        )}

                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="group">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2 transition-colors group-focus-within:text-slate-900">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                        className="block w-full text-[12px] font-black text-slate-900 bg-transparent border-0 border-b border-slate-100 rounded-none py-3 focus:border-slate-900 focus:ring-0 focus:outline-none transition-all placeholder-slate-200 uppercase tracking-widest"
                                        placeholder="Your name..."
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2 transition-colors group-focus-within:text-slate-900">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                        className="block w-full text-[12px] font-black text-slate-900 bg-transparent border-0 border-b border-slate-100 rounded-none py-3 focus:border-slate-900 focus:ring-0 focus:outline-none transition-all placeholder-slate-200 uppercase tracking-widest"
                                        placeholder="Surname..."
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2 transition-colors group-focus-within:text-slate-900">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="block w-full text-[12px] font-black text-slate-900 bg-transparent border-0 border-b border-slate-100 rounded-none py-3 focus:border-slate-900 focus:ring-0 focus:outline-none transition-all placeholder-slate-200 uppercase tracking-widest"
                                    placeholder="Enter your email..."
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2 transition-colors group-focus-within:text-slate-900">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="block w-full text-[12px] font-black text-slate-900 bg-transparent border-0 border-b border-slate-100 rounded-none py-3 focus:border-slate-900 focus:ring-0 focus:outline-none transition-all placeholder-slate-200 uppercase tracking-widest"
                                    placeholder="0XX XXX XXXX"
                                />
                            </div>

                            <div className="space-y-8">
                                <div className="group">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2 transition-colors group-focus-within:text-slate-900">
                                        Create Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={8}
                                        className="block w-full text-[12px] font-black text-slate-900 bg-transparent border-0 border-b border-slate-100 rounded-none py-3 focus:border-slate-900 focus:ring-0 focus:outline-none transition-all placeholder-slate-200"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-2 transition-colors group-focus-within:text-slate-900">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password_confirm"
                                        value={formData.password_confirm}
                                        onChange={handleChange}
                                        required
                                        className="block w-full text-[12px] font-black text-slate-900 bg-transparent border-0 border-b border-slate-100 rounded-none py-3 focus:border-slate-900 focus:ring-0 focus:outline-none transition-all placeholder-slate-200"
                                        placeholder="Confirm password..."
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group/btn relative w-full h-16 border border-slate-900 transition-all hover:bg-slate-900 flex items-center justify-center gap-4 overflow-hidden mt-6"
                        >
                            <span className="relative z-10 text-[11px] font-black text-slate-900 uppercase tracking-[0.5em] group-hover/btn:text-white transition-colors">
                                {isLoading ? 'Creating...' : 'Create My Account'}
                            </span>
                            {!isLoading && <ArrowUpRight className="relative z-10 w-4 h-4 text-slate-900 group-hover/btn:text-white transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />}
                            <div className="absolute inset-0 bg-slate-900 transition-transform translate-y-full group-hover/btn:translate-y-0" />
                        </button>

                        <div className="pt-4">
                            <GoogleProtocolButton mode="signup" />
                        </div>
                    </form>

                    <footer className="mt-16 pt-12 border-t border-slate-50 flex flex-col items-center gap-6">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Already have an account?</p>
                         <Link href="/login" className="group/link inline-flex items-center gap-4 text-[11px] font-black text-slate-900 border-b border-black pb-1 hover:opacity-60 transition-all uppercase tracking-[0.3em]">
                            Sign In Now
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                         </Link>
                    </footer>
                </div>
            </div>
        </div>
    );
}
