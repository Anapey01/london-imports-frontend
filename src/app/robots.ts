import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/checkout/',
        '/cart/',
        '/orders/',
        '/login/',
        '/register/',
        '/profile/',
        '/*?search=',    // Save crawl budget for clean search URLs
        '/*?sort=',      // Avoid duplicate content from sorting
        '/*?category=',  // Category pages are handled via slugs
      ],
    },
    sitemap: 'https://londonsimports.com/sitemap.xml',
  }
}
