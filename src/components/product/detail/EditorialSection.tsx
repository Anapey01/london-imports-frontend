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

            {/* 2. Key Highlights (Horizontal with text beneath, responsive for smaller screens) */}
            {highlights.length > 0 && (
                <div className="my-8">
                    <div className="flex overflow-x-auto gap-4 snap-x no-scrollbar pb-2 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0">
                        {highlights.slice(0, 3).map((item, idx) => (
                            <div
                                key={idx}
                                className="min-w-[190px] w-[65%] sm:w-auto flex-shrink-0 snap-start flex flex-col items-center text-center px-2"
                            >
                                {/* Lucide Icon Circular Badge at Top */}
                                <div className="w-12 h-12 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-[#006B5A] dark:text-emerald-400 mb-3 shadow-2xs">
                                    <LucideIcon name={item.icon} className="w-5 h-5" strokeWidth={1.5} />
                                </div>

                                {/* Title Beneath Icon */}
                                <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1.5 text-center">
                                    {item.title}
                                </h4>

                                {/* Descriptive Text Beneath Title */}
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center max-w-[220px]">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Core Specifications Table */}
            {specs.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 my-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#006B5A] dark:text-emerald-400 block mb-3">
                        Product Details
                    </span>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {specs.map((spec, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2.5 text-xs">
                                <span className="font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
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
