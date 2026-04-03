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
        <div className="bg-white p-8 rounded-2xl shadow-diffusion border border-slate-100/50 sticky top-32">
            <h2 className="text-[10px] font-bold text-slate-900 mb-8 tracking-[0.3em] uppercase opacity-50">Order Summary</h2>

            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {(currentOrderData.items || [])
                    .filter((item: CartItem | OrderItem) => checkoutOrder || orderNumberParam ? true : selectedItemIds.has(item.id))
                    .map((item: CartItem | OrderItem) => (
                        <div key={item.id} className="flex justify-between items-start text-xs group">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                <span className="text-[9px] font-bold text-slate-300 mt-0.5 tabular-nums">
                                    0{item.quantity}
                                </span>
                                <span className="text-slate-500 font-medium group-hover:text-slate-950 transition-colors truncate">
                                    {item.product?.name}
                                </span>
                            </div>
                            <span className="font-bold text-slate-950 tabular-nums ml-4">
                                {formatPrice(item.total_price)}
                            </span>
                        </div>
                    ))}
            </div>

            <div className="border-t border-slate-50 pt-8 space-y-4">
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
                
                <div className="pt-2 flex justify-between items-end border-b border-slate-50 pb-6">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pb-1">Total Amount</span>
                    <span className="text-xl font-bold text-[#006B5A] tracking-tight tabular-nums">
                        {(() => {
                            if (checkoutOrder || orderNumberParam) return formatPrice(currentOrderData.total || 0);
                            const selSubtotal = (currentOrderData.items || [])
                                .filter((i: CartItem | OrderItem) => selectedItemIds.has(i.id))
                                .reduce((sum: number, i: CartItem | OrderItem) => sum + Number(i.total_price || 0), 0);
                            return formatPrice(selSubtotal);
                        })()}
                    </span>
                </div>

                <div className="pt-4 flex justify-between items-center group/due">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#006B5A] rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/due:text-[#006B5A] transition-colors">Due Now</span>
                    </div>
                    <span className="text-lg font-black text-slate-950 tabular-nums">{formatPrice(paymentAmount)}</span>
                </div>
            </div>

            {/* DECONSTRUCTED TRUST SECTION */}
            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-default">
                <div className="flex flex-col items-center gap-2 flex-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-900" strokeWidth={1} />
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-950">Verified</span>
                </div>
                <div className="w-[1px] h-3 bg-slate-100" />
                <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-900 flex items-center justify-center">
                        <div className="w-[3px] h-[3px] bg-slate-900 rounded-full" />
                    </div>
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-950">Secure</span>
                </div>
                <div className="w-[1px] h-3 bg-slate-100" />
                <div className="flex flex-col items-center gap-2 flex-1">
                    <Truck className="w-3.5 h-3.5 text-slate-900" strokeWidth={1} />
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-950">Global</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
