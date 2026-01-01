import { Metadata } from 'next';
import CustomsCalculator from '@/components/CustomsCalculator';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Ghana Customs Duty Estimator 2026 | Calculate Import Taxes',
    description: 'Free tool to calculate Import Duty, VAT, and Levies for goods shipping to Ghana. Estimate your clearing costs at Tema/Kotoka or use ours services to save.',
    keywords: ['Ghana customs duty calculator', 'Import tax Ghana', 'Tema port clearing charges', 'Car duty calculator Ghana', 'Duty on electronics Ghana'],
};

export default function CustomsEstimatorPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                        Ghana Customs <span className="text-[#006B5A]">Duty Estimator</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Calculate your exact tax liability when importing directly.
                        See how much you can save by using <span className="font-semibold text-pink-600">London's Imports Consolidation</span>.
                    </p>
                </div>

                {/* Calculator Component */}
                <CustomsCalculator />

                {/* SEO Content / FAQ Section */}
                <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">How is Import Duty calculated in Ghana?</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Import duty is calculated based on the <strong>CIF Value</strong> (Cost of product + Insurance + Freight).
                                The standard rate for general goods is 20%, but this varies. On top of duty, you must pay VAT (15%),
                                NHIL (2.5%), GetFund (2.5%), COVID-19 Levy (1%), and AU/ECOWAS levies.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">What is the duty rate for phones and laptops?</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Detailed electronics often attract different rates. While some IT equipment might be duty-free,
                                smartphones and consumer electronics usually attract a <strong>10-20% duty rate</strong> plus all statutory levies.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">How can I avoid high individual clearing costs?</h3>
                            <p className="text-gray-600 leading-relaxed">
                                The best way to save is through <strong>Consolidation</strong>. By using <Link href="/" className="text-[#006B5A] font-bold hover:underline">London's Imports</Link>,
                                your items are containerized with others. We handle the bulk clearance at a corporate rate, passing significant savings
                                to you. You simply pay a flat shipping fee.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm mb-4">
                        *Disclaimer: This tool provides estimates based on GRA guidelines. Actual charges may vary based on exchange rates and officer assessment.
                    </p>
                </div>

            </div>
        </div>
    );
}
