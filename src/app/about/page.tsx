import AboutPageContent from './AboutPageContent';
import { Metadata } from 'next';

export const revalidate = 86400; // 24 hours
export const metadata: Metadata = {
    title: 'Institutional Narrative | London\'s Imports Ghana',
    description: 'Learn about London\'s Imports, the premier sourcing house and logistics protocol bridging China manufacturing and Ghana retail.',
    openGraph: {
        title: 'Institutional Narrative | London\'s Imports Ghana',
        description: 'Bridging the 12,000km gap between Chinese manufacturing and Ghanaian retail demand.',
        url: 'https://londonsimports.com/about',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'London\'s Imports | Institutional Legacy',
        description: 'Bridging China and Ghana through technology and logistics expertise.',
    }
};

export default function AboutPage() {
    return <AboutPageContent />;
}
