'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { useTheme } from '@/providers/ThemeProvider';
import { 
    ArrowRightLeft, 
    Search, 
    User, 
    Calendar, 
    CreditCard,
    AlertCircle,
    CheckCircle2,
    History
} from 'lucide-react';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence, motion } from 'framer-motion';

interface Order {
    id: string;
    order_number: string;
    customer: {
        name: string;
        email: string;
    };
    total: number;
    amount_paid: number;
    status: string;
    created_at: string;
}

export default function PaymentTransferPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [sourceSearch, setSourceSearch] = useState('');
    const [targetSearch, setTargetSearch] = useState('');
    const [sourceOrders, setSourceOrders] = useState<Order[]>([]);
    const [targetOrders, setTargetOrders] = useState<Order[]>([]);
    
    const [selectedSource, setSelectedSource] = useState<Order | null>(null);
    const [selectedTarget, setSelectedTarget] = useState<Order | null>(null);
    
    const [amount, setAmount] = useState<number>(0);
    const [reason, setReason] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [searchingSource, setSearchingSource] = useState(false);
    const [searchingTarget, setSearchingTarget] = useState(false);
    
    const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: AlertType }>>([]);

    const addAlert = (message: string, type: AlertType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setAlerts(prev => [...prev, { id, message, type }]);
    };

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const searchOrders = async (query: string, setResults: (res: Order[]) => void, setLoading: (l: boolean) => void) => {
        if (!query || query.length < 2) return;
        setLoading(true);
        try {
            const response = await adminAPI.orders({ search: query });
            setResults(response.data.filter((o: Order) => o.status !== 'CANCELLED'));
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            searchOrders(sourceSearch, setSourceOrders, setSearchingSource);
        }, 500);
        return () => clearTimeout(timer);
    }, [sourceSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            searchOrders(targetSearch, setTargetOrders, setSearchingTarget);
        }, 500);
        return () => clearTimeout(timer);
    }, [targetSearch]);

    const handleTransfer = async () => {
        if (!selectedSource || !selectedTarget || amount <= 0) {
            addAlert('Please select both orders and a valid amount', 'error');
            return;
        }

        if (selectedSource.id === selectedTarget.id) {
            addAlert('Cannot transfer to the same order', 'error');
            return;
        }

        if (amount > selectedSource.amount_paid) {
            addAlert('Amount exceeds source balance', 'error');
            return;
        }

        setLoading(true);
        try {
            await adminAPI.transferPayment(selectedSource.id, {
                target_order_id: selectedTarget.id,
                amount,
                reason
            });
            addAlert('Transfer completed successfully!');
            // Reset state
            setSelectedSource(null);
            setSelectedTarget(null);
            setAmount(0);
            setReason('');
            setSourceSearch('');
            setTargetSearch('');
        } catch (error: any) {
            addAlert(error.response?.data?.error || 'Transfer failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openTransferModal = async () => {
        // This is a placeholder or not needed here but good to keep logic if we move back
    };

    const OrderCard = ({ order, onSelect, isSelected, type }: { order: Order, onSelect: () => void, isSelected: boolean, type: 'source' | 'target' }) => (
        <button
            onClick={onSelect}
            className={`w-full text-left p-6 rounded-3xl transition-all border-2 ${
                isSelected 
                    ? 'border-pink-500 bg-pink-500/5 shadow-lg shadow-pink-500/10' 
                    : isDark ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
            }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                        {type === 'source' ? 'Funds Origin' : 'Destination'}
                    </p>
                    <p className={`text-lg font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        #{order.order_number}
                    </p>
                </div>
                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${
                    order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                    {order.status}
                </span>
            </div>
            
            <div className="space-y-3">
                <div className="flex items-center gap-3 opacity-60">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-bold">{order.customer.name}</span>
                </div>
                <div className="flex items-center gap-3 opacity-60">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="pt-3 border-t border-primary-surface/10 flex justify-between items-baseline">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Paid Balance</span>
                    <span className="text-sm font-black text-emerald-500">₵{order.amount_paid.toLocaleString()}</span>
                </div>
            </div>
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-24">
            <header>
                <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Payment Transfer Hub
                </h1>
                <p className={`text-sm mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Electronically move funds between customer orders to resolve payment errors.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Source Selection */}
                <section className="space-y-4">
                    <h2 className={`text-xs font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                        1. Select Source Order
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
                        <input
                            placeholder="Search by Order # or Customer..."
                            value={sourceSearch}
                            onChange={(e) => setSourceSearch(e.target.value)}
                            className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold border-2 focus:border-pink-500 outline-none transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100'}`}
                        />
                        {searchingSource && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                        {selectedSource ? (
                            <div className="relative">
                                <OrderCard 
                                    order={selectedSource} 
                                    onSelect={() => setSelectedSource(null)} 
                                    isSelected={true} 
                                    type="source" 
                                />
                                <button 
                                    onClick={() => setSelectedSource(null)}
                                    className="absolute top-4 right-4 p-2 bg-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                                >
                                    <ArrowRightLeft className="w-4 h-4 rotate-45" />
                                </button>
                            </div>
                        ) : (
                            sourceOrders.map(o => (
                                <OrderCard key={o.id} order={o} onSelect={() => setSelectedSource(o)} isSelected={false} type="source" />
                            ))
                        )}
                        {!selectedSource && sourceSearch && sourceOrders.length === 0 && !searchingSource && (
                            <p className="text-center py-8 text-sm opacity-40 italic">No eligible source orders found</p>
                        )}
                    </div>
                </section>

                {/* Target Selection */}
                <section className="space-y-4">
                    <h2 className={`text-xs font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                        2. Select Destination Order
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
                        <input
                            placeholder="Search by Order # or Customer..."
                            value={targetSearch}
                            onChange={(e) => setTargetSearch(e.target.value)}
                            className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold border-2 focus:border-pink-500 outline-none transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100'}`}
                        />
                        {searchingTarget && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                        {selectedTarget ? (
                            <div className="relative">
                                <OrderCard 
                                    order={selectedTarget} 
                                    onSelect={() => setSelectedTarget(null)} 
                                    isSelected={true} 
                                    type="target" 
                                />
                                <button 
                                    onClick={() => setSelectedTarget(null)}
                                    className="absolute top-4 right-4 p-2 bg-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                                >
                                    <ArrowRightLeft className="w-4 h-4 rotate-45" />
                                </button>
                            </div>
                        ) : (
                            targetOrders.map(o => (
                                <OrderCard key={o.id} order={o} onSelect={() => setSelectedTarget(o)} isSelected={false} type="target" />
                            ))
                        )}
                        {!selectedTarget && targetSearch && targetOrders.length === 0 && !searchingTarget && (
                            <p className="text-center py-8 text-sm opacity-40 italic">No eligible target orders found</p>
                        )}
                    </div>
                </section>
            </div>

            {/* Execution Panel */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-10 rounded-[3rem] border ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/50' : 'bg-white border-gray-100 shadow-xl'}`}
            >
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Transfer Amount</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-pink-500">₵</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                                        placeholder="0.00"
                                        className={`w-full pl-12 pr-6 py-5 rounded-[2rem] text-xl font-black border-2 focus:border-pink-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100'}`}
                                    />
                                    {selectedSource && (
                                        <p className="absolute -bottom-6 left-2 text-[9px] font-black text-pink-500 uppercase tracking-widest">
                                            Available: ₵{selectedSource.amount_paid.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Adjustment Reason</label>
                                <input
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Brief description of the error..."
                                    className={`w-full px-8 py-5 rounded-[2rem] text-sm font-bold border-2 focus:border-pink-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100'}`}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleTransfer}
                        disabled={loading || !selectedSource || !selectedTarget || amount <= 0}
                        className={`shrink-0 h-24 px-12 rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] transition-all ${
                            loading || !selectedSource || !selectedTarget || amount <= 0
                                ? 'bg-gray-500 opacity-20 cursor-not-allowed'
                                : 'bg-pink-500 text-white hover:scale-105 active:scale-95 shadow-xl shadow-pink-500/30'
                        }`}
                    >
                        {loading ? 'Processing...' : 'Authorize Transfer'}
                        <ArrowRightLeft className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Validation Info */}
                <div className="mt-8 flex flex-wrap gap-6 pt-8 border-t border-primary-surface/10">
                    <div className="flex items-center gap-2">
                        {selectedSource && selectedTarget && selectedSource.customer.email === selectedTarget.customer.email ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Customer Match Policy</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-pink-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Auto Stock Release Enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Customer Email Receipt Enabled</span>
                    </div>
                </div>
            </motion.div>

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
