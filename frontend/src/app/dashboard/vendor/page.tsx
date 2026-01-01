/**
 * London's Imports - Vendor Dashboard Overview
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';

export default function VendorDashboardPage() {
    const { theme } = useTheme();
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await vendorsAPI.dashboard();
                setMetrics(response.data.metrics);
            } catch (error) {
                console.error('Failed to fetch dashboard metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const cardStyle = {
        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
        borderColor: theme === 'dark' ? '#334155' : '#e5e7eb',
    };

    if (loading) {
        return <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
                ))}
            </div>
        </div>;
    }

    return (
        <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-xl border shadow-sm" style={cardStyle}>
                    <div className="text-sm font-medium mb-2" style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                        Total Orders
                    </div>
                    <div className="text-3xl font-bold" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                        {metrics?.total_orders || 0}
                    </div>
                </div>

                <div className="p-6 rounded-xl border shadow-sm" style={cardStyle}>
                    <div className="text-sm font-medium mb-2" style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                        Fulfilled Orders
                    </div>
                    <div className="text-3xl font-bold" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                        {metrics?.fulfilled_orders || 0}
                    </div>
                </div>

                <div className="p-6 rounded-xl border shadow-sm" style={cardStyle}>
                    <div className="text-sm font-medium mb-2" style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                        Fulfillment Rate
                    </div>
                    <div className="text-3xl font-bold text-pink-500">
                        {metrics?.fulfillment_rate || 0}%
                    </div>
                </div>

                <div className="p-6 rounded-xl border shadow-sm" style={cardStyle}>
                    <div className="text-sm font-medium mb-2" style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                        On-Time Rate
                    </div>
                    <div className="text-3xl font-bold text-green-500">
                        {metrics?.on_time_rate || 0}%
                    </div>
                </div>
            </div>

            {/* Recent Orders Section (Placeholder) */}
            <div className="rounded-xl border shadow-sm overflow-hidden" style={cardStyle}>
                <div className="p-6 border-b" style={{ borderColor: theme === 'dark' ? '#334155' : '#e5e7eb' }}>
                    <h2 className="text-lg font-bold" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                        Recent Orders
                    </h2>
                </div>
                <div className="p-12 text-center" style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <p>No orders yet</p>
                    <p className="text-sm mt-1">Orders will appear here once customers start purchasing.</p>
                </div>
            </div>
        </div>
    );
}
