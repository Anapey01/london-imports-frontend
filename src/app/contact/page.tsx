import ContactPageContent from './ContactPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Support Center | London\'s Imports Ghana',
    description: 'Get in touch with London\'s Imports for logistics, sourcing, and wholesale inquiries. Our team in Accra and Guangzhou is ready to assist you.',
    openGraph: {
        title: 'Support Center | London\'s Imports Ghana',
        description: 'Direct communication channels for logistics, shopping, and business inquiries.',
        url: 'https://londonsimports.com/contact',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact London\'s Imports | Logistics Support',
        description: 'Connecting our global shipping network to your business doorstep.',
    }
};

export default function ContactPage() {
    return <ContactPageContent />;
}
