import React from 'react';
import { Plus, X } from 'lucide-react';
import { ProductFormData, ProductVariant } from '@/types/product';
import { Category } from '@/types';

interface ProductDetailsProps {
    formData: ProductFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    hasVariants: boolean;
    setHasVariants: (value: boolean) => void;
    variants: ProductVariant[];
    setVariants: (variants: ProductVariant[]) => void;
    categories: Category[];
    isDark: boolean;
    inputClasses: string;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
    formData,
    handleChange,
    hasVariants,
    setHasVariants,
    variants,
    setVariants,
    categories,
    isDark,
    inputClasses
}) => {
    return (
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            id="hasVariants"
                            checked={hasVariants}
                            onChange={(e) => setHasVariants(e.target.checked)}
                            className="w-4 h-4 text-pink-600 rounded border-gray-300 focus:ring-pink-500"
                        />
                        <label htmlFor="hasVariants" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            Has Multiple Options? (Different sizes/prices)
                        </label>
                    </div>

                    {!hasVariants ? (
                        <div>
                            <label htmlFor="price" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Price (GH₵)
                            </label>
                            <input
                                id="price"
                                type="number"
                                name="price"
                                required={!hasVariants}
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className={inputClasses}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                                <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Product Variations</h4>
                                <div className="space-y-3">
                                    {variants.map((variant, index) => (
                                        <div key={index} className="flex gap-2 items-start">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Size/Option (e.g. Small)"
                                                    value={variant.name}
                                                    onChange={(e) => {
                                                        const newVariants = [...variants];
                                                        newVariants[index].name = e.target.value;
                                                        setVariants(newVariants);
                                                    }}
                                                    className={`w-full px-3 py-2 text-sm rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                    required
                                                />
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    value={variant.price}
                                                    onChange={(e) => {
                                                        const newVariants = [...variants];
                                                        newVariants[index].price = e.target.value;
                                                        setVariants(newVariants);
                                                    }}
                                                    className={`w-full px-3 py-2 text-sm rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                aria-label="Remove variant"
                                                onClick={() => {
                                                    if (variants.length > 1) {
                                                        const newVariants = variants.filter((_, i) => i !== index);
                                                        setVariants(newVariants);
                                                    }
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setVariants([...variants, { name: '', price: '', stock_quantity: '0' }])}
                                    className="mt-3 text-sm text-pink-600 font-medium flex items-center gap-1 hover:text-pink-700"
                                >
                                    <Plus className="w-4 h-4" /> Add Another Option
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="category_id" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        Category
                    </label>
                    <select
                        id="category_id"
                        name="category_id"
                        required
                        value={formData.category_id}
                        onChange={handleChange}
                        aria-label="Category"
                        className={inputClasses}
                    >
                        <option value="">Select a Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="preorder_status" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        Pre-order Status
                    </label>
                    <select
                        id="preorder_status"
                        name="preorder_status"
                        required
                        value={formData.preorder_status}
                        onChange={handleChange}
                        aria-label="Pre-order status"
                        className={inputClasses}
                    >
                        <option value="PREORDER">Pre-order (Standard)</option>
                        <option value="READY_TO_SHIP">Ready to Ship (Available Now)</option>
                        <option value="CLOSING_SOON">Closing Soon</option>
                    </select>
                </div>

                {/* Variants Inputs */}
                <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="sizes" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            Available Sizes (comma-separated)
                        </label>
                        <input
                            id="sizes"
                            type="text"
                            name="sizes"
                            value={formData.sizes}
                            onChange={handleChange}
                            placeholder="e.g. S, M, L, XL"
                            className={inputClasses}
                        />
                    </div>
                    <div>
                        <label htmlFor="colors" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            Available Colors (comma-separated)
                        </label>
                        <input
                            id="colors"
                            type="text"
                            name="colors"
                            value={formData.colors}
                            onChange={handleChange}
                            placeholder="e.g. Red, Blue, Black"
                            className={inputClasses}
                        />
                    </div>

                    {/* Shipping Origin */}
                    <div className="col-span-1 sm:col-span-2">
                        <label htmlFor="shipping_origin" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            Shipping Origin
                        </label>
                        <input
                            id="shipping_origin"
                            type="text"
                            name="shipping_origin"
                            value={formData.shipping_origin}
                            onChange={handleChange}
                            placeholder="e.g. China, Turkey, London"
                            className={inputClasses}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
