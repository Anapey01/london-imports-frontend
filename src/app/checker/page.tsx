import { Metadata } from 'next';
import CheckerClient from './CheckerClient';

export const metadata: Metadata = {
  title: "WAEC Results Checker Center | London's Imports",
  description: "Buy WASSCE & BECE results checkers instantly in Ghana. Fast, secure payment via mobile money (MTN, Telecel, AT) or card. Retrieve your pins anytime.",
  openGraph: {
    title: "WAEC WASSCE & BECE Results Checker Portal",
    description: "Instant delivery of WAEC Results Checker serials and pins. Pay securely in Cedis via Mobile Money and get your code on-screen and in your email.",
    url: 'https://londonsimports.com/checker',
    siteName: "London's Imports",
    locale: 'en_GH',
    type: 'website',
  },
};

export default function CheckerPage() {
  return <CheckerClient />;
}
