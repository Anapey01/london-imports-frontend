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

            {/* 2. Key Highlights (The Feature Gallery) */}
            {highlights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
                    {highlights.map((item, idx) => (
                        <div key={idx} className="group/item flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-surface border border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center shadow-sm group-hover/item:border-brand-emerald/30 transition-all duration-500">
                                <LucideIcon name={item.icon} className="w-6 h-6 text-brand-emerald" strokeWidth={1} />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black text-content-primary uppercase tracking-[0.3em]">
                                    {item.title}
                                </h4>
                                <p className="text-[13px] text-content-secondary leading-relaxed max-w-[240px] mx-auto opacity-80">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* 3. Core Specifications Table */}
            {specs.length > 0 && (
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-surface shadow-sm">
                    <div className="bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-emerald">
                            Product Details
                        </span>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-900">
                        {specs.map((spec, idx) => (
                            <div key={idx} className="flex px-6 py-4 text-[13px]">
                                <span className="font-bold text-content-secondary w-2/5 md:w-1/3 uppercase tracking-tighter">
                                    {spec.label}
                                </span>
                                <span className="text-content-primary font-medium">
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
