'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function SEOAccordion() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="py-8 bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 text-center sm:text-left flex-1">
                            Import Goods from China to <span className="text-pink-600">Ghana</span> - Fast Shipping & Customs Clearance
                        </h1>
                        <button
                            className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            aria-label="Toggle details"
                        >
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-100 pt-6">
                            <div>
                                <p className="mb-4">
                                    Looking for reliable <strong>shipping from China to Ghana</strong>? London&apos;s Imports simplifies the process.
                                    Whether you want to <strong>buy from 1688 to Ghana</strong>, Alibaba, or Taobao, we act as your trusted bridge.
                                </p>
                                <p>
                                    We specialize in <strong>China to Ghana consolidation</strong>, allowing you to combine multiple packages into one shipment
                                    to save on <strong>air freight rates</strong>. No need to worry about complex logistics or customs.
                                </p>
                            </div>
                            <div>
                                <p className="mb-4">
                                    Our <strong>door to door shipping in Ghana</strong> ensures your goods arrive safely at your doorstep in Accra or Tema.
                                    We handle all <strong>Ghana Customs duty</strong> and clearance processes for electronics, fashion, and general goods.
                                </p>
                                <p>
                                    Pay securely in Cedis via <strong>Momo</strong>. Join thousands of sophisticated shoppers and business owners using
                                    London&apos;s Imports for stress-free importation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
