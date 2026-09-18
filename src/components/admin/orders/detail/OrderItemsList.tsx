'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CreditCard, ChevronDown } from 'lucide-react';
import { getImageUrl } from '@/lib/image';
import { OrderItem, OrderPayment } from '@/types/order';

interface OrderItemsListProps {
    items: OrderItem[];
    subtotal: string;
    deliveryFee: string;
    total: string;
    amountPaid: string;
    balanceDue: string;
    payments?: OrderPayment[];
    isDark: boolean;
}

export function OrderItemsList({
    items,
    subtotal,
    deliveryFee,
    total,
    amountPaid,
    balanceDue,
    payments,
    isDark
}: OrderItemsListProps) {
    const [isPaymentsExpanded, setIsPaymentsExpanded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setIsPaymentsExpanded(true);
        }
    }, []);

    return (
        <section className={`border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="p-4 sm:p-6 md:p-8 border-b border-inherit flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <FileText className="w-5 h-5 opacity-20" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Order Items</h2>
                </div>
                <span className="text-[10px] font-mono opacity-30 uppercase">{items.length} ITEMS TOTAL</span>
            </div>
            
            <div className="divide-y divide-inherit">
                {items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 group hover:bg-slate-500/5 transition-colors">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 overflow-hidden border border-inherit shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                            <Image
                                src={getImageUrl(item.image)}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-base sm:text-lg md:text-xl font-serif font-bold tracking-tight mb-2 leading-tight">{item.product_name}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                <span className="text-[10px] font-mono opacity-40 uppercase">COLOR: {item.color || 'STND'}</span>
                                <span className="text-[10px] font-mono opacity-40 uppercase">SIZE: {item.size || 'STND'}</span>
                            </div>
                        </div>
                        <div className="w-full sm:w-auto text-left sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-inherit flex sm:block justify-between items-baseline">
                            <p className="text-lg sm:text-xl md:text-2xl font-mono tracking-tighter mb-1">₵{parseFloat(item.price).toLocaleString()}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-20 italic">QUANTITY: {item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 sm:p-8 md:p-12 bg-slate-500/5 border-t border-inherit">
                <div className="max-w-md sm:ml-auto space-y-6">
                    <div className="grid grid-cols-2 gap-4 pb-6 border-b border-dashed border-inherit">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Subtotal</span>
                            <p className="text-base sm:text-lg font-mono tracking-tighter">₵{parseFloat(subtotal).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Shipping</span>
                            <p className="text-base sm:text-lg font-mono tracking-tighter">₵{parseFloat(deliveryFee).toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 block mb-2">Total Amount</span>
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tighter leading-none">
                                ₵{parseFloat(total).toLocaleString()}
                            </h3>
                        </div>
                        <div className="text-left sm:text-right space-y-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-inherit">
                            <div className="flex items-center gap-3 justify-between sm:justify-end">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Paid:</span>
                                <span className="text-sm font-mono text-emerald-500 font-bold">₵{parseFloat(amountPaid).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-3 justify-between sm:justify-end">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Due:</span>
                                <span className={`text-sm font-mono font-bold ${parseFloat(balanceDue) > 0 ? 'text-rose-500' : 'opacity-20'}`}>
                                    ₵{parseFloat(balanceDue).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {payments && payments.length > 0 && (
                <div className="border-t border-inherit bg-slate-500/[0.015]">
                    <button
                        type="button"
                        onClick={() => setIsPaymentsExpanded(!isPaymentsExpanded)}
                        className="w-full p-4 sm:p-6 md:p-8 flex items-center justify-between text-left cursor-pointer select-none group/header hover:bg-slate-500/5 transition-colors"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60 flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 opacity-60" />
                            Payment Records & Deposits ({payments.length})
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 lg:hidden">
                                {isPaymentsExpanded ? 'Compress' : 'Expand'}
                            </span>
                            <motion.div
                                animate={{ rotate: isPaymentsExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </motion.div>
                        </div>
                    </button>

                    <AnimatePresence initial={false}>
                        {isPaymentsExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
                                    <div className="divide-y divide-inherit border border-inherit rounded-lg overflow-hidden">
                                        {payments.map((p) => {
                                            const methodLabel = p.payment_method === 'CASH' ? 'Cash' 
                                                : p.payment_method === 'BANK_TRANSFER' ? 'Bank Transfer'
                                                : p.payment_method === 'CARD' ? 'Card'
                                                : 'Mobile Money';
                                            const dateStr = p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'Recorded';

                                            const isSuccess = p.state === 'SUCCESS' || p.state === 'CAPTURED';
                                            const isFailed = p.state === 'FAILED' || p.state === 'CANCELLED';

                                            return (
                                                <div 
                                                    key={p.id}
                                                    className={`p-3.5 sm:p-4 flex items-start justify-between gap-4 text-xs transition-colors ${
                                                        isDark ? 'bg-slate-950/20 hover:bg-slate-900/40' : 'bg-white hover:bg-slate-50/60'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                                                            isSuccess ? 'bg-emerald-500' : isFailed ? 'bg-slate-400 dark:bg-slate-600' : 'bg-amber-500'
                                                        }`} />
                                                        <div className="space-y-1 min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                                    {methodLabel}
                                                                </span>
                                                                {p.payment_type && (
                                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium lowercase">
                                                                        ({p.payment_type.toLowerCase()})
                                                                    </span>
                                                                )}
                                                                <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border font-semibold shrink-0 ${
                                                                    isSuccess 
                                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                                                                        : isFailed 
                                                                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700' 
                                                                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                                                }`}>
                                                                    {p.state}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 font-mono">
                                                                <span>{dateStr}</span>
                                                                {p.reference && (
                                                                    <span className="text-slate-500 dark:text-slate-400 truncate max-w-full select-all">
                                                                        Ref: {p.reference}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {p.notes && (
                                                                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic bg-slate-100/60 dark:bg-slate-800/40 border border-inherit rounded px-2 py-1 mt-1">
                                                                    &quot;{p.notes}&quot;
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className={`text-right shrink-0 whitespace-nowrap font-mono pt-0.5 ${
                                                        isSuccess 
                                                            ? 'font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400' 
                                                            : isFailed 
                                                                ? 'font-medium text-xs sm:text-sm text-slate-400 dark:text-slate-500 line-through' 
                                                                : 'font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300'
                                                    }`}>
                                                        {isSuccess ? '+' : ''}₵{Number(p.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </section>
    );
}
