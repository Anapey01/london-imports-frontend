'use client';

import { useRef, useLayoutEffect } from 'react';
import { Lock } from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface CheckoutSubmitButtonProps {
    isLoading: boolean;
    isPaystackLoaded: boolean;
    canPay: boolean;
    paymentType: 'FULL' | 'DEPOSIT' | 'CUSTOM' | 'BALANCE' | 'WHATSAPP';
    paymentAmount: number;
    connectionTimeout: boolean;
    connectionProgress: number;
    setPaymentType: (type: 'FULL' | 'DEPOSIT' | 'CUSTOM' | 'BALANCE' | 'WHATSAPP') => void;
}

const CheckoutSubmitButton = ({
    isLoading,
    isPaystackLoaded,
    canPay,
    paymentType,
    paymentAmount,
    connectionTimeout,
    connectionProgress,
    setPaymentType
}: CheckoutSubmitButtonProps) => {
    const progressRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (progressRef.current) {
            progressRef.current.style.width = `${connectionProgress}%`;
        }
    }, [connectionProgress]);

    return (
        <div className="mt-8">
            <button
                type="submit"
                disabled={isLoading || (paymentType !== 'WHATSAPP' && !isPaystackLoaded) || !canPay}
                id="checkout-pay-button"
                className={`w-full py-6 px-10 rounded-2xl font-black transition-all active:scale-[0.98] duration-700 uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 shadow-diffusion-2xl border-2 border-transparent ${paymentType === 'WHATSAPP' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-black dark:hover:bg-slate-100 hover:shadow-glow-emerald/20'}`}
            >
                {!canPay ? (
                    <span className="flex items-center gap-3 opacity-20">
                        <Lock className="w-4 h-4" /> Locked
                    </span>
                ) : isLoading ? (
                    <span className="flex items-center gap-4">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white dark:border-slate-950/20 dark:border-t-slate-950 rounded-full animate-spin" />
                        Executing...
                    </span>
                ) : (
                    <>
                        {paymentType === 'WHATSAPP' ? (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Concierge Protocol
                            </>
                        ) : (
                            <>
                                {(!isPaystackLoaded || (isLoading && !window.PaystackPop)) ? (
                                    <div className="flex flex-col items-center w-full gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 border border-white/20 border-t-white dark:border-slate-950/20 dark:border-t-slate-950 rounded-full animate-spin" />
                                            <span className="text-[8px] tracking-[0.3em]">
                                                {connectionTimeout ? 'RETRIEVING GATEWAY...' : 'INITIALIZING SECURE SESSION...'}
                                            </span>
                                        </div>
                                        <div className="w-full h-[1px] bg-white/5 dark:bg-slate-950/5 relative overflow-hidden">
                                            <div 
                                                ref={progressRef}
                                                className="absolute inset-y-0 left-0 bg-white dark:bg-slate-950 transition-all duration-500 ease-out"
                                            />
                                        </div>
                                        {connectionTimeout && (
                                            <div className="flex items-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => window.location.reload()}
                                                    className="text-[7px] font-black underline opacity-40 hover:opacity-100 transition-opacity"
                                                >
                                                    FORCE REFRESH
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentType('WHATSAPP')}
                                                    className="text-[7px] font-black underline text-emerald-500"
                                                >
                                                    MOMO BYPASS
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        Authorize Allocation — {formatPrice(paymentAmount)}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </button>

            <div className="mt-8 flex items-center justify-center gap-6 opacity-10 hover:opacity-30 transition-opacity duration-700 grayscale">
                <span className="text-[7px] font-black uppercase tracking-[0.4em] nuclear-text">Paystack Encrypted</span>
                <div className="w-1 h-1 bg-slate-900 dark:bg-white rounded-full" />
                <span className="text-[7px] font-black uppercase tracking-[0.4em] nuclear-text">Zero Data Retention</span>
            </div>
        </div>
    );
};

export default CheckoutSubmitButton;
