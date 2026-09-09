import { Product } from '@/types/product';
import { Tag, Globe, ShieldCheck, CreditCard } from 'lucide-react';

export function ProductMeta({ product }: { product: Product }) {
    return (
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/60 dark:bg-slate-900/40 p-3 sm:p-4 my-6">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {/* 1. Category */}
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                        <Tag className="w-4 h-4 text-[#006B5A] dark:text-emerald-400" strokeWidth={1.75} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Category
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {product.category?.name || 'General'}
                        </span>
                    </div>
                </div>

                {/* 2. Origin */}
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                        <Globe className="w-4 h-4 text-[#006B5A] dark:text-emerald-400" strokeWidth={1.75} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Origin
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {product.shipping_origin || 'Guangzhou, CN'}
                        </span>
                    </div>
                </div>

                {/* 3. Quality Check */}
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Inspection
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                            Safe Delivery
                        </span>
                    </div>
                </div>

                {/* 4. Payment */}
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                        <CreditCard className="w-4 h-4 text-[#006B5A] dark:text-emerald-400" strokeWidth={1.75} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Security
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            MoMo & Cards
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
