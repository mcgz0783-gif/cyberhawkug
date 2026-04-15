export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CyberHawk-UG",
  url: "https://www.cyberhawk-ug.store",
  logo: "https://www.cyberhawk-ug.store/icon-512.png",
  description: "East Africa's premier cybersecurity intelligence and training platform.",
  sameAs: [],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CyberHawk-UG",
  url: "https://www.cyberhawk-ug.store",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.cyberhawk-ug.store/store?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const buildArticleJsonLd = (post: {
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  published_at?: string | null;
  cover_url?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.excerpt,
  url: `https://www.cyberhawk-ug.store/blog/${post.slug}`,
  image: post.cover_url || "https://www.cyberhawk-ug.store/icon-512.png",
  author: { "@type": "Organization", name: post.author },
  publisher: {
    "@type": "Organization",
    name: "CyberHawk-UG",
    logo: { "@type": "ImageObject", url: "https://www.cyberhawk-ug.store/icon-512.png" },
  },
  datePublished: post.published_at || undefined,
});

export const buildProductJsonLd = (ebook: {
  title: string;
  description: string;
  slug: string;
  price: number;
  cover_url?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: ebook.title,
  description: ebook.description,
  url: `https://www.cyberhawk-ug.store/store/${ebook.slug}`,
  image: ebook.cover_url || "https://www.cyberhawk-ug.store/icon-512.png",
  brand: { "@type": "Organization", name: "CyberHawk-UG" },
  offers: {
    "@type": "Offer",
    price: (ebook.price / 100).toFixed(2),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `https://www.cyberhawk-ug.store/store/${ebook.slug}`,
  },
});
