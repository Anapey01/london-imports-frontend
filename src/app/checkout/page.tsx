'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore, type CartItem } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import Image from 'next/image';
import { ordersAPI, paymentsAPI } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { trackBeginCheckout, trackPurchase, trackAddShippingInfo, trackAddPaymentInfo, trackWhatsAppContact, trackCheckoutError, trackPaymentLifecycle, trackEvent } from '@/lib/analytics';
import { ExtendedCart, BackendError, type OrderItem } from '@/types';
import { AlertCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

import CheckoutSkeleton from '@/components/checkout/CheckoutSkeleton';

// New Component Imports
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import ResumeOrderNotice from '@/components/checkout/ResumeOrderNotice';
import DeliveryDetails from '@/components/checkout/DeliveryDetails';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';

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
    
type CheckoutViewData = {
    items: (CartItem | OrderItem)[]; 
    subtotal: number;
    total: number;
    delivery_fee: number;
    order_number?: string;
    id?: string;
    amount_paid?: number;
};

function CheckoutPage() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const { cart, fetchCart, clearCart, selectedItemIds } = useCartStore();
    const { user, isAuthenticated, isLoading: authLoading, fetchUser } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
    const [error, setError] = useState('');
    const [paymentType, setPaymentType] = useState<'FULL' | 'DEPOSIT' | 'CUSTOM' | 'BALANCE' | 'WHATSAPP'>('FULL');
    const [customAmount, setCustomAmount] = useState('');

    const [activeStep, setActiveStep] = useState(1);
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

    const hasTrackedCheckout = useRef(false);
    const hasTrackedShipping = useRef(false);
    const hasTrackedPayment = useRef(false);
    
    // 4. Conversion Velocity: Step Timers
    const stepStartTime = useRef(Date.now());
    const prevStep = useRef(activeStep);

    const searchParams = useSearchParams();
    const orderNumberParam = searchParams.get('order');

    const currentOrderData = useMemo((): CheckoutViewData => {
        if (checkoutOrder) return checkoutOrder as unknown as CheckoutViewData;
        
        const buyNowSlug = searchParams.get('buyNow');
        if (cart && buyNowSlug) {
            const buyNowItem = cart.items.find(item => item.product.slug === buyNowSlug);
            if (buyNowItem) {
                return {
                    ...cart,
                    items: [buyNowItem],
                    subtotal: Number(buyNowItem.total_price),
                    total: Number(buyNowItem.total_price),
                };
            }
        }
        
        if (cart) return cart as CheckoutViewData;
        return { items: [], total: 0, subtotal: 0, delivery_fee: 0 } as CheckoutViewData;
    }, [checkoutOrder, cart, searchParams]);

    useEffect(() => {
        if (delivery.address && delivery.city && delivery.region && activeStep === 1) {
            if (!hasTrackedShipping.current) {
                trackAddShippingInfo(currentOrderData);
                hasTrackedShipping.current = true;
            }
        }
    }, [delivery, activeStep, currentOrderData]);

    const [saveAddress, setSaveAddress] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    useEffect(() => {
        if (cart && cart.items.length > 0 && !hasTrackedCheckout.current) {
            trackBeginCheckout(cart);
            hasTrackedCheckout.current = true;
        }
    }, [cart]);

    useEffect(() => {
        if (isPaystackLoaded) return;

        const scriptId = 'paystack-inline-js';
        if (document.getElementById(scriptId)) {
            if (window.PaystackPop) setIsPaystackLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        script.onload = () => {
            setIsPaystackLoaded(true);
        };
        document.body.appendChild(script);
    }, [isPaystackLoaded]);

    useEffect(() => {
        if (orderNumberParam && isAuthenticated) {
            ordersAPI.detail(orderNumberParam)
                .then((res: { data: ExtendedCart }) => {
                    const orderItem = res.data;
                    setCheckoutOrder(orderItem);
                    if (orderItem.delivery_address) {
                        setDelivery({
                            address: orderItem.delivery_address,
                            city: orderItem.delivery_city || '',
                            region: orderItem.delivery_region || '',
                            delivery_gps: orderItem.delivery_gps || '',
                            notes: orderItem.customer_notes || ''
                        });
                        setActiveStep(2);
                    }
                })
                .catch((err: BackendError) => {
                    console.error("Order fetch error:", err);
                    setError('Could not load order details');
                });
        } else if (!orderNumberParam && isAuthenticated && user) {
            const saved = sessionStorage.getItem('londons_checkout_delivery');
            if (saved) {
                try {
                    setDelivery(JSON.parse(saved));
                } catch (e) { console.error("Failed to parse saved checkout", e); }
            }

            setDelivery(prev => {
                if (prev.address) return prev;
                return {
                    ...prev,
                    address: user.address || '',
                    city: user.city || '',
                    region: user.region || '',
                    delivery_gps: user.ghana_post_gps || ''
                };
            });
        }
    }, [orderNumberParam, isAuthenticated, user]);

    useEffect(() => {
        if (!orderNumberParam && delivery.address) {
            sessionStorage.setItem('londons_checkout_delivery', JSON.stringify(delivery));
        }
    }, [delivery, orderNumberParam]);

    const paymentAmount = useMemo(() => {
        const selSubtotal = (currentOrderData.items || [])
            .filter((i: CartItem | OrderItem) => checkoutOrder || orderNumberParam ? true : selectedItemIds.has(i.id))
            .reduce((sum: number, i: CartItem | OrderItem) => sum + (Number(i.unit_price || 0) * i.quantity), 0);
            
        // CRITICAL: Coerce all values to Numbers to prevent string concatenation ("860" + "0" = "8600")
        const subtotal = Number(checkoutOrder?.subtotal || currentOrderData.subtotal || selSubtotal || 0);
        const delivery = Number(checkoutOrder?.delivery_fee || currentOrderData.delivery_fee || 0);
        const totalValue = subtotal + delivery;
        
        const totalPaid = checkoutOrder ? Number(checkoutOrder.amount_paid || 0) : 0;
        const balanceDue = Math.max(0, totalValue - totalPaid);

        if (paymentType === 'BALANCE') return balanceDue;
        if (paymentType === 'DEPOSIT') return totalValue * 0.3; // 30% Deposit
        if (paymentType === 'CUSTOM' && customAmount) return parseFloat(customAmount);
        if (paymentType === 'WHATSAPP') return 0;
        return balanceDue;
    }, [paymentType, currentOrderData, customAmount, checkoutOrder, selectedItemIds, orderNumberParam]);
    useEffect(() => {
        const now = Date.now();
        const duration = Math.round((now - stepStartTime.current) / 1000);
        
        if (prevStep.current !== activeStep) {
            trackEvent('checkout_step_duration', {
                step_number: prevStep.current,
                step_name: prevStep.current === 1 ? 'Delivery' : prevStep.current === 2 ? 'Payment' : 'Review',
                duration_seconds: duration
            });
            stepStartTime.current = now;
            prevStep.current = activeStep;
        }
    }, [activeStep]);

    useEffect(() => {
        if (authLoading || isLoading) return;

        if (!checkoutOrder && !orderNumberParam && (currentOrderData.items?.length || 0) === 0) {
            router.push('/cart');
            return;
        }
    }, [currentOrderData.items, authLoading, selectedItemIds, checkoutOrder, orderNumberParam, isLoading, router]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (isLoading) return;
        setError('');
        setIsLoading(true);

        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_7f1c1f3074d6438db02c462788e9ebc9dfd6c0b9';

        if (!publicKey) {
            setError('Payment configuration is missing. Please contact support.');
            setIsLoading(false);
            return;
        }

        if (!isAuthenticated || !user?.email) {
            setError('Please sign in to finish your purchase.');
            setIsLoading(false);
            setTimeout(() => {
                router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
            }, 3000);
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

            const res = await ordersAPI.checkout(orderPayload);
            const orderToPay = res.data.order || res.data;
            setCheckoutOrder(orderToPay);

            if (currentOrderData) {
                if (!hasTrackedShipping.current) {
                    trackAddShippingInfo(currentOrderData);
                    hasTrackedShipping.current = true;
                }
                if (!hasTrackedPayment.current) {
                    trackAddPaymentInfo(currentOrderData, paymentType);
                    hasTrackedPayment.current = true;
                }
            }

            if (paymentType === 'WHATSAPP') {
                trackWhatsAppContact(orderToPay?.items?.[0]?.product?.name || 'Order', 'purchase');
                const message = encodeURIComponent(`Hi, I'd like to pay for my order #${orderToPay?.order_number}. Total: ${formatPrice(orderToPay?.total || 0)}.`);
                window.open(`https://wa.me/${siteConfig.concierge}?text=${message}`, '_blank');
                router.push(`/checkout/success?order_number=${orderToPay?.order_number}&method=whatsapp`);
                return;
            }

            const paystack = window.PaystackPop;
            if (!paystack) {
                trackPaymentLifecycle('failure', { error_code: 'paystack_not_found', provider: 'paystack' });
                throw new Error("Payment gateway not ready. Please try again or use WhatsApp.");
            }

            // BUG-17 FIX: Guard against zero/negative payment amounts before opening Paystack
            if (paymentAmount <= 0) {
                setError('Payment amount is invalid. Please refresh and try again.');
                setIsLoading(false);
                return;
            }

            trackPaymentLifecycle('selection', { provider: 'paystack', amount: paymentAmount });

            const handler = paystack.setup({
                key: publicKey,
                email: user?.email || '',
                amount: Math.round(paymentAmount * 100),
                currency: 'GHS',
                ref: `LI-${Date.now()}-${orderToPay?.order_number}`,
                metadata: {
                    custom_fields: [
                        { display_name: "Order Number", variable_name: "order_number", value: orderToPay?.order_number || '' },
                        { display_name: "Payment Type", variable_name: "payment_type", value: paymentType }
                    ]
                },
                callback: (response: PaystackResponse) => {
                    trackPaymentLifecycle('authorization', { reference: response.reference, provider: 'paystack' });
                    handleVerification(response);
                },
                onClose: () => {
                    setIsLoading(false);
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
                    
                    if (saveAddress) await fetchUser();
                    if (orderToPay) trackPurchase(orderToPay, response.reference);
                    trackPaymentLifecycle('success', { order_number: orderToPay?.order_number, provider: 'paystack' });
                    
                    clearCart();
                    sessionStorage.removeItem('londons_checkout_delivery');
                    router.push(`/checkout/success?order_number=${orderToPay?.order_number}&method=paystack`);
                } catch (verifyErr: any) {
                    const serverMessage = verifyErr.response?.data?.error || verifyErr.response?.data?.message || String(verifyErr);
                    console.error('Verification failed:', serverMessage);
                    trackPaymentLifecycle('failure', { step: 'verification', error: serverMessage, provider: 'paystack' });
                    setError('Payment check failed. Please message us on WhatsApp with your order number.');
                    setIsLoading(false);
                }
            }
        } catch (err: unknown) {
            console.error("Checkout Error:", err);
            const backendError = err as BackendError;
            const errorData = backendError.response?.data;
            let errorMessage = 'Error processing request';

            if (errorData && typeof errorData === 'object') {
                const detailedError = errorData as { error?: string; message?: string; detail?: string };
                errorMessage = detailedError.error || detailedError.message || detailedError.detail || 'Checkout failed';
            } else if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            trackCheckoutError('submission_error', errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface pt-16 pb-12 md:pt-20 px-4 sm:px-6 lg:px-8 font-sans transition-all duration-500 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <CheckoutHeader />

                <form ref={formRef} onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-6 lg:gap-8">
                    <div className="lg:col-span-7 space-y-4 lg:space-y-5">
                        {orderNumberParam && <ResumeOrderNotice orderNumber={orderNumberParam} />}

                        <DeliveryDetails
                            orderNumberParam={orderNumberParam}
                            delivery={delivery}
                            setDelivery={setDelivery}
                            saveAddress={saveAddress}
                            setSaveAddress={setSaveAddress}
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                        />

                        <PaymentMethodSelector
                            paymentType={paymentType}
                            setPaymentType={setPaymentType}
                            currentOrderData={currentOrderData}
                            customAmount={customAmount}
                            setCustomAmount={setCustomAmount}
                            selectedItemIds={selectedItemIds}
                            activeStep={activeStep}
                            setActiveStep={(step: number) => {
                                if (step === 3 && activeStep === 2 && !hasTrackedPayment.current) {
                                    trackAddPaymentInfo(currentOrderData, paymentType);
                                    hasTrackedPayment.current = true;
                                }
                                setActiveStep(step);
                            }}
                        />

                        {/* Step 3: Review items and shipping */}
                        <div className={`bg-surface rounded-2xl border transition-all duration-500 overflow-hidden ${activeStep === 3 ? 'border-emerald-500/30 shadow-diffusion-lg ring-1 ring-emerald-500/10' : 'border-border-standard opacity-90'}`}>
                            <div className="flex items-center gap-4 p-6 sm:p-7 border-b border-border-standard">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${activeStep === 3 ? 'bg-content-primary text-surface scale-110 shadow-lg' : 'bg-surface border border-border-standard text-content-secondary'}`}>
                                    3
                                </div>
                                <h2 className={`font-black uppercase tracking-widest text-[11px] transition-colors ${activeStep === 3 ? 'text-content-primary' : 'text-content-secondary'}`}>
                                    Review items and shipping
                                </h2>
                            </div>

                            <div className={`transition-all duration-500 ease-in-out ${activeStep === 3 ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                <div className="p-6 sm:p-7 space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        {(currentOrderData.items || [])
                                            .filter((item: CartItem | OrderItem) => checkoutOrder || orderNumberParam ? true : selectedItemIds.has(item.id))
                                            .map((item: CartItem | OrderItem) => (
                                                <div key={item.id} className="flex gap-4 items-center p-4 bg-surface border border-border-standard rounded-xl">
                                                    <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center border border-border-standard p-1 relative">
                                                        {(item.product.image) && (
                                                            <Image 
                                                                src={item.product.image} 
                                                                alt={item.product.name}
                                                                fill
                                                                className="object-contain rounded-md"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[11px] font-black text-content-primary truncate">{item.product?.name}</p>
                                                        <p className="text-[10px] text-content-secondary font-bold">Qty: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[11px] font-black text-content-primary">{formatPrice(item.total_price)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    
                                    <div className="pt-6 border-t border-border-standard flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Ready for dispatch</span>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => handleSubmit()}
                                            disabled={isLoading}
                                            className="px-10 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[11px] uppercase tracking-[0.2em] font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                                        >
                                            {isLoading ? 'Processing...' : 'Place your order'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-24 space-y-5">
                            <OrderSummary
                                currentOrderData={currentOrderData}
                                selectedItemIds={selectedItemIds}
                                checkoutOrder={checkoutOrder}
                                orderNumberParam={orderNumberParam}
                                paymentAmount={paymentAmount}
                                onSubmit={handleSubmit}
                                isSubmitting={isLoading}
                                activeStep={activeStep}
                            />

                            {error && (
                                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                                                const registrations = await navigator.serviceWorker.getRegistrations();
                                                for (const registration of registrations) {
                                                    await registration.unregister();
                                                }
                                                if ('caches' in window) {
                                                    const cacheKeys = await caches.keys();
                                                    await Promise.all(cacheKeys.map(key => caches.delete(key)));
                                                }
                                                window.location.reload();
                                            }
                                        }}
                                        className="text-[10px] text-red-400 hover:text-red-600 underline text-left transition-colors duration-200"
                                    >
                                        Still having trouble? Click here to fix errors and refresh
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CheckoutPageWrapper() {
    return (
        <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutPage />
        </Suspense>
    );
}
