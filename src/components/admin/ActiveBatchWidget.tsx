'use client';

import { motion } from 'framer-motion';
import { 
    AlertCircle,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface ActiveBatchWidgetProps {
    batch: {
        id: string;
        name: string;
        total_orders: number;
        target_orders: number;
        cutoff_datetime: string;
        days_left: number;
    } | null;
    isDark: boolean;
}

export default function ActiveBatchWidget({ batch, isDark }: ActiveBatchWidgetProps) {
    if (!batch) {
        return (
            <div className={`p-12 border border-dashed flex flex-col items-center justify-center text-center ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
            }`}>
                <AlertCircle className="w-8 h-8 text-slate-100 mb-6" strokeWidth={1} />
                <h3 className="font-black text-[11px] uppercase tracking-[0.4em] text-slate-900">NO ACTIVE BATCH</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4 max-w-[200px]">
                    No active shipping batch found. Start a new batch to accept orders.
                </p>
                <Link href="/dashboard/admin/logistics" className="mt-8 px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all">
                    START NEW BATCH
                </Link>
            </div>
        );
    }

    const progress = Math.min(Math.round((batch.total_orders / batch.target_orders) * 100), 100);
    const isCritical = batch.days_left <= 3;

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-10 pt-4 sm:pt-0">
                <div className="space-y-1">
                    <h2 className="text-[11px] font-black tracking-[0.4em] text-slate-950 uppercase">SHIPPING OPERATIONS</h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Live shipment tracking</p>
                </div>
                {isCritical && (
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">URGENT BATCH</span>
                    </div>
                )}
            </div>

            <div className={`p-6 sm:p-8 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/30 border-slate-50'} space-y-8`}>
                <div>
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Active Batch Name</span>
                    <h4 className="text-lg font-serif font-bold text-slate-950 mt-1">{batch.name}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4 sm:gap-8 py-6 border-y border-slate-50">
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Days Remaining</p>
                        <p className="text-xs sm:text-sm font-black text-slate-900 tabular-nums uppercase">{batch.days_left} DAYS</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Total Orders</p>
                        <p className="text-xs sm:text-sm font-black text-slate-900 tabular-nums uppercase">{batch.total_orders} / {batch.target_orders}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-900">Capacity Filled</span>
                        <span className="text-[11px] font-black tabular-nums text-slate-900">{progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                            className={`h-full ${
                                isCritical ? 'bg-red-500' : 'bg-slate-900'
                            }`}
                        />
                    </div>
                </div>
            </div>

            <Link 
                href="/dashboard/admin/logistics"
                className="mt-auto flex items-center justify-between p-6 bg-slate-950 text-white group transition-all"
            >
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Shipping Manager</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Manage global shipping batches</p>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-400" />
            </Link>
        </div>
    );
}
