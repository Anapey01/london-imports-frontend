/**
 * London's Imports - Admin Logistics Dashboard
 * High-level view of delivery information for couriers and dispatchers
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { adminAPI } from '@/lib/api';
import {
    ChevronRight, 
    ChevronLeft, 
    Truck, 
    Copy, 
    MapPin, 
    Phone, 
    Search,
    Clock,
    CheckCircle2
} from 'lucide-react';

interface Order {
    id: string;
    order_number?: string;
    customer: {
        name: string;
        email: string;
    };
    phone: string;
    delivery_address: string;
    delivery_city: string;
    delivery_region: string;
    delivery_gps: string;
    customer_notes: string;
    status: string;
    created_at: string;
}

interface APIOrder {
    id: string;
    order_number?: string;
    customer: {
        name: string;
        email: string;
    };
    phone: string;
    delivery_address: string;
    delivery_city: string;
    delivery_region: string;
    delivery_gps: string;
    customer_notes: string;
    status: string;
    created_at: string;
}

function mapAPIOrder(order: APIOrder): Order {
    return {
        id: order.id,
        order_number: order.order_number,
        customer: order.customer,
        phone: order.phone || '',
        delivery_address: order.delivery_address || '',
        delivery_city: order.delivery_city || '',
        delivery_region: order.delivery_region || '',
        delivery_gps: order.delivery_gps || '',
        customer_notes: order.customer_notes || '',
        status: order.status || 'PENDING',
        created_at: order.created_at,
    };
}

export default function AdminLogisticsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('PROCESSING'); // Default to processing for logistics
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params: { page: number; search?: string; status?: string } = { 
                page: currentPage,
                search: searchQuery || undefined
            };
            
            if (statusFilter !== 'All') {
                params.status = statusFilter;
            }
            
            const response = await adminAPI.orders(params);
            const data = response.data;
            
            const ordersData = data.results || data || [];
            setOrders(ordersData.map(mapAPIOrder));
            
            if (data.count !== undefined) {
                setTotalCount(data.count);
                setTotalPages(Math.ceil(data.count / 20));
            }
        } catch (err) {
            console.error('Failed to load logistics data:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter, searchQuery]);

    useEffect(() => { loadOrders(); }, [loadOrders]);

    const copyToClipboard = (text: string, id: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600',
            PROCESSING: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600',
            IN_TRANSIT: isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600',
            OUT_FOR_DELIVERY: isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600',
            DELIVERED: isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600',
            CANCELLED: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600',
        };
        return colors[status] || colors.PENDING;
    };

    const STATUS_TABS = ['All', 'PROCESSING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Truck className="w-6 h-6 text-pink-500" />
                        Logistics Dashboard
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Quick view of delivery details for active orders
                    </p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                    <input
                        type="text"
                        placeholder="Search order or customer..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-pink-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}
                    />
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {STATUS_TABS.map(s => (
                    <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === s
                            ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20'
                            : isDark
                                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {s === 'All' ? 'All Orders' : s.replace(/_/g, ' ')}
                        {statusFilter === s && <span className="ml-2 opacity-70">({totalCount})</span>}
                    </button>
                ))}
            </div>

            {/* Table Container */}
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${isDark ? 'bg-slate-800/50' : 'bg-gray-50/50'} border-b ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Dispatch Info</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Customer Contact</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Delivery Location</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">GPS / Notes</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8">
                                            <div className={`h-4 rounded w-full ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}></div>
                                        </td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <Truck className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p className="text-slate-400 font-medium">No orders found for this stage</p>
                                    </td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors`}>
                                    {/* Order ID & Status */}
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                #{order.order_number || order.id.slice(0, 8)}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(order.status)}`}>
                                                    {order.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Customer & Phone */}
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-sm font-semibold truncate max-w-[150px] ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                                                {order.customer.name}
                                            </span>
                                            <a 
                                                href={`tel:${order.phone}`}
                                                className="flex items-center gap-1.5 text-xs text-pink-500 hover:text-pink-600 font-medium transition-colors"
                                            >
                                                <Phone className="w-3 h-3" />
                                                {order.phone || 'No phone'}
                                            </a>
                                        </div>
                                    </td>

                                    {/* Location Info */}
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col max-w-[200px]">
                                            <div className="flex items-start gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                                <span className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                                    {order.delivery_address || 'No address provided'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 mt-1 ml-5 uppercase">
                                                {order.delivery_city}, {order.delivery_region}
                                            </span>
                                        </div>
                                    </td>

                                    {/* GPS & Notes */}
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-2">
                                            {order.delivery_gps ? (
                                                <button 
                                                    onClick={() => copyToClipboard(order.delivery_gps, order.id + '-gps')}
                                                    className={`group/copy flex items-center gap-2 px-2 py-1.5 rounded-lg border text-xs font-mono transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-pink-400 hover:border-pink-500' : 'bg-gray-50 border-gray-100 text-pink-600 hover:border-pink-300'}`}
                                                >
                                                    {order.delivery_gps}
                                                    {copiedId === order.id + '-gps' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 opacity-0 group-hover/copy:opacity-100 transition-opacity" />}
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 italic">No GPS provided</span>
                                            )}
                                            
                                            {order.customer_notes && (
                                                <div className={`p-2 rounded-lg text-[10px] leading-relaxed italic ${isDark ? 'bg-slate-800/50 text-slate-400 border border-slate-800' : 'bg-amber-50 text-amber-800 border border-amber-100'}`}>
                                                    &quot;{order.customer_notes}&quot;
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-5 text-right">
                                        <a 
                                            href={`/dashboard/admin/orders/${order.id}`}
                                            className={`inline-flex items-center gap-2 p-2 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-pink-500/20' : 'bg-gray-100 text-gray-500 hover:text-pink-600 hover:bg-pink-50'}`}
                                            title="View Full Order"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                    <span className="text-xs text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || loading}
                            className={`p-2 rounded-xl border transition-all disabled:opacity-30 ${isDark ? 'border-slate-800 hover:bg-slate-800 text-white' : 'border-gray-100 hover:bg-gray-50'}`}
                            title="Previous Page"
                            aria-label="Previous Page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || loading}
                            className={`p-2 rounded-xl border transition-all disabled:opacity-30 ${isDark ? 'border-slate-800 hover:bg-slate-800 text-white' : 'border-gray-100 hover:bg-gray-50'}`}
                            title="Next Page"
                            aria-label="Next Page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
