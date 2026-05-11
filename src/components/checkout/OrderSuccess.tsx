'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Truck, Package, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ordersAPI } from '@/lib/api';
import OrderRecommendations from './OrderRecommendations';

interface OrderSuccessProps {
    orderNumber: string;
    method?: string;
}

interface OrderItem {
    id: string;
    product_name: string;
    product?: {
        image?: string;
        primary_image?: string;
    };
}

interface Order {
    items: OrderItem[];
    amount_paid: string | number;
    balance_due: string | number;
}

const BACKDROPS = [
    { id: 'noir', path: '/assets/success/noir.png', theme: 'dark' },
    { id: 'white', path: '/assets/success/white.png', theme: 'light' },
    { id: 'center', path: '/assets/success/hub.png', theme: 'tech' }
];

const OrderSuccess = ({ orderNumber, method }: OrderSuccessProps) => {
    const [orderData, setOrderData] = useState<Order | null>(null);
    
    // Select a random backdrop on mount
    const backdrop = useMemo(() => {
        return BACKDROPS[Math.floor(Math.random() * BACKDROPS.length)];
    }, []);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await ordersAPI.detail(orderNumber);
                setOrderData(response.data);
            } catch (err) {
                console.error("Failed to fetch order details for success view:", err);
            }
        };

        if (orderNumber) fetchOrder();
    }, [orderNumber]);

    const firstItem = orderData?.items?.[0];
    const productCount = orderData?.items?.length || 0;

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-diffusion-2xl border border-slate-100 dark:border-slate-800"
            >
                <div className="grid lg:grid-cols-2">
                    {/* Visual Section: Dynamic Product Display */}
                    <div className="relative h-[400px] lg:h-auto bg-slate-100 dark:bg-slate-950 overflow-hidden group">
                        {/* Selected Premium Backdrop */}
                        <Image
                            src={backdrop.path}
                            alt="London's Imports Premium Background"
                            fill
                            className="object-cover transition-transform duration-[5000ms] ease-out scale-110 group-hover:scale-100"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                        
                        {/* Dynamic Product Image Overlay */}
                        <AnimatePresence mode="wait">
                            {firstItem && (
                                <motion.div 
                                    key={firstItem.id}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                                    className="absolute inset-0 flex items-center justify-center p-12"
                                >
                                    <div className="relative w-full aspect-square max-w-[280px]">
                                        {/* Premium Frame/Shadow for the product */}
                                        <div className="absolute inset-4 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl rotate-3" />
                                        <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl shadow-diffusion-2xl overflow-hidden -rotate-2 border border-white/50 dark:border-slate-700">
                                            <Image 
                                                src={firstItem.product?.primary_image || firstItem.product?.image || '/placeholder.jpg'}
                                                alt={firstItem.product_name}
                                                fill
                                                className="object-cover"
                                            />
                                            {productCount > 1 && (
                                                <div className="absolute bottom-4 right-4 bg-slate-950/90 text-white text-[9px] font-black px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 uppercase tracking-widest">
                                                    +{productCount - 1} More
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Order Signature Overlay */}
                        <div className="absolute bottom-8 left-8 right-8">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                transition={{ delay: 1.5 }}
                                className="flex justify-between items-end border-t border-white/30 pt-4"
                            >
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Your Order</span>
                                    <p className="text-[10px] font-mono text-white/90">#{orderNumber}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Confirmation Date</span>
                                    <p className="text-[10px] font-mono text-white/90">{new Date().toLocaleDateString('en-GB')}</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Section: Warm & Premium */}
                    <div className="p-8 md:p-16 flex flex-col justify-center">
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
                                        Congratulations!
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-950 dark:text-white leading-[1.1]">
                                    {method === 'whatsapp' ? 'Order reserved.' : 'Your order is confirmed.'}
                                </h1>
                            </motion.div>

                            <div className="space-y-4">
                                <p className="text-[16px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-md">
                                    {method === 'whatsapp' 
                                        ? "We've reserved your items. To finalize your order, please follow the Mobile Money instructions below to complete your payment."
                                        : "We've received your payment and started the process of getting your items ready for shipment from our global partners."}
                                </p>

                                {method === 'whatsapp' && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-brand-emerald/5 border border-brand-emerald/20 rounded-2xl p-6 space-y-3"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-emerald">Mobile Money Payment</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Momo Number:</span>
                                                <span className="font-bold text-slate-900">{siteConfig.momoNumber || '055 812 3456'}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Name:</span>
                                                <span className="font-bold text-slate-900">{siteConfig.momoName || "London's Imports"}</span>
                                            </div>
                                            <div className="flex justify-between text-xs pt-2 border-t border-brand-emerald/10">
                                                <span className="text-slate-500">Reference:</span>
                                                <span className="font-bold text-brand-emerald">{orderNumber}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {orderData && (
                                    <div className="flex gap-8 py-4 border-y border-slate-100 dark:border-slate-800">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Amount Paid</p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">GHS {orderData.amount_paid}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Balance Due</p>
                                            <p className="text-sm font-black text-brand-emerald">GHS {orderData.balance_due}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-8 pt-4">
                                {[
                                    { 
                                        id: '01', 
                                        title: 'Processing Order', 
                                        desc: 'We are securing your items with our international partners.',
                                        icon: Package
                                    },
                                    { 
                                        id: '02', 
                                        title: 'Quality Check', 
                                        desc: 'Each item is inspected before being packed for safe transit.',
                                        icon: ShieldCheck
                                    },
                                    { 
                                        id: '03', 
                                        title: 'Ready to Ship', 
                                        desc: 'You will receive delivery updates on WhatsApp very soon.',
                                        icon: Truck
                                    }
                                ].map((step, idx) => (
                                    <motion.div 
                                        key={step.id}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + (idx * 0.1) }}
                                        className="flex gap-6 group"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 transition-all group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 shadow-sm">
                                            <step.icon className="w-5 h-5" strokeWidth={1.5} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-950 dark:text-white group-hover:translate-x-1 transition-transform">
                                                {step.title}
                                            </h3>
                                            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-2">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="pt-10 flex flex-col sm:flex-row gap-4">
                                <Link 
                                    href="/orders"
                                    className="flex-1 bg-slate-950 dark:bg-white text-white dark:text-slate-950 h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl"
                                >
                                    View My Orders
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                                <a 
                                    href={`https://wa.me/${siteConfig.concierge}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-white dark:bg-slate-800 text-slate-950 dark:text-white h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3"
                                >
                                    WhatsApp Support
                                    <MessageSquare className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Discovery Sections */}
            <OrderRecommendations />

            {/* Footer */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-20 flex flex-col items-center gap-6 opacity-30 px-4 text-center"
            >
                <div className="flex items-center gap-6 grayscale">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em]">Thank You</span>
                    <div className="w-1 h-1 bg-slate-500 rounded-full" />
                    <span className="text-[8px] font-black uppercase tracking-[0.4em]">Success</span>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
