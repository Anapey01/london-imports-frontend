/**
 * ShipmentTracker - Professional Multi-Country Tracking UI
 * Shows the journey from Guangzhou, China to Accra, Ghana.
 */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Package, 
    Ship, 
    Anchor, 
    Truck, 
    CheckCircle2,
    Globe,
    Container
} from 'lucide-react';

interface ShipmentTrackerProps {
    currentState: string; // The order state from backend
    timelineEvents?: Array<{
        title: string;
        location?: string;
        timestamp: string;
    }>;
}

const MILESTONES = [
    {
        key: 'ORIGIN',
        label: 'Guangzhou Warehouse',
        sublabel: 'China 🇨🇳',
        icon: Package,
        states: ['PAID', 'OPEN_FOR_BATCH', 'CUTOFF_REACHED'],
        color: 'blue'
    },
    {
        key: 'PACKED',
        label: 'Loaded in Container',
        sublabel: 'Securely Sealed',
        icon: Container,
        states: ['IN_FULFILLMENT'],
        color: 'indigo'
    },
    {
        key: 'TRANSIT',
        label: 'On the Water/Air',
        sublabel: 'International Transit',
        icon: Ship,
        states: ['IN_TRANSIT'],
        color: 'purple'
    },
    {
        key: 'PORT',
        label: 'At Tema Port',
        sublabel: 'Clearing Customs 🇬🇭',
        icon: Anchor,
        states: ['OUT_FOR_DELIVERY'], // Mapping for now, can be sophisticated
        color: 'amber'
    },
    {
        key: 'READY',
        label: 'Ready for Delivery',
        sublabel: 'Final Mile',
        icon: Truck,
        states: ['DELIVERED'],
        color: 'emerald'
    }
];

export default function ShipmentTracker({ currentState }: ShipmentTrackerProps) {
    // Determine the current milestone index
    const currentMilestoneIndex = MILESTONES.findIndex(m => m.states.includes(currentState));
    
    // Fallback logic for intermediate states
    const effectiveIndex = currentMilestoneIndex >= 0 ? currentMilestoneIndex : 0;

    return (
        <div className="w-full bg-white rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Shipment Journey</h2>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mt-1">GZ → ACCRA Tracking</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                    <Globe className="w-4 h-4 text-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-tighter">Real-Time Logistics Link</span>
                </div>
            </div>

            {/* The High-Fidelity Timeline */}
            <div className="relative">
                {/* Background Connecting Line */}
                <div className="absolute top-8 left-10 right-10 h-0.5 bg-gray-50 hidden md:block">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(effectiveIndex / (MILESTONES.length - 1)) * 100}%` }}
                        className="h-full bg-gray-900 shadow-[0_0_8px_rgba(31,41,55,0.2)]"
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between relative gap-10 md:gap-0">
                    {MILESTONES.map((milestone, index) => {
                        const Icon = milestone.icon;
                        const isCompleted = index < effectiveIndex;
                        const isActive = index === effectiveIndex;
                        const isPast = index <= effectiveIndex;

                        return (
                            <div key={milestone.key} className="flex flex-row md:flex-col items-center gap-6 md:gap-4 flex-1 relative group">
                                {/* Desktop Vertical Connector Line (for mobile spacing) */}
                                <div className="absolute top-16 bottom-0 left-8 md:hidden w-px bg-gray-50 last:hidden">
                                     {isPast && index < MILESTONES.length -1 && (
                                         <div className="w-full h-full bg-gray-900 origin-top" />
                                     )}
                                </div>

                                {/* Icon Circle */}
                                <div className={`
                                    relative z-10 w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500
                                    ${isActive ? 'bg-gray-900 text-white shadow-xl scale-110' : 
                                      isCompleted ? 'bg-gray-100 text-gray-900' : 'bg-white border-2 border-gray-50 text-gray-200'}
                                `}>
                                    <Icon className={`w-7 h-7 ${isActive ? 'animate-bounce-subtle' : ''}`} />
                                    
                                    {isCompleted && (
                                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                                        </div>
                                    )}
                                </div>

                                {/* Label Content */}
                                <div className="text-left md:text-center">
                                    <h3 className={`text-sm font-extrabold uppercase tracking-tight transition-colors duration-300 ${isPast ? 'text-gray-900' : 'text-gray-300'}`}>
                                        {milestone.label}
                                    </h3>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                                        {milestone.sublabel}
                                    </p>
                                    
                                    {isActive && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-3 px-3 py-1 bg-gray-900 text-white text-[9px] font-bold rounded-lg inline-block whitespace-nowrap"
                                        >
                                            CURRENT STATUS
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Destination Highlight */}
            <div className="mt-16 pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-80">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-2xl">
                        <Globe className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Final Destination</p>
                        <p className="text-sm font-bold text-gray-900">Accra, Ghana (LI-HUB)</p>
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                        Secure Air & Sea Transit
                    </p>
                </div>
            </div>
        </div>
    );
}
