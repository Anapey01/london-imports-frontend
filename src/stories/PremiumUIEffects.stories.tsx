import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Zap, Scan, Home, User, Search, Package } from 'lucide-react';

/**
 * 💎 Elite UI Effects: Glassmorphism & Haptics
 * Demonstrating the premium "London's Imports" design language.
 */
const meta = {
    title: 'Design System/Elite UI Effects',
    component: () => null,
};

export default meta;

export const GlassAndHapticsMockup = () => {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 space-y-20 font-sans">
            {/* Context Header */}
            <div className="text-center space-y-2">
                <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em]">Design Language V2</span>
                <h1 className="text-4xl font-black text-white">The <span className="text-pink-600 italic">Elite</span> Standard</h1>
                <p className="text-slate-400 text-sm max-w-sm mx-auto italic">
                    Transforming standard components into high-end, tactile experiences.
                </p>
            </div>

            {/* 1. Glassmorphism Demo (Bottom Nav) */}
            <div className="w-full max-w-sm space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-white font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
                        01. Glassmorphic Nav
                    </h2>
                    <span className="text-[10px] text-slate-500 font-bold uppercase italic tracking-tighter">iOS Style</span>
                </div>

                <div className="relative h-48 bg-gradient-to-tr from-pink-500/20 via-slate-800 to-violet-500/20 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col justify-end p-4 shadow-2xl">
                    {/* Background Decorative Shapes */}
                    <div className="absolute top-4 left-4 w-12 h-12 bg-pink-500/20 rounded-full blur-xl" />
                    <div className="absolute bottom-16 right-8 w-16 h-16 bg-violet-600/20 rounded-full blur-xl animate-bounce" />

                    <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 text-4xl font-black whitespace-nowrap">PREMIUM CONTENT</p>

                    {/* The Glass Bar */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-2 px-4 shadow-xl flex justify-around items-center relative z-10">
                        {[
                            { icon: Home, active: true },
                            { icon: Search, active: false },
                            { icon: ShoppingBag, active: false },
                            { icon: User, active: false },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1.5 py-1">
                                <item.icon className={`w-5 h-5 ${item.active ? 'text-pink-500 stroke-[2.5]' : 'text-white/40'}`} />
                                {item.active && <motion.div layoutId="activeDot" className="w-1 h-1 bg-pink-500 rounded-full" />}
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-[10px] text-slate-500 text-center italic">
                    &quot;Softens the UI by layering over content instead of blocking it.&quot;
                </p>
            </div>

            {/* 2. Haptic Conversion Demo */}
            <div className="w-full max-w-sm space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-white font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                        02. Haptic Conversion
                    </h2>
                    <span className="text-[10px] text-slate-500 font-bold uppercase italic tracking-tighter">Tactile Feedback</span>
                </div>

                <div className="bg-slate-800/40 p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center gap-8 shadow-inner">
                    <div className="text-center space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action Simulation</span>
                        <p className="text-white text-xs font-medium italic opacity-60">Tap the button to feel the responsive &quot;click&quot;</p>
                    </div>

                    {/* Haptic Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{
                            scale: 0.95,
                            transition: { type: "spring", stiffness: 400, damping: 10 }
                        }}
                        className="w-full max-w-[200px] bg-rose-600 text-white py-4 rounded-2xl font-black text-xs tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(225,29,72,0.4)] flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

                        BUY NOW
                        <Package size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </motion.button>

                    <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1 opacity-40">
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                                <Scan size={18} className="text-white" />
                            </div>
                            <span className="text-[8px] text-white">Sourcing</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shadow-lg shadow-pink-500/10">
                                <Zap size={20} className="text-pink-500" />
                            </div>
                            <span className="text-[8px] text-pink-500 font-black">FAST SHIP</span>
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-slate-500 text-center italic">
                    &quot;Increases conversion by making every tap feel deliberate and satisfying.&quot;
                </p>
            </div>

            {/* Integration Plan Callout */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-xs">
                <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-3 border-b border-white/10 pb-2">Aesthetic Specs</h4>
                <ul className="space-y-2 text-[10px] text-slate-400 font-medium">
                    <li className="flex items-start gap-2">
                        <span className="text-pink-500">→</span>
                        Blur: 12px High-Precision
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-pink-500">→</span>
                        Spring: Stiffness 400 / Damping 10
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-pink-500">→</span>
                        Opacity: 15-25% dynamic alpha
                    </li>
                </ul>
            </div>
        </div>
    );
};
