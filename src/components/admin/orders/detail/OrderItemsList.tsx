import Image from 'next/image';
import { FileText, CreditCard } from 'lucide-react';
import { getImageUrl } from '@/lib/image';
import { OrderItem, OrderPayment } from '@/types/order';

interface OrderItemsListProps {
    items: OrderItem[];
    subtotal: string;
    deliveryFee: string;
    total: string;
    amountPaid: string;
    balanceDue: string;
    payments?: OrderPayment[];
    isDark: boolean;
}

export function OrderItemsList({
    items,
    subtotal,
    deliveryFee,
    total,
    amountPaid,
    balanceDue,
    payments,
    isDark
}: OrderItemsListProps) {
    return (
        <section className={`border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="p-8 border-b border-inherit flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <FileText className="w-5 h-5 opacity-20" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Order Items</h2>
                </div>
                <span className="text-[10px] font-mono opacity-30 uppercase">{items.length} ITEMS TOTAL</span>
            </div>
            
            <div className="divide-y divide-inherit">
                {items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 p-6 sm:p-8 group hover:bg-slate-500/5 transition-colors">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden border border-inherit shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                            <Image
                                src={getImageUrl(item.image)}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-lg sm:text-xl font-serif font-bold tracking-tight mb-2 leading-none">{item.product_name}</p>
                            <div className="flex gap-4">
                                <span className="text-[10px] font-mono opacity-40 uppercase">COLOR: {item.color || 'STND'}</span>
                                <span className="text-[10px] font-mono opacity-40 uppercase">SIZE: {item.size || 'STND'}</span>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto text-left sm:text-right pt-4 sm:pt-0 border-t sm:border-t-0 border-inherit">
                            <p className="text-xl sm:text-2xl font-mono tracking-tighter mb-1">₵{parseFloat(item.price).toLocaleString()}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-20 italic">QUANTITY: {item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-12 bg-slate-500/5 border-t border-inherit">
                <div className="max-w-md ml-auto space-y-6">
                    <div className="grid grid-cols-2 gap-4 pb-6 border-b border-dashed border-inherit">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Subtotal</span>
                            <p className="text-lg font-mono tracking-tighter">₵{parseFloat(subtotal).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Shipping</span>
                            <p className="text-lg font-mono tracking-tighter">₵{parseFloat(deliveryFee).toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 block mb-2">Total Amount</span>
                            <h3 className="text-5xl font-serif font-bold tracking-tighter leading-none">
                                ₵{parseFloat(total).toLocaleString()}
                            </h3>
                        </div>
                        <div className="text-right space-y-2">
                            <div className="flex items-center gap-3 justify-end">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Paid:</span>
                                <span className="text-sm font-mono text-emerald-500 font-bold">₵{parseFloat(amountPaid).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-3 justify-end">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Due:</span>
                                <span className={`text-sm font-mono font-bold ${parseFloat(balanceDue) > 0 ? 'text-rose-500' : 'opacity-20'}`}>
                                    ₵{parseFloat(balanceDue).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {payments && payments.length > 0 && (
                <div className="p-8 sm:p-10 border-t border-inherit bg-slate-500/[0.02]">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5" />
                            Payment Records & Deposits ({payments.length})
                        </span>
                    </div>
                    <div className="space-y-2">
                        {payments.map((p) => {
                            const methodLabel = p.payment_method === 'CASH' ? 'Cash' 
                                : p.payment_method === 'BANK_TRANSFER' ? 'Bank Transfer'
                                : p.payment_method === 'CARD' ? 'Card'
                                : 'Mobile Money';
                            const dateStr = p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'Recorded';

                            return (
                                <div 
                                    key={p.id}
                                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                                        isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-100 shadow-xs'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {methodLabel}
                                                </span>
                                                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                                                    {p.state}
                                                </span>
                                                {p.payment_type && (
                                                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                                        {p.payment_type}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] opacity-40 font-mono mt-0.5">
                                                <span>{dateStr}</span>
                                                {p.reference && <span>• Ref: {p.reference}</span>}
                                            </div>
                                            {p.notes && (
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-1">
                                                    "{p.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                                        +₵{Number(p.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}
