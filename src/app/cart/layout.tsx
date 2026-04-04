import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "My Sourcing Basket | London's Imports Ghana",
    description: "Review and manage your China to Ghana imports. Secure your air-freight spots and finalize your sourcing collection for delivery to Accra, Tema, and Kumasi.",
    openGraph: {
        title: "My Sourcing Basket | London's Imports",
        description: "Review your selected items from China. Ready for shipping to Ghana.",
        type: 'website',
    }
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return children;
}
