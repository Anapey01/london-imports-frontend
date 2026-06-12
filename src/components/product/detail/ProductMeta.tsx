import { Product } from '@/types/product';

export function ProductMeta({ product }: { product: Product }) {
    return (
        <div className="grid grid-cols-2 gap-px bg-border-standard border-y border-border-standard mt-4 mb-12">
            {/* Type */}
            <div className="bg-surface py-6 flex flex-col gap-2">
                <span className="text-[9px] font-black text-content-secondary uppercase tracking-[0.4em]">Category</span>
                <span className="text-xs font-bold text-content-primary uppercase tracking-widest">{product.category?.name}</span>
            </div>
            {/* Origin */}
            <div className="bg-surface py-6 flex flex-col gap-2 pl-8">
                <span className="text-[9px] font-black text-content-secondary uppercase tracking-[0.4em]">Made In</span>
                <span className="text-xs font-bold text-content-primary uppercase tracking-widest">{product.shipping_origin || 'Guangzhou, CN'}</span>
            </div>
            {/* Verification */}
            <div className="bg-surface py-6 flex flex-col gap-2 border-t border-border-standard">
                <span className="text-[9px] font-black text-content-secondary uppercase tracking-[0.4em]">Quality Check</span>
                <span className="text-xs font-bold text-content-primary uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    Safe Delivery
                </span>
            </div>
            {/* Secured */}
            <div className="bg-surface py-6 flex flex-col gap-2 pl-8 border-t border-border-standard">
                <span className="text-[9px] font-black text-content-secondary uppercase tracking-[0.4em]">Payment</span>
                <span className="text-xs font-bold text-content-primary uppercase tracking-widest">MOMO SECURED</span>
            </div>
        </div>
    );
}
