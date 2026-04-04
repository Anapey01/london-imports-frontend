'use client';

import { useRef, useLayoutEffect } from 'react';
import { resolveColor } from '@/lib/colors';

interface VariantSelectorProps {
    label: string;
    options: string[];
    selected: string;
    onSelect: (val: string) => void;
    /** 'color' | 'pill' | 'standard' */
    type?: 'color' | 'pill' | 'standard';
}

export default function VariantSelector({ 
    label, 
    options, 
    selected, 
    onSelect,
    type 
}: VariantSelectorProps) {
    const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const swatchRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

    useLayoutEffect(() => {
        options.forEach((option) => {
            const isSelected = selected === option;
            const btn = buttonRefs.current.get(option);
            if (btn) {
                btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
                btn.tabIndex = isSelected ? 0 : -1;
            }

            const swatch = swatchRefs.current.get(option);
            if (swatch) {
                const cleanedName = clean(option);
                const hex = resolveColor(cleanedName);
                swatch.style.setProperty('--variant-hex', hex);
            }
        });
    }, [selected, options]);

    if (!options || options.length === 0) return null;

    // Helper to clean accidental parentheses from user input (e.g. "( Green")
    const clean = (text: string) => text.replace(/[()]/g, '').trim();

    // Auto-infer type if not provided
    const inferredType = type || (label.toLowerCase().includes('color') ? 'color' : 'pill');

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label 
                    id={`label-${label}`}
                    className="text-[10px] font-black nuclear-text opacity-40 uppercase tracking-[0.2em]"
                >
                    {label}
                </label>
                {selected && (
                    <span className="text-[10px] font-bold nuclear-text uppercase tracking-tight">
                        {clean(selected)}
                    </span>
                )}
            </div>

            <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby={`label-${label}`}>
                {options.map((option) => {
                    const isSelected = selected === option;
                    const cleanedName = clean(option);

                    if (inferredType === 'color') {
                        const hex = resolveColor(cleanedName);
                        const isWhite = hex.toLowerCase() === '#ffffff' || hex.toLowerCase() === '#fffbf0';
                        
                        return (
                            <button
                                key={option}
                                ref={(el) => {
                                    if (el) buttonRefs.current.set(option, el);
                                    else buttonRefs.current.delete(option);
                                }}
                                role="radio"
                                aria-checked="false"
                                onClick={() => onSelect(option)}
                                title={cleanedName}
                                className={`
                                    relative w-9 h-9 rounded-full transition-all duration-300 group
                                    ${isSelected ? 'ring-2 ring-offset-2 ring-emerald-500 ring-offset-primary-surface' : 'ring-1 ring-primary-surface/60 hover:ring-white/40'}
                                `}
                            >
                                <span 
                                    ref={(el) => {
                                        if (el) swatchRefs.current.set(option, el);
                                        else swatchRefs.current.delete(option);
                                    }}
                                    className={`
                                        absolute inset-[2px] rounded-full shadow-inner border border-white/10
                                        ${isWhite ? 'bg-slate-50' : 'bg-[var(--variant-hex)]'}
                                    `}
                                />
                                {isSelected && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full scale-100 animate-in fade-in zoom-in duration-300 shadow-lg shadow-emerald-500/40" />
                                )}
                            </button>
                        );
                    }

                    // Default Architectural Pill Select
                    return (
                        <button
                            key={option}
                            ref={(el) => {
                                if (el) buttonRefs.current.set(option, el);
                                else buttonRefs.current.delete(option);
                            }}
                            role="radio"
                            aria-checked="false"
                            onClick={() => onSelect(option)}
                            className={`
                                min-w-[3.5rem] h-10 px-4 flex items-center justify-center rounded-xl text-[10px] uppercase font-black tracking-widest transition-all duration-300
                                ${isSelected 
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                    : 'bg-primary-surface/40 nuclear-text opacity-40 border border-primary-surface/40 hover:opacity-100 hover:bg-primary-surface/60 hover:border-primary-surface/60'
                                }
                            `}
                        >
                            {cleanedName}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
