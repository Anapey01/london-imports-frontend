import { ImageResponse } from 'next/og';
import { OGTemplate } from './styles';
import { getProductMetadata } from '@/lib/fetchers';
import { getAbsoluteImageUrl } from '@/lib/image';
import { siteConfig } from '@/config/site';

// Use Edge runtime for native image generation (resolves Node/Sharp conflicts)
export const runtime = 'edge';
export const revalidate = 3600;

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

    // 1. DYNAMIC PRODUCT RESOLUTION (Hardened for 401/500 backend fails)
    if (slug) {
        try {
            const product = await getProductMetadata(slug);
            if (product) {
                title = product.name;
                image = getAbsoluteImageUrl(product.image);
                type = product.category_name || 'Premium Sourcing';
                
                if (product.price) {
                    price = new Intl.NumberFormat('en-GH', {
                      style: 'currency',
                      currency: 'GHS',
                      maximumFractionDigits: 0
                    }).format(product.price).replace('GHS', 'GH₵');
                }
            }
        } catch (error) {
            console.error(`Metadata fetch failed for ${slug}:`, error);
        }
    }

    // 2. Load Fonts (Next.js File Trace - NFT Hinting)
    let fontData;
    try {
       // Primary: Host-qualified URL (Bypasses bundling issues)
       const fallbackUrl = `${siteConfig.baseUrl}/fonts/Montserrat-Bold.ttf`;
       const fallbackRes = await fetch(fallbackUrl);
       if (fallbackRes.ok) {
           fontData = await fallbackRes.arrayBuffer();
       } else {
           // Secondary: Asset-relative URL (NFT hint)
           const fontUrl = new URL('../../../../public/fonts/Montserrat-Bold.ttf', import.meta.url);
           const fontRes = await fetch(fontUrl);
           if (fontRes.ok) fontData = await fontRes.arrayBuffer();
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
    console.error(`OG API Error: ${error.message}`);
    
    return new Response(`Error: ${error.message}`, {
      status: 200, // Return text to prevent download loop
    });
  }
}
