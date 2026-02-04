/* eslint-disable @next/next/no-img-element */
// Note: Inline styles are REQUIRED for Next.js ImageResponse API - CSS files are not supported
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'London\'s Imports - Mini Importation Ghana';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    // Fonts
    // We can load fonts here if needed, or rely on system fonts for now to keep it simple/fast.

    // Fetch featured products
    // Default fallback images if fetch fails
    const products = [
        'https://londonsimports.com/delivery-boxes.png',
        'https://londonsimports.com/hero-preorder.png',
    ];

    try {
        const res = await fetch('https://london-imports-api.onrender.com/api/v1/products/?is_featured=true&limit=2', { next: { revalidate: 86400 } });
        if (res.ok) {
            const data = await res.json();
            if (data.results && data.results.length > 0) {
                // Extract images. Ideally map to absolute URLs
                // We'll trust the serializer update we just did!
                const fetchedImages = data.results.map((p: { image?: string }) => p.image).filter(Boolean);
                if (fetchedImages.length > 0) products.splice(0, fetchedImages.length, ...fetchedImages);
            }
        }
    } catch (e) {
        console.error('OG Image fetch failed', e);
    }

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '60px',
                }}
            >
                {/* Left Side: Branding */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '55%', height: '100%', justifyContent: 'center' }}>
                    <p style={{ fontSize: '24px', color: '#666', fontFamily: 'monospace', margin: '0 0 30px 0' }}>
                        londonsimports.com
                    </p>

                    <h1 style={{ fontSize: '56px', fontWeight: 'bold', color: '#1a1a1a', margin: 0, lineHeight: 1.2, display: 'flex', flexDirection: 'column' }}>
                        <span>Mini Importation Ghana |</span>
                        <span>Ship from China to Accra |</span>
                        <span style={{ color: '#7c3aed' }}>London&apos;s Imports</span>
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px' }}>
                        <img
                            src="https://londonsimports.com/logo.jpg"
                            alt="Logo"
                            width="60"
                            height="60"
                            style={{ borderRadius: '50%', marginRight: '20px' }}
                        />
                        <span style={{ fontSize: '24px', color: '#444' }}>Trusted by 1000+ businesses</span>
                    </div>
                </div>

                {/* Right Side: Product Collage */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '45%', justifyContent: 'center' }}>
                    {products.map((img, i) => (
                        <div key={i} style={{ display: 'flex', width: '220px', height: '380px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                            <img src={img} alt="Featured product" width="220" height="380" style={{ objectFit: 'cover' }} />
                        </div>
                    )).slice(0, 2)}
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
