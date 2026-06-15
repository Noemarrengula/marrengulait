import { Product } from '@/types/database';

interface ProductSchemaProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    compare_at_price?: number;
    images?: { image_url: string }[];
    rating?: number;
    review_count?: number;
    brand?: string;
    sku?: string;
    stock_quantity?: number;
    category?: { name: string };
    vendor?: { store_name: string };
  };
  locale?: string;
}

export function ProductSchema({ product, locale = 'pt-MZ' }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `${product.name} - Compre em Marrengula-IT, Moçambique`,
    "image": product.images?.map(img => img.image_url) || [],
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Marrengula-IT"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://marrengulait.com/produto/${product.id}`,
      "priceCurrency": "MZN",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      "availability": product.stock_quantity && product.stock_quantity > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": product.vendor?.store_name || "Marrengula-IT"
      }
    },
    "aggregateRating": product.rating && product.review_count
      ? {
          "@type": "AggregateRating",
          "ratingValue": product.rating.toFixed(1),
          "reviewCount": product.review_count
        }
      : undefined
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: {
    name: string;
    url: string;
  }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `https://marrengulait.com${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface OrganizationSchemaProps {
  name?: string;
  logo?: string;
  url?: string;
}

export function OrganizationSchema({ 
  name = "Marrengula-IT", 
  logo = "/logo.png", 
  url = "https://marrengulait.com" 
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": `${url}${logo}`,
    "description": "Loja online de tecnologia em Moçambique. Laptops, smartphones, eletrónica, CCTV e muito mais.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Maputo",
      "addressCountry": "MZ"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+258-864738133",
      "contactType": "customer service",
      "availableLanguage": ["Portuguese", "English"]
    },
    "sameAs": [
      "https://facebook.com/marrengulait",
      "https://instagram.com/marrengulait"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebSiteSchemaProps {
  name?: string;
  url?: string;
}

export function WebSiteSchema({ 
  name = "Marrengula-IT", 
  url = "https://marrengulait.com" 
}: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "url": url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/produtos?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface LocalBusinessSchemaProps {
  name?: string;
  address?: string;
  phone?: string;
  openingHours?: string;
}

export function LocalBusinessSchema({
  name = "Marrengula-IT",
  address = "Maputo, Moçambique",
  phone = "+258-864738133",
  openingHours = "Mo-Fr 08:00-18:00"
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    "name": name,
    "description": "Loja de tecnologia e eletrónica em Moçambique",
    "image": "https://marrengulait.com/logo.png",
    "url": "https://marrengulait.com",
    "telephone": phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": address,
      "addressCountry": "MZ"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    "priceRange": "$$"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQPageSchemaProps {
  faqs: {
    question: string;
    answer: string;
  }[];
}

export function FAQPageSchema({ faqs }: FAQPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function generateSitemap() {
  const baseUrl = "https://marrengulait.com";
  
  const staticPages = [
    { url: baseUrl, priority: "1.0", changefreq: "daily" },
    { url: `${baseUrl}/produtos`, priority: "0.9", changefreq: "daily" },
    { url: `${baseUrl}/servicos`, priority: "0.8", changefreq: "weekly" },
    { url: `${baseUrl}/sobre`, priority: "0.7", changefreq: "monthly" },
    { url: `${baseUrl}/afiliados`, priority: "0.7", changefreq: "weekly" },
    { url: `${baseUrl}/auth`, priority: "0.6", changefreq: "monthly" },
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`;
}
