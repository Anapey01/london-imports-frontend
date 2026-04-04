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
        <div className="bg-primary-surface/40 p-6 sm:p-7 rounded-2xl shadow-diffusion-xl border border-primary-surface/40 backdrop-blur-3xl sticky top-32 overflow-hidden group/summary">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover/summary:opacity-[0.05] transition-all duration-700 pointer-events-none">
                <div className="text-[100px] font-serif font-black leading-none select-none">M</div>
            </div>
            
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-primary-surface/20">
                <h2 className="text-[9px] font-black nuclear-text tracking-[0.4em] uppercase opacity-40">Sourcing Manifest</h2>
                <span className="text-[7px] font-black nuclear-text opacity-20 tabular-nums">v2.4.LI</span>
            </div>

            <div className="space-y-5 mb-8 max-h-52 overflow-y-auto pr-3 custom-scrollbar">
                {(currentOrderData.items || [])
                    .filter((item: CartItem | OrderItem) => checkoutOrder || orderNumberParam ? true : selectedItemIds.has(item.id))
                    .map((item: CartItem | OrderItem) => (
                        <div key={item.id} className="flex justify-between items-start text-xs group">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                <span className="text-[9px] font-black nuclear-text opacity-20 mt-0.5 tabular-nums">
                                    {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                                </span>
                                <span className="nuclear-text opacity-60 font-medium group-hover:opacity-100 transition-all truncate">
                                    {item.product?.name}
                                </span>
                            </div>
                            <span className="font-black nuclear-text tabular-nums ml-4 opacity-80 group-hover:opacity-100 transition-opacity">
                                {formatPrice(item.total_price)}
                            </span>
                        </div>
                    ))}
            </div>

            <div className="border-t border-primary-surface/20 pt-8 space-y-4">
                <div className="flex justify-between text-[9px] nuclear-text opacity-40 font-black uppercase tracking-[0.2em]">
                    <span>Sourcing Subtotal</span>
                    <span className="nuclear-text tabular-nums opacity-100">
                        {(() => {
                            if (checkoutOrder || orderNumberParam) return formatPrice(currentOrderData.subtotal || 0);
                            const selSubtotal = (currentOrderData.items || [])
                                .filter((i: CartItem | OrderItem) => selectedItemIds.has(i.id))
                                .reduce((sum: number, i: CartItem | OrderItem) => sum + Number(i.total_price || 0), 0);
                            return formatPrice(selSubtotal);
                        })()}
                    </span>
                </div>
                
                <div className="flex justify-between text-[9px] nuclear-text opacity-40 font-black uppercase tracking-[0.2em]">
                    <span>Logistics Allocation</span>
                    <span className="nuclear-text tabular-nums opacity-100 italic">Gratis</span>
                </div>
                
                <div className="pt-3 flex justify-between items-end border-b border-primary-surface/10 pb-6">
                    <span className="text-[9px] nuclear-text opacity-40 font-black uppercase tracking-[0.3em] pb-1">Total Amount</span>
                    <span className="text-2xl font-serif font-black nuclear-text tracking-tighter leading-none tabular-nums">
                        {(() => {
                            if (checkoutOrder || orderNumberParam) return formatPrice(currentOrderData.total || 0);
                            const selSubtotal = (currentOrderData.items || [])
                                .filter((i: CartItem | OrderItem) => selectedItemIds.has(i.id))
                                .reduce((sum: number, i: CartItem | OrderItem) => sum + Number(i.total_price || 0), 0);
                            return formatPrice(selSubtotal);
                        })()}
                    </span>
                </div>

                <div className="pt-5 flex justify-between items-center group/due">
                    <div className="flex items-center gap-2.5">
                        <div className="w-[3px] h-[3px] bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] nuclear-text opacity-40 group-hover/due:opacity-100 group-hover/due:text-emerald-500 transition-all">Due Now</span>
                    </div>
                    <span className="text-xl font-black nuclear-text tabular-nums tracking-tight">{formatPrice(paymentAmount)}</span>
                </div>
            </div>

            {/* LEAN TRUST SECTION */}
            <div className="mt-10 pt-8 border-t border-primary-surface/10 flex items-center justify-between opacity-10 grayscale hover:opacity-40 transition-all duration-700 cursor-default">
                <div className="flex flex-col items-center gap-2 flex-1">
                    <ShieldCheck className="w-3.5 h-3.5 nuclear-text" strokeWidth={2} />
                    <span className="text-[6px] font-black uppercase tracking-[0.4em] nuclear-text text-center">Verified</span>
                </div>
                <div className="w-[1px] h-3 bg-primary-surface/40" />
                <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-3 h-3 rounded-full border border-current flex items-center justify-center opacity-40">
                        <div className="w-[1.5px] h-[1.5px] bg-current rounded-full" />
                    </div>
                    <span className="text-[6px] font-black uppercase tracking-[0.4em] nuclear-text text-center">SECURE</span>
                </div>
                <div className="w-[1px] h-3 bg-primary-surface/40" />
                <div className="flex flex-col items-center gap-2 flex-1">
                    <Truck className="w-3.5 h-3.5 nuclear-text" strokeWidth={2} />
                    <span className="text-[6px] font-black uppercase tracking-[0.4em] nuclear-text text-center">GLOBAL</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
