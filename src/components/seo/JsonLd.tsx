import { siteConfig } from "@/config/site";

/**
 * London's Imports - Structured Data (JSON-LD) Components
 * Separated to reduce layout bloat and improve component memoization.
 */

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": "https://londonsimports.com/#organization",
    "name": "London's Imports Ghana",
    "legalName": "London's Imports Ghana Limited",
    "alternateName": ["Mini Importation Ghana", "Londons Imports GH"],
    "url": "https://londonsimports.com",
    "description": "Ghana's leading shopping service and shipping system (mini-importation, air freight, and procurement). Shop from 1688, Alibaba, and Taobao directly to Accra, Kumasi, and Tema. Trusted by thousands of Ghanaian business owners with door-to-door delivery.",
    "logo": "https://londonsimports.com/logo.jpg",
    "image": "https://londonsimports.com/og-image.jpg",
    "telephone": [`+${siteConfig.whatsapp}`, `+${siteConfig.concierge}`],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": `+${siteConfig.whatsapp}`,
        "contactType": "customer support",
        "areaServed": "GH",
        "availableLanguage": "en"
      },
      {
        "@type": "ContactPoint",
        "telephone": `+${siteConfig.concierge}`,
        "contactType": "order help and tracking",
        "areaServed": "GH",
        "availableLanguage": "en"
      }
    ],
    "email": "info@londonsimports.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "danfa road nearTwinkle angle school, Danfa",
      "addressLocality": "Accra",
      "addressRegion": "Greater Accra",
      "postalCode": "GM-1739",
      "addressCountry": "GH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 5.7821,
      "longitude": -0.1517
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "areaServed": [
      { "@type": "City", "name": "Accra", "containedInPlace": { "@type": "AdministrativeArea", "name": "Greater Accra Region" } },
      { "@type": "City", "name": "Tema" },
      { "@type": "City", "name": "Ashaiman" },
      { "@type": "City", "name": "Madina" },
      { "@type": "City", "name": "East Legon" },
      { "@type": "City", "name": "Spintex" },
      { "@type": "City", "name": "Teshie" },
      { "@type": "City", "name": "Nungua" },
      { "@type": "City", "name": "Lashibi" },
      { "@type": "City", "name": "Takoradi" },
      { "@type": "City", "name": "Cape Coast" },
      { "@type": "City", "name": "Koforidua" },
      { "@type": "City", "name": "Sunyani" },
      { "@type": "City", "name": "Tamale" },
      { "@type": "AdministrativeArea", "name": "Greater Accra Region" },
      { "@type": "AdministrativeArea", "name": "Ashanti Region" },
      { "@type": "Country", "name": "Ghana" }
    ],
    "priceRange": "GH₵₵",
    "currenciesAccepted": "GHS",
    "paymentAccepted": "Mobile Money (Momo), MTN MoMo, Vodafone Cash, AirtelTigo Money, Bank Transfer",
    "sameAs": [
      "https://instagram.com/londonsimports",
      "https://tiktok.com/@londonsimports",
      "https://snapchat.com/add/londonsimports",
      "https://x.com/londonsimports",
      siteConfig.socials.whatsapp,
      siteConfig.socials.concierge,
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Mini Importation Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "China to Ghana Shipping",
            "description": "Door-to-door shipping from China to Accra, Kumasi, Tema"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Customs Clearance",
            "description": "We handle all Ghana customs duties and clearance"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Shopping Agent",
            "description": "Find suppliers on 1688 and Alibaba for Ghana businesses"
          }
        }
      ]
    }
  };

  return (
    <script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "London's Imports",
    "url": "https://londonsimports.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://londonsimports.com/products?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      id="search-box-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I buy from China to Ghana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "With London's Imports, you can easily buy from China (1688, Alibaba, Taobao) and have it shipped to Ghana. Simply browse our products, place your order, pay with Mobile Money, and we handle shipping, customs clearance, and doorstep delivery to Accra, Tema, Kumasi, and anywhere in Ghana."
        }
      },
      {
        "@type": "Question",
        "name": "What is mini importation in Ghana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mini importation is the process of buying goods in small quantities from overseas suppliers (mainly China) and having them shipped to Ghana. It's popular for electronics, fashion, gadgets, and wholesale goods. London's Imports makes this easy by handling all logistics."
        }
      },
      {
        "@type": "Question",
        "name": "How much does shipping from China to Ghana cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Shipping costs vary based on weight, size, and shipping method (air or sea). Air freight from China to Ghana typically costs GHS 50-150 per kg. London's Imports offers transparent pricing with no hidden fees. Use our customs estimator for accurate quotes."
        }
      },
      {
        "@type": "Question",
        "name": "Can I pay with Mobile Money for China imports?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! London's Imports accepts MTN Mobile Money, AirtelTigo Money, and Vodafone Cash. You can pay in Ghana Cedis (GHS) for all your orders from China. No need for international cards or foreign currency."
        }
      },
      {
        "@type": "Question",
        "name": "How long does shipping from China to Accra take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Air freight from China to Accra typically takes 7-14 days. Sea freight takes 30-45 days but is more affordable for heavy items. London's Imports provides real-time tracking so you always know where your package is."
        }
      },
      {
        "@type": "Question",
        "name": "Do you handle customs clearance in Ghana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, London's Imports handles all customs duties and clearance at Tema Port and Kotoka International Airport. The price you see includes customs fees - no surprises. We're licensed clearance agents with years of experience."
        }
      },
      {
        "@type": "Question",
        "name": "Do you deliver to Tema, Ashaiman, and Madina?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer door-to-door delivery across Greater Accra including Tema, Ashaiman, Madina, East Legon, Spintex, Teshie, Nungua, Dansoman, and more. We also deliver to Kumasi, Takoradi, Cape Coast, and all major cities in Ghana."
        }
      }
    ]
  };

  return (
    <script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://londonsimports.com" },
      { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://londonsimports.com/products" },
      { "@type": "ListItem", "position": 3, "name": "How it Works", "item": "https://londonsimports.com/how-it-works" },
      { "@type": "ListItem", "position": 4, "name": "Shopping Tips", "item": "https://londonsimports.com/blog" }
    ]
  };

  return (
    <script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * ACCESSIBILITY SEO: Tells Search Engines (Google/Bing) that the site is fully accessible.
 * This can boost ranking as accessibility is a high-quality signal for modern algorithms.
 */
export function AccessibilitySchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "accessibilityFeature": [
      "alternativeText",
      "ariaLabels",
      "colorContrast",
      "displayTransformability",
      "readingOrder",
      "structuralNavigation",
      "unlocked"
    ],
    "accessibilityControl": [
      "fullKeyboardControl",
      "fullMouseControl",
      "fullTouchControl"
    ],
    "accessibilityHazard": "none",
    "accessibilitySummary": "London's Imports is committed to providing a digitally accessible shopping experience for all shoppers in Ghana. Our platform features high-contrast visuals, screen-reader optimized product descriptions, full keyboard navigation, and aria-compliant interactive elements."
  };

  return (
    <script
      id="accessibility-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
