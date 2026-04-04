'use client';

import { formatPrice } from '@/lib/format';

interface BaseOrderItem {
    id: string;
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
}

const PaymentMethodSelector = ({ paymentType, setPaymentType, currentOrderData, customAmount, setCustomAmount, selectedItemIds }: PaymentMethodSelectorProps) => {
    
    // Deduplicate total calculation
    const calculateSelectedTotal = () => {
        const selSubtotal = (currentOrderData.items || [])
            .filter((i: BaseOrderItem) => selectedItemIds.has(i.id))
            .reduce((sum: number, i: BaseOrderItem) => sum + Number(i.total_price || 0), 0);
        return selSubtotal + (currentOrderData.delivery_fee || 0);
    };

    const selectedTotal = calculateSelectedTotal();

    return (
        <div className="bg-primary-surface/40 p-6 sm:p-8 rounded-[1.5rem] shadow-diffusion-xl border border-primary-surface/40 backdrop-blur-3xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-primary-surface/20">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center opacity-10">
                        <svg className="w-3.5 h-3.5 nuclear-text" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                    </div>
                    <h2 className="text-[9px] font-black nuclear-text tracking-[0.4em] uppercase opacity-40">Payment Allocation</h2>
                </div>
            </div>

            <div className="space-y-4">
                {paymentType === 'BALANCE' ? (
                    <div className="flex items-start p-6 rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                            <div className="w-10 h-10 border-2 border-emerald-500 rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <span className="block font-black nuclear-text text-lg tracking-tight mb-1">Clear Balance</span>
                            <p className="text-[10px] nuclear-text opacity-40 font-bold leading-relaxed max-w-[240px]">Finalizing the remaining manifest value for this sourcing operation.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <label className={`block relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${paymentType === 'FULL' ? 'border-slate-900/10 dark:border-white/10 bg-slate-900/[0.02] dark:bg-white/[0.02]' : 'border-transparent hover:bg-slate-900/[0.01] dark:hover:bg-white/[0.01]'}`}>
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
                                    <span className={`block font-black tracking-tight text-base transition-colors ${paymentType === 'FULL' ? 'nuclear-text' : 'nuclear-text opacity-40'}`}>Full Allocation</span>
                                    <p className="text-[8px] nuclear-text opacity-40 font-black uppercase tracking-[0.2em]">Pay {formatPrice(selectedTotal)}</p>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${paymentType === 'FULL' ? 'border-slate-900 dark:border-white scale-110' : 'border-slate-900/10 dark:border-white/10'}`}>
                                    {paymentType === 'FULL' && <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-white rounded-full" />}
                                </div>
                            </div>
                        </label>

                        <label className={`block relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${paymentType === 'DEPOSIT' ? 'border-slate-900/10 dark:border-white/10 bg-slate-900/[0.02] dark:bg-white/[0.02]' : 'border-transparent hover:bg-slate-900/[0.01] dark:hover:bg-white/[0.01]'}`}>
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
                                    <span className={`block font-black tracking-tight text-base transition-colors ${paymentType === 'DEPOSIT' ? 'nuclear-text' : 'nuclear-text opacity-40'}`}>Deposit Protocol</span>
                                    <p className="text-[8px] nuclear-text opacity-40 font-black uppercase tracking-[0.2em]">COMMIT {formatPrice(selectedTotal * 0.3)} (30%)</p>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${paymentType === 'DEPOSIT' ? 'border-slate-900 dark:border-white scale-110' : 'border-slate-900/10 dark:border-white/10'}`}>
                                    {paymentType === 'DEPOSIT' && <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-white rounded-full" />}
                                </div>
                            </div>
                        </label>

                        <label className={`block relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${paymentType === 'WHATSAPP' ? 'border-emerald-500/20 bg-emerald-500/[0.03]' : 'border-transparent hover:bg-emerald-500/[0.01]'}`}>
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
                                        <span className={`block font-black tracking-tight text-base transition-colors ${paymentType === 'WHATSAPP' ? 'text-emerald-500' : 'nuclear-text opacity-40'}`}>Concierge Momo</span>
                                        <span className="text-[6px] font-black uppercase tracking-[0.3em] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">Primary</span>
                                    </div>
                                    <p className="text-[8px] nuclear-text opacity-40 font-black uppercase tracking-[0.2em] leading-relaxed max-w-[240px]">DIRECT EXTRACTION VIA MOMO SECURE CONCIERGE</p>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${paymentType === 'WHATSAPP' ? 'border-emerald-500 scale-110' : 'border-slate-900/10 dark:border-white/10'}`}>
                                    {paymentType === 'WHATSAPP' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                                </div>
                            </div>
                        </label>

                        <label className={`block relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${paymentType === 'CUSTOM' ? 'border-slate-900/10 dark:border-white/10 bg-slate-900/[0.02] dark:bg-white/[0.02]' : 'border-transparent hover:bg-slate-900/[0.01] dark:hover:bg-white/[0.01]'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-0.5">
                                    <span className={`block font-black tracking-tight text-base transition-colors ${paymentType === 'CUSTOM' ? 'nuclear-text' : 'nuclear-text opacity-40'}`}>Flexible Installment</span>
                                    <p className="text-[8px] nuclear-text opacity-40 font-black uppercase tracking-[0.2em]">PARTIAL MANIFEST ALLOCATION</p>
                                </div>
                                <div 
                                    onClick={() => setPaymentType('CUSTOM')}
                                    className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${paymentType === 'CUSTOM' ? 'border-slate-900 dark:border-white scale-110' : 'border-slate-900/10 dark:border-white/10'}`}
                                >
                                    {paymentType === 'CUSTOM' && <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-white rounded-full" />}
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
                                        <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none opacity-20">
                                            <span className="text-[9px] font-black transition-all group-focus-within:opacity-100 group-focus-within:text-emerald-500 uppercase tracking-widest pl-3">GHS</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                if (val > selectedTotal) return;
                                                setCustomAmount(e.target.value);
                                            }}
                                            placeholder="ALLOCATION AMOUNT"
                                            className="w-full pl-12 pr-4 py-3 bg-primary-surface/20 border-0 border-b-2 border-slate-900/10 dark:border-white/10 focus:border-emerald-500 outline-none transition-all nuclear-text font-black text-lg tabular-nums placeholder:opacity-10"
                                            min="1"
                                            max={selectedTotal}
                                        />
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-[7px] font-black nuclear-text opacity-20 uppercase tracking-[0.4em]">Pending Manifest Balance</span>
                                        <span className="text-[9px] font-black nuclear-text tabular-nums tracking-wider leading-none">
                                            {formatPrice(customAmount ? Math.max(0, selectedTotal - parseFloat(customAmount || '0')) : selectedTotal)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </label>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentMethodSelector;
