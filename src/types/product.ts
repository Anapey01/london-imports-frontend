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
