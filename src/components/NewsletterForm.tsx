import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NewsletterForm = ({ compact = false }: { compact?: boolean }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || email.length < 6) return;
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already subscribed", description: "This email is already on our list." });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Subscribed!", description: "You'll receive our latest threat intelligence updates." });
      setEmail("");
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="operative@email.com"
            required
            className="w-full pl-10 pr-3 py-2 bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-primary-foreground font-mono text-xs tracking-wider uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "SUBSCRIBE"}
        </button>
      </form>
    );
  }

  return (
    <div className="border border-border bg-card/50 p-8 text-center">
      <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
      <h3 className="font-display font-bold text-lg tracking-[0.1em] uppercase text-foreground mb-2">
        THREAT INTEL BRIEFING
      </h3>
      <p className="font-body font-light text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Subscribe to receive weekly cybersecurity threat intelligence updates, zero-day alerts, and exclusive analysis from our team.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="operative@email.com"
            required
            className="w-full pl-10 pr-3 py-3 bg-secondary border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-primary-foreground font-mono text-xs tracking-wider uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "PROCESSING..." : "SUBSCRIBE"}
        </button>
      </form>
    </div>
  );
};

export default NewsletterForm;
