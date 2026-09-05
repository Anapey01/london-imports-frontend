/**
 * London's Imports - Theme Provider
 * Manages dark/light mode with localStorage persistence
 */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    // Initialize theme safely with fallback
    useEffect(() => {
        setMounted(true);
        let stored: Theme | null = null;
        try {
            if (typeof window !== 'undefined') {
                stored = localStorage.getItem('theme') as Theme | null;
            }
        } catch (e) {
            console.debug('[ThemeProvider] Storage access restricted');
        }

        // If the user has explicitly chosen a theme before, respect it.
        // Otherwise, default to the system/phone preference (e.g. dark mode).
        if (stored) {
            setThemeState(stored);
        } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setThemeState('dark');
        } else {
            setThemeState('light');
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const bodyWithThemeClass = document.body;

        // Force both html/body to be purgeable
        if (theme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
            root.style.colorScheme = 'dark';
            bodyWithThemeClass.classList.add('dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
            root.style.colorScheme = 'light';
            bodyWithThemeClass.classList.remove('dark');
        }
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.debug('[ThemeProvider] Unable to persist theme');
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
