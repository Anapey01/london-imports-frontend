'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Gift, Calendar, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
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

    // If already has a birthday, show success state immediately or different UI
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
                setError(err.response?.data?.error || 'Failed to join the club. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-stationery flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-emerald animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-[90vh] bg-stationery flex items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden">
                
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-emerald/20 via-brand-emerald to-brand-emerald/20" />
                
                <div className="p-8 md:p-16 flex flex-col items-center text-center">
                    {!isSuccess ? (
                        <>
                            <div className="w-20 h-20 bg-brand-emerald/5 rounded-full flex items-center justify-center mb-10 relative">
                                <Gift className="w-10 h-10 text-brand-emerald" />
                                <div className="absolute -top-1 -right-1">
                                    <Sparkles className="w-6 h-6 text-brand-emerald animate-pulse" />
                                </div>
                            </div>

                            <header className="mb-12">
                                <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-6 tracking-tighter leading-none italic">
                                    Join the Birthday Club.
                                </h1>
                                <p className="text-sm md:text-base font-medium text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed uppercase tracking-widest px-4">
                                    Tell us your birthday and get a special gift every year!
                                </p>
                            </header>

                            <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-8">
                                <div className="space-y-4">
                                    <label htmlFor="dob" className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                                        Select Date of Birth
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            id="dob"
                                            type="date"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-4 pl-12 pr-4 text-sm font-black uppercase tracking-widest institutional-focus rounded-none"
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
                                    className="group/btn relative w-full h-16 bg-slate-900 dark:bg-brand-emerald text-white font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Joining...' : 'Join the Club'}
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </form>
                            
                            <p className="mt-12 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] italic max-w-[280px]">
                                Your information is safe. We use your order history to pick the best gift for you.
                            </p>
                        </>
                    ) : (
                        <div className="animate-in fade-in zoom-in duration-700 py-12">
                            <div className="w-24 h-24 bg-brand-emerald/10 rounded-full flex items-center justify-center mx-auto mb-10">
                                <CheckCircle2 className="w-12 h-12 text-brand-emerald" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6 tracking-tighter italic">
                                You&apos;re in the Club.
                            </h2>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-[0.3em] mb-12">
                                We look forward to celebrating you on your special day.
                            </p>
                            
                            <button
                                onClick={() => router.push('/')}
                                className="inline-flex items-center gap-4 text-[11px] font-black text-brand-emerald hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-[0.4em] border-b border-brand-emerald/30 pb-2"
                            >
                                Return to Shopping
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Subtle Decorative Element */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-emerald/5 rounded-full blur-3xl pointer-events-none" />
            </div>
        </div>
    );
}
