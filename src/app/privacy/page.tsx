import React from 'react';

export const metadata = {
    title: 'Privacy Policy | London\'s Imports',
    description: 'Privacy policy explaining how London\'s Imports collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 pt-28">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
            <div className="prose max-w-none text-gray-700 dark:text-slate-300 space-y-4">
                <p>At London&apos;s Imports, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p>

                <h2 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Name, email address, and phone number</li>
                    <li>Delivery address</li>
                    <li>Payment information (processed securely via Paystack)</li>
                    <li>Order history and preferences</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">2. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Process and fulfill your orders</li>
                    <li>Send order updates via SMS or WhatsApp</li>
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Improve our services and website</li>
                    <li>Send promotional offers (only with your consent)</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">3. Information Sharing</h2>
                <p>We do not sell or rent your personal information. We may share your data with:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Payment processors (Paystack) to process transactions</li>
                    <li>Delivery partners to fulfill your orders</li>
                    <li>Legal authorities when required by law</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">4. Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information. All payment transactions are encrypted and processed through Paystack&apos;s secure platform.</p>

                <h2 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">5. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal data</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your account</li>
                    <li>Opt out of marketing communications</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">6. Cookies</h2>
                <p>We use cookies to improve your browsing experience, remember your preferences, and analyze website traffic. You can manage cookie settings in your browser.</p>

                <h2 className="text-xl font-semibold mt-6 text-gray-900 dark:text-white">7. Contact Us</h2>
                <p>For any privacy-related questions or requests, please contact us via:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>WhatsApp: +233 54 109 6372</li>
                    <li>Email: support@londonsimports.com</li>
                </ul>

                <p className="text-sm text-gray-500 dark:text-slate-500 mt-8">Last updated: January 2026</p>
            </div>
        </div>
    );
}
