'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface VariantDropdownProps {
    label: string;
    options: string[];
    selected: string;
    onSelect: (val: string) => void;
}

export default function VariantDropdown({ label, options, selected, onSelect }: VariantDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    // Helper to clean accidental parentheses from user input (e.g. "( Green")
    const clean = (text: string) => text.replace(/[()]/g, '').trim();

    return (
        <div className="relative w-full sm:max-w-xs">
            <label
                id={`label-${label}`}
                className="block text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-3"
            >
                {label}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen ? 'true' : 'false'}

                    aria-labelledby={`label-${label}`}
                    className="w-full h-11 bg-white border border-slate-100 rounded-lg px-4 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all hover:border-slate-200"
                >
                    <span className={`text-[11px] uppercase tracking-wider truncate ${selected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                        {selected ? clean(selected) : `Select ${label}`}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <ul
                            role="listbox"
                            aria-labelledby={`label-${label}`}
                            className="absolute z-20 mt-2 w-full bg-white max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm animate-in fade-in zoom-in-95 duration-100 border border-slate-100 shadow-diffusion"
                        >
                            {options.map((option) => (
                                <li
                                    key={option}
                                    role="option"
                                    aria-selected={selected === option ? 'true' : 'false'}
                                    onClick={() => {
                                        onSelect(option);
                                        setIsOpen(false);
                                    }}

                                    className={`w-full text-left cursor-pointer px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-[10px] uppercase tracking-widest
                                    ${selected === option ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-600'}
                                `}
                                >
                                    {clean(option)}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}
