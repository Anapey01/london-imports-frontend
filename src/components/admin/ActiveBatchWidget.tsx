'use client';

import { motion } from 'framer-motion';
import { 
    Calendar, 
    Target, 
    AlertCircle,
    ChevronRight,
    Boxes
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
            <div className={`p-8 rounded-[2.5rem] border flex flex-col items-center justify-center text-center ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-primary-surface shadow-sm'
            }`}>
                <div className="p-4 rounded-full bg-primary-surface mb-4">
                    <AlertCircle className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="font-black text-lg">No Active Batch</h3>
                <p className={`text-[10px] font-black uppercase mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Create a new batch to start receiving pre-orders.</p>
                <Link href="/dashboard/admin/logistics" className="mt-6 px-8 py-3 bg-nuclear-text text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all">
                    Initiate Batch
                </Link>
            </div>
        );
    }

    const progress = Math.min(Math.round((batch.total_orders / batch.target_orders) * 100), 100);
    const isCritical = batch.days_left <= 3;

    return (
        <div className={`p-8 rounded-[2.5rem] border h-full flex flex-col justify-between ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-primary-surface shadow-sm'
        }`}>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-nuclear-text text-white">
                            <Boxes className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-nuclear-text'}`}>Operational Hub</h2>
                            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Batch Progress & Cutoff</p>
                        </div>
                    </div>
                    {isCritical && (
                        <div className="bg-red-500/15 text-red-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            Urgent
                        </div>
                    )}
                </div>

                <div className={`mb-8 p-5 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-primary-surface/40'}`}>
                    <p className={`text-[10px] font-black uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Shipment</p>
                    <h4 className="text-lg font-black">{batch.name}</h4>
                    
                    <div className="mt-4 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="text-[11px] font-bold">
                                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{batch.days_left} Days Remaining</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-slate-500" />
                            <span className="text-[11px] font-bold">
                                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{batch.total_orders} / {batch.target_orders} Units</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Target Volume</span>
                        <span className={`text-[12px] font-black ${progress > 90 ? 'text-emerald-700' : (isDark ? 'text-slate-300' : 'text-slate-700')}`}>{progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-primary-surface/40 rounded-full overflow-hidden border border-primary-surface/10">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                                progress > 80 ? 'bg-emerald-500' : 
                                progress > 50 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                        />
                    </div>
                </div>
            </div>

            <Link 
                href="/dashboard/admin/logistics"
                className="mt-10 flex items-center justify-between p-4 bg-nuclear-text text-white rounded-2xl group transition-all hover:bg-black"
            >
                <div>
                    <p className="text-[12px] font-black">Manage Batch Flow</p>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white/60' : 'text-white/80'}`}>In-depth logistics controls</p>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
