import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Trash2, Package, CheckSquare, Square } from 'lucide-react';
import { getImageUrl } from '@/lib/image';

interface Order {
    id: string;
    order_number?: string;
    customer: {
        name: string;
        email: string;
        avatar?: string;
    };
    items_count: number;
    total_amount: number;
    status: string;
    state?: string;
    payment_status: string;
    amount_paid: number;
    balance_due: number;
    is_installment: boolean;
    created_at: string;
    thumbnail?: string;
    items?: Record<string, unknown>[];
}

export interface OrderRowProps {
    order: Order;
    isDark: boolean;
    isSelected: boolean;
    toggleSelect: (id: string) => void;
    getPaymentColor: (status: string) => string;
    statusFilter: string;
    handleQuickUpdate: (id: string, state: string, label: string) => void;
    handleDelete: (id: string) => void;
    getStatusColor: (status: string) => string;
}

const statusLabel = (s: string) => {
    switch (s) {
        case 'PENDING': return 'Pending';
        case 'PENDING_PAYMENT': return 'Pending Payment';
        case 'PAID': return 'Paid';
        case 'PROCESSING': return 'Processing';
        case 'NEW_ORDERS': return 'New Orders';
        case 'WAREHOUSE': return 'Processing';
        case 'SHIPPING': return 'Shipping';
        case 'IN_TRANSIT': return 'Shipping';
        case 'ARRIVED': return 'Arrived';
        case 'OUT_FOR_DELIVERY': return 'Out for Delivery';
        case 'COMPLETED': return 'Completed';
        case 'CANCELLED': return 'Cancelled';
        default: return s;
    }
};

const OrderRow = React.memo(({ 
    order, 
    isSelected, 
    toggleSelect, 
    getPaymentColor, 
    statusFilter,
    handleQuickUpdate, 
    handleDelete,
    getStatusColor
}: OrderRowProps) => {
    const isPaid = order.payment_status === 'PAID' || (Number(order.amount_paid || 0) >= Number(order.total_amount || 0) && Number(order.total_amount || 0) > 0);
    const displayStatus = (isPaid && (order.status === 'PENDING_PAYMENT' || order.status === 'PENDING' || order.status === 'DRAFT'))
        ? 'PROCESSING'
        : order.status;

    return (
        <tr className={`group transition-colors duration-200 ${isSelected
                ? 'bg-slate-50 dark:bg-slate-900/60'
                : 'bg-white dark:bg-slate-950 hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
            }`}
        >
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-6">
                <button onClick={() => toggleSelect(order.id)} className="min-w-[32px] min-h-[32px] flex items-center justify-center">
                    {isSelected
                        ? <CheckSquare className="w-4 h-4 text-slate-950 dark:text-white" />
                        : <Square className="w-4 h-4 text-slate-200 dark:text-slate-700 group-hover:text-slate-400" />
                    }
                </button>
            </td>
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-6">
                <div className="flex items-center gap-2 sm:gap-4">
                    <span className="font-mono text-[11px] sm:text-[12px] font-black tracking-tighter text-slate-900 dark:text-white">
                        #{order.order_number || order.id.slice(0, 8)}
                    </span>
                </div>
            </td>
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-6">
                <div className="w-9 h-9 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden flex items-center justify-center relative group-hover:border-slate-900 dark:group-hover:border-slate-600 transition-all shrink-0">
                    {order.thumbnail ? (
                        <Image 
                            src={getImageUrl(order.thumbnail)} 
                            alt="Order Preview" 
                            fill 
                            className="object-cover"
                        />
                    ) : (
                        <Package size={16} className="text-slate-200 dark:text-slate-700" />
                    )}
                </div>
            </td>
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-6">
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-slate-900 dark:group-hover:border-slate-600 group-hover:text-slate-900 dark:group-hover:text-white transition-all shrink-0">
                        {order.customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 max-w-[110px] sm:max-w-none">
                        <p className="text-[11px] font-black uppercase tracking-widest truncate text-slate-950 dark:text-white">{order.customer.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate hidden sm:block italic">{order.customer.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-6 hidden lg:table-cell">
                <p className="text-[10px] font-black text-slate-400 uppercase tabular-nums">
                    {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }).toUpperCase()}
                </p>
            </td>
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-6 hidden lg:table-cell">
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] ${getStatusColor(displayStatus)}`}>
                        {statusLabel(displayStatus)}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${getPaymentColor(order.payment_status)}`}>
                        {order.payment_status}
                    </span>
                </div>
            </td>
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-6 text-right">
                <span className="text-[11px] sm:text-[12px] font-black text-slate-950 dark:text-white tabular-nums whitespace-nowrap">
                    ₵{(statusFilter === 'PENDING' ? Number(order.balance_due) : Number(order.total_amount)).toLocaleString()}
                </span>
            </td>
            <td className="px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-6 text-right">
                <div className="flex justify-end items-center gap-2 sm:gap-6">
                    <div className="flex items-center gap-1.5 sm:gap-4 transition-all">
                        {(order.status === 'PROCESSING' || order.status === 'PAID' || order.status === 'OPEN_FOR_BATCH' || order.payment_status === 'PAID' || order.state === 'PAID' || order.state === 'OPEN_FOR_BATCH' || Number(order.amount_paid || 0) > 0) && (
                            <>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickUpdate(order.id, 'IN_TRANSIT', 'Ship to Ghana');
                                    }}
                                    className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest px-2.5 sm:px-4 py-1.5 sm:py-2 border border-slate-900 dark:border-slate-400 text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all cursor-pointer shrink-0"
                                >
                                    SHIP
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickUpdate(order.id, 'PENDING_PAYMENT', 'Mark as Unpaid');
                                    }}
                                    className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest px-2 sm:px-3 py-1.5 sm:py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-all cursor-pointer whitespace-nowrap shadow-sm shrink-0"
                                    title="Undo payment: reset to Unpaid (Pending Payment)"
                                >
                                    UNPAID
                                </button>
                            </>
                        )}
                        {order.status === 'IN_TRANSIT' && (
                            <button 
                                onClick={() => handleQuickUpdate(order.id, 'ARRIVED', 'Mark as Arrived in Ghana')}
                                className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest px-2.5 sm:px-4 py-1.5 sm:py-2 border border-slate-900 dark:border-slate-400 text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all shrink-0"
                            >
                                ARRIVE
                            </button>
                        )}
                        {order.status === 'ARRIVED' && (
                            <button 
                                onClick={() => handleQuickUpdate(order.id, 'OUT_FOR_DELIVERY', 'Ready for Delivery')}
                                className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest px-2.5 sm:px-4 py-1.5 sm:py-2 border border-slate-900 dark:border-slate-400 text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all shrink-0"
                            >
                                DISPATCH
                            </button>
                        )}
                        {order.status === 'OUT_FOR_DELIVERY' && (
                            <button 
                                onClick={() => handleQuickUpdate(order.id, 'DELIVERED', 'Deliver Order')}
                                className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest px-2.5 sm:px-4 py-1.5 sm:py-2 border border-slate-900 dark:border-slate-400 text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all shrink-0"
                            >
                                DELIVER
                            </button>
                        )}
                        <Link
                            href={`/dashboard/admin/orders/${order.id}`}
                            className="p-1.5 sm:p-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            aria-label="View order detail"
                        >
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        <button
                            onClick={() => handleDelete(order.id)}
                            className="p-1.5 sm:p-4 text-slate-300 hover:text-red-600 transition-colors"
                            aria-label="Delete order"
                        >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
});

OrderRow.displayName = 'OrderRow';

export default OrderRow;
export type { Order };
