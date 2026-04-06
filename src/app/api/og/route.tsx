import { ImageResponse } from '@vercel/og';
import { OGTemplate } from './styles';
import { getProductMetadata } from '@/lib/fetchers';
import { getAbsoluteImageUrl } from '@/lib/image';

// Use Edge runtime for native image generation (Zero-dependency)
export const runtime = 'edge';
export const revalidate = 3600;

/**
 * London's Imports - Unified Global OpenGraph Image API
 * ZERO-DEPENDENCY HARDENING: Default Font + Zero-Network Edge
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

    // 2. Load Product Image (Harden with timeout)
    const imageRes = await fetch(image, { signal: AbortSignal.timeout(3000) }).catch(() => null);
    if (!imageRes || !imageRes.ok) {
        // Fallback to absolute brand logo if product image is missing/slow
        image = 'https://londonsimports.com/logo.png';
    }

    // 3. Render Image using DEFAULT FONT (Built-in to @vercel/og)
    return new ImageResponse(
      <OGTemplate title={title} image={image} price={price} type={type} />,
      {
        width: 1200,
        height: 630,
        // Empty fonts array forces it to use the built-in system font (Inter/Roboto-like)
        fonts: [],
      }
    );
  } catch (e) {
    const error = e as Error;
    console.error(`OG API Atomic Failure: ${error.message}`);
    
    // 4. ZERO-NETWORK GATEKEEPER: Always return a non-zero response (Minimal SVG Logo)
    const fallbackSvg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#000"/>
        <text x="600" y="315" font-family="sans-serif" font-size="60" fill="#fff" text-anchor="middle">
          LONDON'S IMPORTS - Flyer Generation Temporary Limit
        </text>
        <text x="600" y="380" font-family="sans-serif" font-size="24" fill="#888" text-anchor="middle">
          Please refresh to try again
        </text>
      </svg>
    `;
    
    return new Response(fallbackSvg, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
}
