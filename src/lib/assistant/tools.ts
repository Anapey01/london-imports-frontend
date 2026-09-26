/**
 * London's Imports - Miss London Assistant Tools Definition
 * Function calling schemas for Groq / OpenAI LLMs.
 */

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
    is_verifying?: boolean;
    claimed_amount?: number;
    items?: Array<{
        name: string;
        quantity: number;
        image?: string | null;
    }>;
}

export const ASSISTANT_TOOLS = [
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
    },
    {
        type: 'function',
        function: {
            name: 'submit_payment_verification',
            description: "Submit and verify customer's payment reference, Hubtel USSD transaction ID, or Mobile Money transaction ID for an order (e.g. LI-20260921-87841, Txn: 90263045181, 1 GHS). Call this whenever a customer claims they paid, provides a transaction ID, or shares payment details.",
            parameters: {
                type: 'object',
                properties: {
                    order_number: {
                        type: 'string',
                        description: 'The order number, usually starting with LI-'
                    },
                    transaction_id: {
                        type: 'string',
                        description: 'The Hubtel or Mobile Money transaction ID (e.g. 90263045181)'
                    },
                    amount: {
                        type: 'number',
                        description: 'Optional amount in Ghana Cedis paid by the customer'
                    }
                },
                required: ['order_number', 'transaction_id']
            }
        }
    }
];
