'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Lock, Briefcase, CreditCard, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/providers/ThemeProvider';

export default function PartnerRegisterPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Form State
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirm: '',
        whatsapp: '',
        ghana_card_number: '',
        business_certificate_number: '',
        paystack_private_key: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setIsLoading(true);

        if (formData.password !== formData.password_confirm) {
            setServerError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await authAPI.registerPartner({
                ...formData,
                username: formData.email,
                vendor_type: 'STANDALONE'
            });

            await login(formData.email, formData.password);
            toast.success('Partner Account Created!');
            router.push('/dashboard/vendor');

        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string; detail?: string } } };
            const msg = err.response?.data?.error || err.response?.data?.detail || 'Registration failed. Check your details.';
            setServerError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen transition-colors ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-purple-900' : 'bg-indigo-300'}`} />
                <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-indigo-900' : 'bg-purple-300'}`} />
            </div>

            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <div className="w-full max-w-4xl">
                    <div className="text-center mb-10">
                        <Link href="/sell" className={`inline-flex items-center text-sm mb-6 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Options
                        </Link>
                        <h2 className="text-4xl sm:text-5xl font-light mb-4 tracking-tight">
                            Partner Registration
                        </h2>
                        <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                            Create your exclusive, auto-verified branded store.
                        </p>
                    </div>

                    <div className={`rounded-[2rem] p-8 sm:p-10 border transition-all ${isDark
                        ? 'bg-slate-900/50 border-slate-800 backdrop-blur-xl'
                        : 'bg-white/80 border-gray-100 shadow-2xl shadow-indigo-200/50 backdrop-blur-xl'
                        }`}>
                        <form className="space-y-8" onSubmit={handleSubmit}>

                            {/* Error Message */}
                            {serverError && (
                                <div className="rounded-xl bg-red-50 p-4 border border-red-200 flex items-center gap-3 text-red-700">
                                    <ShieldCheck className="w-5 h-5 shrink-0" />
                                    <p className="text-sm font-medium">{serverError}</p>
                                </div>
                            )}

                            {/* Section 1: Account Details */}
                            <div>
                                <h3 className={`text-xl font-medium mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    <User className="w-6 h-6 text-indigo-500" strokeWidth={1.5} />
                                    Account Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider opacity-70">First Name</label>
                                        <input name="first_name" required value={formData.first_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-indigo-500 transition-all outline-none" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Last Name</label>
                                        <input name="last_name" required value={formData.last_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-indigo-500 transition-all outline-none" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }} />
                                    </div>
                                </div>

                                <div className="space-y-1 mb-5">
                                    <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                        <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-indigo-500 transition-all outline-none" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }} placeholder="you@example.com" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                            <input name="password" type="password" required minLength={8} value={formData.password} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-indigo-500 transition-all outline-none" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                            <input name="password_confirm" type="password" required value={formData.password_confirm} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-indigo-500 transition-all outline-none" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Business Contact */}
                            <div className={`pt-6 border-t ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                                <h3 className={`text-xl font-medium mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    <Briefcase className="w-6 h-6 text-indigo-500" strokeWidth={1.5} />
                                    Business Contact
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                            <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-indigo-500 transition-all outline-none" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }} placeholder="054 XXX XXXX" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider opacity-70">WhatsApp (Optional)</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-3.5 h-5 w-5 text-green-500" />
                                            <input name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-indigo-500 transition-all outline-none" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }} placeholder="054 XXX XXXX" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Partner Verification */}
                            <div className={`pt-6 border-t ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                                <h3 className={`text-xl font-medium mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    <ShieldCheck className="w-6 h-6 text-indigo-500" strokeWidth={1.5} />
                                    Verification & Payments
                                </h3>
                                <div className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Ghana Card Number</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                            <input name="ghana_card_number" type="text" required value={formData.ghana_card_number} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-indigo-500 transition-all outline-none" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }} placeholder="GHA-XXXXXXXXX-X" />
                                        </div>
                                        <p className="text-xs opacity-60 mt-1 ml-1">Required for automated fraud checks.</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Business Registration No.</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                            <input name="business_certificate_number" type="text" required value={formData.business_certificate_number} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-indigo-500 transition-all outline-none" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }} />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Paystack Private API Key</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                            <input name="paystack_private_key" type="password" required value={formData.paystack_private_key} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent border focus:ring-2 focus:ring-indigo-500 transition-all outline-none" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }} placeholder="sk_live_xxxxxxxxxxxxxxxx" />
                                        </div>
                                        <div className={`mt-3 p-4 rounded-xl text-sm leading-relaxed ${isDark ? 'bg-indigo-900/20 text-indigo-300' : 'bg-indigo-50 text-indigo-800'}`}>
                                            <strong className="block mb-1">Why do we need this?</strong>
                                            Partners manage their own transactions. This key allows us to process payments directly to your Paystack account. We store this encrypted.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 px-6 rounded-2xl text-white font-semibold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>Verifying & Registering...</>
                                    ) : (
                                        <>
                                            Complete Partner Registration
                                            <CheckCircle2 className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="text-center">
                                <Link href="/login?role=partner&redirect=/dashboard/vendor" className="text-indigo-500 hover:text-indigo-400 text-sm font-medium hover:underline">
                                    Already have an account? Log in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
