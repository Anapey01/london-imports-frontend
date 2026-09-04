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
                <div className="fixed bottom-6 inset-x-0 md:left-64 z-[9000] flex justify-center px-4 pointer-events-none">
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
                        <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-500 text-slate-950 rounded-lg flex items-center justify-center text-[12px] font-black">
                                    {selectedCount}
                                </div>
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-wider text-white">
                                        {bulkUpdating ? `Processing ${bulkProgress}/${bulkTotal}...` : `${selectedCount} Orders Selected`}
                                    </p>
                                    <p className="text-[9px] font-medium text-slate-400">
                                        {bulkUpdating ? 'Applying changes to database...' : 'Move selected orders to:'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => onBulkStatus('OPEN_FOR_BATCH')}
                                    disabled={bulkUpdating}
                                    className="px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 cursor-pointer shadow-sm"
                                    title="Move to Packing in China"
                                >
                                    → Packing in China
                                </button>
                                <button
                                    onClick={() => onBulkStatus('IN_TRANSIT')}
                                    disabled={bulkUpdating}
                                    className="px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 cursor-pointer shadow-sm"
                                    title="Move to On the Way to Ghana"
                                >
                                    → On the Way to Ghana
                                </button>
                                <button
                                    onClick={() => onBulkStatus('ARRIVED')}
                                    disabled={bulkUpdating}
                                    className="px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 cursor-pointer shadow-sm"
                                    title="Move to Arrived in Ghana"
                                >
                                    → Arrived in Ghana
                                </button>
                                <button
                                    onClick={() => onBulkStatus('OUT_FOR_DELIVERY')}
                                    disabled={bulkUpdating}
                                    className="px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50 cursor-pointer shadow-sm"
                                    title="Move to Out for Delivery"
                                >
                                    → Out for Delivery
                                </button>
                                <button
                                    onClick={() => onBulkStatus('DELIVERED')}
                                    disabled={bulkUpdating}
                                    className="px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50 cursor-pointer shadow-sm"
                                    title="Move to Delivered"
                                >
                                    → Delivered
                                </button>
                                <button
                                    onClick={onClearSelection}
                                    disabled={bulkUpdating}
                                    className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
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
