'use client';

import { useRouter } from 'next/navigation';
import { Package, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/format';

export interface AssistantOrder {
    id?: string;
    order_number: string;
    state: string;
    state_display: string;
    total: number;
    amount_paid?: number;
    balance_due: number;
    items_count?: number;
    delivery_window?: string;
    items?: Array<{
        name: string;
        quantity: number;
        image?: string | null;
    }>;
}

export default function ConciergeOrderCard({
    order,
    onTrack,
    onCloseDrawer
}: {
    order: AssistantOrder;
    onTrack?: (orderNumber: string) => void;
    onCloseDrawer?: () => void;
}) {
    const router = useRouter();

    const hasBalanceDue = order.balance_due > 0 || order.state === 'PENDING_PAYMENT';

    const handlePayBalance = (e: React.MouseEvent) => {
        e.preventDefault();
        onCloseDrawer?.();
        router.push(`/checkout?order=${order.order_number}`);
    };

    const handleTrack = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onTrack) {
            onTrack(order.order_number);
        } else {
            onCloseDrawer?.();
            router.push(`/track?order=${order.order_number}`);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 sm:p-3.5 transition-all text-left">
            {/* Header: Order Ref + Quiet Pill */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                    <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={1.5} />
                    <span className="font-mono font-semibold text-xs text-slate-900 dark:text-white truncate">
                        #{order.order_number}
                    </span>
                </div>
                <span className="text-[10px] font-medium tracking-wide text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full shrink-0">
                    {hasBalanceDue ? (order.balance_due > 0 ? `GH₵ ${order.balance_due.toFixed(2)} due` : 'Pending') : order.state_display}
                </span>
            </div>

            {/* Content: Item names & Meta */}
            <div className="mt-2 space-y-1">
                {order.items && order.items.length > 0 ? (
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                        {order.items.map(it => `${it.name}${it.quantity > 1 ? ` (x${it.quantity})` : ''}`).join(', ')}
                    </div>
                ) : (
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {order.items_count || 1} item{((order.items_count || 1) > 1) ? 's' : ''}
                    </div>
                )}

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                    {order.delivery_window && <span>Est: {order.delivery_window}</span>}
                    {order.delivery_window && <span>•</span>}
                    <span>Total: {formatPrice(order.total)}</span>
                </div>
            </div>

            {/* Actions: Monochromatic, quiet buttons */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
                {hasBalanceDue ? (
                    <>
                        <button
                            type="button"
                            onClick={handlePayBalance}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 active:scale-[0.98] text-white text-xs font-medium transition-all cursor-pointer"
                        >
                            <span>Pay {order.balance_due > 0 ? formatPrice(order.balance_due) : 'Balance'}</span>
                            <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                            type="button"
                            onClick={handleTrack}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition-all cursor-pointer"
                        >
                            <span>Track</span>
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={handleTrack}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all cursor-pointer"
                    >
                        <span>Track Shipment</span>
                        <ArrowRight className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
}
