/**
 * London's Imports - Checkout Page
 * Per website_specification.md: fewer steps, clear restatement of terms
 */
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useCartStore, CartItem } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI, paymentsAPI } from '@/lib/api';

// Paystack Interface
interface PaystackPop {
    setup: (config: any) => {
        openIframe: () => void;
    };
}

declare global {
    interface Window {
        PaystackPop?: PaystackPop;
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, fetchCart } = useCartStore();
    const { user, isAuthenticated } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
    const [error, setError] = useState('');
    const [paymentType, setPaymentType] = useState<'FULL' | 'DEPOSIT'>('FULL');

    const [delivery, setDelivery] = useState({
        address: '',
        city: '',
        region: '',
        notes: '',
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    // Pre-fill address when user profile loads
    useEffect(() => {
        if (user && !delivery.address) {
            setDelivery(prev => ({
                ...prev,
                address: user.address || prev.address,
                city: user.city || prev.city,
                region: user.region || prev.region,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (!isAuthenticated) {
        router.push('/login?redirect=/checkout');
        return null;
    }

    if (!cart || cart.items?.length === 0) {
        router.push('/cart');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // 1. Checkout - finalize order in backend
            const checkoutResponse = await ordersAPI.checkout({
                delivery_address: delivery.address,
                delivery_city: delivery.city,
                delivery_region: delivery.region,
                customer_notes: delivery.notes,
                payment_type: paymentType,
            });

            const { order } = checkoutResponse.data;

            // 2. Initialize Paystack
            if (!window.PaystackPop) {
                setError('Payment system not loaded. Please refresh.');
                setIsLoading(false);
                return;
            }

            const paystack = window.PaystackPop.setup({
                key: 'pk_live_19482f7bb4f2f8db7b75211e3b529e3233aee865', // Using Public Key from verify
                email: user?.email || 'customer@londonsimports.com',
                amount: Math.ceil(paymentAmount! * 100), // Convert GHS to pesewas (integer)
                currency: 'GHS',
                ref: order.order_number, // Use Order Number as ref or let Paystack generate one? Better to match.
                metadata: {
                    custom_fields: [
                        { display_name: "Order Number", variable_name: "order_number", value: order.order_number },
                        { display_name: "Customer Name", variable_name: "customer_name", value: user ? `${user.first_name} ${user.last_name}` : 'Guest' }
                    ]
                },
                callback: async function (response: any) {
                    try {
                        await paymentsAPI.verify(response.reference);
                        fetchCart(); // Clear local cart state
                        router.push(`/checkout/success?order=${order.order_number}`);
                    } catch (verifyErr) {
                        console.error('Verification failed', verifyErr);
                        setError('Payment successful but verification failed. Please contact support.');
                        setIsLoading(false);
                    }
                },
                onClose: function () {
                    setIsLoading(false);
                }
            });

            paystack.openIframe();

        } catch (err: unknown) {
            console.error('Checkout error:', err);
            let errorMessage = 'Checkout failed. Please try again.';

            if (err && typeof err === 'object' && 'response' in err) {
                const response = (err as { response: { data?: { error?: string } } }).response;
                if (response?.data?.error) {
                    errorMessage = response.data.error;
                }
            }
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    const paymentAmount = paymentType === 'DEPOSIT'
        ? (cart.total * 0.3) // 30% deposit if no specific deposit set
        : cart.total;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Delivery Information */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Information</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                            Delivery Address
                                        </label>
                                        <textarea
                                            value={delivery.address}
                                            onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                                            required
                                            rows={2}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                            placeholder="Enter your full address"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={delivery.city}
                                                onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                                placeholder="e.g., Accra"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                                Region
                                            </label>
                                            <select
                                                value={delivery.region}
                                                onChange={(e) => setDelivery({ ...delivery, region: e.target.value })}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                            >
                                                <option value="">Select Region</option>
                                                <option value="Greater Accra">Greater Accra</option>
                                                <option value="Ashanti">Ashanti</option>
                                                <option value="Western">Western</option>
                                                <option value="Central">Central</option>
                                                <option value="Eastern">Eastern</option>
                                                <option value="Northern">Northern</option>
                                                <option value="Volta">Volta</option>
                                                <option value="Upper East">Upper East</option>
                                                <option value="Upper West">Upper West</option>
                                                <option value="Bono">Bono</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                            Order Notes (Optional)
                                        </label>
                                        <textarea
                                            value={delivery.notes}
                                            onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                            placeholder="Any special instructions..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Option */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Option</h2>

                                <div className="space-y-3">
                                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentType === 'FULL' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-300 dark:border-slate-600'}`}>
                                        <input
                                            type="radio"
                                            name="payment_type"
                                            value="FULL"
                                            checked={paymentType === 'FULL'}
                                            onChange={() => setPaymentType('FULL')}
                                            className="text-purple-600"
                                        />
                                        <div className="ml-3">
                                            <span className="font-medium text-gray-900 dark:text-white">Full Payment</span>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">Pay GHS {cart.total?.toLocaleString()} now</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentType === 'DEPOSIT' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-300 dark:border-slate-600'}`}>
                                        <input
                                            type="radio"
                                            name="payment_type"
                                            value="DEPOSIT"
                                            checked={paymentType === 'DEPOSIT'}
                                            onChange={() => setPaymentType('DEPOSIT')}
                                            className="text-purple-600"
                                        />
                                        <div className="ml-3">
                                            <span className="font-medium text-gray-900 dark:text-white">Deposit Only</span>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">Pay GHS {(cart.total * 0.3).toLocaleString()} now, rest on delivery</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sticky top-24">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>

                                {/* Items */}
                                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                                    {cart.items?.map((item: CartItem) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-slate-400">{item.product.name} × {item.quantity}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">GHS {item.total_price?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t dark:border-slate-700 pt-4 space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-slate-400">Subtotal</span>
                                        <span className="font-medium text-gray-900 dark:text-white">GHS {cart.subtotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-slate-400">Delivery</span>
                                        <span className="font-medium text-gray-900 dark:text-white">GHS {cart.delivery_fee?.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t dark:border-slate-700 pt-3 flex justify-between text-base">
                                        <span className="font-semibold text-gray-900 dark:text-white">Order Total</span>
                                        <span className="font-bold text-gray-900 dark:text-white">GHS {cart.total?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-purple-600 dark:text-purple-400">
                                        <span className="font-semibold">Pay Now</span>
                                        <span className="font-bold">GHS {paymentAmount?.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Terms */}
                                <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-xs text-gray-600 dark:text-slate-300">
                                    <p>✓ Cancel before cutoff for full refund</p>
                                    <p>✓ Payment secured until delivery</p>
                                    <p>✓ Delivery in 2-4 weeks</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !isPaystackLoaded}
                                    className="w-full mt-6 group relative flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isLoading ? 'Processing...' : (
                                        <>
                                            Pay GHS {paymentAmount?.toLocaleString()}
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>

                                <p className="text-center mt-3 text-xs text-gray-500">
                                    Secured by Paystack
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Script
                src="https://js.paystack.co/v1/inline.js"
                strategy="lazyOnload"
                onLoad={() => setIsPaystackLoaded(true)}
            />
        </div>
    );
}
