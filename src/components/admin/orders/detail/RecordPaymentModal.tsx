'use client';

import { useEffect, useState } from 'react';
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
    const [reference, setReference] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
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

        try {
            await onRecordPayment({
                amount: numAmount,
                payment_method: paymentMethod,
                reference: reference.trim() || undefined,
                notes: notes.trim() || undefined,
                notify_customer: notifyCustomer
            });
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to record payment');
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div 
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className={`relative z-10 w-full max-w-xl border p-6 sm:p-10 rounded-2xl shadow-2xl my-auto max-h-[92vh] overflow-y-auto ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
                }`}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-4 h-4 text-slate-400" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Record Payment</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40">
                            Order #{order.order_number}
                        </p>
                    </div>
                </div>

                {/* Financial Summary Card */}
                <div className={`my-6 p-5 rounded-xl border grid grid-cols-3 gap-3 ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200/60'
                }`}>
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-1">Total Order</span>
                        <p className="text-base sm:text-lg font-mono font-bold tracking-tight">
                            ₵{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-1">Paid to Date</span>
                        <p className="text-base sm:text-lg font-mono font-bold text-emerald-500 tracking-tight">
                            ₵{amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-1">Balance Due</span>
                        <p className={`text-base sm:text-lg font-mono font-bold tracking-tight ${balanceDue > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                            ₵{balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                className={`w-full p-4 pl-12 border text-2xl sm:text-3xl font-mono font-bold tracking-tight outline-none rounded-xl transition-all ${
                                    isOverpaying 
                                        ? 'border-rose-500 focus:border-rose-500 bg-rose-500/5' 
                                        : 'focus:border-purple-500'
                                } ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}
                            />
                        </div>

                        {/* Quick Percentage Shortcuts */}
                        {balanceDue > 0 && (
                            <div className="grid grid-cols-4 gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => handleQuickAmount(0.25)}
                                    className={`py-2 px-3 rounded-lg border text-[10px] font-mono font-bold uppercase transition-all ${
                                        isDark ? 'border-slate-800 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    25% (₵{(balanceDue * 0.25).toFixed(0)})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickAmount(0.50)}
                                    className={`py-2 px-3 rounded-lg border text-[10px] font-mono font-bold uppercase transition-all ${
                                        isDark ? 'border-slate-800 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    50% Deposit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickAmount(0.75)}
                                    className={`py-2 px-3 rounded-lg border text-[10px] font-mono font-bold uppercase transition-all ${
                                        isDark ? 'border-slate-800 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    75%
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickAmount(1.0)}
                                    className={`py-2 px-3 rounded-lg border text-[10px] font-mono font-bold uppercase transition-all ${
                                        isDark ? 'border-purple-500/50 bg-purple-500/10 text-purple-400' : 'border-purple-200 bg-purple-50 text-purple-700'
                                    }`}
                                >
                                    Full Balance
                                </button>
                            </div>
                        )}

                        {/* Live Impact Feedback */}
                        {numAmount > 0 && !isOverpaying && (
                            <motion.div 
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3 rounded-lg text-[10px] font-mono flex items-center justify-between border ${
                                    isFullPayment 
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                                        : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>
                                        {isFullPayment 
                                            ? 'Full clearance: Order will transition to PAID' 
                                            : `Partial deposit: ₵${remainingBalance.toFixed(2)} remaining due`
                                        }
                                    </span>
                                </div>
                                <span className="font-bold">
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
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                                            isSelected 
                                                ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-sm' 
                                                : isDark 
                                                    ? 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white' 
                                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-[9px] font-bold leading-tight uppercase tracking-wider">
                                            {method.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Transaction Reference */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                            Transaction Reference / Momo ID (Optional)
                        </label>
                        <input
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="e.g. 8291471029 or CASH-REC-01"
                            className={`w-full p-3.5 border text-xs font-mono tracking-wider outline-none rounded-xl transition-all focus:border-purple-500 ${
                                isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                            }`}
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50">
                            Internal Note (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. Customer deposited cash at Accra shop; balance to be paid on delivery."
                            rows={2}
                            className={`w-full p-3.5 border text-xs outline-none rounded-xl transition-all focus:border-purple-500 resize-none ${
                                isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                            }`}
                        />
                    </div>

                    {/* Notify Customer Checkbox */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={notifyCustomer}
                            onChange={(e) => setNotifyCustomer(e.target.checked)}
                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                            Send receipt SMS / notification to customer
                        </span>
                    </label>

                    {/* Error message */}
                    {error && (
                        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-inherit">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={updating}
                            className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updating || numAmount <= 0 || isOverpaying}
                            className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-40 flex items-center gap-2 cursor-pointer"
                        >
                            {updating ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Recording...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Record Payment {numAmount > 0 && `(₵${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })})`}
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
