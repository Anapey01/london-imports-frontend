'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI } from '@/lib/api';
import OrdersView from '@/components/profile/OrdersView';

export default function ProfileOrdersPage() {
    const { isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            ordersAPI.list()
                .then(res => setOrders(res.data.results || res.data))
                .catch(console.error);
        }
    }, [isAuthenticated]);

    return <OrdersView orders={orders} />;
}
