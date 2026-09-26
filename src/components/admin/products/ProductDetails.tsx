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
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
            <h3 className={`text-base font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Pricing & Specifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex items-center gap-2.5 mb-4">
                        <input
                            type="checkbox"
                            id="hasVariants"
                            checked={hasVariants}
                            onChange={(e) => setHasVariants(e.target.checked)}
                            className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800"
                        />
                        <label htmlFor="hasVariants" className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Has Multiple Options? (Different sizes/prices)
                        </label>
                    </div>

                    {!hasVariants ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
                            <div>
                                <label htmlFor="stock_quantity" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    In-Stock Units
                                </label>
                                <input
                                    id="stock_quantity"
                                    type="number"
                                    name="stock_quantity"
                                    min="1"
                                    value={formData.stock_quantity ?? '10'}
                                    onChange={handleChange}
                                    placeholder="10"
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Product Variations</h4>
                                <div className="space-y-2.5">
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
                                                    className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${
                                                        isDark
                                                            ? 'bg-slate-700 border-slate-600 text-white focus:border-slate-400'
                                                            : 'bg-white border-slate-200 text-slate-900 focus:border-slate-900'
                                                    }`}
                                                    required
                                                />
                                            </div>
                                            <div className="w-28">
                                                <input
                                                    type="number"
                                                    placeholder="GH₵ Price"
                                                    value={variant.price}
                                                    onChange={(e) => {
                                                        const newVariants = [...variants];
                                                        newVariants[index].price = e.target.value;
                                                        setVariants(newVariants);
                                                    }}
                                                    className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${
                                                        isDark
                                                            ? 'bg-slate-700 border-slate-600 text-white focus:border-slate-400'
                                                            : 'bg-white border-slate-200 text-slate-900 focus:border-slate-900'
                                                    }`}
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
                                                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setVariants([...variants, { name: '', price: '', stock_quantity: '0' }])}
                                    className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Another Option
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="category_id" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
                        {(() => {
                            const parents = categories.filter(c => !c.parent && !c.parent_slug);
                            if (parents.length === 0) {
                                return categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ));
                            }
                            return parents.map(parent => {
                                const children = categories.filter(c => c.parent === parent.id || c.parent_slug === parent.slug);
                                if (children.length === 0) {
                                    return <option key={parent.id} value={parent.id}>{parent.name}</option>;
                                }
                                return (
                                    <optgroup key={parent.id} label={parent.name}>
                                        <option value={parent.id}>{parent.name} (All / General)</option>
                                        {children.map(child => (
                                            <option key={child.id} value={child.id}>
                                                &nbsp;&nbsp;{child.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                );
                            });
                        })()}
                    </select>
                </div>

                <div>
                    <label htmlFor="preorder_status" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Availability Mode
                    </label>
                    <select
                        id="preorder_status"
                        name="preorder_status"
                        required
                        value={formData.preorder_status}
                        onChange={handleChange}
                        aria-label="Availability status"
                        className={inputClasses}
                    >
                        <option value="PREORDER">Pre-order (Standard Batch)</option>
                        <option value="READY_TO_SHIP">Ready in Stock (Instant Purchase)</option>
                        <option value="CLOSING_SOON">Closing Soon</option>
                    </select>
                </div>

                {/* Variants Inputs */}
                <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {!hasVariants ? (
                        <div>
                            <label htmlFor="sizes" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Available Sizes (optional, comma-separated)
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
                    ) : (
                        <div className={`p-3.5 rounded-xl border flex items-center ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Specific sizes & prices are configured in the variations list above.
                            </p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="colors" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Available Colors (optional, comma-separated)
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
                        <label htmlFor="shipping_origin" className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Dispatch Location / Origin
                        </label>
                        <input
                            id="shipping_origin"
                            type="text"
                            name="shipping_origin"
                            value={formData.shipping_origin}
                            onChange={handleChange}
                            placeholder="e.g. Accra, London, Turkey, China"
                            className={inputClasses}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
