import { getProductMetadata } from '@/lib/fetchers';
import { getAbsoluteImageUrl } from '@/lib/image';

// Use Edge runtime for native image generation (Zero-dependency)
export const runtime = 'edge';
export const revalidate = 3600;

/**
 * XML Escape helper to prevent malformed SVG structure
 */
function xmlEscape(str: string | null | undefined): string {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Helper to fetch image and return as Base64 data URI for SVG inlining.
 * This bypasses CORS issues during client-side Canvas rendering.
 */
async function getBase64Image(url: string | null): Promise<string | null> {
    if (!url) return null;
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(10000) }); // 10s timeout
        if (!response.ok) return null;
        
        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        
        // --- MEMORY-SAFE BASE64 ENCODING ---
        // Prevents "Maximum call stack size exceeded" on large images
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const len = bytes.byteLength;
        const CHUNK_SIZE = 8192; // Process in chunks to be efficient
        
        for (let i = 0; i < len; i += CHUNK_SIZE) {
            const chunk = bytes.subarray(i, i + CHUNK_SIZE);
            binary += String.fromCharCode.apply(null, chunk as any);
        }
        
        const base64String = btoa(binary);
        return `data:${contentType};base64,${base64String}`;
    } catch (e) {
        console.error(`Base64 conversion failed for ${url}:`, e);
        return null;
    }
}

/**
 * London's Imports - Unified Global OpenGraph Image API
 * ATOMIC SVG PIVOT v4: Fully Self-Contained SVG via Base64 Inlining
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const isTest = searchParams.get('test') === '1';
    
    // --- 0. DIAGNOSTIC ECHO ---
    if (isTest) {
        return new Response('<svg width="100" height="100"><rect width="100" height="100" fill="green"/></svg>', {
            headers: { 'Content-Type': 'image/svg+xml' }
        });
    }

    let title = searchParams.get('title') || "London's Imports";
    let imageUrl = searchParams.get('image') || getAbsoluteImageUrl(null);
    let price = searchParams.get('price');
    let type = searchParams.get('type') || 'Sourcing & Logistics';

    // --- 1. DYNAMIC PRODUCT RESOLUTION ---
    if (slug) {
        try {
            const product = await getProductMetadata(slug);
            if (product) {
                title = product.name;
                imageUrl = getAbsoluteImageUrl(product.image);
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

    // --- 2. IMAGE INLINING (The Nuclear Fix for CORS/Broken Images) ---
    const [base64ProductImage, base64Logo] = await Promise.all([
        getBase64Image(imageUrl),
        getBase64Image(getAbsoluteImageUrl('/logo.jpg'))
    ]);

    // Simple text wrapping logic for SVG
    const words = title.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        if ((currentLine + word).length < 18) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    });
    lines.push(currentLine);
    const displayLines = lines.slice(0, 3); // Max 3 lines

    // --- SANITIZE INPUTS FOR XML SAFETY ---
    const sTitle = xmlEscape(title);
    const sType = xmlEscape(type);
    const sPrice = xmlEscape(price);
    const sBrand = "London&apos;s Imports Ghana"; // Pre-escaped literal

    const svgFlyer = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="imageClip">
            <rect width="600" height="630" />
          </clipPath>
        </defs>
        
        <rect width="1200" height="630" fill="#FAFAFA"/>
        
        <!-- Left Panel: Inlined Image with Brand Overlay -->
        <g clip-path="url(#imageClip)">
            ${base64ProductImage ? `
               <image href="${base64ProductImage}" width="600" height="630" preserveAspectRatio="xMidYMid slice" />
               <!-- Premium Logo Overlay (Top-Left) -->
               <rect x="30" y="30" width="100" height="100" rx="12" fill="white" fill-opacity="0.9" />
               ${base64Logo ? `<image href="${base64Logo}" x="40" y="40" width="80" height="80" preserveAspectRatio="xMidYMid meet" />` : ''}
            ` : `
               <rect width="600" height="630" fill="#000000"/>
               ${base64Logo ? `<image href="${base64Logo}" x="150" y="165" width="300" height="300" preserveAspectRatio="xMidYMid meet" />` : ''}
            `}
        </g>
        
        <!-- Right Panel: Divider -->
        <line x1="600" y1="0" x2="600" y2="630" stroke="#E5E7EB" stroke-width="2"/>
        
        <!-- Type / Category -->
        <text x="660" y="80" font-family="sans-serif" font-weight="700" font-size="14" fill="#9CA3AF" letter-spacing="4">${xmlEscape(sType.toUpperCase())}</text>
        
        <!-- Title (Wrapped via TSPAN) -->
        <text x="660" y="160" font-family="sans-serif" font-weight="800" font-size="48" fill="#111827">
           ${displayLines.map((line, i) => `<tspan x="660" dy="${i === 0 ? 0 : 58}">${xmlEscape(line)}</tspan>`).join('')}
        </text>
        
        <!-- Price Tag (Shifted down for wrapped title) -->
        ${sPrice ? `
          <rect x="660" y="360" width="280" height="90" rx="4" fill="#FDE68A"/>
          <text x="800" y="420" font-family="sans-serif" font-weight="800" font-size="52" fill="#000000" text-anchor="middle">${sPrice}</text>
        ` : ''}
        
        <!-- Footer Branding -->
        <text x="660" y="560" font-family="sans-serif" font-style="italic" font-size="22" fill="#111827">${sBrand}</text>
        <line x1="910" y1="552" x2="950" y2="552" stroke="#D1D5DB" stroke-width="1"/>
        <text x="970" y="560" font-family="sans-serif" font-size="16" fill="#6B7280">londonsimports.com</text>
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
