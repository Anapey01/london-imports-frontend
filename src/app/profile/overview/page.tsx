'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI } from '@/lib/api';
import DashboardView from '@/components/profile/DashboardView';

export default function ProfileOverviewPage() {
    const { user, isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            ordersAPI.list()
                .then(res => setOrders(res.data.results || res.data))
                .catch(console.error);
        }
    }, [isAuthenticated]);

    if (!user) return null;

    return <DashboardView orders={orders} user={user} />;
}
