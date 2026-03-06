/**
 * London's Imports - Vendor Registration Page
 * Multi-step form for business owners to apply as vendors
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { authAPI } from '@/lib/api';

import { AccountStep } from '@/components/register/AccountStep';
import { BusinessStep } from '@/components/register/BusinessStep';
import { LocationStep } from '@/components/register/LocationStep';
import { BankStep } from '@/components/register/BankStep';
import { VendorFormData } from '@/types/vendor';

// SVG Icons for steps
const StepIcons = {
    // ... existing icons ...
    account: (color: string) => (
        <svg className="w-6 h-6" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    business: (color: string) => (
        <svg className="w-6 h-6" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    location: (color: string) => (
        <svg className="w-6 h-6" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    bank: (color: string) => (
        <svg className="w-6 h-6" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    ),
    check: (color: string) => (
        <svg className="w-6 h-6" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    ),
};

const steps = [
    { id: 1, name: 'Account', iconKey: 'account' as const },
    { id: 2, name: 'Business', iconKey: 'business' as const },
    { id: 3, name: 'Location', iconKey: 'location' as const },
    { id: 4, name: 'Bank', iconKey: 'bank' as const },
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

    const validateStep = () => {
        switch (currentStep) {
            case 1:
                if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone || !formData.password) {
                    setError('Please fill in all required fields');
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
                if (!formData.business_name) {
                    setError('Business name is required');
                    return false;
                }
                break;
            case 3:
                if (!formData.city || !formData.region) {
                    setError('City and region are required');
                    return false;
                }
                break;
            case 4:
                if (!formData.bank_name || !formData.bank_account_number || !formData.bank_account_name) {
                    setError('All bank details are required for payouts');
                    return false;
                }
                break;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep()) return;

        setIsSubmitting(true);
        setError('');

        try {
            // Map frontend fields to backend API fields
            const payload = {
                username: formData.email.split('@')[0] + Math.floor(Math.random() * 1000),
                email: formData.email,
                password: formData.password,
                password_confirm: formData.password_confirm,
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
                business_name: formData.business_name,
                business_phone: formData.phone,
                business_city: formData.city,
                business_region: formData.region,
                business_address: formData.address,
                description: formData.description,
                whatsapp: formData.whatsapp,
                bank_name: formData.bank_name,
                bank_account_number: formData.bank_account_number,
                bank_account_name: formData.bank_account_name,
            };

            await authAPI.registerVendor(payload);
            setSuccess(true);
        } catch (err: unknown) {
            console.error('Registration Error:', err);
            const error = err as { response?: { data?: Record<string, string | string[]> }, message?: string };
            const errors = error.response?.data;
            if (errors) {
                const firstError = Object.values(errors)[0];
                const message = Array.isArray(firstError) ? firstError[0] : String(firstError);
                setError(message);
                console.error('Validation Errors:', errors);
            } else if (error.message === 'Network Error') {
                setError('Unable to connect to server. Ensure backend is running locally.');
            } else {
                setError(error.message || 'Registration failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };



    if (success) {
        return (
            <div className={`min-h-screen flex items-center justify-center py-12 px-4 ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-green-100">
                        <svg className="w-10 h-10" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-slate-50' : 'text-gray-900'}`}>
                        Application Submitted!
                    </h1>
                    <p className={`mb-6 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-500'}`}>
                        Thank you for applying to become a vendor. Our team will review your application and contact you within 2-3 business days.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${theme === 'dark' ? 'bg-purple-900' : 'bg-pink-300'}`} />
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${theme === 'dark' ? 'bg-pink-900' : 'bg-purple-300'}`} />
            </div>

            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <Link href="/sell" className="inline-flex items-center text-sm text-gray-500 hover:text-pink-600 mb-6 transition-colors">
                            ← Back to Options
                        </Link>
                        <h1 className="text-4xl sm:text-5xl font-light mb-4">
                            Join Marketplace
                        </h1>
                        <p className={`text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                            Start selling your products on our main marketplace feed.
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-between mb-10 px-4 md:px-12">
                        {steps.map((step) => {
                            const isCompleted = currentStep > step.id;
                            const isActive = currentStep >= step.id;
                            const iconColor = isActive ? '#ffffff' : (theme === 'dark' ? '#94a3b8' : '#6b7280');

                            return (
                                <div key={step.id} className="flex flex-col items-center">
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-all shadow-lg ${isActive ? 'bg-gradient-to-br from-pink-500 to-rose-600 scale-110' : (theme === 'dark' ? 'bg-slate-800' : 'bg-white')}`}
                                    >
                                        {isCompleted ? StepIcons.check(iconColor) : StepIcons[step.iconKey](iconColor)}
                                    </div>
                                    <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-pink-600' : 'text-gray-500'}`}>
                                        {step.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Form Card */}
                    <div className={`rounded-[2rem] p-8 sm:p-10 border transition-all ${theme === 'dark'
                        ? 'bg-slate-900/50 border-slate-800 backdrop-blur-xl'
                        : 'bg-white/80 border-gray-100 shadow-2xl shadow-gray-200/50 backdrop-blur-xl'
                        }`}>
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-600 border border-red-100 flex items-center gap-2">
                                    <span className="font-bold">Error:</span> {error}
                                </div>
                            )}

                            {/* Form Steps */}
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

                            {/* Buttons */}
                            <div className={`flex justify-between mt-10 pt-6 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                                {currentStep > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className={`px-6 py-3 rounded-xl font-medium transition-all hover:bg-opacity-80 active:scale-95 ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                                    >
                                        ← Back
                                    </button>
                                ) : (
                                    <Link
                                        href="/sell"
                                        className={`px-6 py-3 rounded-xl font-medium transition-all hover:bg-opacity-80 active:scale-95 ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700'}`}
                                    >
                                        Cancel
                                    </Link>
                                )}

                                <button
                                    type={currentStep === 4 ? 'submit' : 'button'}
                                    onClick={currentStep === 4 ? undefined : nextStep}
                                    disabled={isSubmitting}
                                    className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg shadow-pink-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                >
                                    {currentStep === 4 ? (isSubmitting ? 'Submitting...' : 'Submit Application') : 'Next Step →'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className={`mt-8 text-center text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                        Already have an account? <Link href="/login?role=vendor&redirect=/dashboard/vendor" className="text-pink-600 hover:underline">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
