export interface ProductVariant {
    name: string;
    price: string;
    stock_quantity: string;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    category_id: string;
    preorder_status: string;
    sizes: string;
    colors: string;
    shipping_origin: string;
    image: File | null;
    images: File[];
}

export interface Review {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    is_verified: boolean;
    created_at: string;
}

export interface ProductImage {
    id: string;
    image: string;
    alt_text?: string;
}

export interface DetailProductVariant {
    id: string;
    name: string;
    price: string;
    sku?: string;
    stock_quantity: number;
}

export interface Product {
    id: string;
    name: string;
    short_name?: string;
    display_name?: string;
    subtitle?: string;
    slug: string;
    price: number;
    description?: string;
    editorial_data?: {
        highlights: Array<{ icon: string; title: string; text: string }>;
        narrative: string;
        specs: Array<{ label: string; value: string }>;
    };
    image: string;
    images?: ProductImage[];
    rating?: number;
    reservations_count: number;
    available_colors?: string[];
    available_sizes?: string[];
    category?: { name: string; slug?: string };
    origin_country?: string;
    delivery_window_text?: string;
    video?: string;
    video_url?: string;
    vendor?: { business_name: string };
    preorder_status?: string;
    variants?: DetailProductVariant[];
    stock_quantity: number;
    target_quantity?: number;
    rating_count?: number;
    reviews?: Review[];
    is_discreet?: boolean;
}
