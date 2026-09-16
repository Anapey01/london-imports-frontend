import DeliveryFeedContent from './DeliveryFeedContent';
import { Metadata } from 'next';

export const revalidate = 604800; // Cache for 7 days to preserve Vercel Free Tier limits

export const metadata: Metadata = {
    title: 'Logistics & Delivery Feed | London\'s Imports Ghana',
    description: 'Verified delivery photos and real-world proof of our consolidated air and sea cargo shipments delivered to Accra & Kumasi.',
    openGraph: {
        title: 'Logistics & Delivery Feed | London\'s Imports Ghana',
        description: 'Verified delivery photos and real-world proof of our consolidated air and sea cargo shipments delivered to Accra & Kumasi.',
        url: 'https://londonsimports.com/delivery-feed',
        type: 'website',
    }
};

export default function DeliveryFeedPage() {
    return <DeliveryFeedContent />;
}
