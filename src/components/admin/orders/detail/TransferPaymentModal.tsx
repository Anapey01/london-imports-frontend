import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
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
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`w-full max-w-xl border p-12 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-2xl'}`}
            >
                <h2 className="text-4xl font-serif font-bold tracking-tighter mb-2">Transfer Payment</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-12">Transfer balance between orders</p>
                
                <div className="space-y-10">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Target Reference</label>
                        <select
                            value={transferData.target_order_id}
                            onChange={(e) => setTransferData({ ...transferData, target_order_id: e.target.value })}
                            className="w-full p-4 bg-slate-500/5 border border-inherit text-sm font-bold outline-none focus:border-pink-500 transition-all"
                        >
                            <option value="">SELECT DESTINATION ORDER</option>
                            {customerOrders.map(o => (
                                <option key={o.id} value={o.id}>
                                    #{o.order_number} - ₵{parseFloat(o.balance_due).toLocaleString()} Due
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Transfer Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-serif italic opacity-40">₵</span>
                            <input
                                type="number"
                                value={transferData.amount}
                                onChange={(e) => setTransferData({ ...transferData, amount: parseFloat(e.target.value) || 0 })}
                                className="w-full p-4 pl-10 bg-slate-500/5 border border-inherit text-2xl font-mono tracking-tighter outline-none focus:border-pink-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Reason / Notes</label>
                        <textarea
                            value={transferData.reason}
                            onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                            placeholder="ADMIN OVERRIDE DIRECTIVE..."
                            rows={3}
                            className="w-full p-4 bg-slate-500/5 border border-inherit text-[10px] font-mono uppercase tracking-widest outline-none focus:border-pink-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-inherit">
                    <button 
                        onClick={() => setIsTransferModalOpen(false)}
                        className="px-8 py-3 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"
                    >
                        Abort
                    </button>
                    <button 
                        onClick={handleTransferPayment}
                        disabled={updating || !transferData.target_order_id || transferData.amount <= 0}
                        className="px-8 py-3 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 disabled:opacity-30 transition-all flex items-center gap-2"
                    >
                        {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        Execute Transfer
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
