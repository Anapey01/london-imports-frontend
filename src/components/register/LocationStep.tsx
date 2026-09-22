import React from 'react';
import { VendorFormData } from '@/types/vendor';

interface LocationStepProps {
    formData: VendorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    theme: string;
}

const GHANA_REGIONS = [
    'Greater Accra',
    'Ashanti',
    'Central',
    'Eastern',
    'Western',
    'Western North',
    'Volta',
    'Oti',
    'Northern',
    'North East',
    'Savannah',
    'Upper East',
    'Upper West',
    'Bono',
    'Bono East',
    'Ahafo'
];

export const LocationStep: React.FC<LocationStepProps> = ({ formData, handleChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Store Location & Hub</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Where is your business or warehouse located for dispatch coordination?
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label htmlFor="region" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Region <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="region"
                        name="region"
                        required
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                    >
                        <option value="">Select Region</option>
                        {GHANA_REGIONS.map((region) => (
                            <option key={region} value={region}>
                                {region}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        City / Town <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="city"
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Accra, Tema, Kumasi"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Physical Address / Shop Location
                </label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Street name, landmark, market stall, or office number..."
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all text-sm resize-none"
                />
            </div>
        </div>
    );
};
