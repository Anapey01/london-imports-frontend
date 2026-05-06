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
    selectedItemIds: string[];
    checkoutOrder: ExtendedCart | null;
    orderNumberParam: string | null;
    paymentAmount: number;
    onSubmit: () => void;
    isSubmitting: boolean;
    isMerging?: boolean;
    activeStep: number;
}

const OrderSummary = ({
    currentOrderData,
    selectedItemIds,
    checkoutOrder,
    orderNumberParam,
    paymentAmount,
    onSubmit,
    isSubmitting,
    isMerging,
    activeStep
}: OrderSummaryProps) => {
    const subtotalValue = checkoutOrder || orderNumberParam ? Number(currentOrderData.subtotal || 0) : (currentOrderData.items || [])
        .filter((i: CartItem | OrderItem) => {
            if (selectedItemIds.length === 0) return true; // DEFAULT TO ALL
            return selectedItemIds.includes(i.id);
        })
        .reduce((sum: number, i: CartItem | OrderItem) => sum + (Number(i.unit_price || 0) * i.quantity), 0);

    const deliveryValue = Number(currentOrderData.delivery_fee || 0);
    const totalValue = Number(subtotalValue) + Number(deliveryValue);

    return (
        <div className="bg-surface-card p-6 sm:p-7 rounded-2xl border border-border-standard shadow-diffusion-lg sticky top-32">
            <h2 className="text-base font-black text-content-primary mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[11px] font-medium text-content-secondary">
                    <span>Items:</span>
                    <span className="tabular-nums font-bold text-content-primary">{formatPrice(subtotalValue)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-medium text-content-secondary">
                    <span>Shipping & handling:</span>
                    <span className="tabular-nums font-bold text-content-primary italic">{deliveryValue > 0 ? formatPrice(deliveryValue) : 'GHS 0.00'}</span>
                </div>
                <div className="pt-3 border-t border-border-standard">
                    <div className="flex justify-between text-base font-black text-content-primary">
                        <span>Order Total:</span>
                        <span className="tabular-nums text-brand-emerald">{formatPrice(totalValue)}</span>
                    </div>
                </div>
                {paymentAmount < totalValue && (
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-content-primary pt-2">
                        <span>Payment Due Now:</span>
                        <span className="tabular-nums">{formatPrice(paymentAmount)}</span>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <button
                    onClick={onSubmit}
                    disabled={isSubmitting || isMerging || (activeStep < 3 && !orderNumberParam)}
                    className={`w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${
                        isSubmitting || isMerging || (activeStep < 3 && !orderNumberParam)
                        ? 'bg-surface text-content-secondary cursor-not-allowed border border-border-standard'
                        : 'bg-content-primary text-surface hover:scale-[1.02] active:scale-[0.98] shadow-xl'
                    }`}
                >
                    {isMerging ? (
                        'Syncing...'
                    ) : isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    ) : (
                        'Place your order'
                    )}
                </button>

                <p className="text-[9px] text-content-secondary text-center leading-relaxed font-medium">
                    By placing your order, you agree to our <span className="underline cursor-pointer">Terms of Use</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                </p>
            </div>

            {/* Lean Security Trust */}
            <div className="mt-8 pt-6 border-t border-border-standard flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-content-secondary">Secure</span>
                </div>
                <div className="w-px h-3 bg-border-standard" />
                <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-content-secondary" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-content-secondary">Insured</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
