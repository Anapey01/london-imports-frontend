import { motion } from 'framer-motion';
import { Package, Truck, MapPin, CheckCircle2 } from 'lucide-react';

const STEPS = [
    { id: 'PENDING', label: 'Order Placed', icon: Package },
    { id: 'PROCESSING', label: 'Processing', icon: Package },
    { id: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
    { id: 'ARRIVED', label: 'Arrived in Hub', icon: MapPin },
    { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

export function LogisticsStepper({ status, isDark }: { status: string; isDark: boolean }) {
    const currentStepIndex = STEPS.findIndex(s => s.id === status);
    
    return (
        <div className="w-full overflow-x-auto pb-6 scrollbar-hide">
            <div className="relative flex justify-between min-w-[700px] px-4">
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
                            
                            <div className="mt-4 flex flex-col items-center text-center">
                                <span className={`text-[8px] font-mono tracking-[0.2em] uppercase mb-1 transition-all duration-500 ${isCurrent ? 'opacity-100 text-pink-500 font-black' : 'opacity-20'}`}>
                                    {isCurrent ? 'Current' : `Stage ${idx + 1}`}
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${isCurrent ? 'opacity-100' : 'opacity-30'}`}>
                                    {step.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
