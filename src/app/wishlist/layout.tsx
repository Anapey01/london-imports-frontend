import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "My Saved Items | London's Imports Ghana",
    description: "Your curated list of premium imports from global manufacturing markets. Save items for later and track shopping trends for your Ghana business.",
    openGraph: {
        title: "My Saved Items | London's Imports",
        description: "Curated collection of saved items for shipping to Ghana.",
        type: 'website',
    }
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
    return children;
}
