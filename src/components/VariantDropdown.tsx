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

    const isExpanded = isOpen ? 'true' : 'false';

    return (
        <div className="relative w-full sm:max-w-xs">
            <label
                id={`label-${label}`}
                className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2"
            >
                {label}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={isExpanded}

                    aria-labelledby={`label-${label}`}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all hover:border-gray-300 shadow-sm"
                >
                    <span className={`block truncate ${selected ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                        {selected ? clean(selected) : `Select ${label}`}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <ul
                            role="listbox"
                            aria-labelledby={`label-${label}`}
                            className="absolute z-20 mt-2 w-full bg-white shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm animate-in fade-in zoom-in-95 duration-100 border border-gray-100"
                        >
                            {options.map((option) => {
                                const isSelected = selected === option ? 'true' : 'false';
                                return (
                                    <li
                                        key={option}
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => {
                                            onSelect(option);
                                            setIsOpen(false);
                                        }}

                                        className={`w-full text-left cursor-pointer px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0
                                        ${selected === option ? 'bg-pink-50 text-pink-700 font-semibold' : 'text-gray-700'}
                                    `}
                                    >
                                        {clean(option)}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}
