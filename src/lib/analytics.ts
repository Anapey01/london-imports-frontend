/**
 * London's Imports - Analytics Utilities
 * Standardized GA4 Event tracking for E-commerce
 */

export const GA_MEASUREMENT_ID = "G-VP24TKHC7C";

// Global Window augmentation is now handled by @next/third-parties/google
// We use 'any' casting inside functions to avoid complex type merging if needed

// Helper for gtag
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        const gtagParams = { ...params };
        
        // Ensure numeric fields are actually numbers for GA4
        if (gtagParams.value !== undefined) gtagParams.value = Number(gtagParams.value || 0);
        if (gtagParams.price !== undefined) gtagParams.price = Number(gtagParams.price || 0);
        if (gtagParams.shipping !== undefined) gtagParams.shipping = Number(gtagParams.shipping || 0);
        if (gtagParams.tax !== undefined) gtagParams.tax = Number(gtagParams.tax || 0);
        
        if (gtagParams.items && Array.isArray(gtagParams.items)) {
            gtagParams.items = gtagParams.items.map((item: Record<string, unknown>) => ({
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
            'send_page_view': false
        });
    }
};

export const setUserProfile = (properties: Record<string, string | number | boolean>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('set', 'user_properties', properties);
    }
};

/**
 * Decisison-Making Intelligence: User Intent Profiling
 * Automatically segments users as 'Wholesale' or 'Retail' based on cart behavior
 */
export const trackUserIntent = (cartTotal: number, itemCount: number) => {
    const isWholesale = cartTotal > 5000 || itemCount > 10;
    const userType = isWholesale ? 'Wholesale_Improter' : 'Individual_Retailer';
    
    setUserProfile({
        'user_type': userType,
        'intent_score': isWholesale ? 'High_Wholesale' : 'Standard_Retail'
    });
    
    trackEvent('user_intent_profiled', {
        user_type: userType,
        cart_total_ghs: cartTotal,
        item_count: itemCount
    });
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

export const trackAddToCart = (product: any, quantity: number = 1) => {
    trackEvent('add_to_cart', {
        currency: 'GHS',
        value: Number(product.price || 0) * quantity,
        items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category?.name,
            price: Number(product.price || 0),
            quantity: quantity
        }]
    });
};

export const trackAddToWishlist = (product: any) => {
    trackEvent('add_to_wishlist', {
        currency: 'GHS',
        value: Number(product.price || 0),
        items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category?.name,
            price: Number(product.price || 0),
            quantity: 1
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

/**
 * Proactive Intelligence: Customer Loyalty (RFM Mapping)
 */
export const trackUserLoyalty = (orderCount: number, tenureDays: number) => {
    setUserProfile({
        'lifetime_orders': Number(orderCount),
        'user_tenure_days': Number(tenureDays),
        'loyalty_tier': orderCount > 5 ? 'Power_Sourcing_Partner' : 'Standard_Retailer'
    });
};

/**
 * Operational Efficiency: Payment Provider Lifecycle
 * Identifies if Paystack/Momo is failing before the order completes
 */
export const trackPaymentLifecycle = (step: 'selection' | 'authorization' | 'failure' | 'success', details: Record<string, unknown>) => {
    trackEvent('payment_lifecycle', {
        payment_step: step,
        provider: details.provider || 'paystack',
        error_code: details.error_code,
        ...details
    });
};

/**
 * Predictive Analysis: Product Affinity
 * Tracks cross-sell effectiveness (People who buy A also view B)
 */
export const trackProductAffinity = (sourceItem: string, targetItem: any) => {
    trackEvent('product_affinity_signal', {
        source_product: sourceItem,
        target_name: targetItem.name,
        target_id: targetItem.id
    });
};

export const trackCheckoutError = (errorType: string, message: string) => {
    trackEvent('checkout_error', {
        error_type: errorType,
        error_message: message
    });
};

/**
 * Promotional Tracking
 */
export const trackViewPromotion = (promotion: { id: string, name: string, creative?: string, position?: string }) => {
    trackEvent('view_promotion', {
        promotion_id: promotion.id,
        promotion_name: promotion.name,
        creative_name: promotion.creative,
        creative_slot: promotion.position,
        items: [] // required by standard GA4 if not item-specific
    });
};

export const trackSelectPromotion = (promotion: { id: string, name: string, creative?: string, position?: string }) => {
    trackEvent('select_promotion', {
        promotion_id: promotion.id,
        promotion_name: promotion.name,
        creative_name: promotion.creative,
        creative_slot: promotion.position,
        items: []
    });
};

/**
 * Advanced Search & Robustness Tracking
 */
export const trackSearch = (searchTerm: string) => {
    trackEvent('search', {
        search_term: searchTerm
    });
};

export const trackViewSearchResults = (searchTerm: string, resultCount: number, items: any[] = []) => {
    trackEvent('view_search_results', {
        search_term: searchTerm,
        result_count: resultCount,
        items: items.map((item: any) => ({
            item_id: String(item.id),
            item_name: String(item.name),
            price: Number(item.price || 0)
        }))
    });
};

export const trackException = (description: string, fatal: boolean = false) => {
    trackEvent('exception', {
        description: description,
        fatal: fatal
    });
};
