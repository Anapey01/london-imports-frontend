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
        '/*?*',        // Block all query parameters to prevent duplicate indexing
        '/*_rsc*',     // Block Next.js internal data payloads
      ],
    },
    sitemap: 'https://londonsimports.com/sitemap.xml',
  }
}
