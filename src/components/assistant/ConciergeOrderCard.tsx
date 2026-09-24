'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Truck, ArrowRight, CreditCard, ExternalLink } from 'lucide-react';
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

    const isPaid = order.state === 'PAID' || order.state === 'DELIVERED' || order.state === 'COMPLETED';
    const hasBalanceDue = order.balance_due > 0 || order.state === 'PENDING_PAYMENT';
    const isTransit = order.state === 'IN_TRANSIT' || order.state === 'OUT_FOR_DELIVERY';

    const getBadgeStyle = () => {
        if (hasBalanceDue) {
            return 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
        }
        if (isTransit) {
            return 'bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-800';
        }
        if (isPaid) {
            return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
        }
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    };

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
        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left">
            {/* Top Bar: Order Reference + Status Badge */}
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 min-w-0">
                    <Package className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-mono font-bold text-xs sm:text-[13px] text-slate-950 dark:text-white truncate">
                        #{order.order_number}
                    </span>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0 ${getBadgeStyle()}`}>
                    {hasBalanceDue ? (order.balance_due > 0 ? `Due: ${formatPrice(order.balance_due)}` : 'Pending Payment') : order.state_display}
                </span>
            </div>


            {/* Middle: Items summary & Delivery Window */}
            <div className="py-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {order.items && order.items.length > 0 ? (
                    <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {order.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                    </div>
                ) : (
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                        {order.items_count || 1} item{((order.items_count || 1) > 1) ? 's' : ''} in shipment
                    </div>
                )}

                {order.delivery_window && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <Truck className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span>Delivery: {order.delivery_window}</span>
                    </div>
                )}

                {/* Financial Ledger */}
                <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500">Total: <strong className="text-slate-900 dark:text-white font-semibold">{formatPrice(order.total)}</strong></span>
                    {hasBalanceDue && order.balance_due > 0 && (
                        <span className="font-bold text-amber-700 dark:text-amber-400">
                            Balance Due: {formatPrice(order.balance_due)}
                        </span>
                    )}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                {hasBalanceDue && (
                    <button
                        type="button"
                        onClick={handlePayBalance}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                    >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{order.balance_due > 0 ? `Pay Balance (${formatPrice(order.balance_due)})` : 'Complete Payment'}</span>
                        <ArrowRight className="w-3 h-3" />
                    </button>

                )}

                <button
                    type="button"
                    onClick={handleTrack}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 active:scale-95 text-white text-[11px] font-semibold transition-all shadow-2xs cursor-pointer"
                >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Live</span>
                </button>

                <Link
                    href={`/orders/${order.order_number}`}
                    onClick={() => onCloseDrawer?.()}
                    className="inline-flex items-center justify-center p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                    title="View Full Order Details"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
}
