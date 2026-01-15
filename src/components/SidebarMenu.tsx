/**
 * SidebarMenu.tsx
 * Desktop Sidebar Drawer for Navigation
 */
'use client';

import { X, Flame, Truck, Info, HelpCircle, Store } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';

interface SidebarMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
    // Fetch categories dynamically
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => productsAPI.categories(),
    });

    const categories = categoriesData?.data?.results || (Array.isArray(categoriesData?.data) ? categoriesData.data : []);

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
                className="relative w-80 bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animation-slide-in-left"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                {/* Header */}
                <div className="p-5 border-b flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-3">
                        <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-md" />
                        <span className="font-bold text-lg text-gray-800">Menu</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="flex flex-col gap-2">
                        <MenuItem
                            href="/products?status=READY_TO_SHIP"
                            icon={<Flame className="w-5 h-5 text-orange-500" />}
                            label="Available Items"
                            description="Instant purchase available"
                            onClick={onClose}
                        />
                        <MenuItem
                            href="/market"
                            icon={<Store className="w-5 h-5 text-purple-600" />}
                            label="Vendor Marketplace"
                            description="Shop local sellers"
                            onClick={onClose}
                        />
                        <MenuItem
                            href="/delivery-returns"
                            icon={<Truck className="w-5 h-5" />}
                            label="Delivery & Returns"
                            description="Shipping info & policies"
                            onClick={onClose}
                        />
                        <MenuItem
                            href="/how-it-works"
                            icon={<HelpCircle className="w-5 h-5" />}
                            label="How It Works"
                            description="Understand our process"
                            onClick={onClose}
                        />
                        <MenuItem
                            href="/about"
                            icon={<Info className="w-5 h-5" />}
                            label="About Us"
                            description="Our story & mission"
                            onClick={onClose}
                        />
                    </nav>

                    {/* Categories Section */}
                    <div className="mt-6 mb-4">
                        <h4 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</h4>
                        <nav className="flex flex-col gap-1">
                            {categories.map((category: any) => (
                                <Link
                                    key={category.id}
                                    href={`/products?category=${category.slug}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pink-600 rounded-lg transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-pink-500"></span>
                                    {category.name}
                                </Link>
                            ))}
                            {categories.length === 0 && (
                                <div className="px-4 py-2 text-sm text-gray-400 italic">No categories found</div>
                            )}
                        </nav>
                    </div>

                    {/* Footer / Extra Info */}
                    <div className="mt-auto p-4 bg-pink-50 rounded-xl">
                        <h4 className="font-bold text-pink-700 mb-1">Need Help?</h4>
                        <p className="text-sm text-pink-600 mb-3">Contact our support team anytime.</p>
                        <Link href="/contact" onClick={onClose} className="text-xs font-bold uppercase tracking-wide text-pink-800 hover:underline">
                            Contact Support →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MenuItem({ href, icon, label, description, onClick }: any) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-all group"
        >
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-pink-600 group-hover:border-pink-200 transition-colors shadow-sm">
                {icon}
            </div>
            <div>
                <span className="block font-bold text-gray-800 group-hover:text-pink-700 transition-colors">{label}</span>
                <span className="block text-xs text-gray-500">{description}</span>
            </div>
        </Link>
    )
}
