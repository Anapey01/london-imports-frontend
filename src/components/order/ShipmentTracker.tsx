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
    const currentMilestoneIndex = MILESTONES.findIndex(m => m.states.includes(currentState));
    const effectiveIndex = currentMilestoneIndex >= 0 ? currentMilestoneIndex : 0;

    return (
        <div className="w-full">
            {/* Minimal Pipeline Header */}
            <div className="flex items-center justify-between mb-8 opacity-60">
                <div className="flex items-center gap-2">
                    <Globe size={12} className="text-emerald-600" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                        Global Logistics Pipeline: GZ <span className="text-emerald-600 mx-1">→</span> ACCRA
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Live Status</span>
                </div>
            </div>

            {/* High-Density Horizontal Timeline */}
            <div className="relative pt-2 pb-6">
                {/* Background Track */}
                <div className="absolute top-[21px] left-2 right-2 h-[2px] bg-slate-100 dark:bg-slate-800 rounded-full" />
                
                {/* Active Progress Line */}
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(effectiveIndex / (MILESTONES.length - 1)) * 100}%` }}
                    className="absolute top-[21px] left-2 h-[2px] bg-slate-950 dark:bg-white rounded-full z-10"
                    transition={{ duration: 1, ease: "circOut" }}
                />

                <div className="flex justify-between relative z-20">
                    {MILESTONES.map((milestone, index) => {
                        const Icon = milestone.icon;
                        const isCompleted = index < effectiveIndex;
                        const isActive = index === effectiveIndex;
                        const isPast = index <= effectiveIndex;

                        return (
                            <div key={milestone.key} className="flex flex-col items-center flex-1 group">
                                {/* The Dot/Icon Node */}
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 mb-4
                                    ${isActive ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-lg scale-110 ring-4 ring-emerald-500/10' : 
                                      isCompleted ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-300'}
                                `}>
                                    {isCompleted ? (
                                        <CheckCircle2 size={16} />
                                    ) : (
                                        <Icon size={16} className={isActive ? 'animate-pulse' : ''} />
                                    )}
                                </div>

                                {/* Labels - High Density */}
                                <div className="text-center px-2">
                                    <h4 className={`text-[9px] font-black uppercase tracking-tight leading-tight transition-colors mb-1 ${isPast ? 'text-slate-900 dark:text-white' : 'text-slate-300'}`}>
                                        {milestone.label}
                                    </h4>
                                    <p className={`text-[8px] font-bold uppercase tracking-widest opacity-60 ${isActive ? 'text-emerald-600 opacity-100' : 'text-slate-400'}`}>
                                        {milestone.sublabel}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Status Feed (Optional/Compact) */}
            <div className="mt-6 flex items-center justify-center">
                <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center gap-3">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Current Phase:</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                        {MILESTONES[effectiveIndex].label}
                    </span>
                </div>
            </div>
        </div>
    );
}
