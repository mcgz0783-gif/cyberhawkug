import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Download, Settings, LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user]);

  useEffect(() => {
    if (user) {
      supabase
        .from("purchases")
        .select("*, ebooks(title, slug, cover_url)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => { if (data) setPurchases(data); });
    }
  }, [user]);

  const handleDownload = async (purchaseId: string) => {
    const { data } = await supabase.functions.invoke("download-ebook", {
      body: { purchaseId },
    });
    if (data?.url) window.open(data.url, "_blank");
  };

  if (loading) return <Layout><div className="min-h-[80vh] flex items-center justify-center"><p className="font-mono text-sm text-muted-foreground">LOADING...</p></div></Layout>;

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
              <div className="font-display font-bold text-2xl text-foreground">{purchases.filter(p => p.status === "COMPLETED").length}</div>
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
              YOUR PURCHASES
            </h2>
            {purchases.length === 0 ? (
              <div className="border border-border bg-card p-8 text-center">
                <p className="font-body text-sm text-muted-foreground mb-4">No purchases yet.</p>
                <Link to="/store" className="font-mono text-xs text-primary hover:underline">BROWSE INTEL STORE →</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {purchases.map((p) => (
                  <div key={p.id} className="border border-border bg-card p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-foreground">
                        {p.ebooks?.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`font-mono text-xs ${p.status === "COMPLETED" ? "text-primary" : p.status === "REFUNDED" ? "text-destructive" : "text-warning"}`}>
                          {p.status}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {p.download_count}/10 DOWNLOADS
                        </span>
                      </div>
                    </div>
                    {p.status === "COMPLETED" && p.download_count < 10 && (
                      <button onClick={() => handleDownload(p.id)}
                        className="px-4 py-2 font-mono text-xs text-primary border border-primary hover:bg-primary/10 transition-colors">
                        <Download className="w-4 h-4 inline mr-1" /> DOWNLOAD
                      </button>
                    )}
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
