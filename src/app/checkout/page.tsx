'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore, type CartItem } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { ordersAPI, paymentsAPI } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { trackBeginCheckout, trackPurchase } from '@/lib/analytics';
import { ExtendedCart, BackendError, type OrderItem } from '@/types';
import { AlertCircle } from 'lucide-react';

// New Component Imports
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import ResumeOrderNotice from '@/components/checkout/ResumeOrderNotice';
import DeliveryDetails from '@/components/checkout/DeliveryDetails';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import CheckoutSubmitButton from '@/components/checkout/CheckoutSubmitButton';


// Paystack types for global window
interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    transaction: string;
    trxref: string;
}

interface PaystackOptions {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
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

declare global {
    interface Window {
        PaystackPop: {
            setup: (options: PaystackOptions) => {
                openIframe: () => void;
            };
        };
    }
}

function CheckoutPage() {
    const router = useRouter();
    const { cart, fetchCart, clearCart, selectedItemIds } = useCartStore();
    const { user, isAuthenticated, isLoading: authLoading, fetchUser } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
    const [error, setError] = useState('');
    const [canPay, setCanPay] = useState(true);
    const formRef = useRef<HTMLFormElement>(null);
    const [paymentType, setPaymentType] = useState<'FULL' | 'DEPOSIT' | 'CUSTOM' | 'BALANCE' | 'WHATSAPP'>('FULL');
    const [customAmount, setCustomAmount] = useState('');
    const [connectionTimeout, setConnectionTimeout] = useState(false);
    const [connectionProgress, setConnectionProgress] = useState(0);

    const [checkoutOrder, setCheckoutOrder] = useState<ExtendedCart | null>(null);
    const [delivery, setDelivery] = useState<{
        address: string;
        city: string;
        region: string;
        delivery_gps: string;
        notes: string;
    }>({
        address: '',
        city: '',
        region: '',
        delivery_gps: '',
        notes: '',
    });
    const [saveAddress, setSaveAddress] = useState(false);

    const searchParams = useSearchParams();
    const orderNumberParam = searchParams.get('order');

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    useEffect(() => {
        if (cart && cart.items.length > 0) {
            trackBeginCheckout(cart);
        }
    }, [cart]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        let progressInterval: NodeJS.Timeout;

        if (isLoading && !isPaystackLoaded && paymentType !== 'WHATSAPP') {
            setConnectionTimeout(false);
            setConnectionProgress(0);

            progressInterval = setInterval(() => {
                setConnectionProgress(prev => Math.min(prev + 1, 95));
            }, 100);

            timer = setTimeout(() => {
                setConnectionTimeout(true);
                setConnectionProgress(100);
            }, 10000);
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (progressInterval) clearInterval(progressInterval);
        };
    }, [isLoading, isPaystackLoaded, paymentType]);

    useEffect(() => {
        if (!formRef.current || isPaystackLoaded) return;

        const scriptId = 'paystack-inline-js';
        if (document.getElementById(scriptId)) {
            if (window.PaystackPop) setIsPaystackLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        script.onload = () => {
            setIsPaystackLoaded(true);
        };
        formRef.current.appendChild(script);
    }, [isPaystackLoaded]);

    useEffect(() => {
        if (orderNumberParam && isAuthenticated) {
            ordersAPI.detail(orderNumberParam)
                .then(res => {
                    const orderData = res.data;
                    setCheckoutOrder(orderData);
                    setDelivery({
                        address: orderData.delivery_address || '',
                        city: orderData.delivery_city || '',
                        region: orderData.delivery_region || '',
                        delivery_gps: orderData.delivery_gps || '',
                        notes: orderData.customer_notes || '',
                    });
                    if (orderData.state === 'PARTIALLY_PAID') {
                        setPaymentType('BALANCE');
                    }
                })
                .catch(err => {
                    console.error("Order Load Error:", err);
                    setError('Could not load order details');
                });
        } else if (!orderNumberParam && isAuthenticated && user) {
            // Priority 1: Check sessionStorage for in-progress checkout
            const saved = sessionStorage.getItem('londons_checkout_delivery');
            if (saved) {
                try {
                    setDelivery(JSON.parse(saved));
                    return; 
                } catch (e) { console.error("Failed to parse saved checkout", e); }
            }

            // Priority 2: Smart Pre-fill from User Profile (Only if session is empty)
            setDelivery(prev => {
                if (prev.address) return prev;
                return {
                    address: user.address || '',
                    city: user.city || '',
                    region: user.region || '',
                    delivery_gps: user.ghana_post_gps || '',
                    notes: '',
                };
            });
        }
    }, [orderNumberParam, isAuthenticated, user]);

    // ABSOLUTE CERTAINTY: Persist form changes to session storage
    useEffect(() => {
        if (!orderNumberParam && delivery.address) {
            sessionStorage.setItem('londons_checkout_delivery', JSON.stringify(delivery));
        }
    }, [delivery, orderNumberParam]);

    const currentOrderData = useMemo(() => {
        if (checkoutOrder) return checkoutOrder;
        
        const buyNowSlug = searchParams.get('buyNow');
        if (cart && buyNowSlug) {
            // Find the item added by Buy Now
            // We look for the most recently updated item matching this slug
            const buyNowItem = cart.items.find(item => item.product.slug === buyNowSlug);
            if (buyNowItem) {
                return {
                    ...cart,
                    items: [buyNowItem],
                    subtotal: buyNowItem.total_price,
                    total: buyNowItem.total_price, // Removed delivery fee
                };
            }
        }
        
        if (cart) return cart;
        return { items: [], total: 0, subtotal: 0, delivery_fee: 0 };
    }, [checkoutOrder, cart, searchParams]);

    const paymentAmount = useMemo(() => {
        // Calculate total of ONLY selected items
        const selSubtotal = (currentOrderData.items || [])
            .filter((i: CartItem | OrderItem) => checkoutOrder || orderNumberParam ? true : selectedItemIds.has(i.id))
            .reduce((sum: number, i: CartItem | OrderItem) => sum + Number(i.total_price || 0), 0);
            
        const totalValue = selSubtotal; // Removed delivery fee addition
        const totalPaid = checkoutOrder ? Number(checkoutOrder.amount_paid || 0) : 0;
        const balanceDue = Math.max(0, totalValue - totalPaid);

        if (paymentType === 'BALANCE') return balanceDue;
        if (paymentType === 'DEPOSIT') return totalValue * 0.3;
        if (paymentType === 'CUSTOM' && customAmount) return parseFloat(customAmount);
        if (paymentType === 'WHATSAPP') return 0;
        return balanceDue;
    }, [paymentType, currentOrderData.items, customAmount, checkoutOrder, selectedItemIds, orderNumberParam]);


    useEffect(() => {
        const selSubtotal = (currentOrderData.items || [])
            .filter((i: CartItem | OrderItem) => checkoutOrder || orderNumberParam ? true : selectedItemIds.has(i.id))
            .reduce((sum: number, i: CartItem | OrderItem) => sum + Number(i.total_price || 0), 0);
        
        const total = selSubtotal; // Removed delivery fee addition
        
        // ABSOLUTE CERTAINTY: Wait for both auth and cart stores to hydrate before deciding to redirect
        if (authLoading || isLoading) return;

        // Redirect if no items and not loading
        if (!checkoutOrder && !orderNumberParam && (currentOrderData.items?.length || 0) === 0) {
            router.push('/cart');
            return;
        }

        if (total <= 0) {
            setCanPay(false);
        } else {
            setCanPay(true);
        }
    }, [currentOrderData.items, authLoading, selectedItemIds, checkoutOrder, orderNumberParam, isLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!isAuthenticated || !user?.email) {
            setError('Please sign in with a valid account to complete your purchase.');
            setIsLoading(false);
            // Optionally redirect to login after a short delay
            setTimeout(() => {
                router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
            }, 2000);
            return;
        }

        if (paymentType === 'CUSTOM' && (!customAmount || parseFloat(customAmount) <= 0)) {
            setError('Please enter a valid installment amount');
            setIsLoading(false);
            return;
        }

        try {
            const buyNowSlug = searchParams.get('buyNow');
            let targetItemIds = Array.from(selectedItemIds);
            
            // If Buy Now, find that specific item in the cart to isolate it
            if (buyNowSlug && cart) {
                const buyNowItem = cart.items.find(item => item.product.slug === buyNowSlug);
                if (buyNowItem) {
                    targetItemIds = [buyNowItem.id];
                }
            }

            const orderPayload = {
                item_ids: targetItemIds.length > 0 ? targetItemIds : undefined,
                delivery_address: delivery.address,
                delivery_city: delivery.city,
                delivery_region: delivery.region,
                delivery_gps: delivery.delivery_gps,
                save_address: saveAddress,
                customer_notes: delivery.notes,
                payment_type: paymentType === 'BALANCE' ? 'FULL' : paymentType,
                custom_amount: paymentType === 'CUSTOM' ? parseFloat(customAmount) : undefined,
            };

            // Always call checkout before payment to ensure the latest delivery details are synced to the backend
            const res = await ordersAPI.checkout(orderPayload);
            const orderToPay = res.data.order || res.data; // Backend returns {order, ...} or just order
            setCheckoutOrder(orderToPay);

            if (paymentType === 'WHATSAPP') {
                const message = encodeURIComponent(`Hi, I'd like to pay for my order #${orderToPay?.order_number}. Total: ${formatPrice(orderToPay?.total || 0)}.`);
                window.open(`https://wa.me/233535698330?text=${message}`, '_blank');
                router.push('/orders');
                return;
            }

            const paystack = window.PaystackPop;
            if (!paystack) {
                throw new Error("Payment gateway not ready. Please try again or use WhatsApp.");
            }

            const handler = paystack.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_7f1c1f3074d6438db02c462788e9ebc9dfd6c0b9',
                email: user?.email || '',
                amount: Math.round(paymentAmount * 100),
                currency: 'GHS',
                ref: `LTRX-${Date.now()}-${orderToPay?.order_number}`,
                metadata: {
                    custom_fields: [
                        { display_name: "Order ID", variable_name: "order_id", value: orderToPay?.order_number || '' },
                        { display_name: "Payment Type", variable_name: "payment_type", value: paymentType }
                    ]
                },
                callback: (response: PaystackResponse) => {
                    // Refactored to non-async for library compatibility
                    handleVerification(response);
                },
                onClose: () => {
                    setIsLoading(false);
                    // ABSOLUTE CERTAINTY: Provide clear guidance if window is closed
                    setError('Payment window closed. You can resume this order anytime from your dashboard.');
                }
            });
            handler.openIframe();

            async function handleVerification(response: PaystackResponse) {
                try {
                    setIsLoading(true);
                    await paymentsAPI.verify({
                        reference: response.reference,
                        order_number: orderToPay?.order_number || '',
                        payment_type: paymentType,
                        amount: paymentAmount
                    });
                    
                    // Profile Sync: Refresh user to confirm address save
                    if (saveAddress) {
                        await fetchUser();
                    }
                    
                    if (orderToPay) {
                        trackPurchase(orderToPay, response.reference);
                    }
                    clearCart();
                    // ABSOLUTE CERTAINTY: Clear session storage on successful completion
                    sessionStorage.removeItem('londons_checkout_delivery');
                    router.push('/orders?success=true');
                } catch (verifyErr) {
                    console.error('Verification failed:', verifyErr);
                    setError('Payment verification failed. Please contact support via WhatsApp with your order number.');
                    setIsLoading(false);
                }
            }

        } catch (err: unknown) {
            console.error("Checkout Error:", err);
            const backendError = err as BackendError;
            const errorData = backendError.response?.data;
            if (errorData && typeof errorData === 'object') {
                const detailedError = errorData as { error?: string; message?: string; detail?: string };
                setError(detailedError.error || detailedError.message || detailedError.detail || 'Checkout failed');
            } else if (typeof errorData === 'string') {
                setError(errorData);
            } else {
                setError(err instanceof Error ? err.message : 'Error processing request');
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 md:pt-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <CheckoutHeader />

                <form ref={formRef} onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-7 space-y-6 lg:space-y-8">
                        {orderNumberParam && <ResumeOrderNotice orderNumber={orderNumberParam} />}

                        <DeliveryDetails
                            orderNumberParam={orderNumberParam}
                            delivery={delivery}
                            setDelivery={setDelivery}
                            saveAddress={saveAddress}
                            setSaveAddress={setSaveAddress}
                        />

                        <PaymentMethodSelector
                            paymentType={paymentType}
                            setPaymentType={setPaymentType}
                            currentOrderData={currentOrderData}
                            customAmount={customAmount}
                            setCustomAmount={setCustomAmount}
                            selectedItemIds={selectedItemIds}
                        />
                    </div>

                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-32 space-y-6">
                            <OrderSummary
                                currentOrderData={currentOrderData}
                                selectedItemIds={selectedItemIds}
                                checkoutOrder={checkoutOrder}
                                orderNumberParam={orderNumberParam}
                                paymentAmount={paymentAmount}
                            />

                            {error && (
                                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-xs font-medium">{error}</p>
                                </div>
                            )}

                            <CheckoutSubmitButton
                                isLoading={isLoading}
                                isPaystackLoaded={isPaystackLoaded}
                                canPay={canPay}
                                paymentType={paymentType}
                                paymentAmount={paymentAmount}
                                connectionTimeout={connectionTimeout}
                                connectionProgress={connectionProgress}
                                setPaymentType={setPaymentType}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CheckoutPageWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin" /></div>}>
            <CheckoutPage />
        </Suspense>
    );
}
