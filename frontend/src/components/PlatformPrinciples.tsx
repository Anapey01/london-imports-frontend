import React from 'react';
import Image from 'next/image';

const principles = [
    {
        title: "Direct Import",
        desc: "UK/US to Ghana",
        image: "/principles/truck.png"
    },
    {
        title: "Verified Delivery",
        desc: "Clear timelines",
        image: "/principles/calendar.png"
    },
    {
        title: "Receipt Contracts",
        desc: "Legal proof",
        image: "/principles/contract.png"
    },
    {
        title: "Flexible Payment",
        desc: "Deposit + Balance",
        image: "/principles/card.png"
    },
    {
        title: "Refund Guarantee",
        desc: "Clear triggers",
        image: "/principles/return.png"
    },
    {
        title: "Local Support",
        desc: "24/7 Human help",
        image: "/principles/phone.png"
    }
];

export default function PlatformPrinciples() {
    return (
        <section className="bg-white py-12 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
                    {principles.map((p, i) => (
                        <div key={i} className="flex flex-col items-center group cursor-default">
                            <div className="transform transition-transform group-hover:scale-110 duration-200 mb-4">
                                <Image
                                    src={p.image}
                                    alt={p.title}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 object-contain mx-auto"
                                />
                            </div>
                            <h3 className="text-emerald-900 font-extrabold text-sm uppercase tracking-wide mb-1" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>{p.title}</h3>
                            <p className="text-emerald-700 font-medium text-sm leading-tight max-w-[120px] mx-auto text-balance">
                                {p.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
