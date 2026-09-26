/**
 * London's Imports - Admin Concierge & Sourcing Utilities
 * Shared pure functions for debtor calculations, procurement aggregation, and WhatsApp communications.
 * Strictly zero emojis, strictly luxury brand format.
 */

export interface AdminOrderCustomer {
    name: string;
    email?: string;
    avatar?: string | null;
}

export interface AdminOrderItem {
    id?: string;
    name?: string;
    product_name?: string;
    variant_name?: string;
    quantity: number;
    price?: number;
    unit_price?: number;
    supplier_url?: string;
}

export interface AdminOrderData {
    id: string;
    order_number: string;
    customer?: AdminOrderCustomer | string;
    phone?: string;
    total: number;
    amount_paid: number;
    balance_due: number;
    is_installment?: boolean;
    status?: string;
    state?: string;
    created_at: string;
    items_summary?: AdminOrderItem[];
    items?: AdminOrderItem[];
    batch_name?: string;
}

export interface DebtorCustomer {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    total: number;
    amountPaid: number;
    balanceDue: number;
    state: string;
    createdAt: string;
    items: AdminOrderItem[];
}

export interface SourcingItem {
    name: string;
    variant: string;
    totalQuantity: number;
    ordersCount: number;
    orderNumbers: string[];
    samplePrice: number;
    supplierUrl?: string;
}

/**
 * Extracts and computes all debtor statistics from a list of admin orders.
 */
export function computeDebtorMetrics(orders: AdminOrderData[]) {
    const allDebtors: DebtorCustomer[] = [];

    for (const order of orders) {
        const balance = Number(order.balance_due || 0);
        if (balance > 0 && order.state !== 'CANCELLED') {
            const customerObj = typeof order.customer === 'object' && order.customer !== null
                ? order.customer
                : { name: String(order.customer || 'Customer') };

            const items = order.items_summary || order.items || [];

            allDebtors.push({
                orderNumber: order.order_number,
                customerName: customerObj.name || 'Customer',
                customerPhone: order.phone || '',
                total: Number(order.total || 0),
                amountPaid: Number(order.amount_paid || 0),
                balanceDue: balance,
                state: order.state || order.status || 'PENDING',
                createdAt: order.created_at,
                items,
            });
        }
    }

    const partiallyPaid = allDebtors.filter(d => d.amountPaid > 0);
    const completelyUnpaid = allDebtors.filter(d => d.amountPaid <= 0);
    const totalOutstanding = allDebtors.reduce((sum, d) => sum + d.balanceDue, 0);

    return {
        allDebtors,
        partiallyPaid,
        completelyUnpaid,
        totalOutstanding,
    };
}

/**
 * Consolidates ordered items across orders for China supplier procurement.
 */
export function consolidateSourcingList(orders: AdminOrderData[]) {
    const sourcingMap = new Map<string, SourcingItem>();
    let totalUnits = 0;

    for (const order of orders) {
        if (order.state === 'CANCELLED') continue;

        const items = order.items_summary || order.items || [];
        for (const item of items) {
            const name = item.product_name || item.name || 'Unlabeled Item';
            const variant = item.variant_name || 'Standard';
            const key = `${name}__${variant}`.toLowerCase();
            const qty = Number(item.quantity || 1);
            totalUnits += qty;

            const existing = sourcingMap.get(key);
            if (existing) {
                existing.totalQuantity += qty;
                existing.ordersCount += 1;
                if (!existing.orderNumbers.includes(order.order_number)) {
                    existing.orderNumbers.push(order.order_number);
                }
            } else {
                sourcingMap.set(key, {
                    name,
                    variant,
                    totalQuantity: qty,
                    ordersCount: 1,
                    orderNumbers: [order.order_number],
                    samplePrice: Number(item.unit_price || item.price || 0),
                    supplierUrl: item.supplier_url,
                });
            }
        }
    }

    const items = Array.from(sourcingMap.values()).sort((a, b) => b.totalQuantity - a.totalQuantity);

    return {
        items,
        totalUnits,
    };
}

export type WhatsAppTemplateType =
    | 'balance_reminder'
    | 'payment_received'
    | 'china_shipped'
    | 'accra_arrived';

export interface WhatsAppTemplateParams {
    customerName: string;
    orderNumber: string;
    balanceDue?: number | string;
    amountPaid?: number | string;
    total?: number | string;
}

/**
 * Generates brand-standard, zero-emoji luxury WhatsApp communication templates.
 */
export function generateWhatsAppMessage(
    template: WhatsAppTemplateType,
    params: WhatsAppTemplateParams
): string {
    const name = params.customerName?.trim() || 'Client';
    const orderNo = params.orderNumber?.trim() || '';
    const balance = params.balanceDue !== undefined ? `GH₵ ${Number(params.balanceDue).toFixed(2)}` : '';
    const paid = params.amountPaid !== undefined ? `GH₵ ${Number(params.amountPaid).toFixed(2)}` : '';

    switch (template) {
        case 'balance_reminder':
            return `Hello ${name},\n\nThis is London's Imports regarding Order #${orderNo}.\n\nYour order has an outstanding balance of ${balance}. To ensure prompt cargo departure from our sorting facility in China, please settle the remaining balance.\n\nPayment via Hubtel USSD: *713*7453#\nOr track online: https://londonsimports.com/track?order=${orderNo}\n\nThank you for choosing London's Imports.`;

        case 'payment_received':
            return `Hello ${name},\n\nWe have received your payment of ${paid} for Order #${orderNo}.\n\nRemaining Balance: ${balance}\nStatus: Confirmed and allocated for cargo packaging.\n\nTrack your order status: https://londonsimports.com/track?order=${orderNo}\n\nLondon's Imports Concierge`;

        case 'china_shipped':
            return `Hello ${name},\n\nUpdate on Order #${orderNo}:\n\nYour cargo has officially departed our Guangzhou, China facility and is in transit to Accra, Ghana.\n\nRemaining Balance Upon Arrival: ${balance}\nLive tracking: https://londonsimports.com/track?order=${orderNo}\n\nLondon's Imports Logistics`;

        case 'accra_arrived':
            return `Hello ${name},\n\nGreat news regarding Order #${orderNo}!\n\nYour shipment has arrived at our Accra Hub and passed customs inspection. Sorting is complete.\n\nRemaining Balance Due for Release: ${balance}\n\nPlease settle your balance for immediate delivery dispatch.\nUSSD Payment: *713*7453#\n\nLondon's Imports Dispatch`;

        default:
            return `Hello ${name},\n\nThis is London's Imports regarding your Order #${orderNo}.\n\nTrack: https://londonsimports.com/track?order=${orderNo}`;
    }
}

/**
 * Generates a clean, direct WhatsApp URL for browser and mobile apps.
 */
export function formatWhatsAppUrl(phone: string, text: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(text);
    return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}
