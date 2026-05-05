import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, MapPin, CheckCircle2, Factory, Plane, Map } from 'lucide-react';

interface Props {
    status: string;
    isDark: boolean;
}

const STEPS = [
    { id: 'PENDING', label: 'Registered', icon: Package },
    { id: 'PROCESSING', label: 'Hub Consolidation', icon: Factory },
    { id: 'IN_TRANSIT', label: 'Global Corridor', icon: Plane },
    { id: 'ARRIVED', label: 'GH Hub Arrival', icon: Map },
    { id: 'OUT_FOR_DELIVERY', label: 'Dispatch', icon: Truck },
    { id: 'DELIVERED', label: 'Finality', icon: CheckCircle2 },
];

export default function LogisticsStepper({ status, isDark }: Props) {
    const currentStepIndex = STEPS.findIndex(s => s.id === status);
    
    return (
        <div className="w-full">
            <div className="relative flex justify-between">
                {/* Architectural Track */}
                <div className={`absolute top-4 left-0 right-0 h-px ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                    className="absolute top-4 left-0 h-px bg-pink-500"
                />

                {STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    
                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group flex-1">
                            {/* Visual Anchor */}
                            <motion.div 
                                initial={false}
                                animate={{ 
                                    scale: isCurrent ? 1.1 : 1,
                                    borderColor: isCompleted ? '#ec4899' : isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
                                    backgroundColor: isCurrent ? (isDark ? '#000' : '#fff') : 'transparent'
                                }}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500`}
                            >
                                <div className={`w-1 h-1 rounded-full ${isCompleted ? 'bg-pink-500' : isDark ? 'bg-white/10' : 'bg-slate-300'}`} />
                            </motion.div>
                            
                            {/* Identifier Label */}
                            <div className="mt-4 flex flex-col items-center text-center">
                                <span className={`text-[8px] font-mono tracking-[0.2em] uppercase mb-1 transition-all duration-500 ${isCurrent ? 'opacity-100 text-pink-500 font-black' : 'opacity-20'}`}>
                                    {isCurrent ? 'Current' : `Node 0${idx + 1}`}
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${isCurrent ? 'opacity-100' : 'opacity-30'}`}>
                                    {step.label}
                                </span>
                            </div>

                            {/* Hover Precision Indicator */}
                            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                                <div className={`px-3 py-1 text-[8px] font-mono whitespace-nowrap border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} shadow-2xl`}>
                                    ID: {step.id}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
