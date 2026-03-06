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
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Basic Information</h3>

            <div className="space-y-6">
                <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        Product Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Premium Leather Bag"
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label htmlFor="description" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your product..."
                        className={inputClasses}
                    />
                </div>
            </div>
        </div>
    );
};
