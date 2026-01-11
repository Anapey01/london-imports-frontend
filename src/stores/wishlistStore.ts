/**
 * London's Imports - Wishlist Store
 * Zustand store for wishlist state
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './cartStore';

interface WishlistState {
    items: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],

            addToWishlist: (product) => {
                const { items } = get();
                if (!items.find((item) => item.id === product.id)) {
                    set({ items: [...items, product] });
                }
            },

            removeFromWishlist: (productId) => {
                set({ items: get().items.filter((item) => item.id !== productId) });
            },

            isInWishlist: (productId) => {
                return get().items.some((item) => item.id === productId);
            },

            clearWishlist: () => {
                set({ items: [] });
            },
        }),
        {
            name: 'wishlist-storage', // unique name for localStorage
        }
    )
);
