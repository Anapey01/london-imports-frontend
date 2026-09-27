/**
 * London's Imports - Central Knowledge Repository for Miss London
 * Contains verified FAQs, policies, and site feature capabilities.
 */

export interface KnowledgeItem {
    id: string;
    category: 'faq' | 'policy' | 'feature' | 'contact';
    title: string;
    keywords: string[];
    content: string;
    actionLink?: {
        label: string;
        href: string;
    };
    quickReplies?: Array<{
        label: string;
        query: string;
    }>;
}

export const STORE_KNOWLEDGE: KnowledgeItem[] = [
    // --- WEBSITE OVERVIEW & FEATURES ---
    {
        id: 'FEAT-WEBSITE-OVERVIEW',
        category: 'feature',
        title: "London's Imports Website & Features Overview",
        keywords: ['website', 'site', 'information', 'about website', 'features', 'find information', 'can you find information', 'what about the website', 'how does the website work', 'tell me about the website', 'services'],
        content: "Yes, absolutely! I have full information about our website and features right here. London's Imports connects Ghanaian shoppers directly to global manufacturing hubs and verified local merchants:\n\n1. China Pre-Order Store (/products): Buy directly from China factories in Guangzhou and Yiwu at wholesale prices (20% to 40% below Ghanaian retail markups).\n2. Local Market (/market): Shop physical, in-stock products in Ghana with same-day dispatch in Accra or 24–48h delivery nationwide.\n3. WAEC Results Checker (/checker): Buy official WASSCE and BECE results checkers instantly online using MTN MoMo, Telecel Cash, or bank cards.\n4. Real-time Order Tracking (/track): Track overseas batches and shipments live by order number from China to Accra.\n5. Customs Duty Estimator (/customs-estimator): Calculate expected GRA customs duties and port clearance fees transparently.\n6. Hubtel USSD (*713*7453#): Pay offline quickly from any phone in Ghana by quoting your order number.\n\nWhat would you like to explore?",
        actionLink: { label: "Explore Store Catalog", href: "/products" },
        quickReplies: [
            { label: "Browse Catalog", query: "Browse catalog" },
            { label: "Local Market (In Ghana)", query: "Tell me about the Local Market" },
            { label: "Track My Order", query: "Track my order" },
            { label: "Store Policies", query: "What are the policies" }
        ]
    },
    {
        id: 'POL-ALL-POLICIES',
        category: 'policy',
        title: "London's Imports Store Policies Overview",
        keywords: ['policy', 'policies', 'all policies', 'what are the policies', 'pull them out', 'pull them out for me', 'show me policies', 'rules', 'terms', 'store rules', 'store policies', 'shipping and return policy', 'what are policies'],
        content: "Here are our key store policies at London's Imports:\n\n1. Shipping & Timelines: Express Air Cargo delivers in 7–14 business days (approx. 2–3 weeks total cycle) for urgent or lightweight items. Standard Sea Freight delivers in 30–60 business days (approx. 6–8 weeks) for bulk or heavy items. Once in Accra, we deliver nationwide via couriers or offer pickup at our Danfa Central distribution hub.\n2. Payment & Security: Payments are processed securely via Hubtel in Ghana Cedis (GH₵). We accept MTN MoMo, Telecel Cash, AT Money, and Visa/Mastercard, or offline USSD *713*7453#. For pre-orders, you can pay a commitment deposit upfront and settle the balance upon arrival.\n3. 100% Refunds & Cancellations: Full refund if a China supplier cannot fulfill your order, if duplicate payment occurs, or if canceled before the batch cutoff date. Defective or damaged items reported within 48 hours receive immediate replacement or full refund.\n4. Prohibited Items: Strictly no weapons, firearms, ammunition, fireworks, combustible chemicals, narcotics, or illegal goods.\n\nWould you like more details on shipping, refunds, or payment?",
        actionLink: { label: "View Refund & Shipping Policy", href: "/refunds" },
        quickReplies: [
            { label: "Shipping Policy", query: "What is your shipping policy?" },
            { label: "Refund Policy", query: "What is your refund policy?" },
            { label: "Payment Methods", query: "What payment methods do you accept?" },
            { label: "Browse Catalog", query: "Browse catalog" }
        ]
    },
    // --- WEBSITE FEATURES & USE CASES ---
    {
        id: 'FEAT-PREORDER',
        category: 'feature',
        title: 'China Pre-Order Store',
        keywords: ['pre-order', 'preorder', 'china', 'how to order', 'how pre-order works', 'factory price', '1688', 'taobao', 'guangzhou', 'yiwu'],
        content: "Our Pre-Order store lets you buy directly from verified China factories (Guangzhou, Yiwu, Shenzhen) at direct-factory wholesale prices, saving 20% to 40% compared to local retail. You pay a commitment deposit (or full price) to secure factory batch production. Goods are inspected at our China warehouse, shipped to Accra via Sea Cargo (around 6 weeks) or Express Air Cargo (7–14 business days), and balance is settled upon arrival.",
        actionLink: { label: "Explore Pre-Order Catalog", href: "/products" },
        quickReplies: [
            { label: "Browse Catalog", query: "Browse catalog" },
            { label: "Shipping Timelines", query: "How long does shipping take?" },
            { label: "Local Market (In Ghana)", query: "Tell me about the Local Market" }
        ]
    },
    {
        id: 'FEAT-LOCAL-MARKET',
        category: 'feature',
        title: 'Local Market (Ready-to-Ship in Ghana)',
        keywords: ['local market', 'in ghana', 'ready to ship', 'same day', 'instantly', 'buy now', 'local vendor', 'ghana stock', 'available now', 'no waiting'],
        content: "If you need items immediately without waiting for overseas cargo from China, visit our Local Market! The Local Market features verified Ghanaian merchants selling physical, in-stock products with same-day dispatch or 24-48 hour delivery across Accra, Kumasi, and nationwide.",
        actionLink: { label: "Shop Local Market", href: "/market" },
        quickReplies: [
            { label: "Visit Local Market", query: "How do I shop the Local Market?" },
            { label: "Pre-Orders from China", query: "How do pre-orders from China work?" }
        ]
    },
    {
        id: 'FEAT-CHECKER',
        category: 'feature',
        title: 'WAEC Results Checker Center',
        keywords: ['waec', 'wassce', 'bece', 'checker', 'results checker', 'buy checker', 'exam pin', 'serial number'],
        content: "Our WAEC Results Checker portal allows students and parents to buy official WASSCE and BECE results checkers instantly in Ghana. Pay securely using MTN Mobile Money, Telecel Cash, AT Money, or bank cards, and your Checker PIN and Serial number are displayed instantly on-screen and sent to your email.",
        actionLink: { label: "Buy Results Checker", href: "/checker" },
        quickReplies: [
            { label: "Buy WAEC Checker", query: "How do I buy a WAEC Results Checker?" },
            { label: "Browse Store", query: "Browse catalog" }
        ]
    },
    {
        id: 'FEAT-TRACKING',
        category: 'feature',
        title: 'Real-time Batch & Order Tracking',
        keywords: ['track', 'tracking', 'order status', 'where is my order', 'shipment status', 'batch', 'container', 'vessel', 'cargo status'],
        content: "You can track your order at every milestone from our China warehouse to your doorstep in Ghana. Enter your order number (e.g. LI-20260905-26446) on our Track page or directly here in chat to see real-time updates: China Warehouse Receipt, Cargo Sailing / Flying, Tema Port Clearance, and Accra Central Hub sorting.",
        actionLink: { label: "Track Shipment", href: "/track" },
        quickReplies: [
            { label: "Track My Order", query: "Track my order" },
            { label: "Delivery Duration", query: "How long does shipping take?" }
        ]
    },
    {
        id: 'FEAT-CUSTOMS',
        category: 'feature',
        title: 'Customs Duty Estimator',
        keywords: ['customs', 'duty', 'clearance', 'tema port', 'gra', 'taxes', 'import duty', 'customs fee', 'customs estimator'],
        content: "We provide an interactive Customs Duty Estimator to calculate expected clearance fees and Ghana Revenue Authority (GRA) import tariffs for various product categories. For standard pre-order retail items on our platform, customs clearance is already integrated into the transparent pricing.",
        actionLink: { label: "Customs Duty Estimator", href: "/customs-estimator" },
        quickReplies: [
            { label: "Calculate Customs", query: "How do customs duties work?" },
            { label: "Shipping Guidelines", query: "What is your shipping policy?" }
        ]
    },
    {
        id: 'FEAT-CUSTOM-SOURCING',
        category: 'feature',
        title: 'Custom China Sourcing (1688 / Taobao / Factories)',
        keywords: ['custom sourcing', 'find item', 'source for me', 'not on website', 'picture', 'image search', 'bulk import', 'container'],
        content: "Looking for an item not listed on our website? We offer full custom sourcing from Guangzhou, Yiwu, 1688, and Taobao. You can share the product photo, description, or link with Miss London or our WhatsApp concierge team. We verify manufacturer specs, negotiate wholesale pricing, and handle shipping directly to Ghana.",
        actionLink: { label: "Chat on WhatsApp (+233 54 524 7009)", href: "https://wa.me/233545247009?text=Hello%20London%27s%20Imports%2C%20I%20would%20like%20to%20source%20a%20product%20from%20China" },
        quickReplies: [
            { label: "Custom Sourcing Help", query: "Can you help me source a product from China?" },
            { label: "Chat on WhatsApp", query: "Connect me to WhatsApp concierge" }
        ]
    },

    // --- POLICIES ---
    {
        id: 'POL-SHIPPING',
        category: 'policy',
        title: 'Shipping Policy & Timelines',
        keywords: ['shipping time', 'how long', 'delivery time', 'weeks', 'days', 'air cargo', 'sea cargo', 'sea freight', 'air freight', 'delivery fee', 'dispatch'],
        content: "We offer two reliable shipping channels from China to Ghana: 1) Express Air Cargo: 7 to 14 business days (approx. 2 to 3 weeks total cycle), ideal for urgent items, fashion, and lightweight goods. 2) Sea Cargo Freight: 30 to 60 business days (approx. 6 to 8 weeks), economical for bulk inventory, home goods, and heavy items. Once goods land at our Accra Central distribution hub, we offer pickup or dispatch across Ghana (Accra/Tema riders, Kumasi, Takoradi, Tamale, and nationwide via VIP/STC parcel services).",
        actionLink: { label: "View Shipping Policy", href: "/shipping-policy" },
        quickReplies: [
            { label: "Air vs Sea Freight", query: "What is the difference between air and sea shipping?" },
            { label: "Delivery in Ghana", query: "How do you deliver outside Accra?" }
        ]
    },
    {
        id: 'POL-PAYMENT',
        category: 'policy',
        title: 'Payment Methods & USSD Shortcode',
        keywords: ['payment', 'how to pay', 'momo', 'mtn', 'telecel', 'vodafone', 'airteltigo', 'at money', 'card', 'visa', 'mastercard', 'ussd', '*713*7453#', 'deposit'],
        content: "We accept secure payments through Hubtel in Ghana Cedis (GH₵). You can pay online using MTN Mobile Money, Telecel Cash, AT Money, or Visa/Mastercard. You can also pay offline from any mobile phone by dialing Hubtel USSD *713*7453# (London's Imports) and quoting your order number as reference. For pre-orders, you can pay a commitment deposit upfront and clear the balance upon arrival in Accra.",
        actionLink: { label: "Payment Information", href: "/checkout" },
        quickReplies: [
            { label: "Pay via USSD: *713*7453#", query: "How do I pay using USSD code *713*7453#?" },
            { label: "Track My Order", query: "Track my order" }
        ]
    },
    {
        id: 'POL-REFUND',
        category: 'policy',
        title: 'Refund & Cancellation Policy',
        keywords: ['refund', 'cancel order', 'cancellation', 'money back', 'return', 'damaged', 'supplier out of stock'],
        content: "Under our transparent refund policy: 1) Full Refund: If a China supplier cannot fulfill your order, if duplicate payment occurs, or if you cancel before the batch cutoff date. 2) After Batch Cutoff: Once goods are procured and consolidated for freight departure from China, orders cannot be canceled. 3) Damaged / Incorrect Items: If an item arrives damaged or incorrect from the factory, report it within 48 hours with inspection photos for prompt replacement or refund. Refunds are processed to your Mobile Money or card within 3 to 7 business days.",
        actionLink: { label: "Read Refund Policy", href: "/refunds" },
        quickReplies: [
            { label: "How to Request Refund", query: "What is the refund process?" },
            { label: "Talk to Human Support", query: "Connect me to human support" }
        ]
    },
    {
        id: 'POL-PROHIBITED',
        category: 'policy',
        title: 'Prohibited & Restricted Items',
        keywords: ['prohibited', 'banned', 'restricted', 'cannot ship', 'weapons', 'drugs', 'dangerous goods', 'contraband'],
        content: "Under Ghana Revenue Authority (GRA) laws and international aviation regulations, we strictly cannot import: weapons, firearms, tactical gear, imitation firearms, fireworks, combustible/flammable chemicals, narcotics, counterfeit currency, pornography, or perishable raw foods. All cargo undergoes strict security screening before departure.",
        actionLink: { label: "Prohibited Items List", href: "/prohibited-items" },
        quickReplies: [
            { label: "Check Prohibited Items", query: "What items are prohibited?" },
            { label: "Shipping Guidelines", query: "What is your shipping policy?" }
        ]
    },

    // --- FREQUENTLY ASKED QUESTIONS (FAQS) ---
    {
        id: 'FAQ-WHY-PREORDER',
        category: 'faq',
        title: 'Why pre-order instead of buying locally?',
        keywords: ['why preorder', 'why pre-order', 'cheaper', 'savings', 'benefit of preorder'],
        content: "Pre-ordering directly from China factories eliminates middleman retail markups, saving you between 20% to 40% on identical items. It also gives you early access to unique, high-demand goods before they hit the local market in Ghana.",
        actionLink: { label: "Browse Catalog", href: "/products" },
        quickReplies: [
            { label: "Browse Catalog", query: "Browse catalog" },
            { label: "How Pre-Orders Work", query: "How do pre-orders work?" }
        ]
    },
    {
        id: 'FAQ-DELIVERY-FAILS',
        category: 'faq',
        title: 'What if my item does not arrive?',
        keywords: ['item not arrive', 'lost package', 'package missing', 'undelivered'],
        content: "If an overseas batch is lost or delivery fails for any reason, you are 100% financially protected with a full refund. We maintain a high on-time delivery track record, and your funds remain protected until order fulfillment.",
        actionLink: { label: "Read Refund Policy", href: "/refunds" },
        quickReplies: [
            { label: "Track Shipment", query: "Track my order" },
            { label: "Talk to Human Support", query: "Can I speak to someone on WhatsApp?" }
        ]
    },
    {
        id: 'FAQ-CONTACT-HUMAN',
        category: 'contact',
        title: 'Contact Human Management & Operations',
        keywords: ['human', 'agent', 'person', 'talk to us', 'speak to someone', 'customer care', 'whatsapp number', 'call', 'office address', 'danfa'],
        content: "You can talk directly to our human customer service and logistics management team at any time! We are available on WhatsApp and phone: Primary Concierge: +233 54 524 7009 | Secondary Support: +233 54 514 2658. Our physical hub is located at Danfa Road near Twinkle Angle School, Danfa, Accra.",
        actionLink: { label: "Chat on WhatsApp (+233 54 524 7009)", href: "https://wa.me/233545247009?text=Hello%20London%27s%20Imports%2C%20I%20would%20like%20to%20speak%20with%20a%20human%20representative" },
        quickReplies: [
            { label: "Primary WhatsApp (+233 54 524 7009)", query: "Connect me to primary WhatsApp line" },
            { label: "Secondary Line (+233 54 514 2658)", query: "Can I reach your secondary WhatsApp line at +233 54 514 2658?" }
        ]
    }
];

export interface SearchKnowledgeResult {
    found: boolean;
    item?: KnowledgeItem;
    content: string;
    actionLink?: { label: string; href: string };
    quickReplies?: Array<{ label: string; query: string }>;
    needsHumanEscalation?: boolean;
}

/**
 * Searches the store knowledge base dynamically.
 * If no confident answer is found, provides a secure, graceful human escalation payload.
 */
export function searchStoreKnowledge(query: string): SearchKnowledgeResult {
    if (!query || typeof query !== 'string') {
        return getHumanEscalationResult("General Inquiry");
    }

    const cleanQuery = query.toLowerCase().trim();

    // 1. Direct human escalation request
    if (/\b(human|agent|person|representative|manager|speak to someone|call you|talk to you|support team)\b/i.test(cleanQuery)) {
        const contactItem = STORE_KNOWLEDGE.find(k => k.id === 'FAQ-CONTACT-HUMAN');
        return {
            found: true,
            item: contactItem,
            content: contactItem ? contactItem.content : "You can reach our human concierge team directly on WhatsApp at +233 54 524 7009 or backup line +233 54 514 2658.",
            actionLink: contactItem?.actionLink || { label: "Chat on WhatsApp (+233 54 524 7009)", href: "https://wa.me/233545247009" },
            quickReplies: contactItem?.quickReplies,
            needsHumanEscalation: true
        };
    }

    // 2. High-priority policy queries ("what are the policies", "pull them out", "store policies")
    if (/\b(polic(y|ies)|rules|terms|store\s*guidelines|pull\s*them\s*(out)?|bring\s*them\s*(out)?|show\s*them|tell\s*me\s*the\s*policies)\b/i.test(cleanQuery)) {
        const polItem = STORE_KNOWLEDGE.find(k => k.id === 'POL-ALL-POLICIES');
        if (polItem) {
            return {
                found: true,
                item: polItem,
                content: polItem.content,
                actionLink: polItem.actionLink,
                quickReplies: polItem.quickReplies,
                needsHumanEscalation: false
            };
        }
    }

    // 3. High-priority website information queries ("what about the website", "can you find information", "about website")
    if (/\b(website|find\s*information|about\s*(the\s*)?website|what\s*about\s*the\s*website|features\s*of\s*the\s*website)\b/i.test(cleanQuery)) {
        const featItem = STORE_KNOWLEDGE.find(k => k.id === 'FEAT-WEBSITE-OVERVIEW');
        if (featItem) {
            return {
                found: true,
                item: featItem,
                content: featItem.content,
                actionLink: featItem.actionLink,
                quickReplies: featItem.quickReplies,
                needsHumanEscalation: false
            };
        }
    }

    // 4. Score knowledge items based on title, keywords, and text
    let bestScore = 0;
    let bestItem: KnowledgeItem | null = null;

    for (const item of STORE_KNOWLEDGE) {
        let score = 0;
        const titleLower = item.title.toLowerCase();

        // Exact title match
        if (cleanQuery.includes(titleLower) || titleLower.includes(cleanQuery)) {
            score += 10;
        }

        // Keyword matches
        for (const kw of item.keywords) {
            const kwLower = kw.toLowerCase();
            if (cleanQuery.includes(kwLower)) {
                score += kwLower.length > 5 ? 5 : 3;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestItem = item;
        }
    }

    // If confidence score is sufficient, return official knowledge
    if (bestItem && bestScore >= 3) {
        return {
            found: true,
            item: bestItem,
            content: bestItem.content,
            actionLink: bestItem.actionLink,
            quickReplies: bestItem.quickReplies,
            needsHumanEscalation: false
        };
    }

    // 3. Fallback: Query not covered in standard published knowledge base
    return getHumanEscalationResult(query);
}

/**
 * Returns a warm, secure fallback with direct WhatsApp human escalation options
 */
export function getHumanEscalationResult(topic: string): SearchKnowledgeResult {
    const safeTopic = topic.slice(0, 60).replace(/[^\w\s-]/g, '').trim() || 'Inquiry';
    const waText = `Hello London's Imports, I have an inquiry regarding: ${safeTopic}`;
    const waUrl = `https://wa.me/233545247009?text=${encodeURIComponent(waText)}`;

    return {
        found: false,
        content: `I don't have that specific detail in our published store guidelines, but our human customer care and logistics team is right here to help you! You can chat directly with our team on WhatsApp at +233 54 524 7009 (or backup line +233 54 514 2658).`,
        actionLink: {
            label: "Chat with Us on WhatsApp",
            href: waUrl
        },
        quickReplies: [
            { label: "Chat on WhatsApp", query: `Connect me to WhatsApp for ${safeTopic}` },
            { label: "Track My Order", query: "Track my order" },
            { label: "Browse Catalog", query: "Browse catalog" }
        ],
        needsHumanEscalation: true
    };
}
