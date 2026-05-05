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
    ArrowRightLeft,
    History as OrderHistoryIcon,
    ArrowRight,
    Terminal,
    FileText,
    ShieldCheck,
    Truck,
    CheckCircle2,
    Loader2,
    User,
    Crown,
    Calendar,
    ShoppingBag,
    TrendingUp
} from 'lucide-react';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence, motion } from 'framer-motion';

// --- Integrated Components ---

const STEPS = [
    { id: 'PENDING', label: 'Registered', icon: Package },
    { id: 'PROCESSING', label: 'Hub Consolidation', icon: Package },
    { id: 'IN_TRANSIT', label: 'Global Corridor', icon: Truck },
    { id: 'ARRIVED', label: 'GH Hub Arrival', icon: MapPin },
    { id: 'OUT_FOR_DELIVERY', label: 'Dispatch', icon: Truck },
    { id: 'DELIVERED', label: 'Finality', icon: CheckCircle2 },
];

function LogisticsStepper({ status, isDark }: { status: string; isDark: boolean }) {
    const currentStepIndex = STEPS.findIndex(s => s.id === status);
    
    return (
        <div className="w-full">
            <div className="relative flex justify-between">
                <div className={`absolute top-4 left-0 right-0 h-px ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                    className="absolute top-4 left-0 h-px bg-pink-500"
                />

                {STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    
                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group flex-1">
                            <motion.div 
                                initial={false}
                                animate={{ 
                                    scale: isCurrent ? 1.1 : 1,
                                    borderColor: isCompleted ? '#ec4899' : isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
                                    backgroundColor: isCurrent ? (isDark ? '#000' : '#fff') : 'transparent'
                                }}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500`}
                            >
                                <div className={`w-1 h-1 rounded-full ${isCompleted ? 'bg-pink-500' : isDark ? 'bg-white/10' : 'bg-slate-300'}`} />
                            </motion.div>
                            
                            <div className="mt-4 flex flex-col items-center text-center">
                                <span className={`text-[8px] font-mono tracking-[0.2em] uppercase mb-1 transition-all duration-500 ${isCurrent ? 'opacity-100 text-pink-500 font-black' : 'opacity-20'}`}>
                                    {isCurrent ? 'Current' : `Node 0${idx + 1}`}
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${isCurrent ? 'opacity-100' : 'opacity-30'}`}>
                                    {step.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function CustomerIntelligenceCard({ customer, isDark }: any) {
    const joinDate = new Date(customer.stats.join_date).toLocaleDateString('en-GB', { 
        month: 'long', 
        year: 'numeric' 
    });

    return (
        <div className={`border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'} relative group`}>
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-900 dark:bg-white/10" />
            
            <div className="p-10">
                <div className="flex items-center gap-3 mb-10 opacity-40">
                    <User className="w-4 h-4" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Client Identity Profile</h3>
                </div>

                <div className="flex items-start justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-full border flex items-center justify-center text-xl font-serif font-bold ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                            {customer.name[0].toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className={`text-2xl font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {customer.name}
                                </h3>
                                {customer.stats.is_vip && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-[8px] font-black text-white rounded-full uppercase tracking-widest">
                                        <Crown className="w-3 h-3" />
                                        VIP
                                    </div>
                                )}
                            </div>
                            <p className="text-xs font-mono opacity-40 lowercase tracking-tight">{customer.email}</p>
                            <p className="text-xs font-mono opacity-40 mt-1 uppercase tracking-widest">{customer.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-slate-800/10 dark:bg-white/10 border border-inherit">
                    <div className="p-6 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-2 mb-3 opacity-30">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Lifetime Value</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs font-serif italic opacity-40">₵</span>
                            <span className={`text-2xl font-serif font-bold tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {customer.stats.ltv.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 border-l border-inherit">
                        <div className="flex items-center gap-2 mb-3 opacity-30">
                            <ShoppingBag className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Order Count</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-serif font-bold tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {customer.stats.order_count}
                            </span>
                            <span className="text-[9px] font-black opacity-20 uppercase tracking-widest">TXNS</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-inherit flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Calendar className="w-4 h-4 opacity-20" />
                        <div className="space-y-0.5">
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-20 block">Established Member</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest">{joinDate}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-20 block">Account Status</span>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Verified Hub Access</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- End Integrated Components ---

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

    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [customerOrders, setCustomerOrders] = useState<any[]>([]);
    const [transferData, setTransferData] = useState({
        target_order_id: '',
        amount: 0,
        reason: ''
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
            title: 'Protocol Authorization',
            message: `Authorize transition of order status to ${newStatus.replace(/_/g, ' ')}?`,
            variant: newStatus === 'CANCELLED' ? 'danger' : 'warning',
            onConfirm: async () => {
                setUpdating(true);
                try {
                    await adminAPI.updateOrder(orderId, { status: newStatus });
                    addAlert(`Protocol updated: ${newStatus.replace(/_/g, ' ')}`);
                    await loadOrder(); 
                } catch {
                    addAlert('Authorization failed', 'error');
                } finally {
                    setUpdating(false);
                }
            }
        });
    };

    const handleMarkAsPaid = () => {
        const balance = parseFloat(order?.balance_due || '0');
        
        setConfirmModal({
            isOpen: true,
            title: 'Credit Override Authorization',
            message: `Manual credit entry for balance: ₵${balance.toLocaleString()}. This will bypass automated banking synchronization. Proceed?`,
            variant: 'warning',
            onConfirm: async () => {
                setUpdating(true);
                try {
                    await adminAPI.updateOrder(orderId, { 
                        payment_status: 'PAID', 
                        status: 'PAID',
                        amount_paid: order.total 
                    });
                    addAlert('Manual credit override successful');
                    await loadOrder();
                } catch {
                    addAlert('Credit override rejected', 'error');
                } finally {
                    setUpdating(false);
                }
            }
        });
    };

    const handleTransferPayment = async () => {
        if (!transferData.target_order_id || transferData.amount <= 0) {
            addAlert('Selection invalid', 'error');
            return;
        }
        
        setUpdating(true);
        try {
            await adminAPI.transferPayment(orderId, transferData);
            addAlert('Ledger adjustment complete');
            setIsTransferModalOpen(false);
            await loadOrder();
        } catch (error: any) {
            addAlert(error.response?.data?.error || 'Adjustment failed', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const openTransferModal = async () => {
        setIsTransferModalOpen(true);
        setTransferData({
            target_order_id: '',
            amount: parseFloat(order?.amount_paid || '0'),
            reason: ''
        });
        try {
            const response = await adminAPI.orders({ search: order?.email });
            setCustomerOrders(response.data.filter((o: any) => o.id !== orderId && o.status !== 'CANCELLED'));
        } catch (error) {
            console.error('Failed to load records:', error);
        }
    };

    const handleSaveDelivery = async () => {
        setUpdating(true);
        try {
            await adminAPI.updateOrder(orderId, editForm);
            addAlert('Dispatch protocols updated');
            await loadOrder();
            setIsEditingDelivery(false);
        } catch {
            addAlert('Update failed', 'error');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            </div>
        );
    }

    if (!order) return null;

    const whatsappUrl = (() => {
        if (!order.phone) return null;
        let cleanPhone = order.phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '233' + cleanPhone.substring(1);
        else if (cleanPhone.length === 9) cleanPhone = '233' + cleanPhone;
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${order.customer}, regarding order #${order.order_number} from London's Imports:`)}`;
    })();

    return (
        <div className={`min-h-screen pb-32 ${isDark ? 'bg-slate-950 text-white' : 'bg-[#FAFAFA] text-slate-900'}`}>
            <div className={`sticky top-0 z-[60] px-8 py-5 border-b backdrop-blur-xl ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Register
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-xs tracking-[0.2em] opacity-30">REF NO:</span>
                        <h1 className="font-mono text-lg font-bold tracking-tighter">#{order.order_number}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                            order.payment_status === 'PAID' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        }`}>
                            {order.payment_status}
                        </div>
                        <div className={`px-4 py-1.5 rounded-full border border-slate-800 text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                            {order.status.replace(/_/g, ' ')}
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1600px] mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        <section className={`p-10 border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-4">
                                    <Truck className="w-5 h-5 opacity-20" />
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Dispatch Lifecycle</h2>
                                </div>
                                <span className="text-[10px] font-mono opacity-30 uppercase">Operational Protocol</span>
                            </div>
                            <LogisticsStepper status={order.status} isDark={isDark} />
                        </section>

                        <section className={`border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="p-8 border-b border-inherit flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <FileText className="w-5 h-5 opacity-20" />
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Shipment Manifest</h2>
                                </div>
                                <span className="text-[10px] font-mono opacity-30 uppercase">{order.items.length} LINE ITEMS</span>
                            </div>
                            
                            <div className="divide-y divide-inherit">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-8 p-8 group hover:bg-slate-500/5 transition-colors">
                                        <div className="relative w-24 h-24 overflow-hidden border border-inherit shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                                            <Image
                                                src={getImageUrl(item.image)}
                                                alt={item.product_name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xl font-serif font-bold tracking-tight mb-2 leading-none">{item.product_name}</p>
                                            <div className="flex gap-4">
                                                <span className="text-[10px] font-mono opacity-40 uppercase">COLOR: {item.color || 'STND'}</span>
                                                <span className="text-[10px] font-mono opacity-40 uppercase">SIZE: {item.size || 'STND'}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-mono tracking-tighter mb-1">₵{parseFloat(item.price).toLocaleString()}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-20 italic">QUANTITY: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-12 bg-slate-500/5 border-t border-inherit">
                                <div className="max-w-md ml-auto space-y-6">
                                    <div className="grid grid-cols-2 gap-4 pb-6 border-b border-dashed border-inherit">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Subtotal</span>
                                            <p className="text-lg font-mono tracking-tighter">₵{parseFloat(order.subtotal).toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Freight & Logistics</span>
                                            <p className="text-lg font-mono tracking-tighter">₵{parseFloat(order.delivery_fee).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 block mb-2">Grand Valuation</span>
                                            <h3 className="text-5xl font-serif font-bold tracking-tighter leading-none">
                                                ₵{parseFloat(order.total).toLocaleString()}
                                            </h3>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <div className="flex items-center gap-3 justify-end">
                                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Paid:</span>
                                                <span className="text-sm font-mono text-emerald-500 font-bold">₵{parseFloat(order.amount_paid).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-3 justify-end">
                                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Due:</span>
                                                <span className={`text-sm font-mono font-bold ${parseFloat(order.balance_due) > 0 ? 'text-rose-500' : 'opacity-20'}`}>
                                                    ₵{parseFloat(order.balance_due).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={`p-10 border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <MapPin className="w-5 h-5 opacity-20" />
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Dispatch Coordinates</h2>
                                </div>
                                <button
                                    onClick={isEditingDelivery ? handleSaveDelivery : () => {
                                        setEditForm({
                                            delivery_address: order.delivery_address || '',
                                            delivery_city: order.delivery_city || '',
                                            delivery_region: order.delivery_region || '',
                                            delivery_gps: order.delivery_gps || '',
                                            customer_notes: order.customer_notes || ''
                                        });
                                        setIsEditingDelivery(true);
                                    }}
                                    className="text-[9px] font-black uppercase tracking-widest underline underline-offset-4 opacity-40 hover:opacity-100 transition-opacity"
                                >
                                    {isEditingDelivery ? 'Commit Protocol' : 'Update Protocol'}
                                </button>
                            </div>

                            {!isEditingDelivery ? (
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div>
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 block mb-2">Drop Location</span>
                                            <p className="text-2xl font-serif font-bold tracking-tight leading-tight">{order.delivery_address}</p>
                                        </div>
                                        <div className="flex gap-12">
                                            <div>
                                                <span className="text-[9px] font-black uppercase tracking-widest opacity-30 block mb-1">City Hub</span>
                                                <p className="text-sm font-bold uppercase tracking-widest">{order.delivery_city}</p>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black uppercase tracking-widest opacity-30 block mb-1">Region</span>
                                                <p className="text-sm font-bold uppercase tracking-widest">{order.delivery_region}</p>
                                            </div>
                                        </div>
                                        {order.delivery_gps && (
                                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-500/5 border border-inherit font-mono text-[10px] tracking-widest">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                COORD: {order.delivery_gps}
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-slate-500/5 p-8 border-l-2 border-pink-500">
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-30 block mb-4">Internal Directives</span>
                                        <p className="text-sm font-medium italic opacity-60 leading-relaxed">
                                            &quot;{order.customer_notes || 'No special directives logged for this shipment.'}&quot;
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <input
                                        value={editForm.delivery_address}
                                        onChange={(e) => setEditForm({ ...editForm, delivery_address: e.target.value })}
                                        className={`col-span-2 p-5 border-b bg-transparent outline-none font-bold uppercase tracking-widest text-sm border-slate-200 dark:border-slate-800 focus:border-pink-500 transition-all`}
                                        placeholder="STREET & LANDMARKS"
                                    />
                                    <input
                                        value={editForm.delivery_city}
                                        onChange={(e) => setEditForm({ ...editForm, delivery_city: e.target.value })}
                                        className="p-5 border-b bg-transparent outline-none font-bold uppercase tracking-widest text-sm border-slate-200 dark:border-slate-800 focus:border-pink-500 transition-all"
                                        placeholder="CITY HUB"
                                    />
                                    <input
                                        value={editForm.delivery_region}
                                        onChange={(e) => setEditForm({ ...editForm, delivery_region: e.target.value })}
                                        className="p-5 border-b bg-transparent outline-none font-bold uppercase tracking-widest text-sm border-slate-200 dark:border-slate-800 focus:border-pink-500 transition-all"
                                        placeholder="REGION"
                                    />
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-12">
                        <CustomerIntelligenceCard 
                            customer={{
                                name: order.customer,
                                email: order.email,
                                phone: order.phone,
                                stats: order.customer_stats
                            }} 
                            isDark={isDark} 
                        />

                        <section className={`border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="p-8 border-b border-inherit flex items-center gap-4">
                                <Terminal className="w-5 h-5 opacity-20" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Override Terminal</h2>
                            </div>
                            
                            <div className="p-8 space-y-4">
                                {whatsappUrl && (
                                    <a href={whatsappUrl} target="_blank" className="w-full flex items-center justify-between p-6 bg-[#25D366] text-white font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
                                        Open Messaging Bridge
                                        <MessageCircle className="w-5 h-5" />
                                    </a>
                                )}
                                
                                <div className="grid grid-cols-2 gap-px bg-slate-800/10 dark:bg-white/10 border border-inherit">
                                    <button 
                                        onClick={handleMarkAsPaid}
                                        className="p-6 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-white/5 flex flex-col gap-3 group transition-all"
                                    >
                                        <CreditCard className="w-5 h-5 text-purple-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-left leading-tight group-hover:translate-x-1 transition-transform">
                                            Credit <br /> Override
                                        </span>
                                    </button>
                                    <button 
                                        onClick={openTransferModal}
                                        className="p-6 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-white/5 flex flex-col gap-3 group transition-all border-l border-inherit"
                                    >
                                        <ArrowRightLeft className="w-5 h-5 text-blue-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-left leading-tight group-hover:translate-x-1 transition-transform">
                                            Balance <br /> Migration
                                        </span>
                                    </button>
                                </div>

                                <div className="pt-4 space-y-2">
                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-20 block ml-2 mb-2">Protocol Transitions</span>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button onClick={() => handleUpdateStatus('IN_TRANSIT')} className="w-full p-4 border border-inherit text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all text-left flex justify-between items-center group">
                                            Authorize Shipment
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                                        </button>
                                        <button onClick={() => handleUpdateStatus('ARRIVED')} className="w-full p-4 border border-inherit text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all text-left flex justify-between items-center group">
                                            Authorize Arrival
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                                        </button>
                                        <button onClick={() => handleUpdateStatus('DELIVERED')} className="w-full p-4 border border-inherit text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all text-left flex justify-between items-center group">
                                            Authorize Finality
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                                        </button>
                                        <button onClick={() => handleUpdateStatus('CANCELLED')} className="w-full p-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-left">
                                            Void Transaction
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-500/5 border-t border-inherit flex items-center gap-3">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">System Integrity Verified</span>
                            </div>
                        </section>

                        <section className={`p-8 border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="flex items-center gap-3 mb-10">
                                <OrderHistoryIcon className="w-4 h-4 opacity-20" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Operational Log</h2>
                            </div>
                            
                            <div className="space-y-10 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-inherit">
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-slate-950 dark:border-slate-950 bg-emerald-500 z-10" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 block mb-1">State: Active</span>
                                    <p className="text-sm font-bold uppercase tracking-widest">{order.status.replace(/_/g, ' ')}</p>
                                    <p className="text-[10px] opacity-30 mt-1 uppercase font-mono">Synced via London Hub Control</p>
                                </div>
                                <div className="relative pl-8 opacity-40">
                                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-slate-950 dark:border-slate-950 bg-slate-500 z-10" />
                                    <span className="text-[9px] font-black uppercase tracking-widest block mb-1">Event: Registration</span>
                                    <p className="text-sm font-bold uppercase tracking-widest">Entry Created</p>
                                    <p className="text-[10px] mt-1 font-mono">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {isTransferModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`w-full max-w-xl border p-12 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-2xl'}`}
                        >
                            <h2 className="text-4xl font-serif font-bold tracking-tighter mb-2">Ledger Adjustment</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-12">Internal Balance Migration Protocol</p>
                            
                            <div className="space-y-10">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Target Reference</label>
                                    <select
                                        value={transferData.target_order_id}
                                        onChange={(e) => setTransferData({ ...transferData, target_order_id: e.target.value })}
                                        className="w-full p-6 border-b bg-transparent outline-none font-bold uppercase tracking-widest text-sm border-inherit focus:border-pink-500 transition-all"
                                    >
                                        <option value="">SELECT DESTINATION ENTRY...</option>
                                        {customerOrders.map(o => (
                                            <option key={o.id} value={o.id}>
                                                #{o.order_number} (CAPACITY: ₵{parseFloat(o.total).toLocaleString()})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Migration Amount</label>
                                        <div className="flex items-baseline gap-4 border-b border-inherit pb-2">
                                            <span className="text-xl font-serif italic text-pink-500">₵</span>
                                            <input
                                                type="number"
                                                value={transferData.amount}
                                                onChange={(e) => setTransferData({ ...transferData, amount: parseFloat(e.target.value) })}
                                                className="bg-transparent text-3xl font-mono tracking-tighter outline-none w-full"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest opacity-60">Limit: ₵{parseFloat(order.amount_paid).toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Audit Justification</label>
                                        <input
                                            value={transferData.reason}
                                            onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                                            className="w-full py-4 border-b bg-transparent outline-none font-bold uppercase tracking-widest text-[10px] border-inherit focus:border-pink-500 transition-all"
                                            placeholder="REASON FOR ADJUSTMENT"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-20">
                                <button onClick={() => setIsTransferModalOpen(false)} className="p-6 border border-inherit text-[10px] font-black uppercase tracking-widest hover:bg-slate-500/5">
                                    Abort
                                </button>
                                <button 
                                    onClick={handleTransferPayment}
                                    disabled={updating || !transferData.target_order_id || transferData.amount <= 0}
                                    className="p-6 bg-pink-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black disabled:opacity-30 transition-all"
                                >
                                    {updating ? 'Executing...' : 'Authorize Migration'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            <div className="fixed bottom-12 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center gap-4 px-4">
                <AnimatePresence mode="popLayout">
                    {alerts.map(alert => (
                        <div key={alert.id} className="pointer-events-auto">
                            <AuraAlert
                                id={alert.id}
                                message={alert.message}
                                type={alert.type}
                                onClose={removeAlert}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>

            <style jsx global>{`
                .bg-stationery {
                    background-color: #FAFAFA;
                    background-image: 
                        linear-gradient(#f0f0f0 1px, transparent 1px),
                        linear-gradient(90deg, #f0f0f0 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>
        </div>
    );
}
