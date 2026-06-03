import { Terminal, CreditCard, ArrowRightLeft, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface AdminActionsPanelProps {
    updating: boolean;
    manualReference: string;
    setManualReference: (ref: string) => void;
    handleMarkAsPaid: () => void;
    openTransferModal: () => void;
    handleManualSync: () => void;
    handleUpdateStatus: (status: string) => void;
    isDark: boolean;
}

export function AdminActionsPanel({
    updating,
    manualReference,
    setManualReference,
    handleMarkAsPaid,
    openTransferModal,
    handleManualSync,
    handleUpdateStatus,
    isDark
}: AdminActionsPanelProps) {
    return (
        <section className={`border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="p-8 border-b border-inherit flex items-center gap-4">
                <Terminal className="w-5 h-5 opacity-20" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Admin Actions</h2>
            </div>
            
            <div className="p-8 space-y-4">
                
                
                <div className="grid grid-cols-2 gap-px bg-slate-800/10 dark:bg-white/10 border border-inherit">
                    <button 
                        onClick={handleMarkAsPaid}
                        className="p-6 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-white/5 flex flex-col gap-3 group transition-all"
                    >
                        <CreditCard className="w-5 h-5 text-purple-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-left leading-tight group-hover:translate-x-1 transition-transform">
                            Mark as <br /> Paid
                        </span>
                    </button>
                    <button 
                        onClick={openTransferModal}
                        className="p-6 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-white/5 flex flex-col gap-3 group transition-all border-l border-inherit"
                    >
                        <ArrowRightLeft className="w-5 h-5 text-blue-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-left leading-tight group-hover:translate-x-1 transition-transform">
                            Transfer <br /> Payment
                        </span>
                    </button>
                </div>

                <div className="pt-4 space-y-4">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-20 block ml-2 mb-2">Paystack Re-Sync</span>
                    <div className="space-y-3">
                        <input 
                            value={manualReference}
                            onChange={(e) => setManualReference(e.target.value)}
                            placeholder="PASTE PAYSTACK REFERENCE"
                            className="w-full p-4 bg-slate-500/5 border border-inherit text-[10px] font-mono tracking-widest outline-none focus:border-pink-500 transition-all uppercase"
                        />
                        <button 
                            onClick={handleManualSync}
                            disabled={updating || !manualReference}
                            className="w-full p-4 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-pink-600 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                        >
                            {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                            Verify With Paystack
                        </button>
                    </div>
                </div>

                <div className="pt-4 space-y-2">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-20 block ml-2 mb-2">Protocol Transitions</span>
                    <div className="grid grid-cols-1 gap-2">
                        <button onClick={() => handleUpdateStatus('IN_TRANSIT')} className="w-full p-4 border border-inherit text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all text-left flex justify-between items-center group">
                            Mark as Shipped
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                        <button onClick={() => handleUpdateStatus('ARRIVED')} className="w-full p-4 border border-inherit text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all text-left flex justify-between items-center group">
                            Mark as Arrived
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                        <button onClick={() => handleUpdateStatus('DELIVERED')} className="w-full p-4 border border-inherit text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all text-left flex justify-between items-center group">
                            Mark as Delivered
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                        <button onClick={() => handleUpdateStatus('CANCELLED')} className="w-full p-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-left">
                            Cancel Order
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-slate-500/5 border-t border-inherit flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Security Verified</span>
            </div>
        </section>
    );
}
