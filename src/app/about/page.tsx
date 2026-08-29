import AboutPageContent from './AboutPageContent';
import { Metadata } from 'next';

export const revalidate = 604800; // 7 days
export const metadata: Metadata = {
    title: "About Us | London's Imports Ghana",
    description: "Learn about London's Imports, the premier sourcing and shipping platform bridging Chinese manufacturers with Ghanaian businesses and shoppers.",
    openGraph: {
        title: "About Us | London's Imports Ghana",
        description: "Bridging the gap between Chinese manufacturing and Ghanaian retail demand.",
        url: 'https://londonsimports.com/about',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "About London's Imports",
        description: "Bridging China and Ghana through technology and logistics expertise.",
    }
};

export default function AboutPage() {
    return <AboutPageContent />;
}
