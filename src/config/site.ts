/**
 * Central site configuration and business info
 * Use this to avoid hardcoding strings everywhere!
 */
export const siteConfig = {
    name: "London's Imports | China to Ghana Shopping & Logistics",
    baseUrl: 'https://londonsimports.com',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/v1' : 'https://london-imports-api.onrender.com/api/v1'),
    whatsapp: '233545247009', // Main Shop Line
    concierge: '233541096372', // Specialized Sourcing/Support
    supportEmail: 'info@londonsimports.com',
    description: "Ghana's easiest way to buy from China. Shop 1688 and Alibaba with Momo. Fast shipping to Accra & Kumasi. Reliable mini-importation for all businesses.",
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
        trustpilot: 'https://www.trustpilot.com/review/londonsimports.com',
    }
};

export type SiteConfig = typeof siteConfig;
