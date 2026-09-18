'use client';

import { AdminProduct } from '@/types';

interface ProductStatsProps {
    products: AdminProduct[];
    isDark: boolean;
}

const ProductStats = ({ products }: ProductStatsProps) => {
    const stats = [
        { label: 'TOTAL PRODUCTS', value: products.length },
        { label: 'PRE-ORDERS', value: products.filter((p) => p.preOrder).length },
        { label: 'ACTIVE PRODUCTS', value: products.filter((p) => p.status === 'ACTIVE').length },
        { label: 'PENDING APPROVAL', value: products.filter((p) => p.status === 'PENDING').length },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 border border-slate-100">
            {stats.map((stat, i) => (
                <div key={i} className="p-3.5 sm:p-6 md:p-8 bg-white space-y-1 sm:space-y-2 min-w-0">
                    <p className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 tabular-nums tracking-tighter">
                        {stat.value.toString().padStart(2, '0')}
                    </p>
                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400 truncate">
                        {stat.label}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ProductStats;
