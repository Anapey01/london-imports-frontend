/**
 * London's Imports - FAQ Page
 */
'use client';

import { useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

const faqs = [
    {
        question: "What is a pre-order?",
        answer: "A pre-order allows you to reserve and pay for an item before it arrives in Ghana. This guarantees your item and often comes with better pricing than buying after arrival."
    },
    {
        question: "How long does delivery take?",
        answer: "Delivery windows are shown on each product (typically 8-9 weeks). We use date ranges, not exact dates, to ensure honest timelines. You'll receive updates at each milestone."
    },
    {
        question: "Is my payment secure?",
        answer: "Yes! All payments are processed through Paystack, Ghana's leading payment provider. Your funds are held securely until your order is delivered."
    },
    {
        question: "Can I cancel my order?",
        answer: "Yes, you can cancel any time before the batch cutoff date for a full refund. After cutoff, cancellations may be subject to supplier fees."
    },
    {
        question: "What payment options are available?",
        answer: "We accept Mobile Money (MTN, Vodafone, AirtelTigo) and card payments. For most items, you can also pay a deposit now and the balance on delivery."
    },
    {
        question: "How do I track my order?",
        answer: "Log in to your account and visit 'My Orders' to see real-time status updates. You'll also receive SMS/WhatsApp notifications at each milestone."
    },
    {
        question: "What if my item doesn't arrive?",
        answer: "If delivery fails for any reason, you receive a full refund. Our 92% on-time delivery rate means this is rare, but you're always protected."
    },
    {
        question: "Why pre-order instead of buying locally?",
        answer: "Pre-ordering often saves 20-40% compared to local retail prices. You also get access to items not yet available in Ghana and guaranteed genuine products."
    },
    {
        question: "How do I become a vendor?",
        answer: "Visit our 'Become a Vendor' page and fill out the application form. Our team will review your application and contact you within 2-3 business days."
    },
    {
        question: "What happens if there's a delay?",
        answer: "We'll notify you immediately via SMS and WhatsApp. If the delay exceeds the promised window, you can choose to wait for a discount or receive a full refund."
    },
    // SEO: Ghanaian Search Intent Keywords
    {
        question: "How do I find cheap shipping agents from China to Accra?",
        answer: "London's Imports handles all shipping for you! We work with trusted freight partners to get the best rates from Guangzhou and Yiwu to Accra. No need to find agents yourself – just pre-order your items and we handle pickup, consolidation, customs, and doorstep delivery in Ghana."
    },
    {
        question: "Is there mini-importation training available in Ghana for 2026?",
        answer: "While we don't offer formal training courses, London's Imports makes mini-importation easy for beginners. Our platform lets you start importing from China to Ghana without any experience. Browse products, pay via Momo, and we handle sourcing, shipping, and customs. It's the easiest way to start your import business in 2026."
    },
    {
        question: "What are the clearance costs at Tema Port for small goods?",
        answer: "Customs duties at Tema Port typically range from 0-20% depending on the item category (electronics ~10%, clothing ~20%, general goods ~5%). London's Imports includes customs clearance in our pricing, so you pay one transparent price with no hidden Tema Port fees. Use our Customs Duty Estimator for specific calculations."
    },
    {
        question: "Can I buy from 1688 or Taobao and ship to Kumasi?",
        answer: "Yes! We ship to all major cities in Ghana including Accra, Kumasi, Tema, Takoradi, and Cape Coast. Whether you're buying from 1688, Taobao, or Alibaba, we consolidate your orders in China and deliver door-to-door anywhere in Ghana. Deliveries typically take 8-9 weeks."
    }
];

export default function FAQPage() {
    const { theme } = useTheme();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen py-16 px-4" style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb' }}>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                        Frequently Asked Questions
                    </h1>
                    <p style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                        Everything you need to know about pre-ordering with London&apos;s Imports
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border rounded-xl overflow-hidden"
                            style={{
                                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                                borderColor: theme === 'dark' ? '#334155' : '#e5e7eb'
                            }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors"
                                style={{
                                    backgroundColor: openIndex === index
                                        ? (theme === 'dark' ? '#334155' : '#f9fafb')
                                        : 'transparent'
                                }}
                            >
                                <span className="font-semibold" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                                    {faq.question}
                                </span>
                                <svg
                                    className={`w-5 h-5 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke={theme === 'dark' ? '#94a3b8' : '#6b7280'}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-200 ${openIndex === index ? 'max-h-[500px]' : 'max-h-0'}`}
                            >
                                <p className="px-6 pb-4 leading-relaxed" style={{ color: theme === 'dark' ? '#cbd5e1' : '#6b7280' }}>
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions? */}
                <div className="mt-12 text-center p-8 rounded-2xl" style={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#fdf2f8' }}>
                    <h3 className="text-xl font-bold mb-2" style={{ color: theme === 'dark' ? '#f8fafc' : '#111827' }}>
                        Still have questions?
                    </h3>
                    <p className="mb-4" style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                        We&apos;re here to help! Reach out to our support team.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
                        style={{ background: 'linear-gradient(to right, #ec4899, #f43f5e)' }}
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
