import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/dashboard/', '/profile/', '/orders/', '/cart/'],
        },
        sitemap: 'https://london-import-frontend.vercel.app/sitemap.xml',
    };
}
