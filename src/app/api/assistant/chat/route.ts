import { NextRequest, NextResponse } from 'next/server';
import { ASSISTANT_TOOLS, ProductSummary, AssistantOrder } from '@/lib/assistant/tools';
import { fetchGroqChat } from '@/lib/assistant/groq-client';
import { getClientIp, checkRateLimit, isAdversarialInput } from '@/lib/assistant/rate-limiter';
import { buildSystemPrompt } from '@/lib/assistant/system-prompt';
import { executeAssistantTool, ToolExecutionContext } from '@/lib/assistant/tool-handlers';
import { cleanAssistantReply, generateAssistantFallback } from '@/lib/assistant/fallback';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export type { ProductSummary, AssistantOrder };

export async function POST(req: NextRequest) {
    try {
        // 1. IP Rate Limiting (Defense against DoS and token exhaustion)
        const clientIp = getClientIp(req);
        const { allowed, retryAfter } = checkRateLimit(clientIp, 30, 60000);
        if (!allowed) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded. Please wait a moment before sending another message.',
                    reply: "You're chatting quite fast! Please give me a quick moment to catch up."
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(retryAfter || 60),
                        'X-Content-Type-Options': 'nosniff'
                    }
                }
            );
        }

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

        const trimmed = message.trim().replace(/\0/g, '');

        // 2. Strict Input Boundary Check
        if (trimmed.length > 1000) {
            return NextResponse.json(
                { error: 'Message too long. Maximum 1,000 characters allowed.' },
                { status: 400 }
            );
        }

        // 3. Fast-path Adversarial Injection Mitigation (0 token spend)
        if (isAdversarialInput(trimmed)) {
            return NextResponse.json({
                reply: "I am Miss London, your shopping assistant at London's Imports in Ghana. I can help you shop our collection, place pre-orders from China factories, and track your shipments. What can I help you find today?",
                products: [],
                orders: [],
                actionLink: { label: "Browse Catalog", href: "/products" },
                quickReplies: [
                    { label: "Browse Catalog", query: "Browse catalog" },
                    { label: "Track My Order", query: "Track my order" },
                    { label: "Order from China", query: "Order from China" }
                ]
            });
        }

        const customerName = userName && typeof userName === 'string' ? userName.trim().slice(0, 50) : '';
        const backendBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

        // Cart context summary
        const hasCartItems = Boolean(cartContext && typeof cartContext === 'object' && cartContext.count > 0);
        let cartInfo = 'Customer cart is currently empty.';
        if (hasCartItems) {
            const rawItems = Array.isArray(cartContext.items) ? cartContext.items.slice(0, 20) : [];
            const itemNames = rawItems.map((i: any) => `${String(i.name || '').slice(0, 50)} (qty: ${Math.min(100, Math.max(1, parseInt(i.quantity || 1, 10)))}, GH₵ ${i.price || '0'})`).join(', ');
            const totalText = cartContext.total ? ` | Cart Subtotal: GH₵ ${cartContext.total}` : '';
            cartInfo = `Customer cart currently has ${rawItems.length} item(s): ${itemNames}${totalText}. If they ask to checkout or pay, warmly confirm and offer the checkout link.`;
        }

        // Active Store Categories
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
        if (currentProductSlug && typeof currentProductSlug === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(currentProductSlug)) {
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

        const orderSummaryContext = ordersContext && ordersContext.length > 0
            ? `Customer has ${ordersContext.length} order(s) on file with London's Imports. When they ask to view, track, or check their orders or balances, ALWAYS invoke the get_customer_orders tool so interactive order cards appear on their screen. NEVER list order numbers or write markdown tables in text.`
            : (isAuthenticated ? 'Customer has 0 placed orders.' : 'Customer is currently a visiting guest (not logged in).');

        const systemPrompt = buildSystemPrompt({
            customerName,
            isAuthenticated,
            cartInfo,
            orderSummaryContext,
            currentProductContext,
            activeCategories,
        });

        const toolCtx: ToolExecutionContext = {
            backendBase,
            customerName,
            ordersContext,
            currentProductSlug,
            cartContext,
            isAuthenticated,
            activeCategories,
        };

        const rawKey = process.env.GROQ_API_KEY || '';
        const groqApiKey = rawKey.replace(/["'\r\n]|\\r|\\n/g, '').trim();

        let reply = '';
        let products: ProductSummary[] = [];
        let orders: AssistantOrder[] = [];
        let actionLink: { label: string; href: string } | undefined = undefined;
        let quickReplies: Array<{ label: string; query: string; isCheckout?: boolean }> | undefined = undefined;
        let cartAction: any = undefined;

        if (groqApiKey) {
            try {
                const validHistory = Array.isArray(conversationHistory)
                    ? conversationHistory
                        .filter((m: any) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
                        .slice(-6)
                        .map((m: any) => ({
                            role: m.role as 'user' | 'assistant',
                            content: m.content.trim().slice(0, 500)
                        }))
                    : [];

                const messages: any[] = [
                    { role: 'system', content: systemPrompt },
                    ...validHistory,
                    { role: 'user', content: trimmed.slice(0, 1000) }
                ];

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

                        const execRes = await executeAssistantTool(fnName, fnArgs, toolCtx);
                        if (execRes.products) products = execRes.products;
                        if (execRes.orders) orders = execRes.orders;
                        if (execRes.actionLink) actionLink = execRes.actionLink;
                        if (execRes.quickReplies) quickReplies = execRes.quickReplies;
                        if (execRes.cartAction) cartAction = execRes.cartAction;

                        choice1.tool_calls = [call];
                        messages.push(choice1);
                        messages.push({
                            role: 'tool',
                            tool_call_id: call.id,
                            content: JSON.stringify(execRes.toolResultPayload)
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
                        reply = choice1.content.trim();

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
                        } else if (/pay|payment|ussd|momo|shortcode/i.test(trimmed)) {
                            actionLink = hasCartItems
                                ? { label: "Proceed to Checkout", href: "/checkout" }
                                : { label: "Browse Catalog", href: "/products" };
                            quickReplies = [
                                { label: "Pay via USSD: *713*7453#", query: "How do I pay using USSD code *713*7453#?" },
                                { label: "Track My Order", query: "Track my order" },
                                { label: "Browse Catalog", query: "Browse catalog" }
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

        // 4. Fallback if Groq did not answer
        if (!reply) {
            const fallbackRes = await generateAssistantFallback(trimmed, toolCtx, products);
            reply = fallbackRes.reply;
            if (fallbackRes.orders) orders = fallbackRes.orders;
            if (fallbackRes.actionLink) actionLink = fallbackRes.actionLink;
            if (fallbackRes.quickReplies) quickReplies = fallbackRes.quickReplies;
        }

        // Auto-attach orders if user asked about orders and ordersContext is present
        if ((!orders || orders.length === 0) && ordersContext && Array.isArray(ordersContext) && ordersContext.length > 0) {
            if (/orders?|track(\s*my)?\s*orders?|past\s*orders?|balances?/i.test(trimmed)) {
                orders = ordersContext.slice(0, 4);
                if (!actionLink) {
                    const unpaid = ordersContext.find((o: any) => o.balance_due > 0 || o.state === 'PENDING_PAYMENT');
                    actionLink = unpaid
                        ? { label: `Pay Balance (GH₵ ${parseFloat(unpaid.balance_due || 0).toFixed(2)})`, href: `/checkout?order=${unpaid.order_number}` }
                        : { label: "View All Orders", href: "/orders" };
                }
            }
        }

        // Clean and polish reply presentation
        if (reply) {
            reply = cleanAssistantReply(reply, customerName);
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
