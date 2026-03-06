'use client';

import { Lock } from 'lucide-react';

const CheckoutHeader = () => (
    <div className="flex items-end justify-between mb-12 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                Secure Checkout
            </h1>
        </div>
    </div>
);

export default CheckoutHeader;
