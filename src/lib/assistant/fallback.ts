import { AssistantOrder, ProductSummary } from './tools';
import { ToolExecutionContext } from './tool-handlers';

export function cleanAssistantReply(rawReply: string, customerName?: string): string {
    let reply = rawReply;

    // Strip markdown pipe tables completely if any leaked
    if (reply.includes('|')) {
        const pipeIdx = reply.indexOf('|');
        if (pipeIdx > -1) {
            const intro = reply.slice(0, pipeIdx).trim();
            reply = intro.length > 5
                ? intro
                : (customerName ? `Here are your recent orders on record, ${customerName}:` : "Here are your recent orders on record:");
        }
    }

    // Strip leading markdown headers like "## " or "### "
    reply = reply.replace(/^#+\s+/gm, '');

    // Strip any emojis from response for clean editorial typography
    reply = reply.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '').replace(/\s{2,}/g, ' ').trim();

    // Clean incomplete trailing sentence if truncated
    if (reply.length > 80 && !/[.!?)"']$/.test(reply.trim())) {
        const lastPunct = Math.max(
            reply.lastIndexOf('. '),
            reply.lastIndexOf('! '),
            reply.lastIndexOf('? '),
            reply.lastIndexOf('.\n'),
            reply.lastIndexOf('!\n'),
            reply.lastIndexOf('?\n')
        );
        if (lastPunct > 40) {
            reply = reply.slice(0, lastPunct + 1).trim();
        }
    }

    return reply;
}

export async function generateAssistantFallback(
    trimmed: string,
    ctx: ToolExecutionContext,
    products: ProductSummary[]
): Promise<{
    reply: string;
    orders?: AssistantOrder[];
    actionLink?: { label: string; href: string };
    quickReplies?: Array<{ label: string; query: string; isCheckout?: boolean }>;
}> {
    const { backendBase, customerName, ordersContext, cartContext } = ctx;
    const hasCartItems = Boolean(cartContext && typeof cartContext === 'object' && cartContext.count > 0);

    let reply = '';
    let orders: AssistantOrder[] | undefined = undefined;
    let actionLink: { label: string; href: string } | undefined = undefined;
    let quickReplies: Array<{ label: string; query: string; isCheckout?: boolean }> | undefined = undefined;

    // Check for payment claim submission in fallback
    const claimTxnMatch = trimmed.match(/(?:transaction\s*(?:id)?|txn(?:\s*id)?|ref(?:erence)?)\s*[:#-]?\s*([A-Za-z0-9_-]{5,30})/i) || trimmed.match(/\b(\d{9,16})\b/);
    const claimOrderMatch = trimmed.match(/\b(LI-\d{8}-\d{5}|LI-[A-Za-z0-9-]+)\b/i) || (ordersContext?.[0]?.order_number ? [ordersContext[0].order_number, ordersContext[0].order_number] : null);

    if (claimTxnMatch && (claimOrderMatch || /paid|payment/i.test(trimmed))) {
        const targetOrder = claimOrderMatch ? claimOrderMatch[1].toUpperCase() : (ordersContext?.[0]?.order_number || '');
        const targetTxn = claimTxnMatch[1];
        const amountMatch = trimmed.match(/(?:gh[c₵]?\s*|\b)(\d+(?:\.\d{1,2})?)\s*(?:gh[c₵]?|\b)/i);
        const targetAmount = amountMatch ? parseFloat(amountMatch[1]) : undefined;

        if (targetOrder && targetTxn) {
            try {
                const claimRes = await fetch(`${backendBase.replace(/\/$/, '')}/payments/ussd/claim/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        order_number: targetOrder,
                        transaction_id: targetTxn,
                        amount: targetAmount,
                        customer_phone: customerName
                    })
                });
                const cData = await claimRes.json();
                if (cData.verified) {
                    reply = customerName
                        ? `Thank you ${customerName}! I have verified your payment of GH₵ ${cData.amount_credited} (Transaction ID: ${targetTxn}) for Order #${targetOrder}. Your remaining balance is GH₵ ${parseFloat(cData.balance_due).toFixed(2)}.`
                        : `Thank you! I have verified your payment of GH₵ ${cData.amount_credited} (Transaction ID: ${targetTxn}) for Order #${targetOrder}. Your remaining balance is GH₵ ${parseFloat(cData.balance_due).toFixed(2)}.`;
                } else {
                    const curBal = parseFloat(cData.balance_due || 0);
                    const claimAmt = parseFloat(cData.claimed_amount || targetAmount || 0);
                    const expBal = Math.max(0, curBal - claimAmt);
                    reply = customerName
                        ? `Thank you ${customerName}! I have recorded your payment claim of GH₵ ${claimAmt > 0 ? claimAmt.toFixed(2) : '1.00'} (Transaction ID: ${targetTxn}) for Order #${targetOrder}. Our system is currently awaiting settlement confirmation from Hubtel. Once confirmed, your balance will automatically adjust${claimAmt > 0 ? ` from GH₵ ${curBal.toFixed(2)} to GH₵ ${expBal.toFixed(2)}` : ''}, and we will proceed with your dispatch.`
                        : `Thank you! I have recorded your payment claim of GH₵ ${claimAmt > 0 ? claimAmt.toFixed(2) : '1.00'} (Transaction ID: ${targetTxn}) for Order #${targetOrder}. Our system is currently awaiting settlement confirmation from Hubtel. Once confirmed, your balance will automatically adjust${claimAmt > 0 ? ` from GH₵ ${curBal.toFixed(2)} to GH₵ ${expBal.toFixed(2)}` : ''}, and we will proceed with your dispatch.`;
                }

                orders = [{
                    order_number: targetOrder,
                    state: cData.state || 'PROCESSING',
                    state_display: cData.state === 'PAID' ? 'Fully Paid' : (cData.verified ? 'Deposit Received' : 'Payment Verifying'),
                    total: (cData.balance_due || 0) + (cData.amount_credited || 0),
                    balance_due: cData.balance_due !== undefined ? cData.balance_due : 0,
                    amount_paid: cData.amount_credited !== undefined ? cData.amount_credited : 0,
                    is_verifying: Boolean(cData.pending_audit),
                    claimed_amount: targetAmount || cData.claimed_amount
                }];
                actionLink = cData.pending_audit
                    ? { label: "Track Order Status", href: `/track?order=${targetOrder}` }
                    : (cData.balance_due && cData.balance_due > 0
                        ? { label: `Pay Remaining (GH₵ ${parseFloat(cData.balance_due).toFixed(2)})`, href: `/checkout?order=${targetOrder}` }
                        : { label: "Track Shipment", href: `/track?order=${targetOrder}` });
                quickReplies = [
                    { label: "Track My Order", query: `Track order ${targetOrder}` },
                    { label: "Browse Catalog", query: "Browse catalog" }
                ];
            } catch {
                // Fallback gracefully
            }
        }
    }

    // Check for direct order query
    const orderMatch = trimmed.match(/\b(LI-\d{8}-\d{5}|LI-[A-Za-z0-9-]+)\b/i);
    if (!reply && orderMatch) {
        const targetNum = orderMatch[1].toUpperCase();
        reply = customerName
            ? `I'm checking order #${targetNum} for you, ${customerName}. You can see real-time updates and balance status below!`
            : `I'm checking order #${targetNum} for you. You can see real-time updates and balance status below!`;
        actionLink = { label: "Track Shipment", href: `/track?order=${targetNum}` };
        quickReplies = [{ label: "Browse Catalog", query: "Browse catalog" }];
    } else if (!reply && /what\s*can\s*you\s*do|who\s*are\s*you|help/i.test(trimmed)) {
        reply = customerName
            ? `Hello ${customerName}! I'm Miss London, your shopping assistant at London's Imports. I can help you find items in our store, order products directly from China at factory prices, track your packages, or check your balance.`
            : "Hello! I'm Miss London, your shopping assistant at London's Imports. I can help you find items in our store, order products directly from China at factory prices, track your packages, or check your balance.";
        actionLink = { label: "Browse Catalog", href: "/products" };
        quickReplies = [
            { label: "Browse Catalog", query: "Browse catalog" },
            { label: "Track My Order", query: "Track my order" },
            { label: "How Pre-orders Work", query: "How do pre-orders work?" }
        ];
    } else if (!reply && /pay|payment|momo|ussd|\*713\*7453#/i.test(trimmed)) {
        reply = "You can pay securely online via Hubtel using MTN Mobile Money, Telecel Cash, AT Money, or bank cards. You can also pay directly from your phone by dialing our Hubtel USSD shortcode *713*7453# (London's Imports) and entering your order number as reference.";
        actionLink = hasCartItems
            ? { label: "Proceed to Checkout", href: "/checkout" }
            : { label: "Browse Catalog", href: "/products" };
        quickReplies = [
            { label: "Pay via USSD: *713*7453#", query: "How do I pay using USSD code *713*7453#?" },
            { label: "Track My Order", query: "Track my order" },
            { label: "Browse Catalog", query: "Browse catalog" }
        ];
    } else if (!reply && /pre-?order|how\s*does\s*it\s*work/i.test(trimmed)) {
        reply = "With our pre-order model, you pay a deposit to secure direct factory prices. We inspect your package overseas and ship it to Accra via our standard Sea Freight (around 6 weeks) or express Air Freight for lightweight items (2 to 3 weeks). Once it lands, you clear any remaining balance upon collection or delivery!";
        actionLink = { label: "Browse Catalog", href: "/products" };
        quickReplies = [
            { label: "Browse Catalog", query: "Browse catalog" },
            { label: "Order from China", query: "Order from China" }
        ];
    } else if (!reply && products.length > 0) {
        reply = customerName
            ? `Here are the items we found for you, ${customerName}! Which one catches your eye?`
            : "Here are the items we found for you! Which one catches your eye?";
        actionLink = { label: "Browse Full Catalog", href: "/products" };
    } else if (!reply && orders && orders.length > 0) {
        reply = customerName
            ? `Here are your order details on record, ${customerName}:`
            : "Here are your order details on record:";
    } else if (!reply) {
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

    return { reply, orders, actionLink, quickReplies };
}
