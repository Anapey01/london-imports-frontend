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
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-light text-gray-900 mb-6 tracking-tight">Order Summary</h2>

            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {(currentOrderData.items || [])
                    .filter((item: CartItem | OrderItem) => checkoutOrder || orderNumberParam ? true : selectedItemIds.has(item.id))
                    .map((item: CartItem | OrderItem) => (
                        <div key={item.id} className="flex justify-between items-center text-sm group">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                                    {item.quantity}
                                </span>
                                <span className="text-gray-600 group-hover:text-gray-900 transition-colors truncate p-1">
                                    {item.product?.name}
                                </span>
                            </div>
                            <span className="font-medium text-gray-900 whitespace-nowrap ml-4">
                                {formatPrice(item.total_price)}
                            </span>
                        </div>
                    ))}
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-gray-500 font-light">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">
                        {(() => {
                            if (checkoutOrder || orderNumberParam) return formatPrice(currentOrderData.subtotal || 0);
                            const selSubtotal = (currentOrderData.items || [])
                                .filter((i: CartItem | OrderItem) => selectedItemIds.has(i.id))
                                .reduce((sum: number, i: CartItem | OrderItem) => sum + Number(i.total_price || 0), 0);
                            return formatPrice(selSubtotal);
                        })()}
                    </span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                    <span className="text-lg text-gray-900 font-medium pb-1">Total Order Value</span>
                    <span className="text-2xl sm:text-3xl font-light text-gray-900 tracking-tight">
                        {(() => {
                            if (checkoutOrder || orderNumberParam) return formatPrice(currentOrderData.total || 0);
                            const selSubtotal = (currentOrderData.items || [])
                                .filter((i: CartItem | OrderItem) => selectedItemIds.has(i.id))
                                .reduce((sum: number, i: CartItem | OrderItem) => sum + Number(i.total_price || 0), 0);
                            return formatPrice(selSubtotal);
                        })()}
                    </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mt-4 flex justify-between items-center text-gray-900">
                    <span className="font-medium">Due Now</span>
                    <span className="font-bold text-lg sm:text-xl">{formatPrice(paymentAmount)}</span>
                </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-2 border border-gray-100">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gray-900" />
                    <span>Payment secured by Paystack</span>
                </div>
                <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-900" />
                    <span>Delivery to your doorstep</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
