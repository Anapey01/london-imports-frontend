/**
 * Central site configuration and business info
 * Use this to avoid hardcoding strings everywhere!
 */
export const siteConfig = {
    name: "London's Imports",
    baseUrl: 'https://londonsimports.com',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://london-imports-api.onrender.com/api/v1',
    whatsapp: '233545247009',
    supportEmail: 'info@londonsimports.com',
    defaults: {
        deliveryWeeks: 3,
        preOrderCutoffDays: 14,
    },
    socials: {
        whatsapp: 'https://wa.me/233545247009',
        instagram: 'https://instagram.com/londons_imports',
    }
};

export type SiteConfig = typeof siteConfig;
