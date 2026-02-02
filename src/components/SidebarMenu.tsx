import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import ThemeToggle from './ThemeToggle';
import {
    X,
    ChevronRight,
    HelpCircle,
    ShoppingBag,
    Star,
    Heart,
    User,
    Package,
    Phone,
    Info,
    FileText,
    MapPin,
    LogOut,
    LogIn,
    Truck,
    Flame,
    Store,
    LayoutDashboard
} from 'lucide-react';
import { useParams } from 'next/navigation';

interface SidebarMenuProps {
    isOpen: boolean;
    onClose: () => void;
    vendorBrand?: { logo: string; name: string; slug: string } | null;
}

export default function SidebarMenu({ isOpen, onClose, vendorBrand }: SidebarMenuProps) {
    const { user, isAuthenticated, logout } = useAuthStore();
    const [categoriesOpen, setCategoriesOpen] = useState(true);
    const params = useParams();

    // Fetch categories dynamically
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => productsAPI.categories(),
    });

    const categories = categoriesData?.data?.results || (Array.isArray(categoriesData?.data) ? categoriesData.data : []);

    const handleLogout = () => {
        logout();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Drawer */}
            <div
                className="relative w-80 bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-slide-in-left"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        {vendorBrand ? (
                            <>
                                {vendorBrand.logo ? (
                                    <Image src={vendorBrand.logo} alt={vendorBrand.name} width={36} height={36} className="rounded-md object-contain w-9 h-9" />
                                ) : (
                                    <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center text-store-primary font-bold shrink-0">
                                        {vendorBrand.name.charAt(0)}
                                    </div>
                                )}
                                <span className="font-bold text-lg text-gray-800 line-clamp-1">{vendorBrand.name}</span>
                            </>
                        ) : (
                            <>
                                <Image src="/logo.jpg" alt="Logo" width={36} height={36} className="rounded-md" />
                                <span className="font-bold text-lg text-gray-800">Menu</span>
                            </>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-store-primary rounded-full transition-colors focus:outline-none"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto pb-20">

                    {/* SECTION: Vendor Home (If Vendor) */}
                    {vendorBrand && (
                        <div className="py-2 px-4">
                            <Link
                                href={`/store/${vendorBrand.slug}`}
                                onClick={onClose}
                                className="flex items-center gap-4 px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-store-primary transition-all group"
                            >
                                <Store className="w-5 h-5 text-store-primary" />
                                <span className="font-semibold text-gray-900 flex-1">Store Home</span>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-store-primary" />
                            </Link>
                        </div>
                    )}

                    {/* SECTION: Promoted (Platform Only) */}
                    {!vendorBrand && (
                        <div className="py-2 px-4">
                            <a
                                href="https://londonsimports.com/products?status=READY_TO_SHIP"
                                onClick={onClose}
                                className="flex items-center gap-4 px-4 py-3 bg-pink-50/50 rounded-xl border border-pink-100 hover:border-pink-200 transition-all group"
                            >
                                <Flame className="w-5 h-5 text-pink-500" />
                                <span className="font-semibold text-gray-900 flex-1">Ready to Ship</span>
                                <ChevronRight className="w-4 h-4 text-pink-300 group-hover:text-pink-500" />
                            </a>
                        </div>
                    )}

                    {/* SECTION: Shop */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <div className="px-6 pb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shop</span>
                        </div>

                        {/* Categories Accordion */}
                        <div className="px-2">
                            <button
                                onClick={() => setCategoriesOpen(!categoriesOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <ShoppingBag className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-700 font-medium">{vendorBrand ? "More Categories" : "Categories"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-store-primary">
                                        {categoriesOpen ? 'Hide' : 'See All'}
                                    </span>
                                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${categoriesOpen ? 'rotate-90' : ''}`} />
                                </div>
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${categoriesOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pl-4 pr-2 pb-2 mt-1 space-y-1 border-l-2 border-gray-100 ml-6">
                                    <Link
                                        href="/products"
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-pink-600 font-medium hover:bg-pink-50"
                                    >
                                        View All Marketplace
                                    </Link>
                                    {categories.slice(0, 8).map((category: { id: string; slug: string; name: string }) => (
                                        <Link
                                            key={category.id}
                                            href={`/products?category=${category.slug}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {!vendorBrand && (
                            <Link
                                href="/sell"
                                onClick={onClose}
                                className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                            >
                                <Package className="w-5 h-5 text-gray-500" />
                                <span>Sell on London&apos;s Imports</span>
                            </Link>
                        )}
                    </div>

                    {/* SECTION: Account (Always Show) */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <div className="px-6 pb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</span>
                        </div>

                        {isAuthenticated ? (
                            <>
                                <Link href="/profile" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                                    <User className="w-5 h-5 text-gray-500" />
                                    <span>My Profile</span>
                                </Link>
                                <Link href="/orders" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                                    <Package className="w-5 h-5 text-gray-500" />
                                    <span>My Orders</span>
                                </Link>
                                <Link href="/wishlist" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                                    <Heart className="w-5 h-5 text-gray-500" />
                                    <span>Wishlist</span>
                                </Link>
                                {user?.role === 'VENDOR' && (
                                    <Link href="/dashboard/vendor/orders" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-pink-50 text-pink-600 font-medium transition-colors">
                                        <LayoutDashboard className="w-5 h-5 text-pink-500" />
                                        <span>Vendor Dashboard</span>
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-3 hover:bg-red-50 text-red-600 font-medium transition-colors text-left">
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={vendorBrand ? `/login?vendor=${params?.slug}&redirect=/store/${params?.slug}` : "/login"}
                                    onClick={onClose}
                                    className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                                >
                                    <LogIn className="w-5 h-5 text-gray-500" />
                                    <span>Sign In</span>
                                </Link>
                                <Link
                                    href={vendorBrand ? `/register?vendor=${params?.slug}&redirect=/store/${params?.slug}` : "/register"}
                                    onClick={onClose}
                                    className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                                >
                                    <User className="w-5 h-5 text-gray-500" />
                                    <span>Create Account</span>
                                </Link>
                            </>
                        )}
                        <div className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                            <span className="w-5 h-5 flex items-center justify-center"><ThemeToggle /></span>
                            <span>Theme</span>
                        </div>
                    </div>

                    {/* SECTION: Support - Customized for Vendor */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <div className="px-6 pb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Support</span>
                        </div>

                        {!vendorBrand && (
                            <>
                                <Link href="/how-it-works" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                                    <HelpCircle className="w-5 h-5 text-gray-500" />
                                    <span>How It Works</span>
                                </Link>
                                <Link href="/delivery-returns" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                                    <Truck className="w-5 h-5 text-gray-500" />
                                    <span>Delivery & Returns</span>
                                </Link>
                            </>
                        )}

                        <Link href="/track" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <span>Track Order</span>
                        </Link>
                        {!vendorBrand && (
                            <Link href="/faq" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <span>Help Center & FAQ</span>
                            </Link>
                        )}
                        {!vendorBrand && (
                            <Link href="/about" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                                <Info className="w-5 h-5 text-gray-500" />
                                <span>About Us</span>
                            </Link>
                        )}

                        {/* Contact Customization */}
                        {vendorBrand ? (
                            <a href="#" className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                                <Phone className="w-5 h-5 text-gray-500" />
                                <span>Contact Vendor</span>
                            </a>
                        ) : (
                            <a href="https://wa.me/233545247009" target="_blank" rel="noopener noreferrer" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                                <Phone className="w-5 h-5 text-gray-500" />
                                <span>Contact Support</span>
                            </a>
                        )}

                        <Link href="/reviews" onClick={onClose} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                            <Star className="w-5 h-5 text-gray-600" />
                            <span>Reviews</span>
                        </Link>
                    </div>

                    {/* Socials & Trustpilot (Hide on Vendor Store?) */}
                    {!vendorBrand && (
                        <div className="mt-8 px-6 pb-12">
                            <div className="flex items-center gap-4 mb-8">
                                {/* Trustpilot Mini */}
                                <a href="https://trustpilot.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-500 hover:text-green-600 transition-colors">
                                    <div className="w-5 h-5 bg-[#00b67a] rounded-full flex items-center justify-center text-white"><Star className="w-3 h-3 fill-current" /></div>
                                    <span className="font-medium">Trustpilot Reviews</span>
                                </a>
                            </div>

                            <div className="flex gap-4">
                                <a href="https://instagram.com" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-pink-500 hover:text-white transition-all"><span className="sr-only">IG</span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-in-left {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
