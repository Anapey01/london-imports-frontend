'use client';

import { useRouter } from 'next/navigation';

export default function NewProductPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Add New Product</h1>
            <p className="text-gray-500 max-w-md mb-8">
                Product creation is coming soon. For now, please contact admin to add products to your store.
            </p>
            <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
            >
                Go Back
            </button>
        </div>
    );
}
