/**
 * London's Imports - Cart Store
 * Zustand store for shopping cart state
 */
import { create } from 'zustand';
import { ordersAPI } from '@/lib/api';

interface CartItem {
    id: string;
    product: {
        id: string;
        name: string;
        slug: string;
        image: string;
        price: number;
        preorder_status: string;
        delivery_window_text: string;
    };
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Cart {
    id: string;
    order_number: string;
    items: CartItem[];
    subtotal: number;
    delivery_fee: number;
    total: number;
}

interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    itemCount: number;

    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
    cart: null,
    isLoading: false,
    itemCount: 0,

    fetchCart: async () => {
        set({ isLoading: true });
        try {
            const response = await ordersAPI.cart();
            const cart = response.data;
            set({
                cart,
                itemCount: cart.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
            });
        } catch {
            set({ cart: null, itemCount: 0 });
        } finally {
            set({ isLoading: false });
        }
    },

    addToCart: async (productId: string, quantity = 1) => {
        set({ isLoading: true });
        try {
            const response = await ordersAPI.addToCart(productId, quantity);
            const cart = response.data;
            set({
                cart,
                itemCount: cart.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
            });
        } finally {
            set({ isLoading: false });
        }
    },

    removeFromCart: async (itemId: string) => {
        set({ isLoading: true });
        try {
            const response = await ordersAPI.removeFromCart(itemId);
            const cart = response.data;
            set({
                cart,
                itemCount: cart.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
            });
        } finally {
            set({ isLoading: false });
        }
    },

    updateQuantity: async (itemId: string, quantity: number) => {
        // For now, remove and re-add
        const cart = get().cart;
        const item = cart?.items.find(i => i.id === itemId);
        if (item && quantity > 0) {
            await get().removeFromCart(itemId);
            await get().addToCart(item.product.id, quantity);
        } else if (quantity === 0) {
            await get().removeFromCart(itemId);
        }
    },

    clearCart: () => set({ cart: null, itemCount: 0 }),
}));
