/**
 * London's Imports - Password Reset Request Page
 * Refined 'High-Authority' protocol aesthetic.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function PasswordResetPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${API_URL}/auth/password/reset/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'If an account exists with this email, a reset link has been sent.');
            } else {
                setError(data.error || 'Something went wrong. Please try again.');
            }
        } catch {
            setError('Failed to connect. Please check your internet connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "block w-full pl-12 pr-4 py-4 bg-surface-card border border-border-standard rounded-2xl focus:border-brand-emerald focus:ring-0 focus:outline-none transition-all placeholder:text-content-secondary/30 text-content-primary uppercase tracking-widest text-[12px] font-black";

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface py-12 px-4 md:px-6 selection:bg-emerald-100/30">
            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')] z-0" />

            <div className="w-full max-w-sm mx-auto relative z-10">
                <header className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-6 opacity-40 justify-center">
                         <div className="h-px w-6 bg-content-primary" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-content-primary">Security Protocol</span>
                         <div className="h-px w-6 bg-content-primary" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-content-primary mb-4 tracking-tighter leading-none">Reset Access</h1>
                    <p className="text-content-secondary font-medium text-sm italic">Enter your verified email to receive a secure reset link.</p>
                </header>

                {message ? (
                    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald px-6 py-6 rounded-2xl text-[11px] font-black uppercase tracking-widest leading-relaxed flex flex-col items-center gap-4">
                            <CheckCircle2 className="w-8 h-8" />
                            {message}
                        </div>
                        <p className="text-content-secondary font-medium text-xs italic">
                            Verification link sent. Please check your inbox and spam folder.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-3 text-content-primary font-black text-[10px] uppercase tracking-[0.2em] hover:text-brand-emerald transition-all border-b border-border-standard pb-1 hover:border-brand-emerald"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in shake duration-500">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-content-secondary/40 group-focus-within:text-brand-emerald transition-colors" strokeWidth={1.5} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={inputClass}
                                placeholder="Verified Email Address"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-content-primary text-surface py-4.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-content-primary/10"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />
                                    <span>Transmitting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send Reset Link</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                )}

                <footer className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-content-secondary/40">
                    Recovered your credentials?{' '}
                    <Link href="/login" className="text-content-primary hover:text-brand-emerald transition-all border-b border-border-standard hover:border-brand-emerald pb-0.5 ml-1">
                        Sign In Gateway
                    </Link>
                </footer>
            </div>
        </div>
    );
}
