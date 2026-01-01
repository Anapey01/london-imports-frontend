/**
 * London's Imports - Viewing Indicator Component
 * Shows "X people are viewing this" for social proof
 */
'use client';

import { useState, useEffect } from 'react';

interface ViewingIndicatorProps {
    productId: string;
    className?: string;
}

export default function ViewingIndicator({ productId, className = '' }: ViewingIndicatorProps) {
    const [viewerCount, setViewerCount] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Generate a random but consistent viewer count based on product ID
        // In production, this would come from a real-time backend service
        const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const baseCount = (hash % 15) + 3; // 3-17 viewers

        setViewerCount(baseCount);

        // Simulate fluctuation
        const interval = setInterval(() => {
            setViewerCount(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const newCount = prev + change;
                return Math.max(2, Math.min(20, newCount));
            });
        }, 5000 + Math.random() * 5000);

        return () => clearInterval(interval);
    }, [productId]);

    if (!mounted || viewerCount < 2) return null;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Animated dots */}
            <div className="flex -space-x-1">
                {[...Array(Math.min(3, viewerCount))].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 bg-green-400 rounded-full animate-pulse border border-white"
                        style={{ animationDelay: `${i * 0.3}s` }}
                    />
                ))}
            </div>
            <span className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">{viewerCount}</span> people viewing now
            </span>
        </div>
    );
}
