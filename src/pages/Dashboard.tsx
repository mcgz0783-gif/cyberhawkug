import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Download, Settings, LogOut, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user]);

  useEffect(() => {
    if (user) {
      supabase
        .from("purchases")
        .select("*, ebooks(title, slug, cover_url, author, category)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => { if (data) setPurchases(data); });
    }
  }, [user]);

  const handleDownload = async (purchaseId: string) => {
    setDownloading(purchaseId);
    try {
      const { data, error } = await supabase.functions.invoke("download-ebook", {
        body: { purchaseId },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error(err.message || "Download failed");
    } finally {
      setDownloading(null);
      // Refresh download count
      if (user) {
        const { data } = await supabase
          .from("purchases")
          .select("*, ebooks(title, slug, cover_url, author, category)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (data) setPurchases(data);
      }
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-primary";
      case "REFUNDED": return "text-destructive";
      case "DISPUTED": return "text-destructive";
      default: return "text-yellow-400";
    }
  };

  if (loading) return <Layout><div className="min-h-[80vh] flex items-center justify-center"><p className="font-mono text-sm text-muted-foreground animate-pulse">LOADING...</p></div></Layout>;

  const completed = purchases.filter(p => p.status === "COMPLETED");

  return (
    <Layout>
      <section className="py-[10vh]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="font-mono text-xs text-primary tracking-widest uppercase">// CLIENT PORTAL</span>
              <h1 className="font-display font-bold text-3xl tracking-[0.15em] uppercase text-foreground mt-2">
                DASHBOARD
              </h1>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Welcome, {profile?.full_name || profile?.email || "Agent"}
              </p>
            </div>
            <button onClick={() => { signOut(); navigate("/"); }}
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" /> SIGN OUT
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-12">
            <div className="border border-border bg-card p-6">
              <ShoppingBag className="w-6 h-6 text-primary mb-2" />
              <div className="font-display font-bold text-2xl text-foreground">{completed.length}</div>
              <div className="font-mono text-xs text-muted-foreground">PURCHASES</div>
            </div>
            <div className="border border-border bg-card p-6">
              <Download className="w-6 h-6 text-primary mb-2" />
              <div className="font-display font-bold text-2xl text-foreground">{purchases.reduce((a, p) => a + (p.download_count || 0), 0)}</div>
              <div className="font-mono text-xs text-muted-foreground">TOTAL DOWNLOADS</div>
            </div>
            <div className="border border-border bg-card p-6">
              <Settings className="w-6 h-6 text-primary mb-2" />
              <div className="font-mono text-xs text-foreground mt-2">{profile?.role}</div>
              <div className="font-mono text-xs text-muted-foreground">ROLE</div>
            </div>
          </div>

          {/* Purchases */}
          <div>
            <h2 className="font-display font-semibold text-lg tracking-[0.1em] uppercase text-foreground mb-6">
              YOUR LIBRARY
            </h2>
            {purchases.length === 0 ? (
              <div className="border border-border bg-card p-8 text-center">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <p className="font-body text-sm text-muted-foreground mb-4">No purchases yet.</p>
                <Link to="/store" className="px-6 py-2 font-display font-bold tracking-widest uppercase text-xs cyber-clip bg-primary text-primary-foreground hover:brightness-125 transition-all inline-block">
                  BROWSE INTEL STORE
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {purchases.map((p) => (
                  <div key={p.id} className="border border-border bg-card p-4 md:p-6 flex items-start gap-4 md:gap-6 transition-all duration-300 hover:border-primary/30">
                    {/* Cover thumbnail */}
                    <div className="shrink-0 w-16 h-20 md:w-20 md:h-28 border border-border bg-secondary overflow-hidden">
                      {p.ebooks?.cover_url ? (
                        <img src={p.ebooks.cover_url} alt={p.ebooks?.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/store/${p.ebooks?.slug}`}>
                        <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-foreground hover:text-primary transition-colors">
                          {p.ebooks?.title}
                        </h3>
                      </Link>
                      {p.ebooks?.author && (
                        <p className="font-mono text-[10px] text-muted-foreground mt-1">{p.ebooks.author}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className={`font-mono text-xs ${statusColor(p.status)}`}>
                          {p.status}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {p.download_count}/10 DOWNLOADS
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {p.status === "REFUNDED" && (
                        <div className="flex items-center gap-1 mt-2">
                          <AlertCircle className="w-3 h-3 text-destructive" />
                          <span className="font-mono text-[10px] text-destructive">ACCESS REVOKED — REFUNDED</span>
                        </div>
                      )}
                    </div>

                    {/* Download button */}
                    <div className="shrink-0 self-center">
                      {p.status === "COMPLETED" && p.download_count < 10 ? (
                        <button
                          onClick={() => handleDownload(p.id)}
                          disabled={downloading === p.id}
                          className="px-4 py-2 font-mono text-xs text-primary border border-primary hover:bg-primary/10 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          {downloading === p.id ? "..." : "DOWNLOAD"}
                        </button>
                      ) : p.status === "COMPLETED" && p.download_count >= 10 ? (
                        <span className="font-mono text-[10px] text-muted-foreground">LIMIT REACHED</span>
                      ) : p.status === "PENDING" ? (
                        <span className="font-mono text-[10px] text-yellow-400 animate-pulse">PROCESSING</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
