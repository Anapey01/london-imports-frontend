import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../cartStore';

describe('Cart Store', () => {
    beforeEach(() => {
        // Reset store state
        // IMPORTANT: Do not use `true` as second arg unless providing methods too.
        useCartStore.setState({
            cart: null,
            guestItems: [],
            isLoading: false,
            itemCount: 0
        });
    });

    it('should start with empty guest items', () => {
        const { guestItems } = useCartStore.getState();
        expect(guestItems).toHaveLength(0);
    });

    it('should add item to guest cart when not authenticated', async () => {
        const product = {
            id: '1',
            name: 'Test Product',
            price: 100,
            slug: 'test-product',
            image: 'test.jpg',
            available_sizes: [],
            available_colors: []
            // other optional props omitted
        };

        // Need to handle missing optional arguments if strict
        await useCartStore.getState().addToCart(product, 1, 'M', 'Red');

        const { guestItems } = useCartStore.getState();
        expect(guestItems).toHaveLength(1);
        expect(guestItems[0].product.id).toEqual(product.id);
        expect(guestItems[0].selected_size).toEqual('M');
    });
});
