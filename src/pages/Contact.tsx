import { useState } from "react";
import { Mail, Phone, MessageCircle, MapPin, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import CyberButton from "@/components/ui/CyberButton";
import SEO from "@/components/SEO";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will connect to backend later
    alert("Message encrypted and queued for transmission. We'll respond within 24 hours.");
  };

  return (
    <Layout>
      <SEO title="Contact Us" description="Get in touch with CyberHawk-UG's security team for consultations, incident response, or partnership inquiries." path="/contact" />
      {/* Hero */}
      <section className="py-[12vh] border-b border-border">
        <div className="container mx-auto px-6">
          <span className="font-mono text-xs text-primary tracking-widest uppercase">// SECURE COMMUNICATIONS</span>
          <h1 className="font-display font-bold tracking-[0.15em] uppercase text-foreground mt-3" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>
            ENCRYPT <span className="text-primary">MESSAGE</span>
          </h1>
          <p className="font-body font-light text-lg text-muted-foreground max-w-[65ch] mt-6 leading-relaxed">
            Initiate contact with our security team. All communications are treated as confidential.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="border border-border bg-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-[0.15em] uppercase text-foreground mb-4">
                  DIRECT CHANNELS
                </h3>
                <div className="space-y-4">
                  <a href="mailto:mcgz0783@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-250">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="font-mono text-xs text-muted-foreground/60 mb-1">EMAIL</div>
                      <div className="font-body text-sm">mcgz0783@gmail.com</div>
                    </div>
                  </a>
                  <a href="tel:+256783699626" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-250">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="font-mono text-xs text-muted-foreground/60 mb-1">PHONE</div>
                      <div className="font-body text-sm">+256 783 699 626</div>
                    </div>
                  </a>
                  <a href="https://wa.me/256788213106" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-250">
                    <MessageCircle className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="font-mono text-xs text-muted-foreground/60 mb-1">WHATSAPP</div>
                      <div className="font-body text-sm">+256 788 213 106</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="font-mono text-xs text-muted-foreground/60 mb-1">LOCATION</div>
                      <div className="font-body text-sm">Kampala, Uganda</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-border bg-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-[0.15em] uppercase text-foreground mb-3">
                  RESPONSE TIME
                </h3>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                  Standard inquiries: within 24 hours. Active incident reports: within 2 hours. Emergency hotline available for existing clients.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 border border-border bg-card p-8">
              <h3 className="font-display font-semibold text-lg tracking-[0.15em] uppercase text-foreground mb-6">
                TRANSMIT SECURE MESSAGE
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">FULL NAME</label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-250"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">EMAIL</label>
                    <input
                      type="email"
                      required
                      maxLength={255}
                      value={formData.email}
                      onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-250"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">SUBJECT</label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={formData.subject}
                    onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                    className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-250"
                    placeholder="Security assessment / Incident report / General inquiry"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">MESSAGE</label>
                  <textarea
                    required
                    maxLength={2000}
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                    className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-250 resize-none"
                    placeholder="Describe your security needs or report an incident..."
                  />
                </div>
                <div className="flex items-center gap-4">
                  <CyberButton variant="primary" onClick={() => {}}>
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" /> TRANSMIT
                    </span>
                  </CyberButton>
                  <span className="font-mono text-xs text-muted-foreground/50">
                    // ALL FIELDS ENCRYPTED IN TRANSIT
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
