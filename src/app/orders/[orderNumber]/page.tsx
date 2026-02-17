/**
 * London's Imports - Order Detail Page
 * Per website_specification.md: order dashboard, not just receipt
 */
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

const statusSteps = [
    { key: 'PAID', label: 'Paid' },
    { key: 'OPEN_FOR_BATCH', label: 'Order Confirmed' },
    { key: 'CUTOFF_REACHED', label: 'Processing' },
    { key: 'IN_FULFILLMENT', label: 'In Fulfillment' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
];

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderNumber = params.orderNumber as string;
    const { isAuthenticated } = useAuthStore();

    const { data, isLoading, error } = useQuery({
        queryKey: ['order', orderNumber],
        queryFn: () => ordersAPI.detail(orderNumber),
        enabled: isAuthenticated && !!orderNumber,
    });

    const order = data?.data;

    const getCurrentStep = () => {
        const stateIndex = statusSteps.findIndex(s => s.key === order?.state);
        return stateIndex >= 0 ? stateIndex : 0;
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="h-8 skeleton rounded w-1/3 mb-8"></div>
                <div className="bg-white rounded-xl p-6 space-y-4">
                    <div className="h-6 skeleton rounded w-1/4"></div>
                    <div className="h-4 skeleton rounded w-2/3"></div>
                    <div className="h-32 skeleton rounded"></div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
                <Link href="/orders" className="text-purple-600 hover:underline">Back to Orders</Link>
            </div>
        );
    }

    const currentStep = getCurrentStep();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <Link href="/orders" className="text-purple-600 hover:underline text-sm mb-2 inline-block">
                            ← Back to Orders
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Order #{order.order_number}</h1>
                        <p className="text-gray-600">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-GB', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                    {order.delivery_window && (
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Estimated Delivery</p>
                            <p className="font-semibold text-purple-600">{order.delivery_window}</p>
                        </div>
                    )}
                </div>

                {/* Progress Tracker / Action Bar */}
                {order.state === 'PENDING_PAYMENT' ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">Payment Pending</h2>
                                <p className="text-sm text-gray-600">Complete your payment to process this order.</p>
                            </div>
                        </div>
                        <Link
                            href={`/checkout?order=${order.order_number}`}
                            className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors text-center"
                        >
                            Complete Payment
                        </Link>
                    </div>
                ) : (order.state !== 'CANCELLED' && order.state !== 'REFUNDED' && (
                    <div className="bg-white rounded-xl p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h2>
                        <div className="flex justify-between relative">
                            {/* Progress line */}
                            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200">
                                <div
                                    className="h-full bg-purple-600 transition-all duration-500"
                                    style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                                />
                            </div>

                            {statusSteps.map((step, index) => (
                                <div key={step.key} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-400'
                                        }`}>
                                        {index < currentStep ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <span className="text-xs">{index + 1}</span>
                                        )}
                                    </div>
                                    <span className={`text-xs mt-2 text-center ${index <= currentStep ? 'text-purple-600 font-medium' : 'text-gray-400'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items?.map((item: any) => (
                                    <div key={item.id} className="flex justify-between py-3 border-b last:border-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product_name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} × GHS {item.unit_price?.toLocaleString()}</p>
                                        </div>
                                        <span className="font-medium">GHS {item.total_price?.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-white rounded-xl p-6 mt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>
                            <div className="text-gray-600">
                                <p>{order.delivery_address}</p>
                                <p>{order.delivery_city}, {order.delivery_region}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white rounded-xl p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>GHS {order.subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery</span>
                                    <span>GHS {order.delivery_fee?.toLocaleString()}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>GHS {order.total?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Paid</span>
                                    <span>GHS {order.amount_paid?.toLocaleString()}</span>
                                </div>
                                {order.balance_due > 0 && (
                                    <div className="flex justify-between text-orange-600">
                                        <span>Balance Due</span>
                                        <span>GHS {order.balance_due?.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Support Contact */}
                            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                                <p className="text-sm font-medium text-purple-900 mb-2">Need Help?</p>
                                <p className="text-sm text-purple-700">WhatsApp: +233 XX XXX XXXX</p>
                            </div>

                            {/* Cancel Button */}
                            {(order.state === 'PAID' || order.state === 'OPEN_FOR_BATCH') && (
                                <button
                                    onClick={() => {/* Cancel modal */ }}
                                    className="w-full mt-4 text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
