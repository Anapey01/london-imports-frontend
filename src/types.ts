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
    preorder_status?: string;
    target_quantity: number;
    reservations_count: number;
}
export interface OrderItem {
    id: string;
    product: {
        id: string;
        name: string;
        image: string;
        slug: string;
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
    customer_notes?: string;
    deposit_amount?: number;
    balance_due?: number;
    amount_paid?: number;
    delivery_window?: string;
}
