import { History as OrderHistoryIcon } from 'lucide-react';
import { OrderDetail } from '@/types/order';

interface ActivityLogProps {
    order: OrderDetail;
    isDark: boolean;
}

export function ActivityLog({ order, isDark }: ActivityLogProps) {
    return (
        <section className={`p-8 border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-10">
                <OrderHistoryIcon className="w-4 h-4 opacity-20" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Activity Log</h2>
            </div>
            
            <div className="space-y-10 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-inherit">
                <div className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-slate-950 dark:border-slate-950 bg-emerald-500 z-10" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 block mb-1">State: Active</span>
                    <p className="text-sm font-bold uppercase tracking-widest">{order.status.replace(/_/g, ' ')}</p>
                    <p className="text-[10px] opacity-30 mt-1 uppercase font-mono">Synced via London Hub Control</p>
                </div>
                <div className="relative pl-8 opacity-40">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-slate-950 dark:border-slate-950 bg-slate-500 z-10" />
                    <span className="text-[9px] font-black uppercase tracking-widest block mb-1">Event: Order Created</span>
                    <p className="text-sm font-bold uppercase tracking-widest">Order Created</p>
                    <p className="text-[10px] mt-1 font-mono">{new Date(order.created_at).toLocaleString()}</p>
                </div>
            </div>
        </section>
    );
}
