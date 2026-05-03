'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Calendar, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function BirthdayClubPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
    
    const [dob, setDob] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.push('/login?redirect=/celebrate');
        }
    }, [isAuthenticated, isAuthLoading, router]);

    useEffect(() => {
        if (user?.date_of_birth) {
            setIsSuccess(true);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dob) return;

        setIsSubmitting(true);
        setError('');

        try {
            await authAPI.updateBirthday(dob);
            setIsSuccess(true);
        } catch (err: any) {
            if (err.response?.status === 403) {
                router.push('/verify-email?reason=birthday_club');
            } else {
                setError(err.response?.data?.error || 'Failed to join. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-content-secondary">
                    Accessing Atelier...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface flex flex-col lg:flex-row overflow-hidden">
            
            {/* 1. SIGNATURE ANCHOR (Editorial Sidebar) */}
            <div className="hidden lg:flex w-1/3 bg-[#0a0f1d] p-16 flex-col justify-between relative border-r border-white/5">
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-20 opacity-30">
                        <div className="h-px w-8 bg-white" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Member Services</span>
                    </div>
                    
                    <h1 className="text-8xl font-serif font-bold text-white/5 leading-none select-none italic pointer-events-none absolute -left-10 top-20 rotate-90 origin-top-left">
                        CELEBRATE
                    </h1>
                </div>

                <div className="relative z-10">
                    <p className="text-sm font-medium text-slate-400 leading-relaxed italic border-l border-brand-emerald pl-8 max-w-xs">
                        Personal milestones are the true currency of our community. Share your day, and we&apos;ll handle the rest.
                    </p>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
            </div>

            {/* 2. CONTENT AREA */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 relative">
                
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-emerald/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="w-full max-w-xl relative">
                    {!isSuccess ? (
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            
                            {/* Visual Column */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-brand-emerald/10 scale-95 blur-2xl group-hover:scale-105 transition-transform duration-700" />
                                <img 
                                    src="/editorial_birthday_club_1777830829352.png" 
                                    alt="Birthday Club" 
                                    className="relative z-10 w-full aspect-square object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
                                />
                            </div>

                            {/* Form Column */}
                            <div>
                                <header className="mb-10 text-center">
                                    <h2 className="text-5xl font-serif font-bold text-content-primary mb-4 tracking-tighter leading-none">
                                        The Birthday Club.
                                    </h2>
                                    <p className="text-xs font-medium text-content-secondary uppercase tracking-[0.2em] leading-relaxed">
                                        Drop your birthday here and we&apos;ll send you something special every year.
                                    </p>
                                </header>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="group">
                                        <label htmlFor="dob" className="block text-[10px] font-black uppercase tracking-[0.4em] text-content-secondary/60 mb-4 transition-colors group-focus-within:text-brand-emerald">
                                            Select Date
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-content-secondary/30" />
                                            <input
                                                id="dob"
                                                type="date"
                                                value={dob}
                                                onChange={(e) => setDob(e.target.value)}
                                                required
                                                className="w-full bg-surface-card border border-border-standard py-4 pl-12 pr-4 text-[12px] font-black uppercase tracking-widest institutional-focus rounded-none"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !dob}
                                        className="group/btn relative w-full h-16 bg-content-primary text-surface font-black uppercase tracking-[0.5em] text-[11px] flex items-center justify-center gap-4 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Joining...' : 'Count me in'}
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                    </button>
                                </form>

                                <p className="mt-12 text-[9px] font-bold text-content-secondary/40 uppercase tracking-[0.2em] leading-relaxed italic">
                                    Your info is safe with us. We only use your order history to pick a gift you&apos;ll actually love.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center max-w-sm mx-auto animate-in fade-in zoom-in duration-1000">
                            <div className="w-24 h-24 bg-brand-emerald/10 rounded-full flex items-center justify-center mx-auto mb-10">
                                <CheckCircle2 className="w-12 h-12 text-brand-emerald" />
                            </div>
                            <h2 className="text-5xl font-serif font-bold text-content-primary mb-6 tracking-tighter leading-none">
                                You&apos;re in!
                            </h2>
                            <p className="text-sm font-medium text-content-secondary uppercase tracking-[0.3em] mb-12">
                                We&apos;ll be in touch on your special day.
                            </p>
                            
                            <button
                                onClick={() => router.push('/')}
                                className="inline-flex items-center gap-4 text-[11px] font-black text-brand-emerald hover:text-content-primary transition-colors uppercase tracking-[0.4em] border-b border-brand-emerald/30 pb-2"
                            >
                                Return to Shopping
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
