'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { useTheme } from '@/providers/ThemeProvider';
import Link from 'next/link';
import {
    ChevronLeft,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    MapPin,
    Phone,
    Mail,
    User,
    Calendar,
    CreditCard
} from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    price: string;
    image: string;
    size?: string;
    color?: string;
}

interface OrderDetail {
    id: string;
    order_number: string;
    customer: string; // Username or Name
    email: string;
    phone: string;
    total: string;
    subtotal: string;
    delivery_fee: string;
    status: string; // Backend 'state' mapped to 'status'
    payment_status?: string;
    created_at: string;
    delivery_address: string;
    delivery_city: string;
    delivery_region: string;
    items: OrderItem[];
    payment_method?: string;
}

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const orderId = params.id as string;

    useEffect(() => {
        if (orderId) {
            loadOrder();
        }
    }, [orderId]);

    const loadOrder = async () => {
        try {
            const response = await adminAPI.getOrder(orderId);
            setOrder(response.data);
        } catch (error) {
            console.error('Failed to load order:', error);
            alert('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        setUpdating(true);
        try {
            // Map frontend status actions to backend Enum values if needed, 
            // or send the exact string if backend expects it.
            // Backend expects 'state' field.
            // We'll optimistically assume backend handles the transition logic or we send the target state.
            // Common mapping:
            // 'Mark as Shipped' -> 'OUT_FOR_DELIVERY'
            // 'Mark as Delivered' -> 'DELIVERED'
            // 'Cancel' -> 'CANCELLED'

            await adminAPI.updateOrder(orderId, { state: newStatus });
            await loadOrder(); // Reload to get updated data
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    const handleMarkAsPaid = async () => {
        if (!confirm('Mark this order as PAID? This will also set status to PROCESSING.')) return;
        setUpdating(true);
        try {
            // Update both payment status and order state
            await adminAPI.updateOrder(orderId, {
                payment_status: 'PAID',
                state: 'PROCESSING'
            });
            await loadOrder();
            alert('Order marked as PAID');
        } catch (error) {
            console.error('Failed to update payment status:', error);
            alert('Failed to mark as paid');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'DELIVERED':
                return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20';
            case 'pending':
            case 'PAID':
            case 'processing':
                return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
            case 'cancelled':
            case 'CANCELLED':
                return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
            case 'out_for_delivery':
            case 'OUT_FOR_DELIVERY':
                return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20';
            default:
                return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Order not found</h2>
                <Link href="/dashboard/admin/orders" className="text-pink-500 hover:underline mt-2 inline-block">
                    Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <Link
                        href="/dashboard/admin/orders"
                        className={`inline-flex items-center gap-1 text-sm font-medium mb-2 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Orders
                    </Link>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Order #{order.order_number}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status).replace('text-', 'border-').replace('bg-', 'border-opacity-20 ')} ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            {new Date(order.created_at).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                    {/* Mark as Paid Button */}
                    {order.payment_status !== 'PAID' && order.status !== 'CANCELLED' && (
                        <button
                            onClick={handleMarkAsPaid}
                            disabled={updating}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            <CreditCard className="w-4 h-4" />
                            Mark as Paid
                        </button>
                    )}

                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                        <>
                            {order.status !== 'OUT_FOR_DELIVERY' && (
                                <button
                                    onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
                                    disabled={updating}
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                >
                                    <Truck className="w-4 h-4" />
                                    Mark Shipped
                                </button>
                            )}
                            <button
                                onClick={() => handleUpdateStatus('DELIVERED')}
                                disabled={updating}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Mark Delivered
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('CANCELLED')}
                                disabled={updating}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                            >
                                <XCircle className="w-4 h-4" />
                                Cancel Order
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-50'}`}>
                            <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <Package className="w-5 h-5 text-pink-500" />
                                Order Items
                            </h3>
                        </div>
                        <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-50'}`}>
                            {order.items.map((item) => (
                                <div key={item.id} className="p-6 flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.product_name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Package className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {item.product_name}
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {item.size && (
                                                <span className={`text-xs px-2 py-0.5 rounded border ${isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                                                    Size: {item.size}
                                                </span>
                                            )}
                                            {item.color && (
                                                <span className={`text-xs px-2 py-0.5 rounded border ${isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                                                    Color: {item.color}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            x{item.quantity}
                                        </p>
                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            ₵{parseFloat(item.price).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={`p-6 bg-gray-50 dark:bg-slate-900/50 space-y-2`}>
                            <div className="flex justify-between text-sm">
                                <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>Subtotal</span>
                                <span className={isDark ? 'text-white' : 'text-gray-900'}>₵{parseFloat(order.subtotal || order.total).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>Delivery Fee</span>
                                <span className={isDark ? 'text-white' : 'text-gray-900'}>₵{parseFloat(order.delivery_fee || '0').toLocaleString()}</span>
                            </div>
                            <div className={`flex justify-between font-bold text-lg pt-2 border-t ${isDark ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
                                <span className={isDark ? 'text-white' : 'text-gray-900'}>Total</span>
                                <span className="text-pink-600">₵{parseFloat(order.total).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Customer & Delivery */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <User className="w-5 h-5 text-blue-500" />
                            Customer
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                                    {order.customer?.[0] || 'G'}
                                </div>
                                <div>
                                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.customer || 'Guest'}</p>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Customer ID: {order.customer}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-dashed border-gray-200 dark:border-slate-700 space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className={isDark ? 'text-slate-300' : 'text-gray-600'}>{order.phone || 'No phone'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className={isDark ? 'text-slate-300' : 'text-gray-600'}>{order.email || 'No email'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <MapPin className="w-5 h-5 text-emerald-500" />
                            Delivery Details
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className={isDark ? 'text-slate-300' : 'text-gray-600'}>
                                {order.delivery_address || 'No address provided'}
                            </div>
                            <div className={isDark ? 'text-slate-300' : 'text-gray-600'}>
                                {order.delivery_city}, {order.delivery_region}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
