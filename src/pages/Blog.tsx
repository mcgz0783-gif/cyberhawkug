import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ThreatBadge from "@/components/ui/ThreatBadge";
import { Link } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";

const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] as const },
  },
};

const categories = ["ALL", "RANSOMWARE", "ZERO-DAY", "AI THREATS", "DATA BREACH", "PHISHING", "INFRASTRUCTURE", "ADVISORY", "GENERAL"];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  is_published: boolean;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    const fetch = async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      
      if (activeCategory !== "ALL") {
        query = query.eq("category", activeCategory);
      }

      const { data } = await query;
      if (data) setPosts(data);
      setLoading(false);
    };
    fetch();
  }, [activeCategory]);

  return (
    <Layout>
      <SEO title="Threat Blog" description="Stay updated with the latest cybersecurity threats, advisories, and analysis from CyberHawk-UG's research team." path="/blog" />
      <section className="py-[12vh] border-b border-border">
        <div className="container mx-auto px-6">
          <span className="font-mono text-xs text-primary tracking-widest uppercase">// THREAT INTELLIGENCE BLOG</span>
          <h1 className="font-display font-bold tracking-[0.15em] uppercase text-foreground mt-3" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>
            THREAT <span className="text-primary">INTEL</span> FEED
          </h1>
          <p className="font-body font-light text-lg text-muted-foreground max-w-[65ch] mt-6 leading-relaxed">
            Real-time threat advisories, security analysis, and incident reports from our Security Operations Center.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setLoading(true); }}
                className={`font-mono text-xs tracking-wider uppercase px-4 py-2 border transition-colors duration-250 ${
                  activeCategory === cat ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <p className="font-mono text-sm text-muted-foreground animate-pulse">LOADING INTEL...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 border border-border bg-card p-12">
              <p className="font-mono text-sm text-muted-foreground">NO POSTS IN THIS CATEGORY</p>
            </div>
          ) : (
            <motion.div initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.1 }} className="flex flex-col gap-2">
              {posts.map((post) => (
                <motion.article key={post.id} variants={fadeUp}
                  className="group border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_-2px_0_0_hsl(173,100%,50%),0_0_15px_hsla(173,100%,50%,0.1)]">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                     {post.cover_url && (
                       <Link to={`/blog/${post.slug}`} className="shrink-0 w-full md:w-48 aspect-[3/2] overflow-hidden border border-border bg-secondary">
                         <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                       </Link>
                     )}
                     <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {post.threat_level && <ThreatBadge level={post.threat_level} />}
                        <span className="font-mono text-xs text-muted-foreground">{post.category}</span>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <h2 className="font-display font-semibold text-xl tracking-wider uppercase text-foreground mb-3 group-hover:text-primary transition-colors duration-250">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                      <div className="flex items-center gap-6 mt-4">
                        {post.read_time && (
                          <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {post.read_time}
                          </span>
                        )}
                        {post.published_at && (
                          <span className="font-mono text-xs text-muted-foreground">
                            {new Date(post.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link to={`/blog/${post.slug}`} className="shrink-0 self-center text-primary hover:translate-x-1 transition-transform duration-250">
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
