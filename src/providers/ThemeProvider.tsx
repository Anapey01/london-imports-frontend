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

    // Initialize theme from localStorage or default to light
    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null;

        const timer = setTimeout(() => {
            setMounted(true);
            if (stored) {
                setThemeState(stored);
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
        // Set both class and data attribute for maximum compatibility
        if (theme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
            root.style.colorScheme = 'light';
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
