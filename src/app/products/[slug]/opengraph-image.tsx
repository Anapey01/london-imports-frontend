import { ImageResponse } from 'next/og';
import { getProductMetadata } from '@/lib/fetchers';
import { getImageUrl } from '@/lib/image';
import { siteConfig } from '@/config/site';
import React, { CSSProperties } from 'react';

/**
 * London's Imports - High-Density Precision OG Generator
 * 
 * LINT NOTE: This file uses 'inline styles' and '<img>' tags intentionally. 
 * The 'next/og' engine (Satori) requires inline CSS as it doesn't support 
 * external stylesheets/Tailwind. '<img>' is required as <Image /> is not supported.
 */

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

// Move styles to a dedicated object to move them out of the JSX and satisfy most linters
const STYLES: Record<string, CSSProperties> = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    backgroundColor: '#FFFFFF',
    backgroundImage: 'radial-gradient(circle at 2px 2px, #f1f5f9 1px, transparent 0)',
    backgroundSize: '24px 24px',
    fontFamily: 'Montserrat, sans-serif',
  },
  brandingStrip: {
    display: 'flex',
    flexDirection: 'column',
    width: '120px',
    height: '100%',
    backgroundColor: '#006B5A',
    justifyContent: 'space-between',
    padding: '60px 0',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    width: '80px',
    height: '80px',
    backgroundColor: 'white',
    borderRadius: '16px',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  brandingTextContainer: {
    display: 'flex',
    width: '400px',
    height: '100px',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'rotate(-90deg)',
    marginBottom: '100px',
  },
  brandingText: {
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '0.15em',
    whiteSpace: 'nowrap',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    padding: '60px 80px',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    display: 'flex',
    width: '480px',
    height: '480px',
    backgroundColor: '#f8fafc',
    borderRadius: '32px',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #f1f5f9',
    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
  },
  productImage: {
    width: '90%',
    height: '90%',
    objectFit: 'contain',
  },
  imagePlaceholder: {
    display: 'flex',
    fontSize: '24px',
    color: '#cbd5e1',
  },
  detailsColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px',
    gap: '28px',
  },
  label: {
    display: 'flex',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#006B5A',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
  },
  title: {
    display: 'flex',
    fontSize: '56px',
    fontWeight: 900,
    color: '#0f172a',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  priceBadge: {
    display: 'flex',
    fontSize: '48px',
    fontWeight: 900,
    color: 'white',
    backgroundColor: '#006B5A',
    padding: '16px 36px',
    borderRadius: '16px',
    alignSelf: 'flex-start',
    boxShadow: '0 10px 25px rgba(0,107,90,0.2)',
  },
  footer: {
    display: 'flex',
    marginTop: 'auto',
    fontSize: '16px',
    color: '#64748b',
    letterSpacing: '0.05em',
    fontWeight: 500,
  },
};

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  // 1. Fetch Product Metadata (Next.js Data Cache)
  const product = await getProductMetadata(slug);
  
  if (!product) {
      return new Response('Product Not Found', { status: 404 });
  }

  const productImageUrl = getImageUrl(product.image);
  
  // Ensure we have an absolute URL for the logo
  const logoUrl = `${siteConfig.baseUrl}/logo.jpg`;

  // 2. Load Montserrat Font for Brand Consistency
  let fontData;
  try {
     // Resolution via import.meta.url is robust for both local and edge deployments
     const fontUrl = new URL('../../../../public/fonts/Montserrat-Bold.ttf', import.meta.url);
     const fontRes = await fetch(fontUrl);
     if (fontRes.ok) {
       fontData = await fontRes.arrayBuffer();
     } else {
       console.error(`Font fetch failed with status: ${fontRes.status}`);
       // Fallback attempt via baseUrl if relative path fails in certain edge environments
       const fallbackUrl = `${siteConfig.baseUrl}/fonts/Montserrat-Bold.ttf`;
       const fallbackRes = await fetch(fallbackUrl);
       if (fallbackRes.ok) fontData = await fallbackRes.arrayBuffer();
     }
  } catch (e) {
    console.error('Font fetch exception caught', e);
  }

  const formattedPrice = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0
  }).format(product.price || 0).replace('GHS', 'GH₵');

  return new ImageResponse(
    (
      <div style={STYLES.container}>
        {/* Left Branding Strip */}
        <div style={STYLES.brandingStrip}>
          <div style={STYLES.logoContainer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={logoUrl} 
              alt="Logo" 
              style={STYLES.logo} 
            />
          </div>
          
          <div style={STYLES.brandingTextContainer}>
            <span style={STYLES.brandingText}>
              LONDON&apos;S IMPORTS
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div style={STYLES.mainContent}>
          {/* Product Image */}
          <div style={STYLES.imageWrapper}>
            {productImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={productImageUrl} 
                alt={product.name} 
                style={STYLES.productImage} 
              />
            ) : (
                <div style={STYLES.imagePlaceholder}>No Image</div>
            )}
          </div>

          {/* Details */}
          <div style={STYLES.detailsColumn}>
            <div style={STYLES.label}>
              PREMIUM SOURCING
            </div>
            
            <div style={STYLES.title}>
              {product.name}
            </div>

            <div style={STYLES.priceBadge}>
              {formattedPrice}
            </div>

            <div style={STYLES.footer}>
              londonsimports.com • Ghana HQ
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
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
}
