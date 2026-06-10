/**
 * Central site configuration and business info
 * Use this to avoid hardcoding strings everywhere!
 */
export const siteConfig = {
    name: "London's Imports | Global Sourcing & Logistics",
    baseUrl: 'https://londonsimports.com',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api/v1' : 'https://api.londonsimports.com/api/v1'),
    whatsapp: '233545247009', // Main Shop Line
    concierge: '233541096372', // Specialized Sourcing/Support
    momoNumber: '055 812 3456', // Direct Mobile Money line
    momoName: "London's Imports Hub",
    supportEmail: 'info@londonsimports.com',
    description: "London’s Imports sources and curates products from global manufacturing markets and delivers them to customers in Ghana. Fast, secure, and reliable international shipping.",
    defaults: {
        deliveryWeeks: 3,
        preOrderCutoffDays: 14,
        freeShippingThreshold: 1000,
    },
    address: "Danfa Road near Twinkle Angle School, Danfa, Accra",
    addressMapLink: "https://maps.app.goo.gl/Lv3YVgXy8nvyWeHbA",
    socials: {
        whatsapp: 'https://wa.me/233545247009',
        concierge: 'https://wa.me/233541096372',
        instagram: 'https://www.instagram.com/londonimportsghana',
        tiktok: 'https://www.tiktok.com/@londons_imports1',
        snapchat: 'https://www.snapchat.com/add/londons_imports',
        twitter: 'https://x.com/londonsimports',
        twitterHandle: '@londonsimports',
        facebook: 'https://www.facebook.com/NaaAtsweiLondon',
        trustpilot: 'https://www.trustpilot.com/review/londonsimports.com',
    }
};

export type SiteConfig = typeof siteConfig;
