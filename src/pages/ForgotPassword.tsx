import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Shield } from "lucide-react";
import SEO from "@/components/SEO";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  };

  return (
    <Layout>
      <SEO title="Forgot Password" description="Reset your CyberHawk-UG account password securely." path="/forgot-password" />
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="w-full max-w-md border border-border bg-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-display font-bold text-xl tracking-[0.15em] uppercase text-foreground">
              RESET PASSWORD
            </h1>
          </div>

          {sent ? (
            <div className="border border-primary bg-primary/10 p-4 text-center">
              <p className="font-mono text-xs text-primary">PASSWORD RESET EMAIL SENT. CHECK YOUR INBOX.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="border border-destructive bg-destructive/10 p-3 mb-6">
                  <p className="font-mono text-xs text-destructive">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">EMAIL</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors duration-250" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full px-8 py-3 font-display font-bold tracking-widest uppercase text-sm cyber-clip bg-primary text-primary-foreground hover:brightness-125 transition-all duration-300 disabled:opacity-50">
                  {loading ? "SENDING..." : "SEND RESET LINK"}
                </button>
              </form>
            </>
          )}
          <p className="mt-6 text-center font-body text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
