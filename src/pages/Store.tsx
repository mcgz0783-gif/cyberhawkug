import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import CyberButton from "@/components/ui/CyberButton";
import ThreatBadge from "@/components/ui/ThreatBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] as const },
  },
};

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const Store = () => {
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("ebooks")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (data) setEbooks(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handlePurchase = async (ebookId: string) => {
    if (!user) { navigate("/login"); return; }
    setCheckoutLoading(ebookId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { ebookId },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
      if (data?.error) alert(data.error);
    } catch (err: any) {
      alert(err.message || "Checkout failed");
    }
    setCheckoutLoading(null);
  };

  return (
    <Layout>
      <section className="py-[12vh] border-b border-border">
        <div className="container mx-auto px-6">
          <span className="font-mono text-xs text-primary tracking-widest uppercase">// THREAT INTEL STORE</span>
          <h1 className="font-display font-bold tracking-[0.15em] uppercase text-foreground mt-3" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>
            CLASSIFIED <span className="text-primary">REPORTS</span>
          </h1>
          <p className="font-body font-light text-lg text-muted-foreground max-w-[65ch] mt-6 leading-relaxed">
            Actionable threat intelligence reports and security playbooks. Authored by CyberHawk-UG's elite analysts with deep East African expertise.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <p className="font-mono text-sm text-muted-foreground animate-pulse">LOADING INTEL...</p>
            </div>
          ) : ebooks.length === 0 ? (
            <div className="text-center py-20 border border-border bg-card p-12">
              <p className="font-mono text-sm text-muted-foreground">NO REPORTS AVAILABLE AT THIS TIME</p>
              <p className="font-body text-sm text-muted-foreground mt-2">Check back soon for new threat intelligence releases.</p>
            </div>
          ) : (
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
            >
              {ebooks.map((ebook, i) => (
                <motion.div
                  key={ebook.id}
                  variants={fadeUp}
                  className="group border border-border bg-card flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_-2px_0_0_hsl(173,100%,50%),0_0_15px_hsla(173,100%,50%,0.1)]"
                >
                  <div className="aspect-[3/2] bg-secondary/50 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 dot-grid opacity-50" />
                    {ebook.cover_url ? (
                      <img src={ebook.cover_url} alt={ebook.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="relative text-center p-6">
                        <div className="font-mono text-xs text-muted-foreground mb-2">{ebook.category}</div>
                        <div className="font-display font-semibold text-lg tracking-wider uppercase text-foreground leading-tight">
                          {ebook.title}
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 font-mono text-[10px] text-muted-foreground/50">
                      CH-TIR-{String(i + 1).padStart(3, "0")}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    {ebook.tags?.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {ebook.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="font-mono text-[10px] text-muted-foreground border border-border px-2 py-0.5">{tag}</span>
                        ))}
                      </div>
                    )}
                    <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-foreground mb-2">{ebook.title}</h3>
                    <p className="font-body font-light text-sm text-muted-foreground leading-relaxed flex-1">
                      {ebook.description}
                    </p>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                      <span className="font-mono text-lg text-primary">{formatPrice(ebook.price)}</span>
                      <button
                        onClick={() => handlePurchase(ebook.id)}
                        disabled={checkoutLoading === ebook.id}
                        className="px-6 py-2 font-display font-bold tracking-widest uppercase text-xs cyber-clip bg-primary text-primary-foreground hover:brightness-125 transition-all disabled:opacity-50"
                      >
                        {checkoutLoading === ebook.id ? "LOADING..." : "PURCHASE"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Store;
