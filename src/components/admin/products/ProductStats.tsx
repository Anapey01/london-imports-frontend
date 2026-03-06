'use client';

import { AdminProduct } from '@/types';

interface ProductStatsProps {
    products: AdminProduct[];
    isDark: boolean;
}

const ProductStats = ({ products, isDark }: ProductStatsProps) => {
    const stats = [
        { label: 'Total Products', value: products.length, color: 'text-blue-500' },
        { label: 'Pre-Orders', value: products.filter((p) => p.preOrder).length, color: 'text-purple-500' },
        { label: 'Active', value: products.filter((p) => p.status === 'ACTIVE').length, color: 'text-emerald-500' },
        { label: 'Pending Review', value: products.filter((p) => p.status === 'PENDING').length, color: 'text-amber-500' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <div key={i} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-gray-100'}`}>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{stat.label}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductStats;
