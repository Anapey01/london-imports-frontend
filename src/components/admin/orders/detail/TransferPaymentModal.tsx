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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
            <div 
                onClick={() => setIsTransferModalOpen(false)}
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className={`relative z-10 w-full max-w-xl border p-5 sm:p-8 rounded-2xl shadow-2xl my-auto max-h-[92dvh] overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
            >
                <button 
                    onClick={() => setIsTransferModalOpen(false)}
                    className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Close modal"
                >
                    <X className="w-4 h-4 text-slate-400" />
                </button>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight mb-1 sm:mb-2 pr-8">Transfer Payment</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40 mb-6">Transfer balance between orders</p>
                
                <div className="space-y-5 sm:space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Move Money To This Order</label>
                        <select
                            value={transferData.target_order_id}
                            onChange={(e) => setTransferData({ ...transferData, target_order_id: e.target.value })}
                            className="w-full p-3.5 bg-slate-500/5 border border-inherit text-xs sm:text-sm font-bold outline-none focus:border-pink-500 transition-all rounded-lg"
                        >
                            <option value="">CHOOSE AN ORDER...</option>
                            {customerOrders.map(o => (
                                <option key={o.id} value={o.id}>
                                    #{o.order_number} - ₵{parseFloat(o.balance_due).toLocaleString()} Due
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Amount to Transfer (GHS)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-serif italic opacity-40">₵</span>
                            <input
                                type="number"
                                value={transferData.amount}
                                onChange={(e) => setTransferData({ ...transferData, amount: parseFloat(e.target.value) || 0 })}
                                className="w-full p-3.5 pl-10 bg-slate-500/5 border border-inherit text-xl sm:text-2xl font-mono tracking-tight outline-none focus:border-pink-500 transition-all rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Reason or Note (Optional)</label>
                        <textarea
                            value={transferData.reason}
                            onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                            placeholder="Why are you moving this payment?..."
                            rows={3}
                            className="w-full p-3 bg-slate-500/5 border border-inherit text-xs font-mono outline-none focus:border-pink-500 transition-all rounded-lg resize-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-4 mt-6 pt-5 border-t border-inherit">
                    <button 
                        onClick={() => setIsTransferModalOpen(false)}
                        className="w-full sm:w-auto px-5 py-3 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all cursor-pointer text-center"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleTransferPayment}
                        disabled={updating || !transferData.target_order_id || transferData.amount <= 0}
                        className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 disabled:opacity-30 transition-all flex items-center justify-center gap-2 rounded-lg cursor-pointer"
                    >
                        {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        Move Payment Now
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}
