/**
 * London's Imports - Checkout Page
 * Redesigned to match the premium, editorial aesthetic of the Wishlist/Cart
 */
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useCartStore, CartItem } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI, paymentsAPI } from '@/lib/api';
import { ShieldCheck, Truck, CreditCard, MapPin, Lock } from 'lucide-react';

// Paystack Interfaces
interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    transaction: string;
    trxref: string;
}

interface PaystackConfig {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref?: string;
    metadata?: {
        custom_fields: Array<{
            display_name: string;
            variable_name: string;
            value: string;
        }>;
    };
    callback: (response: PaystackResponse) => void;
    onClose: () => void;
}

interface PaystackPop {
    setup: (config: PaystackConfig) => {
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
                key: 'pk_live_19482f7bb4f2f8db7b75211e3b529e3233aee865', // Using Public Key
                email: user?.email || 'customer@londonsimports.com',
                amount: Math.ceil(paymentAmount! * 100), // Convert GHS to pesewas (integer)
                currency: 'GHS',
                ref: order.order_number,
                metadata: {
                    custom_fields: [
                        { display_name: "Order Number", variable_name: "order_number", value: order.order_number },
                        { display_name: "Customer Name", variable_name: "customer_name", value: user ? `${user.first_name} ${user.last_name}` : 'Guest' },
                        { display_name: "Phone Number", variable_name: "phone_number", value: user?.phone || 'Not provided' },
                        { display_name: "Delivery Address", variable_name: "delivery_address", value: `${delivery.address}, ${delivery.city}` }
                    ]
                },
                callback: function (response: PaystackResponse) {
                    // Paystack expects a synchronous callback, but we can fire async verification
                    paymentsAPI.verify(response.reference)
                        .then(() => {
                            fetchCart(); // Clear local cart state
                            router.push(`/checkout/success?order=${order.order_number}`);
                        })
                        .catch((verifyErr) => {
                            console.error('Verification failed', verifyErr);
                            setError('Payment successful but verification failed. Please contact support.');
                            setIsLoading(false);
                        });
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
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 md:pt-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12 border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-3">
                        <Lock className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
                        <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                            Secure Checkout
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT COLUMN: Forms */}
                    <div className="lg:col-span-7 space-y-6 lg:space-y-8">
                        {error && (
                            <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl border border-red-100 flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Delivery Information */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-light text-gray-900 tracking-tight">Delivery Details</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                                        Address
                                    </label>
                                    <textarea
                                        value={delivery.address}
                                        onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                                        required
                                        rows={2}
                                        className="w-full py-3 bg-transparent border-0 border-b border-gray-300 rounded-none text-gray-900 focus:border-b-black focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:ring-0 focus:outline-none focus-visible:outline-none transition-all font-light resize-none placeholder-gray-400 px-0"
                                        placeholder="Enter your full street address"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={delivery.city}
                                            onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                                            required
                                            className="w-full py-3 bg-transparent border-0 border-b border-gray-300 rounded-none text-gray-900 focus:border-b-black focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:ring-0 focus:outline-none focus-visible:outline-none transition-all font-light placeholder-gray-400 px-0"
                                            placeholder="Accra"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                                            Region
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={delivery.region}
                                                onChange={(e) => setDelivery({ ...delivery, region: e.target.value })}
                                                required
                                                aria-label="Region"
                                                className="w-full py-3 bg-transparent border-0 border-b border-gray-300 rounded-none text-gray-900 focus:border-b-black focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:ring-0 focus:outline-none focus-visible:outline-none transition-all font-light appearance-none px-0 cursor-pointer"
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
                                            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={delivery.notes}
                                        onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })}
                                        rows={2}
                                        className="w-full py-3 bg-transparent border-0 border-b border-gray-300 rounded-none text-gray-900 focus:border-b-black focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:ring-0 focus:outline-none focus-visible:outline-none transition-all font-light resize-none placeholder-gray-400 px-0"
                                        placeholder="Special delivery instructions..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Option */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <h2 className="text-xl font-light text-gray-900 tracking-tight">Payment Method</h2>
                            </div>

                            <div className="space-y-4">
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
                                        <p className="text-sm text-gray-500 font-light mt-1">Pay GHS {cart.total?.toLocaleString()} now</p>
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
                                        <p className="text-sm text-gray-500 font-light mt-1">Pay GHS {(cart.total * 0.3).toLocaleString()} (30%) now, rest on delivery</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-32">
                            <h2 className="text-xl font-light text-gray-900 mb-6 tracking-tight">Order Summary</h2>

                            {/* Items List (Compact) */}
                            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.items?.map((item: CartItem) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm group">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                                                {item.quantity}
                                            </span>
                                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors truncate p-1">
                                                {item.product.name}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900 whitespace-nowrap ml-4">GHS {item.total_price?.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-6 space-y-3">
                                <div className="flex justify-between text-gray-500 font-light">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">GHS {cart.subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-light">
                                    <span>Delivery</span>
                                    <span className="font-medium text-gray-900">
                                        {cart.delivery_fee > 0 ? `GHS ${cart.delivery_fee.toLocaleString()}` : 'Pay on Arrival'}
                                    </span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                                    <span className="text-lg text-gray-900 font-medium pb-1">Total</span>
                                    <span className="text-2xl sm:text-3xl font-light text-gray-900">GHS {cart.total?.toLocaleString()}</span>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 mt-4 flex justify-between items-center text-gray-900">
                                    <span className="font-medium">Due Now</span>
                                    <span className="font-bold text-lg sm:text-xl">GHS {paymentAmount?.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-8 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-2 border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-gray-900 slate" />
                                    <span>Payment secured by Paystack</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-gray-900" />
                                    <span>Delivery to your doorstep</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !isPaystackLoaded}
                                className="w-full mt-8 bg-gray-900 text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform active:scale-95 duration-200 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        <CreditCard className="w-4 h-4" />
                                        Pay GHS {paymentAmount?.toLocaleString()}
                                    </>
                                )}
                            </button>

                            <p className="text-center mt-4 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                                Secured by Paystack
                            </p>
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
