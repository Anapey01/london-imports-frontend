'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Instagram } from 'lucide-react';

const Footer = () => {
    const pathname = usePathname();

    // Hide footer on admin and dashboard routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) {
        return null;
    }

    return (
        <footer className="hidden md:block bg-slate-950 text-slate-400 py-16 border-t border-slate-900 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-900/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-4 lg:col-span-5">
                        <div className="flex items-center gap-3 mb-6">
                            <Image src="/logo.jpg" alt="London's Imports" width={48} height={48} className="rounded-xl shadow-2xl ring-1 ring-white/10" />
                            <div>
                                <span className="text-white font-bold text-lg tracking-tight block">London&apos;s Imports</span>
                                <span className="text-xs text-slate-500 font-medium">EST. 2024</span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-sm">
                            Ghana&apos;s premier pre-order platform. Bridging the gap between you and international trends with authentic products at unbeatable prices.
                        </p>

                        <div className="flex gap-3">
                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/londonimportsghana"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-pink-600 hover:border-pink-500 hover:text-white transition-all duration-300 group"
                                aria-label="Follow us on Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>

                            {/* TikTok */}
                            <a
                                href="https://www.tiktok.com/@londons_imports1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
                                aria-label="Follow us on TikTok"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>

                            {/* Snapchat */}
                            <a
                                href="https://www.snapchat.com/add/londons_imports"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-[#FFFC00] hover:text-black hover:border-[#FFFC00] transition-all duration-300 group"
                                aria-label="Add us on Snapchat"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.003 1.996a9.982 9.982 0 0 0-2.835.405c-.172.05-.38.125-.572.247-.468.298-1.298 1.096-1.55 1.488-.042.064-.096.112-.132.193-.075.163-.075.335.003.493.078.158.21.325.753.642.617.362 1.25.82 1.444 1.25.132.296.136.634.02 1.05-.164.58-.592 1.03-1.09 1.554-.344.364-.783.827-1.11 1.464-.325.633-.42 1.29-.272 1.956.12.535.418 1 .892 1.392.215.178.232.228.214.3-.04.168-.5.736-1.042.825-.37.06-.708.016-1.487-.194l-.3-.082c-.37-.098-.553-.146-.66-.146-.223 0-.323.078-.507.22l-.088.067c-.206.158-.45.346-.86.346-.51 0-.91-.32-1.127-.9-.057-.15-.157-.222-.258-.222-.43 0-.66.82-.445 1.6.14.506.58.796 1.463 1.03.11.03.353.088.756.184.444.106.84.2 1.157.34.62.274.965.738.965 1.305 0 .805-.623 1.21-1.855 1.21-.297 0-.638-.024-1.002-.072-.82-.107-1.493-.195-2.022.253a.853.853 0 0 0-.27.65c-.012.873 1.077 1.838 2.5 2.214 2 1.114 4.887 1.114 7.214 0 1.423-.376 2.512-1.34 2.5-2.214a.853.853 0 0 0-.27-.65c-.53-.448-1.202-.36-2.022-.253-.364.048-.705.072-1.002.072-1.232 0-1.855-.405-1.855-1.21 0-.568.345-1.03.965-1.306.317-.14.713-.233 1.157-.34.403-.095.646-.153.756-.183.882-.234 1.323-.524 1.463-1.03.215-.78-.016-1.6-.446-1.6-.1 0-.2.07-.257.22-.217.58-.617.9-1.127.9-.41 0-.654-.188-.86-.346l-.088-.067c-.183-.142-.284-.22-.507-.22-.107 0-.29.048-.66.146l-.3.082c-.78.21-1.117.254-1.488.194-.54-.09-1-.657-1.04-1.825-.02-.073 0-.123.213-.3.473-.392.772-.857.892-1.392.148-.665.053-1.323-.272-1.956-.327-.637-.766-1.1-1.11-1.464-.498-.523-.926-.974-1.09-1.554-.116-.416-.112-.754.02-1.05.193-.43.827-.888 1.444-1.25.543-.317.675-.484.753-.642.08-.158.078-.33.003-.493-.036-.08-.09-.128-.132-.193-.252-.392-1.082-1.19-1.55-1.488-.192-.122-.4-.197-.572-.247a9.98 9.98 0 0 0-2.835-.405z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <h4 className="text-white font-semibold mb-6 text-xs uppercase tracking-widest text-opacity-80">Shop</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/products" className="hover:text-pink-400 hover:translate-x-1 transition-all inline-block">All Products</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-pink-400 hover:translate-x-1 transition-all inline-block">How It Works</Link></li>
                            <li><Link href="/faq" className="hover:text-pink-400 hover:translate-x-1 transition-all inline-block">FAQs</Link></li>
                            <li><Link href="/track" className="hover:text-pink-400 hover:translate-x-1 transition-all inline-block">Track Order</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3 lg:col-span-2">
                        <h4 className="text-white font-semibold mb-6 text-xs uppercase tracking-widest text-opacity-80">Support</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/about" className="hover:text-pink-400 hover:translate-x-1 transition-all inline-block">Our Story</Link></li>
                            <li><Link href="/contact" className="hover:text-pink-400 hover:translate-x-1 transition-all inline-block">Contact Us</Link></li>
                            <li><Link href="/terms" className="hover:text-pink-400 hover:translate-x-1 transition-all inline-block">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-pink-400 hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="md:col-span-3 lg:col-span-3">
                        <h4 className="text-white font-semibold mb-6 text-xs uppercase tracking-widest text-opacity-80">We&apos;re Here</h4>
                        <address className="text-sm not-italic space-y-3 mb-6">
                            <p className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>GM-1739 Felchris Estate 2,<br />Danfa, Accra, Ghana</span>
                            </p>
                            <a href="https://wa.me/233541096372" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-400 transition-colors group">
                                <span className="w-5 h-5 flex items-center justify-center rounded bg-green-900/20 group-hover:bg-green-500/20 text-green-500 transition-colors">
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.21-3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                </span>
                                +233 54 109 6372
                            </a>
                        </address>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Subscribe to drops..."
                                className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm w-full focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-slate-600"
                            />
                            <button className="bg-white hover:bg-pink-50 text-black px-4 py-2.5 rounded-lg transition-colors font-medium text-sm">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} London&apos;s Imports. All rights reserved.
                    </p>

                    {/* Payment Icons - Styled Uniformly */}
                    <div className="flex items-center gap-3 opacity-75 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-500">
                        <div className="h-7 px-2 bg-slate-900/50 rounded flex items-center border border-slate-800" title="MTN Mobile Money">
                            <span className="text-[#FFCC00] text-[10px] font-black tracking-tight">MTN<span className="text-[8px]">MoMo</span></span>
                        </div>
                        <div className="h-7 px-2 bg-slate-900/50 rounded flex items-center border border-slate-800" title="Visa">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 w-auto" />
                        </div>
                        <div className="h-7 px-2 bg-slate-900/50 rounded flex items-center border border-slate-800" title="Mastercard">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 w-auto" />
                        </div>
                        <div className="h-7 px-2 bg-slate-900/50 rounded flex items-center border border-slate-800" title="Paystack">
                            <span className="text-cyan-400 text-xs font-bold">Paystack</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
