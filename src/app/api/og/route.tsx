import { ImageResponse } from '@vercel/og';
import { getProductMetadata } from '@/lib/fetchers';
import { getAbsoluteImageUrl } from '@/lib/image';

// Use Edge runtime for native image generation (Zero-dependency)
export const runtime = 'edge';
export const revalidate = 3600;

/**
 * London's Imports - Unified Global OpenGraph Image API
 * NUCLEAR RESILIENCE: Inlined Template + Diagnostic Echo
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

    // --- 2. THE NUCLEAR TEMPLATE (Inlined to prevent module resolution errors) ---
    return new ImageResponse(
      (
        <div style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#FAFAFA',
          fontFamily: 'sans-serif',
        }}>
          {/* Left Panel: Image */}
          <div style={{
            display: 'flex',
            width: '50%',
            height: '100%',
            backgroundColor: '#ECECEC',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {image ? (
                <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <div style={{ fontSize: 80, color: '#CBD5E1', fontWeight: 'bold' }}>LI.</div>
            )}
          </div>

          {/* Right Panel: Data */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            height: '100%',
            padding: '80px',
            justifyContent: 'space-between',
            borderLeft: '1px solid #E5E7EB',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.2em', 
                    fontSize: 18, 
                    color: '#9CA3AF', 
                    fontWeight: 700,
                    marginBottom: '10px'
                }}>{type}</div>
                <div style={{ 
                    fontSize: 54, 
                    fontWeight: 800, 
                    color: '#111827', 
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                }}>{title}</div>
                {price && (
                    <div style={{ 
                        marginTop: '30px', 
                        fontSize: 48, 
                        color: '#000000', 
                        fontWeight: 800, 
                        backgroundColor: '#FDE68A', 
                        padding: '10px 20px', 
                        borderRadius: '4px',
                        alignSelf: 'flex-start'
                    }}>{price}</div>
                )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: 24, color: '#111827', fontStyle: 'italic' }}>London's Imports</div>
                <div style={{ height: '1px', width: '40px', backgroundColor: '#D1D5DB' }} />
                <div style={{ fontSize: 16, color: '#6B7280' }}>londonsimports.com</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [], // Uses built-in @vercel/og system fonts
      }
    );
  } catch (e) {
    const error = e as Error;
    console.error(`OG API Atomic Failure: ${error.message}`);
    
    // --- 3. THE SVG GATEKEEPER (Atomic Fallback) ---
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
