import React from 'react';
import { VendorFormData } from '@/types/vendor';

interface BusinessStepProps {
    formData: VendorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    theme: string;
}

export const BusinessStep: React.FC<BusinessStepProps> = ({ formData, handleChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Business Verification</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Tell us about your brand and provide compliance credentials for merchant approval.
                </p>
            </div>

            <div className="space-y-1.5">
                <label htmlFor="business_name" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Store / Business Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="business_name"
                    type="text"
                    name="business_name"
                    required
                    value={formData.business_name}
                    onChange={handleChange}
                    placeholder="e.g. Accra Trends Boutique"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Business Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Briefly describe what items or categories you specialize in..."
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm resize-none"
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="whatsapp" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    WhatsApp Business Line
                </label>
                <input
                    id="whatsapp"
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="024 XXX XXXX (for quick customer support)"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">KYC & Compliance Verification</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        These details are encrypted and reviewed exclusively by administrators for merchant verification.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label htmlFor="ghana_card_number" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            Ghana Card Number (National ID)
                        </label>
                        <input
                            id="ghana_card_number"
                            type="text"
                            name="ghana_card_number"
                            value={formData.ghana_card_number || ''}
                            onChange={handleChange}
                            placeholder="GHA-XXXXXXXXX-X"
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm uppercase"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="business_certificate_number" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            Business Certificate No. (Optional)
                        </label>
                        <input
                            id="business_certificate_number"
                            type="text"
                            name="business_certificate_number"
                            value={formData.business_certificate_number || ''}
                            onChange={handleChange}
                            placeholder="e.g. BN-XXXXXXX / CS-XXXXXX"
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
