'use client';

import React, { useState, useEffect } from 'react';

const STATUS_TABS = ['All', 'PENDING', 'NEW_ORDERS', 'WAREHOUSE', 'SHIPPING', 'COMPLETED', 'CANCELLED'] as const;

const statusLabel = (s: string) => {
    switch (s) {
        case 'All': return 'All Orders';
        case 'PENDING': return 'Unpaid Orders';
        case 'NEW_ORDERS': return 'New Orders';
        case 'WAREHOUSE': return 'Packing in China';
        case 'SHIPPING': return 'On the Way to Ghana';
        case 'COMPLETED': return 'Delivered';
        case 'CANCELLED': return 'Cancelled';
        default: return s;
    }
};

interface FilterTabsProps {
    activeTab: string;
    counts: Record<string, number>;
    onTabChange: (s: string) => void;
}

const FilterTabs = React.memo(({ activeTab, counts, onTabChange }: FilterTabsProps) => {
    // Local state for instant UI response before parent transition yields
    const [localActiveTab, setLocalActiveTab] = useState(activeTab);

    useEffect(() => {
        setLocalActiveTab(activeTab);
    }, [activeTab]);

    return (
        <div className="flex gap-4 min-w-max">
            {STATUS_TABS.map(s => (
                <button
                    key={s}
                    onClick={() => {
                        setLocalActiveTab(s);
                        onTabChange(s);
                    }}
                    className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${localActiveTab === s
                        ? 'bg-slate-950 text-white border-slate-950 shadow-lg'
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                        }`}
                >
                    {statusLabel(s)}
                    <span className="ml-3 opacity-30 tabular-nums">[{counts[s as keyof typeof counts] || 0}]</span>
                </button>
            ))}
        </div>
    );
});

FilterTabs.displayName = 'FilterTabs';

export default FilterTabs;
