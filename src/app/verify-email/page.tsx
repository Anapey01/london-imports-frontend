'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { ShieldCheck, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { Suspense } from 'react';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isAuthenticated, fetchUser } = useAuthStore();
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [isVerified, setIsVerified] = useState(false);

    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    // If not logged in, redirect to login
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            router.push('/login?redirect=/verify-email');
        }
    }, [isAuthenticated, router, isLoading]);

    // Focus first input on mount
    useEffect(() => {
        if (inputs.current[0]) {
            inputs.current[0].focus();
        }
    }, []);

    // Resend timer logic
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5 && inputs.current[index + 1]) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();
        if (!/^\d{6}$/.test(pastedData)) return;

        const digits = pastedData.split('');
        setOtp(digits);
        inputs.current[5]?.focus();
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) return;

        setIsLoading(true);
        setError('');

        try {
            await authAPI.verifyEmail(code);
            setIsVerified(true);
            await fetchUser(); // Refresh user state
            
            // Redirect after a short delay to show success state
            setTimeout(() => {
                router.push('/celebrate?verified=true');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid or expired verification code.');
            setIsLoading(false);
        }
    };

    // Auto-submit when all digits are filled
    useEffect(() => {
        if (otp.every(digit => digit !== '') && !isVerified) {
            handleSubmit();
        }
    }, [otp]);

    const handleResend = async () => {
        if (resendTimer > 0 || isResending) return;

        setIsResending(true);
        setError('');

        try {
            await authAPI.resendOTP();
            setResendTimer(60);
        } catch (err: any) {
            setError('Failed to resend code. Please try again later.');
        } finally {
            setIsResending(false);
        }
    };

    // Auto-resend on first load if authenticated but not verified
    useEffect(() => {
        if (isAuthenticated && !user?.email_verified && !isVerified && resendTimer === 0) {
            handleResend();
        }
    }, [isAuthenticated, user?.email_verified]);

    if (isVerified) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center p-8">
                <div className="w-full max-w-md text-center">
                    <div className="w-24 h-24 bg-brand-emerald/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-brand-emerald" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-content-primary mb-4 tracking-tighter">You&apos;re verified!</h1>
                    <p className="text-sm font-medium text-content-secondary uppercase tracking-[0.2em]">Just a second, redirecting you...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface flex flex-col lg:flex-row selection:bg-emerald-100/30">
            {/* Sidebar Pane (Brand Context) */}
            <div className="lg:w-[400px] bg-[#0a0f1d] p-12 text-white flex flex-col justify-between border-r border-white/5">
                <div>
                    <div className="flex items-center gap-4 mb-12 opacity-30">
                        <div className="h-px w-8 bg-white" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em]">Email Verification</span>
                    </div>
                    <h2 className="text-4xl font-serif font-bold italic opacity-30 leading-none tracking-tighter mb-8">Secure Account.</h2>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed border-l border-slate-700 pl-6 italic">
                        We do this to keep your account safe and make sure your birthday gifts always reach the right person.
                    </p>
                </div>
                
                <div className="pt-12 border-t border-white/10 opacity-30">
                    <span className="text-[9px] font-black uppercase tracking-widest block mb-2">Member Support</span>
                    <p className="text-[10px] font-medium text-slate-400">Not receiving the email? Check your spam folder or contact our support team on WhatsApp.</p>
                </div>
            </div>

            {/* Main Interaction Pane */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24">
                <div className="w-full max-w-md">
                    <header className="mb-12">
                        <h1 className="text-5xl font-serif font-bold text-content-primary mb-4 tracking-tighter leading-none">Check your inbox</h1>
                        <p className="text-sm font-medium text-content-secondary leading-relaxed">
                            We just sent a 6-digit code to <span className="text-content-primary font-bold italic">{user?.email || 'your email'}</span>. Pop it in below to finish up.
                        </p>
                    </header>

                    {error && (
                        <div className="p-6 bg-rose-500/10 border border-rose-500/20 flex items-start gap-4 rounded-none mb-10 animate-in shake duration-500">
                            <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5" />
                            <p className="text-xs font-black text-rose-500 leading-relaxed uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="flex justify-between gap-3 md:gap-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => { inputs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(index, e.target.value)}
                                    onKeyDown={e => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className="w-full aspect-square text-center text-2xl font-black bg-surface-card border border-border-standard rounded-none institutional-focus transition-all text-content-primary focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald/20"
                                />
                            ))}
                        </div>

                        <div className="flex flex-col gap-6">
                            <button
                                type="submit"
                                disabled={isLoading || otp.some(d => d === '')}
                                className="group/btn relative w-full h-16 bg-content-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-none transition-all flex items-center justify-center gap-4 overflow-hidden shadow-2xl shadow-content-primary/10"
                            >
                                <span className="relative z-10 text-[11px] font-black text-surface uppercase tracking-[0.5em]">
                                    {isLoading ? 'Checking...' : 'Verify'}
                                </span>
                                {!isLoading && <ArrowRight className="relative z-10 w-4 h-4 text-surface group-hover/btn:translate-x-1 transition-transform" />}
                            </button>

                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendTimer > 0 || isResending}
                                className="group/resend flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-content-secondary hover:text-content-primary transition-colors disabled:opacity-40"
                            >
                                {resendTimer > 0 ? (
                                    <span>Resend code in {resendTimer}s</span>
                                ) : (
                                    <>
                                        <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                                        <span>Request new code</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="animate-pulse text-[10px] font-black uppercase tracking-widest text-content-secondary">
                    Loading Protocol...
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
