'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import { vendorsAPI } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Package, FileText, Calendar, Clock, Phone, MessageCircle, User } from 'lucide-react';

interface OrderDetail {
    id: string;
    order_number: string;
    created_at: string;
    state: string;
    total: string;
    customer_name?: string;
    customer_phone?: string;
    customer_whatsapp?: string;
    items: Array<{
        id: string;
        product_name: string;
        quantity: number;
        unit_price: string;
        items_total: string;
        image?: string;
        selected_size?: string;
        selected_color?: string;
    }>;
    delivery_address: string;
    delivery_city: string;
    delivery_region: string;
    customer_notes?: string;
}

export default function VendorOrderDetailPage() {
    const { theme } = useTheme();
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderId = Array.isArray(params.id) ? params.id[0] : params.id;
                if (!orderId) {
                    throw new Error('Invalid order ID');
                }

                const response = await vendorsAPI.orderDetail(orderId);
                setOrder(response.data);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchOrder();
        }
    }, [params.id, router]);

    const isDark = theme === 'dark';

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Order Not Found</h2>
                <p className="text-sm text-slate-500 mb-6">The requested order could not be found or you do not have permission to inspect it.</p>
                <Link
                    href="/dashboard/vendor/orders"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                        isDark ? 'bg-white text-slate-950 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Return to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/vendor/orders"
                        className={`p-2 rounded-xl border transition-colors ${
                            isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                        }`}
                        aria-label="Back to Orders"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Order #{order.order_number}
                            </h1>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                                order.state === 'DELIVERED'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                    : order.state === 'CANCELLED'
                                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                            }`}>
                                {order.state.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <p className={`text-xs flex items-center gap-1.5 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <Calendar className="w-3.5 h-3.5" />
                            Placed on {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className={`rounded-2xl border shadow-sm overflow-hidden ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
                    }`}>
                        <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Purchased Items</h2>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                            }`}>
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>
                        <div className={`divide-y ${isDark ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
                            {order.items.map((item) => (
                                <div key={item.id} className="p-5 flex gap-4 sm:gap-5 items-center">
                                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex-shrink-0 relative overflow-hidden border ${
                                        isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                                    }`}>
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.product_name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <Package className="w-6 h-6 opacity-40" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold text-sm mb-1 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {item.product_name}
                                        </h3>
                                        <div className={`text-xs space-y-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {item.selected_size && <div>Size: <span className="font-medium">{item.selected_size}</span></div>}
                                            {item.selected_color && <div>Color: <span className="font-medium">{item.selected_color}</span></div>}
                                            <div>Quantity: <span className="font-medium">{item.quantity}</span></div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            GH₵ {parseFloat(item.items_total).toFixed(2)}
                                        </div>
                                        <div className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            GH₵ {parseFloat(item.unit_price).toFixed(2)} each
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side Panel: Delivery & Notes */}
                <div className="space-y-6">
                    <div className={`rounded-2xl border shadow-sm p-6 space-y-6 ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
                    }`}>
                        {/* Customer Contact */}
                        <div>
                            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                                <User className="w-4 h-4 text-slate-400" />
                                Customer Contact
                            </h3>
                            <div className={`p-4 rounded-xl border text-sm space-y-2.5 ${
                                isDark ? 'bg-slate-800/60 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}>
                                <p className="font-semibold">{order.customer_name || 'Customer'}</p>
                                {(order.customer_phone || order.customer_whatsapp) ? (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {order.customer_phone && (
                                            <a
                                                href={`tel:${order.customer_phone}`}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                                    isDark
                                                        ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white'
                                                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-900 shadow-xs'
                                                }`}
                                            >
                                                <Phone className="w-3.5 h-3.5 text-slate-500" />
                                                Call {order.customer_phone}
                                            </a>
                                        )}
                                        {(order.customer_whatsapp || order.customer_phone) && (
                                            <a
                                                href={`https://wa.me/${(order.customer_whatsapp || order.customer_phone || '').replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                                            >
                                                <MessageCircle className="w-3.5 h-3.5" />
                                                WhatsApp
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400">Phone not provided</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                Delivery Destination
                            </h3>
                            <div className={`p-4 rounded-xl border text-sm space-y-1.5 ${
                                isDark ? 'bg-slate-800/60 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}>
                                <p className="font-medium">{order.delivery_address || 'Standard Delivery'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {order.delivery_city}{order.delivery_city && order.delivery_region ? ', ' : ''}{order.delivery_region}
                                </p>
                            </div>
                        </div>

                        {order.customer_notes && (
                            <div className={`pt-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    Customer Instructions
                                </h3>
                                <p className={`text-xs italic p-3.5 rounded-xl border ${
                                    isDark ? 'bg-slate-800/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200/80 text-slate-600'
                                }`}>
                                    &ldquo;{order.customer_notes}&rdquo;
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
