'use client';

import { AdminProduct } from '@/types';

interface ProductStatsProps {
    products: AdminProduct[];
    isDark: boolean;
}

const ProductStats = ({ products }: ProductStatsProps) => {
    const stats = [
        { label: 'TOTAL_ENTRIES', value: products.length },
        { label: 'PRE_ORDER_PROTOCOL', value: products.filter((p) => p.preOrder).length },
        { label: 'ACTIVE_MANIFESTS', value: products.filter((p) => p.status === 'ACTIVE').length },
        { label: 'PENDING_AUTHORITY', value: products.filter((p) => p.status === 'PENDING').length },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 border border-slate-100">
            {stats.map((stat, i) => (
                <div key={i} className="p-8 bg-white space-y-2">
                    <p className="text-3xl font-serif font-bold text-slate-950 tabular-nums tracking-tighter">
                        {stat.value.toString().padStart(2, '0')}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                        {stat.label}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ProductStats;
