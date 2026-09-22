import React from 'react';
import { VendorFormData } from '@/types/vendor';

interface AccountStepProps {
    formData: VendorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    theme: string;
}

export const AccountStep: React.FC<AccountStepProps> = ({ formData, handleChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Account Credentials</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Your personal login credentials to access the vendor portal.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label htmlFor="first_name" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        required
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="e.g. Kwame"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="last_name" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="last_name"
                        type="text"
                        name="last_name"
                        required
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="e.g. Mensah"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Business / Owner Email <span className="text-red-500">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="kwame@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                    id="phone"
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="024 XXX XXXX"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 8 characters"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="password_confirm" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="password_confirm"
                        type="password"
                        name="password_confirm"
                        required
                        value={formData.password_confirm}
                        onChange={handleChange}
                        placeholder="Repeat your password"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                    />
                </div>
            </div>
        </div>
    );
};
