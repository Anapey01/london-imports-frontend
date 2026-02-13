// Custom hook for safe localStorage access
function useRecentlyViewed() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // This effect runs only on the client
        try {
            const stored = localStorage.getItem('recently_viewed');
            if (stored) {
                setProducts(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load recently viewed", e);
        }
    }, []);

    return products;
}

export default function RecentlyViewed() {
    const products = useRecentlyViewed();

    if (products.length === 0) return null;

    return (
        <section className="py-12 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                        Recently Viewed
                    </h2>
                    {/* Clear history button could go here */}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {products.slice(0, 5).map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
