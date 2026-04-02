import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "London's Imports | Your Bio Links",
  description: "Direct links to our China-to-Ghana catalog, custom sourcing requests, and social channels. Your one-stop shop for premium imports.",
  openGraph: {
    title: "London's Imports Ghana | Link-in-Bio",
    description: "Shop curated imports and request custom sourcing. Ghana's trusted logistics partner.",
    url: 'https://londonsimports.com/links',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: "London's Imports Links" }],
  },
  robots: { index: false, follow: true },
};

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
