/**
 * London's Imports - Order Detail Page
 * Per website_specification.md: order dashboard, not just receipt
 */
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import NextImage from 'next/image';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { getImageUrl } from '@/lib/image';
import { Order, OrderItem } from '@/types';

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
    const orderNumber = params.orderNumber as string;
    const { isAuthenticated } = useAuthStore();

    const { data, isLoading, error } = useQuery({
        queryKey: ['order', orderNumber],
        queryFn: () => ordersAPI.detail(orderNumber),
        enabled: isAuthenticated && !!orderNumber,
    });

    const order: Order | undefined = data?.data;

    const getCurrentStep = () => {
        const stateIndex = statusSteps.findIndex(s => s.key === order?.state);
        return stateIndex >= 0 ? stateIndex : 0;
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
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
            <div className="max-w-4xl mx-auto px-4 py-16 text-center pt-32">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
                <Link href="/orders" className="text-purple-600 hover:underline">Back to Orders</Link>
            </div>
        );
    }

    const currentStep = getCurrentStep();
    const balanceDue = parseFloat(order.balance_due?.toString() || '0');
    const isPendingPayment = order.state === 'PENDING_PAYMENT' || balanceDue > 0;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <Link href="/orders" className="text-gray-500 hover:text-black text-sm mb-2 inline-flex items-center gap-1 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Orders
                        </Link>
                        <h1 className="text-3xl font-light text-gray-900 tracking-tight mt-2">Order #{order.order_number}</h1>
                        <p className="text-gray-500 font-light mt-1">
                            Placed on {new Date(order.created_at).toLocaleDateString(undefined, {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                    {order.delivery_window && (
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Est. Delivery</p>
                            <p className="font-medium text-gray-900">{order.delivery_window}</p>
                        </div>
                    )}
                </div>

                {/* Status Alert */}
                {isPendingPayment && order.state !== 'CANCELLED' && (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-medium text-gray-900">Payment Required</h2>
                                <p className="text-sm text-gray-600 font-light">
                                    {balanceDue > 0
                                        ? `A balance of GHS ${balanceDue.toLocaleString()} remains on this order.`
                                        : 'Please complete your payment to process this order.'}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={`/checkout?order=${order.order_number}`}
                            className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-pink-600 transition-colors text-center shadow-sm"
                        >
                            {balanceDue > 0 ? 'Pay Balance' : 'Complete Payment'}
                        </Link>
                    </div>
                )}

                {/* Progress Tracker */}
                {!['CANCELLED', 'REFUNDED', 'PENDING_PAYMENT'].includes(order.state) && (
                    <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-8">Order Lifecycle</h2>
                        <div className="flex justify-between relative">
                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100">
                                <div
                                    className={`h-full bg-gray-900 transition-all duration-700 ease-out ${['w-0', 'w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full'][currentStep] || 'w-0'
                                        }`}
                                />
                            </div>

                            {statusSteps.map((step, index) => (
                                <div key={step.key} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${index <= currentStep
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-white border-2 border-gray-100 text-gray-300'
                                        }`}>
                                        {index < currentStep ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <span className="text-xs">{index + 1}</span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] uppercase tracking-wider mt-3 text-center w-16 ${index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-400 font-light'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Items */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-light text-gray-900 mb-6">Order Items</h2>
                            <div className="divide-y divide-gray-100">
                                {order.items?.map((item: OrderItem) => (
                                    <div key={item.id} className="flex gap-4 py-6 first:pt-0 last:pb-0">
                                        <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                            {item.product?.image ? (
                                                <NextImage
                                                    src={getImageUrl(item.product.image)}
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={1.5} /></svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                                    <p className="text-xs text-gray-500 font-light">Qty: {item.quantity}</p>
                                                    {item.selected_size && <p className="text-xs text-gray-500 font-light">Size: {item.selected_size}</p>}
                                                    {item.selected_color && <p className="text-xs text-gray-500 font-light">Color: {item.selected_color}</p>}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <p className="text-xs text-gray-400 font-light">GHS {(item.unit_price || 0).toLocaleString()} / unit</p>
                                                <p className="text-base font-light text-gray-900">GHS {item.total_price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Grids */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">Delivery Address</h3>
                                <div className="text-sm text-gray-600 font-light space-y-1">
                                    <p className="text-gray-900 font-normal">{order.delivery_address}</p>
                                    <p>{order.delivery_city}, {order.delivery_region}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">Support</h3>
                                <p className="text-sm font-light text-gray-600 mb-4">Need help with this order? Contact our concierge team.</p>
                                <a href="https://wa.me/233543944686" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-pink-600 text-sm font-medium hover:text-pink-700 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.996-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.739c1.53.91 3.041 1.389 4.828 1.389 5.288 0 9.589-4.301 9.593-9.59 0-2.565-1.001-4.973-2.812-6.784s-4.219-2.812-6.783-2.812c-5.276 0-9.577 4.302-9.581 9.591-.001 1.905.508 3.454 1.47 4.904l-1.026 3.738 3.837-1.006z" /></svg>
                                    WhatsApp Concierge
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
                            <h2 className="text-lg font-light text-gray-900 mb-6">Financial Summary</h2>

                            <div className="space-y-4 text-sm font-light">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>GHS {order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Delivery</span>
                                    <span>GHS {order.delivery_fee.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between text-base font-normal text-gray-900">
                                    <span>Order Total</span>
                                    <span>GHS {order.total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-green-600 font-medium">
                                    <span>Amount Paid</span>
                                    <span>GHS {(order.amount_paid || 0).toLocaleString()}</span>
                                </div>
                                {balanceDue > 0 && (
                                    <div className="flex justify-between text-amber-600 font-medium pt-2">
                                        <span>Balance Due</span>
                                        <span>GHS {balanceDue.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            {isPendingPayment && order.state !== 'CANCELLED' && (
                                <Link
                                    href={`/checkout?order=${order.order_number}`}
                                    className="w-full mt-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-pink-600 transition-colors shadow-sm block text-center"
                                >
                                    Proceed to Payment
                                </Link>
                            )}

                            {(order.state === 'PAID' || order.state === 'OPEN_FOR_BATCH') && (
                                <button
                                    onClick={() => {/* Cancel modal */ }}
                                    className="w-full mt-4 text-xs text-gray-400 hover:text-red-500 transition-colors py-2"
                                >
                                    Request Cancellation
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
