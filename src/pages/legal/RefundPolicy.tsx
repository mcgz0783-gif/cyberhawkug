import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";

const RefundPolicy = () => (
  <Layout>
      <SEO title="Refund Policy" description="CyberHawk-UG refund policy for digital products and cybersecurity services." path="/legal/refund" />
    <section className="py-[10vh] border-b border-border">
      <div className="container mx-auto px-6">
        <span className="font-mono text-xs text-primary tracking-widest uppercase">// LEGAL</span>
        <h1 className="font-display font-bold text-3xl tracking-[0.15em] uppercase text-foreground mt-3">REFUND POLICY</h1>
      </div>
    </section>
    <section className="py-12">
      <div className="container mx-auto px-6 max-w-4xl space-y-8 font-body text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">DIGITAL PRODUCTS</h2>
          <p>Due to the nature of digital products, all sales are generally final once the content has been downloaded. However, we understand that issues may arise.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">ELIGIBLE REFUNDS</h2>
          <p>Refunds may be granted in the following cases:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Duplicate purchases (same ebook purchased twice)</li>
            <li>Technical issues preventing access to the content</li>
            <li>Content significantly different from the product description</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">REFUND TIMELINE</h2>
          <p>Refund requests must be submitted within 14 days of purchase. To request a refund, contact us at mcgz0783@gmail.com with your order details and reason for the request.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">PROCESSING</h2>
          <p>Approved refunds will be processed back to the original payment method within 5–10 business days. You will receive an email confirmation when your refund has been processed.</p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg tracking-wider uppercase text-foreground mb-3">NON-REFUNDABLE</h2>
          <p>Refunds will not be granted if the content has been downloaded more than twice, or if the refund request is made after 14 days from the purchase date.</p>
        </div>
        <p className="font-mono text-xs text-muted-foreground pt-4 border-t border-border">Last updated: March 2026</p>
      </div>
    </section>
  </Layout>
);

export default RefundPolicy;
