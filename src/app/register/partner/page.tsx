'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Lock, Briefcase, CreditCard, ShieldCheck, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PartnerRegisterPage() {
    const router = useRouter();
    const { login } = useAuthStore();

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
            // 1. Register as Partner
            await authAPI.registerPartner({
                ...formData,
                username: formData.email, // Use email as username
                vendor_type: 'STANDALONE'
            });

            // 2. Auto-login
            await login(formData.email, formData.password);

            toast.success('Partner Account Created!');
            // 3. Redirect to dashboard
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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-xl">
                <Link href="/sell" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Options
                </Link>
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Partner Registration
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create your exclusive branded store.
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Error Message */}
                        {serverError && (
                            <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Registration Failed</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{serverError}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Section 1: Account Details */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-600" /> Account Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input name="first_name" required value={formData.first_name} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input name="last_name" required value={formData.last_name} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                            </div>

                            <div className="mt-4 space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input name="email" type="email" required value={formData.email} onChange={handleChange} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="you@example.com" />
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input name="password" type="password" required minLength={8} value={formData.password} onChange={handleChange} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input name="password_confirm" type="password" required value={formData.password_confirm} onChange={handleChange} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Business Contact */}
                        <div className="pt-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-indigo-600" /> Business Contact
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="054 XXX XXXX" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">WhatsApp (Optional)</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-green-500" />
                                        </div>
                                        <input name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleChange} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="054 XXX XXXX" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Partner Verification */}
                        <div className="pt-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Verification & Payments
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Ghana Card Number</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input name="ghana_card_number" type="text" required value={formData.ghana_card_number} onChange={handleChange} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="GHA-XXXXXXXXX-X" />
                                    </div>
                                    <p className="text-xs text-gray-500">Required for automated fraud checks.</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Business Registration / Certificate No.</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Briefcase className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input name="business_certificate_number" type="text" required value={formData.business_certificate_number} onChange={handleChange} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" />
                                    </div>
                                    <p className="text-xs text-gray-500">Official business registration number.</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Paystack Private API Key</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CreditCard className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input name="paystack_private_key" type="password" required value={formData.paystack_private_key} onChange={handleChange} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="sk_live_xxxxxxxxxxxxxxxx" />
                                    </div>
                                    <div className="bg-yellow-50 p-3 rounded-md mt-2 text-xs text-yellow-800">
                                        <strong>Why do we need this?</strong> <br />
                                        Partners manage their own transactions. This key allows us to process payments directly to your Paystack account. We store this securely. By creating a Partner account, you agree to this integration.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                            >
                                {isLoading ? 'Verifying & Registering...' : 'Register as Partner'}
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
