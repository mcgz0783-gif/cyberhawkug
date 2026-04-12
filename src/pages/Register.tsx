import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Shield } from "lucide-react";
import SEO from "@/components/SEO";

const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setError("");
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) { setError(error); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <Layout>
      <SEO title="Register" description="Create a CyberHawk-UG account to purchase threat intelligence reports and access exclusive cybersecurity content." path="/register" />
        <section className="min-h-[80vh] flex items-center justify-center py-20">
          <div className="w-full max-w-md border border-primary bg-card p-8 text-center">
            <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl tracking-[0.15em] uppercase text-foreground mb-3">
              VERIFICATION SENT
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              Check your email to confirm your CyberHawk-UG account. Then{" "}
              <Link to="/login" className="text-primary hover:underline">login here</Link>.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="w-full max-w-md border border-border bg-card p-8">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-display font-bold text-xl tracking-[0.15em] uppercase text-foreground">
              CREATE ACCOUNT
            </h1>
          </div>

          {error && (
            <div className="border border-destructive bg-destructive/10 p-3 mb-6">
              <p className="font-mono text-xs text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">FULL NAME</label>
              <input type="text" required maxLength={100} value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors duration-250" />
            </div>
            <div>
              <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">EMAIL</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors duration-250" />
            </div>
            <div>
              <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">PASSWORD (MIN 8 CHARS)</label>
              <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors duration-250" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full px-8 py-3 font-display font-bold tracking-widest uppercase text-sm cyber-clip bg-primary text-primary-foreground hover:brightness-125 transition-all duration-300 disabled:opacity-50">
              {loading ? "CREATING..." : "REGISTER"}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Register;
