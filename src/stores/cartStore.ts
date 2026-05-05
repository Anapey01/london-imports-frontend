/**
 * London's Imports - Cart Store
 * Optimized for Snappiness & Absolute Resilience.
 */
import { create } from 'zustand';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from './authStore';

export interface Product {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
    price: number;
    estimated_shipping_fee?: number;
    is_discreet?: boolean;
    is_preorder?: boolean;
    stock_quantity?: number;
    preorder_status?: string;
    delivery_window_text?: string;
}

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    unit_price: number;
    total_price: number;
    selected_size?: string;
    selected_color?: string;
}

export interface Cart {
    id: string;
    items: CartItem[];
    subtotal: number;
    delivery_fee: number;
    total: number;
    state: string;
}

interface CartState {
    cart: Cart | null;
    guestItems: CartItem[];
    isLoading: boolean;
    isMerging: boolean;
    itemCount: number;
    selectedItemIds: Set<string>;
    version: number;

    fetchCart: () => Promise<void>;
    addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string, selectedVariant?: { id: string; name: string; price: string }) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
    setSelectedItems: (ids: Set<string>) => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
    cart: null,
    guestItems: [],
    isLoading: false,
    isMerging: false,
    itemCount: 0,
    selectedItemIds: new Set(),
    version: 0,

    fetchCart: async () => {
        const reqVersion = get().version + 1;
        set({ version: reqVersion });

        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        
        if (isAuthenticated) {
            // SILENT BACKGROUND MERGE
            const savedGuest = typeof window !== 'undefined' ? localStorage.getItem('guest_cart') : null;
            if (savedGuest && !get().isMerging) {
                (async () => {
                    try {
                        set({ isMerging: true });
                        const guestItemsData: CartItem[] = JSON.parse(savedGuest);
                        for (const item of guestItemsData) {
                            try { 
                                await ordersAPI.addToCart(item.product.id, item.quantity, item.selected_size, item.selected_color); 
                            } catch {
                                // Silent failure for background sync
                            }
                        }
                        const res = await ordersAPI.cart({ t: Date.now() });
                        if (res.data.items && res.data.items.length > 0) {
                            localStorage.removeItem('guest_cart');
                            set({ guestItems: [], cart: res.data });
                        }
                    } catch {
                        // Silent failure
                    } finally { 
                        set({ isMerging: false }); 
                    }
                })();
            }

            try {
                if (!get().cart) set({ isLoading: true });
                const response = await ordersAPI.cart({ t: Date.now() });
                if (get().version === reqVersion) {
                    const serverItems = response.data.items || [];
                    set({ 
                        cart: response.data, 
                        itemCount: serverItems.length > 0 ? serverItems.reduce((s: number, i: CartItem) => s + i.quantity, 0) : get().guestItems.reduce((s: number, i: CartItem) => s + i.quantity, 0),
                        isLoading: false 
                    });
                }
            } catch {
                if (get().version === reqVersion) set({ isLoading: false });
            }
        } else {
            const saved = typeof window !== 'undefined' ? localStorage.getItem('guest_cart') : null;
            const items = saved ? JSON.parse(saved) : [];
            set({ guestItems: items, itemCount: items.reduce((s: number, i: CartItem) => s + i.quantity, 0) });
        }
    },

    addToCart: async (product, quantity = 1, selectedSize, selectedColor, selectedVariant) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        const reqVersion = get().version + 1;
        set({ version: reqVersion });

        const size = selectedVariant ? (selectedSize ? `${selectedVariant.name}, ${selectedSize}` : selectedVariant.name) : (selectedSize || "");
        const price = selectedVariant ? parseFloat(selectedVariant.price) : product.price;

        if (isAuthenticated) {
            // OPTIMISTIC
            set(state => ({ itemCount: state.itemCount + quantity }));
            try {
                const res = await ordersAPI.addToCart(product.id, quantity, size, selectedColor, selectedVariant?.id);
                if (get().version <= reqVersion) {
                    set({ cart: res.data, itemCount: res.data.items.reduce((s: number, i: CartItem) => s + i.quantity, 0) });
                }
            } catch {
                set(state => ({ itemCount: Math.max(0, state.itemCount - quantity) }));
            }
        } else {
            const items = [...get().guestItems];
            const idx = items.findIndex(i => i.product.id === product.id && i.selected_size === size && i.selected_color === selectedColor);
            if (idx >= 0) {
                items[idx].quantity += quantity;
                items[idx].total_price = items[idx].quantity * items[idx].unit_price;
            } else {
                items.push({
                    id: `guest_${Date.now()}`,
                    product: { ...product },
                    quantity,
                    unit_price: price,
                    total_price: price * quantity,
                    selected_size: size,
                    selected_color: selectedColor
                });
            }
            localStorage.setItem('guest_cart', JSON.stringify(items));
            set({ guestItems: items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
        }
    },

    removeFromCart: async (itemId) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated && !itemId.startsWith('guest_')) {
            try {
                const res = await ordersAPI.removeFromCart(itemId);
                set({ cart: res.data, itemCount: res.data.items.reduce((s: number, i: CartItem) => s + i.quantity, 0) });
            } catch {
                // Silent fail
            }
        } else {
            const items = get().guestItems.filter(i => i.id !== itemId);
            localStorage.setItem('guest_cart', JSON.stringify(items));
            set({ guestItems: items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
        }
    },

    updateQuantity: async (itemId, quantity) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated && !itemId.startsWith('guest_')) {
            try {
                const res = await ordersAPI.updateCartItem(itemId, quantity);
                set({ cart: res.data, itemCount: res.data.items.reduce((s: number, i: CartItem) => s + i.quantity, 0) });
            } catch {
                // Silent fail
            }
        } else {
            const items = get().guestItems.map(i => i.id === itemId ? { ...i, quantity, total_price: i.unit_price * quantity } : i);
            localStorage.setItem('guest_cart', JSON.stringify(items));
            set({ guestItems: items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
        }
    },

    clearCart: () => {
        localStorage.removeItem('guest_cart');
        set({ cart: null, guestItems: [], itemCount: 0, selectedItemIds: new Set() });
    },

    setSelectedItems: (ids) => set({ selectedItemIds: ids }),
}));
