import { NextRequest, NextResponse } from 'next/server';

export interface ProductSummary {
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

const ASSISTANT_TOOLS = [
    {
        type: 'function',
        function: {
            name: 'search_products',
            description: "Search for items in London's Imports store catalog when the customer explicitly wants to browse, find, or buy products (e.g. sneakers, handbags, solar chargers, perfumes, scented candles). Do NOT call this for general questions or FAQs.",
            parameters: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'The product keyword(s) to search (e.g. "bag", "scented candles", "shoes")'
                    },
                    category: {
                        type: 'string',
                        description: 'Optional category name or slug'
                    },
                    max_price: {
                        type: 'number',
                        description: 'Optional maximum price in Ghana Cedis (GH₵)'
                    }
                },
                required: ['query']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'track_order',
            description: 'Look up real-time delivery and payment tracking for a customer order by order reference number (e.g. LI-20260905-26446).',
            parameters: {
                type: 'object',
                properties: {
                    order_number: {
                        type: 'string',
                        description: 'The order number, usually starting with LI-'
                    }
                },
                required: ['order_number']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_customer_orders',
            description: "Retrieve the authenticated customer's past placed orders, delivery states, and outstanding balances.",
            parameters: {
                type: 'object',
                properties: {}
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'escalate_to_whatsapp',
            description: "Connect customer to human manager on WhatsApp for custom bulk imports directly from China, container shipments, or complex support.",
            parameters: {
                type: 'object',
                properties: {
                    reason: {
                        type: 'string',
                        description: 'Short reason or topic for human concierge (e.g. "Bulk China container import", "Payment verification")'
                    }
                },
                required: ['reason']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'add_to_cart',
            description: "Add a specific product directly to the customer's cart when they say 'add this to cart', 'add to cart', 'put in my cart', or 'buy this'.",
            parameters: {
                type: 'object',
                properties: {
                    product_name: {
                        type: 'string',
                        description: 'Name or keywords of the product to add'
                    },
                    quantity: {
                        type: 'number',
                        description: 'Quantity to add, default is 1'
                    }
                },
                required: ['product_name']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'remove_from_cart',
            description: "Remove a specific item from the customer's cart when they ask to remove, delete, take out, or drop an item (e.g. 'remove the candle', 'take out the tote bag').",
            parameters: {
                type: 'object',
                properties: {
                    product_name: {
                        type: 'string',
                        description: 'Name or keywords of the product to remove from cart'
                    }
                },
                required: ['product_name']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'clear_cart',
            description: "Empty or clear all items from the customer's cart when they say 'clear my cart', 'empty my cart', or 'remove everything'.",
            parameters: {
                type: 'object',
                properties: {}
            }
        }
    }
];

async function fetchGroqChat(
    groqApiKey: string,
    params: {
        messages: any[];
        tools?: any[];
        tool_choice?: string;
        temperature?: number;
        max_tokens?: number;
    },
    timeoutMs = 8000
) {
    const candidateModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
    for (const model of candidateModels) {
        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqApiKey}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                },
                signal: AbortSignal.timeout(timeoutMs),
                body: JSON.stringify({
                    model,
                    ...params
                }),
            });
            if (res.ok) {
                return await res.json();
            }
            console.warn(`[Groq] Model ${model} returned status ${res.status}`);
        } catch (err) {
            console.warn(`[Groq] Model ${model} failed:`, err);
        }
    }
    return null;
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
            ordersContext = [],
            currentProductSlug
        } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const trimmed = message.trim();
        const customerName = userName && typeof userName === 'string' ? userName.trim() : '';
        const backendBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

        // Cart context summary
        const hasCartItems = Boolean(cartContext && typeof cartContext === 'object' && cartContext.count > 0);
        let cartInfo = 'Customer cart is currently empty.';
        if (hasCartItems) {
            const itemNames = (cartContext.items || []).map((i: any) => `${i.name} (qty: ${i.quantity}, GH₵ ${i.price || '0'})`).join(', ');
            const totalText = cartContext.total ? ` | Cart Subtotal: GH₵ ${cartContext.total}` : '';
            cartInfo = `Customer cart currently has ${cartContext.count} item(s): ${itemNames}${totalText}. If they ask to checkout or pay, warmly confirm and offer the checkout link.`;
        }

        // Fetch live store categories for contextual awareness
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
            // Graceful fallback
        }

        // Active Product Page Context
        let currentProductContext = '';
        if (currentProductSlug && typeof currentProductSlug === 'string') {
            try {
                const pRes = await fetch(`${backendBase.replace(/\/$/, '')}/products/${encodeURIComponent(currentProductSlug)}/`, {
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });
                if (pRes.ok) {
                    const pData = await pRes.json();
                    currentProductContext = `\nCURRENT PAGE CONTEXT:\nThe customer is currently viewing this specific product page:\n- Product Name: "${pData.name || pData.display_name}"\n- Price: GH₵ ${pData.price}\n- Status: ${pData.is_preorder ? 'Pre-order' : 'Ready to ship'}\n- Delivery Window: ${pData.delivery_window_text || '1-2 weeks'}\n- Description: ${(pData.description || pData.subtitle || '').slice(0, 160)}\nIf the customer asks "this", "it", or "add to cart", they are referring to "${pData.name || pData.display_name}".\n`;
                }
            } catch {
                // Graceful fallback
            }
        }

        // Prepare System Prompt with deep domain knowledge
        const orderSummaryContext = ordersContext && ordersContext.length > 0
            ? `Customer Placed Orders on Record:\n` + ordersContext.map((o: any, idx: number) =>
                `${idx + 1}. Order #${o.order_number} | Status: ${o.state_display} | Total: GH₵ ${o.total} | Balance Due: GH₵ ${o.balance_due}`
            ).join('\n')
            : (isAuthenticated ? 'Customer has 0 placed orders.' : 'Customer is currently a visiting guest (not logged in).');

        const systemPrompt = `You are Miss London, the friendly, knowledgeable in-store shopping concierge and customer attendant at London's Imports in Accra, Ghana.
You assist shoppers in Accra, Kumasi, Takoradi, Tema, and across Ghana.

CUSTOMER CONTEXT:
${customerName ? `- You are speaking with "${customerName}". Address them warmly by first name with genuine Ghanaian hospitality.` : `- Visiting guest customer. Address them warmly and politely.`}
- ${isAuthenticated ? 'Customer is signed in.' : 'Customer is not signed in.'}
- ${cartInfo}
${orderSummaryContext}
${currentProductContext}

AVAILABLE STORE CATEGORIES:
${activeCategories.map(c => `- ${c}`).join('\n')}

STORE KNOWLEDGE & POLICIES (GROUNDING FACTS):
1. ABOUT LONDON'S IMPORTS:
   - We import curated, high-quality products directly from verified manufacturers and factories in China (Guangzhou, Yiwu, Shenzhen, 1688, Taobao) to Ghana at direct-factory wholesale prices.
   - All international shipping originates exclusively from China to Ghana. (Note: The store brand is "London's Imports", but all goods are imported directly from China, NOT the UK).
   - Operating from our central sorting and distribution hub in Accra, Ghana.
2. PRE-ORDERS & SHIPPING TIMELINES:
   - Why pre-order? Sourcing directly from China factories gives massive savings compared to local retail markups.
   - How it works: Customers pay a commitment deposit (usually 20% to 50%, or full payment). We procure and quality-inspect items at our China consolidation warehouse, then ship via express Air Freight from China to Ghana (typically arriving in 2 to 3 weeks) or Sea Freight for bulk/heavy items (6 to 8 weeks).
   - Once items arrive at our Accra hub, customers clear any remaining balance and receive their package.
3. DELIVERY ACROSS GHANA:
   - Accra & Tema: Pickup available at our Accra Central hub, or fast doorstep delivery via courier dispatch riders.
   - Rest of Ghana: We dispatch nationwide to Kumasi, Takoradi, Tamale, Sunyani, Cape Coast, Ho, Koforidua, etc. via trusted VIP/STC parcel services or regional couriers.
4. PAYMENT METHODS:
   - MTN Mobile Money (MoMo), Telecel Cash, AT Money, and Visa/Mastercard debit/credit cards via Paystack secure checkout.
   - All prices are strictly transparent in Ghana Cedis (GH₵) with zero hidden fees.
5. CUSTOM CHINA SOURCING:
   - If a customer wants an item not on our website, or wants to import bulk factory batches from China (1688 / Taobao / Guangzhou factories), we can source and ship it for them directly.

GHANAIAN COLLOQUIALISMS & HOSPITALITY:
- Understand casual Ghanaian phrasing, pidgin, or street lingo ("chale", "abeg", "how much be last price?", "I fit pay with MoMo?", "where una office dey?"). Respond warmly with genuine Ghanaian respect and hospitality ("Yes please!", "Certainly!", "No problem at all!").
- "Last price": Politely explain that London's Imports sources directly from overseas factory floors, so our prices are already transparent direct-wholesale with zero local markup.
- "MoMo": Confirm we accept MTN Mobile Money, Telecel Cash, and AT Money directly through Paystack.

YOUR BEHAVIOR RULES (HUMAN SHOPPING CONCIERGE):
- Sound like a real, warm, stylish personal shopping assistant in Accra, NOT a robotic AI language model.
- NEVER use robotic AI clichés like "Certainly!", "As an AI...", "How may I assist you today?", "I hope this finds you well", or rigid lists.
- Speak with natural Ghanaian warmth, friendliness, and hospitality ("Hello please!", "I've got you covered!", "No problem at all!").
- Keep replies conversational, concise, and focused (usually 1 to 3 friendly sentences).
- When a customer wants to browse or find products, call search_products.
- When a customer wants to add an item to their cart, call add_to_cart.
- When a customer wants to remove an item or empty their cart, call remove_from_cart or clear_cart.
- When a customer provides an order number (e.g. LI-20260905-26446), call track_order.
- When customer asks about past orders or unpaid balances, call get_customer_orders.
- If customer wants bulk container imports or human manager assistance, call escalate_to_whatsapp.
- Pre-orders: Reassure the customer that items ship express Air Freight directly from factories in China (2-3 weeks to Accra) or Sea Freight (6-8 weeks for heavy items), fully inspected at our Accra hub.
- Complementary recommendations: If relevant, warmly mention a matching item from our China catalogue that pairs well with their purchase.`;

        // Check for Groq API Key
        const rawKey = process.env.GROQ_API_KEY || '';
        const groqApiKey = rawKey.replace(/["'\r\n]|\\r|\\n/g, '').trim();

        let reply = '';
        let products: ProductSummary[] = [];
        let orders: AssistantOrder[] = [];
        let actionLink: { label: string; href: string } | undefined = undefined;
        let quickReplies: Array<{ label: string; query: string; isCheckout?: boolean }> | undefined = undefined;
        let cartAction: { action: string; product?: ProductSummary; itemId?: string; productName?: string; quantity?: number } | undefined = undefined;

        if (groqApiKey) {
            try {
                // Build conversation messages for Groq
                const validHistory = Array.isArray(conversationHistory)
                    ? conversationHistory
                        .filter((m: any) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
                        .map((m: any) => ({
                            role: m.role as 'user' | 'assistant',
                            content: m.content.trim()
                        }))
                        .slice(-6)
                    : [];

                const messages: any[] = [
                    { role: 'system', content: systemPrompt },
                    ...validHistory,
                    { role: 'user', content: trimmed }
                ];

                // Turn 1: Groq tool decision with fallback
                const groqData1 = await fetchGroqChat(groqApiKey, {
                    messages,
                    tools: ASSISTANT_TOOLS,
                    tool_choice: 'auto',
                    temperature: 0.6,
                    max_tokens: 500,
                }, 9000);

                if (groqData1) {
                    const choice1 = groqData1.choices?.[0]?.message;
                    const toolCalls = choice1?.tool_calls;

                    if (toolCalls && toolCalls.length > 0) {
                        const call = toolCalls[0];
                        const fnName = call.function?.name;
                        let fnArgs: any = {};
                        try {
                            fnArgs = JSON.parse(call.function?.arguments || '{}');
                        } catch {
                            fnArgs = {};
                        }

                        let toolResultPayload: any = null;

                        // ----------------------------------------------------
                        // Execute Tool: search_products
                        // ----------------------------------------------------
                        if (fnName === 'search_products') {
                            const searchQuery = (fnArgs.query || '').trim();
                            const categorySlug = (fnArgs.category || '').trim();
                            const maxPrice = fnArgs.max_price;

                            let searchUrl = `${backendBase.replace(/\/$/, '')}/products/assistant/search/?q=${encodeURIComponent(searchQuery)}`;
                            if (categorySlug) searchUrl += `&category=${encodeURIComponent(categorySlug)}`;
                            if (maxPrice) searchUrl += `&max_price=${maxPrice}`;

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

                            toolResultPayload = {
                                query: searchQuery,
                                found_count: products.length,
                                items: products.map(p => ({
                                    name: p.name,
                                    price: `GH₵ ${p.price}`,
                                    status: p.is_preorder ? 'Pre-order' : 'Ready to ship'
                                }))
                            };

                            actionLink = { label: "Browse Full Catalog", href: "/products" };
                            quickReplies = [
                                { label: "Order from China", query: "Order from China" },
                                ...activeCategories.slice(0, 2).map(c => ({
                                    label: c,
                                    query: `Show me ${c.toLowerCase()}`
                                })),
                                { label: "Check my cart", query: "Check my cart" }
                            ];
                        }

                        // ----------------------------------------------------
                        // Execute Tool: track_order
                        // ----------------------------------------------------
                        else if (fnName === 'track_order') {
                            const rawOrderNum = (fnArgs.order_number || '').trim();
                            const cleanedOrderNum = rawOrderNum.toUpperCase().startsWith('LI-') ? rawOrderNum.toUpperCase() : `LI-${rawOrderNum}`;

                            // Check ordersContext first
                            let trackedOrder: AssistantOrder | null = ordersContext.find(
                                (o: any) => (o.order_number || '').toUpperCase() === cleanedOrderNum
                            ) || null;

                            // If not in context, query public track API
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
                                orders = [trackedOrder];
                                toolResultPayload = {
                                    found: true,
                                    order_number: trackedOrder.order_number,
                                    status: trackedOrder.state_display,
                                    delivery_window: trackedOrder.delivery_window,
                                    balance_due: trackedOrder.balance_due
                                };

                                if (trackedOrder.balance_due > 0) {
                                    actionLink = {
                                        label: `Pay Balance (GH₵ ${trackedOrder.balance_due.toFixed(2)})`,
                                        href: `/checkout?order=${trackedOrder.order_number}`
                                    };
                                } else {
                                    actionLink = {
                                        label: "View Live Tracking",
                                        href: `/track?order=${trackedOrder.order_number}`
                                    };
                                }
                                quickReplies = [
                                    { label: "View All Orders", query: "My orders" },
                                    { label: "Browse Catalog", query: "Browse catalog" }
                                ];
                            } else {
                                toolResultPayload = {
                                    found: false,
                                    order_number: cleanedOrderNum,
                                    message: "Order number not found in system."
                                };
                                actionLink = { label: "Track on Orders Page", href: "/track" };
                                quickReplies = [
                                    { label: "Browse Catalog", query: "Browse catalog" },
                                    { label: "Chat on WhatsApp", query: "Chat on WhatsApp" }
                                ];
                            }
                        }

                        // ----------------------------------------------------
                        // Execute Tool: get_customer_orders
                        // ----------------------------------------------------
                        else if (fnName === 'get_customer_orders') {
                            if (!isAuthenticated) {
                                toolResultPayload = {
                                    authenticated: false,
                                    message: "Customer is not logged in. Ask them to sign in or provide their LI- order number."
                                };
                                actionLink = { label: "Sign In to View Orders", href: "/login?redirect=/orders" };
                                quickReplies = [
                                    { label: "Sign In", query: "Sign in" },
                                    { label: "Browse Catalog", query: "Browse catalog" }
                                ];
                            } else {
                                orders = ordersContext.slice(0, 4);
                                toolResultPayload = {
                                    authenticated: true,
                                    order_count: ordersContext.length,
                                    orders: ordersContext.map((o: any) => ({
                                        order_number: o.order_number,
                                        status: o.state_display,
                                        balance_due: o.balance_due
                                    }))
                                };

                                const unpaid = ordersContext.find((o: any) => o.balance_due > 0 || o.state === 'PENDING_PAYMENT');
                                if (unpaid) {
                                    actionLink = {
                                        label: `Pay Balance (GH₵ ${parseFloat(unpaid.balance_due || 0).toFixed(2)})`,
                                        href: `/checkout?order=${unpaid.order_number}`
                                    };
                                } else {
                                    actionLink = { label: "View Orders Page", href: "/orders" };
                                }
                                quickReplies = [
                                    { label: "Browse Catalog", query: "Browse catalog" },
                                    { label: "Order from China", query: "Order from China" }
                                ];
                            }
                        }

                        // ----------------------------------------------------
                        // Execute Tool: add_to_cart
                        // ----------------------------------------------------
                        else if (fnName === 'add_to_cart') {
                            const rawTarget = (fnArgs.product_name || '').trim();
                            const qty = Math.max(1, parseInt(fnArgs.quantity || 1, 10));

                            let matchedProduct: ProductSummary | null = null;

                            // 1. If currently viewing a product page, check if user is referring to the active product
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

                            // 2. If not matched yet, search catalog
                            if (!matchedProduct && rawTarget) {
                                let searchUrl = `${backendBase.replace(/\/$/, '')}/products/assistant/search/?q=${encodeURIComponent(rawTarget)}`;
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
                                cartAction = {
                                    action: 'add',
                                    product: matchedProduct,
                                    quantity: qty
                                };
                                products = [matchedProduct];
                                toolResultPayload = {
                                    success: true,
                                    added: true,
                                    product_name: matchedProduct.name,
                                    price: `GH₵ ${matchedProduct.price}`,
                                    quantity: qty
                                };
                                actionLink = { label: "Proceed to Checkout", href: "/checkout" };
                                quickReplies = [
                                    { label: "Proceed to Checkout", query: "Proceed to checkout", isCheckout: true },
                                    { label: "Keep Shopping", query: "Browse catalog" },
                                    { label: "Check my cart", query: "Check my cart" }
                                ];
                            } else {
                                toolResultPayload = {
                                    success: false,
                                    added: false,
                                    message: `Could not find product matching "${rawTarget}" in our catalog.`
                                };
                                actionLink = { label: "Browse Catalog", href: "/products" };
                                quickReplies = [
                                    { label: "Browse Catalog", query: "Browse catalog" },
                                    { label: "Order from China", query: "Order from China" }
                                ];
                            }
                        }

                        // ----------------------------------------------------
                        // Execute Tool: escalate_to_whatsapp
                        // ----------------------------------------------------
                        else if (fnName === 'escalate_to_whatsapp') {
                            const reason = fnArgs.reason || 'General Inquiry';
                            const waText = `Hello London's Imports, I am inquiring with Miss London about: ${reason}`;
                            const waUrl = `https://wa.me/233545247009?text=${encodeURIComponent(waText)}`;

                            toolResultPayload = {
                                success: true,
                                channel: "WhatsApp Concierge",
                                reason
                            };

                            actionLink = { label: "Open WhatsApp Chat", href: waUrl };
                            quickReplies = [
                                { label: "Browse Catalog", query: "Browse catalog" },
                                { label: "Track My Order", query: "Track my order" }
                            ];
                        }

                        // ----------------------------------------------------
                        // Execute Tool: remove_from_cart
                        // ----------------------------------------------------
                        else if (fnName === 'remove_from_cart') {
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
                                cartAction = {
                                    action: 'remove',
                                    itemId: matchedItem.id,
                                    productName: matchedItem.name
                                };
                                toolResultPayload = {
                                    success: true,
                                    removed: true,
                                    product_name: matchedItem.name,
                                    remaining_items: Math.max(0, cartItems.length - 1)
                                };
                                actionLink = { label: "View Cart", href: "/cart" };
                                quickReplies = [
                                    { label: "Proceed to Checkout", query: "Proceed to checkout", isCheckout: true },
                                    { label: "Browse Catalog", query: "Browse catalog" }
                                ];
                            } else {
                                toolResultPayload = {
                                    success: false,
                                    removed: false,
                                    message: `Could not find "${fnArgs.product_name}" in your cart.`
                                };
                                quickReplies = [
                                    { label: "What is in my cart?", query: "What is in my cart?" },
                                    { label: "Browse Catalog", query: "Browse catalog" }
                                ];
                            }
                        }

                        // ----------------------------------------------------
                        // Execute Tool: clear_cart
                        // ----------------------------------------------------
                        else if (fnName === 'clear_cart') {
                            cartAction = {
                                action: 'clear'
                            };
                            toolResultPayload = {
                                success: true,
                                cleared: true,
                                message: "All items have been removed from your cart."
                            };
                            actionLink = { label: "Browse Catalog", href: "/products" };
                            quickReplies = [
                                { label: "Browse Catalog", query: "Browse catalog" },
                                { label: "Order from China", query: "Order from China" }
                            ];
                        }

                        // Turn 2: Send tool output back to Groq for final human response
                        choice1.tool_calls = [call];
                        messages.push(choice1);
                        messages.push({
                            role: 'tool',
                            tool_call_id: call.id,
                            content: JSON.stringify(toolResultPayload)
                        });

                        const groqData2 = await fetchGroqChat(groqApiKey, {
                            messages,
                            temperature: 0.6,
                            max_tokens: 450,
                        }, 9000);

                        if (groqData2) {
                            reply = (groqData2.choices?.[0]?.message?.content || '').trim();
                        }
                    } else if (choice1?.content) {
                        // Direct conversational response (No tools needed)
                        reply = choice1.content.trim();

                        // Formulate contextual quick replies and action link based on conversation
                        if (/what\s*can\s*you\s*do|help|services|about/i.test(trimmed)) {
                            actionLink = { label: "Browse Catalog", href: "/products" };
                            quickReplies = [
                                { label: "Browse Catalog", query: "Browse catalog" },
                                { label: "Track My Order", query: "Track my order" },
                                { label: "How Pre-orders Work", query: "How do pre-orders work?" },
                                { label: "Order from China", query: "Order from China" }
                            ];
                        } else if (/pre-?orders?|how\s*it\s*works/i.test(trimmed)) {
                            actionLink = { label: "Explore Products", href: "/products" };
                            quickReplies = [
                                { label: "Browse Catalog", query: "Browse catalog" },
                                { label: "Order from China", query: "Order from China" },
                                { label: "Track My Order", query: "Track my order" }
                            ];
                        } else if (hasCartItems && /checkout|pay|ready|done/i.test(trimmed)) {
                            actionLink = { label: "Proceed to Checkout", href: "/checkout" };
                            quickReplies = [
                                { label: "Proceed to Checkout", query: "Proceed to checkout", isCheckout: true },
                                { label: "Keep Shopping", query: "Browse catalog" }
                            ];
                        } else {
                            actionLink = { label: "Browse Catalog", href: "/products" };
                            quickReplies = [
                                { label: "Browse Catalog", query: "Browse catalog" },
                                { label: "Track My Order", query: "Track my order" },
                                { label: "Order from China", query: "Order from China" }
                            ];
                        }
                    }
                }
            } catch (err) {
                console.error('[Assistant API] Groq invocation failed:', err);
            }
        }

        // ========================================================
        // Fallback: If Groq did not answer
        // ========================================================
        if (!reply) {
            // Check for direct order query
            const orderMatch = trimmed.match(/\b(LI-\d{8}-\d{5}|LI-[A-Za-z0-9-]+)\b/i);
            if (orderMatch) {
                const targetNum = orderMatch[1].toUpperCase();
                reply = customerName
                    ? `I'm checking order #${targetNum} for you, ${customerName}. You can see real-time updates and balance status below!`
                    : `I'm checking order #${targetNum} for you. You can see real-time updates and balance status below!`;
                actionLink = { label: "Track Shipment", href: `/track?order=${targetNum}` };
                quickReplies = [{ label: "Browse Catalog", query: "Browse catalog" }];
            } else if (/what\s*can\s*you\s*do|who\s*are\s*you|help/i.test(trimmed)) {
                reply = customerName
                    ? `Hello ${customerName}! I'm Miss London, your shopping assistant at London's Imports. I can help you find items in our store, order products directly from China at factory prices, track your packages, or check your balance.`
                    : "Hello! I'm Miss London, your shopping assistant at London's Imports. I can help you find items in our store, order products directly from China at factory prices, track your packages, or check your balance.";
                actionLink = { label: "Browse Catalog", href: "/products" };
                quickReplies = [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    { label: "Track My Order", query: "Track my order" },
                    { label: "How Pre-orders Work", query: "How do pre-orders work?" }
                ];
            } else if (/pre-?order|how\s*does\s*it\s*work/i.test(trimmed)) {
                reply = "With our pre-order model, you pay a deposit to secure direct factory prices. We inspect your package overseas and fly it to Accra in 2 to 3 weeks. Once it lands, you pay any remaining balance upon collection or delivery!";
                actionLink = { label: "Browse Catalog", href: "/products" };
                quickReplies = [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    { label: "Order from China", query: "Order from China" }
                ];
            } else if (products.length > 0) {
                reply = customerName
                    ? `Here are the items we found for you, ${customerName}! Which one catches your eye?`
                    : "Here are the items we found for you! Which one catches your eye?";
                actionLink = { label: "Browse Full Catalog", href: "/products" };
            } else if (orders.length > 0) {
                reply = customerName
                    ? `Here are your order details on record, ${customerName}:`
                    : "Here are your order details on record:";
            } else {
                reply = customerName
                    ? `Hello ${customerName}! How can I help you shop, track an order, or check our catalog today?`
                    : "Hello! How can I help you shop, track an order, or check our catalog today?";
                actionLink = { label: "Browse Catalog", href: "/products" };
                quickReplies = [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    { label: "Track My Order", query: "Track my order" },
                    { label: "Order from China", query: "Order from China" }
                ];
            }
        }

        return NextResponse.json({
            reply,
            products,
            orders,
            actionLink,
            quickReplies,
            cartAction
        });
    } catch (e: any) {
        console.error('[Assistant API] Internal error:', e);
        return NextResponse.json({
            reply: "I am ready to assist you! Feel free to browse our catalog or track your orders.",
            products: [],
            orders: [],
            actionLink: { label: "Browse Catalog", href: "/products" },
            cartAction: undefined
        });
    }
}
