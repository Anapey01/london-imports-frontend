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
        case 'NEW_ORDERS': return 'New Orders';
        case 'WAREHOUSE': return 'Processing';
        case 'SHIPPING': return 'Shipping';
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
    return (
        <tr className={`group transition-colors duration-200 ${isSelected
                ? 'bg-slate-50'
                : 'bg-white hover:bg-slate-50/50'
            }`}
        >
            <td className="px-8 py-8">
                <button onClick={() => toggleSelect(order.id)}>
                    {isSelected
                        ? <CheckSquare className="w-4 h-4 text-slate-950" />
                        : <Square className="w-4 h-4 text-slate-200 group-hover:text-slate-400" />
                    }
                </button>
            </td>
            <td className="px-8 py-8">
                <div className="flex items-center gap-4">
                    <span className="font-mono text-[12px] font-black tracking-tighter text-slate-900">
                        #{order.order_number || order.id.slice(0, 8)}
                    </span>
                </div>
            </td>
            <td className="px-8 py-8">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center relative group-hover:border-slate-900 transition-all">
                    {order.thumbnail ? (
                        <Image 
                            src={getImageUrl(order.thumbnail)} 
                            alt="Order Preview" 
                            fill 
                            className="object-cover"
                        />
                    ) : (
                        <Package size={16} className="text-slate-200" />
                    )}
                </div>
            </td>
            <td className="px-8 py-8">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-slate-900 group-hover:text-slate-900 transition-all">
                        {order.customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-widest truncate text-slate-950">{order.customer.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate hidden sm:block italic">{order.customer.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-8 hidden lg:table-cell">
                <p className="text-[10px] font-black text-slate-400 uppercase tabular-nums">
                    {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }).toUpperCase()}
                </p>
            </td>
            <td className="px-8 py-8 hidden lg:table-cell">
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${getStatusColor(order.status)}`}>
                        {statusLabel(order.status)}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${getPaymentColor(order.payment_status)}`}>
                        {order.payment_status}
                    </span>
                </div>
            </td>
            <td className="px-8 py-8 text-right">
                <span className="text-[12px] font-black text-slate-950 tabular-nums">
                    ₵{(statusFilter === 'PENDING' ? Number(order.balance_due) : Number(order.total_amount)).toLocaleString()}
                </span>
            </td>
            <td className="px-8 py-8 text-right">
                <div className="flex justify-end items-center gap-6">
                    <div className="flex items-center gap-2 sm:gap-4 transition-all">
                        {(order.status === 'PROCESSING' || order.status === 'PAID' || order.status === 'OPEN_FOR_BATCH') && (
                            <button 
                                onClick={() => handleQuickUpdate(order.id, 'IN_TRANSIT', 'Ship to Ghana')}
                                className="hidden sm:block text-[9px] font-black uppercase tracking-widest px-4 py-2 border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all"
                            >
                                SHIP
                            </button>
                        )}
                        <Link
                            href={`/dashboard/admin/orders/${order.id}`}
                            className="p-4 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <Eye className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={() => handleDelete(order.id)}
                            className="p-4 text-slate-200 hover:text-red-600 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
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
