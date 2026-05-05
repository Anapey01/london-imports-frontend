'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { useTheme } from '@/providers/ThemeProvider';
import { 
    ArrowRightLeft, 
    Search, 
    Loader2,
    CheckCircle2,
    History,
    AlertCircle,
    ArrowRight,
    X
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
            const data = response.data;
            let results: Order[] = [];
            
            if (Array.isArray(data.results)) {
                results = data.results;
            } else if (Array.isArray(data)) {
                results = data;
            }
            
            setResults(results.filter((o: any) => o.status !== 'CANCELLED'));
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!selectedSource && sourceSearch) searchOrders(sourceSearch, setSourceOrders, setSearchingSource);
        }, 300);
        return () => clearTimeout(timer);
    }, [sourceSearch, selectedSource]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!selectedTarget && targetSearch) searchOrders(targetSearch, setTargetOrders, setSearchingTarget);
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
            const errorMsg = error.response?.data?.error || (typeof error.response?.data === 'object' ? JSON.stringify(error.response.data) : 'Transfer failed');
            addAlert(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const OrderListItem = ({ order, onSelect }: { order: Order, onSelect: () => void }) => (
        <button
            onClick={onSelect}
            className={`w-full group flex flex-col p-4 rounded-none border-b transition-all ${
                isDark ? 'border-slate-800 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'
            }`}
        >
            <div className="flex justify-between items-start mb-1">
                <span className="font-mono text-xs tracking-wider opacity-60">#{order.order_number}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">₵{Number(order.amount_paid).toLocaleString()}</span>
            </div>
            <p className={`text-sm font-bold text-left truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.customer.name}</p>
        </button>
    );

    const SelectedModule = ({ order, onClear, type }: { order: Order, onClear: () => void, type: 'source' | 'target' }) => (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`relative p-8 border ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
            }`}
        >
            <button 
                onClick={onClear}
                className="absolute top-4 right-4 p-2 opacity-30 hover:opacity-100 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${type === 'source' ? 'bg-pink-500' : 'bg-blue-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                        {type === 'source' ? 'Source Ledger' : 'Destination Ledger'}
                    </span>
                </div>
                <div>
                    <h3 className="font-mono text-3xl tracking-tighter mb-1">#{order.order_number}</h3>
                    <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{order.customer.name}</p>
                </div>
                <div className="grid grid-cols-2 border-t border-dashed border-slate-800/20 dark:border-white/10 pt-6 gap-8">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Available Funds</p>
                        <p className="text-xl font-mono text-emerald-500">₵{Number(order.amount_paid).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Order Status</p>
                        <p className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-100 dark:bg-slate-800 w-fit rounded">
                            {order.status.replace(/_/g, ' ')}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-stationery text-gray-900'} pb-64`}>
            <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20">
                {/* Editorial Header */}
                <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div className="max-w-2xl space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-pink-500 text-white text-[9px] font-black uppercase tracking-widest">Administrative</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">Ledger Protocol v2.0</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-tight">
                            Payment <br />
                            <span className="italic text-pink-500">Transfer</span> Hub.
                        </h1>
                        <p className="text-lg opacity-60 leading-relaxed font-medium">
                            Execute atomic transfers between orders within the same customer ecosystem. 
                            Strictly enforced for internal balance corrections and credit migrations.
                        </p>
                    </div>
                    
                    <div className="hidden lg:block space-y-4">
                        <div className="flex items-center gap-3 justify-end">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Ledger Active</span>
                        </div>
                        <div className="w-64 h-[1px] bg-border-standard opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 text-right">
                            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 border border-border-standard">
                    {/* Left Column: Source */}
                    <div className="border-r border-border-standard p-8 md:p-12 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">01. Select Source</h2>
                            {searchingSource && <Loader2 className="w-4 h-4 animate-spin opacity-20" />}
                        </div>
                        
                        {!selectedSource ? (
                            <div className="space-y-6">
                                <div className="relative border-b-2 border-slate-800/10 dark:border-white/10 group focus-within:border-pink-500 transition-all">
                                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                                    <input
                                        placeholder="SEARCH ORDER OR CUSTOMER"
                                        value={sourceSearch}
                                        onChange={(e) => setSourceSearch(e.target.value)}
                                        className="w-full pl-8 py-4 bg-transparent outline-none text-sm font-bold uppercase tracking-widest placeholder:opacity-20"
                                    />
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {sourceOrders.map(o => <OrderListItem key={o.id} order={o} onSelect={() => setSelectedSource(o)} />)}
                                    {sourceSearch && sourceOrders.length === 0 && !searchingSource && (
                                        <p className="py-12 text-center text-[10px] font-black uppercase tracking-widest opacity-20 italic">Empty Dataset</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <SelectedModule order={selectedSource} onClear={() => setSelectedSource(null)} type="source" />
                        )}
                    </div>

                    {/* Right Column: Target */}
                    <div className="p-8 md:p-12 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">02. Select Destination</h2>
                            {searchingTarget && <Loader2 className="w-4 h-4 animate-spin opacity-20" />}
                        </div>

                        {!selectedTarget ? (
                            <div className="space-y-6">
                                <div className="relative border-b-2 border-slate-800/10 dark:border-white/10 group focus-within:border-blue-500 transition-all">
                                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                                    <input
                                        placeholder="SEARCH ORDER OR CUSTOMER"
                                        value={targetSearch}
                                        onChange={(e) => setTargetSearch(e.target.value)}
                                        className="w-full pl-8 py-4 bg-transparent outline-none text-sm font-bold uppercase tracking-widest placeholder:opacity-20"
                                    />
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {targetOrders.map(o => <OrderListItem key={o.id} order={o} onSelect={() => setSelectedTarget(o)} />)}
                                    {targetSearch && targetOrders.length === 0 && !searchingTarget && (
                                        <p className="py-12 text-center text-[10px] font-black uppercase tracking-widest opacity-20 italic">Empty Dataset</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <SelectedModule order={selectedTarget} onClear={() => setSelectedTarget(null)} type="target" />
                        )}
                    </div>
                </div>
            </div>

            {/* Premium Execution bridge */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white dark:bg-slate-900 border-t border-border-standard z-50 transition-all">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3">
                    <div className="border-r border-border-standard p-6 md:p-10 flex flex-col justify-center">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-3 block">Amount to Transfer</label>
                        <div className="flex items-baseline gap-4">
                            <span className="text-2xl font-serif italic text-pink-500">₵</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                className="bg-transparent text-5xl font-mono tracking-tighter outline-none w-full"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    
                    <div className="border-r border-border-standard p-6 md:p-10 flex flex-col justify-center">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-3 block">Audit Log Reason</label>
                        <input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="bg-transparent text-sm font-bold outline-none w-full uppercase tracking-widest placeholder:opacity-10"
                            placeholder="Enter justification..."
                        />
                    </div>

                    <div className="p-6 md:p-10 flex items-center">
                        <button
                            onClick={handleTransfer}
                            disabled={loading || !selectedSource || !selectedTarget || amount <= 0}
                            className={`w-full group h-20 md:h-24 flex items-center justify-between px-10 transition-all ${
                                loading || !selectedSource || !selectedTarget || amount <= 0
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                                    : 'bg-pink-600 text-white hover:bg-black active:scale-95'
                            }`}
                        >
                            <div className="text-left">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] block mb-1 opacity-60">Authorize Ledger</span>
                                <span className="text-xl font-bold uppercase tracking-widest">Execute.</span>
                            </div>
                            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />}
                        </button>
                    </div>
                </div>
                
                {/* Meta Row */}
                <div className="px-10 py-3 bg-slate-50 dark:bg-slate-800/30 border-t border-border-standard flex items-center justify-between">
                    <div className="flex gap-8">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Atomic Consistency</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <History className="w-3 h-3 text-blue-500" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Version Control</span>
                        </div>
                    </div>
                    {selectedSource && selectedTarget && (
                        <div className={`text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 border ${
                            selectedSource.customer.email === selectedTarget.customer.email ? 'border-emerald-500/50 text-emerald-500' : 'border-red-500/50 text-red-500'
                        }`}>
                            {selectedSource.customer.email === selectedTarget.customer.email ? 'Identity Integrity Verified' : 'Security Warning: Identity Mismatch'}
                        </div>
                    )}
                </div>
            </div>

            {/* Notifications */}
            <div className="fixed top-12 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center gap-4 px-4">
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
                .custom-scrollbar::-webkit-scrollbar {
                    width: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(236, 72, 153, 0.2);
                }
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            `}</style>
        </div>
    );
}
