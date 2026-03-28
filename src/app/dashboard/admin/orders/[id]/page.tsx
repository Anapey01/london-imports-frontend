'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import { useTheme } from '@/providers/ThemeProvider';
import Link from 'next/link';
import Image from 'next/image';
import {
    ChevronLeft,
    Package,
    CheckCircle,
    XCircle,
    MapPin,
    Phone,
    CreditCard,
    MessageCircle,
    Clock,
    Navigation
} from 'lucide-react';


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
    delivery_gps?: string;
    customer_notes?: string;
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
    const [isEditingDelivery, setIsEditingDelivery] = useState(false);
    const [editForm, setEditForm] = useState({
        delivery_address: '',
        delivery_city: '',
        delivery_region: '',
        delivery_gps: '',
        customer_notes: ''
    });

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
            await adminAPI.updateOrder(orderId, { status: newStatus });
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
            await adminAPI.updateOrder(orderId, { payment_status: 'PAID', status: 'PROCESSING' });
            await loadOrder();
        } catch {
            alert('Failed to update payment');
        } finally {
            setUpdating(false);
        }
    };

    const startEditing = () => {
        if (!order) return;
        setEditForm({
            delivery_address: order.delivery_address || '',
            delivery_city: order.delivery_city || '',
            delivery_region: order.delivery_region || '',
            delivery_gps: order.delivery_gps || '',
            customer_notes: order.customer_notes || ''
        });
        setIsEditingDelivery(true);
    };

    const handleSaveDelivery = async () => {
        setUpdating(true);
        try {
            await adminAPI.updateOrder(orderId, editForm);
            await loadOrder();
            setIsEditingDelivery(false);
        } catch {
            alert('Failed to update delivery details');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'DELIVERED': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
            'IN_TRANSIT': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
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

    const whatsappUrl = (() => {
        if (!order.phone) return null;
        let cleanPhone = order.phone.replace(/\D/g, '');
        // Handle Ghana numbers: 0xx... -> 233xx...
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '233' + cleanPhone.substring(1);
        } else if (cleanPhone.length === 9) {
            cleanPhone = '233' + cleanPhone;
        }
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${order.customer}, regarding order #${order.order_number} from London's Imports:`)}`;
    })();

    return (
        <div className={`min-h-screen pb-24 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className={`sticky top-0 z-10 px-4 py-3 border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center justify-between">
                    <button onClick={() => router.back()} className={`p-2 -ml-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} aria-label="Go back">
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
                        {whatsappUrl && (
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium"
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                            </a>
                        )}
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
                                    onClick={() => handleUpdateStatus('IN_TRANSIT')}
                                    disabled={updating || order.status === 'IN_TRANSIT'}
                                    className="flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                >
                                    <Package className="w-4 h-4" />
                                    In Transit
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('PROCESSING')}
                                    disabled={updating || order.status === 'PROCESSING'}
                                    className="flex items-center justify-center gap-2 py-2.5 bg-gray-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                    title="Move back to processing"
                                >
                                    <Clock className="w-4 h-4" />
                                    To Processing
                                </button>
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
                                            width={56}
                                            height={56}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                const fallback = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement;
                                                if (fallback) fallback.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`${item.image ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center`}>
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

                {/* Courier Dispatch Card */}
                <div className={`p-5 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-sm border border-gray-100 dark:border-slate-700 space-y-4`}>
                    <div className="flex items-center justify-between">
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Courier Dispatch
                        </p>
                        {!isEditingDelivery ? (
                            <button
                                onClick={startEditing}
                                className="text-[10px] font-bold text-pink-500 hover:text-pink-600 uppercase tracking-tight"
                            >
                                Edit Details
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsEditingDelivery(false)}
                                    className="text-[10px] font-bold text-gray-400 hover:text-gray-500 uppercase tracking-tight"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveDelivery}
                                    disabled={updating}
                                    className="text-[10px] font-bold text-pink-600 hover:text-pink-700 uppercase tracking-tight disabled:opacity-50"
                                >
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>

                    {!isEditingDelivery ? (
                        <>
                            <div className="flex items-start gap-4">
                                <div className={`p-2.5 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-gray-50'}`}>
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} leading-relaxed`}>
                                        {order.delivery_address || 'No street address provided'}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            {order.delivery_city}, {order.delivery_region}
                                        </p>
                                        {order.delivery_gps && (
                                            <>
                                                <span className="text-gray-300">•</span>
                                                <p className="text-[10px] font-mono font-bold text-pink-600 bg-pink-50 dark:bg-pink-900/20 px-1.5 py-0.5 rounded border border-pink-100 dark:border-pink-800 uppercase">
                                                    GPS: {order.delivery_gps}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {order.customer_notes && (
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-900/50' : 'bg-gray-50/50'} border border-dashed ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <MessageCircle className="w-3 h-3 text-gray-400" />
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Special Instructions</span>
                                    </div>
                                    <p className={`text-xs italic ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                        &quot;{order.customer_notes}&quot;
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-4 transition-all animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Street Address</label>
                                <textarea
                                    value={editForm.delivery_address}
                                    onChange={(e) => setEditForm({ ...editForm, delivery_address: e.target.value })}
                                    className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-pink-500 outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>City</label>
                                    <input
                                        type="text"
                                        value={editForm.delivery_city}
                                        onChange={(e) => setEditForm({ ...editForm, delivery_city: e.target.value })}
                                        className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-pink-500 outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Region</label>
                                    <input
                                        type="text"
                                        value={editForm.delivery_region}
                                        onChange={(e) => setEditForm({ ...editForm, delivery_region: e.target.value })}
                                        className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-pink-500 outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Ghana Post GPS</label>
                                <input
                                    type="text"
                                    placeholder="e.g. GA-123-4567"
                                    value={editForm.delivery_gps}
                                    onChange={(e) => setEditForm({ ...editForm, delivery_gps: e.target.value.toUpperCase() })}
                                    className={`w-full p-3 rounded-xl text-sm font-mono border focus:ring-2 focus:ring-pink-500 outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Instructions</label>
                                <textarea
                                    value={editForm.customer_notes}
                                    onChange={(e) => setEditForm({ ...editForm, customer_notes: e.target.value })}
                                    className={`w-full p-3 rounded-xl text-sm border focus:ring-2 focus:ring-pink-500 outline-none ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}
                                    rows={2}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className={isDark ? 'text-slate-400' : 'text-gray-500'}>Ordered on</span>
                        <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                            {new Date(order.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
