
import { getProduct, getProductMetadata } from '@/lib/fetchers';
import ProductDetailClient from './ProductDetailClient';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = params.slug;
    const product = await getProductMetadata(slug);

    if (!product) {
        return {
            title: 'Private Product | London\'s Imports',
            description: 'Join London\'s Imports to view exclusive products and pre-order pricing.',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: product.name + " | London's Imports",
        description: product.description?.substring(0, 160) || `Pre-order ${product.name} from London's Imports. Authentic products delivered to Ghana.`,
        openGraph: {
            title: `Pre-order ${product.name}`,
            description: `Get ${product.name} delivered to you in Ghana. Reserve now.`,
            images: product.image ? [product.image, ...previousImages] : previousImages,
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const product = await getProduct(params.slug);

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
                <div className="bg-gray-50 p-8 rounded-2xl max-w-md w-full border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Private or Unavailable</h2>
                    <p className="text-gray-600 mb-6">
                        This product might be restricted to members or is currently out of stock.
                        Sign in to view full details and available pre-orders.
                    </p>
                    <div className="space-y-3">
                        <a href="/login" className="block w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition shadow-lg shadow-pink-200">
                            Sign In to View
                        </a>
                        <a href="/products" className="block w-full bg-white text-gray-700 font-bold py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
                            Browse All Products
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return <ProductDetailClient initialProduct={product} />;
}
