import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Secure Checkout Protocol | Buy from China to Ghana | London's Imports",
    description: "Complete your order from China to Ghana. Secure payment via Momo or Bank Transfer. We handle Customs clearance and delivery to your doorstep in Accra.",
    robots: { index: false, follow: true }, // Don't index actual checkout but follow for canonical reference
    openGraph: {
        title: "Order Protocol | London's Imports",
        description: "Secure payment and sourcing protocol for China to Ghana shipping.",
        type: 'website',
    }
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
