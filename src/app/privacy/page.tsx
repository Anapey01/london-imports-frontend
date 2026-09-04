/**
 * London's Imports - Privacy Policy Page
 * Premium 'Atelier' layout describing user data policies
 */
import React from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

// ISR: Revalidate static info page every 7 days
export const revalidate = 604800;

export const metadata: Metadata = {
    title: 'Privacy Policy | London\'s Imports',
    description: 'Privacy policy explaining how London\'s Imports collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 relative pb-32 selection:bg-emerald-100 dark:selection:bg-slate-800">
            {/* Header */}
            <header className="relative pt-32 pb-20 bg-white dark:bg-slate-950 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-[1400px] mx-auto px-10">
                    <div className="w-12 h-px bg-slate-900 dark:bg-white mb-10" />
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                        <div className="max-w-2xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-500 block mb-4">Legal Policy / Privacy</span>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white tracking-tighter leading-none">
                                Privacy <span className="italic font-normal">Policy.</span>
                            </h1>
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.3em] max-w-sm leading-relaxed text-right font-black">
                            Security and confidentiality. <br /> How we protect your import data.
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-10 py-24">
                <div className="space-y-12 text-slate-900 dark:text-white">
                    <div className="border-l-[3px] border-emerald-500/20 dark:border-emerald-500/40 pl-8">
                        <p className="text-xl font-serif italic text-slate-500 dark:text-slate-400 font-medium">
                            At London&apos;s Imports, we value the trust you place in our sourcing and logistics network. We are committed to safeguarding your personal data.
                        </p>
                    </div>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">1. Data We Collect</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            To facilitate factory procurement, package consolidation, and final distribution inside Ghana, we collect the following information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <li><strong>Identity & Verification:</strong> Your full name, email address, and phone number. Phone numbers are strictly used for account verification, delivery updates, and logistics/rider coordination.</li>
                            <li><strong>Delivery Details:</strong> The physical delivery address, city, and region. In some cases, we use GPS coordinates to guarantee accurate warehouse-to-door drops.</li>
                            <li><strong>Order History:</strong> Specific links to Chinese marketplaces (Alibaba, 1688), size selections, quantities, colors, and previous shipment histories.</li>
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">2. Payment Processing & Security</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            All payment transactions on our platform are processed securely via our licensed payment gateway partner, <strong>Hubtel</strong> (supporting MTN Mobile Money, Telecel Cash, AirtelTigo Money, Visa, and Mastercard).
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            <strong>London&apos;s Imports does not store, access, or transmit your sensitive payment credentials</strong>. We do not have access to your Mobile Money PINs, credit card numbers, bank credentials, or CVVs. All billing transactions are encrypted and processed exclusively on Hubtel&apos;s PCI-DSS certified payment infrastructure.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">3. Cookies & Analytics</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            We use cookies to maintain your shopping cart state, store session identifiers, and remember your account preferences. We also collect anonymized analytical traffic details (such as pages visited, load times, and device characteristics) to optimize our web application performance and prevent security threats. You may adjust your browser settings to reject cookies, though some features of our website may become unavailable.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">4. Mobile Application & Push Notifications (Android & FCM)</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            When you install and access London&apos;s Imports through our Android application or Progressive Web App (PWA), we collect and store the following device-level details in your registered device profile (<code>UserDevice</code>):
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <li><strong>Device Information:</strong> We collect and store your device model (e.g. Samsung Galaxy, Google Pixel, Tecno, Infinix), platform (Android), and operating system version in our secure <code>UserDevice</code> record to ensure layout compatibility, troubleshoot application crashes, and deliver optimized app performance.</li>
                            <li><strong>Firebase Cloud Messaging (FCM) Tokens:</strong> When you grant notification permissions, a unique FCM registration token is securely generated and linked to your user account. These tokens are stored strictly to send real-time transactional order updates — including procurement confirmations in China, flight/shipping departures, customs clearance milestones at Tema Harbor or Kotoka Airport, delivery dispatch alerts, and upcoming delivery reminders.</li>
                        </ul>
                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                                🔕 How to Opt Out of Push Notifications:
                            </p>
                            <p>
                                You can withdraw notification permissions or opt out at any time directly through your Android device settings:
                            </p>
                            <p className="mt-1 font-mono font-semibold text-slate-800 dark:text-slate-200">
                                Android Settings &rarr; Apps &rarr; London&apos;s Imports &rarr; Notifications &rarr; Toggle Off
                            </p>
                            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                                Alternatively, signing out of your London&apos;s Imports account in the app immediately deactivates your device token in our database, terminating all push notifications to that device.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">5. Data Retention Policy</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            We retain customer personal data and order histories for as long as necessary to fulfill the purposes described in this policy, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <li>Maintaining accurate business and tax records of purchases.</li>
                            <li>Supporting logistics auditing, delivery verification, and the resolution of shipping disputes.</li>
                            <li>Honoring claims under our 72-hour defective or wrong item reporting window.</li>
                        </ul>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Active user profiles are retained indefinitely until the customer requests account deletion. Upon verified request, we will permanently delete or anonymize your personal information, subject to mandatory statutory tax and accounting retention requirements.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">6. Contact Sourcing Support</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            To inspect your data, request corrections, or ask for the deletion of your account, you can contact our privacy support via:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <li><strong>WhatsApp Concierge:</strong> +{siteConfig.concierge.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')}</li>
                            <li><strong>Business Email:</strong> {siteConfig.supportEmail}</li>
                        </ul>
                    </section>

                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-slate-600 mt-20 border-t border-slate-50 dark:border-slate-900 pt-10">Last updated: June 2026</p>
                </div>
            </div>
        </div>
    );
}
