import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Shield, CheckCircle } from "lucide-react";
import SEO from "@/components/SEO";
import CyberButton from "@/components/ui/CyberButton";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    // Purchase is confirmed via webhook, just show success
    if (sessionId) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }, [sessionId]);

  return (
    <Layout>
      <SEO title="Purchase Complete" description="Your purchase was successful. Download your threat intelligence report now." path="/checkout-success" />
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="w-full max-w-md border border-primary bg-card p-8 text-center">
          {status === "loading" && (
            <p className="font-mono text-sm text-muted-foreground animate-pulse">VERIFYING TRANSACTION...</p>
          )}
          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="font-display font-bold text-2xl tracking-[0.15em] uppercase text-foreground mb-3">
                TRANSACTION <span className="text-primary">VERIFIED</span>
              </h1>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Your purchase has been confirmed. The ebook is now available in your dashboard for download.
              </p>
              <div className="flex flex-col gap-3">
                <CyberButton variant="primary" href="/dashboard">
                  ACCESS DASHBOARD
                </CyberButton>
                <Link to="/store" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
                  CONTINUE BROWSING
                </Link>
              </div>
            </>
          )}
          {status === "error" && (
            <>
              <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h1 className="font-display font-bold text-xl tracking-[0.15em] uppercase text-foreground mb-3">
                VERIFICATION FAILED
              </h1>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Could not verify the transaction. If you were charged, please contact support.
              </p>
              <CyberButton variant="secondary" href="/contact">CONTACT SUPPORT</CyberButton>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutSuccess;
