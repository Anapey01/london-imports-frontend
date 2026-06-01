export interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    price: string;
    image: string;
    size?: string;
    color?: string;
}

export interface CustomerStats {
    ltv: number;
    order_count: number;
    join_date: string;
    is_vip: boolean;
}

export interface Customer {
    name: string;
    email: string;
    phone: string;
    stats: CustomerStats;
}

export interface OrderDetail {
    id: string;
    order_number: string;
    customer: string;
    email: string;
    phone: string;
    total: string;
    subtotal: string;
    delivery_fee: string;
    status: string;
    payment_status: string;
    amount_paid: string;
    balance_due: string;
    is_installment: boolean;
    created_at: string;
    delivery_address: string;
    delivery_city: string;
    delivery_region: string;
    delivery_gps?: string;
    customer_notes?: string;
    items: OrderItem[];
    customer_stats: CustomerStats;
}
