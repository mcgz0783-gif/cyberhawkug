import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedAt?: string;
  author?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_NAME = "CyberHawk-UG";
const BASE_URL = "https://www.cyberhawk-ug.store";
const DEFAULT_IMAGE = `${BASE_URL}/icon-512.png`;

const SEO = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedAt,
  author,
  jsonLd,
}: SEOProps) => {
  const fullTitle = path === "/" ? `${SITE_NAME} — Cybersecurity for East Africa` : `${title} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article-specific */}
      {type === "article" && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

// Reusable JSON-LD helpers
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
