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
        'Loading/Transit': Package,
        'Last Mile': PlaneLanding,
        'Completed': CheckCircle2 // Fallback or extra
    };

    const totalOrders = data.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className={`p-8 rounded-[2.5rem] border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-primary-surface shadow-sm'
        }`}>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-nuclear-text'}`}>Logistics Pulse</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Live shipment distribution</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black text-emerald-600">{totalOrders}</span>
                    <p className="text-[10px] font-black uppercase opacity-30">Active Units</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 relative">
                {data.map((step, idx) => {
                    const Icon = icons[step.label as keyof typeof icons] || Package;
                    const percentage = totalOrders > 0 ? (step.count / totalOrders) * 100 : 0;

                    return (
                        <div key={step.label} className="w-full flex-1 group">
                            <div className="relative mb-4">
                                <div className={`p-5 rounded-2xl flex items-center justify-between transition-all ${
                                    isDark ? 'bg-slate-800 group-hover:bg-slate-750' : 'bg-primary-surface group-hover:bg-primary-surface/60'
                                }`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${
                                            idx === 0 ? 'bg-amber-500/10 text-amber-600' :
                                            idx === 1 ? 'bg-blue-500/10 text-blue-600' :
                                            'bg-emerald-500/10 text-emerald-600'
                                        }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className={`text-[10px] font-black uppercase tracking-tight opacity-40 ${isDark ? 'text-white' : 'text-nuclear-text'}`}>
                                                {step.label}
                                            </p>
                                            <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-nuclear-text'}`}>
                                                {step.count}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <span className="text-[11px] font-black opacity-30">{Math.round(percentage)}%</span>
                                    </div>
                                </div>

                                {/* Connector for Desktop */}
                                {idx < data.length - 1 && (
                                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-sm" />
                                    </div>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="h-1.5 w-full bg-primary-surface/30 rounded-full overflow-hidden border border-primary-surface/10">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, delay: idx * 0.2 }}
                                    className={`h-full rounded-full ${
                                        idx === 0 ? 'bg-amber-500' :
                                        idx === 1 ? 'bg-blue-500' :
                                        'bg-emerald-500'
                                    }`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 pt-8 border-t border-primary-surface/20 flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/40" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Processing</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/40" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Ocean/Air Transit</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Arrival & Ghana Hub</span>
                </div>
            </div>
        </div>
    );
}
