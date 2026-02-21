import React, { useRef, useEffect } from 'react';
import { Package } from 'lucide-react';

interface GroupBuyProgressProps {
    current: number;
    target: number;
    variant?: 'compact' | 'detailed';
}

/**
 * GroupBuyProgress component for showing order completion status.
 * Visualizes the progress towards a batch shipment goal.
 */
export const GroupBuyProgress: React.FC<GroupBuyProgressProps> = ({
    current: rawCurrent,
    target,
    variant = 'compact'
}) => {
    const current = Math.max(rawCurrent, 0);
    const percentage = Math.min(Math.round((current / target) * 100), 100);
    const remaining = Math.max(target - current, 0);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (progressRef.current) {
            progressRef.current.style.width = `${percentage}%`;
        }
    }, [percentage]);

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-end text-sm">
                <span className="font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                    {variant === 'detailed' ? 'Group Buy Progress' : 'Batch Status'}
                </span>
                <span className="font-black text-pink-600 tabular-nums">{percentage}%</span>
            </div>

            <div className="w-full bg-gray-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden shadow-inner border border-gray-200 dark:border-slate-600">
                <div
                    ref={progressRef}
                    className="bg-pink-600 h-full transition-all duration-1000 ease-out relative"
                >
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-white/20 skew-x-[-20deg] animate-[shimmer_2s_infinite]" />
                </div>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[11px] font-bold tracking-tight">
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 italic font-medium">
                    <span>{current.toLocaleString()} {current === 1 ? 'item' : 'items'} ordered</span>
                </div>

                <div className="text-right">
                    {remaining > 0 ? (
                        <span className="text-gray-400 dark:text-gray-500 font-medium italic">
                            {remaining.toLocaleString()} more to ship
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-black">
                            <Package className="w-3 h-3" />
                            Ready to Ship
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
