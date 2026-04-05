import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Shield, AlertTriangle } from "lucide-react";
import SEO from "@/components/SEO";

const AdminLogin = () => {
  const { signIn, profile } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 5) {
      setError("Too many failed attempts. Try again in 15 minutes.");
      return;
    }
    setError("");
    setLoading(true);
    const { error: authError } = await signIn(email, password);
    if (authError) {
      setAttempts(a => a + 1);
      setError(authError);
      setLoading(false);
      return;
    }
    // Profile will be fetched by AuthContext, redirect handled by useEffect
    setLoading(false);
    // Small delay to let profile load
    setTimeout(() => navigate("/admin"), 500);
  };

  return (
    <Layout>
      <SEO title="Admin Login" description="CyberHawk-UG admin portal login." path="/admin-login" />
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="w-full max-w-md border border-border bg-card p-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-destructive" />
            <h1 className="font-display font-bold text-xl tracking-[0.15em] uppercase text-foreground">
              ADMIN ACCESS
            </h1>
          </div>
          <p className="font-mono text-xs text-muted-foreground mb-8">
            // RESTRICTED AREA — AUTHORIZED PERSONNEL ONLY
          </p>

          {error && (
            <div className="border border-destructive bg-destructive/10 p-3 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
              <p className="font-mono text-xs text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">ADMIN EMAIL</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-destructive focus:outline-none transition-colors duration-250" />
            </div>
            <div>
              <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">PASSWORD</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-destructive focus:outline-none transition-colors duration-250" />
            </div>
            <button type="submit" disabled={loading || attempts >= 5}
              className="w-full px-8 py-3 font-display font-bold tracking-widest uppercase text-sm cyber-clip bg-destructive text-foreground hover:brightness-125 transition-all duration-300 disabled:opacity-50">
              {loading ? "AUTHENTICATING..." : "ADMIN LOGIN"}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default AdminLogin;
