
import Image from 'next/image';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, XCircle } from 'lucide-react';

export const metadata = {
    title: 'About Us | London\'s Imports',
    description: 'Learn more about London\'s Imports and our mission to bring quality products to Ghana.',
};

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* 1. Hero Section - Premium & Clean */}
            <section className="relative py-24 lg:py-32 overflow-hidden bg-gray-50 flex items-center justify-center">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-pink-100/80 text-pink-700 text-sm font-semibold mb-6 tracking-wide uppercase">
                        Since 2024
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight">
                        About <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">London&apos;s Imports</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-light">
                        Bridging global markets and Ghana. Authentic products, simplified logistics, and transparent pricing.
                    </p>
                </div>
            </section>

            {/* 2. Our Story Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Image Side */}
                        <div className="relative">
                            <div className="relative rounded-[2.5rem] overflow-hidden h-[600px] shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                                <Image
                                    src="/assets/our-story.jpg"
                                    alt="Founder of London's Imports in a scenic location"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 text-white">
                                    <p className="font-bold text-lg">The Vision</p>
                                    <p className="opacity-90 text-sm">Connecting you to the world.</p>
                                </div>
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-100 rounded-full -z-10 blur-xl"></div>
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-50 rounded-full -z-10 blur-xl"></div>
                        </div>

                        {/* Text Side */}
                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                                Bringing the World <br />
                                <span className="text-pink-600">to Your Doorstep.</span>
                            </h2>
                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    London&apos;s Imports is a Ghana-based international shopping and pre-order service that helps individuals and businesses buy <span className="text-gray-900 font-semibold">authentic electronics and premium products</span> from China, without the stress of overseas shipping, customs clearance, or inflated middleman prices.
                                </p>
                                <p>
                                    By aggregating customer pre-orders, we significantly reduce international shipping costs and ensure a <span className="text-gray-900 font-semibold">reliable, transparent import process</span> from purchase to doorstep delivery in Ghana.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Our Mission Section */}
            <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            To connect Ghanaian consumers directly to trusted global suppliers, making genuine electronics and high-quality international products <span className="text-pink-400 font-medium">affordable, accessible, and secure.</span>
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-3xl p-8 md:p-12 border border-gray-700 shadow-xl max-w-5xl mx-auto">
                        <h3 className="text-center text-xl font-semibold mb-10 text-gray-200">We aim to eliminate common import challenges:</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Counterfeit Products', icon: XCircle },
                                { title: 'Hidden Charges', icon: XCircle },
                                { title: 'Delayed Deliveries', icon: XCircle },
                                { title: 'Unclear Pricing', icon: XCircle },
                            ].map((item) => (
                                <div key={item.title} className="bg-gray-900/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-4 border border-gray-700 hover:border-red-500/50 transition-colors group">
                                    <item.icon className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium text-gray-300 group-hover:text-red-400 transition-colors">{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Why Choose Us Grid */}
            <section className="py-20 lg:py-32 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Experienece the London&apos;s Imports difference.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Access to Verified Suppliers</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We source products directly from trusted retailers and manufacturers in China, ensuring originality and quality.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                                <Truck className="w-7 h-7 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">End-to-End Shipping & Customs</h3>
                            <p className="text-gray-600 leading-relaxed">
                                All international logistics, customs documentation, and clearance in Ghana are handled by our team—no surprises, no stress.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                                <CreditCard className="w-7 h-7 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Cost-Effective Pre-Order Model</h3>
                            <p className="text-gray-600 leading-relaxed">
                                By consolidating multiple orders into scheduled shipments, customers benefit from lower shipping costs and predictable pricing.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-7 h-7 text-pink-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payments & Transparent Pricing</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We offer safe payment options, clear timelines, and upfront pricing—what you see is what you pay.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
