/**
 * London's Imports - FAQ Accordion Component
 * Answers common preorder questions
 */
'use client';

import { useState } from 'react';

const faqs = [
    {
        question: "What is a pre-order?",
        answer: "A pre-order allows you to reserve and pay for an item before it arrives in Ghana. This guarantees your item and often comes with better pricing than buying after arrival."
    },
    {
        question: "How long does delivery take?",
        answer: "Delivery windows are shown on each product (typically 2-4 weeks). We use date ranges, not exact dates, to ensure honest timelines. You'll receive updates at each milestone."
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
    }
];

export default function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="space-y-3">
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                        <span className="font-semibold text-gray-900">{faq.question}</span>
                        <svg
                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-200 ${openIndex === index ? 'max-h-48' : 'max-h-0'}`}
                    >
                        <p className="px-6 pb-4 text-gray-600 leading-relaxed">
                            {faq.answer}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
