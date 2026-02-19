/**
 * Server-Side Fetchers for SEO/SSG
 * Uses native fetch for Next.js caching and revalidation
 */

const API_BASE_URL = 'https://london-imports-api.onrender.com/api/v1';

export async function getProducts(params: Record<string, string> = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/products/?${queryString}`;


        const res = await fetch(url, {
            next: { revalidate: 86400 }, // Revalidate every 24 hours to save Vercel limits
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
    return getProducts({
        featured: 'true',
        limit: '10',
        ordering: '-created_at',
        is_vendor: 'false'
    });
}

export async function getRecentProducts(limit = 20, isVendor = false) {
    return getProducts({
        limit: limit.toString(),
        ordering: '-created_at',
        is_vendor: isVendor.toString()
    });
}

export async function getVendorMarketplaceProducts(limit = 20) {
    return getProducts({
        limit: limit.toString(),
        ordering: '-created_at',
        is_vendor: 'true'
    });
}

export async function getAvailableProducts(limit = 10) {
    return getProducts({
        status: 'READY_TO_SHIP',
        limit: limit.toString(),
        ordering: '-created_at',
        is_vendor: 'false'  // Ensure only Admin Ready-to-Ship items show on home
    });
}

export async function getCategories() {
    try {
        const res = await fetch(`${API_BASE_URL}/products/categories/`, {
            next: { revalidate: 86400 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.results || data;
    } catch {
        return [];
    }
}

export async function getProduct(slug: string) {
    const url = `${API_BASE_URL}/products/${slug}/`;
    try {

        const res = await fetch(url, {
            next: { revalidate: 86400 }
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

export async function getProductMetadata(slug: string) {
    // 1. Try fetching full product (Public or Auth handled by permissions)
    const fullProduct = await getProduct(slug);
    if (fullProduct) return fullProduct;

    // 2. Fallback: Fetch from public preview endpoint
    const url = `${API_BASE_URL}/products/preview/?slug=${slug}`;
    try {

        const res = await fetch(url, { next: { revalidate: 86400 } });
        if (!res.ok) return null;

        const data = await res.json();
        const previewItem = data.results && data.results.length > 0 ? data.results[0] : null;

        if (previewItem) {
            return {
                id: previewItem.id,
                name: previewItem.name,
                slug: previewItem.slug,
                image: previewItem.image,
                description: "Log in to see full product details, pricing, and availability.",
                is_preview: true
            };
        }
    } catch (e) {
        console.error(`[SSR] Exception fetching preview fallback for ${slug}:`, e);
    }

    return null;
}

export async function getVendor(slug: string) {
    const url = `${API_BASE_URL}/vendors/${slug}/`;
    try {

        const res = await fetch(url, { next: { revalidate: 86400 } });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error(`[SSR] Exception fetching vendor ${slug}:`, e);
        return null;
    }
}

export async function getAllVendors() {
    const url = `${API_BASE_URL}/vendors/`;
    try {

        const res = await fetch(url, { next: { revalidate: 86400 } }); // Cache for 24 hours
        if (!res.ok) return [];
        const data = await res.json();
        return data.results || data;
    } catch (e) {
        console.error("[SSR] Exception fetching all vendors:", e);
        return [];
    }
}