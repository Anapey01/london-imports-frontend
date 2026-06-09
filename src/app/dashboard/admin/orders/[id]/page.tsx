'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { useTheme } from '@/providers/ThemeProvider';
import Link from 'next/link';
import { ChevronLeft, Printer, Loader2 } from 'lucide-react';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence } from 'framer-motion';

import { OrderDetail } from '@/types/order';
import { LogisticsStepper } from '@/components/admin/orders/detail/LogisticsStepper';
import { CustomerIntelligenceCard } from '@/components/admin/orders/detail/CustomerIntelligenceCard';
import { OrderItemsList } from '@/components/admin/orders/detail/OrderItemsList';
import { DeliveryAddressManager } from '@/components/admin/orders/detail/DeliveryAddressManager';
import { AdminActionsPanel } from '@/components/admin/orders/detail/AdminActionsPanel';
import { WhatsAppConcierge } from '@/components/admin/orders/detail/WhatsAppConcierge';
import { ActivityLog } from '@/components/admin/orders/detail/ActivityLog';
import { TransferPaymentModal } from '@/components/admin/orders/detail/TransferPaymentModal';

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
    const [customerOrders, setCustomerOrders] = useState<OrderDetail[]>([]);
    const [transferData, setTransferData] = useState({
        target_order_id: '',
        amount: 0,
        reason: ''
    });
    
    const [manualReference, setManualReference] = useState('');

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
            message: `Are you sure you want to change the status to ${newStatus.replace(/_/g, ' ')}?`,
            variant: newStatus === 'CANCELLED' ? 'danger' : 'warning',
            onConfirm: async () => {
                // OPTIMISTIC UI: Update the status immediately before the server responds
                if (order) {
                    setOrder({
                        ...order,
                        status: newStatus,
                        state: newStatus
                    });
                }
                
                setUpdating(true);
                try {
                    await adminAPI.updateOrder(orderId, { status: newStatus });
                    addAlert(`Status updated: ${newStatus.replace(/_/g, ' ')}`);
                    // Load actual order in background without blocking
                    loadOrder().catch(() => {});
                } catch (error: any) {
                    const message = error.response?.data?.error || error.response?.data?.detail || 'Authorization failed';
                    addAlert(message, 'error');
                    // Revert UI if it fails
                    loadOrder().catch(() => {});
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
            title: 'Confirm Manual Payment',
            message: `This will mark the balance of ₵${balance.toLocaleString()} as paid manually. Continue?`,
            variant: 'warning',
            onConfirm: async () => {
                setUpdating(true);
                try {
                    await adminAPI.updateOrder(orderId, { 
                        payment_status: 'PAID', 
                        status: 'PAID',
                        amount_paid: order?.total || 0 
                    });
                    addAlert('Manual credit override successful');
                    await loadOrder();
                } catch (error: any) {
                    const message = error.response?.data?.error || error.response?.data?.detail || 'Credit override rejected';
                    addAlert(message, 'error');
                } finally {
                    setUpdating(false);
                }
            }
        });
    };

    const handleManualSync = async () => {
        if (!manualReference || !order) {
            addAlert('Reference and Order context required', 'error');
            return;
        }
        
        setUpdating(true);
        try {
            const { paymentsAPI } = await import('@/lib/api');
            await paymentsAPI.syncManual(order.order_number, manualReference);
            addAlert('Paystack verification successful');
            setManualReference('');
            await loadOrder();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            addAlert(err.response?.data?.error || 'Verification failed', 'error');
        } finally {
            setUpdating(false);
        }
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
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            addAlert(err.response?.data?.error || 'Adjustment failed', 'error');
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
            setCustomerOrders(response.data.filter((o: OrderDetail) => o.id !== orderId && o.status !== 'CANCELLED'));
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
        } catch (error: any) {
            const message = error.response?.data?.error || error.response?.data?.detail || 'Update failed';
            addAlert(message, 'error');
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



    return (
        <div className={`min-h-screen pb-32 ${isDark ? 'bg-slate-950 text-white' : 'bg-[#FAFAFA] text-slate-900'}`}>
            <div className={`sticky top-0 z-[60] px-4 sm:px-8 py-5 border-b backdrop-blur-xl ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
                <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-0">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all w-fit"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Orders
                    </button>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-[10px] tracking-[0.2em] opacity-30">ORDER NO:</span>
                            <h1 className="font-mono text-sm sm:text-lg font-bold tracking-tighter truncate max-w-[150px] sm:max-w-none">#{order.order_number}</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                                order.payment_status === 'PAID' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                            }`}>
                                {order.payment_status}
                            </div>
                            <div className={`px-4 py-1.5 rounded-full border border-slate-800 text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                                {order.status.replace(/_/g, ' ')}
                            </div>
                            
                            <Link 
                                href={`/dashboard/admin/orders/${order.id}/receipt`}
                                className="flex items-center gap-3 px-6 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all rounded-sm shadow-lg"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                Receipt
                            </Link>
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
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Shipping Status</h2>
                                </div>
                                <span className="text-[10px] font-mono opacity-30 uppercase">Tracking Update</span>
                            </div>
                            <LogisticsStepper status={order.status} isDark={isDark} />
                        </section>

                        <OrderItemsList 
                            items={order.items}
                            subtotal={order.subtotal}
                            deliveryFee={order.delivery_fee}
                            total={order.total}
                            amountPaid={order.amount_paid}
                            balanceDue={order.balance_due}
                            isDark={isDark}
                        />

                        <DeliveryAddressManager
                            order={order}
                            isDark={isDark}
                            isEditingDelivery={isEditingDelivery}
                            editForm={editForm}
                            setEditForm={setEditForm}
                            setIsEditingDelivery={setIsEditingDelivery}
                            handleSaveDelivery={handleSaveDelivery}
                        />
                    </div>

                    <div className="lg:col-span-4 space-y-12">
                        <AdminActionsPanel
                            updating={updating}
                            manualReference={manualReference}
                            setManualReference={setManualReference}
                            handleMarkAsPaid={handleMarkAsPaid}
                            openTransferModal={openTransferModal}
                            handleManualSync={handleManualSync}
                            handleUpdateStatus={handleUpdateStatus}
                            isDark={isDark}
                        />

                        <CustomerIntelligenceCard 
                            customer={{
                                name: order.customer,
                                email: order.email,
                                phone: order.phone,
                                stats: order.customer_stats
                            }} 
                            isDark={isDark} 
                        />

                        <WhatsAppConcierge order={order} isDark={isDark} />

                        <ActivityLog order={order} isDark={isDark} />
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {isTransferModalOpen && (
                    <TransferPaymentModal
                        customerOrders={customerOrders}
                        transferData={transferData}
                        setTransferData={setTransferData}
                        updating={updating}
                        handleTransferPayment={handleTransferPayment}
                        setIsTransferModalOpen={setIsTransferModalOpen}
                        isDark={isDark}
                    />
                )}
            </AnimatePresence>

            {/* Existing Modals and Alerts */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
                <AnimatePresence>
                    {alerts.map(alert => (
                        <AuraAlert
                            key={alert.id}
                            id={alert.id}
                            type={alert.type}
                            message={alert.message}
                            onClose={() => removeAlert(alert.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
