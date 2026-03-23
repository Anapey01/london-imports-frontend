/**
 * London's Imports - Analytics Utilities
 * Standardized GA4 Event tracking for E-commerce
 */

export const GA_MEASUREMENT_ID = "G-VP24TKHC7C";

declare global {
    interface Window {
        gtag: (command: string, action: string, params?: Record<string, any>) => void;
        dataLayer: any[];
    }
}

// Helper for gtag
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        // Add user_id if present in local state/storage or passed in
        const gtagParams = { ...params };
        window.gtag('event', eventName, gtagParams);
    }
};

export const setAnalyticsUser = (userId: string | number) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
            'user_id': userId.toString()
        });
    }
};

// E-commerce specific events
export const trackViewItem = (product: any) => {
    trackEvent('view_item', {
        currency: 'GHS',
        value: product.price,
        items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category?.name,
            price: product.price,
            quantity: 1
        }]
    });
};

export const trackAddToCart = (product: any, quantity: number = 1) => {
    trackEvent('add_to_cart', {
        currency: 'GHS',
        value: product.price * quantity,
        items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category?.name,
            price: product.price,
            quantity: quantity
        }]
    });
};

export const trackBeginCheckout = (cart: any) => {
    trackEvent('begin_checkout', {
        currency: 'GHS',
        value: cart.total,
        items: cart.items.map((item: any) => ({
            item_id: item.product.id,
            item_name: item.product.name,
            price: item.unit_price,
            quantity: item.quantity
        }))
    });
};

export const trackPurchase = (order: any, reference: string) => {
    trackEvent('purchase', {
        transaction_id: reference,
        value: order.total,
        currency: 'GHS',
        tax: 0,
        shipping: order.delivery_fee || 0,
        items: order.items.map((item: any) => ({
            item_id: item.product.id,
            item_name: item.product.name,
            price: item.unit_price,
            quantity: item.quantity
        }))
    });
};
