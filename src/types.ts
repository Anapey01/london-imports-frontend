export interface User {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    date_joined?: string;
    is_vendor?: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
    role?: string;
    address?: string;
    city?: string;
    region?: string;
    ghana_post_gps?: string;
    email_notifications?: boolean;
    sms_notifications?: boolean;
    whatsapp_notifications?: boolean;
    date_of_birth?: string;
    id?: string | number;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    icon?: string;
}

export interface ProductImage {
    id: string;
    image: string;
    alt_text?: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number | string;
    category: Category | string; // Can be object or ID depending on context
    images: ProductImage[];
    image?: string; // Main image
    stock: number;
    available_sizes?: string[];
    available_colors?: string[];
    shipping_origin?: string;
    estimated_shipping_fee?: number;
    preorder_status?: string;
    target_quantity: number;
    reservations_count: number;
    display_name?: string;
    short_name?: string;
    sku?: string;
    is_discreet?: boolean;
}
export interface OrderItem {
    id: string;
    product: {
        id: string;
        name: string;
        image: string;
        slug: string;
        display_name?: string;
        short_name?: string;
        sku?: string;
        is_discreet?: boolean;
    };
    product_name: string;
    quantity: number;
    total_price: number;
    unit_price?: number;
    selected_size?: string;
    selected_color?: string;
}

export interface Order {
    id: string;
    order_number: string;
    state: string;
    status?: string;
    state_display: string;
    total: number;
    subtotal: number;
    delivery_fee: number;
    items?: OrderItem[];
    items_count?: number;
    created_at: string;
    paid_at?: string;
    delivery_address?: string;
    delivery_city?: string;
    delivery_region?: string;
    delivery_gps?: string;
    customer_notes?: string;
    deposit_amount?: number;
    balance_due?: number;
    amount_paid?: number;
    delivery_window?: string;
    timeline_events?: OrderTimelineEvent[];
    customer?: {
        name: string;
        email: string;
    };
    items_summary?: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    phone?: string;
    updated_at?: string;
}

export interface OrderTimelineEvent {
    id: string;
    title: string;
    description?: string;
    location?: string;
    timestamp: string;
}

export interface Address {
    id: string;
    label: string;
    city: string;
    area: string;
    landmark: string;
    phone: string;
    isDefault: boolean;
}

export interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    transaction: string;
    trxref: string;
}

export interface PaystackConfig {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref?: string;
    metadata?: {
        custom_fields: Array<{
            display_name: string;
            variable_name: string;
            value: string;
        }>;
    };
    callback: (response: PaystackResponse) => void;
    onClose: () => void;
}

export interface PaystackPop {
    setup: (config: PaystackConfig) => {
        openIframe: () => void;
    };
}

export interface ExtendedCart extends Order {
    // Already inherits from Order, but if there was a Cart base:
    deposit_amount?: number;
    balance_due?: number;
    amount_paid?: number;
}

export interface BackendError {
    response?: {
        data?: string | {
            error?: string;
            message?: string;
            detail?: string;
            [key: string]: string | string[] | undefined;
        };
    };
    message?: string;
}

export interface AdminProduct {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    image: string;
    vendor: string;
    featured: boolean;
    preOrder: boolean;
    description: string;
    createdAt?: string;
    expectedDate?: string;
    estimatedWeeks?: number;
}
