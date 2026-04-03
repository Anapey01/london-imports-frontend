'use client';

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
                    className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
                >
                    {label}
                </label>
                {selected && (
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">
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
                                role="radio"
                                aria-checked={isSelected ? "true" : "false"}
                                onClick={() => onSelect(option)}
                                title={cleanedName}
                                className={`
                                    relative w-9 h-9 rounded-full transition-all duration-300 group
                                    ${isSelected ? 'ring-2 ring-offset-2 ring-[#006B5A]' : 'ring-1 ring-slate-100 hover:ring-slate-300'}
                                `}
                            >
                                <span 
                                    className={`
                                        absolute inset-[2px] rounded-full shadow-inner border border-black/5
                                        ${isWhite ? 'bg-slate-50' : ''}
                                    `}
                                    style={{ backgroundColor: hex }}
                                />
                                {isSelected && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#006B5A] rounded-full scale-100 animate-in fade-in zoom-in duration-300" />
                                )}
                            </button>
                        );
                    }

                    // Default Architectural Pill Select
                    return (
                        <button
                            key={option}
                            role="radio"
                            aria-checked={isSelected ? 'true' : 'false'}
                            onClick={() => onSelect(option)}
                            className={`
                                min-w-[3.5rem] h-10 px-4 flex items-center justify-center rounded-xl text-[10px] uppercase font-black tracking-widest transition-all duration-300
                                ${isSelected 
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' 
                                    : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300 hover:bg-slate-50'
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
