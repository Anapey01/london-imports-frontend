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
    History,
    ChevronRight,
    Loader2
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
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }
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
            if (!selectedSource) searchOrders(sourceSearch, setSourceOrders, setSearchingSource);
        }, 300);
        return () => clearTimeout(timer);
    }, [sourceSearch, selectedSource]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!selectedTarget) searchOrders(targetSearch, setTargetOrders, setSearchingTarget);
        }, 300);
        return () => clearTimeout(timer);
    }, [targetSearch, selectedTarget]);

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

    const OrderListItem = ({ order, onSelect, type }: { order: Order, onSelect: () => void, type: 'source' | 'target' }) => (
        <button
            onClick={onSelect}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                isDark ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-800' : 'border-gray-100 bg-white hover:bg-gray-50'
            }`}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                type === 'source' ? 'bg-pink-500/10 text-pink-500' : 'bg-blue-500/10 text-blue-500'
            }`}>
                {type === 'source' ? <ArrowRightLeft className="w-5 h-5 rotate-180" /> : <ArrowRightLeft className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    #{order.order_number}
                </p>
                <p className="text-[10px] font-bold opacity-40 uppercase truncate">
                    {order.customer.name} • {order.customer.email}
                </p>
            </div>
            <div className="text-right">
                <p className="text-sm font-black text-emerald-500">₵{order.amount_paid.toLocaleString()}</p>
                <p className="text-[10px] font-bold opacity-40 uppercase">Paid</p>
            </div>
            <ChevronRight className="w-4 h-4 opacity-20" />
        </button>
    );

    const SelectedCard = ({ order, onClear, type }: { order: Order, onClear: () => void, type: 'source' | 'target' }) => (
        <motion.div 
            layoutId={type}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative p-6 rounded-[2rem] border-2 shadow-xl ${
                type === 'source' 
                    ? 'border-pink-500/30 bg-pink-500/5' 
                    : 'border-blue-500/30 bg-blue-500/5'
            }`}
        >
            <button 
                onClick={onClear}
                className="absolute top-4 right-4 text-[10px] font-black uppercase underline tracking-widest opacity-40 hover:opacity-100 transition-opacity"
            >
                Change
            </button>
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    type === 'source' ? 'bg-pink-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                    {type === 'source' ? <ArrowRightLeft className="w-6 h-6 rotate-180" /> : <ArrowRightLeft className="w-6 h-6" />}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">
                        {type === 'source' ? 'Source Order' : 'Destination Order'}
                    </p>
                    <h3 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        #{order.order_number}
                    </h3>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-900' : 'bg-white/50 shadow-sm'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Customer</p>
                    <p className="text-sm font-bold truncate">{order.customer.name}</p>
                </div>
                <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-900' : 'bg-white/50 shadow-sm'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Paid Balance</p>
                    <p className="text-sm font-black text-emerald-500">₵{order.amount_paid.toLocaleString()}</p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-4">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center">
                            <ArrowRightLeft className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500">Financial Ops</span>
                    </div>
                    <h1 className={`text-4xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Payment Transfer Hub
                    </h1>
                </div>
                <div className={`px-6 py-3 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">System Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold">Ledger Engine Ready</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">
                {/* Source Selection Area */}
                <div className="space-y-6">
                    {selectedSource ? (
                        <SelectedCard order={selectedSource} onClear={() => setSelectedSource(null)} type="source" />
                    ) : (
                        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-gray-100 shadow-sm'} space-y-6`}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Search Source</h2>
                                {searchingSource && <Loader2 className="w-4 h-4 text-pink-500 animate-spin" />}
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20 group-focus-within:text-pink-500 group-focus-within:opacity-100 transition-all" />
                                <input
                                    placeholder="Type Order #, Name or Email..."
                                    value={sourceSearch}
                                    onChange={(e) => setSourceSearch(e.target.value)}
                                    className={`w-full pl-16 pr-6 py-5 rounded-3xl text-sm font-bold border-2 focus:border-pink-500 outline-none transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-50 border-gray-100'}`}
                                />
                            </div>
                            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {sourceOrders.map(o => (
                                    <OrderListItem key={o.id} order={o} onSelect={() => setSelectedSource(o)} type="source" />
                                ))}
                                {sourceSearch && sourceOrders.length === 0 && !searchingSource && (
                                    <div className="py-12 text-center opacity-30 italic text-sm">No results for &quot;{sourceSearch}&quot;</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Target Selection Area */}
                <div className="space-y-6">
                    {selectedTarget ? (
                        <SelectedCard order={selectedTarget} onClear={() => setSelectedTarget(null)} type="target" />
                    ) : (
                        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-gray-100 shadow-sm'} space-y-6`}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Search Destination</h2>
                                {searchingTarget && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20 group-focus-within:text-blue-500 group-focus-within:opacity-100 transition-all" />
                                <input
                                    placeholder="Type Order #, Name or Email..."
                                    value={targetSearch}
                                    onChange={(e) => setTargetSearch(e.target.value)}
                                    className={`w-full pl-16 pr-6 py-5 rounded-3xl text-sm font-bold border-2 focus:border-blue-500 outline-none transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-50 border-gray-100'}`}
                                />
                            </div>
                            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {targetOrders.map(o => (
                                    <OrderListItem key={o.id} order={o} onSelect={() => setSelectedTarget(o)} type="target" />
                                ))}
                                {targetSearch && targetOrders.length === 0 && !searchingTarget && (
                                    <div className="py-12 text-center opacity-30 italic text-sm">No results for &quot;{targetSearch}&quot;</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Execution Bridge */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 p-8 z-[100] pointer-events-none">
                <div className="max-w-4xl mx-auto pointer-events-auto">
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className={`p-2 rounded-[3rem] shadow-2xl backdrop-blur-xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-gray-100'}`}
                    >
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
                            <div className="flex-1 flex flex-col md:flex-row gap-2">
                                <div className="flex-1 px-8 py-5 rounded-[2.5rem] flex flex-col justify-center gap-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Transfer Sum</label>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-black text-pink-500">₵</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                            className={`bg-transparent text-2xl font-black outline-none w-full ${isDark ? 'text-white' : 'text-gray-900'}`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className={`flex-1 px-8 py-5 rounded-[2.5rem] flex flex-col justify-center gap-1 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Protocol Reason</label>
                                    <input
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className={`bg-transparent text-sm font-bold outline-none w-full ${isDark ? 'text-white' : 'text-gray-900'}`}
                                        placeholder="e.g. Correcting mistaken order payment"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleTransfer}
                                disabled={loading || !selectedSource || !selectedTarget || amount <= 0}
                                className={`lg:w-72 h-auto py-6 lg:py-0 px-10 rounded-[2.5rem] flex items-center justify-center gap-4 transition-all ${
                                    loading || !selectedSource || !selectedTarget || amount <= 0
                                        ? 'bg-gray-500/10 text-gray-500 cursor-not-allowed'
                                        : 'bg-pink-600 text-white hover:bg-pink-500 shadow-lg shadow-pink-500/20 active:scale-95'
                                }`}
                            >
                                <span className="text-xs font-black uppercase tracking-[0.2em]">Authorize Now</span>
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRightLeft className="w-5 h-5" />}
                            </button>
                        </div>
                        
                        <div className="px-10 py-3 flex items-center justify-between">
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2 opacity-40">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Atomic Engine</span>
                                </div>
                                <div className="flex items-center gap-2 opacity-40">
                                    <History className="w-3 h-3" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Stock Auto-Sync</span>
                                </div>
                            </div>
                            {selectedSource && selectedTarget && (
                                <div className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                    selectedSource.customer.email === selectedTarget.customer.email ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                    {selectedSource.customer.email === selectedTarget.customer.email ? 'Identity Verified' : 'Identity Mismatch Warning'}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Notifications */}
            <div className="fixed bottom-32 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center">
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

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(236, 72, 153, 0.2);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(236, 72, 153, 0.4);
                }
            `}</style>
        </div>
    );
}
