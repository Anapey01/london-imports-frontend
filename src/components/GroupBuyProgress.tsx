import React from 'react';

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

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <div className="flex justify-between items-end text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {variant === 'detailed' ? 'Group Buy Progress' : 'Batch Status'}
                </span>
                <span className="font-bold text-pink-600">{percentage}%</span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden shadow-inner border border-gray-100 dark:border-slate-600">
                <div
                    className="bg-pink-600 h-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${percentage}%` }}
                >
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-white/30 skew-x-[-20deg] animate-[shimmer_2s_infinite]" />
                </div>
            </div>

            <div className="flex justify-between items-center text-[11px] leading-tight text-gray-500 dark:text-gray-400 font-medium italic gap-4">
                <span className="whitespace-nowrap">
                    {current} {current === 1 ? 'item' : 'items'} ordered
                </span>
                <span className="whitespace-nowrap text-right ml-2">
                    {remaining > 0 ? (
                        <span className="text-gray-400 dark:text-gray-500">
                            {remaining} more to ship
                        </span>
                    ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold not-italic">
                            Ready to Ship! ✈️
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
};
