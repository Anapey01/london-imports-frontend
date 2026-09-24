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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, conversationHistory = [], cartContext, userName } = body;

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
        const isControlQuery = /^(done|i'?m\s*done|i\s*am\s*done|finished|that'?s\s*all|that\s*is\s*all|nothing\s*else|no\s*more|done\s*ordering|all\s*done|we\s*are\s*done|yes|yeah|yep|proceed|checkout|proceed\s*to\s*checkout|go\s*to\s*checkout|take\s*me\s*to\s*checkout|check\s*out|pay\s*now|buy\s*now|no|not\s*yet|keep\s*shopping|order\s*something\s*else|back|go\s*back|return|previous|menu|main\s*menu|start\s*over|check\s*my\s*cart|track\s*my\s*order|order\s*a\s*product|order\s*from\s*china|hi|hey|hello|good\s*(morning|afternoon|evening|day)|yo|sup|charley|thanks|thank\s*you|help)$/i.test(trimmed);
        const isBrowseCatalog = /^(browse(\s+our|\s+the)?\s+catalog|browse(\s+our|\s+the)?\s+store|browse(\s+our|\s+the)?\s+products?|show(\s+our|\s+the)?\s+catalog|show(\s+our|\s+the)?\s+store|show(\s+all)?\s+products?|view(\s+our|\s+the)?\s+catalog|catalog|all products|shop catalog|explore products|see catalog|browse)$/i.test(trimmed);

        // 1. Search our verified backend catalog
        let products: ProductSummary[] = [];
        try {
            // Strip common conversational filler words to extract search keywords
            let cleanQuery = trimmed
                .replace(/^(can you (find|show|get)|i need|i want to see|i want|looking for|show me all the|show all the|show me|show all|please find|do you have|what|search for|order a product|check my cart|track my order)\s+/i, '')
                .replace(/\s+(do you have|we have|available|in stock|you got)\??$/i, '')
                .replace(/[?!.,]/g, '')
                .trim();

            if (isBrowseCatalog) {
                // Fetch our top active store items directly so they appear right inside the chatbox
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

        // 2. Fetch live store categories from backend for AI context
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

        const hasCartItems = Boolean(cartContext && typeof cartContext === 'object' && cartContext.count > 0);

        // 3. Formulate Concierge response using Groq if key is present
        const rawKey = process.env.GROQ_API_KEY || '';
        const groqApiKey = rawKey.replace(/["'\r\n]/g, '').trim();
        let reply = '';
        let aiActionLink: { label: string; href: string } | undefined = undefined;
        let aiQuickReplies: Array<{ label: string; query: string; isCheckout?: boolean }> | undefined = undefined;

        if (groqApiKey) {
            try {
                const productContext = products.length > 0
                    ? `Available matching items in shop:\n` + products.map((p, idx) => `${idx + 1}. ${p.name}`).join('\n')
                    : 'No matching products searched.';

                const systemPrompt = `You are Miss London, a polite, helpful store attendant and receptionist at London's Imports in a shopping mall in Accra, Ghana.
You assist customers in Accra, Kumasi, Tema, and across Ghana who visit your store or chat with you to buy items, order products from China, or ask questions.

${customerName ? `Customer:
- You are attending to "${customerName}".
- Call them naturally by their first name (${customerName}) with genuine Ghanaian respect and hospitality.` : `Customer:
- You are attending to a visiting guest customer. Treat them warmly and politely.`}

Real store categories available right now:
${activeCategories.map(c => `- ${c}`).join('\n')}

HOW TO TALK AND ACT (BEHAVIOR RULES):
1. Speak in plain, simple, everyday English that ANYONE can easily understand.
   - Do NOT use big English, complex vocabulary, or high-class boutique jargon!
   - Talk like a normal, respectful, caring person attending to customers in a shopping mall store in Ghana.
2. If the customer greets you (e.g. "hey", "hello", "hi", "good day"), greet them back warmly and politely, call them by name, and ask how you can help them shop or order today! NEVER treat greetings as a search for an item.
3. If the customer thanks you ("thanks", "cool", "ok"), respond with genuine warmth and ask if they'd like to explore anything else.
4. NEVER sound like a machine, AI, or robot.
   - NEVER say "I am an AI", "large language model", or "virtual assistant". You are a real human store attendant helping them shop.
   - NEVER recite database fields, batch numbers, or logistics codes (like "pre-order batch with a 3-4 week delivery time").
   - NEVER give button instructions (DO NOT say "browse the cards below", "tap '+ Add'", or "click the button"). The customer already sees the pictures and buttons on their screen!
   - NEVER add summary notes or brackets like "(Found 4 verified product cards)".
5. In an ongoing conversation, do not repeat "Welcome to London's Imports" in every message; just answer directly, warmly, and naturally.
6. Keep answers brief and clear: 1 to 2 simple sentences so customers don't get tired reading.

OUTPUT FORMAT:
Always return a valid JSON object with this exact structure:
{
  "reply": "Your warm, polite, 1-2 sentence spoken response to the customer in simple, everyday English.",
  "actionLink": { "label": "Browse Catalog", "href": "/products" } OR { "label": "Proceed to Checkout", "href": "/checkout" } OR null,
  "quickReplies": [
    { "label": "Short button label", "query": "Search query or request", "isCheckout": false }
  ]
}

Context-driven intelligence for actionLink and quickReplies:
- If customer greets you ("hey", "hello", "hi"):
  * actionLink should be {"label": "Browse Catalog", "href": "/products"}.
  * quickReplies should suggest {"label": "Browse Catalog", "query": "Browse catalog"}, {"label": "Order from China", "query": "Order from China"}, and 2 store categories.
- If customer's cart is EMPTY (0 items):
  * actionLink MUST be {"label": "Browse Catalog", "href": "/products"}.
  * quickReplies MUST start with {"label": "Browse Catalog", "query": "Browse catalog", "isCheckout": false} followed by 2 to 3 real store categories or "Order from China" (e.g. "Bags", "Accessories", "Order from China").
  * NEVER suggest or provide checkout when cart is empty!
- If customer asks to browse catalog or view products:
  * actionLink should be {"label": "Browse Catalog", "href": "/products"} or null.
  * quickReplies should suggest store categories (e.g. "Bags", "Accessories", "Shoes", "Order from China") so they can filter or explore.
- If customer's cart has items and they are done or ready to pay:
  * actionLink MUST be {"label": "Proceed to Checkout", "href": "/checkout"}.
  * quickReplies should offer {"label": "Proceed to Checkout", "query": "Proceed to checkout", "isCheckout": true} and {"label": "Order something else", "query": "Order something else", "isCheckout": false}.
- If customer asks about or looks at products:
  * quickReplies should suggest relevant next options (like other categories, checking cart, or custom China sourcing).

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
                    signal: AbortSignal.timeout(6000), // 6 seconds timeout so assistant never lags
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
                } else {
                    const errText = await groqRes.text().catch(() => '');
                    console.error('[Assistant API] Groq HTTP Error:', groqRes.status, errText);
                }
            } catch (err) {
                console.error('[Assistant API] Groq invocation error:', err);
            }
        }

        // 4. Dynamic fallback replies & quickReplies when AI did not supply them
        let quickReplies: Array<{ label: string; query: string; isCheckout?: boolean }> | undefined = aiQuickReplies;
        let actionLink: { label: string; href: string } | undefined = aiActionLink;

        const isDone = /^(done|i'?m done|i am done|finished|that'?s all|that is all|nothing else|no more|done ordering|all done|we are done)$/i.test(trimmed);
        const isYesCheckout = /^(yes|yeah|yep|proceed|checkout|proceed to checkout|go to checkout|take me to checkout|yes,? proceed( to checkout)?|check out|pay now|buy now)$/i.test(trimmed);
        const isNoKeepShopping = /^(no|not yet|keep shopping|order something else|no,? order something else|something else|more)$/i.test(trimmed);
        const isBack = /^(back|go back|return|previous|menu|main menu|start over)$/i.test(trimmed);

        if (!quickReplies) {
            if (isGreeting) {
                quickReplies = [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    ...activeCategories.slice(0, 3).map(c => ({
                        label: c,
                        query: `Show me ${c.toLowerCase()}`
                    })),
                    { label: "Order from China", query: "Order from China" }
                ];
            } else if (isThanks) {
                quickReplies = hasCartItems ? [
                    { label: "Proceed to Checkout", query: "Proceed to checkout", isCheckout: true },
                    { label: "Browse Catalog", query: "Browse catalog" },
                    { label: "Order from China", query: "Order from China" }
                ] : [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    ...activeCategories.slice(0, 3).map(c => ({
                        label: c,
                        query: `Show me ${c.toLowerCase()}`
                    })),
                    { label: "Order from China", query: "Order from China" }
                ];
            } else if (isHelp) {
                quickReplies = [
                    { label: "Browse Catalog", query: "Browse catalog" },
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
                    { label: "Order from China", query: "Order from China" },
                    { label: "Track my order", query: "Track my order" }
                ];
            }
        }

        if (!reply) {
            const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

            if (isGreeting) {
                reply = customerName ? pick([
                    `Hello ${customerName}! Welcome to London's Imports. How can I help you shop or order today?`,
                    `Hi ${customerName}! So good to have you here at London's Imports. What can I find for you today?`,
                    `Good day, ${customerName}! I'm Miss London. Feel free to browse our catalog or tell me what item you need.`
                ]) : pick([
                    "Hello! Welcome to London's Imports. How can I help you shop or order today?",
                    "Hi! Good to have you here at London's Imports. What can I find for you today?",
                    "Good day! I'm Miss London. Feel free to browse our catalog or tell me what item you need."
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
                    ? `I am Miss London, your shopping assistant, ${customerName}! I can show you items in our store, help you order items directly from China, check your cart, or assist you with checkout.`
                    : "I am Miss London, your shopping assistant! I can show you items in our store, help you order items directly from China, check your cart, or assist you with checkout.";
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
                    `No problem at all, ${customerName}! What else would you love to shop for today? (For example: quality sneakers, designer bags, perfumes, or clothing)`,
                    `Sure thing, ${customerName}! Tell me what item or style you'd like to check out next.`,
                    `Let's keep shopping, ${customerName}! Tell me what you have in mind and I'll show you our top picks right away.`
                ]) : pick([
                    "No problem at all! What else would you love to shop for today? (For example: quality sneakers, designer bags, perfumes, or clothing)",
                    "Sure thing! Tell me what item or style you'd like to check out next.",
                    "Let's keep shopping! Tell me what you have in mind and I'll show you our top picks right away."
                ]);
            } else if (isBack) {
                const lastAssistantMsg = [...conversationHistory].reverse().find((m: any) => m.role === 'assistant')?.content || '';
                const wasCartOrCheckout = /cart|checkout|added/i.test(lastAssistantMsg);
                const wasProducts = /bag|shoe|item|product|catalog/i.test(lastAssistantMsg);

                if (wasCartOrCheckout) {
                    reply = customerName
                        ? `No problem at all, ${customerName}! We're back to browsing our store. What else would you love to check out today?`
                        : "No problem at all! We're back to browsing our store. What else would you love to check out today?";
                } else if (wasProducts) {
                    reply = customerName
                        ? `Sure thing, ${customerName}! Stepping back to the main options. What category or style would you like to explore next?`
                        : "Sure thing! Stepping back to the main options. What category or style would you like to explore next?";
                } else {
                    reply = customerName
                        ? `No problem, ${customerName}! Here are the main options to help you shop today:`
                        : "No problem! Here are the main options to help you shop today:";
                }
            } else if (products.length > 0) {
                const isBrowse = /browse|catalog|all\s+products|popular/i.test(trimmed);
                const isBags = /bag|abg|tote|clutch|duffel|purse/i.test(trimmed) || products.some(p => /bag/i.test(p.category || p.name));
                const isShoes = /shoe|sneaker|heel|boot/i.test(trimmed) || products.some(p => /shoe/i.test(p.category || p.name));

                if (isBrowse) {
                    reply = customerName ? pick([
                        `Here are our popular store items available right now, ${customerName}! Which one catches your eye?`,
                        `I pulled up our top shop items for you, ${customerName}! Take a look below.`
                    ]) : pick([
                        "Here are our popular store items available right now! Which one catches your eye?",
                        "I pulled up our top shop items! Take a look below."
                    ]);
                } else if (isBags) {
                    reply = customerName ? pick([
                        `Here are the stylish bags we have in stock right now, ${customerName}! Which style catches your eye?`,
                        `I found some lovely bag options for you, ${customerName}! Let me know what you think.`,
                        `${customerName}, take a look at our current handbag collection! Which one is your favorite?`
                    ]) : pick([
                        `Here are the stylish bags we have in stock right now! Which style catches your eye?`,
                        `I found some lovely bag options for you! Let me know what you think.`,
                        `Take a look at our current handbag collection! Which one is your favorite?`
                    ]);
                } else if (isShoes) {
                    reply = customerName ? pick([
                        `I've pulled up our footwear collection for you, ${customerName}! Which style catches your eye?`,
                        `Here are the lovely shoes we currently have available, ${customerName}! See anything you love?`,
                        `${customerName}, take a look at our current shoe collection! Let me know what you think.`
                    ]) : pick([
                        `I've pulled up our footwear collection for you! Which style catches your eye?`,
                        `Here are the lovely shoes we currently have available! See anything you love?`,
                        `Take a look at our current shoe collection! Let me know what you think.`
                    ]);
                } else {
                    reply = customerName ? pick([
                        `I pulled up our top options for you, ${customerName}! Which one catches your eye?`,
                        `Here are the items we have available for you, ${customerName}! Let me know what you think.`
                    ]) : pick([
                        `I pulled up our top options for you! Which one catches your eye?`,
                        `Here are the items we have available! Let me know what you think.`
                    ]);
                }
            } else if (/order\s+a\s+product|i\s+want\s+to\s+order|buy\s+a\s+product|place\s+an\s+order/i.test(trimmed)) {
                reply = customerName ? pick([
                    `What would you love to shop for today, ${customerName}? (For example: quality sneakers, designer handbags, perfumes, or clothing)`,
                    `I'm ready to find whatever you need, ${customerName}! Are you searching for footwear, fashion bags, electronics, or personal care today?`,
                    `${customerName}, tell me what item you have in mind — whether it's sneakers, wristwatches, phone accessories, or bags, and I'll find our best options for you!`,
                    `What item are you looking to buy today, ${customerName}? If you have a specific brand or style in mind, let me know and I'll check our stock!`,
                    `Happy to help you shop, ${customerName}! Tell me the product name or category you're looking for, and I'll pull up the best options for you in Cedis.`,
                    `What can I help you order today, ${customerName}? Let me know the item, color, or type you want and I'll show you what we have right away.`
                ]) : pick([
                    "What would you love to shop for today? (For example: quality sneakers, designer handbags, perfumes, or clothing)",
                    "I'm ready to find whatever you need! Are you searching for footwear, fashion bags, electronics, or personal care today?",
                    "Tell me what item you have in mind — whether it's sneakers, wristwatches, phone accessories, or bags, and I'll find our best options for you!",
                    "What item are you looking to buy today? If you have a specific brand or style in mind, let me know and I'll check our stock!",
                    "Happy to help you shop! Tell me the product name or category you're looking for, and I'll pull up the best options for you in Cedis.",
                    "What can I help you order today? Let me know the item, color, or type you want and I'll show you what we have right away."
                ]);
            } else if (/cart|basket|chart/i.test(trimmed)) {
                if (hasCartItems) {
                    reply = customerName ? pick([
                        `${customerName}, you have ${cartContext.count} item${cartContext.count > 1 ? 's' : ''} in your cart right now. Would you like to proceed straight to checkout or add anything else?`,
                        `I checked your cart, ${customerName} — you currently have ${cartContext.count} item${cartContext.count > 1 ? 's' : ''} ready. Ready to proceed to checkout or still browsing?`,
                        `Your cart has ${cartContext.count} product${cartContext.count > 1 ? 's' : ''} saved, ${customerName}. We can proceed to checkout whenever you're ready!`
                    ]) : pick([
                        `You have ${cartContext.count} item${cartContext.count > 1 ? 's' : ''} in your cart right now. Would you like to proceed straight to checkout or add anything else?`,
                        `I checked your cart — you currently have ${cartContext.count} item${cartContext.count > 1 ? 's' : ''} ready. Ready to proceed to checkout or still browsing?`,
                        `Your cart has ${cartContext.count} product${cartContext.count > 1 ? 's' : ''} saved. We can proceed to checkout whenever you're ready!`
                    ]);
                } else {
                    reply = customerName ? pick([
                        `Your cart is currently empty, ${customerName}! Choose a category below to browse our catalog, or tell me what you would like to find today.`,
                        `${customerName}, you don't have any items in your cart yet. Take a look at our categories below to find something nice!`,
                        `Your cart is empty right now, ${customerName}. You can browse our categories below, or tell me what you need.`
                    ]) : pick([
                        "Your cart is currently empty! Choose a category below to browse our catalog, or tell me what you would like to find today.",
                        "You don't have any items in your cart yet. Take a look at our categories below to find something nice!",
                        "Your cart is empty right now. You can browse our categories below, or tell me what you need."
                    ]);
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
                reply = customerName ? pick([
                    `Yes, ${customerName}! If you want an item from China that is not in our shop, we can buy and deliver it directly to you in Ghana. What product are you looking to import?`,
                    `We can source and ship almost anything directly from verified suppliers in China to Ghana for you, ${customerName}. Tell me what item you'd like us to find!`,
                    `Looking to order directly from China, ${customerName}? We handle the purchasing, inspection, and air/sea shipping straight to Ghana. What item do you need?`,
                    `${customerName}, we import directly from factories in China to your doorstep in Ghana! What product or brand are you looking to source?`
                ]) : pick([
                    "Yes! If you want an item from China that is not in our shop, we can buy and deliver it directly to you in Ghana. What product are you looking to import?",
                    "We can source and ship almost anything directly from verified suppliers in China to Ghana. Tell me what item you'd like us to find for you!",
                    "Looking to order directly from China? We handle the purchasing, inspection, and air/sea shipping straight to Ghana. What item do you need?",
                    "We import directly from factories in China to your doorstep in Ghana! What product or brand are you looking to source?"
                ]);
            } else if (/track/i.test(trimmed)) {
                reply = customerName ? pick([
                    `${customerName}, you can easily track your package and see delivery updates using your order reference number on our tracking page.`,
                    `To track your shipment, ${customerName}, click the link below to view real-time updates and arrival timeline.`,
                    `Want to know where your shipment is, ${customerName}? You can check the current status of all your orders directly on your orders page below!`
                ]) : pick([
                    "You can easily track your package and see delivery updates using your order reference number on our tracking page.",
                    "To track your order, click the link below to view your real-time shipment updates and arrival timeline.",
                    "Want to know where your shipment is? You can check the current status of all your orders directly on your orders page below!"
                ]);
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

        // 5. Attach dynamic action links based on AI recommendation or intent fallback
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
            } else if (/track/i.test(trimmed)) {
                actionLink = { label: "View My Orders", href: "/orders" };
            }
        }

        // Safety Gatekeeper: An empty cart must NEVER link to checkout
        if (!hasCartItems && actionLink && actionLink.href.includes('checkout')) {
            actionLink = { label: "Browse Catalog", href: "/products" };
        }

        return NextResponse.json({
            reply,
            products,
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
