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
        const res = await fetch('https://london-imports-api.onrender.com/api/v1/products/?is_featured=true&limit=2', { next: { revalidate: 3600 } });
        if (res.ok) {
            const data = await res.json();
            if (data.results && data.results.length > 0) {
                // Extract images. Ideally map to absolute URLs
                // We'll trust the serializer update we just did!
                const fetchedImages = data.results.map((p: any) => p.image).filter(Boolean);
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
                    background: 'linear-gradient(to bottom right, #fbfaf9, #f0f0f0)',
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
                <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                    <img
                        src="https://londonsimports.com/logo.jpg"
                        alt="Logo"
                        width="150"
                        height="150"
                        style={{ borderRadius: '50%', marginBottom: '30px' }}
                    />
                    <h1 style={{ fontSize: '64px', fontWeight: 'bold', color: '#1a1a1a', margin: 0, lineHeight: 1.1 }}>
                        London's Imports
                    </h1>
                    <p style={{ fontSize: '30px', color: '#666', marginTop: '20px', lineHeight: 1.4 }}>
                        Mini Importation Ghana.<br />
                        Ship from China to Accra.
                    </p>
                    <div style={{ display: 'flex', marginTop: '40px', alignItems: 'center' }}>
                        <div style={{ background: '#7c3aed', color: 'white', padding: '10px 24px', borderRadius: '30px', fontSize: '24px' }}>
                            Start Pre-ordering
                        </div>
                    </div>
                </div>

                {/* Right Side: Product Collage */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '50%', justifyContent: 'center' }}>
                    {products.map((img, i) => (
                        <div key={i} style={{ display: 'flex', width: '240px', height: '320px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                            <img src={img} width="240" height="320" style={{ objectFit: 'cover' }} />
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
