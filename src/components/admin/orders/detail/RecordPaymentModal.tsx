'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Loader2, X, CreditCard, Banknote, Smartphone, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { OrderDetail } from '@/types/order';

interface RecordPaymentModalProps {
    order: OrderDetail;
    updating: boolean;
    onRecordPayment: (data: {
        amount: number;
        payment_method: string;
        reference?: string;
        notes?: string;
        notify_customer: boolean;
    }) => Promise<void>;
    onClose: () => void;
    isDark: boolean;
}

export function RecordPaymentModal({
    order,
    updating,
    onRecordPayment,
    onClose,
    isDark
}: RecordPaymentModalProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const total = parseFloat(order.total || '0');
    const amountPaid = parseFloat(order.amount_paid || '0');
    const balanceDue = parseFloat(order.balance_due || '0');

    const [amount, setAmount] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('MOBILE_MONEY');
    const referenceRef = useRef<HTMLInputElement>(null);
    const notesRef = useRef<HTMLTextAreaElement>(null);
    const [notifyCustomer, setNotifyCustomer] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    if (!mounted) return null;

    const numAmount = parseFloat(amount || '0');
    const newPaidTotal = amountPaid + numAmount;
    const remainingBalance = Math.max(0, balanceDue - numAmount);
    const isFullPayment = numAmount >= balanceDue && balanceDue > 0;
    const isOverpaying = numAmount > balanceDue;

    const handleQuickAmount = (percentage: number) => {
        const calculated = (balanceDue * percentage).toFixed(2);
        setAmount(calculated);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!amount || numAmount <= 0) {
            setError('Please enter a valid payment amount greater than zero.');
            return;
        }

        if (numAmount > balanceDue) {
            setError(`Amount exceeds current balance due of ₵${balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
            return;
        }

        const referenceVal = referenceRef.current?.value?.trim() || undefined;
        const notesVal = notesRef.current?.value?.trim() || undefined;

        try {
            await onRecordPayment({
                amount: numAmount,
                payment_method: paymentMethod,
                reference: referenceVal,
                notes: notesVal,
                notify_customer: notifyCustomer
            });
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to record payment');
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
            <div 
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/75 backdrop-blur-[2px] transition-opacity"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.15 }}
                className={`relative z-10 w-full max-w-lg border rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden transform-gpu will-change-transform ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
                }`}
            >
                {/* Fixed Modal Header */}
                <div className={`px-5 py-4 sm:px-6 sm:py-5 border-b flex items-center justify-between shrink-0 ${
                    isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
                }`}>
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight truncate">
                                Record Payment
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 truncate">
                                Order #{order.order_number}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 -mr-1"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                {/* Form with Scrollable Body & Sticky Footer */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="overflow-y-auto flex-1 px-4 py-4 sm:px-6 sm:py-6 space-y-5">
                        {/* Financial Summary Card */}
                        <div className={`p-3 sm:p-4 rounded-xl border grid grid-cols-3 gap-2 sm:gap-4 text-center ${
                            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200/60'
                        }`}>
                            <div className="min-w-0">
                                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider opacity-40 block mb-0.5 sm:mb-1 truncate">
                                    Total Order
                                </span>
                                <p className="text-sm sm:text-base font-mono font-bold tracking-tight truncate">
                                    ₵{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="min-w-0">
                                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider opacity-40 block mb-0.5 sm:mb-1 truncate">
                                    Paid to Date
                                </span>
                                <p className="text-sm sm:text-base font-mono font-bold text-emerald-500 tracking-tight truncate">
                                    ₵{amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="min-w-0">
                                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider opacity-40 block mb-0.5 sm:mb-1 truncate">
                                    Balance Due
                                </span>
                                <p className={`text-sm sm:text-base font-mono font-bold tracking-tight truncate ${balanceDue > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                                    ₵{balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                    Payment Amount (GHS) <span className="text-rose-500">*</span>
                                </label>
                                {balanceDue > 0 && (
                                    <span className="text-[9px] font-mono opacity-40">
                                        Max: ₵{balanceDue.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-serif italic opacity-40">₵</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={balanceDue > 0 ? balanceDue : undefined}
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                        setError(null);
                                    }}
                                    placeholder="0.00"
                                    autoFocus
                                    required
                                    className={`w-full p-3.5 sm:p-4 pl-11 sm:pl-12 border text-xl sm:text-2xl font-mono font-bold tracking-tight outline-none rounded-xl transition-colors duration-150 ${
                                    isOverpaying 
                                        ? 'border-rose-500 focus:border-rose-500 bg-rose-500/5' 
                                        : 'focus:border-purple-500'
                                } ${isDark ? 'bg-slate-950/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                />
                            </div>

                            {/* Quick Percentage Shortcuts */}
                            {balanceDue > 0 && (
                                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-1">
                                    {[
                                        { pct: 0.25, label: '25%', sub: `₵${(balanceDue * 0.25).toFixed(0)}` },
                                        { pct: 0.50, label: '50%', sub: `₵${(balanceDue * 0.50).toFixed(0)}` },
                                        { pct: 0.75, label: '75%', sub: `₵${(balanceDue * 0.75).toFixed(0)}` },
                                        { pct: 1.00, label: '100%', sub: 'Full Due' },
                                    ].map((item) => {
                                        const isCurrent = Math.abs(numAmount - (balanceDue * item.pct)) < 0.01;
                                        return (
                                            <button
                                                key={item.pct}
                                                type="button"
                                                onClick={() => handleQuickAmount(item.pct)}
                                                className={`py-2 px-1 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                                                    isCurrent
                                                        ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold'
                                                        : isDark 
                                                            ? 'border-slate-800 hover:bg-white/5 text-slate-300' 
                                                            : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                <span className="text-[11px] sm:text-xs font-mono font-bold leading-tight">
                                                    {item.label}
                                                </span>
                                                <span className="text-[8px] sm:text-[9px] font-mono opacity-60 truncate max-w-full leading-tight mt-0.5">
                                                    {item.sub}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Live Impact Feedback */}
                            {numAmount > 0 && !isOverpaying && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-3 rounded-xl text-xs font-mono border flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 ${
                                        isFullPayment 
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                                            : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                        <span className="text-[11px] sm:text-xs font-medium leading-tight">
                                            {isFullPayment 
                                                ? 'Full clearance: Order transitions to PAID' 
                                                : `Deposit: ₵${remainingBalance.toFixed(2)} remaining balance`
                                            }
                                        </span>
                                    </div>
                                    <span className="text-[11px] sm:text-xs font-bold shrink-0 self-end sm:self-auto">
                                        New Paid: ₵{newPaidTotal.toFixed(2)}
                                    </span>
                                </motion.div>
                            )}
                        </div>

                        {/* Payment Method Selector */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                Payment Method <span className="text-rose-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                    { id: 'MOBILE_MONEY', label: 'Mobile Money', icon: Smartphone },
                                    { id: 'CASH', label: 'Cash / In-Person', icon: Banknote },
                                    { id: 'BANK_TRANSFER', label: 'Bank Transfer', icon: Building2 },
                                    { id: 'CARD', label: 'Card / POS', icon: CreditCard },
                                ].map(method => {
                                    const Icon = method.icon;
                                    const isSelected = paymentMethod === method.id;
                                    return (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer ${
                                                isSelected 
                                                    ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-sm ring-1 ring-purple-500/30' 
                                                    : isDark 
                                                        ? 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white' 
                                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4 shrink-0" />
                                            <span className="text-[9px] sm:text-[10px] font-bold leading-tight uppercase tracking-wider truncate max-w-full">
                                                {method.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Transaction Reference */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                Transaction Reference / Momo ID (Optional)
                            </label>
                            <input
                                ref={referenceRef}
                                type="text"
                                placeholder="e.g. 8291471029 or CASH-REC-01"
                                className={`w-full p-3 border text-xs font-mono tracking-wider outline-none rounded-xl transition-colors duration-150 focus:border-purple-500 ${
                                    isDark ? 'bg-slate-950/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                                }`}
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                                Internal Note (Optional)
                            </label>
                            <textarea
                                ref={notesRef}
                                placeholder="e.g. Customer deposited cash at Accra shop; balance to be paid on delivery."
                                rows={2}
                                className={`w-full p-3 border text-xs outline-none rounded-xl transition-colors duration-150 focus:border-purple-500 resize-none ${
                                    isDark ? 'bg-slate-950/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                                }`}
                            />
                        </div>

                        {/* Notify Customer Checkbox */}
                        <label className="flex items-start gap-2.5 cursor-pointer select-none py-1">
                            <input
                                type="checkbox"
                                checked={notifyCustomer}
                                onChange={(e) => setNotifyCustomer(e.target.checked)}
                                className="w-4 h-4 mt-0.5 rounded text-purple-600 focus:ring-purple-500 shrink-0"
                            />
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider opacity-75 leading-tight">
                                Send receipt SMS / notification to customer
                            </span>
                        </label>

                        {/* Error message */}
                        {error && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Fixed / Sticky Modal Footer */}
                    <div className={`p-4 sm:px-6 sm:py-4 border-t flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 shrink-0 ${
                        isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
                    }`}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={updating}
                            className="w-full sm:w-auto px-5 py-3 text-[10px] font-black uppercase tracking-widest opacity-45 hover:opacity-100 transition-opacity cursor-pointer text-center"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updating || numAmount <= 0 || isOverpaying}
                            className="w-full sm:w-auto px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {updating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Recording...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>
                                        Record Payment {numAmount > 0 ? `(₵${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })})` : ''}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>,
        document.body
    );
}
