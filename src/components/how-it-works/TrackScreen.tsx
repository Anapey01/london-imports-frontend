import React, { useState, useEffect } from 'react';
import { sounds } from '@/lib/sounds';

interface TrackScreenProps {
    activeStep: number;
}

export const TrackScreen: React.FC<TrackScreenProps> = ({ activeStep }) => {
    const [showSMS, setShowSMS] = useState(false);
    const [completedSteps, setCompletedSteps] = useState(0);

    useEffect(() => {
        if (activeStep !== 2) return;

        // Animate steps completing one by one
        const stepTimers = [
            setTimeout(() => setCompletedSteps(1), 500),
            setTimeout(() => setCompletedSteps(2), 1000),
            setTimeout(() => setCompletedSteps(3), 1500),
            setTimeout(() => {
                setShowSMS(true);
                sounds.notification();
            }, 2000),
        ];
        return () => stepTimers.forEach(clearTimeout);
    }, [activeStep]);

    const steps = [
        { label: 'Order Confirmed', icon: 'check' },
        { label: 'Shipped from China', icon: 'plane' },
        { label: 'Arrived in Ghana', icon: 'box' },
        { label: 'Out for Delivery', icon: 'truck' },
    ];

    return (
        <div key="track" className="h-full rounded-2xl p-4 flex flex-col relative bg-white text-gray-900">
            <div className="text-sm font-bold mb-1 text-gray-900">Order #LI-2024-0847</div>
            <div className="text-xs mb-4 text-gray-500">iPhone 15 Pro Max</div>

            <div className="flex-1 space-y-3">
                {steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${i < completedSteps ? 'bg-pink-500 scale-100' : i === completedSteps ? 'bg-pink-200 scale-100' : 'bg-gray-200 scale-90'
                                }`}
                        >
                            {i < completedSteps && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <span className={`text-xs ${i < completedSteps ? 'text-gray-900 font-medium' : 'text-gray-400 font-normal'}`}>
                            {s.label}
                        </span>
                        {i === completedSteps - 1 && i < 3 && (
                            <span className="text-xs ml-auto text-pink-500">Just now</span>
                        )}
                    </div>
                ))}
            </div>

            {/* SMS Notification Pop-up */}
            {showSMS && (
                <div className="absolute -top-2 left-2 right-2 rounded-xl p-3 shadow-xl animate-fade-in-up z-10 bg-gray-800 text-white">
                    <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-500">
                            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-white">London&apos;s Imports</div>
                            <div className="text-xs text-gray-300">Your order has arrived in Ghana! Delivery tomorrow</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="rounded-lg p-2 text-center text-xs mt-2 bg-pink-50 text-pink-700">
                📍 Estimated delivery: Tomorrow, 2PM
            </div>
        </div>
    );
};
