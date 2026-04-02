 
import { ImageResponse } from 'next/og';
import { OGTemplate } from './styles';

export const runtime = 'edge';

/**
 * London's Imports - Dynamic OpenGraph Image API
 * NOTE: This route uses Satori (next/og) which REQUIRES inline styles for SVG generation.
 * We encapsulate styling and templates into a separate module to satisfy IDE linting.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || "London's Imports";
    const image = searchParams.get('image');
    const price = searchParams.get('price');
    const type = searchParams.get('type') || 'Sourcing & Logistics';

    return new ImageResponse(
      <OGTemplate title={title} image={image} price={price} type={type} />,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    const error = e as Error;
    console.error(`OG Image generation failed: ${error.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
