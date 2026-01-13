'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';
import Link from 'next/link';

// Validation Schema
const partnerSchema = z.object({
    // Account
    first_name: z.string().min(2, 'First name is required'),
    last_name: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number needed'),
    username: z.string().min(3, 'Username required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirm: z.string(),

    // Business
    business_name: z.string().min(2, 'Business name required'),
    description: z.string().optional(),
    business_phone: z.string().optional(),
    whatsapp: z.string().optional(),

    // Location
    business_region: z.string().min(1, 'Region is required'),
    business_city: z.string().min(1, 'City is required'),
    business_address: z.string().optional(),

    // Verification & Payments (Partner Specific)
    ghana_card_number: z.string().min(5, 'Ghana Card Number is required'),
    business_certificate_number: z.string().min(5, 'Business Certificate Number is required'),
    paystack_private_key: z.string().startsWith('sk_', 'Must be a valid Paystack Secret Key (starts with sk_)'),
}).refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ["password_confirm"],
});

type PartnerFormData = z.infer<typeof partnerSchema>;

export default function PartnerRegisterPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PartnerFormData>({
        resolver: zodResolver(partnerSchema),
    });

    const registerMutation = useMutation({
        mutationFn: authAPI.registerPartner,
        onSuccess: (data) => {
            // Login logic (store token)
            localStorage.setItem('access_token', data.data.tokens.access);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            // Cookie is set by backend, but we store in local for API client logic if needed
            // Redirect to vendor dashboard
            router.push('/dashboard/vendor');
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { error?: string; detail?: string } } };
            const msg = err.response?.data?.error || err.response?.data?.detail || 'Registration failed. Check your details.';
            setServerError(msg);
        },
    });

    const onSubmit = (data: PartnerFormData) => {
        setServerError('');
        registerMutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Become a Strategic Partner
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    For verified vendors with standalone stores and full payment control.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>

                        {/* 1. Account Details */}
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input {...register('first_name')} type="text" className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input {...register('last_name')} type="text" className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input {...register('email')} type="email" className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <input {...register('username')} type="text" className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input {...register('phone')} type="text" className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                                    <input {...register('whatsapp')} type="text" className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input {...register('password')} type="password" className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                    <input {...register('password_confirm')} type="password" className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.password_confirm && <p className="mt-1 text-sm text-red-600">{errors.password_confirm.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* 2. Business Details */}
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">Business Details</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Store / Business Name</label>
                                    <input {...register('business_name')} type="text" className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.business_name && <p className="mt-1 text-sm text-red-600">{errors.business_name.message}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea {...register('description')} rows={3} className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Region</label>
                                    <select {...register('business_region')} className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                        <option value="">Select Region</option>
                                        <option value="Greater Accra">Greater Accra</option>
                                        <option value="Ashanti">Ashanti</option>
                                        <option value="Central">Central</option>
                                        <option value="Eastern">Eastern</option>
                                        <option value="Western">Western</option>
                                        <option value="Northern">Northern</option>
                                        <option value="Volta">Volta</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.business_region && <p className="mt-1 text-sm text-red-600">{errors.business_region.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input {...register('business_city')} type="text" className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.business_city && <p className="mt-1 text-sm text-red-600">{errors.business_city.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* 3. Verification & Paystack */}
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">Partner Verification & Payments</h3>
                            <div className="bg-yellow-50 p-4 rounded-md mb-4 border border-yellow-200">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> Partners have full control over their funds. You must provide your own Paystack Secret Key.
                                    We will perform an automated risk check using your Ghana Card and Business details.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ghana Card Number</label>
                                    <input {...register('ghana_card_number')} placeholder="GHA-123456789-0" type="text" className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.ghana_card_number && <p className="mt-1 text-sm text-red-600">{errors.ghana_card_number.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Business Reg. Certificate Number</label>
                                    <input {...register('business_certificate_number')} type="text" className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    {errors.business_certificate_number && <p className="mt-1 text-sm text-red-600">{errors.business_certificate_number.message}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Paystack Secret Key (Private API Key)</label>
                                    <input {...register('paystack_private_key')} type="password" placeholder="sk_live_..." className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono" />
                                    <p className="mt-1 text-xs text-gray-500">Your key is encrypted. Used to verify control and facilitate direct payments.</p>
                                    {errors.paystack_private_key && <p className="mt-1 text-sm text-red-600">{errors.paystack_private_key.message}</p>}
                                </div>
                            </div>
                        </div>

                        {serverError && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{serverError}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={registerMutation.isPending}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {registerMutation.isPending ? 'Verifying & Registering...' : 'Register as Partner'}
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-500 text-sm">
                                Already have an account? Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
