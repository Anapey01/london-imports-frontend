/**
 * London's Imports - Checkout Page
 * Per website_specification.md: fewer steps, clear restatement of terms
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, CartItem } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI } from '@/lib/api';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, fetchCart } = useCartStore();
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
            // Pre-fill from user profile only if empty
            if (user && !delivery.address) {
                setDelivery(prev => ({
                    ...prev,
                    address: user.address || '',
                    city: user.city || '',
                    region: user.region || '',
                }));
            }
        }
    }, [isAuthenticated, user, fetchCart, delivery.address]);

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

            // 2. Initiate payment or redirect to WhatsApp (Temporary)
            const WHATSAPP_NUMBER = '233541096372';
            const message = encodeURIComponent(
                `Hello London's Imports, I have placed Order #${order.order_number} for ${order.items?.length || 'several'} items.\n` +
                `Total Amount: GHS ${paymentAmount?.toLocaleString()}\n` +
                `Please provide your Momo number so I can complete payment.`
            );

            // Redirect to WhatsApp
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_self');

            // Clear cart from local state
            fetchCart();

        } catch (err: unknown) {
            let errorMessage = 'Checkout failed. Please try again.';

            if (err && typeof err === 'object' && 'response' in err) {
                // Safe access to error response
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
                                    disabled={isLoading}
                                    className="w-full mt-6 group relative flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <span>Processing...</span>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            Complete Order on WhatsApp
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
