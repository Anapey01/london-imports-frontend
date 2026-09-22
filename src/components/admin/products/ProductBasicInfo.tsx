import React from 'react';
import { ProductFormData } from '@/types/product';

interface ProductBasicInfoProps {
    formData: ProductFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isDark: boolean;
    inputClasses: string;
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({ formData, handleChange, isDark, inputClasses }) => {
    return (
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
            <h3 className={`text-base font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Basic Information</h3>

            <div className="space-y-6">
                <div>
                    <label htmlFor="name" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Product Title
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Premium Leather Crossbody Bag"
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label htmlFor="description" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Detailed Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe key features, craftsmanship, material composition..."
                        className={inputClasses}
                    />
                </div>
            </div>
        </div>
    );
};
