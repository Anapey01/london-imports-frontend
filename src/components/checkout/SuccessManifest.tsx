'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Truck, Package, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface SuccessManifestProps {
    orderNumber: string;
    method?: string;
}

const SuccessManifest = ({ orderNumber, method }: SuccessManifestProps) => {
    const nextSteps = [
        {
            id: '01',
            title: 'Items Being Collected',
            description: 'We are currently gathering your items from our international partners.',
            icon: Package
        },
        {
            id: '02',
            title: 'Preparing for Shipping',
            description: 'Our team is getting your package ready and handling all the paperwork.',
            icon: Truck
        },
        {
            id: '03',
            title: 'Delivery Update',
            description: 'You will receive a Tracking ID on WhatsApp as soon as your package is on its way.',
            icon: MessageSquare
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-diffusion-2xl border border-slate-100 dark:border-slate-800"
            >
                <div className="grid md:grid-cols-2">
                    {/* Visual Section */}
                    <div className="relative h-[300px] md:h-auto bg-slate-50 dark:bg-slate-950 overflow-hidden group">
                        <Image
                            src="/assets/success-manifest.png"
                            alt="London's Import Success"
                            fill
                            className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                        
                        <div className="absolute top-8 left-8">
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl flex items-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-950 dark:text-white">Confirmed</span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="space-y-6">
                            <div>
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-3 block">
                                    ORDER VERIFIED
                                </span>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-950 dark:text-white leading-none">
                                    Order <br /> Successfully <br /> Confirmed.
                                </h1>
                            </div>

                            <p className="text-[15px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-sm">
                                Thank you for shopping with London's Import. Your order <span className="text-slate-950 dark:text-white font-black">#{orderNumber}</span> has been securely processed. We've started preparing your items.
                            </p>

                            <div className="space-y-5 pt-4">
                                {nextSteps.map((step, index) => (
                                    <motion.div 
                                        key={step.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + (index * 0.1) }}
                                        className="flex gap-5 group"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 transition-all group-hover:bg-slate-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-950 shadow-sm">
                                            <span className="text-[11px] font-black">{step.id}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-950 dark:text-white group-hover:translate-x-1 transition-transform">
                                                {step.title}
                                            </h3>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1.5">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="pt-8 flex flex-col sm:flex-row gap-4">
                                <Link 
                                    href="/orders"
                                    className="flex-1 bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-4 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:shadow-glow-emerald/20 transition-all flex items-center justify-center gap-3"
                                >
                                    View My Orders
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                                <a 
                                    href={`https://wa.me/${siteConfig.concierge}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 py-4 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all flex items-center justify-center gap-3"
                                >
                                    Chat with Support
                                    <MessageSquare className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Footer Institutional Info */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-12 flex flex-col items-center gap-6 opacity-30 px-4 text-center"
            >
                <div className="flex items-center gap-6 grayscale">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] nuclear-text">Zero Data Retention</span>
                    <div className="w-1 h-1 bg-slate-500 rounded-full" />
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] nuclear-text">Logistics Protocol Alpha v4</span>
                </div>
                <p className="text-[7px] uppercase tracking-[0.3em] font-medium leading-relaxed max-w-md">
                    Electronic manifest authorized system. Order verification signature: LTRX-{orderNumber}-{Date.now()}
                </p>
            </motion.div>
        </div>
    );
};

export default SuccessManifest;
