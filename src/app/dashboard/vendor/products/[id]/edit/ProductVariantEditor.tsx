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
                        value={price}
                        onChange={onPriceChange}
                        className={inputClasses}
                    />
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
    );
}
