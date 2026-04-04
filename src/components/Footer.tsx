'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Instagram, Star, ArrowUpRight, MapPin, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

const Footer = () => {
    const pathname = usePathname();

    // Hide footer on admin and dashboard routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) {
        return null;
    }

    return (
        <footer className="hidden md:block bg-white dark:bg-slate-950 pt-40 pb-16 border-t border-slate-50 dark:border-slate-900 relative overflow-hidden selection:bg-emerald-100 font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                
                {/* 1. BRAND HEADER */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12 mb-24 border-b border-slate-900 dark:border-white pb-16">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-6 mb-12">
                             <div className="relative w-16 h-16 border border-slate-900 dark:border-white overflow-hidden bg-white">
                                 <Image 
                                    src="/logo.jpg" 
                                    alt="London's Imports" 
                                    fill 
                                    className="object-cover" 
                                 />
                             </div>
                             <div className="flex flex-col gap-1">
                                 <div className="h-px w-10 bg-slate-900 dark:bg-white" />
                                 <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500 dark:text-slate-500">
                                     China to Ghana Sourcing / 2026
                                 </span>
                             </div>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-serif font-bold leading-[0.85] tracking-tighter text-slate-900 dark:text-white">
                            London&apos;s <br />
                            <span className="italic font-light text-slate-300 dark:text-slate-700">Imports.</span>
                        </h2>
                    </div>

                    <div className="text-right">
                         <div className="flex items-center justify-end gap-6 mb-8">
                             {/* High-Contrast Social Matrix */}
                             <a href={siteConfig.socials.instagram} target="_blank" rel="noopener" className="text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors" title="Instagram" aria-label="Instagram">
                                <Instagram className="w-5 h-5" strokeWidth={1.5} />
                             </a>
                             <a href={siteConfig.socials.tiktok} target="_blank" rel="noopener" className="text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors" title="TikTok" aria-label="TikTok">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                             </a>
                             <a href={siteConfig.socials.snapchat} target="_blank" rel="noopener" className="text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors" title="Snapchat" aria-label="Snapchat">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.003 1.996a9.982 9.982 0 0 0-2.835.405c-.172.05-.38.125-.572.247-.468.298-1.298 1.096-1.55 1.488-.042.064-.096.112-.132.193-.075.163-.075.335.003.493.078.158.21.325.753.642.617.362 1.25.82 1.444 1.25.132.296.136.634.02 1.05-.164.58-.592 1.03-1.09 1.554-.344.364-.783.827-1.11 1.464-.325.633-.42 1.29-.272 1.956.12.535.418 1 .892 1.392.215.178.232.228.214.3-.04.168-.5.736-1.042.825-.37.06-.708.016-1.487-.194l-.3-.082c-.37-.098-.553-.146-.66-.146-.223 0-.323.078-.507.22l-.088.067c-.206.158-.45.346-.86.346-.51 0-.91-.32-1.127-.9-.057-.15-.157-.222-.258-.222-.43 0-.66.82-.445 1.6.14.506.58.796 1.463 1.03.11.03.353.088.756.184.444.106.84.2 1.157.34.62.274.965.738.965 1.305 0 .805-.623 1.21-1.855 1.21-.297 0-.638-.024-1.002-.072-.82-.107-1.493-.195-2.022.253a.853.853 0 0 0-.27.65c-.012.873 1.077 1.838 2.5 2.214 2 1.114 4.887 1.114 7.214 0 1.423-.376 2.512-1.34 2.5-2.214a.853.853 0 0 0-.27-.65c-.53-.448-1.202-.36-2.022-.253-.364.048-.705.072-1.002.072-1.232 0-1.855-.405-1.855-1.21 0-.568.345-1.03.965-1.306.317-.14.713-.233 1.157-.34.403-.095.646-.153.756-.183.882-.234 1.323-.524 1.463-1.03.215-.78-.016-1.6-.446-1.6-.1 0-.2.07-.257.22-.217.58-.617.9-1.127.9-.41 0-.654-.188-.86-.346l-.088-.067c-.183-.142-.284-.22-.507-.22-.107 0-.29.048-.66.146l-.3.082c-.78.21-1.117.254-1.488.194-.54-.09-1-.657-1.04-1.825-.02-.073 0-.123.213-.3.473-.392.772-.857.892-1.392.148-.665.053-1.323-.272-1.956-.327-.637-.766-1.1-1.11-1.464-.498-.523-.926-.974-1.09-1.554-.116-.416-.112-.754.02-1.05.193-.43.827-.888 1.444-1.25.543-.317.675-.484.753-.642.08-.158.078-.33.003-.493-.036-.08-.09-.128-.132-.193-.252-.392-1.082-1.19-1.55-1.488-.192-.122-.4-.197-.572-.247a9.98 9.98 0 0 0-2.835-.405z" /></svg>
                             </a>
                             <a href="https://www.trustpilot.com/review/londonsimports.com" target="_blank" rel="noopener" className="text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors" title="Trustpilot" aria-label="Trustpilot">
                                <Star className="w-5 h-5" strokeWidth={1.5} />
                             </a>
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700 italic">Trusted Sourcing</p>
                    </div>
                </div>

                {/* 2. QUICK LINKS */}
                <div className="grid md:grid-cols-12 gap-px bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-900 mb-24 font-sans">
                    {/* Column 01: Shop */}
                    <div className="bg-white dark:bg-slate-950 p-12 md:col-span-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-600 mb-8 block">Shopping Hub</span>
                        <ul className="space-y-4">
                            <li><Link href="/products" className="text-sm font-black text-slate-900 dark:text-white hover:italic hover:translate-x-1 transition-all inline-block uppercase tracking-widest">China Shop</Link></li>
                            <li><Link href="/reviews" className="text-sm font-semibold text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors block">Customer Reviews</Link></li>
                            <li><Link href="/how-it-works" className="text-sm font-semibold text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors block">How it Works</Link></li>
                            <li><Link href="/faq" className="text-sm font-semibold text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors block">Answer Hub (FAQ)</Link></li>
                            <li><Link href="/blog" className="text-sm font-black text-slate-900 dark:text-white hover:italic hover:translate-x-1 transition-all inline-block uppercase tracking-widest mt-4">Our Blog</Link></li>
                        </ul>
                    </div>

                    {/* Column 02: Support */}
                    <div className="bg-white dark:bg-slate-950 p-12 md:col-span-3 border-l border-slate-50 dark:border-slate-900">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-600 mb-8 block">Our Company</span>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-sm font-semibold text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors block">About London&apos;s Imports</Link></li>
                            <li><Link href="/contact" className="text-sm font-semibold text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors block">Contact Support</Link></li>
                            <li><Link href="/terms" className="text-sm font-semibold text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors block">Terms of Use</Link></li>
                            <li><Link href="/privacy" className="text-sm font-semibold text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors block">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 03: Logistics */}
                    <div className="bg-white dark:bg-slate-950 p-12 md:col-span-3 border-l border-slate-50 dark:border-slate-900">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-600 mb-8 block">Shipping & Delivery</span>
                        <ul className="space-y-4">
                            <li><Link href="/shipping" className="text-sm font-semibold text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors block">Shipping Services</Link></li>
                            <li><Link href="/customs" className="text-sm font-semibold text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors block">Customs Help</Link></li>
                            <li><Link href="/guide" className="text-sm font-semibold text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors block">How to Start Business</Link></li>
                            <li><Link href="/track" className="text-sm font-black text-emerald-600 dark:text-emerald-500 hover:italic hover:translate-x-1 transition-all inline-block uppercase tracking-widest mt-4">Track My Items</Link></li>
                        </ul>
                    </div>

                    {/* Column 04: Newsletter */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-12 md:col-span-3 border-l border-slate-50 dark:border-slate-900 flex flex-col justify-between">
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white mb-6 block italic">Join our Newsletter</span>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-500 leading-relaxed mb-10">
                                Subscribe to monthly supply chain briefings and high-performance logistics items.
                            </p>
                        </div>
                        <div className="flex flex-col gap-6">
                            <input
                                type="email"
                                title="Email Address"
                                placeholder="Enter your email..."
                                className="bg-transparent border-b border-slate-900 dark:border-white text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white py-3 outline-none focus:border-slate-900 dark:focus:border-white transition-colors placeholder-slate-300 dark:placeholder-slate-700"
                            />
                            <button className="group/btn relative h-12 overflow-hidden border border-slate-900 dark:border-white px-8 transition-all hover:bg-slate-900 dark:hover:bg-white self-start">
                                <span className="relative z-10 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest group-hover/btn:text-white dark:group-hover/btn:text-slate-950 transition-colors">Subscribe</span>
                                <div className="absolute inset-0 bg-slate-900 dark:bg-white transition-transform translate-y-full group-hover/btn:translate-y-0" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. OUR LOCATION & PAYMENTS */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-16 pt-16 border-t border-slate-50 dark:border-slate-900">
                    <div className="max-w-md">
                        <div className="flex items-center gap-3 mb-8">
                             <MapPin className="w-4 h-4 text-slate-900 dark:text-white" strokeWidth={1.5} />
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Our Location</span>
                        </div>
                        <address className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight not-italic">
                            {siteConfig.address}
                        </address>
                        <div className="flex gap-12 mt-10">
                             <div className="border-l border-slate-900 dark:border-white pl-6 group transition-opacity">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 block mb-2">Customer Support</span>
                                  <span className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">+{siteConfig.whatsapp}</span>
                             </div>
                             <div className="border-l border-slate-900 dark:border-white pl-6 group transition-opacity">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 block mb-2">Order Help</span>
                                  <span className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">+{siteConfig.concierge}</span>
                             </div>
                        </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-16">
                         <div className="flex items-center justify-end gap-12 group transition-opacity">
                              <div className="text-right">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 block mb-1">Accra & Kumasi Hubs</span>
                                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ghana Sourcing Expert</p>
                              </div>
                              <ShieldCheck className="w-8 h-8 text-slate-900 dark:text-white" strokeWidth={1} />
                         </div>

                         {/* Payment Ledger (High Contrast Monochrome) */}
                         <div className="flex items-center gap-8 border-t border-slate-50 dark:border-slate-900 pt-8 mt-4 grayscale group-hover:grayscale-0 transition-all duration-700">
                              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">MTN MOMO</span>
                              <div className="h-px w-8 bg-slate-900 dark:bg-white" />
                              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">VISA / MC</span>
                              <div className="h-px w-8 bg-slate-900 dark:bg-white" />
                              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">PAYSTACK</span>
                         </div>
                    </div>
                </div>

                {/* Final Legal Bar (Increased Opacity) */}
                <div className="mt-32 pt-16 border-t border-slate-50 dark:border-slate-900 flex items-center justify-between">
                     <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] selection:text-white">
                        &copy; {new Date().getFullYear()} London&apos;s Imports / All Rights Reserved.
                     </p>
                     <div className="flex items-center gap-8">
                         <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">Trusted Since 2020</span>
                         <ArrowUpRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                     </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
