import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/fetchers';
import { getImageUrl } from '@/lib/image';

const BASE_URL = 'https://londonsimports.com';

export async function GET() {
  try {
    // 1. Fetch products (Max 1000 for the feed)
    const productsData = await getProducts({ limit: '1000' });
    const products = productsData.results || [];

    // 2. Generate XML Header
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>London's Imports Ghana - Global Sourcing Feed</title>
    <link>${BASE_URL}</link>
    <description>Premium China to Ghana mini-importation and logistics service.</description>
    `;

    // 3. Map Products to XML Items
    const escapeXml = (unsafe: string) => {
      return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '\'': return '&apos;';
          case '"': return '&quot;';
          default: return c;
        }
      });
    };

    products.forEach((product: { id: string; slug: string; image: string; preorder_status: string; vendor?: { business_name: string }; description?: string; name: string; price: number }) => {
      const productUrl = `${BASE_URL}/products/${product.slug}`;
      const imageUrl = getImageUrl(product.image);
      const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
      
      const availability = product.preorder_status === 'READY_TO_SHIP' ? 'in_stock' : 'preorder';
      const condition = 'new';
      const brand = escapeXml(product.vendor?.business_name || "London's Imports");

      // Clean description for XML
      const description = escapeXml((product.description || '').replace(/[^\x20-\x7E]/g, '')).substring(0, 5000);
      const title = escapeXml(`${product.name} - Buy in Ghana`);

      xml += `
    <item>
      <g:id>${product.id}</g:id>
      <title>${title}</title>
      <description>${description}</description>
      <link>${productUrl}</link>
      <g:image_link>${absoluteImageUrl}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${product.price} GHS</g:price>
      <g:brand>${brand}</g:brand>
      <g:condition>${condition}</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping>
        <g:country>GH</g:country>
        <g:service>Standard Shipping</g:service>
        <g:price>25 GHS</g:price>
      </g:shipping>
    </item>`;
    });

    // 4. Close XML
    xml += `
  </channel>
</rss>`;

    // 5. Return Response with XML content-type
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Error generating Google Shopping Feed:', error);
    return new NextResponse('Error generating feed', { status: 500 });
  }
}
