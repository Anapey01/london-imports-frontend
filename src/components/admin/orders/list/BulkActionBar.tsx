'use client';

import { AnimatePresence, motion } from 'framer-motion';

const statusLabel = (s: string) => {
    switch (s) {
        case 'PENDING': return 'Pending';
        case 'NEW_ORDERS': return 'New Orders';
        case 'WAREHOUSE': return 'Processing';
        case 'SHIPPING': return 'Shipping';
        case 'COMPLETED': return 'Completed';
        case 'CANCELLED': return 'Cancelled';
        default: return s;
    }
};

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
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl"
                >
                    {bulkUpdating && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/10 overflow-hidden">
                            <motion.div 
                                className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(bulkProgress / bulkTotal) * 100}%` }}
                                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                            />
                        </div>
                    )}
                    <div className="bg-slate-950 shadow-2xl px-12 py-8 flex flex-wrap items-center justify-between gap-8 border border-white/10 backdrop-blur-xl">
                        <div className="flex items-center gap-6">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center text-white text-[12px] font-black">
                                {selectedCount}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                                    {bulkUpdating ? `Processing ${bulkProgress}/${bulkTotal}` : 'Orders Selected'}
                                </p>
                                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">
                                    {bulkUpdating ? 'Updating system...' : 'Actions ready'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {statusFilter === 'NEW_ORDERS' && (
                                <button
                                    onClick={() => onBulkStatus('OPEN_FOR_BATCH')}
                                    disabled={bulkUpdating}
                                    className="px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all bg-white text-slate-950 hover:bg-emerald-500 hover:text-white"
                                >
                                    MARK AS PROCESSING
                                </button>
                            )}

                            {(statusFilter === 'WAREHOUSE' || statusFilter === 'All') && (
                                <button
                                    onClick={() => onBulkStatus('IN_TRANSIT')}
                                    disabled={bulkUpdating}
                                    className="px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all bg-white text-slate-950 hover:bg-emerald-500 hover:text-white"
                                >
                                    MARK AS SHIPPED
                                </button>
                            )}

                            {(statusFilter === 'SHIPPING' || statusFilter === 'All') && (
                                <>
                                    <button
                                        onClick={() => onBulkStatus('ARRIVED')}
                                        disabled={bulkUpdating}
                                        className="px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all bg-white text-slate-950 hover:bg-emerald-500 hover:text-white"
                                    >
                                        MARK AS ARRIVED
                                    </button>
                                    <button
                                        onClick={() => onBulkStatus('OUT_FOR_DELIVERY')}
                                        disabled={bulkUpdating}
                                        className="px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all bg-white text-slate-950 hover:bg-emerald-500 hover:text-white"
                                    >
                                        READY FOR DELIVERY
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => onBulkStatus('DELIVERED')}
                                disabled={bulkUpdating}
                                className="px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all bg-white text-slate-950 hover:bg-emerald-500 hover:text-white"
                            >
                                MARK AS DELIVERED
                            </button>

                            <button
                                onClick={onClearSelection}
                                className="px-6 py-3 text-[9px] font-black uppercase tracking-widest transition-all text-slate-500 hover:text-white"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
