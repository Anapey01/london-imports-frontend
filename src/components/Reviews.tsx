import React from 'react';
import { Star, CheckCircle, MessageCircle } from 'lucide-react';

const reviews = [
    {
        name: "Hanneth Musah",
        role: "Verified Buyer",
        title: "First of all she is legit",
        text: "First of all she is legit, trusted wealthy, my satisfied with my experience with my best importer London import. She is genuine, patience and reliable 😘 my all time favorite 😍",
        rating: 5,
        date: "2 days ago",
        reply: "Thank you for trusting in us ❤️"
    },
    {
        name: "Gina Addison",
        role: "Verified Buyer",
        title: "She is trust wealthy",
        text: "She is trust wealthy, patience and also always give updates on the items. She also refund if ur items didn't get to her.",
        rating: 5,
        date: "2 days ago",
        reply: "Thank you and we promise to always be the best among all."
    },
    {
        name: "Yesutor Emmanuella Yovogan",
        role: "Verified Buyer",
        title: "Legit Importer",
        text: "One of the best mini importers I've come across. Calm and humble. Always a nice shopping experience with her. No scam zone.",
        rating: 5,
        date: "2 days ago",
        reply: "Thank you for your generosity"
    },
    {
        name: "Eddy Nyakus",
        role: "Verified Buyer",
        title: "I’m very satisfied with my experience…",
        text: "I’m very satisfied with my experience with London imports. They are genuine, transparent, and reliable. What you order is truly what you get—no hidden issues or misleading descriptions. Communication was clear, and the entire process was handled professionally. I would confidently recommend them to anyone looking for a trustworthy importer.",
        rating: 5,
        date: "2 days ago",
        reply: "Thank you 🙏"
    },
    {
        name: "Wilhelmina Mensah",
        role: "Verified Buyer",
        title: "She's the most trusted importer i know",
        text: "She's the most trusted importer i know. And she gives exactly what you want. No scam, she's the best.",
        rating: 5,
        date: "2 days ago",
        reply: "Thank you ☺️"
    },
    {
        name: "Priscilla Quashie sam",
        role: "Verified Buyer",
        title: "A trusted person",
        text: "A place of no scam 100% trustee and honestly her shipment is the best ❤️",
        rating: 5,
        date: "2 days ago",
        reply: "Thank you for your honesty"
    },
    {
        name: "Kofy Smile",
        role: "Verified Buyer",
        title: "It is the best mini importation…",
        text: "It is the best mini importation business in Ghana right now. What makes them special is their paystack integration. Check them out",
        rating: 5,
        date: "3 days ago"
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
                            className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col h-full"
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
                            <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-4 flex-grow">
                                "{review.text}"
                            </p>

                            {/* Reply Section */}
                            {review.reply && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-[#00b67a]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageCircle className="w-4 h-4 text-[#00b67a]" />
                                        <span className="text-xs font-bold text-gray-900">Reply from London's Imports</span>
                                    </div>
                                    <p className="text-sm text-gray-600 italic">
                                        "{review.reply}"
                                    </p>
                                </div>
                            )}

                            {/* Author & Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
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
