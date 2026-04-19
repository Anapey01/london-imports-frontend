import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, MapPin, CheckCircle2 } from 'lucide-react';

interface Props {
    status: string;
    isDark: boolean;
}

const STEPS = [
    { id: 'PENDING', label: 'Order Received', icon: Package },
    { id: 'PROCESSING', label: 'Processing', icon: Package },
    { id: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
    { id: 'OUT_FOR_DELIVERY', label: 'Last Mile', icon: MapPin },
    { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

export default function LogisticsStepper({ status, isDark }: Props) {
    const currentStepIndex = STEPS.findIndex(s => s.id === status);
    
    return (
        <div className="w-full py-8">
            <div className="relative flex justify-between">
                {/* Connector Line */}
                <div className={`absolute top-5 left-0 right-0 h-0.5 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                    className="absolute top-5 left-0 h-0.5 bg-emerald-500"
                />

                {STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    
                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                            <motion.div 
                                initial={false}
                                animate={{ 
                                    scale: isCurrent ? 1.2 : 1,
                                    backgroundColor: isCompleted ? '#10b981' : isDark ? '#1e293b' : '#ffffff',
                                    borderColor: isCompleted ? '#10b981' : isDark ? '#334155' : '#e5e7eb'
                                }}
                                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center shadow-lg transition-colors`}
                            >
                                <step.icon className={`w-5 h-5 ${isCompleted ? 'text-white' : isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                            </motion.div>
                            <span className={`mt-3 text-[10px] font-black uppercase tracking-wider transition-opacity ${isCurrent ? 'opacity-100 text-emerald-500' : 'opacity-40'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
