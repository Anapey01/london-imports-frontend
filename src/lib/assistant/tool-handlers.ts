import { AssistantOrder, ProductSummary } from './tools';

export interface ToolExecutionContext {
    backendBase: string;
    customerName: string;
    ordersContext: any[];
    currentProductSlug?: string;
    cartContext?: any;
    isAuthenticated: boolean;
    activeCategories: string[];
}

export interface ToolExecutionResult {
    toolResultPayload: any;
    products?: ProductSummary[];
    orders?: AssistantOrder[];
    actionLink?: { label: string; href: string };
    quickReplies?: Array<{ label: string; query: string; isCheckout?: boolean }>;
    cartAction?: {
        action: string;
        product?: ProductSummary;
        itemId?: string;
        productName?: string;
        quantity?: number;
    };
}

export async function executeAssistantTool(
    fnName: string,
    fnArgs: any,
    ctx: ToolExecutionContext
): Promise<ToolExecutionResult> {
    const { backendBase, customerName, ordersContext, currentProductSlug, cartContext, isAuthenticated, activeCategories } = ctx;

    // 1. search_products
    if (fnName === 'search_products') {
        const searchQuery = (fnArgs.query || '').trim();
        const categorySlug = (fnArgs.category || '').trim();
        const maxPrice = fnArgs.max_price;

        let searchUrl = `${backendBase.replace(/\/$/, '')}/products/assistant/search/?q=${encodeURIComponent(searchQuery)}`;
        if (categorySlug) searchUrl += `&category=${encodeURIComponent(categorySlug)}`;
        if (maxPrice) searchUrl += `&max_price=${maxPrice}`;

        let products: ProductSummary[] = [];
        try {
            const sRes = await fetch(searchUrl, {
                headers: { 'Accept': 'application/json' },
                cache: 'no-store'
            });
            if (sRes.ok) {
                const sData = await sRes.json();
                const rawProds = sData.results || [];
                products = rawProds.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price || 0),
                    old_price: p.old_price ? (typeof p.old_price === 'string' ? parseFloat(p.old_price) : p.old_price) : null,
                    image: p.image || null,
                    category: p.category_name || p.category || '',
                    vendor_name: p.vendor_name || null,
                    is_preorder: Boolean(p.is_preorder),
                    preorder_status: p.preorder_status || 'READY_TO_SHIP',
                    delivery_window_text: p.delivery_window_text || '1-2 weeks',
                    stock_quantity: p.stock_quantity ?? 10,
                    deposit_amount: typeof p.deposit_amount === 'string' ? parseFloat(p.deposit_amount) : (p.deposit_amount || 0),
                    variants: p.variants || []
                }));
            }
        } catch (err) {
            console.warn('[Assistant API] Search error:', err);
        }

        return {
            toolResultPayload: {
                query: searchQuery,
                found_count: products.length,
                items: products.map(p => ({
                    name: p.name,
                    price: `GH₵ ${p.price}`,
                    status: p.is_preorder ? 'Pre-order' : 'Ready to ship'
                }))
            },
            products,
            actionLink: { label: "Browse Full Catalog", href: "/products" },
            quickReplies: [
                { label: "Order from China", query: "Order from China" },
                ...activeCategories.slice(0, 2).map(c => ({
                    label: c,
                    query: `Show me ${c.toLowerCase()}`
                })),
                { label: "Check my cart", query: "Check my cart" }
            ]
        };
    }

    // 2. track_order
    if (fnName === 'track_order') {
        const rawOrderNum = (fnArgs.order_number || '').trim();
        const cleanedOrderNum = rawOrderNum.toUpperCase().startsWith('LI-') ? rawOrderNum.toUpperCase() : `LI-${rawOrderNum}`;

        let trackedOrder: AssistantOrder | null = ordersContext.find(
            (o: any) => (o.order_number || '').toUpperCase() === cleanedOrderNum
        ) || null;

        if (!trackedOrder) {
            try {
                const tRes = await fetch(`${backendBase.replace(/\/$/, '')}/orders/track/public/${encodeURIComponent(cleanedOrderNum)}/`, {
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });
                if (tRes.ok) {
                    const d = await tRes.json();
                    trackedOrder = {
                        id: d.id,
                        order_number: d.order_number,
                        state: d.state,
                        state_display: d.state_display,
                        total: typeof d.total === 'string' ? parseFloat(d.total) : (d.total || 0),
                        amount_paid: typeof d.amount_paid === 'string' ? parseFloat(d.amount_paid) : (d.amount_paid || 0),
                        balance_due: typeof d.balance_due === 'string' ? parseFloat(d.balance_due) : (d.balance_due || 0),
                        delivery_window: d.delivery_window || '',
                        items_count: d.items?.length || 1,
                        items: (d.items || []).map((it: any) => ({
                            name: it.product_name || it.product?.name || 'Item',
                            quantity: it.quantity || 1,
                            image: it.product?.image || null
                        }))
                    };
                }
            } catch (err) {
                console.warn('[Assistant API] Track order error:', err);
            }
        }

        if (trackedOrder) {
            const hasBal = trackedOrder.balance_due > 0;
            return {
                toolResultPayload: {
                    found: true,
                    order_number: trackedOrder.order_number,
                    status: trackedOrder.state_display,
                    delivery_window: trackedOrder.delivery_window,
                    balance_due: trackedOrder.balance_due
                },
                orders: [trackedOrder],
                actionLink: hasBal
                    ? { label: `Pay Balance (GH₵ ${trackedOrder.balance_due.toFixed(2)})`, href: `/checkout?order=${trackedOrder.order_number}` }
                    : { label: "View Live Tracking", href: `/track?order=${trackedOrder.order_number}` },
                quickReplies: [
                    { label: "View All Orders", query: "My orders" },
                    { label: "Browse Catalog", query: "Browse catalog" }
                ]
            };
        } else {
            return {
                toolResultPayload: {
                    found: false,
                    order_number: cleanedOrderNum,
                    message: "Order number not found in system."
                },
                actionLink: { label: "Track on Orders Page", href: "/track" },
                quickReplies: [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    { label: "Chat on WhatsApp", query: "Chat on WhatsApp" }
                ]
            };
        }
    }

    // 3. get_customer_orders
    if (fnName === 'get_customer_orders') {
        if (!isAuthenticated) {
            return {
                toolResultPayload: {
                    authenticated: false,
                    message: "Customer is not logged in. Ask them to sign in or provide their LI- order number."
                },
                actionLink: { label: "Sign In to View Orders", href: "/login?redirect=/orders" },
                quickReplies: [
                    { label: "Sign In", query: "Sign in" },
                    { label: "Browse Catalog", query: "Browse catalog" }
                ]
            };
        } else {
            const displayOrders = ordersContext.slice(0, 4);
            const unpaid = ordersContext.find((o: any) => o.balance_due > 0 || o.state === 'PENDING_PAYMENT');
            return {
                toolResultPayload: {
                    authenticated: true,
                    order_count: ordersContext.length,
                    instruction: `Interactive order cards for ${ordersContext.length} order(s) are now displayed on screen. Give a warm 1-sentence friendly greeting. Do NOT list order numbers or output a table.`
                },
                orders: displayOrders,
                actionLink: unpaid
                    ? { label: `Pay Balance (GH₵ ${parseFloat(unpaid.balance_due || 0).toFixed(2)})`, href: `/checkout?order=${unpaid.order_number}` }
                    : { label: "View Orders Page", href: "/orders" },
                quickReplies: [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    { label: "Order from China", query: "Order from China" }
                ]
            };
        }
    }

    // 4. add_to_cart
    if (fnName === 'add_to_cart') {
        const rawTarget = (fnArgs.product_name || '').trim();
        const qty = Math.max(1, parseInt(fnArgs.quantity || 1, 10));
        let matchedProduct: ProductSummary | null = null;

        if (currentProductSlug && (
            !rawTarget ||
            /^(this|it|current|the\s+item|this\s+item|product)$/i.test(rawTarget) ||
            rawTarget.toLowerCase().includes(currentProductSlug.toLowerCase().replace(/-/g, ' '))
        )) {
            try {
                const pRes = await fetch(`${backendBase.replace(/\/$/, '')}/products/${encodeURIComponent(currentProductSlug)}/`, {
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });
                if (pRes.ok) {
                    const p = await pRes.json();
                    matchedProduct = {
                        id: p.id,
                        name: p.name || p.display_name,
                        slug: p.slug,
                        price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price || 0),
                        old_price: p.old_price ? (typeof p.old_price === 'string' ? parseFloat(p.old_price) : p.old_price) : null,
                        image: p.image || p.primary_image || null,
                        category: p.category_name || p.category?.name || '',
                        vendor_name: p.vendor_name || null,
                        is_preorder: Boolean(p.is_preorder),
                        preorder_status: p.preorder_status || 'READY_TO_SHIP',
                        delivery_window_text: p.delivery_window_text || '1-2 weeks',
                        stock_quantity: p.stock_quantity ?? 10,
                        deposit_amount: typeof p.deposit_amount === 'string' ? parseFloat(p.deposit_amount) : (p.deposit_amount || 0),
                        variants: p.variants || []
                    };
                }
            } catch (err) {
                console.warn('[Assistant API] Fetch active product by slug error:', err);
            }
        }

        if (!matchedProduct && rawTarget) {
            const searchUrl = `${backendBase.replace(/\/$/, '')}/products/assistant/search/?q=${encodeURIComponent(rawTarget)}`;
            try {
                const sRes = await fetch(searchUrl, {
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });
                if (sRes.ok) {
                    const sData = await sRes.json();
                    const rawProds = sData.results || [];
                    if (rawProds.length > 0) {
                        const p = rawProds[0];
                        matchedProduct = {
                            id: p.id,
                            name: p.name,
                            slug: p.slug,
                            price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price || 0),
                            old_price: p.old_price ? (typeof p.old_price === 'string' ? parseFloat(p.old_price) : p.old_price) : null,
                            image: p.image || null,
                            category: p.category_name || p.category || '',
                            vendor_name: p.vendor_name || null,
                            is_preorder: Boolean(p.is_preorder),
                            preorder_status: p.preorder_status || 'READY_TO_SHIP',
                            delivery_window_text: p.delivery_window_text || '1-2 weeks',
                            stock_quantity: p.stock_quantity ?? 10,
                            deposit_amount: typeof p.deposit_amount === 'string' ? parseFloat(p.deposit_amount) : (p.deposit_amount || 0),
                            variants: p.variants || []
                        };
                    }
                }
            } catch (err) {
                console.warn('[Assistant API] Add to cart search error:', err);
            }
        }

        if (matchedProduct) {
            return {
                toolResultPayload: {
                    success: true,
                    added: true,
                    product_name: matchedProduct.name,
                    price: `GH₵ ${matchedProduct.price}`,
                    quantity: qty
                },
                cartAction: { action: 'add', product: matchedProduct, quantity: qty },
                products: [matchedProduct],
                actionLink: { label: "Proceed to Checkout", href: "/checkout" },
                quickReplies: [
                    { label: "Proceed to Checkout", query: "Proceed to checkout", isCheckout: true },
                    { label: "Keep Shopping", query: "Browse catalog" },
                    { label: "Check my cart", query: "Check my cart" }
                ]
            };
        } else {
            return {
                toolResultPayload: {
                    success: false,
                    added: false,
                    message: `Could not find product matching "${rawTarget}" in our catalog.`
                },
                actionLink: { label: "Browse Catalog", href: "/products" },
                quickReplies: [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    { label: "Order from China", query: "Order from China" }
                ]
            };
        }
    }

    // 5. escalate_to_whatsapp
    if (fnName === 'escalate_to_whatsapp') {
        const reason = fnArgs.reason || 'General Inquiry';
        const waText = `Hello London's Imports, I am inquiring with Miss London about: ${reason}`;
        const waUrl = `https://wa.me/233545247009?text=${encodeURIComponent(waText)}`;

        return {
            toolResultPayload: {
                success: true,
                channel: "WhatsApp Concierge",
                primary_line: "+233 54 524 7009",
                backup_line: "+233 54 514 2658",
                reason
            },
            actionLink: { label: "Chat on WhatsApp (+233 54 524 7009)", href: waUrl },
            quickReplies: [
                { label: "Browse Catalog", query: "Browse catalog" },
                { label: "Track My Order", query: "Track my order" },
                { label: "Backup WhatsApp Line", query: "Can I reach your secondary WhatsApp line at +233 54 514 2658?" }
            ]
        };
    }

    // 6. remove_from_cart
    if (fnName === 'remove_from_cart') {
        const rawTarget = (fnArgs.product_name || '').trim().toLowerCase();
        const cartItems = (cartContext && Array.isArray(cartContext.items)) ? cartContext.items : [];

        let matchedItem: any = null;
        if (rawTarget) {
            matchedItem = cartItems.find((i: any) =>
                (i.name || '').toLowerCase().includes(rawTarget) ||
                rawTarget.includes((i.name || '').toLowerCase())
            );
        }
        if (!matchedItem && cartItems.length === 1) {
            matchedItem = cartItems[0];
        }

        if (matchedItem) {
            return {
                toolResultPayload: {
                    success: true,
                    removed: true,
                    product_name: matchedItem.name,
                    remaining_items: Math.max(0, cartItems.length - 1)
                },
                cartAction: { action: 'remove', itemId: matchedItem.id, productName: matchedItem.name },
                actionLink: { label: "View Cart", href: "/cart" },
                quickReplies: [
                    { label: "Proceed to Checkout", query: "Proceed to checkout", isCheckout: true },
                    { label: "Browse Catalog", query: "Browse catalog" }
                ]
            };
        } else {
            return {
                toolResultPayload: {
                    success: false,
                    removed: false,
                    message: `Could not find "${fnArgs.product_name}" in your cart.`
                },
                quickReplies: [
                    { label: "What is in my cart?", query: "What is in my cart?" },
                    { label: "Browse Catalog", query: "Browse catalog" }
                ]
            };
        }
    }

    // 7. clear_cart
    if (fnName === 'clear_cart') {
        return {
            toolResultPayload: {
                success: true,
                cleared: true,
                message: "All items have been removed from your cart."
            },
            cartAction: { action: 'clear' },
            actionLink: { label: "Browse Catalog", href: "/products" },
            quickReplies: [
                { label: "Browse Catalog", query: "Browse catalog" },
                { label: "Order from China", query: "Order from China" }
            ]
        };
    }

    // 8. submit_payment_verification
    if (fnName === 'submit_payment_verification') {
        const rawOrderNum = fnArgs.order_number || (ordersContext?.[0]?.order_number) || '';
        const rawTxnId = fnArgs.transaction_id || '';
        const rawAmount = fnArgs.amount ? parseFloat(fnArgs.amount) : undefined;

        try {
            const claimRes = await fetch(`${backendBase.replace(/\/$/, '')}/payments/ussd/claim/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    order_number: rawOrderNum,
                    transaction_id: rawTxnId,
                    amount: rawAmount,
                    customer_phone: customerName
                })
            });

            const claimData = await claimRes.json();
            if (claimRes.ok) {
                const isAudit = Boolean(claimData.pending_audit);
                const claimedAmt = claimData.claimed_amount || rawAmount || 0;
                const currentBal = claimData.balance_due !== undefined ? claimData.balance_due : 0;
                const expectedBal = Math.max(0, currentBal - claimedAmt);

                const updatedOrderObj: AssistantOrder = {
                    order_number: claimData.order_number || rawOrderNum,
                    state: claimData.state || 'PROCESSING',
                    state_display: claimData.state === 'PAID' ? 'Fully Paid' : (claimData.verified ? 'Deposit Received' : 'Payment Verifying'),
                    total: (claimData.balance_due || 0) + (claimData.amount_credited || 0),
                    balance_due: claimData.balance_due !== undefined ? claimData.balance_due : 0,
                    amount_paid: claimData.amount_credited !== undefined ? claimData.amount_credited : 0,
                    is_verifying: isAudit,
                    claimed_amount: claimedAmt > 0 ? claimedAmt : undefined,
                };

                return {
                    toolResultPayload: {
                        success: true,
                        verified: Boolean(claimData.verified),
                        pending_audit: isAudit,
                        already_credited: Boolean(claimData.already_credited),
                        order_number: claimData.order_number || rawOrderNum,
                        order_state: claimData.state,
                        amount_claimed: claimedAmt,
                        amount_credited: claimData.amount_credited || 0,
                        current_balance_due: currentBal,
                        expected_balance_after_settlement: isAudit ? expectedBal : currentBal,
                        message: claimData.message,
                        guidance: isAudit
                            ? `Customer claimed payment of GH₵ ${claimedAmt} for order ${rawOrderNum} (Txn: ${rawTxnId}). Our system has registered the claim and is awaiting bank settlement confirmation from Hubtel. Politely reassure the customer that their claim is securely recorded. Explain that once Hubtel confirms the settlement, their balance will automatically adjust from GH₵ ${currentBal.toFixed(2)} to GH₵ ${expectedBal.toFixed(2)}, and dispatch will proceed.`
                            : `Payment of GH₵ ${claimData.amount_credited} is confirmed and credited! Remaining balance is GH₵ ${claimData.balance_due}.`
                    },
                    orders: [updatedOrderObj],
                    actionLink: isAudit
                        ? { label: "Track Order Status", href: `/track?order=${rawOrderNum}` }
                        : (claimData.balance_due && claimData.balance_due > 0
                            ? { label: `Pay Remaining (GH₵ ${parseFloat(claimData.balance_due).toFixed(2)})`, href: `/checkout?order=${rawOrderNum}` }
                            : { label: "Track Shipment", href: `/track?order=${rawOrderNum}` }),
                    quickReplies: [
                        { label: "Track My Order", query: `Track order ${rawOrderNum}` },
                        { label: "Browse Catalog", query: "Browse catalog" }
                    ]
                };
            } else {
                return {
                    toolResultPayload: {
                        success: false,
                        message: claimData.error || "Could not verify transaction at this time."
                    }
                };
            }
        } catch (e: any) {
            return {
                toolResultPayload: {
                    success: false,
                    message: `Error connecting to verification service: ${e.message}`
                }
            };
        }
    }

    return {
        toolResultPayload: { error: `Unknown tool function ${fnName}` }
    };
}
