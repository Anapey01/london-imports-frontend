/**
 * Server-Side Fetchers for SEO/SSG
 * Uses native fetch for Next.js caching and revalidation
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function getProducts(params: Record<string, string> = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/products/?${queryString}`;
        console.log(`[SSR] Fetching products list: ${url}`);

        const res = await fetch(url, {
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!res.ok) {
            console.error(`[SSR] Error fetching products list: ${res.status} ${res.statusText}`);
            throw new Error('Failed to fetch products');
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        return { count: 0, results: [] };
    }
}

export async function getFeaturedProducts() {
    return getProducts({ featured: 'true', limit: '10', ordering: '-created_at' });
}

export async function getRecentProducts(limit = 20) {
    return getProducts({ limit: limit.toString(), ordering: '-created_at' });
}

export async function getCategories() {
    try {
        const res = await fetch(`${API_BASE_URL}/products/categories/`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.results || data;
    } catch (e) {
        return [];
    }
}

export async function getProduct(slug: string) {
    const url = `${API_BASE_URL}/products/${slug}/`;
    try {
        console.log(`[SSR] Fetching product: ${url}`);
        const res = await fetch(url, {
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            console.error(`[SSR] Error fetching product ${slug}: ${res.status} ${res.statusText}`);
            return null;
        }

        return await res.json();
    } catch (e) {
        console.error(`[SSR] Exception fetching product ${slug}:`, e);
        return null;
    }
}
