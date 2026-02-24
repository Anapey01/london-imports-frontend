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
