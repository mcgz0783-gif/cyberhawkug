import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";

const Privacy = () => (
  <Layout>
      <SEO title="Privacy Policy" description="CyberHawk-UG privacy policy detailing how we collect, use, and protect your data." path="/legal/privacy" />
    <section className="py-[10vh] border-b border-border">
      <div className="container mx-auto px-6">
        <span className="font-mono text-xs text-primary tracking-widest uppercase">// LEGAL</span>
        <h1 className="font-display font-bold text-3xl tracking-[0.15em] uppercase text-foreground mt-3">PRIVACY POLICY</h1>
      </div>
    </section>
    <section className="py-12">
      <div className="container mx-auto px-6 max-w-4xl space-y-8 font-body text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">1. INFORMATION WE COLLECT</h2>
          <p>We collect information you provide directly: name, email address, and payment details when making purchases. We also collect usage data such as pages visited and interactions with our platform.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">2. HOW WE USE YOUR DATA</h2>
          <p>Your data is used to process purchases, deliver digital products, send transactional emails, improve our services, and communicate security updates relevant to your purchased content.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">3. PAYMENT PROCESSING</h2>
          <p>Payments are processed securely through Stripe. We do not store your full credit card details on our servers. All payment data is handled by Stripe in compliance with PCI DSS standards.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">4. DATA SECURITY</h2>
          <p>We implement industry-standard security measures to protect your personal data, including encryption in transit and at rest, access controls, and regular security audits.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">5. DATA SHARING</h2>
          <p>We do not sell your personal data. We share data only with service providers necessary to operate our platform (payment processing, email delivery) and when required by law.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">6. YOUR RIGHTS</h2>
          <p>You may request access to, correction of, or deletion of your personal data by contacting us at mcgz0783@gmail.com. We will respond within 30 days.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">7. COOKIES</h2>
          <p>We use essential cookies for authentication and session management. No third-party tracking cookies are used without your consent.</p>
        </div>
        <p className="font-mono text-xs text-muted-foreground pt-4 border-t border-border">Last updated: March 2026</p>
      </div>
    </section>
  </Layout>
);

export default Privacy;
