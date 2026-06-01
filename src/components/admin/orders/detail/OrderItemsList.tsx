import Image from 'next/image';
import { FileText } from 'lucide-react';
import { getImageUrl } from '@/lib/image';
import { OrderItem } from '@/types/order';

interface OrderItemsListProps {
    items: OrderItem[];
    subtotal: string;
    deliveryFee: string;
    total: string;
    amountPaid: string;
    balanceDue: string;
    isDark: boolean;
}

export function OrderItemsList({
    items,
    subtotal,
    deliveryFee,
    total,
    amountPaid,
    balanceDue,
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
        </section>
    );
}
