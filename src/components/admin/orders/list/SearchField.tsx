'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchFieldProps {
    value: string;
    onChange: (val: string) => void;
}

// Optimized Search Component to prevent parent re-renders on every keystroke
export default function SearchField({ value, onChange }: SearchFieldProps) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            onChange(localValue);
        }, 400);
        return () => clearTimeout(handler);
    }, [localValue, onChange]);

    return (
        <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
            <input
                type="text"
                placeholder="SEARCH ORDERS..."
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-50 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-slate-900 transition-all"
            />
        </div>
    );
}
