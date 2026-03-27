'use client';

import { formatPrice } from '@/lib/format';
import { type CartItem } from '@/stores/cartStore';

interface PaymentMethodSelectorProps {
    paymentType: 'FULL' | 'DEPOSIT' | 'CUSTOM' | 'BALANCE' | 'WHATSAPP';
    setPaymentType: (type: 'FULL' | 'DEPOSIT' | 'CUSTOM' | 'BALANCE' | 'WHATSAPP') => void;
    currentOrderData: {
        total: number;
        items?: CartItem[];
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
            .filter((i: CartItem) => selectedItemIds.has(i.id))
            .reduce((sum: number, i: CartItem) => sum + Number(i.total_price || 0), 0);
        return selSubtotal + (currentOrderData.delivery_fee || 0);
    };

    const selectedTotal = calculateSelectedTotal();

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                <h2 className="text-xl font-light text-gray-900 tracking-tight">Payment Method</h2>
            </div>

            <div className="space-y-4">
                {paymentType === 'BALANCE' ? (
                    <label className="flex items-start p-6 rounded-2xl border border-black bg-gray-50 ring-1 ring-black cursor-default">
                        <div className="mt-1">
                            <input type="radio" checked readOnly className="w-4 h-4 text-black border-gray-300 accent-black" />
                        </div>
                        <div className="ml-4">
                            <span className="block font-medium text-gray-900 text-lg">Clear Balance</span>
                            <p className="text-sm text-gray-500 font-light mt-1 italic">Paying off the remaining balance for this order.</p>
                        </div>
                    </label>
                ) : (
                    <>
                        <label className={`flex items-start p-4 sm:p-6 rounded-2xl cursor-pointer transition-all border ${paymentType === 'FULL' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}>
                            <div className="mt-1">
                                <input
                                    type="radio"
                                    name="payment_type"
                                    value="FULL"
                                    checked={paymentType === 'FULL'}
                                    onChange={() => setPaymentType('FULL')}
                                    className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black"
                                />
                            </div>
                            <div className="ml-4">
                                <span className="block font-medium text-gray-900 text-lg">Full Payment</span>
                                <p className="text-sm text-gray-500 font-light mt-1">Pay {formatPrice(selectedTotal)} now</p>
                            </div>
                        </label>

                        <label className={`flex items-start p-4 sm:p-6 rounded-2xl cursor-pointer transition-all border ${paymentType === 'DEPOSIT' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}>
                            <div className="mt-1">
                                <input
                                    type="radio"
                                    name="payment_type"
                                    value="DEPOSIT"
                                    checked={paymentType === 'DEPOSIT'}
                                    onChange={() => setPaymentType('DEPOSIT')}
                                    className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black"
                                />
                            </div>
                            <div className="ml-4">
                                <span className="block font-medium text-gray-900 text-lg">Deposit Only</span>
                                <p className="text-sm text-gray-500 font-light mt-1">Pay {formatPrice(selectedTotal * 0.3)} (30%) now</p>
                            </div>
                        </label>

                        <label className={`flex items-start p-4 sm:p-6 rounded-2xl cursor-pointer transition-all border ${paymentType === 'WHATSAPP' ? 'border-green-600 bg-green-50 ring-1 ring-green-600' : 'border-gray-200 hover:border-gray-300'}`}>
                            <div className="mt-1">
                                <input
                                    type="radio"
                                    name="payment_type"
                                    value="WHATSAPP"
                                    checked={paymentType === 'WHATSAPP'}
                                    onChange={() => setPaymentType('WHATSAPP')}
                                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-600 accent-green-600"
                                />
                            </div>
                            <div className="ml-4">
                                <span className="block font-medium text-gray-900 text-lg flex items-center gap-2">
                                    WhatsApp Momo Checkout
                                    <span className="bg-green-100 text-green-700 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold tracking-wider">Recommended</span>
                                </span>
                                <p className="text-sm text-gray-500 font-light mt-1 italic">Click to finalize order & chat with an admin for Momo details</p>
                            </div>
                        </label>

                        <label className={`flex flex-col p-4 sm:p-6 rounded-2xl cursor-pointer transition-all border ${paymentType === 'CUSTOM' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}>
                            <div className="flex items-start w-full">
                                <div className="mt-1">
                                    <input
                                        type="radio"
                                        name="payment_type"
                                        value="CUSTOM"
                                        checked={paymentType === 'CUSTOM'}
                                        onChange={() => setPaymentType('CUSTOM')}
                                        disabled={selectedTotal <= 0}
                                        className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black disabled:opacity-20"
                                    />
                                </div>
                                <div className="ml-4 flex-1">
                                    <span className="block font-medium text-gray-900 text-lg">Flexible Installment</span>
                                    <p className="text-sm text-gray-500 font-light mt-1">Choose how much you want to pay now</p>
                                </div>
                            </div>

                            {paymentType === 'CUSTOM' && (
                                <div className="ml-8 mt-4">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">GHS</span>
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                if (val > selectedTotal) return;
                                                setCustomAmount(e.target.value);
                                            }}
                                            placeholder="Enter amount (min 1.00)"
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-black focus:border-black transition-all"
                                            min="1"
                                            max={selectedTotal}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Remaining balance: {formatPrice(customAmount ? Math.max(0, selectedTotal - parseFloat(customAmount || '0')) : selectedTotal)}
                                    </p>
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
