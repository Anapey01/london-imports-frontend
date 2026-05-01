'use client';

import { formatPrice } from '@/lib/format';

interface BaseOrderItem {
    id: string;
    unit_price?: number | string;
    quantity: number;
    total_price?: number | string;
}

interface PaymentMethodSelectorProps {
    paymentType: 'FULL' | 'DEPOSIT' | 'CUSTOM' | 'BALANCE' | 'WHATSAPP';
    setPaymentType: (type: 'FULL' | 'DEPOSIT' | 'CUSTOM' | 'BALANCE' | 'WHATSAPP') => void;
    currentOrderData: {
        total: number;
        items?: BaseOrderItem[];
        delivery_fee?: number;
    };
    selectedItemIds: Set<string>;
    customAmount: string;
    setCustomAmount: (amount: string) => void;
    activeStep: number;
    setActiveStep: (step: number) => void;
}

const PaymentMethodSelector = ({ paymentType, setPaymentType, currentOrderData, customAmount, setCustomAmount, selectedItemIds, activeStep, setActiveStep }: PaymentMethodSelectorProps) => {
    const isExpanded = activeStep === 2;
    const isCompleted = activeStep > 2;
    
    // Deduplicate total calculation
    const calculateSelectedTotal = () => {
        const selSubtotal = (currentOrderData.items || [])
            .filter((i: BaseOrderItem) => selectedItemIds.has(i.id))
            .reduce((sum: number, i: BaseOrderItem) => sum + (Number(i.unit_price || 0) * i.quantity), 0);
        return selSubtotal + Number(currentOrderData.delivery_fee || 0);
    };

    const selectedTotal = calculateSelectedTotal();

    const getPaymentLabel = () => {
        if (paymentType === 'FULL') return 'Full Payment (Plus Shipping Fee)';
        if (paymentType === 'DEPOSIT') return 'Full Payment (Minus Shipping Fee)';
        if (paymentType === 'WHATSAPP') return 'Mobile Money (Concierge)';
        if (paymentType === 'CUSTOM') return `Installment (${formatPrice(customAmount)})`;
        return 'Clear Balance';
    };

    return (
        <div className={`bg-surface-card rounded-2xl border transition-all duration-500 overflow-hidden ${isExpanded ? 'border-brand-emerald/30 shadow-diffusion-lg ring-1 ring-brand-emerald/10' : 'border-border-standard opacity-90'}`}>
            {/* Header Section */}
            <div className="flex items-center justify-between p-6 sm:p-7 border-b border-border-standard/50">
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${isExpanded ? 'bg-content-primary text-surface scale-110 shadow-lg' : 'bg-surface text-content-secondary'}`}>
                        2
                    </div>
                    <div>
                        <h2 className={`font-black uppercase tracking-widest text-[11px] transition-colors ${isExpanded ? 'text-content-primary' : 'text-content-secondary'}`}>
                            Payment Method
                        </h2>
                        {!isExpanded && isCompleted && (
                            <p className="text-[10px] font-medium text-content-secondary mt-0.5">
                                {getPaymentLabel()}
                            </p>
                        )}
                    </div>
                </div>
                
                {isCompleted && (
                    <button 
                        onClick={() => setActiveStep(2)}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-emerald hover:opacity-80 transition-all px-4 py-2 bg-brand-emerald/10 rounded-lg"
                    >
                        Change
                    </button>
                )}
            </div>

            {/* Expandable Content Body */}
            <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="p-6 sm:p-7 space-y-4">
                    {paymentType === 'BALANCE' ? (
                        <div className="flex items-start p-6 rounded-2xl border-2 border-brand-emerald/20 bg-brand-emerald/[0.02] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                                <div className="w-10 h-10 border-2 border-brand-emerald rounded-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-brand-emerald rounded-full" />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <span className="block font-black text-content-primary text-lg tracking-tight mb-1">Clear Balance</span>
                                <p className="text-[10px] text-content-secondary font-bold leading-relaxed max-w-[240px]">Finalizing the remaining balance for this order.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <label className={`block relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${paymentType === 'FULL' ? 'border-border-standard bg-content-primary/[0.02]' : 'border-transparent hover:bg-content-primary/[0.01]'}`}>
                                <input
                                    type="radio"
                                    name="payment_type"
                                    value="FULL"
                                    checked={paymentType === 'FULL'}
                                    onChange={() => setPaymentType('FULL')}
                                    className="sr-only"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <span className={`block font-black tracking-tight text-base transition-colors ${paymentType === 'FULL' ? 'text-content-primary' : 'text-content-secondary'}`}>Full Payment (Plus Shipping Fee)</span>
                                        <p className="text-[8px] text-content-secondary font-black uppercase tracking-[0.2em]">Pay {formatPrice(selectedTotal)} today (Full Settlement)</p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${paymentType === 'FULL' ? 'border-content-primary scale-110' : 'border-border-standard'}`}>
                                        {paymentType === 'FULL' && <div className="w-1.5 h-1.5 bg-content-primary rounded-full" />}
                                    </div>
                                </div>
                            </label>

                            <label className={`block relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${paymentType === 'DEPOSIT' ? 'border-border-standard bg-content-primary/[0.02]' : 'border-transparent hover:bg-content-primary/[0.01]'}`}>
                                <input
                                    type="radio"
                                    name="payment_type"
                                    value="DEPOSIT"
                                    checked={paymentType === 'DEPOSIT'}
                                    onChange={() => setPaymentType('DEPOSIT')}
                                    className="sr-only"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <span className={`block font-black tracking-tight text-base transition-colors ${paymentType === 'DEPOSIT' ? 'text-content-primary' : 'text-content-secondary'}`}>Full Payment (Minus Shipping Fee)</span>
                                        <p className="text-[8px] text-content-secondary font-black uppercase tracking-[0.2em]">Pay {formatPrice(selectedTotal - Number(currentOrderData.delivery_fee || 0))} today • Pay Shipping Later</p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${paymentType === 'DEPOSIT' ? 'border-content-primary scale-110' : 'border-border-standard'}`}>
                                        {paymentType === 'DEPOSIT' && <div className="w-1.5 h-1.5 bg-content-primary rounded-full" />}
                                    </div>
                                </div>
                            </label>

                            <label className={`block relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${paymentType === 'WHATSAPP' ? 'border-brand-emerald/20 bg-brand-emerald/[0.03]' : 'border-transparent hover:bg-brand-emerald/[0.01]'}`}>
                                <input
                                    type="radio"
                                    name="payment_type"
                                    value="WHATSAPP"
                                    checked={paymentType === 'WHATSAPP'}
                                    onChange={() => setPaymentType('WHATSAPP')}
                                    className="sr-only"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className={`block font-black tracking-tight text-base transition-colors ${paymentType === 'WHATSAPP' ? 'text-brand-emerald' : 'text-content-secondary'}`}>Direct Momo</span>
                                            <span className="text-[6px] font-black uppercase tracking-[0.3em] bg-brand-emerald text-surface px-1.5 py-0.5 rounded-full">Fast</span>
                                        </div>
                                        <p className="text-[8px] text-content-secondary font-black uppercase tracking-[0.2em] leading-relaxed max-w-[240px]">Pay securely via WhatsApp Concierge</p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${paymentType === 'WHATSAPP' ? 'border-brand-emerald scale-110' : 'border-border-standard'}`}>
                                        {paymentType === 'WHATSAPP' && <div className="w-1.5 h-1.5 bg-brand-emerald rounded-full" />}
                                    </div>
                                </div>
                            </label>

                            <label className={`block relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${paymentType === 'CUSTOM' ? 'border-border-standard bg-content-primary/[0.02]' : 'border-transparent hover:bg-content-primary/[0.01]'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="space-y-0.5">
                                        <span className={`block font-black tracking-tight text-base transition-colors ${paymentType === 'CUSTOM' ? 'text-content-primary' : 'text-content-secondary'}`}>Flexible Installment</span>
                                        <p className="text-[8px] text-content-secondary font-black uppercase tracking-[0.2em]">Choose your own amount</p>
                                    </div>
                                    <div 
                                        onClick={() => setPaymentType('CUSTOM')}
                                        className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${paymentType === 'CUSTOM' ? 'border-content-primary scale-110' : 'border-border-standard'}`}
                                    >
                                        {paymentType === 'CUSTOM' && <div className="w-1.5 h-1.5 bg-content-primary rounded-full" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="payment_type"
                                        value="CUSTOM"
                                        checked={paymentType === 'CUSTOM'}
                                        onChange={() => setPaymentType('CUSTOM')}
                                        className="sr-only"
                                    />
                                </div>

                                {paymentType === 'CUSTOM' && (
                                    <div className="animate-in slide-in-from-top-2 duration-300">
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                                <span className="text-[9px] font-black text-content-secondary group-focus-within:text-brand-emerald uppercase tracking-widest pl-3">GHS</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={customAmount}
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value);
                                                    if (val > selectedTotal) return;
                                                    setCustomAmount(e.target.value);
                                                }}
                                                placeholder="0.00"
                                                className="w-full pl-12 pr-4 py-3 bg-transparent border-0 border-b-2 border-border-standard focus:border-brand-emerald outline-none transition-all text-content-primary font-black text-lg tabular-nums placeholder:opacity-40"
                                                min="1"
                                                max={selectedTotal}
                                            />
                                        </div>
                                    </div>
                                )}
                            </label>
                        </>
                    )}

                    {/* Financial Roadmap - Hardened UX for Installments */}
                    {(paymentType === 'DEPOSIT' || paymentType === 'CUSTOM') && (
                        <div className="mx-2 p-5 rounded-2xl bg-slate-50 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-500">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Payment Roadmap</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Due Today</p>
                                    <p className="text-sm font-black text-slate-900">
                                        {paymentType === 'DEPOSIT' 
                                            ? formatPrice(selectedTotal - Number(currentOrderData.delivery_fee || 0))
                                            : formatPrice(customAmount || 0)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pay Later</p>
                                    <p className="text-sm font-black text-emerald-600">
                                        {paymentType === 'DEPOSIT'
                                            ? formatPrice(currentOrderData.delivery_fee || 0)
                                            : formatPrice(selectedTotal - Number(customAmount || 0))}
                                    </p>
                                </div>
                                <div className="col-span-2 pt-3 border-t border-slate-200 flex justify-between items-center">
                                    <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Total Value</p>
                                    <p className="text-sm font-black text-slate-900">{formatPrice(selectedTotal)}</p>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-white/60 rounded-lg border border-slate-100">
                                <p className="text-[8px] font-bold text-slate-500 italic leading-relaxed">
                                    * Your order enters the shipping pipeline today. The pending balance will be due once the items arrive at the Ghana Hub.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="pt-6">
                        <button 
                            type="button"
                            onClick={() => setActiveStep(3)}
                            className="w-full py-4 bg-content-primary text-surface text-[11px] uppercase tracking-[0.2em] font-black rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg"
                        >
                            Use this payment method
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodSelector;
