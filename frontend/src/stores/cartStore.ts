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
    guestItems: CartItem[];
    isLoading: boolean;
    itemCount: number;

    fetchCart: () => Promise<void>;
    addToCart: (product: any, quantity?: number) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
}

import { useAuthStore } from './authStore';

export const useCartStore = create<CartState>()((set, get) => ({
    cart: null,
    guestItems: [], // Local offline items
    isLoading: false,
    itemCount: 0,

    fetchCart: async () => {
        // Fix: Check auth store state, not missing access_token
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        // If logged in, fetch server cart
        if (isAuthenticated) {
            set({ isLoading: true });

            // MERGE LOGIC: Check for guest items to sync
            const savedGuest = typeof window !== 'undefined' ? localStorage.getItem('guest_cart') : null;
            if (savedGuest) {
                try {
                    const guestItems: CartItem[] = JSON.parse(savedGuest);
                    // Add each guest item to server cart
                    await Promise.all(guestItems.map(item =>
                        ordersAPI.addToCart(item.product.id, item.quantity)
                    ));
                    // Clear guest state
                    localStorage.removeItem('guest_cart');
                    set({ guestItems: [] });
                } catch (e) {
                    console.error("Failed to merge guest cart", e);
                }
            }

            try {
                const response = await ordersAPI.cart();
                const cart = response.data;
                set({
                    cart,
                    itemCount: cart.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
                });
            } catch {
                set({ cart: null });
                // Don't reset itemCount here if we want to fallback to guest? 
                // Actually if api fails, we might just show 0 or keep old state.
            } finally {
                set({ isLoading: false });
            }
        } else {
            // Load guest cart from local storage
            const saved = localStorage.getItem('guest_cart');
            if (saved) {
                const items = JSON.parse(saved);
                set({
                    guestItems: items,
                    itemCount: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
                });
            }
        }
    },

    addToCart: async (product: any, quantity = 1) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if (isAuthenticated) {
            // Server Side
            set({ isLoading: true });
            try {
                const response = await ordersAPI.addToCart(product.id, quantity);
                const cart = response.data;
                set({
                    cart,
                    itemCount: cart.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
                });
            } finally {
                set({ isLoading: false });
            }
        } else {
            // Guest Side
            const currentGuest = get().guestItems;
            const existingIndex = currentGuest.findIndex(i => i.product.id === product.id);

            let newGuest = [...currentGuest];

            if (existingIndex >= 0) {
                // Update quantity
                newGuest[existingIndex].quantity += quantity;
                newGuest[existingIndex].total_price = newGuest[existingIndex].quantity * newGuest[existingIndex].unit_price;
            } else {
                // Add new item
                newGuest.push({
                    id: `guest_${Date.now()}`,
                    product: {
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        image: product.image || '',
                        price: product.price,
                        preorder_status: product.preorder_status || 'active',
                        delivery_window_text: product.delivery_window_text || ''
                    },
                    quantity,
                    unit_price: product.price,
                    total_price: product.price * quantity
                });
            }

            // Save
            localStorage.setItem('guest_cart', JSON.stringify(newGuest));
            set({
                guestItems: newGuest,
                itemCount: newGuest.reduce((sum, i) => sum + i.quantity, 0)
            });

            // Simulate API delay for UX consistency
            set({ isLoading: true });
            setTimeout(() => set({ isLoading: false }), 300);
        }
    },

    removeFromCart: async (itemId: string) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if (isAuthenticated) {
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
        } else {
            // Guest remove
            const newGuest = get().guestItems.filter(i => i.id !== itemId);
            localStorage.setItem('guest_cart', JSON.stringify(newGuest));
            set({
                guestItems: newGuest,
                itemCount: newGuest.reduce((sum, i) => sum + i.quantity, 0)
            });
        }
    },

    updateQuantity: async (itemId: string, quantity: number) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if (isAuthenticated) {
            // For server, we currently remove/re-add in this codebase's logic
            // Ideally backend supports patch, but following existing pattern:
            const cart = get().cart;
            const item = cart?.items.find(i => i.id === itemId);
            if (item && quantity > 0) {
                await get().removeFromCart(itemId);
                await get().addToCart(item.product, quantity); // Updated to pass object? 
                // WAIT: api.addToCart takes ID. We need to be careful. 
                // My new addToCart takes OBJECT.
                // But server logic needs ID.
                // See addToCart impl above: ordersAPI.addToCart(product.id...)
                // So passing `item.product` (which is an object) works!
            } else if (quantity === 0) {
                await get().removeFromCart(itemId);
            }
        } else {
            // Guest update
            const newGuest = get().guestItems.map(item => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        quantity,
                        total_price: item.unit_price * quantity
                    };
                }
                return item;
            }).filter(i => i.quantity > 0);

            localStorage.setItem('guest_cart', JSON.stringify(newGuest));
            set({
                guestItems: newGuest,
                itemCount: newGuest.reduce((sum, i) => sum + i.quantity, 0)
            });
        }
    },

    clearCart: () => {
        set({ cart: null, guestItems: [], itemCount: 0 });
        localStorage.removeItem('guest_cart');
    },
}));
