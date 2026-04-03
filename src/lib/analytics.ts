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
        const gtagParams = { ...params };
        
        // Ensure numeric fields are actually numbers for GA4
        if (gtagParams.value !== undefined) gtagParams.value = Number(gtagParams.value);
        if (gtagParams.price !== undefined) gtagParams.price = Number(gtagParams.price);
        if (gtagParams.shipping !== undefined) gtagParams.shipping = Number(gtagParams.shipping);
        if (gtagParams.tax !== undefined) gtagParams.tax = Number(gtagParams.tax);
        
        if (gtagParams.items && Array.isArray(gtagParams.items)) {
            gtagParams.items = gtagParams.items.map((item: any) => ({
                ...item,
                price: item.price !== undefined ? Number(item.price) : undefined,
                quantity: item.quantity !== undefined ? Number(item.quantity) : undefined
            }));
        }

        window.gtag('event', eventName, gtagParams);
    }
};

export const setAnalyticsUser = (userId: string | number) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
            'user_id': userId.toString(),
            'send_page_view': false // Prevent double page view on config update
        });
    }
};

export const trackLogin = (method: string = 'email') => {
    trackEvent('login', { method });
};

export const trackSignUp = (method: string = 'email') => {
    trackEvent('sign_up', { method });
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

export const trackViewItemList = (items: any[], listName: string = 'Product List') => {
    trackEvent('view_item_list', {
        item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
        item_list_name: listName,
        items: items.map((item, index) => ({
            item_id: item.id || item.slug,
            item_name: item.name,
            price: item.price,
            index: index + 1
        }))
    });
};

export const trackSelectItem = (product: any, listName: string = 'Product List') => {
    trackEvent('select_item', {
        item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
        item_list_name: listName,
        items: [{
            item_id: product.id || product.slug,
            item_name: product.name,
            price: product.price
        }]
    });
};

export const trackViewSearchResults = (searchTerm: string, resultsCount: number) => {
    trackEvent('view_search_results', {
        search_term: searchTerm,
        value: resultsCount // Optional: GA4 uses 'value' for search context sometimes
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

export const trackRemoveFromCart = (product: any, quantity: number = 1) => {
    trackEvent('remove_from_cart', {
        currency: 'GHS',
        value: product.price * quantity,
        items: [{
            item_id: product.id || product.slug,
            item_name: product.name,
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

export const trackAddShippingInfo = (cart: any) => {
    trackEvent('add_shipping_info', {
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

export const trackAddPaymentInfo = (cart: any, paymentType: string) => {
    trackEvent('add_payment_info', {
        currency: 'GHS',
        value: cart.total,
        payment_type: paymentType,
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

/**
 * Custom Lead Events for WhatsApp
 * Helps identify conversion intent before they reach the payment step
 */
export const trackWhatsAppContact = (productName: string, type: 'support' | 'purchase' | 'concierge') => {
    trackEvent('generate_lead', {
        method: 'whatsapp',
        product_name: productName,
        contact_type: type
    });
    // Also track as a generic 'contact' for standard GA4 reports
    trackEvent('contact', {
        method: 'whatsapp',
        contact_type: type
    });
};

export const trackCheckoutError = (errorType: string, message: string) => {
    trackEvent('checkout_error', {
        error_type: errorType,
        error_message: message
    });
};
