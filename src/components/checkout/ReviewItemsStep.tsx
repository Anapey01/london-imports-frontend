'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, cleanProductName } from '@/lib/format';
import { type CartItem } from '@/stores/cartStore';
import { type OrderItem } from '@/types';

type CheckoutViewData = {
    items: (CartItem | OrderItem)[]; 
    subtotal: number;
    total: number;
    delivery_fee: number;
    order_number?: string;
    id?: string;
    amount_paid?: number;
};

interface ReviewItemsStepProps {
    activeStep: number;
    currentOrderData: CheckoutViewData;
    selectedItemIds: string[];
    checkoutOrder: unknown;
    orderNumberParam: string | null;
    isLoading: boolean;
    onSubmit: () => void;
}

export default function ReviewItemsStep({
    activeStep,
    currentOrderData,
    selectedItemIds,
    checkoutOrder,
    orderNumberParam,
    isLoading,
    onSubmit,
}: ReviewItemsStepProps) {
    return (
        <div className={`bg-surface rounded-2xl border transition-all duration-500 overflow-hidden ${activeStep === 3 ? 'border-emerald-500/30 shadow-diffusion-lg ring-1 ring-emerald-500/10' : 'border-border-standard opacity-90'}`}>
            <div className="flex items-center gap-4 p-6 sm:p-7 border-b border-border-standard">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500 ${activeStep === 3 ? 'bg-content-primary text-surface scale-110 shadow-lg' : 'bg-surface border border-border-standard text-content-secondary'}`}>
                    3
                </div>
                <h2 className={`font-semibold uppercase tracking-widest text-[11px] transition-colors ${activeStep === 3 ? 'text-content-primary' : 'text-content-secondary'}`}>
                    Review items and shipping
                </h2>
            </div>

            <div className={`transition-all duration-500 ease-in-out ${activeStep === 3 ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="p-6 sm:p-7 space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        {(currentOrderData.items || [])
                            .filter((item: CartItem | OrderItem) => {
                                if (checkoutOrder || orderNumberParam) return true;
                                if (selectedItemIds.length === 0) return true;
                                return selectedItemIds.includes(item.id);
                            })
                            .map((item: CartItem | OrderItem) => (
                                <div key={item.id} className="flex gap-4 items-center p-4 bg-surface border border-border-standard rounded-xl">
                                    <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center border border-border-standard p-1 relative">
                                        {(item.product.image) && (
                                            <Image 
                                                src={item.product.image} 
                                                alt={item.product.name}
                                                fill
                                                className="object-contain rounded-md"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-semibold text-content-primary truncate">{cleanProductName(item.product)}</p>
                                        <div className="flex flex-wrap gap-2 mt-0.5">
                                            {item.selected_size && (
                                                <span className="text-[9px] font-bold text-content-secondary bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded uppercase">
                                                    Size: {item.selected_size}
                                                </span>
                                            )}
                                            {item.selected_color && (
                                                <span className="text-[9px] font-bold text-content-secondary bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded uppercase">
                                                    Color: {item.selected_color}
                                                </span>
                                            )}
                                            <span className="text-[9px] text-content-secondary font-bold">Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] font-semibold text-content-primary">{formatPrice(item.total_price)}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                    
                    <div className="pt-6 border-t border-border-standard flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600">Ready for shipping</span>
                        </div>
                        <div className="flex flex-col items-center sm:items-end gap-2.5 w-full sm:w-auto max-w-md">
                            <button 
                                type="button"
                                onClick={() => onSubmit()}
                                disabled={isLoading}
                                className="px-10 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[11px] uppercase tracking-[0.2em] font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 disabled:scale-100 w-full sm:w-auto text-center"
                            >
                                {isLoading ? 'Processing...' : 'Place your order'}
                            </button>
                            <p className="text-[10px] text-content-secondary text-center sm:text-right leading-relaxed font-medium">
                                By making payment, you agree to our{' '}
                                <Link href="/terms" className="underline hover:text-content-primary transition-colors">
                                    Terms
                                </Link>
                                ,{' '}
                                <Link href="/privacy" className="underline hover:text-content-primary transition-colors">
                                    Privacy Policy
                                </Link>
                                ,{' '}
                                <Link href="/refunds" className="underline hover:text-content-primary transition-colors">
                                    Refund Policy
                                </Link>
                                , and{' '}
                                <Link href="/shipping-policy" className="underline hover:text-content-primary transition-colors">
                                    Shipping Policy
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
