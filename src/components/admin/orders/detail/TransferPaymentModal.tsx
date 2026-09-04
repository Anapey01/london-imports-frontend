'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { OrderDetail } from '@/types/order';

interface TransferPaymentModalProps {
    customerOrders: OrderDetail[];
    transferData: { target_order_id: string; amount: number; reason: string };
    setTransferData: (data: any) => void;
    updating: boolean;
    handleTransferPayment: () => void;
    setIsTransferModalOpen: (open: boolean) => void;
    isDark: boolean;
}

export function TransferPaymentModal({
    customerOrders,
    transferData,
    setTransferData,
    updating,
    handleTransferPayment,
    setIsTransferModalOpen,
    isDark
}: TransferPaymentModalProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div 
                onClick={() => setIsTransferModalOpen(false)}
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className={`relative z-10 w-full max-w-xl border p-8 sm:p-12 rounded-2xl shadow-2xl my-auto ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
            >
                <button 
                    onClick={() => setIsTransferModalOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-4 h-4 text-slate-400" />
                </button>

                <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tighter mb-2">Transfer Payment</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-8">Transfer balance between orders</p>
                
                <div className="space-y-6 sm:space-y-8">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Move Money To This Order</label>
                        <select
                            value={transferData.target_order_id}
                            onChange={(e) => setTransferData({ ...transferData, target_order_id: e.target.value })}
                            className="w-full p-3.5 bg-slate-500/5 border border-inherit text-sm font-bold outline-none focus:border-pink-500 transition-all rounded-lg"
                        >
                            <option value="">CHOOSE AN ORDER...</option>
                            {customerOrders.map(o => (
                                <option key={o.id} value={o.id}>
                                    #{o.order_number} - ₵{parseFloat(o.balance_due).toLocaleString()} Due
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Amount to Transfer (GHS)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-serif italic opacity-40">₵</span>
                            <input
                                type="number"
                                value={transferData.amount}
                                onChange={(e) => setTransferData({ ...transferData, amount: parseFloat(e.target.value) || 0 })}
                                className="w-full p-3.5 pl-10 bg-slate-500/5 border border-inherit text-2xl font-mono tracking-tighter outline-none focus:border-pink-500 transition-all rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Reason or Note (Optional)</label>
                        <textarea
                            value={transferData.reason}
                            onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                            placeholder="Why are you moving this payment?..."
                            rows={3}
                            className="w-full p-3.5 bg-slate-500/5 border border-inherit text-[10px] font-mono uppercase tracking-widest outline-none focus:border-pink-500 transition-all rounded-lg"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-inherit">
                    <button 
                        onClick={() => setIsTransferModalOpen(false)}
                        className="px-6 py-3 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleTransferPayment}
                        disabled={updating || !transferData.target_order_id || transferData.amount <= 0}
                        className="px-8 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 disabled:opacity-30 transition-all flex items-center gap-2 rounded-lg cursor-pointer"
                    >
                        {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        Move Payment Now
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}
