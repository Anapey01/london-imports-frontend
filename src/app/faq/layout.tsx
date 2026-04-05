import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ Repository | London\'s Imports Ghana',
    description: 'Find answers to common questions about mini-importation, shipping from China to Ghana, payments with Momo, and customs clearance.',
    openGraph: {
        title: 'FAQ Repository | London\'s Imports Ghana',
        description: 'Transparent, architectural answers to your logistics and sourcing queries.',
        url: 'https://londonsimports.com/faq',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FAQ Repository | London\'s Imports Support',
        description: 'Our logistics protocol explained in detail for the sophisticated importer.',
    }
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How do I buy from China to Ghana?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "With London's Imports, you can easily buy from China (1688, Alibaba, Taobao) and have it shipped to Ghana. Simply browse our products, place your order, pay with Mobile Money, and we handle shipping, customs clearance, and doorstep delivery to Accra, Tema, Kumasi, and anywhere in Ghana."
            }
        },
        {
            "@type": "Question",
            "name": "What is mini importation in Ghana?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Mini importation is the process of buying goods in small quantities from overseas suppliers (mainly China) and having them shipped to Ghana. London's Imports makes this easy by handling all logistics from factory to doorstep."
            }
        },
        {
            "@type": "Question",
            "name": "How much does shipping from China to Ghana cost?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Shipping costs vary based on weight and method. Air freight typically takes 7-14 days while sea freight takes 30-45 days. We offer transparent pricing in GHS with no hidden fees."
            }
        },
        {
            "@type": "Question",
            "name": "Can I pay with Mobile Money (Momo)?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! We accept MTN Mobile Money, Vodafone Cash, and AirtelTigo Money for all orders. You pay in Ghana Cedis (GHS) at competitive exchange rates."
            }
        }
    ]
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <script
                id="faq-page-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            {children}
        </>
    );
}
