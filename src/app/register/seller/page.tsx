/**
 * London's Imports - Merchant Registration
 * Multi-step onboarding for merchants with unified escrow payouts
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { authAPI } from '@/lib/api';
import { ArrowLeft, ArrowRight, Check, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

import { AccountStep } from '@/components/register/AccountStep';
import { BusinessStep } from '@/components/register/BusinessStep';
import { LocationStep } from '@/components/register/LocationStep';
import { BankStep } from '@/components/register/BankStep';
import { VendorFormData } from '@/types/vendor';

const STEPS = [
    { id: 1, name: 'Account' },
    { id: 2, name: 'Business' },
    { id: 3, name: 'Location' },
    { id: 4, name: 'Payouts' },
];

export default function VendorRegisterPage() {
    const { theme } = useTheme();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<VendorFormData>({
        // Account
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirm: '',
        // Business
        business_name: '',
        description: '',
        whatsapp: '',
        ghana_card_number: '',
        business_certificate_number: '',
        // Location
        city: '',
        region: '',
        address: '',
        // Bank
        bank_name: '',
        bank_account_number: '',
        bank_account_name: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateStep = (): boolean => {
        switch (currentStep) {
            case 1:
                if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
                    setError('Please fill in all required personal details');
                    return false;
                }
                if (formData.password !== formData.password_confirm) {
                    setError('Passwords do not match');
                    return false;
                }
                if (formData.password.length < 8) {
                    setError('Password must be at least 8 characters');
                    return false;
                }
                break;
            case 2:
                if (!formData.business_name.trim()) {
                    setError('Store / Business name is required');
                    return false;
                }
                break;
            case 3:
                if (!formData.region || !formData.city.trim()) {
                    setError('Region and City are required');
                    return false;
                }
                break;
            case 4:
                if (!formData.bank_name || !formData.bank_account_number.trim() || !formData.bank_account_name.trim()) {
                    setError('All payout and banking details are required');
                    return false;
                }
                break;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setError('');
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setError('');
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep()) return;

        setIsSubmitting(true);
        setError('');

        try {
            const cleanEmail = formData.email.toLowerCase().trim();
            const payload = {
                username: cleanEmail,
                email: cleanEmail,
                password: formData.password,
                password_confirm: formData.password_confirm,
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                phone: formData.phone.trim(),
                business_name: formData.business_name.trim(),
                business_phone: formData.phone.trim(),
                business_city: formData.city.trim(),
                business_region: formData.region,
                business_address: formData.address.trim(),
                description: formData.description.trim(),
                whatsapp: formData.whatsapp.trim(),
                ghana_card_number: (formData.ghana_card_number || '').trim().toUpperCase(),
                business_certificate_number: (formData.business_certificate_number || '').trim(),
                bank_name: formData.bank_name,
                bank_account_number: formData.bank_account_number.trim(),
                bank_account_name: formData.bank_account_name.trim(),
            };

            await authAPI.registerVendor(payload);
            setSuccess(true);
        } catch (err: unknown) {
            console.error('Registration Error:', err);
            const errorObj = err as { response?: { data?: Record<string, string | string[]> }, message?: string };
            const errors = errorObj.response?.data;
            if (errors && typeof errors === 'object') {
                const firstKey = Object.keys(errors)[0];
                const firstError = errors[firstKey];
                const message = Array.isArray(firstError) ? firstError[0] : String(firstError);
                setError(message);
            } else if (errorObj.message === 'Network Error') {
                setError('Unable to reach server. Please check your connection.');
            } else {
                setError(errorObj.message || 'Registration failed. Please review your entries and try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-10 shadow-sm">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                        Application Submitted
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                        Thank you for applying to sell on London&apos;s Imports. Your merchant profile is in the verification queue. Our team reviews compliance documents within 1-2 business days.
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="block w-full py-3 px-4 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-sm"
                        >
                            Return to Store
                        </Link>
                        <Link
                            href="/login?role=vendor&redirect=/dashboard/vendor"
                            className="block w-full py-3 px-4 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Log in to Portal
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <Link
                        href="/sell"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Overview
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
                        Merchant Enrollment
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Complete the 4 steps below to set up your store and start selling.
                    </p>
                </div>

                {/* Progress Stepper */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-100 dark:bg-slate-800 -z-0" />
                        
                        {STEPS.map((step) => {
                            const isCompleted = currentStep > step.id;
                            const isActive = currentStep === step.id;

                            return (
                                <div key={step.id} className="relative z-10 flex flex-col items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                            isCompleted
                                                ? 'bg-emerald-600 text-white'
                                                : isActive
                                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 ring-4 ring-slate-100 dark:ring-slate-800'
                                                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                                        }`}
                                    >
                                        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                                    </div>
                                    <span
                                        className={`text-[11px] font-semibold tracking-wider uppercase mt-2 hidden sm:block ${
                                            isActive
                                                ? 'text-slate-900 dark:text-white'
                                                : isCompleted
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-slate-400 dark:text-slate-500'
                                        }`}
                                    >
                                        {step.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Form Container */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm">
                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-sm text-red-700 dark:text-red-400">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Step Form Render */}
                        {currentStep === 1 && (
                            <AccountStep formData={formData} handleChange={handleChange} theme={theme} />
                        )}
                        {currentStep === 2 && (
                            <BusinessStep formData={formData} handleChange={handleChange} theme={theme} />
                        )}
                        {currentStep === 3 && (
                            <LocationStep formData={formData} handleChange={handleChange} theme={theme} />
                        )}
                        {currentStep === 4 && (
                            <BankStep formData={formData} handleChange={handleChange} theme={theme} />
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                >
                                    Previous
                                </button>
                            ) : (
                                <div />
                            )}

                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-sm active:scale-[0.99]"
                                >
                                    Next Step
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
