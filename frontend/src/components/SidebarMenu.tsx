/**
 * SidebarMenu.tsx
 * Desktop Sidebar Drawer for Navigation
 */
'use client';

import { X, Package, Truck, Info, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SidebarMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animation-slide-in-left">
                {/* Header */}
                <div className="p-5 border-b flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-3">
                        <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-md" />
                        <span className="font-bold text-lg text-gray-800">Menu</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <nav className="flex flex-col gap-2">
                        <MenuItem
                            href="/products"
                            icon={<Package className="w-5 h-5" />}
                            label="Pre-orders"
                            description="Browse upcoming items"
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

                    {/* Footer / Extra Info */}
                    <div className="mt-10 p-4 bg-pink-50 rounded-xl">
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
