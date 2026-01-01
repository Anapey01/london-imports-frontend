import React from 'react';

export const metadata = {
    title: 'Terms & Conditions | London\'s Imports',
    description: 'Terms and conditions for using London\'s Imports services.',
};

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
            <div className="prose max-w-none text-gray-700 space-y-4">
                <p>Welcome to London's Imports. By using our website and services, you agree to these terms.</p>

                <h2 className="text-xl font-semibold mt-6">1. Pre-Orders</h2>
                <p>All items are subject to availability. Pre-order delivery times are estimates (typically 2-3 weeks from UK/China to Ghana).</p>

                <h2 className="text-xl font-semibold mt-6">2. Payments</h2>
                <p>We accept Mobile Money and Cards via Paystack. Full payment is required for immediate purchases. Pre-orders may require a deposit.</p>

                <h2 className="text-xl font-semibold mt-6">3. Returns & Refunds</h2>
                <p>Returns are accepted for defective items within 7 days of delivery. Change of mind returns are subject to a restocking fee.</p>

                <h2 className="text-xl font-semibold mt-6">4. Contact</h2>
                <p>For any inquiries, please contact our support team via WhatsApp or email.</p>

                <p className="text-sm text-gray-500 mt-8">Last updated: January 2026</p>
            </div>
        </div>
    );
}
