import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || "London's Imports";
    const image = searchParams.get('image');
    const price = searchParams.get('price');
    const type = searchParams.get('type') || 'Sourcing & Logistics';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#FAFAFA',
            fontFamily: 'serif',
          }}
        >
          {/* Left Side: Product/Blog Image */}
          <div
            style={{
              display: 'flex',
              width: '50%',
              height: '100%',
              backgroundColor: '#ECECEC',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {image ? (
              <img
                src={image}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  fontSize: 80,
                  color: '#CBD5E1',
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold',
                }}
              >
                LI.
              </div>
            )}
          </div>

          {/* Right Side: Editorial Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              height: '100%',
              padding: '80px',
              justifyContent: 'space-between',
              borderLeft: '1px solid #E5E7EB',
            }}
          >
            {/* Top Branding & Title */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontSize: 18,
                  color: '#9CA3AF',
                  fontFamily: 'sans-serif',
                  fontWeight: 700,
                  marginBottom: '10px'
                }}
              >
                {type}
              </div>
              <div
                style={{
                  fontSize: 54,
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {title}
              </div>
              {price && (
                <div
                  style={{
                    marginTop: '30px',
                    fontSize: 42,
                    color: '#EC4899', // Pink-500
                    fontFamily: 'sans-serif',
                    fontWeight: 500,
                  }}
                >
                  {price}
                </div>
              )}
            </div>

            {/* Bottom Signature */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  color: '#111827',
                  fontFamily: 'serif',
                  fontStyle: 'italic',
                }}
              >
                London's Imports
              </div>
              <div
                style={{
                  height: '1px',
                  width: '40px',
                  backgroundColor: '#D1D5DB'
                }}
              />
              <div
                style={{
                  fontSize: 16,
                  color: '#6B7280',
                  fontFamily: 'sans-serif',
                }}
              >
                londonsimports.com
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
