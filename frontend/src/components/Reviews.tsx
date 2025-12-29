import React from 'react';

// Custom sketchy font stack
const sketchyFont = '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif';

const reviews = [
    {
        name: "Abena K.",
        role: "Pre-ordered iPhone 15",
        item: "iPhone 15 Pro Max",
        saving: "Saved GH₵ 1,500",
        text: "Was skeptical at first about paying before arrival, but the tracking was precise. Got it in 14 days and saved huge compared to buying locally!",
        rating: 5
    },
    {
        name: "Kwame O.",
        role: "Pre-ordered PS5",
        item: "PlayStation 5 Slim",
        saving: "Saved GH₵ 800",
        text: "London's Imports is a game changer. The 'Verified Delivery' principle is real. It arrived exactly when they said it would.",
        rating: 5
    },
    {
        name: "Sarah D.",
        role: "Vendor",
        item: "Bulk Cosmetics",
        saving: "Business Supply",
        text: "I stock my entire shop through them now. The receipt verification gives me peace of mind for my business capital.",
        rating: 5
    },
    {
        name: "Emmanuel M.",
        role: "Pre-ordered Laptop",
        item: "MacBook Air M2",
        saving: "Saved GH₵ 2,000",
        text: "The flexible payment option helped a lot. Paid half down and the rest when it landed. Super smooth service.",
        rating: 5
    },
    {
        name: "Jessica A.",
        role: "Fashion Haul",
        item: "Zara & ASOS Order",
        saving: "Direct UK Prices",
        text: "Finally I can shop UK brands without begging relatives to bring them home. Shipping fees are very reasonable.",
        rating: 4
    },
    {
        name: "Kofi B.",
        role: "Tech Enthusiast",
        item: "Samsung S24 Ultra",
        saving: "Early Access",
        text: "Got the S24 before it was even common in stores here. Automation on WhatsApp kept me updated every step.",
        rating: 5
    }
];

export default function Reviews() {
    return (
        <section className="py-20 bg-white overflow-hidden border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 text-center">
                <h2
                    className="text-3xl md:text-5xl font-black text-emerald-900 mb-4 tracking-tight"
                    style={{ fontFamily: sketchyFont }}
                >
                    Trusted by <span className="text-pink-500">Smart Shoppers</span>
                </h2>
                <p className="text-xl text-emerald-700/80 font-medium max-w-2xl mx-auto" style={{ fontFamily: sketchyFont }}>
                    Real feedback from verified Ghanaian pre-orders.
                </p>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden mask-linear-fade">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                <div className="flex animate-marquee gap-8 py-8">
                    {/* Double the list for infinite scroll effect */}
                    {[...reviews, ...reviews].map((review, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-[380px] p-6 rounded-2xl bg-white border-2 border-emerald-900 shadow-[4px_4px_0px_0px_rgba(6,78,59,1)] hover:shadow-[6px_6px_0px_0px_rgba(6,78,59,1)] hover:-translate-y-1 transition-all duration-300 transform"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, starI) => (
                                        <svg
                                            key={starI}
                                            className={`w-5 h-5 ${starI < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            style={{ filter: 'drop-shadow(1px 1px 0px rgba(6,78,59,0.5))' }}
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-emerald-900 border border-emerald-900"
                                    style={{ fontFamily: sketchyFont }}
                                >
                                    {review.saving}
                                </span>
                            </div>

                            <p
                                className="text-emerald-900 text-lg leading-snug mb-6"
                                style={{ fontFamily: sketchyFont }}
                            >
                                &quot;{review.text}&quot;
                            </p>

                            <div className="flex items-center gap-3 pt-4 border-t-2 border-emerald-900/10 border-dashed">
                                <div className="w-10 h-10 rounded-full bg-pink-500 border-2 border-emerald-900 flex items-center justify-center text-white font-bold text-lg shadow-[2px_2px_0px_0px_rgba(6,78,59,1)]">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-900 text-sm" style={{ fontFamily: sketchyFont }}>{review.name}</h4>
                                    <p className="text-xs text-emerald-700 font-bold" style={{ fontFamily: sketchyFont }}>{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
