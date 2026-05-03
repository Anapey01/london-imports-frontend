import { siteConfig } from '@/config/site';

const API_BASE_URL = siteConfig.apiUrl;

/**
 * Robust fetch with timeout and retry logic for Render's Cold Starts
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2) {
    const timeout = 60000; // 60 seconds timeout (to handle Render.com cold starts)
    
    for (let i = 0; i <= retries; i++) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(id);
            
            if (response.ok) return response;
            
            // If it's a 5xx error, it might be a transient deployment issue, so retry
            if (response.status >= 500 && i < retries) {
                console.warn(`[SSR] Retry ${i + 1} for ${url} (Status: ${response.status})`);
                await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); // Exponential backoff
                continue;
            }
            
            return response;
        } catch (err: any) {
            clearTimeout(id);
            if (err.name === 'AbortError') {
                console.error(`[SSR] Fetch timeout for ${url}`);
            } else {
                console.error(`[SSR] Fetch error for ${url}:`, err.message);
            }
            
            if (i < retries) {
                console.warn(`[SSR] Retrying ${url}... (${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, 3000));
                continue;
            }
            throw err;
        }
    }
    throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

export async function getProducts(params: Record<string, string> = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/products/?${queryString}`;

        const res = await fetchWithRetry(url, {
            next: { revalidate: 60 }, // Enabled for static generation, but kept short for freshness
        });

        const data = await res.json();
        
        // Final Gatekeeper: Archive Exclusion Filter
        if (process.env.NODE_ENV === 'production' && data.results) {
            const originalCount = data.results.length;
            data.results = data.results.filter((product: any) => {
                const name = (product.name || '').toLowerCase();
                const hasImage = !!product.image;
                const isTestProduct = name === 'shoe' || name === 'test';
                
                // Exclude if it's a known placeholder name OR has no image in production
                return !isTestProduct && hasImage;
            });
            
            if (data.results.length !== originalCount) {
                console.log(`[SSR] Archive Filter: Purged ${originalCount - data.results.length} test artifacts from the production feed.`);
            }
        }

        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return { count: 0, results: [] };
    }
}

export async function getFeaturedProducts() {
    return getProducts({
        featured: 'true',
        limit: '10',
        ordering: '-created_at'
    });
}

export async function getRecentProducts(limit = 20) {
    return getProducts({
        limit: limit.toString(),
        ordering: '-created_at'
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
        ordering: '-created_at'
    });
}

export async function getCategories() {
    try {
        const res = await fetchWithRetry(`${API_BASE_URL}/products/categories/`, {
            next: { revalidate: 86400 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.results || data;
    } catch {
        return [];
    }
}

export async function getCategory(slug: string) {
    try {
        const res = await fetchWithRetry(`${API_BASE_URL}/products/categories/`, {
            next: { revalidate: 86400 }
        });
        if (!res.ok) return null;
        const data = await res.json();
        const categories = data.results || data;
        return categories.find((cat: { slug: string }) => cat.slug === slug) || null;
    } catch {
        return null;
    }
}

export async function getProduct(slug: string) {
    const url = `${API_BASE_URL}/products/${slug}/`;
    try {
        const res = await fetchWithRetry(url, {
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
    const fullProduct = await getProduct(slug);
    if (fullProduct) return fullProduct;

    const url = `${API_BASE_URL}/products/preview/?slug=${slug}`;
    try {
        const res = await fetchWithRetry(url, { next: { revalidate: 86400 } });
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
        const res = await fetchWithRetry(url, { next: { revalidate: 86400 } });
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
        const res = await fetchWithRetry(url, { next: { revalidate: 86400 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.results || data;
    } catch (e) {
        console.error("[SSR] Exception fetching all vendors:", e);
        return [];
    }
}

export async function getHeroBanners() {
    const url = `${API_BASE_URL}/products/banners/`;
    try {
        const res = await fetchWithRetry(url, {
            next: { revalidate: 86400 } // Cache for 24 hours, but revalidates
        });

        if (!res.ok) {
            console.error(`[SSR] Error fetching banners: ${res.status}`);
            return [];
        }

        const data = await res.json();
        return data.results || data || [];
    } catch (e) {
        console.error("[SSR] Exception fetching banners:", e);
        return [];
    }
}