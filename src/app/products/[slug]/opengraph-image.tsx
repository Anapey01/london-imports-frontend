import { ImageResponse } from 'next/og';
import { getProductMetadata } from '@/lib/fetchers';
import { getImageUrl } from '@/lib/image';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

/**
 * London's Imports - High-Density Precision OG Generator
 * Generates a premium stationery-themed social card for products.
 */
export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  // 1. Fetch Product (Cached by Next.js)
  const product = await getProductMetadata(slug);
  
  if (!product) return new Response('Not Found', { status: 404 });

  const productImageUrl = getImageUrl(product.image);
  const formattedPrice = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0
  }).format(product.price);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          backgroundColor: '#FFFFFF',
          backgroundImage: 'radial-gradient(circle at 2px 2px, #f1f5f9 1px, transparent 0)',
          backgroundSize: '24px 24px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Left Branding Strip - London Green */}
        <div
          style={{
            display: 'flex',
            width: '80px',
            height: '100%',
            backgroundColor: '#006B5A',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              transform: 'rotate(-90deg)',
              color: 'white',
              fontSize: '24px',
              fontStyle: 'italic',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              letterSpacing: '0.1em',
            }}
          >
            LONDON'S IMPORTS
          </div>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: '60px 80px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Product Image Section */}
          <div
            style={{
              display: 'flex',
              width: '450px',
              height: '450px',
              backgroundColor: '#f8fafc',
              borderRadius: '24px',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
              border: '1px solid #f1f5f9',
            }}
          >
            {productImageUrl && (
              <img
                src={productImageUrl}
                alt={product.name}
                style={{
                  width: '90%',
                  height: '90%',
                  objectFit: 'contain',
                }}
              />
            )}
          </div>

          {/* Product Details Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '450px',
              gap: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#006B5A',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              AUTHENTIC SOURCING
            </div>
            
            <div
              style={{
                display: 'flex',
                fontSize: '54px',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {product.name}
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: '42px',
                fontWeight: 900,
                color: 'white',
                backgroundColor: '#006B5A',
                padding: '16px 32px',
                borderRadius: '12px',
                alignSelf: 'flex-start',
                boxShadow: '0 10px 20px rgba(0,107,90,0.2)',
              }}
            >
              {formattedPrice}
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 'auto',
                fontSize: '16px',
                color: '#64748b',
                letterSpacing: '0.05em',
              }}
            >
              londonsimports.com • Ghana's Premium Sourcing House
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
