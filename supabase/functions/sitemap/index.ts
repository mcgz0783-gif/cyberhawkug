import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://www.cyberhawk-ug.store";

const staticPages = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/about", changefreq: "monthly", priority: "0.8" },
  { loc: "/store", changefreq: "weekly", priority: "0.9" },
  { loc: "/blog", changefreq: "daily", priority: "0.9" },
  { loc: "/contact", changefreq: "monthly", priority: "0.6" },
  { loc: "/login", changefreq: "monthly", priority: "0.4" },
  { loc: "/register", changefreq: "monthly", priority: "0.4" },
  { loc: "/legal/terms", changefreq: "yearly", priority: "0.3" },
  { loc: "/legal/privacy", changefreq: "yearly", priority: "0.3" },
  { loc: "/legal/refund", changefreq: "yearly", priority: "0.3" },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toW3CDate(date: string): string {
  return new Date(date).toISOString().split("T")[0];
}

function urlEntry(
  loc: string,
  opts: { lastmod?: string; changefreq?: string; priority?: string }
): string {
  let entry = `  <url>\n    <loc>${escapeXml(loc)}</loc>`;
  if (opts.lastmod) entry += `\n    <lastmod>${opts.lastmod}</lastmod>`;
  if (opts.changefreq)
    entry += `\n    <changefreq>${opts.changefreq}</changefreq>`;
  if (opts.priority) entry += `\n    <priority>${opts.priority}</priority>`;
  entry += `\n  </url>`;
  return entry;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch published blog posts and ebooks in parallel
    const [blogRes, ebookRes] = await Promise.all([
      supabase
        .from("blog_posts")
        .select("slug, updated_at, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false }),
      supabase
        .from("ebooks")
        .select("slug, updated_at")
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
    ]);

    const urls: string[] = [];

    // Static pages
    for (const page of staticPages) {
      urls.push(
        urlEntry(`${BASE_URL}${page.loc}`, {
          changefreq: page.changefreq,
          priority: page.priority,
        })
      );
    }

    // Blog posts
    if (blogRes.data) {
      for (const post of blogRes.data) {
        urls.push(
          urlEntry(`${BASE_URL}/blog/${post.slug}`, {
            lastmod: toW3CDate(post.updated_at || post.published_at),
            changefreq: "weekly",
            priority: "0.7",
          })
        );
      }
    }

    // Ebooks
    if (ebookRes.data) {
      for (const ebook of ebookRes.data) {
        urls.push(
          urlEntry(`${BASE_URL}/store/${ebook.slug}`, {
            lastmod: toW3CDate(ebook.updated_at),
            changefreq: "monthly",
            priority: "0.8",
          })
        );
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
