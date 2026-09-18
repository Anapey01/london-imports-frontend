'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface BulkActionBarProps {
    selectedCount: number;
    statusFilter: string;
    bulkUpdating: boolean;
    bulkProgress: number;
    bulkTotal: number;
    onBulkStatus: (newStatus: string) => void;
    onClearSelection: () => void;
}

export default function BulkActionBar({
    selectedCount,
    statusFilter,
    bulkUpdating,
    bulkProgress,
    bulkTotal,
    onBulkStatus,
    onClearSelection,
}: BulkActionBarProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {selectedCount > 0 && (
                <div className="fixed bottom-3 inset-x-2 sm:bottom-6 sm:inset-x-0 md:left-64 z-[9000] flex justify-center px-2 sm:px-4 pointer-events-none">
                    <motion.div
                        initial={{ y: 80, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 80, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="pointer-events-auto w-full max-w-4xl bg-slate-950 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl"
                    >
                        {bulkUpdating && (
                            <div className="w-full h-1 bg-white/10 overflow-hidden">
                                <motion.div 
                                    className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${(bulkProgress / bulkTotal) * 100}%` }}
                                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                                />
                            </div>
                        )}
                        <div className="px-3.5 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-500 text-slate-950 rounded-lg flex items-center justify-center text-[11px] sm:text-[12px] font-black shrink-0">
                                    {selectedCount}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white truncate">
                                        {bulkUpdating ? `Processing ${bulkProgress}/${bulkTotal}...` : `${selectedCount} Orders Selected`}
                                    </p>
                                    <p className="text-[8px] sm:text-[9px] font-medium text-slate-400 truncate">
                                        {bulkUpdating ? 'Applying changes to database...' : 'Move selected orders to:'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap">
                                <button
                                    onClick={() => onBulkStatus('PENDING_PAYMENT')}
                                    disabled={bulkUpdating}
                                    className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-lg transition-all bg-rose-700 hover:bg-rose-600 text-white disabled:opacity-50 cursor-pointer shadow-sm shrink-0"
                                    title="Reset selected orders to Unpaid (Pending Payment)"
                                >
                                    → Mark as Unpaid
                                </button>
                                <button
                                    onClick={() => onBulkStatus('OPEN_FOR_BATCH')}
                                    disabled={bulkUpdating}
                                    className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-lg transition-all bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 cursor-pointer shadow-sm shrink-0"
                                    title="Move to Packing in China"
                                >
                                    → Packing in China
                                </button>
                                <button
                                    onClick={() => onBulkStatus('IN_TRANSIT')}
                                    disabled={bulkUpdating}
                                    className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-lg transition-all bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 cursor-pointer shadow-sm shrink-0"
                                    title="Move to On the Way to Ghana"
                                >
                                    → On the Way to Ghana
                                </button>
                                <button
                                    onClick={() => onBulkStatus('ARRIVED')}
                                    disabled={bulkUpdating}
                                    className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-lg transition-all bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 cursor-pointer shadow-sm shrink-0"
                                    title="Move to Arrived in Ghana"
                                >
                                    → Arrived in Ghana
                                </button>
                                <button
                                    onClick={() => onBulkStatus('OUT_FOR_DELIVERY')}
                                    disabled={bulkUpdating}
                                    className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-lg transition-all bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50 cursor-pointer shadow-sm shrink-0"
                                    title="Move to Out for Delivery"
                                >
                                    → Out for Delivery
                                </button>
                                <button
                                    onClick={() => onBulkStatus('DELIVERED')}
                                    disabled={bulkUpdating}
                                    className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-lg transition-all bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50 cursor-pointer shadow-sm shrink-0"
                                    title="Move to Delivered"
                                >
                                    → Delivered
                                </button>
                                <button
                                    onClick={onClearSelection}
                                    disabled={bulkUpdating}
                                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
