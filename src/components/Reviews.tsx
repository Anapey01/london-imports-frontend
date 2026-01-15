import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const reviews = [
    {
        name: "Abena K.",
        role: "Verified Buyer",
        title: "Saved GH₵ 1,500 on iPhone",
        text: "Was skeptical at first about paying before arrival, but the tracking was precise. Got it in 14 days and saved huge compared to buying locally!",
        rating: 5,
        date: "2 days ago"
    },
    {
        name: "Kwame O.",
        role: "Verified Buyer",
        title: "Game Changer Service",
        text: "London's Imports is a game changer. The 'Verified Delivery' principle is real. It arrived exactly when they said it would.",
        rating: 5,
        date: "1 week ago"
    },
    {
        name: "Sarah D.",
        role: "Business Vendor",
        title: "Peace of Mind",
        text: "I stock my entire shop through them now. The receipt verification gives me peace of mind for my business capital.",
        rating: 5,
        date: "2 weeks ago"
    },
    {
        name: "Emmanuel M.",
        role: "Verified Buyer",
        title: "Smooth Payment Options",
        text: "The flexible payment option helped a lot. Paid half down and the rest when it landed. Super smooth service.",
        rating: 5,
        date: "3 weeks ago"
    },
    {
        name: "Jessica A.",
        role: "Fashion Haul",
        title: "Great Prices",
        text: "Finally I can shop global brands without begging relatives to bring them home. Shipping fees are very reasonable.",
        rating: 4,
        date: "1 month ago"
    },
    {
        name: "Kofi B.",
        role: "Tech Enthusiast",
        title: "Early Access Success",
        text: "Got the S24 before it was even common in stores here. Automation on WhatsApp kept me updated every step.",
        rating: 5,
        date: "1 month ago"
    }
];

export default function Reviews() {
    return (
        <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Trustpilot Style Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        What our customers say
                    </h2>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-1">
                            <h3 className="text-xl font-medium text-gray-900 mr-2">Excellent</h3>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className="bg-[#00b67a] p-1.5 rounded-sm">
                                    <Star className="w-6 h-6 text-white fill-white" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Based on <span className="underline font-semibold text-gray-900 decoration-gray-300 decoration-1 underline-offset-4 cursor-pointer">verified reviews</span>
                        </p>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review, i) => (
                        <div
                            key={i}
                            className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, starI) => (
                                    <div
                                        key={starI}
                                        className={`${starI < review.rating ? 'bg-[#00b67a]' : 'bg-gray-200'} p-1 rounded-sm`}
                                    >
                                        <Star className="w-3 h-3 text-white fill-white" />
                                    </div>
                                ))}
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-1">
                                {review.title}
                            </h3>

                            {/* Text */}
                            <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-4">
                                "{review.text}"
                            </p>

                            {/* Author & Footer */}
                            <div className="flex items-center justify-between mt-auto">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                                    <div className="flex items-center gap-1.5 mt-0.5 text-gray-400">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        <span className="text-xs">{review.role}</span>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
