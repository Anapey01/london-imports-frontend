import { Product } from '@/types/product';

export function ProductMeta({ product }: { product: Product }) {
    return (
        <div className="grid grid-cols-2 border-y border-slate-200 dark:border-slate-800 divide-x divide-slate-200 dark:divide-slate-800 my-8">
            {/* Category */}
            <div className="py-4 pr-3 sm:pr-6 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Category
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    {product.category?.name || 'General'}
                </span>
            </div>

            {/* Made In */}
            <div className="py-4 pl-3 sm:pl-6 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Made In
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    {product.shipping_origin || 'Guangzhou, CN'}
                </span>
            </div>

            {/* Quality Check */}
            <div className="py-4 pr-3 sm:pr-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Quality Check
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                    Safe Delivery
                </span>
            </div>

            {/* Payment */}
            <div className="py-4 pl-3 sm:pl-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Payment
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    MoMo Secured
                </span>
            </div>
        </div>
    );
}
