import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "My Saved Sourcing Items | London's Imports Ghana",
    description: "Your curated list of premium imports from 1688 and Alibaba. Save items for later and track sourcing trends for your Ghana business.",
    openGraph: {
        title: "My Saved Items | London's Imports",
        description: "Curated collection of sourcing goods from China to Ghana.",
        type: 'website',
    }
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
    return children;
}
