import ContactPageContent from './ContactPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Support Center | London\'s Imports Ghana',
    description: 'Get in touch with London\'s Imports for logistics, sourcing, and wholesale inquiries. Our team in Accra and Guangzhou is ready to assist you.',
    openGraph: {
        title: 'Support Center | London\'s Imports Ghana',
        description: 'Direct communication protocol for logistics, sourcing, and institutional inquiries.',
        url: 'https://londonsimports.com/contact',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact London\'s Imports | Logistics Support',
        description: 'Connecting our global logistics network to your institutional doorstep.',
    }
};

export default function ContactPage() {
    return <ContactPageContent />;
}
