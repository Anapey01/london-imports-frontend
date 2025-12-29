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
                        <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-xs">
                            Ghana&apos;s premier pre-order platform. We connect you directly with international suppliers for authentic products at better prices.
                        </p>
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
                            <li><Link href="/terms" className="hover:text-white hover:translate-x-1 transition-all inline-block">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Stay Updated</h4>
                        <p className="text-xs text-slate-400 mb-4">
                            Subscribe for new drop alerts and exclusive offers.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-slate-500 transition-colors"
                            />
                            <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} London&apos;s Imports. All rights reserved.
                    </p>

                    {/* Payment Trust Signals (Visual only) */}
                    <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
                        <div className="h-6 w-10 bg-slate-700 rounded flex items-center justify-center text-[8px] font-bold text-slate-300">VISA</div>
                        <div className="h-6 w-10 bg-slate-700 rounded flex items-center justify-center text-[8px] font-bold text-slate-300">MC</div>
                        <div className="h-6 w-10 bg-slate-700 rounded flex items-center justify-center text-[8px] font-bold text-slate-300">MOMO</div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
