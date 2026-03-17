import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Shield } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
    // Also listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Minimum 8 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate("/login");
  };

  if (!ready) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center py-20">
          <div className="text-center">
            <p className="font-mono text-sm text-muted-foreground">VALIDATING RECOVERY TOKEN...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="w-full max-w-md border border-border bg-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-display font-bold text-xl tracking-[0.15em] uppercase text-foreground">
              SET NEW PASSWORD
            </h1>
          </div>
          {error && (
            <div className="border border-destructive bg-destructive/10 p-3 mb-6">
              <p className="font-mono text-xs text-destructive">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">NEW PASSWORD (MIN 8)</label>
              <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors duration-250" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full px-8 py-3 font-display font-bold tracking-widest uppercase text-sm cyber-clip bg-primary text-primary-foreground hover:brightness-125 transition-all duration-300 disabled:opacity-50">
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default ResetPassword;
