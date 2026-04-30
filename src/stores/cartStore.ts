/**
 * London's Imports - Cart Store
 * Zustand store for shopping cart state
 */
import { create } from 'zustand';
import { ordersAPI } from '@/lib/api';
import { trackRemoveFromCart } from '@/lib/analytics';

export interface Product {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
    primary_image?: string | null;
    price: number;
    preorder_status?: string;
    delivery_window_text?: string;
    reservations_count?: number;
    deposit_amount?: number;
    vendor_name?: string;
    cutoff_date?: string;
    available_sizes?: string[];
    available_colors?: string[];
    target_quantity?: number;
    rating?: number;
    rating_count?: number;
    old_price?: number | string;
    discount_percentage?: number;
    is_preorder?: boolean;
    stock_quantity?: number;
    estimated_shipping_fee?: number;
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
    order_number: string;
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

    fetchCart: () => Promise<void>;
    addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string, selectedVariant?: { id: string; name: string; price: string }) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    toggleSelection: (itemId: string) => void;
    selectAll: (selected: boolean) => void;
    clearCart: () => void;
}

import { useAuthStore } from './authStore';

export const useCartStore = create<CartState>()((set, get) => ({
    cart: null,
    guestItems: [], // Local offline items
    isLoading: false,
    isMerging: false,
    itemCount: 0,
    selectedItemIds: new Set(),

    fetchCart: async () => {
        // Fix: Check auth store state, not missing access_token
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        // If logged in, fetch server cart
        if (isAuthenticated) {
            set({ isLoading: true });

            // MERGE LOGIC: Check for guest items to sync
            const savedGuest = typeof window !== 'undefined' ? localStorage.getItem('guest_cart') : null;
            if (savedGuest && !get().isMerging) {
                try {
                    set({ isMerging: true });
                    const guestItems: CartItem[] = JSON.parse(savedGuest);
                    
                    if (guestItems.length > 0) {
                        console.info("[CartStore] Syncing guest items to server...", guestItems.length);
                        
                        // CRITICAL: Clear guest state IMMEDIATELY to prevent duplicate syncs 
                        // if fetchCart is called again before this completes.
                        localStorage.removeItem('guest_cart');
                        set({ guestItems: [] });

                        // Add each guest item to server cart
                        await Promise.all(guestItems.map(item =>
                            ordersAPI.addToCart(item.product.id, item.quantity, item.selected_size, item.selected_color)
                        ));
                        console.info("[CartStore] Guest sync complete.");
                    }
                } catch (e) {
                    console.error("Failed to merge guest cart", e);
                    // Optional: Restore items to localStorage if it was a network error?
                    // For now, we prefer data loss over 10x quantity multiplication loops.
                } finally {
                    set({ isMerging: false });
                }
            }

            try {
                const response = await ordersAPI.cart();
                const cart = response.data;

                // Initialize selection if empty (selecting all by default on first fetch)
                const newSelected = new Set(get().selectedItemIds);
                if (newSelected.size === 0 && cart.items?.length > 0) {
                    cart.items.forEach((i: CartItem) => newSelected.add(i.id));
                }

                set({
                    cart,
                    selectedItemIds: newSelected,
                    itemCount: cart.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
                });
            } catch {
                set({ cart: null });
            } finally {
                set({ isLoading: false });
            }
        } else {
            // Load guest cart from local storage
            const saved = localStorage.getItem('guest_cart');
            if (saved) {
                const items = JSON.parse(saved);
                const newSelected = new Set(get().selectedItemIds);
                if (newSelected.size === 0 && items.length > 0) {
                    items.forEach((i: CartItem) => newSelected.add(i.id));
                }
                set({
                    guestItems: items,
                    selectedItemIds: newSelected,
                    itemCount: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
                });
            }
        }
    },

    addToCart: async (product: Product, quantity = 1, selectedSize?: string, selectedColor?: string, selectedVariant?: { id: string; name: string; price: string }) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if (isAuthenticated) {
            // Optimistic Update: Increment itemCount immediately for snappy UI
            const previousCount = get().itemCount;
            set({ itemCount: previousCount + quantity });

            try {
                // Combine variant and size if both exist, as backend only has selected_size field
                let sizeParam = selectedSize || "";
                if (selectedVariant) {
                    sizeParam = selectedSize ? `${selectedVariant.name}, ${selectedSize}` : selectedVariant.name;
                }

                console.info("[CartStore] Adding to cart (Server):", { productId: product.id, quantity, size: sizeParam, color: selectedColor });

                // Pass variants to API
                const response = await ordersAPI.addToCart(product.id, quantity, sizeParam, selectedColor, selectedVariant?.id);
                const cart = response.data;

                // Auto-select the newly added item
                const newSelected = new Set(get().selectedItemIds);
                cart.items?.forEach((i: CartItem) => {
                    newSelected.add(i.id);
                });

                set({
                    cart,
                    selectedItemIds: newSelected,
                    itemCount: cart.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
                });
            } catch (err) {
                console.error("[CartStore] Server addToCart failed:", err);
                // Rollback: Revert the count if the request fails
                set({ itemCount: get().itemCount - quantity });
                throw err; // Rethrow to allow component-level catch/toast
            }
        } else {
            // Guest Side
            console.info("[CartStore] Adding to cart (Guest):", { product, quantity, selectedSize, selectedColor });
            const currentGuest = get().guestItems;

            // Determine effective size/variant name
            let effectiveSize = selectedSize;
            if (selectedVariant) {
                effectiveSize = selectedSize ? `${selectedVariant.name}, ${selectedSize}` : selectedVariant.name;
            }
            const effectivePrice = selectedVariant ? parseFloat(selectedVariant.price) : product.price;

            // Check existence based on ID AND variants
            const existingIndex = currentGuest.findIndex(i =>
                i.product.id === product.id &&
                i.selected_size?.toLowerCase() === effectiveSize?.toLowerCase() &&
                i.selected_color?.toLowerCase() === selectedColor?.toLowerCase()
            );

            const newGuest = [...currentGuest];

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
                        price: effectivePrice, // Display price might vary
                        preorder_status: product.preorder_status || 'active',
                        delivery_window_text: product.delivery_window_text || ''
                    },
                    quantity,
                    unit_price: effectivePrice,
                    total_price: effectivePrice * quantity,
                    selected_size: effectiveSize,
                    selected_color: selectedColor
                });
            }

            // Save
            localStorage.setItem('guest_cart', JSON.stringify(newGuest));
            // Instant Local Response
            set({ 
                guestItems: newGuest,
                itemCount: newGuest.reduce((sum, i) => sum + i.quantity, 0)
            });
        }
    },

    removeFromCart: async (itemId: string) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        
        // Snapshot for rollback
        const previousCart = get().cart;
        const previousCount = get().itemCount;

        if (isAuthenticated && !itemId.startsWith('guest_')) {
            // OPTIMISTIC REMOVAL
            if (previousCart) {
                const itemToRemove = previousCart.items.find(i => i.id === itemId);
                if (itemToRemove) {
                    trackRemoveFromCart(itemToRemove.product, itemToRemove.quantity);
                    
                    const newItems = previousCart.items.filter(i => i.id !== itemId);
                    const newSubtotal = newItems.reduce((sum, i) => sum + (Number(i.unit_price) * i.quantity), 0);
                    
                    set({
                        cart: { 
                            ...previousCart, 
                            items: newItems, 
                            subtotal: newSubtotal, 
                            delivery_fee: newItems.reduce((sum, i) => sum + (Number(i.product?.estimated_shipping_fee || 0) * i.quantity), 0),
                            total: newSubtotal + newItems.reduce((sum, i) => sum + (Number(i.product?.estimated_shipping_fee || 0) * i.quantity), 0)
                        },
                        itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0)
                    });
                }
            }

            try {
                const response = await ordersAPI.removeFromCart(itemId);
                set({
                    cart: response.data,
                    itemCount: response.data.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
                });
            } catch (error) {
                console.error("Failed to remove from cart, rolling back.", error);
                set({ cart: previousCart, itemCount: previousCount });
                throw error;
            }
        } else {
            // Guest side
            const itemToRemove = get().guestItems.find(i => i.id === itemId);
            if (itemToRemove) trackRemoveFromCart(itemToRemove.product, itemToRemove.quantity);

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
        
        // Snapshot for rollback
        const previousCart = get().cart;
        const previousCount = get().itemCount;

        if (isAuthenticated && !itemId.startsWith('guest_')) {
            // OPTIMISTIC QUANTITY
            if (previousCart) {
                const newItems = previousCart.items.map(item => {
                    if (item.id === itemId) {
                        return { ...item, quantity, total_price: Number(item.unit_price) * quantity };
                    }
                    return item;
                }).filter(i => i.quantity > 0);

                const newSubtotal = newItems.reduce((sum, i) => sum + (Number(i.unit_price) * i.quantity), 0);
                
                set({
                    cart: { 
                        ...previousCart, 
                        items: newItems, 
                        subtotal: newSubtotal, 
                        delivery_fee: newItems.reduce((sum, i) => sum + (Number(i.product?.estimated_shipping_fee || 0) * i.quantity), 0),
                        total: newSubtotal + newItems.reduce((sum, i) => sum + (Number(i.product?.estimated_shipping_fee || 0) * i.quantity), 0)
                    },
                    itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0)
                });
            }

            try {
                const response = await ordersAPI.updateCartItem(itemId, quantity);
                set({
                    cart: response.data,
                    itemCount: response.data.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
                });
            } catch (error) {
                console.error("Failed to update quantity, rolling back.", error);
                set({ cart: previousCart, itemCount: previousCount });
                throw error;
            }
        } else {
            // Guest side
            const newGuest = get().guestItems.map(item => {
                if (item.id === itemId) {
                    return { ...item, quantity, total_price: item.unit_price * quantity };
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

    toggleSelection: (itemId: string) => {
        const selected = new Set(get().selectedItemIds);
        if (selected.has(itemId)) {
            selected.delete(itemId);
        } else {
            selected.add(itemId);
        }
        set({ selectedItemIds: selected });
    },

    selectAll: (selected: boolean) => {
        const isAuth = useAuthStore.getState().isAuthenticated;
        const items = isAuth ? (get().cart?.items || []) : get().guestItems;
        if (selected) {
            set({ selectedItemIds: new Set(items.map(i => i.id)) });
        } else {
            set({ selectedItemIds: new Set() });
        }
    },

    clearCart: async () => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        const currentCart = get().cart;

        // Reset local state immediately for snappy UX
        set({ cart: null, guestItems: [], itemCount: 0, selectedItemIds: new Set() });
        localStorage.removeItem('guest_cart');

        if (isAuthenticated && currentCart?.items) {
            // ONLY clear server items if the order is still a DRAFT.
            // If the user just paid, the order is PENDING_PAYMENT or PAID.
            // We MUST NOT delete items from those orders.
            if (currentCart.state === 'DRAFT') {
                console.info("[CartStore] Clearing DRAFT cart items from server...");
                try {
                    await Promise.all(
                        currentCart.items.map(item => ordersAPI.removeFromCart(item.id))
                    );
                } catch (error) {
                    console.error("[CartStore] Server-side cleanup failed:", error);
                }
            } else {
                console.info("[CartStore] Order is beyond DRAFT state. Skipping server-side item deletion.");
            }
        }
    },
}));

function isAuthenticated() {
    return useAuthStore.getState().isAuthenticated;
}
