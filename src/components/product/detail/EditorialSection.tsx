import React from 'react';
import { 
    Sparkles, Zap, ShieldCheck, Volume2, Truck, Package, 
    Leaf, Activity, Smartphone, Cpu, Watch, Star, 
    Heart, Home, Sun, Cloud, Snowflake, Thermometer, 
    Timer, Lock, Eye, Wind, Waves 
} from 'lucide-react';
import { Product } from '@/types/product';

const ICON_MAP: Record<string, React.ElementType> = {
    Zap, ShieldCheck, Volume2, Truck, Package, 
    Leaf, Activity, Smartphone, Cpu, Watch, Star, 
    Heart, Home, Sun, Cloud, Snowflake, Thermometer, 
    Timer, Lock, Eye, Wind, Waves, Sparkles
};

export function EditorialSection({ data }: { data: Product['editorial_data'] }) {
    if (!data) return null;

    const LucideIcon = ({ name, ...props }: { name: string; className?: string; size?: number | string; strokeWidth?: number | string }) => {
        const Icon = ICON_MAP[name] || Sparkles;
        return <Icon {...props} />;
    };

    // 1. Safe extraction of Highlights
    const highlights = Array.isArray(data?.highlights) ? data.highlights : [];
    
    // 2. Safe extraction of Specs (Handles both Array and Object formats)
    let specs: Array<{ label: string; value: string }> = [];
    if (Array.isArray(data?.specs)) {
        specs = data.specs;
    } else if (data?.specs && typeof data.specs === 'object') {
        specs = Object.entries(data.specs).map(([label, value]) => ({
            label: String(label),
            value: String(value)
        }));
    }

    return (
        <div className="mb-12 space-y-12">
            {/* 1. Performance Narrative (The Editorial Story) */}
            {data.narrative && (
                <div className="relative py-8 border-y border-slate-100 dark:border-slate-900">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface px-6 text-[10px] font-black uppercase tracking-[0.4em] text-brand-emerald/40 italic">
                        Product Details
                    </span>
                    <p className="text-2xl lg:text-3xl font-serif font-medium text-content-primary leading-[1.3] tracking-tight text-center text-balance max-w-4xl mx-auto">
                        &ldquo;{data.narrative}&rdquo;
                    </p>
                </div>
            )}

            {/* 2. Key Highlights (Horizontal 3-Column Minimalist Row) */}
            {highlights.length > 0 && (
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 my-6">
                    {highlights.slice(0, 3).map((item, idx) => (
                        <div
                            key={idx}
                            className="group/item flex flex-col items-center text-center p-3 sm:p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 hover:border-emerald-500/20 transition-all duration-300 h-full"
                        >
                            {/* Lucide Icon Badge at Top */}
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center shadow-2xs mb-2.5 group-hover/item:scale-105 transition-transform">
                                <LucideIcon name={item.icon} className="w-4 h-4 text-[#006B5A] dark:text-emerald-400" strokeWidth={1.75} />
                            </div>

                            {/* Title Beneath Icon */}
                            <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1 line-clamp-1">
                                {item.title}
                            </h4>

                            {/* Descriptive Text Beneath Title */}
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            {/* 3. Core Specifications Card */}
            {specs.length > 0 && (
                <div className="border border-slate-200/70 dark:border-slate-800/70 rounded-2xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/30 my-6">
                    <div className="bg-slate-100/60 dark:bg-slate-800/50 px-5 py-3 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#006B5A] dark:text-emerald-400">
                            Key Specifications
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                            {specs.length} details
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white/70 dark:bg-slate-950/40">
                        {specs.map((spec, idx) => (
                            <div key={idx} className="flex items-center justify-between px-5 py-3 text-xs">
                                <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-tight text-[11px]">
                                    {spec.label}
                                </span>
                                <span className="text-slate-800 dark:text-slate-200 font-medium text-right">
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
