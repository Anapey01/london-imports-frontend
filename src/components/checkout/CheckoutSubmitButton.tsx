'use client';

import { CreditCard, Lock, RefreshCcw, AlertCircle } from 'lucide-react';
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
    return (
        <div className="mt-8">
            <button
                type="submit"
                disabled={isLoading || (paymentType !== 'WHATSAPP' && !isPaystackLoaded) || !canPay}
                id="checkout-pay-button"
                className={`w-full py-4 px-6 rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform active:scale-95 duration-200 disabled:opacity-70 disabled:grayscale disabled:hover:scale-100 flex items-center justify-center gap-2 text-base md:text-lg ${paymentType === 'WHATSAPP' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-black hover:bg-gray-900 text-white'}`}
            >
                {!canPay ? (
                    <span className="flex items-center gap-2">
                        <Lock className="w-5 h-5" /> Cannot Process Payment
                    </span>
                ) : isLoading ? (
                    <span className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing Order...
                    </span>
                ) : (
                    <>
                        {paymentType === 'WHATSAPP' ? (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Checkout via WhatsApp
                            </>
                        ) : (
                            <>
                                {(!isPaystackLoaded || (isLoading && !window.PaystackPop)) ? (
                                    <div className="flex flex-col items-center w-full gap-2">
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {connectionTimeout ? 'Connection Slow...' : 'Connecting to Secured Gateway...'}
                                        </span>
                                        <progress
                                            className="w-full h-1 rounded-full overflow-hidden max-w-[200px] border-none bg-white/20 [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-white [&::-moz-progress-bar]:bg-white transition-all duration-300"
                                            value={connectionProgress}
                                            max="100"
                                            title="Connection Progress"
                                        />
                                        {connectionTimeout && (
                                            <div className="mt-2 flex flex-col gap-2 w-full">
                                                <button
                                                    type="button"
                                                    onClick={() => window.location.reload()}
                                                    className="text-[10px] bg-white/10 hover:bg-white/20 py-1 px-3 rounded flex items-center justify-center gap-2"
                                                >
                                                    <RefreshCcw className="w-3 h-3" /> Refresh Connection
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentType('WHATSAPP')}
                                                    className="text-[10px] bg-green-500/20 hover:bg-green-500/40 py-1 px-3 rounded flex items-center justify-center gap-2 text-green-200"
                                                >
                                                    <AlertCircle className="w-3 h-3" /> Still stuck? Use WhatsApp Momo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5 mr-1" strokeWidth={2.5} />
                                        Pay {formatPrice(paymentAmount)}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </button>

            <p className="text-center mt-4 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                Secured by Paystack
            </p>
        </div>
    );
};

export default CheckoutSubmitButton;
