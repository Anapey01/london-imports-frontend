import { ImageResponse } from 'next/og';
import { OGTemplate } from './styles';
import { getProductMetadata } from '@/lib/fetchers';
import { getAbsoluteImageUrl } from '@/lib/image';

// Use Edge runtime for native image generation (Zero-dependency)
export const runtime = 'edge';
export const revalidate = 3600;

/**
 * London's Imports - Unified Global OpenGraph Image API
 * ATOMIC HARDENING: Zero-Dependency Strategy (CDN Fonts + Edge Runtime)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    let title = searchParams.get('title') || "London's Imports";
    let image = searchParams.get('image') || getAbsoluteImageUrl(null);
    let price = searchParams.get('price');
    let type = searchParams.get('type') || 'Sourcing & Logistics';

    // 1. DYNAMIC PRODUCT RESOLUTION (Harden for backend fails)
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

    // 2. Load Font (Official Google Fonts CDN - Extremely Stable)
    let fontData;
    try {
       // Official Montserrat Bold .ttf URL from Google Fonts
       const fontUrl = 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm453RRnxdRs.ttf'; 
       const fontRes = await fetch(fontUrl);
       if (fontRes.ok) {
           fontData = await fontRes.arrayBuffer();
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
    console.error(`OG API Atomic Failure: ${error.message}`);
    
    // 3. ZERO-BYTE GATEKEEPER: Always return a valid response (Generic Logo Flyer)
    // We fetch the default site logo to ensure a valid image is returned
    const defaultLogoUrl = 'https://londonsimports.com/logo.png';
    return fetch(defaultLogoUrl);
  }
}
