'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Footer = () => {
    const pathname = usePathname();

    // Hide footer on admin and dashboard routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) {
        return null;
    }

    return (
        <footer className="hidden md:block bg-slate-800 text-slate-300 py-12 lg:py-16 border-t border-slate-700/50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 lg:gap-8 mb-12">
                    <div className="md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <Image src="/logo.jpg" alt="London's Imports" width={40} height={40} className="rounded-lg shadow-lg" />
                            <span className="text-white font-bold text-lg tracking-tight">London&apos;s Imports</span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-200 mb-4 max-w-xs">
                            Ghana&apos;s premier pre-order platform. We connect you directly with international suppliers for authentic products at better prices.
                        </p>
                        {/* Physical Address for SEO */}
                        <address className="text-xs text-slate-300 not-italic mb-6">
                            <svg className="w-3 h-3 inline-block mr-1 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                            GM-1739 Felchris Estate 2, Danfa, Accra, Ghana
                        </address>
                        <div className="flex gap-4">
                            {/* Social Placeholders */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors cursor-pointer">
                                    <div className="w-4 h-4 bg-slate-400 rounded-sm"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="/products" className="hover:text-white hover:translate-x-1 transition-all inline-block">All Pre-orders</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-white hover:translate-x-1 transition-all inline-block">How It Works</Link></li>
                            <li><Link href="/faq" className="hover:text-white hover:translate-x-1 transition-all inline-block">Common Questions</Link></li>
                            <li><Link href="/track" className="hover:text-white hover:translate-x-1 transition-all inline-block">Track Order</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Support</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block">Our Story</Link></li>
                            <li><Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contact Us</Link></li>
                            <li>
                                <a href="https://wa.me/233541096372" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    +233 54 109 6372
                                </a>
                            </li>
                            <li><Link href="/terms" className="hover:text-white hover:translate-x-1 transition-all inline-block">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Stay Updated</h4>
                        <p className="text-xs text-slate-200 mb-4">
                            Subscribe for new drop alerts and exclusive offers.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-slate-500 transition-colors"
                            />
                            <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors" aria-label="Subscribe to newsletter">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-slate-300">
                        © {new Date().getFullYear()} London&apos;s Imports. All rights reserved. <span className="opacity-50 ml-1">v.2026.01.11.2200</span>
                    </p>

                    {/* Payment Trust Signals (Visual only) */}
                    <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
                        <div className="h-6 w-10 bg-slate-700 rounded flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
                        <div className="h-6 w-10 bg-slate-700 rounded flex items-center justify-center text-[8px] font-bold text-white">MC</div>
                        <div className="h-6 w-10 bg-slate-700 rounded flex items-center justify-center text-[8px] font-bold text-white">MOMO</div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
