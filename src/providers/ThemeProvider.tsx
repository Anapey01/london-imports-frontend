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

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const timer = setTimeout(() => {
            setMounted(true);
            if (stored) {
                setThemeState(stored);
            } else if (systemPrefersDark) {
                setThemeState('dark');
            } else {
                setThemeState('light');
            }
        }, 0);

        return () => clearTimeout(timer);
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
            // Also ensure the body has it for nested selectors
            bodyWithThemeClass.classList.add('dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
            root.style.colorScheme = 'light';
            bodyWithThemeClass.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            <div className={!mounted ? 'opacity-0' : 'transition-opacity duration-300'}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}
