import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ThreatBadge from "@/components/ui/ThreatBadge";
import { Clock, ArrowLeft, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("is_published", true)
        .single();
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <p className="font-mono text-sm text-muted-foreground animate-pulse">LOADING INTEL...</p>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <p className="font-mono text-sm text-muted-foreground mb-6">POST NOT FOUND</p>
          <Link to="/blog" className="font-mono text-xs text-primary hover:underline">← BACK TO BLOG</Link>
        </div>
      </Layout>
    );
  }

  // Simple markdown-like rendering: paragraphs, headers, bold, code blocks
  const renderContent = (content: string) => {
    const blocks = content.split("\n\n");
    return blocks.map((block, i) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith("### ")) {
        return <h3 key={i} className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mt-8 mb-3">{trimmed.slice(4)}</h3>;
      }
      if (trimmed.startsWith("## ")) {
        return <h2 key={i} className="font-display font-bold text-xl tracking-wider uppercase text-foreground mt-10 mb-4">{trimmed.slice(3)}</h2>;
      }
      if (trimmed.startsWith("# ")) {
        return <h2 key={i} className="font-display font-bold text-2xl tracking-wider uppercase text-foreground mt-10 mb-4">{trimmed.slice(2)}</h2>;
      }
      if (trimmed.startsWith("```")) {
        const code = trimmed.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
        return (
          <pre key={i} className="bg-secondary border border-border p-4 my-4 overflow-x-auto">
            <code className="font-mono text-sm text-primary">{code}</code>
          </pre>
        );
      }

      // Render inline formatting
      const html = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
        .replace(/`(.*?)`/g, '<code class="font-mono text-primary bg-secondary px-1">$1</code>')
        .replace(/\n/g, "<br />");

      return (
        <p key={i} className="font-body font-light text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: html }} />
      );
    });
  };

  return (
    <Layout>
      <article>
        <section className="py-[10vh] border-b border-border">
          <div className="container mx-auto px-6 max-w-4xl">
            <Link to="/blog" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="w-3 h-3" /> BACK TO INTEL FEED
            </Link>

            <div className="flex items-center gap-3 mb-4">
              {post.threat_level && <ThreatBadge level={post.threat_level} />}
              <span className="font-mono text-xs text-muted-foreground">{post.category}</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display font-bold tracking-[0.1em] uppercase text-foreground mb-6"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
            >
              {post.title}
            </motion.h1>

            <p className="font-body font-light text-lg text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>

            <div className="flex items-center gap-6 font-mono text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.published_at ? new Date(post.published_at).toLocaleDateString() : "DRAFT"}</span>
              {post.read_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time}</span>}
              <span>{post.author}</span>
            </div>
          </div>
        </section>

        {post.cover_url && (
          <section className="border-b border-border">
            <div className="container mx-auto px-6 max-w-4xl py-8">
              <img src={post.cover_url} alt={post.title} className="w-full max-h-[400px] object-cover border border-border" />
            </div>
          </section>
        )}

        <section className="py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="container mx-auto px-6 max-w-4xl"
          >
            {renderContent(post.content)}

            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="font-mono text-xs text-muted-foreground border border-border px-3 py-1">{tag}</span>
                ))}
              </div>
            )}
          </motion.div>
        </section>
      </article>
    </Layout>
  );
};

export default BlogPost;
