/**
 * London's Imports - Recent Orders Feed Component
 * Shows recent orders for social proof on homepage
 */
'use client';

import { useState, useEffect } from 'react';

// Mock recent orders (in production, this would come from the API)
const recentOrders = [
    { name: 'Abena K.', item: 'iPhone 15 Pro Max', city: 'Accra', time: '2 min ago' },
    { name: 'Kwame O.', item: 'Samsung S24 Ultra', city: 'Kumasi', time: '5 min ago' },
    { name: 'Sarah D.', item: 'MacBook Air M3', city: 'Tema', time: '8 min ago' },
    { name: 'Emmanuel M.', item: 'PlayStation 5 Slim', city: 'Accra', time: '12 min ago' },
    { name: 'Jessica A.', item: 'AirPods Pro 2', city: 'Takoradi', time: '15 min ago' },
    { name: 'Kofi B.', item: 'iPad Pro 12.9"', city: 'Cape Coast', time: '18 min ago' },
];

export default function RecentOrdersFeed() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex(prev => (prev + 1) % recentOrders.length);
                setIsVisible(true);
            }, 500);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const order = recentOrders[currentIndex];

    return (
        <div className="fixed bottom-20 left-6 z-40 max-w-xs hidden sm:block">
            <div
                className={`bg-white rounded-xl shadow-lg border border-gray-100 p-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
            >
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {order.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                            <span className="font-semibold">{order.name}</span>
                            <span className="text-gray-500"> from {order.city}</span>
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                            ordered <span className="font-medium text-pink-600">{order.item}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{order.time}</p>
                    </div>

                    {/* Check icon */}
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
