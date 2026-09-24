import { NextRequest, NextResponse } from 'next/server';

interface ProductSummary {
    id: string;
    name: string;
    slug: string;
    price: number;
    old_price: number | null;
    image: string | null;
    category: string;
    vendor_name: string | null;
    is_preorder: boolean;
    preorder_status: string;
    delivery_window_text: string;
    stock_quantity: number;
    deposit_amount: number;
    available_colors?: string[];
    available_sizes?: string[];
    variants?: Array<{
        id: string;
        name: string;
        price: number;
        stock_quantity: number;
    }>;
}

export interface AssistantOrder {
    id?: string;
    order_number: string;
    state: string;
    state_display: string;
    total: number;
    amount_paid?: number;
    balance_due: number;
    items_count?: number;
    delivery_window?: string;
    items?: Array<{
        name: string;
        quantity: number;
        image?: string | null;
    }>;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            message,
            conversationHistory = [],
            cartContext,
            userName,
            isAuthenticated = false,
            ordersContext = []
        } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const trimmed = message.trim();
        const customerName = userName && typeof userName === 'string' ? userName.trim() : '';
        const backendBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

        // Cart context summary for the AI
        let cartInfo = '';
        if (cartContext && typeof cartContext === 'object') {
            if (cartContext.count === 0) {
                cartInfo = 'Customer cart is currently empty.';
            } else {
                const itemNames = (cartContext.items || []).map((i: any) => `${i.name} (qty: ${i.quantity})`).join(', ');
                cartInfo = `Customer cart currently has ${cartContext.count} item(s): ${itemNames}.`;
            }
        }

        const isGreeting = /^(hi|hey|hello|good\s*(morning|afternoon|evening|day)|yo|sup|charley|how\s*are\s*you|how\s*far|xup|hey\s*there|hello\s*there|what'?s\s*up)$/i.test(trimmed);
        const isThanks = /^(thanks|thank\s*you|thank\s*u|medaase|cool|great|awesome|perfect|ok|okay|alright|nice|noted)$/i.test(trimmed);
        const isHelp = /^(help|who\s*are\s*you|what\s*can\s*you\s*do|how\s*does\s*this\s*work|what\s*is\s*this|about|commands)$/i.test(trimmed);
        const isControlQuery = /^(done|i'?m\s*done|i\s*am\s*done|finished|that'?s\s*all|that\s*is\s*all|nothing\s*else|no\s*more|done\s*ordering|all\s*done|we\s*are\s*done|yes|yeah|yep|proceed|checkout|proceed\s*to\s*checkout|go\s*to\s*checkout|take\s*me\s*to\s*checkout|check\s*out|pay\s*now|buy\s*now|no|not\s*yet|keep\s*shopping|order\s*something\s*else|back|go\s*back|return|previous|menu|main\s*menu|start\s*over|check\s*my\s*cart|order\s*a\s*product|order\s*from\s*china|hi|hey|hello|good\s*(morning|afternoon|evening|day)|yo|sup|charley|thanks|thank\s*you|help)$/i.test(trimmed);
        const isBrowseCatalog = /^(browse(\s+our|\s+the)?\s+catalog|browse(\s+our|\s+the)?\s+store|browse(\s+our|\s+the)?\s+products?|show(\s+our|\s+the)?\s+catalog|show(\s+our|\s+the)?\s+store|show(\s+all)?\s+products?|view(\s+our|\s+the)?\s+catalog|catalog|all products|shop catalog|explore products|see catalog|browse)$/i.test(trimmed);

        // Order intent detection
        const orderNumMatch = trimmed.match(/\b(LI-\d{8}-\d{5}|LI-[A-Za-z0-9-]+)\b/i) || trimmed.match(/\b(\d{8}-\d{5})\b/);
        let extractedOrderNumber: string | null = null;
        if (orderNumMatch) {
            const raw = orderNumMatch[1];
            extractedOrderNumber = raw.toUpperCase().startsWith('LI-') ? raw.toUpperCase() : `LI-${raw}`;
        }

        const isPayBalanceQuery = /\b(pay\s+(my\s+)?balance|continue\s+payment|complete\s+payment|pay\s+(my\s+)?order|finish\s+paying|unpaid\s+orders?|pending\s+payment|balance\s+due|how\s+much\s+do\s+i\s+owe|pay\s+for\s+order)\b/i.test(trimmed);
        const isMyOrdersQuery = /\b(my\s+orders?|list\s+(my\s+)?orders?|show\s+(my\s+)?orders?|view\s+(my\s+)?orders?|what\s+did\s+i\s+order|orders?\s+placed|order\s+history|past\s+orders?)\b/i.test(trimmed);
        const isTrackGeneralQuery = /^(track(\s*(my\s*)?orders?)?|where\s+is\s+my\s+order|where\s+is\s+my\s+package|order\s+status|package\s+status|shipment\s+status)$/i.test(trimmed);
        const isOrderQuery = Boolean(extractedOrderNumber) || isPayBalanceQuery || isMyOrdersQuery || isTrackGeneralQuery;

        // Initialize collections
        let products: ProductSummary[] = [];
        let orders: AssistantOrder[] = [];
        let reply = '';
        let actionLink: { label: string; href: string } | undefined = undefined;
        let quickReplies: Array<{ label: string; query: string; isCheckout?: boolean }> | undefined = undefined;

        // Fetch live store categories from backend for AI context
        let activeCategories: string[] = ['Bags', 'Accessories', 'Beauty & Personal Care', 'Electronics', 'Fashion & Apparel', 'Home & Lifestyle'];
        try {
            const catRes = await fetch(`${backendBase.replace(/\/$/, '')}/products/categories/`, {
                headers: { 'Accept': 'application/json' },
                cache: 'no-store'
            });
            if (catRes.ok) {
                const catData = await catRes.json();
                const cats = Array.isArray(catData.results) ? catData.results : (Array.isArray(catData) ? catData : []);
                const valid = cats
                    .filter((c: any) => c.is_active !== false && !c.slug?.includes('test') && !c.name?.toLowerCase().includes('test'))
                    .map((c: any) => c.name);
                if (valid.length > 0) activeCategories = valid;
            }
        } catch {
            // Graceful fallback to default categories
        }

        // ========================================================
        // Priority 1: Handle Order-Specific Tracking / Query
        // ========================================================
        if (extractedOrderNumber) {
            let trackedOrder: AssistantOrder | null = null;
            try {
                const trackRes = await fetch(`${backendBase.replace(/\/$/, '')}/orders/track/public/${encodeURIComponent(extractedOrderNumber)}/`, {
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });
                if (trackRes.ok) {
                    const data = await trackRes.json();
                    trackedOrder = {
                        id: data.id,
                        order_number: data.order_number,
                        state: data.state,
                        state_display: data.state_display,
                        total: typeof data.total === 'string' ? parseFloat(data.total) : (data.total || 0),
                        amount_paid: typeof data.amount_paid === 'string' ? parseFloat(data.amount_paid) : (data.amount_paid || 0),
                        balance_due: typeof data.balance_due === 'string' ? parseFloat(data.balance_due) : (data.balance_due || 0),
                        delivery_window: data.delivery_window || '',
                        items_count: data.items?.length || 1,
                        items: (data.items || []).map((it: any) => ({
                            name: it.product_name || it.product?.name || 'Item',
                            quantity: it.quantity || 1,
                            image: it.product?.image || null
                        }))
                    };
                }
            } catch (err) {
                console.warn('[Assistant API] Error fetching tracked order:', err);
            }

            if (trackedOrder) {
                orders = [trackedOrder];
                const hasBalance = trackedOrder.balance_due > 0 || trackedOrder.state === 'PENDING_PAYMENT';
                const isPayIntent = isPayBalanceQuery || /\b(pay|payment|settle|complete|checkout)\b/i.test(trimmed);

                if (isPayIntent && hasBalance) {
                    const payLabel = trackedOrder.balance_due > 0
                        ? `Pay Balance (GH₵ ${trackedOrder.balance_due.toFixed(2)})`
                        : 'Complete Payment';
                    reply = customerName
                        ? (trackedOrder.balance_due > 0
                            ? `${customerName}, order #${trackedOrder.order_number} has an outstanding balance of GH₵ ${trackedOrder.balance_due.toFixed(2)}. Tap below to finish your payment right away!`
                            : `${customerName}, order #${trackedOrder.order_number} is pending payment. Tap below to complete your checkout right away!`)
                        : (trackedOrder.balance_due > 0
                            ? `Order #${trackedOrder.order_number} has an outstanding balance of GH₵ ${trackedOrder.balance_due.toFixed(2)}. Tap below to finish your payment right away!`
                            : `Order #${trackedOrder.order_number} is pending payment. Tap below to complete your checkout right away!`);
                    actionLink = {
                        label: payLabel,
                        href: `/checkout?order=${trackedOrder.order_number}`
                    };
                    quickReplies = [
                        { label: "Browse Catalog", query: "Browse catalog" }
                    ];
                } else if (isPayIntent && !hasBalance) {
                    reply = customerName
                        ? `Order #${trackedOrder.order_number} is already fully paid, ${customerName}! You have zero outstanding balance on it.`
                        : `Order #${trackedOrder.order_number} is already fully paid! You have zero outstanding balance on it.`;
                    actionLink = { label: "Track Order Live", href: `/track?order=${trackedOrder.order_number}` };
                    quickReplies = [
                        { label: "Browse Catalog", query: "Browse catalog" }
                    ];
                } else {
                    // Tracking details response
                    const state = trackedOrder.state;
                    if (state === 'PAID') {
                        reply = customerName
                            ? `Your order #${trackedOrder.order_number} is confirmed and paid, ${customerName}! Our sourcing team is preparing your package.`
                            : `Your order #${trackedOrder.order_number} is confirmed and paid! Our sourcing team is preparing your package.`;
                    } else if (state === 'IN_TRANSIT') {
                        reply = customerName
                            ? `Your order #${trackedOrder.order_number} is currently in transit to Accra, Ghana, ${customerName}. Delivery window: ${trackedOrder.delivery_window || '1-2 weeks'}.`
                            : `Your order #${trackedOrder.order_number} is currently in transit to Accra, Ghana. Delivery window: ${trackedOrder.delivery_window || '1-2 weeks'}.`;
                    } else if (state === 'ARRIVED') {
                        reply = customerName
                            ? `Great news, ${customerName}! Order #${trackedOrder.order_number} has arrived at our Accra Central sorting hub.`
                            : `Great news! Order #${trackedOrder.order_number} has arrived at our Accra Central sorting hub.`;
                    } else if (state === 'OUT_FOR_DELIVERY') {
                        reply = customerName
                            ? `Your order #${trackedOrder.order_number} is out for local delivery today, ${customerName}!`
                            : `Your order #${trackedOrder.order_number} is out for local delivery today!`;
                    } else if (state === 'DELIVERED') {
                        reply = customerName
                            ? `Your order #${trackedOrder.order_number} has been delivered safely, ${customerName}. Thank you for shopping with London's Imports!`
                            : `Your order #${trackedOrder.order_number} has been delivered safely. Thank you for shopping with London's Imports!`;
                    } else if (state === 'PENDING_PAYMENT') {
                        reply = customerName
                            ? `Your order #${trackedOrder.order_number} is awaiting payment, ${customerName}.${trackedOrder.balance_due > 0 ? ` Balance due: GH₵ ${trackedOrder.balance_due.toFixed(2)}.` : ''}`
                            : `Your order #${trackedOrder.order_number} is awaiting payment.${trackedOrder.balance_due > 0 ? ` Balance due: GH₵ ${trackedOrder.balance_due.toFixed(2)}.` : ''}`;
                    } else {
                        reply = customerName
                            ? `Your order #${trackedOrder.order_number} is currently "${trackedOrder.state_display}", ${customerName}. Delivery window: ${trackedOrder.delivery_window || 'To be confirmed'}.`
                            : `Your order #${trackedOrder.order_number} is currently "${trackedOrder.state_display}". Delivery window: ${trackedOrder.delivery_window || 'To be confirmed'}.`;
                    }

                    if (hasBalance && state !== 'PENDING_PAYMENT' && trackedOrder.balance_due > 0) {
                        reply += ` (Note: Remaining balance of GH₵ ${trackedOrder.balance_due.toFixed(2)}).`;
                    }

                    if (hasBalance) {
                        const payLabel = trackedOrder.balance_due > 0
                            ? `Pay Balance (GH₵ ${trackedOrder.balance_due.toFixed(2)})`
                            : 'Complete Payment';
                        actionLink = {
                            label: payLabel,
                            href: `/checkout?order=${trackedOrder.order_number}`
                        };
                        quickReplies = [
                            { label: "Browse Catalog", query: "Browse catalog" }
                        ];
                    } else {
                        actionLink = { label: "Track Shipment Live", href: `/track?order=${trackedOrder.order_number}` };
                        quickReplies = [
                            { label: "Browse Catalog", query: "Browse catalog" }
                        ];
                    }
                }



                return NextResponse.json({
                    reply,
                    products: [],
                    orders,
                    actionLink,
                    quickReplies
                });
            } else {
                reply = customerName
                    ? `I couldn't find an order with reference "${extractedOrderNumber}", ${customerName}. Please double-check your order number or visit your orders page below!`
                    : `I couldn't find an order with reference "${extractedOrderNumber}". Please double-check your order number or visit your orders page below!`;
                actionLink = { label: "View My Orders", href: "/orders" };
                quickReplies = [
                    { label: "View All Orders", query: "My orders" },
                    { label: "Browse Catalog", query: "Browse catalog" }
                ];

                return NextResponse.json({
                    reply,
                    products: [],
                    orders: [],
                    actionLink,
                    quickReplies
                });
            }
        }

        // ========================================================
        // Priority 2: Handle General "Pay Balance" / "Continue Payment"
        // ========================================================
        if (isPayBalanceQuery) {
            if (isAuthenticated) {
                const unpaid = ordersContext.filter((o: any) => (o.balance_due > 0 || o.state === 'PENDING_PAYMENT' || o.state === 'DRAFT'));
                if (unpaid.length > 0) {
                    const target = unpaid[0];
                    const dueAmount = parseFloat(target.balance_due || 0);
                    const payLabel = dueAmount > 0
                        ? `Pay Balance (GH₵ ${dueAmount.toFixed(2)})`
                        : 'Complete Payment';
                    reply = customerName
                        ? (dueAmount > 0
                            ? `${customerName}, you have an outstanding balance of GH₵ ${dueAmount.toFixed(2)} on order #${target.order_number}. Tap below to finish your payment right away!`
                            : `${customerName}, order #${target.order_number} is pending payment. Tap below to complete your checkout right away!`)
                        : (dueAmount > 0
                            ? `You have an outstanding balance of GH₵ ${dueAmount.toFixed(2)} on order #${target.order_number}. Tap below to finish your payment right away!`
                            : `Order #${target.order_number} is pending payment. Tap below to complete your checkout right away!`);
                    actionLink = {
                        label: payLabel,
                        href: `/checkout?order=${target.order_number}`
                    };
                    orders = unpaid.slice(0, 3);
                    quickReplies = [
                        { label: "Browse Catalog", query: "Browse catalog" }
                    ];
                } else if (ordersContext.length > 0) {
                    reply = customerName
                        ? `Great news, ${customerName}! All your orders are fully paid up. You don't have any outstanding balance.`
                        : `Great news! All your orders are fully paid up. You don't have any outstanding balance.`;
                    actionLink = { label: "View All Orders", href: "/orders" };
                    orders = ordersContext.slice(0, 2);
                    quickReplies = [
                        { label: "Browse Catalog", query: "Browse catalog" }
                    ];
                } else {
                    reply = customerName
                        ? `${customerName}, you don't have any pending orders with an unpaid balance right now.`
                        : `You don't have any pending orders with an unpaid balance right now.`;
                    actionLink = { label: "Browse Catalog", href: "/products" };
                    quickReplies = [
                        { label: "Browse Catalog", query: "Browse catalog" }
                    ];
                }
            } else {
                reply = "To pay an outstanding balance or continue an order payment, please sign in to your account, or provide your order reference number (e.g. LI-20260905-XXXXX)!";
                actionLink = { label: "Sign In to Continue Payment", href: "/login?redirect=/orders" };
                quickReplies = [
                    { label: "Sign In", query: "Sign in" },
                    { label: "Browse Catalog", query: "Browse catalog" }
                ];
            }

            return NextResponse.json({
                reply,
                products: [],
                orders,
                actionLink,
                quickReplies
            });
        }

        // ========================================================
        // Priority 3: Handle "My Orders" / "List Orders"
        // ========================================================
        if (isMyOrdersQuery) {
            if (isAuthenticated) {
                if (ordersContext.length > 0) {
                    const unpaid = ordersContext.filter((o: any) => (o.balance_due > 0 || o.state === 'PENDING_PAYMENT'));
                    orders = ordersContext.slice(0, 4);

                    reply = customerName
                        ? `${customerName}, you have ${ordersContext.length} order${ordersContext.length > 1 ? 's' : ''} on record with us.`
                        : `You have ${ordersContext.length} order${ordersContext.length > 1 ? 's' : ''} on record with us.`;

                    if (unpaid.length > 0) {
                        reply += ` Order #${unpaid[0].order_number} has an outstanding balance of GH₵ ${parseFloat(unpaid[0].balance_due || 0).toFixed(2)}.`;
                        actionLink = {
                            label: `Pay Balance (GH₵ ${parseFloat(unpaid[0].balance_due || 0).toFixed(2)})`,
                            href: `/checkout?order=${unpaid[0].order_number}`
                        };
                        quickReplies = [
                            { label: "Browse Catalog", query: "Browse catalog" }
                        ];
                    } else {
                        reply += ` All your orders are confirmed and paid. You can track their status below!`;
                        actionLink = { label: "View All Orders", href: "/orders" };
                        quickReplies = [
                            { label: "Browse Catalog", query: "Browse catalog" }
                        ];
                    }
                } else {
                    reply = customerName
                        ? `${customerName}, you haven't placed any orders yet. Feel free to browse our catalog or tell me what item you're looking for!`
                        : `You haven't placed any orders yet. Feel free to browse our catalog or tell me what item you're looking for!`;
                    actionLink = { label: "Browse Catalog", href: "/products" };
                    quickReplies = [
                        { label: "Browse Catalog", query: "Browse catalog" },
                        ...activeCategories.slice(0, 3).map(c => ({
                            label: c,
                            query: `Show me ${c.toLowerCase()}`
                        }))
                    ];
                }
            } else {
                reply = "To see your placed orders and balances, please sign in to your account, or tell me your order reference number to look it up right away!";
                actionLink = { label: "Sign In to View Orders", href: "/login?redirect=/orders" };
                quickReplies = [
                    { label: "Sign In", query: "Sign in" },
                    { label: "Browse Catalog", query: "Browse catalog" }
                ];
            }

            return NextResponse.json({
                reply,
                products: [],
                orders,
                actionLink,
                quickReplies
            });
        }

        // ========================================================
        // Priority 4: Handle General "Track My Order" (No number provided)
        // ========================================================
        if (isTrackGeneralQuery) {
            if (isAuthenticated) {
                if (ordersContext.length > 0) {
                    const latest = ordersContext[0];
                    orders = ordersContext.slice(0, 3);
                    const hasBalance = latest.balance_due > 0 || latest.state === 'PENDING_PAYMENT';

                    reply = customerName
                        ? `${customerName}, your latest order #${latest.order_number} is currently "${latest.state_display}". Delivery window: ${latest.delivery_window || 'To be confirmed'}.`
                        : `Your latest order #${latest.order_number} is currently "${latest.state_display}". Delivery window: ${latest.delivery_window || 'To be confirmed'}.`;

                    if (hasBalance) {
                        reply += ` (Outstanding balance: GH₵ ${parseFloat(latest.balance_due || 0).toFixed(2)}).`;
                        actionLink = {
                            label: `Pay Balance (GH₵ ${parseFloat(latest.balance_due || 0).toFixed(2)})`,
                            href: `/checkout?order=${latest.order_number}`
                        };
                        quickReplies = [
                            { label: "Browse Catalog", query: "Browse catalog" }
                        ];
                    } else {
                        actionLink = { label: "View Live Tracking", href: `/track?order=${latest.order_number}` };
                        quickReplies = [
                            { label: "Browse Catalog", query: "Browse catalog" }
                        ];
                    }
                } else {
                    reply = customerName
                        ? `${customerName}, you don't have any placed orders to track yet. Feel free to browse our catalog or tell me what item you're looking for!`
                        : `You don't have any placed orders to track yet. Feel free to browse our catalog or tell me what item you're looking for!`;
                    actionLink = { label: "Browse Catalog", href: "/products" };
                    quickReplies = [
                        { label: "Browse Catalog", query: "Browse catalog" },
                        ...activeCategories.slice(0, 3).map(c => ({
                            label: c,
                            query: `Show me ${c.toLowerCase()}`
                        }))
                    ];
                }
            } else {
                reply = "To track your package, please type your order reference number (for example, LI-20260905-XXXXX) or sign in to your account!";
                actionLink = { label: "Track by Order Number", href: "/track" };
                quickReplies = [
                    { label: "Sign In", query: "Sign in" },
                    { label: "Browse Catalog", query: "Browse catalog" }
                ];
            }

            return NextResponse.json({
                reply,
                products: [],
                orders,
                actionLink,
                quickReplies
            });
        }

        // ========================================================
        // Product Search (When not an order query)
        // ========================================================
        try {
            let cleanQuery = trimmed
                .replace(/^(can you (find|show|get)|i need|i want to see|i want|looking for|show me all the|show all the|show me|show all|please find|do you have|what|search for|order a product|check my cart)\s+/i, '')
                .replace(/\s+(do you have|we have|available|in stock|you got)\??$/i, '')
                .replace(/[?!.,]/g, '')
                .trim();

            if (isBrowseCatalog) {
                const catalogUrl = `${backendBase.replace(/\/$/, '')}/products/?is_active=true&limit=6`;
                const res = await fetch(catalogUrl, {
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    const rawProducts = data.results || [];
                    products = rawProducts.filter((p: any) => {
                        const name = (p.name || '').toLowerCase();
                        const slug = (p.slug || '').toLowerCase();
                        return !name.includes('test') && !slug.includes('test') && name !== 'shoe' && slug !== 'shoe';
                    }).map((p: any) => ({
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
            } else if (cleanQuery && !isControlQuery) {
                const searchUrl = `${backendBase.replace(/\/$/, '')}/products/assistant/search/?q=${encodeURIComponent(cleanQuery)}`;
                const res = await fetch(searchUrl, {
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });

                if (res.ok) {
                    const data = await res.json();
                    const rawProducts = data.results || [];
                    products = rawProducts.filter((p: any) => {
                        const name = (p.name || '').toLowerCase();
                        const slug = (p.slug || '').toLowerCase();
                        return !name.includes('test') && !slug.includes('test') && name !== 'shoe' && slug !== 'shoe';
                    }).map((p: any) => ({
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
            }
        } catch (e) {
            console.warn('[Assistant API] Catalog search warning:', e);
        }

        const hasCartItems = Boolean(cartContext && typeof cartContext === 'object' && cartContext.count > 0);

        // ========================================================
        // Formulate Concierge response using Groq if key is present
        // ========================================================
        const rawKey = process.env.GROQ_API_KEY || '';
        const groqApiKey = rawKey.replace(/["'\r\n]/g, '').trim();
        let aiActionLink: { label: string; href: string } | undefined = undefined;
        let aiQuickReplies: Array<{ label: string; query: string; isCheckout?: boolean }> | undefined = undefined;

        if (groqApiKey) {
            try {
                const productContext = products.length > 0
                    ? `Available matching items in shop:\n` + products.map((p, idx) => `${idx + 1}. ${p.name}`).join('\n')
                    : 'No matching products searched.';

                const orderHistoryContext = ordersContext && ordersContext.length > 0
                    ? `Customer Orders on Record:\n` + ordersContext.map((o: any, idx: number) =>
                        `${idx + 1}. Order #${o.order_number} | Status: ${o.state_display} | Total: GH₵ ${o.total} | Balance Due: GH₵ ${o.balance_due}`
                    ).join('\n')
                    : (isAuthenticated ? 'Customer has 0 placed orders.' : 'Customer is a visiting guest.');

                const systemPrompt = `You are Miss London, a polite, helpful store attendant and receptionist at London's Imports in Accra, Ghana.
You assist customers in Accra, Kumasi, Tema, and across Ghana who visit your store or chat with you to buy items, order products from China, track orders, or pay balances.

${customerName ? `Customer:
- You are attending to "${customerName}".
- Call them naturally by their first name (${customerName}) with genuine Ghanaian respect and hospitality.` : `Customer:
- You are attending to a visiting guest customer. Treat them warmly and politely.`}

Real store categories available right now:
${activeCategories.map(c => `- ${c}`).join('\n')}

${orderHistoryContext}

HOW TO TALK AND ACT (BEHAVIOR RULES):
1. Speak in plain, simple, everyday English that ANYONE can easily understand.
   - Do NOT use big English, complex vocabulary, or high-class boutique jargon!
   - Talk like a normal, respectful, caring person attending to customers in a shopping mall store in Ghana.
2. If the customer greets you ("hey", "hello", "hi"), greet them back warmly and politely, call them by name, and ask how you can help them shop, track an order, or check items today!
3. If the customer thanks you ("thanks", "cool", "ok"), respond with genuine warmth and ask if they'd like to explore anything else.
4. NEVER sound like a machine, AI, or robot.
   - NEVER say "I am an AI", "large language model", or "virtual assistant".
   - NEVER recite database fields or batch numbers unless referring to real customer orders.
   - NEVER give button instructions (DO NOT say "browse the cards below" or "click the button").
5. In an ongoing conversation, do not repeat "Welcome to London's Imports" in every message; answer directly, warmly, and naturally.
6. Keep answers brief and clear: 1 to 2 simple sentences so customers don't get tired reading.

OUTPUT FORMAT:
Always return a valid JSON object with this exact structure:
{
  "reply": "Your warm, polite, 1-2 sentence spoken response to the customer in simple, everyday English.",
  "actionLink": { "label": "Browse Catalog", "href": "/products" } OR { "label": "Proceed to Checkout", "href": "/checkout" } OR { "label": "Track Order", "href": "/track" } OR null,
  "quickReplies": [
    { "label": "Short button label", "query": "Search query or request", "isCheckout": false }
  ]
}

Context-driven intelligence for actionLink and quickReplies:
- If customer greets you ("hey", "hello", "hi"):
  * actionLink should be {"label": "Browse Catalog", "href": "/products"}.
  * quickReplies should suggest {"label": "Browse Catalog", "query": "Browse catalog"}, {"label": "Order from China", "query": "Order from China"}, and store categories.
- If customer's cart is EMPTY (0 items):
  * actionLink MUST be {"label": "Browse Catalog", "href": "/products"}.
  * quickReplies MUST start with {"label": "Browse Catalog", "query": "Browse catalog", "isCheckout": false}.
  * NEVER suggest checkout when cart is empty!
- If customer's cart has items and they are done or ready to pay:
  * actionLink MUST be {"label": "Proceed to Checkout", "href": "/checkout"}.
  * quickReplies should offer {"label": "Proceed to Checkout", "query": "Proceed to checkout", "isCheckout": true} and {"label": "Order something else", "query": "Order something else", "isCheckout": false}.

Available shop catalog items:
${productContext}
${cartInfo ? `\nCustomer Cart Status: ${cartInfo}` : ''}`;

                const validHistory = Array.isArray(conversationHistory)
                    ? conversationHistory
                        .filter((m: any) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
                        .map((m: any) => ({
                            role: m.role as 'user' | 'assistant',
                            content: m.content.trim()
                        }))
                        .slice(-6)
                    : [];

                const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${groqApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    signal: AbortSignal.timeout(6000),
                    body: JSON.stringify({
                        model: 'qwen/qwen3.8-27b',
                        response_format: { type: 'json_object' },
                        messages: [
                            { role: 'system', content: systemPrompt },
                            ...validHistory,
                            { role: 'user', content: trimmed }
                        ],
                        temperature: 0.7,
                        max_tokens: 280,
                    }),
                });

                if (groqRes.ok) {
                    const groqData = await groqRes.json();
                    const rawContent = (groqData.choices?.[0]?.message?.content || '').trim();
                    try {
                        const parsed = JSON.parse(rawContent);
                        if (parsed.reply && typeof parsed.reply === 'string') {
                            const cleaned = parsed.reply.trim().replace(/^["']|["']$/g, '');
                            if (!/large language model|ai model|language model|as an ai|i am an ai/i.test(cleaned)) {
                                reply = cleaned;
                            }
                        }
                        if (parsed.actionLink && parsed.actionLink.href) {
                            if (!hasCartItems && String(parsed.actionLink.href).includes('checkout')) {
                                aiActionLink = { label: "Browse Catalog", href: "/products" };
                            } else {
                                aiActionLink = {
                                    label: String(parsed.actionLink.label || (hasCartItems ? 'Proceed to Checkout' : 'Browse Catalog')),
                                    href: String(parsed.actionLink.href)
                                };
                            }
                        }
                        if (Array.isArray(parsed.quickReplies) && parsed.quickReplies.length > 0) {
                            aiQuickReplies = parsed.quickReplies
                                .filter((q: any) => !(!hasCartItems && q.isCheckout))
                                .map((q: any) => ({
                                    label: String(q.label || '').slice(0, 32),
                                    query: String(q.query || q.label || ''),
                                    ...(q.isCheckout ? { isCheckout: true } : {})
                                }))
                                .slice(0, 5);
                        }
                    } catch (err) {
                        console.warn('[Assistant API] Groq JSON parse fallback:', err);
                        reply = rawContent.replace(/^["']|["']$/g, '');
                    }
                }
            } catch (err) {
                console.error('[Assistant API] Groq invocation error:', err);
            }
        }

        // ========================================================
        // Fallback Replies & QuickReplies
        // ========================================================
        quickReplies = aiQuickReplies;
        actionLink = aiActionLink;

        const isDone = /^(done|i'?m done|i am done|finished|that'?s all|that is all|nothing else|no more|done ordering|all done|we are done)$/i.test(trimmed);
        const isYesCheckout = /^(yes|yeah|yep|proceed|checkout|proceed to checkout|go to checkout|take me to checkout|yes,? proceed( to checkout)?|check out|pay now|buy now)$/i.test(trimmed);
        const isNoKeepShopping = /^(no|not yet|keep shopping|order something else|no,? order something else|something else|more)$/i.test(trimmed);
        const isBack = /^(back|go back|return|previous|menu|main menu|start over)$/i.test(trimmed);

        if (!quickReplies) {
            if (isGreeting) {
                quickReplies = [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    ...activeCategories.slice(0, 2).map(c => ({
                        label: c,
                        query: `Show me ${c.toLowerCase()}`
                    })),
                    { label: "Track my order", query: "Track my order" },
                    { label: "Order from China", query: "Order from China" }
                ];
            } else if (isThanks) {
                quickReplies = hasCartItems ? [
                    { label: "Proceed to Checkout", query: "Proceed to checkout", isCheckout: true },
                    { label: "Browse Catalog", query: "Browse catalog" },
                    { label: "Track my order", query: "Track my order" }
                ] : [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    ...activeCategories.slice(0, 2).map(c => ({
                        label: c,
                        query: `Show me ${c.toLowerCase()}`
                    })),
                    { label: "Track my order", query: "Track my order" }
                ];
            } else if (isHelp) {
                quickReplies = [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    { label: "Track my order", query: "Track my order" },
                    { label: "Check my cart", query: "Check my cart" },
                    { label: "Order from China", query: "Order from China" }
                ];
            } else if (isDone) {
                if (hasCartItems) {
                    quickReplies = [
                        { label: "Yes, proceed to checkout", query: "Yes, proceed to checkout", isCheckout: true },
                        { label: "No, order something else", query: "Order something else" }
                    ];
                } else {
                    quickReplies = [
                        { label: "Browse Catalog", query: "Browse catalog" },
                        ...activeCategories.slice(0, 3).map(c => ({
                            label: c,
                            query: `Show me ${c.toLowerCase()}`
                        })),
                        { label: "Order from China", query: "Order from China" }
                    ];
                }
            } else if (isYesCheckout) {
                if (hasCartItems) {
                    quickReplies = [
                        { label: "Proceed to Checkout", query: "Proceed to checkout", isCheckout: true }
                    ];
                } else {
                    quickReplies = [
                        { label: "Browse Catalog", query: "Browse catalog" },
                        ...activeCategories.slice(0, 3).map(c => ({
                            label: c,
                            query: `Show me ${c.toLowerCase()}`
                        })),
                        { label: "Order from China", query: "Order from China" }
                    ];
                }
            } else if (isNoKeepShopping) {
                quickReplies = [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    ...activeCategories.slice(0, 3).map(c => ({
                        label: c,
                        query: `Show me ${c.toLowerCase()}`
                    })),
                    { label: "Order from China", query: "Order from China" }
                ];
            } else if (isBrowseCatalog) {
                quickReplies = activeCategories.slice(0, 4).map(c => ({
                    label: c,
                    query: `Show me ${c.toLowerCase()}`
                })).concat([{ label: "Order from China", query: "Order from China" }]);
            } else if (isBack) {
                quickReplies = [
                    { label: "Browse catalog", query: "Browse catalog" },
                    { label: "Check my cart", query: "Check my cart" },
                    { label: "Track my order", query: "Track my order" },
                    { label: "Order from China", query: "Order from China" }
                ];
            }
        }

        if (!reply) {
            const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

            if (isGreeting) {
                reply = customerName ? pick([
                    `Hello ${customerName}! Welcome to London's Imports. How can I help you shop, track an order, or explore items today?`,
                    `Hi ${customerName}! So good to have you here at London's Imports. What can I find or track for you today?`,
                    `Good day, ${customerName}! I'm Miss London. Feel free to browse our catalog, check your orders, or tell me what item you need.`
                ]) : pick([
                    "Hello! Welcome to London's Imports. How can I help you shop, track an order, or explore items today?",
                    "Hi! Good to have you here at London's Imports. What can I find or track for you today?",
                    "Good day! I'm Miss London. Feel free to browse our catalog, check your orders, or tell me what item you need."
                ]);
            } else if (isThanks) {
                reply = customerName ? pick([
                    `You're very welcome, ${customerName}! Let me know if you want to explore more items or need any help.`,
                    `Always happy to help, ${customerName}! What else would you like to check out today?`
                ]) : pick([
                    "You're very welcome! Let me know if you want to explore more items or need any help.",
                    "Always happy to help! What else would you like to check out today?"
                ]);
            } else if (isHelp) {
                reply = customerName
                    ? `I am Miss London, your shopping assistant, ${customerName}! I can show you items in our store, help you track your orders, complete balance payments, or assist you with ordering from China.`
                    : "I am Miss London, your shopping assistant! I can show you items in our store, help you track your orders, complete balance payments, or assist you with ordering from China.";
            } else if (isDone) {
                if (hasCartItems) {
                    reply = customerName ? pick([
                        `Are you ready to checkout, ${customerName}? We can finish your order right now.`,
                        `${customerName}, are you all set with your order? We can proceed to checkout, or let me know if you want to add anything else.`,
                        `Ready to wrap up your order, ${customerName}? We can head to checkout right now whenever you are ready.`
                    ]) : pick([
                        "Are you ready to checkout? We can finish your order right now.",
                        "Are you all set with your order? We can proceed to checkout, or let me know if you want to add anything else.",
                        "Ready to wrap up your order? We can head to checkout right now whenever you are ready."
                    ]);
                } else {
                    reply = customerName
                        ? `Your cart is currently empty, ${customerName}! Choose a category below or tell me what you would like to get, and I'll find our best options for you.`
                        : "Your cart is currently empty! Choose a category below or tell me what you would like to get, and I'll find our best options for you.";
                }
            } else if (isYesCheckout) {
                if (hasCartItems) {
                    reply = customerName ? pick([
                        `Awesome, ${customerName}! Let's get your order completed right away.`,
                        `Perfect, ${customerName}! Heading to checkout now so we can wrap this up for you.`,
                        `You got it, ${customerName}! Let's complete your order right away.`
                    ]) : pick([
                        "Awesome! Let's get your order completed right away.",
                        "Perfect! Heading to checkout now so we can wrap this up for you.",
                        "You got it! Let's complete your order right away."
                    ]);
                } else {
                    reply = customerName
                        ? `Your cart is currently empty, ${customerName}! You can browse our categories below or tell me what you want to add before we can checkout.`
                        : "Your cart is currently empty! You can browse our categories below or tell me what you want to add before we can checkout.";
                }
            } else if (isNoKeepShopping) {
                reply = customerName ? pick([
                    `No problem at all, ${customerName}! What else would you love to shop for today?`,
                    `Sure thing, ${customerName}! Tell me what item or style you'd like to check out next.`,
                    `Let's keep shopping, ${customerName}! Tell me what you have in mind and I'll show you our top picks right away.`
                ]) : pick([
                    "No problem at all! What else would you love to shop for today?",
                    "Sure thing! Tell me what item or style you'd like to check out next.",
                    "Let's keep shopping! Tell me what you have in mind and I'll show you our top picks right away."
                ]);
            } else if (isBack) {
                reply = customerName
                    ? `No problem at all, ${customerName}! We're back to the main options. What would you like to do?`
                    : "No problem at all! We're back to the main options. What would you like to do?";
            } else if (products.length > 0) {
                reply = customerName
                    ? `Here are our matching store items available for you, ${customerName}! Which one catches your eye?`
                    : "Here are our matching store items available for you! Which one catches your eye?";
            } else if (/order\s+a\s+product|i\s+want\s+to\s+order|buy\s+a\s+product|place\s+an\s+order/i.test(trimmed)) {
                reply = customerName
                    ? `What can I help you order today, ${customerName}? Let me know the item, color, or style you want and I'll show you what we have right away.`
                    : "What can I help you order today? Let me know the item, color, or style you want and I'll show you what we have right away.";
            } else if (/cart|basket|chart/i.test(trimmed)) {
                if (hasCartItems) {
                    reply = customerName
                        ? `${customerName}, you have ${cartContext.count} item${cartContext.count > 1 ? 's' : ''} in your cart right now. Would you like to proceed straight to checkout or add anything else?`
                        : `You have ${cartContext.count} item${cartContext.count > 1 ? 's' : ''} in your cart right now. Would you like to proceed straight to checkout or add anything else?`;
                } else {
                    reply = customerName
                        ? `Your cart is currently empty, ${customerName}! Choose a category below to browse our catalog, or tell me what you would like to find today.`
                        : "Your cart is currently empty! Choose a category below to browse our catalog, or tell me what you would like to find today.";
                    if (!quickReplies) {
                        quickReplies = [
                            { label: "Browse Catalog", query: "Browse catalog" },
                            ...activeCategories.slice(0, 3).map(c => ({
                                label: c,
                                query: `Show me ${c.toLowerCase()}`
                            })),
                            { label: "Order from China", query: "Order from China" }
                        ];
                    }
                }
            } else if (/source|find|import|china/i.test(trimmed)) {
                reply = customerName
                    ? `We can source and ship almost anything directly from verified suppliers in China to Ghana for you, ${customerName}. Tell me what item you'd like us to find!`
                    : "We can source and ship almost anything directly from verified suppliers in China to Ghana. Tell me what item you'd like us to find for you!";
            } else {
                reply = customerName
                    ? `I couldn't find an exact match for "${trimmed}" in our immediate Accra stock, ${customerName}. We can import it directly from verified factories in China for you, or you can browse our catalog below!`
                    : `I couldn't find an exact match for "${trimmed}" in our immediate Accra stock. We can import it directly from verified factories in China for you, or you can browse our catalog below!`;
                if (!quickReplies) {
                    quickReplies = [
                        { label: "Order from China", query: `I want to order ${trimmed} from China` },
                        { label: "Browse Catalog", query: "Browse catalog" },
                        ...activeCategories.slice(0, 3).map(c => ({
                            label: c,
                            query: `Show me ${c.toLowerCase()}`
                        }))
                    ];
                }
                actionLink = { label: "Browse Catalog", href: "/products" };
            }
        }

        // Attach dynamic action links based on AI recommendation or intent fallback
        if (!actionLink) {
            if (isGreeting) {
                actionLink = { label: "Browse Catalog", href: "/products" };
            } else if (/checkout|done|yes|proceed|pay now|buy now/i.test(trimmed)) {
                if (hasCartItems) {
                    actionLink = { label: "Proceed to Checkout", href: "/checkout" };
                } else {
                    actionLink = { label: "Browse Catalog", href: "/products" };
                }
            } else if (/cart|basket|chart/i.test(trimmed)) {
                if (hasCartItems) {
                    actionLink = { label: "Proceed to Checkout", href: "/checkout" };
                } else {
                    actionLink = { label: "Browse Catalog", href: "/products" };
                }
            } else if (/source|import|china/i.test(trimmed)) {
                actionLink = { label: "Open Sourcing Page", href: "/sourcing" };
            }
        }

        // Safety Gatekeeper: An empty cart must NEVER link to checkout
        if (!hasCartItems && actionLink && actionLink.href.includes('checkout') && !actionLink.href.includes('order=')) {
            actionLink = { label: "Browse Catalog", href: "/products" };
        }

        return NextResponse.json({
            reply,
            products,
            orders,
            actionLink,
            quickReplies
        });

    } catch (error) {
        console.error('[Assistant API Error]:', error);
        return NextResponse.json(
            { error: 'Concierge is momentarily occupied. Please browse directly.' },
            { status: 500 }
        );
    }
}
