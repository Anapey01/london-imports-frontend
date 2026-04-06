import { ImageResponse } from 'next/og';
import { OGTemplate } from './styles';
import { getProductMetadata } from '@/lib/fetchers';
import { getAbsoluteImageUrl } from '@/lib/image';
import { siteConfig } from '@/config/site';
import fs from 'fs';
import path from 'path';

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

    // 1. DYNAMIC PRODUCT RESOLUTION (Hardened with try/catch for 401/500 backend fails)
    if (slug) {
        try {
            const product = await getProductMetadata(slug);
            if (product) {
                title = product.name;
                image = getAbsoluteImageUrl(product.image);
                type = product.category_name || 'Premium Sourcing';
                
                // Format price to GHS standards
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
            // Non-fatal, continue with defaults
        }
    }

    // 2. Load Fonts (Native FS read for absolute reliability in Node runtime)
    let fontData;
    try {
       const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Montserrat-Bold.ttf');
       if (fs.existsSync(fontPath)) {
         fontData = fs.readFileSync(fontPath);
       } else {
         console.warn(`Font file not found at ${fontPath}, falling back to network`);
         const fallbackUrl = `${siteConfig.baseUrl}/fonts/Montserrat-Bold.ttf`;
         const fallbackRes = await fetch(fallbackUrl);
         if (fallbackRes.ok) fontData = await fallbackRes.arrayBuffer();
       }
    } catch (e) {
      console.warn('Font loading exception (using defaults)', e);
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
    const errorMessage = `OG API Error: ${error.message}`;
    console.error(errorMessage);
    
    // Return detailed error in response body for client-side diagnostics
    return new Response(errorMessage, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
