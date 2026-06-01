import React from 'react';
import { Plus, X } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

interface Variant {
    name: string;
    price: string;
    stock_quantity: string;
}

interface ProductVariantEditorProps {
    hasVariants: boolean;
    setHasVariants: (val: boolean) => void;
    variants: Variant[];
    setVariants: (variants: Variant[]) => void;
    price: string;
    onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputClasses: string;
}

export function ProductVariantEditor({
    hasVariants,
    setHasVariants,
    variants,
    setVariants,
    price,
    onPriceChange,
    inputClasses
}: ProductVariantEditorProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
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
                        value={price}
                        onChange={onPriceChange}
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
    );
}
