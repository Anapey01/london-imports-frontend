'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import { useTheme } from '@/providers/ThemeProvider';
import Link from 'next/link';
import Image from 'next/image';
import {
    CreditCard,
    Package,
    ChevronLeft,
    MapPin,
    MessageCircle,
    History as OrderHistoryIcon
} from 'lucide-react';
import LogisticsStepper from '@/components/admin/orders/LogisticsStepper';
import CustomerIntelligenceCard from '@/components/admin/orders/CustomerIntelligenceCard';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence } from 'framer-motion';


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
    payment_status: string;
    amount_paid: string;
    balance_due: string;
    is_installment: boolean;
    created_at: string;
    delivery_address: string;
    delivery_city: string;
    delivery_region: string;
    delivery_gps?: string;
    customer_notes?: string;
    items: OrderItem[];
    customer_stats: {
        ltv: number;
        order_count: number;
        join_date: string;
        is_vip: boolean;
    };
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

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: AlertType }>>([]);

    const addAlert = (message: string, type: AlertType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setAlerts(prev => [...prev, { id, message, type }]);
    };

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

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

    const handleUpdateStatus = (newStatus: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Update Order Status',
            message: `Transition order status to ${newStatus.replace(/_/g, ' ')}?`,
            variant: newStatus === 'CANCELLED' ? 'danger' : 'warning',
            onConfirm: async () => {
                setUpdating(true);
                try {
                    await adminAPI.updateOrder(orderId, { status: newStatus });
                    addAlert(`Status updated to ${newStatus.replace(/_/g, ' ')}`);
                    await loadOrder(); 
                } catch {
                    addAlert('Failed to update status', 'error');
                } finally {
                    setUpdating(false);
                }
            }
        });
    };

    const handleMarkAsPaid = () => {
        const isInstalment = order?.is_installment;
        const balance = parseFloat(order?.balance_due || '0');
        
        setConfirmModal({
            isOpen: true,
            title: isInstalment ? 'Authorize Instalment Payment' : 'Authorize Payment Override',
            message: isInstalment 
                ? `This is an INSTALMENT order with a balance of ₵${balance.toLocaleString()}. Mark the CURRENT instalment as paid, or force mark the ENTIRE order as PAID?`
                : 'Are you sure you want to manually mark this order as PAID? This bypasses automatic payment verification.',
            variant: 'warning',
            onConfirm: async () => {
                setUpdating(true);
                try {
                    // If it's instalment and has balance, maybe we should keep it as PARTIAL?
                    // For now, let's follow the user request to make it known.
                    await adminAPI.updateOrder(orderId, { payment_status: 'PAID', status: 'PROCESSING' });
                    addAlert('Order manually marked as PAID');
                    await loadOrder();
                } catch {
                    addAlert('Failed to update payment status', 'error');
                } finally {
                    setUpdating(false);
                }
            }
        });
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
            addAlert('Delivery protocols updated');
            await loadOrder();
            setIsEditingDelivery(false);
        } catch {
            addAlert('Failed to update delivery details', 'error');
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
            <div className={`sticky top-0 z-10 px-4 py-3 border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center justify-between">
                    <button onClick={() => router.back()} className={`p-2 -ml-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} aria-label="Go back">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h1 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ORDER #{order.order_number}
                    </h1>
                    <div className="w-10 h-10" /> {/* Spacer */}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Visual Progress Header */}
                <div className={`mb-8 p-6 rounded-[2.5rem] ${isDark ? 'bg-slate-800/50 border border-slate-800' : 'bg-white shadow-sm border border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            Logistics Lifecycle
                        </p>
                        <div className="flex items-center gap-2">
                            {order.is_installment && (
                                <span className="text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                                    Instalment Plan
                                </span>
                            )}
                            <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${getStatusBadge(order.status)}`}>
                                {order.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                    </div>
                    <LogisticsStepper status={order.status} isDark={isDark} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Main Logistics Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Items Section */}
                        <div className={`rounded-[2.5rem] overflow-hidden ${isDark ? 'bg-slate-800/30 border border-slate-800' : 'bg-white border border-gray-100 shadow-sm'}`}>
                            <div className={`px-8 py-6 border-b ${isDark ? 'border-slate-800' : 'border-gray-50'}`}>
                                <h3 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    Shipment Contents
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-slate-800">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-6 p-8 group transition-colors hover:bg-slate-500/5">
                                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0 border border-transparent group-hover:border-pink-500/30 transition-all">
                                            {item.image ? (
                                                <Image
                                                    src={getImageUrl(item.image)}
                                                    alt={item.product_name}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-gray-200'}`} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                                                {item.product_name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                {item.color && (
                                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                                        {item.color}
                                                    </span>
                                                )}
                                                {item.size && (
                                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                                        {item.size}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className={`text-lg font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                ₵{parseFloat(item.price).toLocaleString()}
                                            </p>
                                            <p className={`text-xs font-black opacity-30 mt-1 uppercase tracking-widest`}>
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Financial Summary */}
                            <div className={`p-8 ${isDark ? 'bg-slate-900/40' : 'bg-gray-50/50'}`}>
                                <div className="space-y-3 max-w-sm ml-auto">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest opacity-40">
                                        <span>Subtotal</span>
                                        <span>₵{parseFloat(order.subtotal).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest opacity-40">
                                        <span>Logistics Fee</span>
                                        <span>₵{parseFloat(order.delivery_fee).toLocaleString()}</span>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-primary-surface/10">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <span className={`text-sm font-black uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-gray-900'}`}>Grand Total</span>
                                            <span className="text-2xl font-black tracking-tighter text-pink-500">
                                                ₵{parseFloat(order.total).toLocaleString()}
                                            </span>
                                        </div>
                                        
                                        {/* Instalment Breakdown */}
                                        <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-900/60' : 'bg-gray-100/50'} space-y-2`}>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span className="opacity-40">Amount Paid</span>
                                                <span className="text-emerald-500">₵{parseFloat(order.amount_paid || '0').toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span className="opacity-40">Balance Due</span>
                                                <span className={parseFloat(order.balance_due || '0') > 0 ? 'text-rose-500' : 'opacity-40'}>
                                                    ₵{parseFloat(order.balance_due || '0').toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dispatch Intelligence Card */}
                        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-slate-800/30 border-slate-800' : 'bg-white border-gray-100 shadow-sm'} space-y-6 relative overflow-hidden`}>
                            <div className="flex items-center justify-between">
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    Courier Protocol
                                </h3>
                                <button
                                    onClick={isEditingDelivery ? handleSaveDelivery : startEditing}
                                    disabled={updating}
                                    className={`text-[10px] font-black uppercase underline decoration-2 decoration-pink-500/30 underline-offset-4 hover:decoration-pink-500 transition-all ${isDark ? 'text-slate-300' : 'text-gray-600'}`}
                                >
                                    {isEditingDelivery ? (updating ? 'Syncing...' : 'Save Protocol') : 'Update Location'}
                                </button>
                            </div>

                            {!isEditingDelivery ? (
                                <div className="space-y-6">
                                    <div className="flex items-start gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-slate-800 text-pink-500' : 'bg-pink-50 text-pink-600'}`}>
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-lg font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {order.delivery_address || 'No location defined'}
                                            </p>
                                            <p className={`text-xs font-bold mt-1 opacity-40 uppercase tracking-widest`}>
                                                {order.delivery_city} • {order.delivery_region}
                                            </p>
                                            {order.delivery_gps && (
                                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[10px] font-black font-mono text-emerald-500 uppercase">GPS: {order.delivery_gps}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {order.customer_notes && (
                                        <div className={`p-6 rounded-3xl ${isDark ? 'bg-slate-900/50' : 'bg-gray-50/50'} border-l-4 border-pink-500`}>
                                            <p className={`text-xs font-black uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Client Directives</p>
                                            <p className={`text-sm italic font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                                &quot;{order.customer_notes}&quot;
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Arrival Coordinates</label>
                                        <input
                                            value={editForm.delivery_address}
                                            onChange={(e) => setEditForm({ ...editForm, delivery_address: e.target.value })}
                                            className={`w-full p-4 rounded-2xl text-sm font-bold border-2 focus:border-pink-500 outline-none transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100'}`}
                                            placeholder="Street & Landmarks"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">City Hub</label>
                                        <input
                                            value={editForm.delivery_city}
                                            onChange={(e) => setEditForm({ ...editForm, delivery_city: e.target.value })}
                                            className={`w-full p-4 rounded-2xl text-sm font-bold border-2 focus:border-pink-500 outline-none transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100'}`}
                                            placeholder="City Hub"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Region</label>
                                        <input
                                            value={editForm.delivery_region}
                                            onChange={(e) => setEditForm({ ...editForm, delivery_region: e.target.value })}
                                            className={`w-full p-4 rounded-2xl text-sm font-bold border-2 focus:border-pink-500 outline-none transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100'}`}
                                            placeholder="Region"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Intelligence */}
                    <div className="space-y-8 h-full">
                        <CustomerIntelligenceCard 
                            customer={{
                                name: order.customer,
                                email: order.email,
                                phone: order.phone,
                                stats: order.customer_stats
                            }} 
                            isDark={isDark} 
                        />

                        {/* Operational Control Panel */}
                        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                Command Override
                            </h3>
                            <div className="flex flex-col gap-3">
                                {whatsappUrl && (
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        WhatsApp Bridge
                                        <MessageCircle className="w-5 h-5" />
                                    </a>
                                )}
                                {order.payment_status !== 'PAID' && order.status !== 'CANCELLED' && (
                                    <button
                                        onClick={handleMarkAsPaid}
                                        disabled={updating}
                                        className="flex items-center justify-between p-4 bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                    >
                                        Force Mark Paid
                                        <CreditCard className="w-5 h-5" />
                                    </button>
                                )}
                                
                                <div className="pt-4 mt-4 border-t border-primary-surface/10 grid grid-cols-1 gap-2">
                                    <button
                                        onClick={() => handleUpdateStatus('IN_TRANSIT')}
                                        disabled={updating || order.status === 'IN_TRANSIT'}
                                        className={`w-full p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${isDark ? 'border-primary-surface/10 text-white hover:border-pink-500' : 'border-gray-50 text-gray-700 hover:border-pink-500'} disabled:opacity-30`}
                                    >
                                        Mark Shipped
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus('ARRIVED')}
                                        disabled={updating || order.status === 'ARRIVED'}
                                        className={`w-full p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${isDark ? 'border-primary-surface/10 text-white hover:border-blue-500' : 'border-gray-50 text-gray-700 hover:border-blue-500'} disabled:opacity-30`}
                                    >
                                        Mark Arrived
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus('DELIVERED')}
                                        disabled={updating || order.status === 'DELIVERED'}
                                        className={`w-full p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${isDark ? 'border-primary-surface/10 text-white hover:border-emerald-500' : 'border-gray-50 text-gray-700 hover:border-emerald-500'} disabled:opacity-30`}
                                    >
                                        Mark Delivered
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus('CANCELLED')}
                                        disabled={updating || order.status === 'CANCELLED'}
                                        className="w-full p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
                                    >
                                        Void Order
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Audit Trail Placeholder */}
                        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <OrderHistoryIcon className="w-4 h-4 opacity-40" />
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    Audit History
                                </h3>
                            </div>
                            <div className="space-y-6">
                                <div className="border-l-2 border-emerald-500 pl-6 relative">
                                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500" />
                                    <p className={`text-[10px] font-black uppercase tracking-tighter text-emerald-500`}>Current State</p>
                                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.status.replace(/_/g, ' ')}</p>
                                    <p className="text-[10px] opacity-40 font-medium mt-1">Updated automated via Admin Node</p>
                                </div>
                                <div className="border-l-2 border-slate-700 pl-6 relative opacity-50">
                                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-700" />
                                    <p className={`text-[10px] font-black uppercase tracking-tighter`}>Initialization</p>
                                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Registered</p>
                                    <p className="text-[10px] opacity-40 font-medium mt-1">
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            {/* Notification Toasts */}
            <div className="fixed bottom-8 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center">
                <AnimatePresence mode="popLayout">
                    {alerts.map(alert => (
                        <AuraAlert
                            key={alert.id}
                            id={alert.id}
                            message={alert.message}
                            type={alert.type}
                            onClose={removeAlert}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
