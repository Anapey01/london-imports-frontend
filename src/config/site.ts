/**
 * Central site configuration and business info
 * Use this to avoid hardcoding strings everywhere!
 */
export const siteConfig = {
    name: "London's Imports",
    baseUrl: 'https://londonsimports.com',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://london-imports-api.onrender.com/api/v1',
    whatsapp: '233545247009', // Main Shop Line
    concierge: '233541096372', // Specialized Sourcing/Support
    supportEmail: 'info@londonsimports.com',
    defaults: {
        deliveryWeeks: 3,
        preOrderCutoffDays: 14,
    },
    address: "danfa road nearTwinkle angle school, Danfa",
    addressMapLink: "https://maps.app.goo.gl/Lv3YVgXy8nvyWeHbA",
    socials: {
        whatsapp: 'https://wa.me/233545247009',
        concierge: 'https://wa.me/233541096372',
        instagram: 'https://www.instagram.com/londonimportsghana',
        tiktok: 'https://www.tiktok.com/@londons_imports1',
        snapchat: 'https://www.snapchat.com/add/londons_imports',
        trustpilot: 'https://www.trustpilot.com/review/londonsimports.com',
    }
};

export type SiteConfig = typeof siteConfig;
