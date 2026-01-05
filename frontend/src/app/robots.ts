import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/dashboard/', '/profile/', '/orders/', '/cart/'],
        },
        sitemap: 'https://londonsimports.com/sitemap.xml',
    };
}
