/**
 * London's Imports - Countdown Timer Component
 * Shows time remaining until batch cutoff
 * Per order_lifecycle.md: "Countdown visible on product pages"
 */
'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
    cutoffDate: string; // ISO date string
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
}

export default function CountdownTimer({
    cutoffDate,
    className = '',
    size = 'md'
}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0, hours: 0, minutes: 0, seconds: 0, expired: false
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const calculateTimeLeft = () => {
            const difference = new Date(cutoffDate).getTime() - new Date().getTime();

            if (difference <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                expired: false
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [cutoffDate]);

    if (!mounted) {
        return null; // Prevent hydration mismatch
    }

    if (timeLeft.expired) {
        return (
            <div className={`inline-flex items-center gap-1 text-amber-600 font-medium ${className}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Cutoff passed - next batch</span>
            </div>
        );
    }

    const sizeClasses = {
        sm: 'text-xs gap-1',
        md: 'text-sm gap-2',
        lg: 'text-base gap-3'
    };

    const unitClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    return (
        <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
            <span className="text-gray-500 font-medium mr-1">Pre-order closes in:</span>
            <div className="flex gap-1">
                {timeLeft.days > 0 && (
                    <div className={`flex flex-col items-center justify-center bg-emerald-900 text-white rounded-lg ${unitClasses[size]}`}>
                        <span className="font-bold leading-none">{timeLeft.days}</span>
                        <span className="text-[8px] uppercase opacity-70">d</span>
                    </div>
                )}
                <div className={`flex flex-col items-center justify-center bg-emerald-900 text-white rounded-lg ${unitClasses[size]}`}>
                    <span className="font-bold leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase opacity-70">h</span>
                </div>
                <div className={`flex flex-col items-center justify-center bg-emerald-900 text-white rounded-lg ${unitClasses[size]}`}>
                    <span className="font-bold leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase opacity-70">m</span>
                </div>
                <div className={`flex flex-col items-center justify-center bg-pink-500 text-white rounded-lg ${unitClasses[size]} animate-pulse`}>
                    <span className="font-bold leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase opacity-70">s</span>
                </div>
            </div>
        </div>
    );
}
