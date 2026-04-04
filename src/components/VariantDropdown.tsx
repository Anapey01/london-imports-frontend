'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface VariantDropdownProps {
    label: string;
    options: string[];
    selected: string;
    onSelect: (val: string) => void;
}

export default function VariantDropdown({ label, options, selected, onSelect }: VariantDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const optionsRef = useRef<Map<string, HTMLLIElement>>(new Map());

    // Helper to clean accidental parentheses from user input (e.g. "( Green")
    const clean = (text: string) => text.replace(/[()]/g, '').trim();

    useLayoutEffect(() => {
        if (triggerRef.current) {
            triggerRef.current.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
    }, [isOpen]);

    useLayoutEffect(() => {
        optionsRef.current.forEach((el, option) => {
            if (el) {
                el.setAttribute('aria-selected', selected === option ? 'true' : 'false');
            }
        });
    }, [selected, isOpen]);

    return (
        <div className="relative w-full sm:max-w-xs">
            <label
                id={`label-${label}`}
                className="block text-[8px] font-black nuclear-text opacity-40 uppercase tracking-[0.3em] mb-3"
            >
                {label}
            </label>
            <div className="relative">
                <button
                    ref={triggerRef}
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-haspopup="listbox"
                    aria-labelledby={`label-${label}`}
                    className="w-full h-11 bg-primary-surface/40 border border-primary-surface/40 rounded-lg px-4 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all hover:border-primary-surface/60 backdrop-blur-xl"
                >
                    <span className={`text-[11px] uppercase tracking-wider truncate ${selected ? 'nuclear-text font-black' : 'nuclear-text opacity-40'}`}>
                        {selected ? clean(selected) : `Select ${label}`}
                    </span>
                    <ChevronDown className={`w-4 h-4 nuclear-text opacity-40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <ul
                            role="listbox"
                            aria-labelledby={`label-${label}`}
                            className="absolute z-20 mt-2 w-full bg-primary-surface max-h-60 rounded-lg py-1 text-base ring-1 ring-white/10 overflow-auto focus:outline-none sm:text-sm animate-in fade-in zoom-in-95 duration-100 border border-primary-surface shadow-diffusion-xl"
                        >
                             {options.map((option) => (
                                 <li
                                     key={option}
                                     ref={(el) => {
                                         if (el) optionsRef.current.set(option, el);
                                         else optionsRef.current.delete(option);
                                     }}
                                     role="option"
                                     onClick={() => {
                                         onSelect(option);
                                         setIsOpen(false);
                                     }}
                                     className={`w-full text-left cursor-pointer px-4 py-3 hover:bg-white/5 transition-all border-b border-primary-surface/20 last:border-0 text-[10px] uppercase tracking-widest
                                     ${selected === option ? 'bg-emerald-500 text-white font-black' : 'nuclear-text opacity-60'}
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
