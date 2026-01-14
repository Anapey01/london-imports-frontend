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
}
