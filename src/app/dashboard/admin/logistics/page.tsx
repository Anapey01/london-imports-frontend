/**
 * London's Imports - Admin Logistics Dashboard
 * High-level 'Atelier' manifest view for delivery and dispatch management
 */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
    CheckCircle2,
    MessageSquare,
    Package,
    Navigation,
    X,
    ExternalLink
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
    batch_name: string;
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
        batch_name: (order as any).batch_name || 'NO_BATCH_ASSIGNED'
    };
}

export default function AdminLogisticsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('PROCESSING');
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

    const STATUS_TABS = ['All', 'PROCESSING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const;

    if (loading && currentPage === 1) {
        return (
            <div className="space-y-4 p-8">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 bg-slate-50 animate-pulse border border-slate-100"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-32">
            {/* 1. COMMAND HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-50 pb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-slate-950 tracking-tighter">Logistics Manifest</h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">{totalCount} SHIPMENTS_TRACKED</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH SHIPMENTS..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-50 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-slate-900 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* 2. PROTOCOL FILTERS */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {STATUS_TABS.map(s => (
                    <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                        className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${statusFilter === s
                            ? 'bg-slate-950 text-white border-slate-950 shadow-lg'
                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                            }`}
                    >
                        {s === 'All' ? 'Full Manifest' : s.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>

            {/* 3. LOGISTICS REGISTRY TABLE */}
            <div className="bg-white border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Shipment_Ref</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Recipient_Identity</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Geographic_Node</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Navigation_Data</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.map((order) => (
                                <LogisticsRow
                                    key={order.id}
                                    order={order}
                                    copyToClipboard={copyToClipboard}
                                    copiedId={copiedId}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && !loading && (
                    <div className="py-32 text-center">
                        <Truck className="w-12 h-12 mx-auto mb-6 text-slate-100" strokeWidth={1} />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300">Logistics Database Null</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-50 pt-12">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || loading}
                            className="p-4 border border-slate-100 text-slate-400 hover:text-slate-950 hover:border-slate-950 transition-all disabled:opacity-30"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || loading}
                            className="p-4 border border-slate-100 text-slate-400 hover:text-slate-950 hover:border-slate-950 transition-all disabled:opacity-30"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const LogisticsRow = React.memo(({ 
    order, 
    copyToClipboard, 
    copiedId 
}: any) => {
    return (
        <tr className="group hover:bg-slate-50/50 transition-all duration-500">
            <td className="px-8 py-8">
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-950">
                        #{order.order_number || order.id.slice(0, 8)}
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-900 text-white italic">
                            {order.status.replace(/_/g, ' ')}
                        </span>
                    </div>
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <Package className="w-3 h-3" />
                        {order.batch_name}
                    </div>
                </div>
            </td>

            <td className="px-8 py-8">
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-950">
                        {order.customer.name}
                    </span>
                    <div className="flex items-center gap-4">
                        <a 
                            href={`tel:${order.phone}`}
                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-950 transition-colors flex items-center gap-2"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            {order.phone || 'NO_CONTACT'}
                        </a>
                        {order.phone && (
                            <a
                                href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.customer.name}, this is London's Imports. I'm reaching out regarding your order #${order.order_number || order.id.slice(0, 8)} which is currently ${order.status.replace(/_/g, ' ')}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-950 hover:text-white transition-all rounded-sm"
                                title="WhatsApp Direct"
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                </div>
            </td>

            <td className="px-8 py-8">
                <div className="flex flex-col gap-2 max-w-[250px]">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-tight">
                            {order.delivery_address || 'ADDRESS_NOT_RECORDED'}
                        </span>
                    </div>
                    <span className="text-[9px] font-black text-slate-300 ml-7 uppercase tracking-widest">
                        {order.delivery_city}, {order.delivery_region}
                    </span>
                </div>
            </td>

            <td className="px-8 py-8">
                <div className="flex flex-col gap-3">
                    {order.delivery_gps ? (
                        <button 
                            onClick={() => copyToClipboard(order.delivery_gps, order.id + '-gps')}
                            className={`flex items-center justify-between gap-4 px-4 py-2 border text-[10px] font-black uppercase tracking-widest transition-all ${
                                copiedId === order.id + '-gps' 
                                ? 'bg-emerald-600 border-emerald-600 text-white' 
                                : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-900 hover:text-slate-900'
                            }`}
                        >
                            <span className="truncate">{order.delivery_gps}</span>
                            {copiedId === order.id + '-gps' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Navigation className="w-3.5 h-3.5" />}
                        </button>
                    ) : (
                        <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest italic">GPS_NULL</span>
                    )}
                    
                    {order.customer_notes && (
                        <div className="p-3 bg-slate-50/50 border-l border-slate-200 text-[9px] font-bold text-slate-400 italic leading-relaxed uppercase">
                            &quot;{order.customer_notes}&quot;
                        </div>
                    )}
                </div>
            </td>

            <td className="px-8 py-8 text-right">
                <a 
                    href={`/dashboard/admin/orders/${order.id}`}
                    className="inline-flex items-center justify-center p-4 border border-slate-100 text-slate-300 hover:text-slate-950 hover:border-slate-950 transition-all"
                    title="Inspect Entry"
                >
                    <ExternalLink className="w-5 h-5" />
                </a>
            </td>
        </tr>
    );
});
