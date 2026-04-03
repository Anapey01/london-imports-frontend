/**
 * London Green Design System - Smart Color Mapping
 * Translates product color names into premium hex tokens for architectural swatches.
 */

export const COLOR_MAP: Record<string, string> = {
    // Core Brand / Editorial
    'London Green': '#006B5A',
    'Forest Green': '#014439',
    'Emerald': '#10b981',
    'Sage': '#94a3b8',

    // High-End Neutrals
    'Black': '#000000',
    'Onyx': '#1A1A1A',
    'Graphite': '#333333',
    'White': '#FFFFFF',
    'Snow': '#F8FAFC',
    'Ivory': '#FFFBF0',
    'Cream': '#F5F5DC',
    'Sand': '#E2E8F0',
    'Beige': '#F5F5DC',

    // Editorial Tones
    'Navy': '#1e1b4b',
    'Royal Blue': '#1d4ed8',
    'Charcoal': '#374151',
    'Silver': '#cbd5e1',
    'Gold': '#fbbf24',
    'Rose Gold': '#fda4af',
    'Copper': '#b45309',

    // Material Fallbacks
    'Wood': '#78350f',
    'Leather': '#451a03',
    'Denim': '#1e3a8a'
};

/**
 * Resolves a color name to a hex code or a premium fallback.
 */
export function resolveColor(name: string): string {
    const cleanName = name.replace(/[()]/g, '').trim();
    
    // Check direct map
    if (COLOR_MAP[cleanName]) return COLOR_MAP[cleanName];

    // Check case-insensitive
    const lowerName = cleanName.toLowerCase();
    for (const [key, value] of Object.entries(COLOR_MAP)) {
        if (key.toLowerCase() === lowerName) return value;
    }

    // High-fidelity fallback for unmapped colors (Soft Slate)
    return '#CBD5E1';
}
