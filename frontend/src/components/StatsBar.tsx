'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Package, Clock, ShieldCheck, MessageCircle } from 'lucide-react';

interface PlatformStats {
    orders_fulfilled: number;
    on_time_rate: number;
    total_orders: number;
    secure_payments: boolean;
    whatsapp_support: boolean;
}

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 1500, start: boolean = true) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start || end === 0) {
            setCount(end);
            return;
        }

        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutQuad = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOutQuad * end));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration, start]);

    return count;
}

function StatItem({
    value,
    label,
    icon: Icon,
    suffix = '',
    prefix = '',
    isLoaded = false
}: {
    value: number;
    label: string;
    icon: React.ElementType;
    suffix?: string;
    prefix?: string;
    isLoaded?: boolean;
}) {
    const animatedValue = useAnimatedCounter(value, 1500, isLoaded);

    return (
        <div className="group flex flex-col items-center px-4 py-3 sm:py-0 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {prefix}{animatedValue.toLocaleString()}{suffix}
                </span>
            </div>
            <span className="text-slate-500 font-medium text-xs sm:text-sm text-center leading-tight">
                {label}
            </span>
        </div>
    );
}

export default function StatsBar() {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [debugError, setDebugError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Remove hardcoded delay to test speed
                const response = await api.get('/orders/stats/');
                setStats(response.data);
                setIsLoaded(true);
            } catch (error: any) {
                console.error('Failed to fetch stats:', error);
                // DEBUG: Show validation error on screen
                setDebugError(error.message || 'Unknown Error');
                // Don't fallback to fake data - let's see the error
            }
        };

        fetchStats();
    }, []);

    if (debugError) {
        return (
            <div className="bg-red-50 p-4 text-center text-red-600 border-y border-red-200">
                <p className="font-bold">Debug Error: {debugError}</p>
                <p className="text-sm">API: {process.env.NEXT_PUBLIC_API_URL}</p>
            </div>
        );
    }

    // Show skeleton while loading
    if (!stats) {
        return (
            <section className="bg-gradient-to-b from-slate-50 to-white border-y border-slate-100/80 py-8 sm:py-10 md:py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-slate-200/60 sm:divide-y-0">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center justify-center py-6 sm:py-0 animate-pulse">
                                <div className="h-10 w-24 bg-slate-200 rounded mb-2"></div>
                                <div className="h-4 w-20 bg-slate-100 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const statItems = [
        {
            value: stats.orders_fulfilled || stats.total_orders,
            label: 'Orders Fulfilled',
            icon: Package,
            suffix: '+'
        },
        {
            value: stats.on_time_rate,
            label: 'On-time Delivery',
            icon: Clock,
            suffix: '%'
        },
        {
            value: 100,
            label: 'Secure Payments',
            icon: ShieldCheck,
            suffix: '%'
        },
        {
            value: 24,
            label: 'WhatsApp Support',
            icon: MessageCircle,
            suffix: '/7'
        }
    ];

    return (
        <section className="bg-gradient-to-b from-slate-50 to-white border-y border-slate-100/80 py-8 sm:py-10 md:py-12 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mobile: Flex Column, Desktop: Grid */}
                <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 divide-y divide-slate-200/60 sm:divide-y-0">
                    {statItems.map((stat, i) => {
                        // Responsive border logic
                        let borderClass = 'border-slate-200/60';
                        if (i === 0) borderClass += ' sm:border-r sm:border-b lg:border-b-0';
                        if (i === 1) borderClass += ' sm:border-b lg:border-b-0 lg:border-r';
                        if (i === 2) borderClass += ' sm:border-r lg:border-r'; // sm:border-r persists to lg

                        return (
                            <div
                                key={i}
                                className={`flex flex-col items-center justify-center py-6 sm:py-0 ${borderClass}`}
                            >
                                <StatItem
                                    value={stat.value}
                                    label={stat.label}
                                    icon={stat.icon}
                                    suffix={stat.suffix}
                                    isLoaded={isLoaded}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
