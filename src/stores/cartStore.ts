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
    description?: string;
    editorial_data?: {
        highlights: Array<{ icon: string; title: string; text: string }>;
        narrative: string;
        specs: Array<{ label: string; value: string }>;
    };
    category_name?: string;
    short_name?: string;
    display_name?: string;
    subtitle?: string;
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
    is_discreet?: boolean;
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
    version: number;
    itemCount: number;
    selectedItemIds: Set<string>;
    error: string | null;

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
    version: 0,
    selectedItemIds: new Set(),
    error: null,

    fetchCart: async () => {
        const reqVersion = get().version + 1;
        set({ version: reqVersion });

        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('access_token');
        
        // Only fetch from server if authenticated AND we actually have a token
        // This prevents "stale" sessions from triggering 401/redirects
        if (isAuthenticated && hasToken) {
            set({ isLoading: true });

            // MERGE LOGIC: Check for guest items to sync
            const savedGuest = typeof window !== 'undefined' ? localStorage.getItem('guest_cart') : null;
            
            // If already merging, we wait for it to finish before proceeding with the fetch
            if (get().isMerging) {
                console.info("[CartStore] Sync already in progress, waiting...");
                // Poll every 500ms for completion (max 10s)
                let attempts = 0;
                while (get().isMerging && attempts < 20) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    attempts++;
                }
            }

            if (savedGuest && !get().isMerging) {
                try {
                    set({ isMerging: true });
                    const guestItems: CartItem[] = JSON.parse(savedGuest);
                    
                    if (guestItems.length > 0) {
                        console.info("[CartStore] Syncing guest items to server...", guestItems.length);
                        
                        // Add each guest item to server cart SEQUENTIALLY to prevent race conditions
                        for (const item of guestItems) {
                            try {
                                await ordersAPI.addToCart(
                                    item.product.id, 
                                    item.quantity, 
                                    item.selected_size || "", 
                                    item.selected_color || ""
                                );
                            } catch (e: any) {
                                console.error(`[CartStore] Failed to sync item ${item.product.id}:`, e.response?.data || e.message);
                                // If we hit a 401, stop merging to prevent infinite loops
                                if (e.response?.status === 401) {
                                    set({ isMerging: false });
                                    return;
                                }
                            }
                        }

                        // ONLY clear local guest state AFTER successful sync attempt
                        localStorage.removeItem('guest_cart');
                        set({ guestItems: [] });
                        console.info("[CartStore] Sync completed.");
                    }
                } catch (e) {
                    console.error("[CartStore] Merge process encountered a fatal error:", e);
                } finally {
                    set({ isMerging: false });
                }
            }

            try {
                // CACHE BUSTING: Mobile browsers (Safari/Chrome) often cache the empty cart state.
                // Adding a timestamp ensures we get the "Absolute Truth" from the server.
                const timestamp = new Date().getTime();
                const response = await ordersAPI.cart({ t: timestamp });
                
                // IGNORE if a newer request (or add-to-cart) has started
                const serverCart = response.data;
                const serverItems = serverCart.items || [];

                set({ 
                    cart: serverCart, 
                    itemCount: serverItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
                    isLoading: false,
                    guestItems: savedGuest ? [] : get().guestItems
                });
                
                console.info(`[CartStore] Fetch successful. Items on server: ${serverItems.length}`);
            } catch (err) {
                console.error("[CartStore] Fetch failed:", err);
                if (get().version === reqVersion) {
                    // Fallback to guest count on error so badge doesn't flicker to 0
                    set({ 
                        cart: null, 
                        itemCount: get().guestItems.reduce((sum, i) => sum + i.quantity, 0) 
                    });
                }
            } finally {
                if (get().version === reqVersion) {
                    set({ isLoading: false });
                }
            }
        } else {
            // Guest Side
            const saved = localStorage.getItem('guest_cart');
            const items = saved ? JSON.parse(saved) : [];
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
    },

    addToCart: async (product: Product, quantity = 1, selectedSize?: string, selectedColor?: string, selectedVariant?: { id: string; name: string; price: string }) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('access_token');
        
        // Only use server if authenticated AND we actually have a token
        if (isAuthenticated && hasToken) {
            // Increment version to invalidate any pending fetchCart calls
            const reqVersion = get().version + 1;
            set({ version: reqVersion });

            // Optimistic Update
            const previousCount = get().itemCount;
            set({ itemCount: previousCount + quantity });

            try {
                // Combine variant and size if both exist, as backend only has selected_size field
                let sizeParam = selectedSize || "";
                if (selectedVariant) {
                    sizeParam = selectedSize ? `${selectedVariant.name}, ${selectedSize}` : selectedVariant.name;
                }

                console.info("[CartStore] Adding to cart (Server):", { productId: product.id, quantity, size: sizeParam, color: selectedColor || "" });

                // Pass variants to API
                const response = await ordersAPI.addToCart(
                    product.id, 
                    quantity, 
                    sizeParam, 
                    selectedColor || "", 
                    selectedVariant?.id
                );
                const cart = response.data;

                // Auto-select the newly added item
                const newSelected = new Set(get().selectedItemIds);
                cart.items?.forEach((i: CartItem) => {
                    newSelected.add(i.id);
                });

                // RACE CONDITION PROTECTION
                if (get().version !== reqVersion) return;

                set({
                    cart,
                    selectedItemIds: newSelected,
                    itemCount: cart.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
                });
            } catch (err: any) {
                console.error("[CartStore] Server addToCart failed:", err);
                
                // Rollback optimistic update on failure ONLY if no newer requests have started
                if (get().version === reqVersion) {
                    const rollbackCount = get().itemCount - quantity;
                    set({ 
                        itemCount: Math.max(0, rollbackCount),
                        error: "Failed to sync cart item",
                        isLoading: false 
                    });
                }
                throw err;
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
        const reqVersion = get().version + 1;
        set({ version: reqVersion });
        
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
                if (get().version !== reqVersion) return;
                
                set({
                    cart: response.data,
                    itemCount: response.data.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
                });
            } catch (error) {
                console.error("Failed to remove from cart, rolling back.", error);
                if (get().version === reqVersion) {
                    set({ cart: previousCart, itemCount: previousCount });
                }
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
        const reqVersion = get().version + 1;
        set({ version: reqVersion });
        
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
                if (get().version !== reqVersion) return;

                set({
                    cart: response.data,
                    itemCount: response.data.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
                });
            } catch (error) {
                console.error("Failed to update quantity, rolling back.", error);
                if (get().version === reqVersion) {
                    set({ cart: previousCart, itemCount: previousCount });
                }
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

        const reqVersion = get().version + 1;
        // Reset local state immediately for snappy UX
        set({ cart: null, guestItems: [], itemCount: 0, selectedItemIds: new Set(), version: reqVersion });
        localStorage.removeItem('guest_cart');

        if (isAuthenticated && currentCart?.items) {
            // ONLY clear server items if the order is still a DRAFT or PENDING_PAYMENT.
            if (currentCart.state === 'DRAFT' || currentCart.state === 'PENDING_PAYMENT') {
                console.info("[CartStore] Clearing cart items from server...");
                try {
                    await Promise.all(
                        currentCart.items.map(item => ordersAPI.removeFromCart(item.id))
                    );
                } catch (error) {
                    console.error("[CartStore] Server-side cleanup failed:", error);
                }
            } else {
                console.info("[CartStore] Order is beyond PENDING state. Skipping server-side item deletion.");
            }
        }
    },
}));
