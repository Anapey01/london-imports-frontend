'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Package, Clock, TrendingUp, Users } from 'lucide-react';

interface PlatformStats {
    orders_fulfilled: number;
    on_time_rate: number;
    total_orders: number;
    secure_payments: boolean;
    whatsapp_support: boolean;
}

// Animated counter hook
function useAnimatedCounter(end: number | string, duration: number = 1500, start: boolean = true) {
    const [count, setCount] = useState<number | string>(0);

    useEffect(() => {
        if (typeof end === 'string') {
            setCount(end);
            return;
        }

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
    value: number | string;
    label: string;
    icon: React.ElementType;
    suffix?: string;
    prefix?: string;
    isLoaded?: boolean;
}) {
    const animatedValue = useAnimatedCounter(value, 1500, isLoaded);

    return (
        <div className="group flex flex-col items-center px-4 py-3 sm:py-0 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
                <Icon strokeWidth={1.5} className="w-6 h-6 sm:w-8 sm:h-8 text-slate-800 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight tabular-nums">
                    {prefix}{animatedValue.toLocaleString()}{suffix}
                </span>
            </div>
            <span className="text-slate-500 font-medium text-xs sm:text-sm text-center leading-tight uppercase tracking-wide">
                {label}
            </span>
        </div>
    );
}

export default function StatsBar() {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Minimum loading time for animation
                const [response] = await Promise.all([
                    api.get('/orders/stats/'),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);
                setStats(response.data);
                setIsLoaded(true);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
                // Keep default null state to show skeleton or static fallback
                setStats({
                    orders_fulfilled: 0,
                    on_time_rate: 98,
                    total_orders: 0,
                    secure_payments: true,
                    whatsapp_support: true
                });
                setIsLoaded(true);
            }
        };

        fetchStats();
    }, []);

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
            value: stats?.orders_fulfilled || 0,
            label: 'Orders Fulfilled',
            icon: Package,
            suffix: ''
        },
        {
            value: stats?.on_time_rate || 98,
            label: 'On-Time Delivery',
            icon: Clock,
            suffix: '%'
        },
        {
            value: stats?.total_orders || 0,
            label: 'Total Orders',
            icon: TrendingUp,
            suffix: ''
        },
        {
            value: '24/7',
            label: 'WhatsApp Support',
            icon: Users,
            suffix: '' // No suffix for text
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
