'use client';

import { motion } from 'framer-motion';
import { 
    Clock, 
    Package, 
    PlaneLanding, 
    CheckCircle2
} from 'lucide-react';

interface OperationsFunnelProps {
    data: {
        label: string;
        count: number;
    }[];
    isDark: boolean;
}

export default function OperationsFunnel({ data, isDark }: OperationsFunnelProps) {
    const icons = {
        'Processing': Clock,
        'In Transit': Package,
        'Arrived': PlaneLanding,
        'Completed': CheckCircle2
    };

    const totalOrders = data.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className="space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-0">
                <div>
                    <h2 className="text-xs font-black tracking-[0.4em] text-slate-950 uppercase">SHIPPING STATUS</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">Current order distribution</p>
                </div>
                <div className="text-left sm:text-right border-l-2 sm:border-l-0 sm:border-r-0 border-slate-900 pl-4 sm:pl-0">
                    <span className="text-3xl font-serif font-bold text-slate-950 tabular-nums">{totalOrders}</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">TOTAL SHIPMENTS</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-100 border border-slate-100">
                {data.map((step, idx) => {
                    const Icon = icons[step.label as keyof typeof icons] || Package;
                    const percentage = totalOrders > 0 ? (step.count / totalOrders) * 100 : 0;

                    return (
                        <div key={step.label} className={`group p-6 sm:p-8 transition-all duration-700 ${
                            isDark ? 'bg-slate-950 hover:bg-slate-900' : 'bg-white hover:bg-slate-50'
                        }`}>
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">STAGE_{idx + 1}</span>
                                <Icon className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-950 truncate">{step.label}</p>
                                <div className="flex items-baseline justify-between">
                                    <p className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tighter tabular-nums">{step.count}</p>
                                    <span className="text-xs font-black text-slate-500 tabular-nums italic">{Math.round(percentage)}%</span>
                                </div>
                            </div>

                            <div className="mt-8 h-[2px] w-full bg-slate-50 relative overflow-hidden">
                                <motion.div 
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '0%' }}
                                    transition={{ duration: 1.5, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                                    className="absolute inset-0 bg-slate-900"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 py-6 border-t border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">System synced</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Secure connection</span>
                </div>
            </div>
        </div>
    );
}
