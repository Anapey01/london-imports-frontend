'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import { useTheme } from '@/providers/ThemeProvider';
import Link from 'next/link';
import {
    ChevronLeft,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    MapPin,
    Phone,
    Mail,
    User,
    CreditCard,
    MessageCircle,
    Clock
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
    customer: string;
    email: string;
    phone: string;
    total: string;
    subtotal: string;
    delivery_fee: string;
    status: string;
    payment_status?: string;
    created_at: string;
    delivery_address: string;
    delivery_city: string;
    delivery_region: string;
    items: OrderItem[];
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

    const loadOrder = useCallback(async () => {
        try {
            const response = await adminAPI.getOrder(orderId);
            setOrder(response.data);
        } catch (error) {
            console.error('Failed to load order:', error);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        if (orderId) {
            loadOrder();
        }
    }, [orderId, loadOrder]);

    const handleUpdateStatus = async (newStatus: string) => {
        if (!confirm(`Change status to ${newStatus}?`)) return;
        setUpdating(true);
        try {
            await adminAPI.updateOrder(orderId, { state: newStatus });
            await loadOrder();
        } catch {
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const handleMarkAsPaid = async () => {
        if (!confirm('Mark this order as PAID?')) return;
        setUpdating(true);
        try {
            await adminAPI.updateOrder(orderId, { payment_status: 'PAID', state: 'PAID' });
            await loadOrder();
        } catch {
            alert('Failed to update payment');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'DELIVERED': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
            'OUT_FOR_DELIVERY': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            'PROCESSING': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'PENDING': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
            'CANCELLED': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        };
        return styles[status] || styles['PENDING'];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-pink-500 border-t-transparent" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-16 px-4">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Order not found</h2>
                <Link href="/dashboard/admin/orders" className="text-pink-500 text-sm mt-2 inline-block">
                    ← Back to Orders
                </Link>
            </div>
        );
    }

    const whatsappUrl = `https://wa.me/${order.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${order.customer}, regarding order #${order.order_number} from London's Imports:`)}`;

    return (
        <div className={`min-h-screen pb-24 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className={`sticky top-0 z-10 px-4 py-3 border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center justify-between">
                    <button onClick={() => router.back()} className={`p-2 -ml-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h1 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        #{order.order_number}
                    </h1>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(order.status)}`}>
                        {order.status}
                    </span>
                </div>
            </div>

            <div className="px-4 py-4 space-y-4">
                {/* Quick Actions */}
                <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
                    <p className={`text-xs font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>QUICK ACTIONS</p>
                    <div className="grid grid-cols-2 gap-2">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium"
                        >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                        </a>
                        {order.payment_status !== 'PAID' && order.status !== 'CANCELLED' && (
                            <button
                                onClick={handleMarkAsPaid}
                                disabled={updating}
                                className="flex items-center justify-center gap-2 py-2.5 bg-purple-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                <CreditCard className="w-4 h-4" />
                                Mark Paid
                            </button>
                        )}
                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                            <>
                                <button
                                    onClick={() => handleUpdateStatus('DELIVERED')}
                                    disabled={updating}
                                    className="flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Delivered
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('CANCELLED')}
                                    disabled={updating}
                                    className="flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Order Items */}
                <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
                    <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                        <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            ORDER ITEMS ({order.items.length})
                        </p>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-slate-700">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-4">
                                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700 shrink-0">
                                    {item.image ? (
                                        <Image
                                            src={getImageUrl(item.image)}
                                            alt={item.product_name}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : null}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Package className={`w-6 h-6 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {item.product_name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {item.color && (
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                                                {item.color}
                                            </span>
                                        )}
                                        {item.size && (
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                                                {item.size}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        ₵{parseFloat(item.price).toLocaleString()}
                                    </p>
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        x{item.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Totals */}
                    <div className={`px-4 py-3 ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>Subtotal</span>
                            <span className={isDark ? 'text-white' : 'text-gray-900'}>₵{parseFloat(order.subtotal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>Delivery</span>
                            <span className={isDark ? 'text-white' : 'text-gray-900'}>₵{parseFloat(order.delivery_fee).toLocaleString()}</span>
                        </div>
                        <div className={`flex justify-between text-base font-semibold pt-2 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                            <span className={isDark ? 'text-white' : 'text-gray-900'}>Total</span>
                            <span className="text-pink-500">₵{parseFloat(order.total).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-sm space-y-3`}>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>CUSTOMER</p>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                            {order.customer?.[0]?.toUpperCase() || 'G'}
                        </div>
                        <div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.customer}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{order.email}</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                        <Phone className="w-4 h-4 text-gray-400" />
                        {order.phone || 'No phone'}
                    </div>
                </div>

                {/* Delivery */}
                <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-sm space-y-3`}>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>DELIVERY</p>
                    <div className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p>{order.delivery_address || 'No address'}</p>
                            <p>{order.delivery_city}, {order.delivery_region}</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                        <Clock className="w-4 h-4 text-gray-400" />
                        {new Date(order.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
