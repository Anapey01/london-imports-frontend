import React from 'react';

/**
 * London's Imports - Skeleton Card Component
 * Optimized: Uses native CSS animate-pulse instead of framer-motion 
 * to prevent main thread blocking during initial loads.
 */
export default function SkeletonCard() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative h-full animate-pulse">
            <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                {/* Visual block representing image area */}
            </div>
            <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="h-4 bg-gray-100 rounded-full w-24" />
                    <div className="h-3 bg-gray-100 rounded-full w-12" />
                </div>
                <div className="h-6 bg-gray-100 rounded-xl w-full pr-4" />
                <div className="flex items-center gap-2">
                    <div className="h-8 bg-gray-100 rounded-full w-24" />
                </div>
                <div className="pt-2">
                    <div className="h-10 bg-gray-50 rounded-2xl w-full" />
                </div>
            </div>
        </div>
    );
}
