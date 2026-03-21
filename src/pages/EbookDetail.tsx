import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, ShoppingBag, FileText, CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const EbookDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ebook, setEbook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState<any>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchEbook = async () => {
      const { data } = await supabase
        .from("ebooks")
        .select("*")
        .eq("slug", slug!)
        .eq("is_published", true)
        .single();
      setEbook(data);
      setLoading(false);
    };
    fetchEbook();
  }, [slug]);

  // Check if already purchased
  useEffect(() => {
    if (user && ebook) {
      supabase
        .from("purchases")
        .select("id, status, download_count")
        .eq("user_id", user.id)
        .eq("ebook_id", ebook.id)
        .eq("status", "COMPLETED")
        .maybeSingle()
        .then(({ data }) => setPurchase(data));
    }
  }, [user, ebook]);

  const handlePurchase = async () => {
    if (!user) { navigate("/login"); return; }
    if (!ebook) return;
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { ebookId: ebook.id },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      if (data?.url) window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!purchase) return;
    setDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke("download-ebook", {
        body: { purchaseId: purchase.id },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error(err.message || "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <p className="font-mono text-sm text-muted-foreground animate-pulse">LOADING INTEL...</p>
        </div>
      </Layout>
    );
  }

  if (!ebook) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <p className="font-mono text-sm text-muted-foreground mb-6">REPORT NOT FOUND</p>
          <Link to="/store" className="font-mono text-xs text-primary hover:underline">← BACK TO STORE</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-[10vh] border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link to="/store" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-3 h-3" /> BACK TO INTEL STORE
          </Link>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Cover */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="shrink-0 w-full md:w-72"
            >
              <div className="aspect-[3/4] border border-border bg-secondary overflow-hidden">
                {ebook.cover_url ? (
                  <img src={ebook.cover_url} alt={ebook.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6">
                    <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                    <span className="font-mono text-xs text-muted-foreground text-center">{ebook.category}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex-1"
            >
              {ebook.category && (
                <span className="font-mono text-xs text-primary tracking-widest uppercase">{ebook.category}</span>
              )}
              <h1 className="font-display font-bold tracking-[0.1em] uppercase text-foreground mt-2 mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
                {ebook.title}
              </h1>

              {ebook.author && (
                <p className="font-body text-sm text-muted-foreground mb-4">By {ebook.author}</p>
              )}

              <p className="font-body font-light text-muted-foreground leading-relaxed mb-6">
                {ebook.description}
              </p>

              {/* Tags */}
              {ebook.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-6">
                  {ebook.tags.map((tag: string) => (
                    <span key={tag} className="font-mono text-[10px] text-muted-foreground border border-border px-2 py-0.5">{tag}</span>
                  ))}
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center gap-6 mb-8 font-mono text-xs text-muted-foreground">
                {ebook.page_count && <span>{ebook.page_count} PAGES</span>}
                <span>PDF FORMAT</span>
              </div>

              {/* Price + Action */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-6">
                  <span className="font-display font-bold text-3xl text-primary">{formatPrice(ebook.price)}</span>

                  {purchase ? (
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 font-mono text-xs text-primary">
                        <CheckCircle className="w-4 h-4" /> PURCHASED
                      </span>
                      {purchase.download_count < 10 && (
                        <button
                          onClick={handleDownload}
                          disabled={downloading}
                          className="px-6 py-3 font-display font-bold tracking-widest uppercase text-sm cyber-clip bg-primary text-primary-foreground hover:brightness-125 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          {downloading ? "..." : "DOWNLOAD"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handlePurchase}
                      disabled={checkoutLoading}
                      className="px-8 py-3 font-display font-bold tracking-widest uppercase text-sm cyber-clip bg-primary text-primary-foreground hover:brightness-125 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {checkoutLoading ? "PROCESSING..." : "PURCHASE NOW"}
                    </button>
                  )}
                </div>

                {!user && (
                  <p className="font-mono text-[10px] text-muted-foreground mt-3">
                    <Link to="/login" className="text-primary hover:underline">Sign in</Link> to purchase
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EbookDetail;
