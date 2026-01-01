/**
 * London's Imports - Vendor Registration Page
 * Multi-step form for business owners to apply as vendors
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { authAPI } from '@/lib/api';

// SVG Icons for steps
const StepIcons = {
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
    const router = useRouter();
    const { theme } = useTheme();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
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
        } catch (err: any) {
            console.error('Registration Error:', err);
            const errors = err.response?.data;
            if (errors) {
                const firstError = Object.values(errors)[0];
                const message = Array.isArray(firstError) ? firstError[0] : String(firstError);
                setError(message);
                console.error('Validation Errors:', errors);
            } else if (err.message === 'Network Error') {
                setError('Unable to connect to server. Ensure backend is running locally.');
            } else {
                setError(err.message || 'Registration failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = {
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        color: theme === 'dark' ? '#f8fafc' : '#111827',
        borderColor: theme === 'dark' ? '#475569' : '#d1d5db',
    };

    const labelStyle = {
        color: theme === 'dark' ? '#e2e8f0' : '#374151',
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb' }}>
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                        <svg className="w-10 h-10" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-4" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                        Application Submitted!
                    </h1>
                    <p className="mb-6" style={{ color: theme === 'dark' ? '#cbd5e1' : '#6b7280' }}>
                        Thank you for applying to become a vendor. Our team will review your application and contact you within 2-3 business days.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
                        style={{ background: 'linear-gradient(to right, #ec4899, #f43f5e)' }}
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4" style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb' }}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                        Become a Vendor
                    </h1>
                    <p style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                        Join London&apos;s Imports and reach thousands of customers across Ghana
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between mb-8">
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep >= step.id;
                        const iconColor = isActive ? '#ffffff' : (theme === 'dark' ? '#94a3b8' : '#6b7280');

                        return (
                            <div key={step.id} className="flex-1 text-center">
                                <div
                                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 transition-all ${isActive ? '' : 'opacity-50'}`}
                                    style={{
                                        backgroundColor: isActive ? '#ec4899' : (theme === 'dark' ? '#334155' : '#e5e7eb'),
                                    }}
                                >
                                    {isCompleted ? StepIcons.check(iconColor) : StepIcons[step.iconKey](iconColor)}
                                </div>
                                <span className="text-xs font-medium hidden sm:block" style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                                    {step.name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Form Card */}
                <div className="rounded-2xl shadow-lg p-6 sm:p-8" style={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}>
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-6 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                                {error}
                            </div>
                        )}

                        {/* Step 1: Account */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold mb-4" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                                    Create Your Account
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={labelStyle}>First Name *</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={labelStyle}>Last Name *</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="0XX XXX XXXX"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>Password *</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>Confirm Password *</label>
                                    <input
                                        type="password"
                                        name="password_confirm"
                                        value={formData.password_confirm}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Business */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold mb-4" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                                    Business Information
                                </h2>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>Business Name *</label>
                                    <input
                                        type="text"
                                        name="business_name"
                                        value={formData.business_name}
                                        onChange={handleChange}
                                        placeholder="Your store or business name"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>Business Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Tell customers about your business and what you sell..."
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 resize-none"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        placeholder="For customer inquiries"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Location */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold mb-4" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                                    Business Location
                                </h2>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>Region *</label>
                                    <select
                                        name="region"
                                        value={formData.region}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    >
                                        <option value="">Select Region</option>
                                        <option value="Greater Accra">Greater Accra</option>
                                        <option value="Ashanti">Ashanti</option>
                                        <option value="Central">Central</option>
                                        <option value="Western">Western</option>
                                        <option value="Eastern">Eastern</option>
                                        <option value="Volta">Volta</option>
                                        <option value="Northern">Northern</option>
                                        <option value="Upper East">Upper East</option>
                                        <option value="Upper West">Upper West</option>
                                        <option value="Brong Ahafo">Brong Ahafo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="e.g., Accra, Kumasi, Tema"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>Full Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Street address, landmark, etc."
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 resize-none"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Bank */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold mb-4" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                                    Bank Details for Payouts
                                </h2>
                                <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fef3c7', color: theme === 'dark' ? '#fcd34d' : '#92400e' }}>
                                    <p className="text-sm flex items-center gap-2">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Your earnings will be transferred to this account. Make sure the details are correct.
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>Bank Name *</label>
                                    <select
                                        name="bank_name"
                                        value={formData.bank_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    >
                                        <option value="">Select Bank</option>
                                        <option value="MTN Mobile Money">MTN Mobile Money</option>
                                        <option value="Vodafone Cash">Vodafone Cash</option>
                                        <option value="AirtelTigo Money">AirtelTigo Money</option>
                                        <option value="GCB Bank">GCB Bank</option>
                                        <option value="Ecobank">Ecobank</option>
                                        <option value="Fidelity Bank">Fidelity Bank</option>
                                        <option value="CAL Bank">CAL Bank</option>
                                        <option value="Stanbic Bank">Stanbic Bank</option>
                                        <option value="Standard Chartered">Standard Chartered</option>
                                        <option value="Zenith Bank">Zenith Bank</option>
                                        <option value="Access Bank">Access Bank</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>Account Number *</label>
                                    <input
                                        type="text"
                                        name="bank_account_number"
                                        value={formData.bank_account_number}
                                        onChange={handleChange}
                                        placeholder="Your account or mobile money number"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={labelStyle}>Account Name *</label>
                                    <input
                                        type="text"
                                        name="bank_account_name"
                                        value={formData.bank_account_name}
                                        onChange={handleChange}
                                        placeholder="Name on the account"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-2 rounded-lg font-medium"
                                    style={{
                                        backgroundColor: theme === 'dark' ? '#334155' : '#e5e7eb',
                                        color: theme === 'dark' ? '#f8fafc' : '#374151'
                                    }}
                                >
                                    ← Back
                                </button>
                            ) : (
                                <Link
                                    href="/register"
                                    className="px-6 py-2 rounded-lg font-medium"
                                    style={{
                                        backgroundColor: theme === 'dark' ? '#334155' : '#e5e7eb',
                                        color: theme === 'dark' ? '#f8fafc' : '#374151'
                                    }}
                                >
                                    ← Cancel
                                </Link>
                            )}

                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-6 py-2 rounded-lg font-semibold text-white"
                                    style={{ background: 'linear-gradient(to right, #ec4899, #f43f5e)' }}
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 rounded-lg font-semibold text-white disabled:opacity-50"
                                    style={{ background: 'linear-gradient(to right, #ec4899, #f43f5e)' }}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Already have account */}
                    <div className="mt-6 text-center text-sm" style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                        Already a vendor?{' '}
                        <Link href="/login" className="font-semibold" style={{ color: '#ec4899' }}>
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
