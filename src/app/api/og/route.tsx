import { getProductMetadata } from '@/lib/fetchers';
import { getAbsoluteImageUrl } from '@/lib/image';

// Use Edge runtime for native image generation (Zero-dependency)
export const runtime = 'edge';
export const revalidate = 3600;

/**
 * London's Imports - Unified Global OpenGraph Image API
 * ATOMIC SVG PIVOT: 100% Reliability via Pure SVG
 * This bypasses the corrupted PNG rendering engine (Satori) and returns a zero-byte-proof image.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const isTest = searchParams.get('test') === '1';
    
    // --- 0. DIAGNOSTIC ECHO (Confirm service is alive) ---
    if (isTest) {
        return new Response('<svg width="100" height="100"><rect width="100" height="100" fill="green"/></svg>', {
            headers: { 'Content-Type': 'image/svg+xml' }
        });
    }

    let title = searchParams.get('title') || "London's Imports";
    let image = searchParams.get('image') || getAbsoluteImageUrl(null);
    let price = searchParams.get('price');
    let type = searchParams.get('type') || 'Sourcing & Logistics';

    // --- 1. DYNAMIC PRODUCT RESOLUTION (Harden for backend fails) ---
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

    // --- 2. THE ATOMIC SVG CONSTRUCTOR ---
    // Pure SVG is 100% stable on the Edge. No Satori/PNG-binary dependencies.
    const svgFlyer = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="imageClip">
            <rect width="600" height="630" />
          </clipPath>
        </defs>
        
        <rect width="1200" height="630" fill="#FAFAFA"/>
        
        {/* Left Panel: Image or Brand Background */}
        <g clip-path="url(#imageClip)">
            ${image ? `
               <image href="${image}" width="600" height="630" preserveAspectRatio="xMidYMid slice" />
            ` : `
               <rect width="600" height="630" fill="#000000"/>
               <text x="300" y="340" font-family="sans-serif" font-weight="900" font-size="120" fill="#FFFFFF" text-anchor="middle">LI.</text>
            `}
        </g>
        
        {/* Right Panel: Divider */}
        <line x1="600" y1="0" x2="600" y2="630" stroke="#E5E7EB" stroke-width="2"/>
        
        {/* Type / Category */}
        <text x="680" y="120" font-family="sans-serif" font-weight="700" font-size="18" fill="#9CA3AF" letter-spacing="4">${type.toUpperCase()}</text>
        
        {/* Title (Multi-line approximation for SVG) */}
        <text x="680" y="200" font-family="sans-serif" font-weight="800" font-size="54" fill="#111827">
           ${title.length > 22 ? `
             <tspan x="680" dy="0">${title.substring(0, 20)}...</tspan>
           ` : title}
        </text>
        
        {/* Price Tag */}
        ${price ? `
          <rect x="680" y="280" width="280" height="80" rx="4" fill="#FDE68A"/>
          <text x="820" y="335" font-family="sans-serif" font-weight="800" font-size="48" fill="#000000" text-anchor="middle">${price}</text>
        ` : ''}
        
        {/* Footer Branding */}
        <text x="680" y="550" font-family="sans-serif" font-style="italic" font-size="24" fill="#111827">London's Imports</text>
        <line x1="880" y1="542" x2="920" y2="542" stroke="#D1D5DB" stroke-width="1"/>
        <text x="940" y="550" font-family="sans-serif" font-size="16" fill="#6B7280">londonsimports.com</text>
      </svg>
    `.trim();
    
    return new Response(svgFlyer, {
      status: 200,
      headers: { 
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
      }
    });

  } catch (e) {
    const error = e as Error;
    console.error(`OG API Atomic Failure: ${error.message}`);
    
    const fallbackSvg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#000"/>
        <text x="600" y="315" font-family="sans-serif" font-size="60" fill="#fff" text-anchor="middle">
          LONDON'S IMPORTS - Flyer Generation Temporary Limit
        </text>
      </svg>
    `;
    
    return new Response(fallbackSvg, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
}
