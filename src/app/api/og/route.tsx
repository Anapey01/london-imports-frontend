import { ImageResponse } from 'next/og';
import { OGTemplate } from './styles';
import { getProductMetadata } from '@/lib/fetchers';
import { getAbsoluteImageUrl } from '@/lib/image';
import { siteConfig } from '@/config/site';

// Use standard Node.js runtime for increased memory (fixed 0-byte flyer issue)
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

/**
 * London's Imports - Unified Global OpenGraph Image API
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    let title = searchParams.get('title') || "London's Imports";
    let image = searchParams.get('image') || getAbsoluteImageUrl(null);
    let price = searchParams.get('price');
    let type = searchParams.get('type') || 'Sourcing & Logistics';

    // 1. DYNAMIC PRODUCT RESOLUTION
    if (slug) {
        const product = await getProductMetadata(slug);
        if (product) {
            title = product.name;
            image = getAbsoluteImageUrl(product.image);
            type = product.category_name || 'Premium Sourcing';
            
            // Format price to GHS standards
            price = new Intl.NumberFormat('en-GH', {
              style: 'currency',
              currency: 'GHS',
              maximumFractionDigits: 0
            }).format(product.price || 0).replace('GHS', 'GH₵');
        }
    }

    // 2. Load Fonts with absolute paths for Edge environment
    let fontData;
    try {
       // Attempt local file fetch first, then fallback to hosted absolute URL
       const fontUrl = new URL('../../../../public/fonts/Montserrat-Bold.ttf', import.meta.url);
       const fontRes = await fetch(fontUrl);
       if (fontRes.ok) {
         fontData = await fontRes.arrayBuffer();
       } else {
         // DEFINITIVE FALLBACK: Hosted absolute URL
         const fallbackUrl = `${siteConfig.baseUrl}/fonts/Montserrat-Bold.ttf`;
         const fallbackRes = await fetch(fallbackUrl);
         if (fallbackRes.ok) fontData = await fallbackRes.arrayBuffer();
       }
    } catch (e) {
      console.warn('Font loading failed (using defaults)', e);
    }

    return new ImageResponse(
      <OGTemplate title={title} image={image} price={price} type={type} />,
      {
        width: 1200,
        height: 630,
        fonts: fontData ? [
            {
              name: 'Montserrat',
              data: fontData,
              style: 'normal',
              weight: 700,
            },
          ] : [],
      }
    );
  } catch (e) {
    const error = e as Error;
    console.error(`OG API generation failed: ${error.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
