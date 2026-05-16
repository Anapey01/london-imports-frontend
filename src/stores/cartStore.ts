/**
 * London's Imports - Cart Store
 * Optimized for Snappiness & Absolute Resilience.
 * Implements Persistence to survive page refreshes.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from './authStore';

export interface Product {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
    display_name?: string;
    short_name?: string;
    sku?: string;
    subtitle?: string;
    price: number;
    estimated_shipping_fee?: number;
    is_discreet?: boolean;
    is_preorder?: boolean;
    stock_quantity?: number;
    preorder_status?: string;
    delivery_window_text?: string;
    available_sizes?: string[];
    available_colors?: string[];
    variants?: Array<{
        id: string;
        name: string;
        price: string;
        stock_quantity: number;
    }>;
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
    selectedItemIds: string[]; // Changed to string[] for easier persistence
    version: number;

    fetchCart: () => Promise<void>;
    addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string, selectedVariant?: { id: string; name: string; price: string }) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
    setSelectedItems: (ids: string[]) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: null,
            guestItems: [],
            isLoading: false,
            isMerging: false,
            itemCount: 0,
            selectedItemIds: [],
            version: 1,

            fetchCart: async () => {
                const reqVersion = get().version + 1;
                set({ version: reqVersion });

                const isAuthenticated = useAuthStore.getState().isAuthenticated;
                
                if (isAuthenticated) {
                    // Check for items to merge
                    const { guestItems, isMerging } = get();
                    if (guestItems.length > 0 && !isMerging) {
                        try {
                            set({ isMerging: true });
                            for (const item of guestItems) {
                                try { 
                                    await ordersAPI.addToCart(item.product.id, item.quantity, item.selected_size, item.selected_color); 
                                } catch (e) {
                                    console.error("Merge error for item:", item.product.name, e);
                                }
                            }
                            // Clear guest items after successful (or attempted) merge
                            set({ guestItems: [] });
                        } finally { 
                            set({ isMerging: false }); 
                        }
                    }

                    try {
                        if (!get().cart) set({ isLoading: true });
                        const response = await ordersAPI.cart({ t: Date.now() });
                        if (get().version === reqVersion) {
                            const serverItems = response.data.items || [];
                            set({ 
                                cart: response.data, 
                                itemCount: serverItems.reduce((s: number, i: CartItem) => s + i.quantity, 0),
                                isLoading: false 
                            });
                        }
                    } catch {
                        if (get().version === reqVersion) set({ isLoading: false });
                    }
                } else {
                    // Guest mode: use persisted guestItems
                    const { guestItems } = get();
                    set({ itemCount: guestItems.reduce((s, i) => s + i.quantity, 0) });
                }
            },

            addToCart: async (product, quantity = 1, selectedSize, selectedColor, selectedVariant) => {
                const isAuthenticated = useAuthStore.getState().isAuthenticated;
                const reqVersion = get().version + 1;
                set({ version: reqVersion });

                // ENFORCE VARIANT SELECTION: If product has sizes/colors, they must be provided
                const hasSizes = product.available_sizes && product.available_sizes.length > 0;
                const hasColors = product.available_colors && product.available_colors.length > 0;
                
                if ((hasSizes && !selectedSize) || (hasColors && !selectedColor)) {
                    throw new Error('VARIANT_REQUIRED');
                }

                const size = selectedVariant ? (selectedSize ? `${selectedVariant.name}, ${selectedSize}` : selectedVariant.name) : (selectedSize || "");
                const price = selectedVariant ? parseFloat(selectedVariant.price) : product.price;

                if (isAuthenticated) {
                    // OPTIMISTIC
                    set(state => ({ itemCount: state.itemCount + quantity }));
                    try {
                        const res = await ordersAPI.addToCart(product.id, quantity, size, selectedColor, selectedVariant?.id);
                        set({ 
                            cart: res.data, 
                            itemCount: res.data.items.reduce((s: number, i: CartItem) => s + i.quantity, 0),
                            version: reqVersion
                        });
                    } catch (error) {
                        // Rollback on error
                        set(state => ({ itemCount: Math.max(0, state.itemCount - quantity) }));
                        throw error;
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
                    set({ guestItems: items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
                }
            },

            clearCart: () => {
                set({ cart: null, guestItems: [], itemCount: 0, selectedItemIds: [] });
            },

            setSelectedItems: (ids) => set({ selectedItemIds: ids }),
        }),
        {
            name: 'li-cart-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ 
                cart: state.cart,
                itemCount: state.itemCount,
                guestItems: state.guestItems,
                selectedItemIds: state.selectedItemIds 
            }),
        }
    )
);

