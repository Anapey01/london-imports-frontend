/**
 * London's Imports - Blog Article Page
 * Individual article with SEO-optimized content
 */
'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { notFound } from 'next/navigation';

// Article content database
const articleContent: Record<string, {
    title: string;
    category: string;
    date: string;
    readTime: string;
    content: string[];
}> = {
    'how-to-buy-from-1688-in-ghana': {
        title: 'How to Buy from 1688 in Ghana: Complete Guide 2024',
        category: 'Guides',
        date: 'January 5, 2024',
        readTime: '8 min read',
        content: [
            '1688.com is Alibaba\'s wholesale marketplace in China, offering products at factory prices. Many Ghanaians don\'t know they can access these incredible deals. In this guide, we\'ll show you exactly how to buy from 1688 and have it shipped to your doorstep in Accra, Tema, or anywhere in Ghana.',
            '## Why Buy from 1688?',
            '1688 offers prices 30-50% cheaper than Alibaba because it\'s designed for domestic Chinese buyers. You\'ll find electronics, fashion, gadgets, phone accessories, kitchen items, and more at wholesale prices. The minimum order quantities are also lower than Alibaba.',
            '## Step 1: Find Your Products',
            'Browse 1688.com (use Google Translate or Chrome\'s built-in translation). Search for products using simple keywords. Look for shops with high ratings and many orders. Save links to products you want.',
            '## Step 2: Send Us Your Links',
            'WhatsApp us at +233 54 109 6372 with your product links. We\'ll verify the seller, check quality, and give you a total price including shipping and customs to Ghana.',
            '## Step 3: Pay with Mobile Money',
            'No credit card needed! Pay in Ghana Cedis (GHS) using MTN Mobile Money, AirtelTigo Money, or Vodafone Cash. We handle the currency conversion and payment to Chinese suppliers.',
            '## Step 4: We Handle Everything',
            'We purchase from 1688, consolidate your items in our Guangzhou warehouse, handle shipping (air or sea), clear customs at Tema Port or Kotoka Airport, and deliver to your door.',
            '## Shipping Options',
            '**Air Freight (7-14 days):** Best for small, urgent orders. Cost: GHS 50-150 per kg.\n\n**Sea Freight (30-45 days):** Best for large, heavy orders. Cost: GHS 15-30 per kg.',
            '## Tips for Success',
            '- Order during off-peak seasons (avoid Chinese New Year in January/February)\n- Buy samples first before bulk orders\n- Choose products with clear photos and specifications\n- Work with verified suppliers with good ratings',
            '## Ready to Start?',
            'WhatsApp us today at +233 54 109 6372 or browse our pre-sourced products at londonsimports.com. No minimum order, no hassle!'
        ]
    },
    'mini-importation-beginners-guide': {
        title: 'Mini Importation in Ghana: Beginner\'s Guide',
        category: 'Guides',
        date: 'January 3, 2024',
        readTime: '10 min read',
        content: [
            'Mini importation is transforming how Ghanaians access quality products at affordable prices. Whether you want to start a business or simply buy for personal use, this guide covers everything you need to know.',
            '## What is Mini Importation?',
            'Mini importation is the process of buying goods in small quantities from overseas (usually China) and having them shipped to Ghana. Unlike traditional importation, you don\'t need containers or huge capital.',
            '## Benefits of Mini Importation',
            '- **Lower costs:** Buy at factory prices, 30-70% cheaper than local retail\n- **Access to variety:** Millions of products not available in Ghana\n- **Flexible quantities:** Order as few as 1-10 units\n- **Business opportunity:** Resell for profit',
            '## Popular Products to Import',
            '1. Phones and phone accessories\n2. Fashion and clothing\n3. Electronics and gadgets\n4. Beauty products\n5. Kitchen appliances\n6. Toys and games\n7. Car accessories',
            '## Where to Source Products',
            '**1688.com** - Cheapest wholesale prices (Chinese site)\n**Alibaba.com** - English interface, larger MOQs\n**Taobao.com** - Similar to 1688, more retail items\n**AliExpress** - Higher prices but smaller quantities',
            '## Understanding Customs Duties',
            'Ghana Customs charges import duties of 20-35% depending on the product category. Electronics have different rates than clothing. At London\'s Imports, our prices include customs clearance - no surprises.',
            '## Getting Started',
            'The easiest way to start is with a trusted agent like London\'s Imports. We handle sourcing, shipping, customs clearance, and delivery. Just tell us what you need!',
            '## Contact Us',
            'WhatsApp: +233 54 109 6372\nWebsite: londonsimports.com'
        ]
    },
    'customs-duty-calculator-ghana': {
        title: 'Ghana Customs Duty Calculator: How Much Will You Pay?',
        category: 'Customs',
        date: 'December 28, 2023',
        readTime: '6 min read',
        content: [
            'Understanding customs duties is crucial for calculating your true import costs. Ghana Customs charges varying rates depending on product category, and there are additional taxes to consider.',
            '## How Ghana Customs Duty Works',
            'When goods arrive in Ghana, you pay:\n1. **Import Duty:** 0-35% of CIF value (Cost + Insurance + Freight)\n2. **VAT:** 15% on goods\n3. **NHIL:** 2.5%\n4. **GETFund Levy:** 2.5%\n5. **Processing fees**',
            '## Common Duty Rates by Category',
            '| Product | Import Duty | Total Taxes (Est.) |\n|---------|-------------|--------------------|\n| Phones/Electronics | 0-20% | 35-40% |\n| Clothing/Fashion | 20% | 45-50% |\n| Shoes | 20% | 45-50% |\n| Beauty Products | 20% | 45-50% |\n| Kitchen Items | 20% | 45-50% |\n| Car Parts | 5-20% | 30-45% |',
            '## Example Calculation',
            'Importing a $100 phone:\n- CIF Value: $100\n- Import Duty (20%): $20\n- VAT (15%): $18\n- Levies (5%): $6.90\n- **Total taxes:** ~$45 (45%)',
            '## How London\'s Imports Helps',
            'When you order through us, our quoted price includes:\n✅ Product cost\n✅ Shipping (air or sea)\n✅ Customs clearance\n✅ All duties and taxes\n✅ Delivery to your door\n\nNo hidden fees. The price you see is the price you pay.',
            '## Use Our Free Estimator',
            'Visit londonsimports.com/customs-estimator to calculate your import costs for any product!'
        ]
    },
    'alibaba-vs-1688-which-is-better': {
        title: 'Alibaba vs 1688: Which is Better for Ghana Importers?',
        category: 'Comparison',
        date: 'December 20, 2023',
        readTime: '7 min read',
        content: [
            'Both Alibaba and 1688 are owned by the same company, but they serve different markets. Understanding the difference can save you 30-50% on your imports.',
            '## What is Alibaba?',
            'Alibaba.com is designed for international buyers. It\'s in English, accepts international payments, and suppliers are used to working with overseas customers.',
            '## What is 1688?',
            '1688.com (yī-liù-bā-bā) is for the Chinese domestic market. It\'s in Chinese only, requires Chinese payment methods, but offers significantly lower prices.',
            '## Price Comparison',
            '| Aspect | Alibaba | 1688 |\n|--------|---------|------|\n| Prices | Higher | 30-50% cheaper |\n| MOQ | High (100+) | Low (5-20) |\n| Language | English | Chinese |\n| Payment | PayPal, Cards | Alipay |\n| Quality | Verified | Varies |',
            '## When to Use Each',
            '**Choose Alibaba if:**\n- You want English support\n- You prefer direct communication with sellers\n- You need quality certifications\n- You\'re ordering large quantities',
            '**Choose 1688 if:**\n- You want the lowest prices\n- You\'re ordering smaller quantities\n- You use an agent (like London\'s Imports)\n- You\'re experienced with import quality checks',
            '## Our Recommendation',
            'For most Ghana importers, 1688 through an agent offers the best value. You get factory prices without needing Chinese language skills or payment methods. Contact London\'s Imports to access 1688!'
        ]
    },
    'best-products-to-import-from-china-to-ghana': {
        title: 'Top 10 Best Products to Import from China to Ghana 2024',
        category: 'Business',
        date: 'December 15, 2023',
        readTime: '9 min read',
        content: [
            'Want to start a profitable import business? Here are the top 10 products that sell well in Ghana, with good profit margins and high demand.',
            '## 1. Phone Accessories',
            'Phone cases, chargers, earphones, screen protectors. Low cost, high demand, easy to ship. Profit margin: 50-100%',
            '## 2. Fashion & Clothing',
            'Trendy clothes, especially for young people. Focus on unique styles not available locally. Profit margin: 60-150%',
            '## 3. Wigs & Hair Extensions',
            'Huge market in Ghana and Africa. Quality wigs from China are affordable. Profit margin: 100-200%',
            '## 4. Electronics & Gadgets',
            'Smart watches, Bluetooth speakers, LED lights. Verify quality before bulk ordering. Profit margin: 40-80%',
            '## 5. Beauty & Skincare',
            'Makeup, skincare products, beauty tools. Ensure products meet safety standards. Profit margin: 50-100%',
            '## 6. Children\'s Items',
            'Toys, baby clothes, school supplies. Always in demand. Profit margin: 60-120%',
            '## 7. Kitchen Appliances',
            'Blenders, air fryers, utensils. Growing middle class wants quality items. Profit margin: 40-70%',
            '## 8. Fitness Equipment',
            'Yoga mats, dumbbells, resistance bands. Health consciousness is growing. Profit margin: 50-100%',
            '## 9. Car Accessories',
            'Seat covers, phone holders, LED lights. Many car owners looking for upgrades. Profit margin: 50-80%',
            '## 10. Home Decor',
            'Wall art, LED string lights, organizers. People want to beautify their homes. Profit margin: 60-120%',
            '## Tips for Success',
            '- Start with one category and master it\n- Order samples first\n- Build your social media presence\n- Provide excellent customer service\n- Reinvest profits to grow'
        ]
    },
    'shipping-time-china-to-ghana': {
        title: 'How Long Does Shipping from China to Ghana Take?',
        category: 'Shipping',
        date: 'December 10, 2023',
        readTime: '5 min read',
        content: [
            'One of the most common questions we get is about shipping time. Here\'s a detailed breakdown of what to expect when shipping from China to Ghana.',
            '## Air Freight',
            '**Time:** 7-14 business days\n**Best for:** Small packages, valuable items, urgent orders\n**Cost:** GHS 50-150 per kg',
            '## Sea Freight',
            '**Time:** 30-45 days\n**Best for:** Large, heavy items, bulk orders\n**Cost:** GHS 15-30 per kg',
            '## What Affects Shipping Time?',
            '1. **Customs clearance:** Can add 2-5 days if documents aren\'t ready\n2. **Holidays:** Chinese New Year, Ghana public holidays\n3. **Shipping method:** Express vs standard\n4. **Weather:** Rare, but storms can cause delays',
            '## Breakdown of Air Freight Timeline',
            '- Days 1-2: Order processing and pickup in China\n- Days 2-3: Consolidation at Guangzhou warehouse\n- Days 3-5: Flight to Ghana (with transit)\n- Days 5-7: Customs clearance\n- Days 7-14: Local delivery',
            '## Track Your Package',
            'London\'s Imports provides real-time tracking for all shipments. You\'ll know exactly where your package is at every step.',
            '## How to Reduce Delays',
            '- Order well before you need items\n- Avoid Chinese New Year (Jan-Feb)\n- Ensure accurate delivery address\n- Use a reliable agent like London\'s Imports',
            '## Get Started',
            'Ready to ship? Contact us on WhatsApp: +233 54 109 6372'
        ]
    },
};

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const article = articleContent[slug];

    if (!article) {
        notFound();
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className={`border-b ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <Link href="/blog" className={`inline-flex items-center gap-1 text-sm mb-4 ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Blog
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${isDark ? 'bg-pink-900/50 text-pink-300' : 'bg-pink-100 text-pink-600'}`}>
                            {article.category}
                        </span>
                        <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                            {article.date} · {article.readTime}
                        </span>
                    </div>
                    <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {article.title}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <article className="max-w-3xl mx-auto px-4 py-8">
                <div className={`prose prose-lg max-w-none ${isDark ? 'prose-invert' : ''}`}>
                    {article.content.map((block, i) => {
                        if (block.startsWith('## ')) {
                            return (
                                <h2 key={i} className={`text-xl font-bold mt-8 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {block.replace('## ', '')}
                                </h2>
                            );
                        }
                        if (block.includes('\n')) {
                            return (
                                <div key={i} className={`whitespace-pre-line ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                    {block}
                                </div>
                            );
                        }
                        return (
                            <p key={i} className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                {block}
                            </p>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className={`mt-12 p-6 rounded-2xl ${isDark ? 'bg-gradient-to-br from-pink-900/50 to-violet-900/50' : 'bg-gradient-to-br from-pink-100 to-violet-100'}`}>
                    <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Need Help Importing?
                    </h3>
                    <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                        London&apos;s Imports handles everything - from sourcing to doorstep delivery.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="https://wa.me/233545247009"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp Us
                        </a>
                        <Link
                            href="/products"
                            className="inline-block px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>

                {/* Related */}
                <div className="mt-12">
                    <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Continue Reading
                    </h3>
                    <Link href="/blog" className={`text-pink-500 hover:text-pink-600 font-medium`}>
                        View all articles →
                    </Link>
                </div>
            </article>
        </div>
    );
}
