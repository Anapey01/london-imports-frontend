
export const metadata = {
    title: 'About Us | London\'s Imports',
    description: 'Learn more about London\'s Imports and our mission to bring quality products to Ghana.',
}

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl font-black text-gray-900 mb-6">About London&apos;s Imports</h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        We simplify global shopping for Ghana. By aggregating pre-orders, we reduce shipping costs and handle all the logistics, so you can enjoy premium products without the hassle.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="bg-gray-100 rounded-3xl h-64 md:h-96 flex items-center justify-center">
                        <span className="text-gray-400 font-medium">Our Story Image</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-600 mb-6">
                            To bridge the gap between international markets and Ghanaian consumers, providing access to original, high-quality electronics and goods at fair prices.
                        </p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center gap-2">
                                <span className="text-pink-500 font-bold">✓</span> Direct from UK/US Suppliers
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-pink-500 font-bold">✓</span> Handle All Customs & Shipping
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-pink-500 font-bold">✓</span> Secure Payment Options
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
