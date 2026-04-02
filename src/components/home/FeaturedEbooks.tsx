import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CyberButton from "@/components/ui/CyberButton";

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] as const },
  },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const FeaturedEbooks = () => {
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from("ebooks")
        .select("*")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("sort_order", { ascending: true })
        .limit(3);
      if (data) setEbooks(data);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="font-mono text-sm text-muted-foreground animate-pulse">
            LOADING FEATURED INTEL...
          </p>
        </div>
      </section>
    );
  }

  if (ebooks.length === 0) return null;

  return (
    <section className="py-24 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-primary tracking-widest uppercase">
            // FEATURED REPORTS
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-[0.1em] uppercase text-foreground mt-3">
            TOP SECRET INTEL
          </h2>
          <p className="font-body font-light text-lg text-muted-foreground max-w-[55ch] mx-auto mt-4 leading-relaxed">
            Our most critical threat intelligence reports — hand-picked by CyberHawk-UG analysts.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
        >
          {ebooks.map((ebook, i) => (
            <motion.div
              key={ebook.id}
              variants={fadeUp}
              className="group border border-border bg-card flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_-2px_0_0_hsl(var(--primary)),0_0_15px_hsl(var(--primary)/0.1)]"
            >
              <div className="aspect-[3/2] bg-secondary/50 relative overflow-hidden flex items-center justify-center">
                {ebook.cover_url ? (
                  <img
                    src={ebook.cover_url}
                    alt={ebook.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="relative text-center p-6">
                    <div className="font-mono text-xs text-muted-foreground mb-2">
                      {ebook.category}
                    </div>
                    <div className="font-display font-semibold text-lg tracking-wider uppercase text-foreground leading-tight">
                      {ebook.title}
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-primary text-primary-foreground tracking-wider">
                    FEATURED
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                {ebook.tags?.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {ebook.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] text-muted-foreground border border-border px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <Link to={`/store/${ebook.slug}`}>
                  <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-foreground mb-2 hover:text-primary transition-colors">
                    {ebook.title}
                  </h3>
                </Link>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                  {ebook.description}
                </p>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <span className="font-mono text-lg text-primary">
                    {formatPrice(ebook.price)}
                  </span>
                  <Link
                    to={`/store/${ebook.slug}`}
                    className="px-4 py-2 font-display font-bold tracking-widest uppercase text-xs border border-primary/30 text-primary hover:bg-primary/10 transition-all flex items-center gap-1"
                  >
                    VIEW <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <CyberButton variant="secondary" href="/store">
            <span className="flex items-center gap-2">
              VIEW ALL REPORTS <ChevronRight className="w-4 h-4" />
            </span>
          </CyberButton>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEbooks;
