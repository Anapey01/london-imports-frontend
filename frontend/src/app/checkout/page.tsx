/**
 * London's Imports - Checkout Page
 * Per website_specification.md: fewer steps, clear restatement of terms
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI, paymentsAPI } from '@/lib/api';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, fetchCart, clearCart } = useCartStore();
    const { user, isAuthenticated } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
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
            // Pre-fill from user profile
            if (user) {
                setDelivery({
                    address: user.address || '',
                    city: user.city || '',
                    region: user.region || '',
                    notes: '',
                });
            }
        }
    }, [isAuthenticated, user, fetchCart]);

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
            // 1. Checkout - finalize order
            const checkoutResponse = await ordersAPI.checkout({
                delivery_address: delivery.address,
                delivery_city: delivery.city,
                delivery_region: delivery.region,
                customer_notes: delivery.notes,
                payment_type: paymentType,
            });

            const { order } = checkoutResponse.data;

            // 2. Initiate payment
            const paymentResponse = await paymentsAPI.initiate(order.order_number, paymentType);

            // 3. Redirect to Paystack
            window.location.href = paymentResponse.data.authorization_url;

        } catch (err: any) {
            setError(err.response?.data?.error || 'Checkout failed. Please try again.');
            setIsLoading(false);
        }
    };

    const paymentAmount = paymentType === 'DEPOSIT'
        ? (cart.total * 0.3) // 30% deposit if no specific deposit set
        : cart.total;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Delivery Information */}
                            <div className="bg-white rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Delivery Address
                                        </label>
                                        <textarea
                                            value={delivery.address}
                                            onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                                            required
                                            rows={2}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter your full address"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={delivery.city}
                                                onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                                placeholder="e.g., Accra"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Region
                                            </label>
                                            <select
                                                value={delivery.region}
                                                onChange={(e) => setDelivery({ ...delivery, region: e.target.value })}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Order Notes (Optional)
                                        </label>
                                        <textarea
                                            value={delivery.notes}
                                            onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            placeholder="Any special instructions..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Option */}
                            <div className="bg-white rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Option</h2>

                                <div className="space-y-3">
                                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentType === 'FULL' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="payment_type"
                                            value="FULL"
                                            checked={paymentType === 'FULL'}
                                            onChange={() => setPaymentType('FULL')}
                                            className="text-purple-600"
                                        />
                                        <div className="ml-3">
                                            <span className="font-medium text-gray-900">Full Payment</span>
                                            <p className="text-sm text-gray-500">Pay GHS {cart.total?.toLocaleString()} now</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentType === 'DEPOSIT' ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="payment_type"
                                            value="DEPOSIT"
                                            checked={paymentType === 'DEPOSIT'}
                                            onChange={() => setPaymentType('DEPOSIT')}
                                            className="text-purple-600"
                                        />
                                        <div className="ml-3">
                                            <span className="font-medium text-gray-900">Deposit Only</span>
                                            <p className="text-sm text-gray-500">Pay GHS {(cart.total * 0.3).toLocaleString()} now, rest on delivery</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl p-6 sticky top-24">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                                {/* Items */}
                                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                                    {cart.items?.map((item: any) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{item.product_name} × {item.quantity}</span>
                                            <span className="font-medium">GHS {item.total_price?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">GHS {cart.subtotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery</span>
                                        <span className="font-medium">GHS {cart.delivery_fee?.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-base">
                                        <span className="font-semibold">Order Total</span>
                                        <span className="font-bold">GHS {cart.total?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-purple-600">
                                        <span className="font-semibold">Pay Now</span>
                                        <span className="font-bold">GHS {paymentAmount?.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Terms */}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                                    <p>✓ Cancel before cutoff for full refund</p>
                                    <p>✓ Payment secured until delivery</p>
                                    <p>✓ Delivery in 2-4 weeks</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-primary mt-6 disabled:opacity-50"
                                >
                                    {isLoading ? 'Processing...' : `Pay GHS ${paymentAmount?.toLocaleString()}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
