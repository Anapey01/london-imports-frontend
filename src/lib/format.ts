/**
 * London's Imports - Formatting Utilities
 * Provides consistent formatting for currency and numbers
 * Forces 'en-GH' locale to prevent hydration mismatches between Server and Client
 */

export const formatPrice = (amount: number | string) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) return "GH₵ 0.00";

    return numericAmount.toLocaleString('en-GH', {
        style: 'currency',
        currency: 'GHS',
        minimumFractionDigits: 2,
    }).replace('GHS', 'GH₵').trim();
};

export const formatNumber = (num: number | string) => {
    const numericValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numericValue)) return "0";

    return numericValue.toLocaleString('en-GH');
};

export const cleanProductName = (product: { name?: string; display_name?: string; short_name?: string }) => {
    const rawName = product.display_name || product.short_name || product.name || '';
    const clean = rawName.trim();
    const len = clean.length;
    
    // 1. Check if string can be split into two identical halves
    if (len > 0 && len % 2 === 0) {
        const half = len / 2;
        const firstHalf = clean.substring(0, half);
        const secondHalf = clean.substring(half);
        if (firstHalf === secondHalf) {
            return firstHalf;
        }
    }
    
    // 2. Also check if there's a word-level duplication or space-separated halves
    const words = clean.split(/\s+/);
    if (words.length > 0 && words.length % 2 === 0) {
        const halfWords = words.length / 2;
        const firstHalfWords = words.slice(0, halfWords).join(' ');
        const secondHalfWords = words.slice(halfWords).join(' ');
        if (firstHalfWords.toLowerCase() === secondHalfWords.toLowerCase()) {
            return words.slice(0, halfWords).join(' ');
        }
    }
    
    return clean;
};
