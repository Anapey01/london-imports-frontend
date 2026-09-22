import React from 'react';
import { VendorFormData } from '@/types/vendor';
import { ShieldCheck } from 'lucide-react';

interface BankStepProps {
    formData: VendorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    theme: string;
}

const PAYOUT_PROVIDERS = [
    'MTN Mobile Money',
    'Telecel Cash',
    'AT Money',
    'GCB Bank',
    'Ecobank Ghana',
    'Stanbic Bank',
    'Zenith Bank',
    'Fidelity Bank',
    'CalBank',
    'Absa Bank Ghana',
    'Access Bank',
    'Other Commercial Bank'
];

export const BankStep: React.FC<BankStepProps> = ({ formData, handleChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Payout Settlement Details</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Where you receive your revenue disbursements after orders are delivered.
                </p>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Escrow & Automated Settlement:</strong> All customer payments are collected centrally by London&apos;s Imports. Your net earnings will be transferred directly to this account upon delivery confirmation.
                </div>
            </div>

            <div className="space-y-1.5">
                <label htmlFor="bank_name" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Payment Method / Bank Provider <span className="text-red-500">*</span>
                </label>
                <select
                    id="bank_name"
                    name="bank_name"
                    required
                    value={formData.bank_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                >
                    <option value="">Select Provider or Network</option>
                    {PAYOUT_PROVIDERS.map((provider) => (
                        <option key={provider} value={provider}>
                            {provider}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label htmlFor="bank_account_number" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Account / MoMo Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="bank_account_number"
                        type="text"
                        name="bank_account_number"
                        required
                        value={formData.bank_account_number}
                        onChange={handleChange}
                        placeholder="024 XXX XXXX or Account No."
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="bank_account_name" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Registered Account Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="bank_account_name"
                        type="text"
                        name="bank_account_name"
                        required
                        value={formData.bank_account_name}
                        onChange={handleChange}
                        placeholder="Exact name on Bank / MoMo"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                    />
                </div>
            </div>
        </div>
    );
};
