'use client';

import { ShieldCheck, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import type { CartItem } from '@/stores/cartStore';
import type { OrderItem, ExtendedCart } from '@/types';

interface OrderSummaryProps {
    currentOrderData: {
        items?: (CartItem | OrderItem)[];
        subtotal: number;
        delivery_fee: number;
        total: number;
        amount_paid?: number;
    };
    selectedItemIds: Set<string>;
    checkoutOrder: ExtendedCart | null;
    orderNumberParam: string | null;
    paymentAmount: number;
}

const OrderSummary = ({
    currentOrderData,
    selectedItemIds,
    checkoutOrder,
    orderNumberParam,
    paymentAmount
}: OrderSummaryProps) => {
    return (
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 dark:border-slate-800/50 sticky top-32">
            <h2 className="text-[12px] font-black text-slate-400 mb-10 tracking-[0.4em] uppercase">Order Summary</h2>

            <div className="space-y-6 mb-10 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {(currentOrderData.items || [])
                    .filter((item: CartItem | OrderItem) => checkoutOrder || orderNumberParam ? true : selectedItemIds.has(item.id))
                    .map((item: CartItem | OrderItem) => (
                        <div key={item.id} className="flex justify-between items-start text-sm group">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                <span className="text-[10px] font-black text-slate-300 mt-1 tabular-nums">
                                    0{item.quantity}
                                </span>
                                <span className="text-slate-600 font-medium group-hover:text-slate-950 transition-colors truncate">
                                    {item.product?.name}
                                </span>
                            </div>
                            <span className="font-bold text-slate-950 tabular-nums ml-4">
                                {formatPrice(item.total_price)}
                            </span>
                        </div>
                    ))}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-8 space-y-4">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-slate-950 tabular-nums">
                        {(() => {
                            if (checkoutOrder || orderNumberParam) return formatPrice(currentOrderData.subtotal || 0);
                            const selSubtotal = (currentOrderData.items || [])
                                .filter((i: CartItem | OrderItem) => selectedItemIds.has(i.id))
                                .reduce((sum: number, i: CartItem | OrderItem) => sum + Number(i.total_price || 0), 0);
                            return formatPrice(selSubtotal);
                        })()}
                    </span>
                </div>
                
                <div className="pt-2 flex justify-between items-end">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pb-1.5">Total Amount</span>
                    <span className="text-3xl font-black text-slate-950 tracking-tight tabular-nums">
                        {(() => {
                            if (checkoutOrder || orderNumberParam) return formatPrice(currentOrderData.total || 0);
                            const selSubtotal = (currentOrderData.items || [])
                                .filter((i: CartItem | OrderItem) => selectedItemIds.has(i.id))
                                .reduce((sum: number, i: CartItem | OrderItem) => sum + Number(i.total_price || 0), 0);
                            return formatPrice(selSubtotal);
                        })()}
                    </span>
                </div>

                <div className="bg-slate-950 dark:bg-white rounded-2xl p-5 mt-6 flex justify-between items-center text-white dark:text-slate-950 shadow-xl shadow-slate-950/10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Due Now</span>
                    <span className="text-xl font-black tabular-nums">{formatPrice(paymentAmount)}</span>
                </div>
            </div>

            {/* EDITORIAL TRUST SECTION */}
            <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-default">
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-950">Verified</span>
                </div>
                <div className="w-[1px] h-4 bg-slate-200" />
                <div className="flex flex-col items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-950">Secure</span>
                </div>
                <div className="w-[1px] h-4 bg-slate-200" />
                <div className="flex flex-col items-center gap-2">
                    <Truck className="w-4 h-4 text-slate-950" strokeWidth={1.5} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-950">Global</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
