import React, { useRef, useEffect } from 'react';
import { Package } from 'lucide-react';
import { formatNumber } from '@/lib/format';

interface GroupBuyProgressProps {
    current: number;
    target: number;
    variant?: 'compact' | 'detailed' | 'micro';
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

    if (variant === 'micro') {
        return (
            <div className="flex items-center gap-3 w-full">
                <span className="text-[9px] font-black nuclear-text tabular-nums min-w-[24px]">{percentage}%</span>
                <div className="flex-1 bg-primary-surface h-0.5 rounded-full overflow-hidden border border-primary-surface/40 shadow-inner">
                    <div
                        ref={progressRef}
                        className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                    />
                </div>
                <span className="text-[7px] font-black nuclear-text opacity-40 uppercase tracking-widest whitespace-nowrap">
                    {remaining > 0 ? `${formatNumber(remaining)} more` : 'Ready'}
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold nuclear-text uppercase tracking-[0.2em]">
                    {variant === 'detailed' ? 'Group Buy Progress' : 'Batch Status'}
                </span>
                <span className="text-[10px] font-bold nuclear-text tabular-nums tracking-widest">{percentage}%</span>
            </div>

            <div className="w-full bg-primary-surface h-1 rounded-sm overflow-hidden border border-primary-surface/60 shadow-inner">
                <div
                    ref={progressRef}
                    className="h-full bg-emerald-500 transition-all duration-1000 ease-out relative"
                />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[8px] font-bold tracking-[0.3em] uppercase">
                <div className="flex items-center gap-1.5 nuclear-text opacity-40">
                    <span>{formatNumber(current)} {current === 1 ? 'item' : 'items'} ordered</span>
                </div>

                <div className="text-right">
                    {remaining > 0 ? (
                        <span className="nuclear-text opacity-30">
                            {formatNumber(remaining)} more to ship
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black">
                            <Package className="w-3 h-3" />
                            Ready to Ship
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
