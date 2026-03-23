import { getProducts } from '@/lib/fetchers';
import { getImageUrl } from '@/lib/image';

const BASE_URL = 'https://londonsimports.com';

export async function GET() {
    // 1. Fetch Products
    const productsData = await getProducts({ limit: '1000' });
    const products = productsData.results || [];

    // 2. Fetch Blog Posts
    let blogPosts: { slug: string; title: string; featured_image?: string }[] = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://london-imports-api.onrender.com';
        const blogRes = await fetch(`${apiUrl}/api/v1/blog/`, {
            next: { revalidate: 86400 }
        });
        if (blogRes.ok) {
            blogPosts = await blogRes.json();
        }
    } catch (e) {
        console.error("Error fetching blog posts for image sitemap:", e);
    }

    // 3. Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // Add Product Images
    products.forEach((product: { image: string; slug: string; name: string }) => {
        if (product.image) {
            const imageUrl = getImageUrl(product.image);
            xml += `
  <url>
    <loc>${BASE_URL}/products/${product.slug}</loc>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>Mini Importation Ghana: ${product.name}</image:title>
      <image:caption>Quality ${product.name} imported from China to Ghana by London's Imports.</image:caption>
    </image:image>
  </url>`;
        }
    });

    // Add Blog Images
    blogPosts.forEach((post) => {
        if (post.featured_image) {
            const imageUrl = getImageUrl(post.featured_image);
            xml += `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>Mini Importation Guide: ${post.title}</image:title>
      <image:caption>${post.title} - Expertise from London's Imports Ghana.</image:caption>
    </image:image>
  </url>`;
        }
    });

    xml += `
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
        },
    });
}
