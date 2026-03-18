import Layout from "@/components/layout/Layout";

const Terms = () => (
  <Layout>
    <section className="py-[10vh] border-b border-border">
      <div className="container mx-auto px-6">
        <span className="font-mono text-xs text-primary tracking-widest uppercase">// LEGAL</span>
        <h1 className="font-display font-bold text-3xl tracking-[0.15em] uppercase text-foreground mt-3">TERMS OF SERVICE</h1>
      </div>
    </section>
    <section className="py-12">
      <div className="container mx-auto px-6 max-w-4xl space-y-8 font-body text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">1. ACCEPTANCE OF TERMS</h2>
          <p>By accessing and using the CyberHawk-UG website and purchasing digital products, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">2. DIGITAL PRODUCTS</h2>
          <p>All ebooks and threat intelligence reports sold on this platform are digital products delivered electronically. Upon successful payment, you will receive access to download the purchased content through your account dashboard.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">3. LICENSE</h2>
          <p>Purchases grant you a personal, non-transferable, non-exclusive license to use the content. You may not redistribute, resell, share, or publish the content without written permission from CyberHawk-UG.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">4. ACCOUNT RESPONSIBILITY</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. Notify us immediately of unauthorized access.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">5. DISCLAIMER</h2>
          <p>Threat intelligence content is provided for informational and educational purposes only. CyberHawk-UG makes no warranty regarding the completeness or accuracy of the information. Use of threat intelligence for malicious purposes is strictly prohibited.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">6. LIMITATION OF LIABILITY</h2>
          <p>CyberHawk-UG shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">7. MODIFICATIONS</h2>
          <p>We reserve the right to update these terms at any time. Continued use of the platform constitutes acceptance of updated terms.</p>
        </div>
        <p className="font-mono text-xs text-muted-foreground pt-4 border-t border-border">Last updated: March 2026</p>
      </div>
    </section>
  </Layout>
);

export default Terms;
