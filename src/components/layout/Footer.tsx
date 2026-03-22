import { Shield, Mail, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import NewsletterForm from "@/components/NewsletterForm";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-lg tracking-[0.15em] uppercase text-foreground">
                CyberHawk<span className="text-primary">-UG</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm font-body font-light leading-relaxed">
              Defending East Africa in Cyberspace since 2018. Uganda's premier cybersecurity services firm.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-[0.15em] uppercase text-foreground mb-4">
              NAVIGATION
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", path: "/" },
                { label: "About", path: "/about" },
                { label: "Threat Intel Store", path: "/store" },
                { label: "Blog", path: "/blog" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-muted-foreground text-sm hover:text-primary transition-colors duration-250"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-[0.15em] uppercase text-foreground mb-4">
              SERVICES
            </h4>
            <div className="flex flex-col gap-2 text-muted-foreground text-sm">
              <span>Penetration Testing</span>
              <span>Threat Intelligence</span>
              <span>Incident Response</span>
              <span>Security Audits</span>
              <span>Compliance & Training</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-[0.15em] uppercase text-foreground mb-4">
              CONTACT
            </h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:mcgz0783@gmail.com" className="flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-250">
                <Mail className="w-4 h-4" />
                mcgz0783@gmail.com
              </a>
              <a href="tel:+256783699626" className="flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-250">
                <Phone className="w-4 h-4" />
                +256 783 699 626
              </a>
              <a href="https://wa.me/256788213106" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-250">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs font-mono">
            © {new Date().getFullYear()} CYBERHAWK-UG. ALL SYSTEMS SECURED.
          </p>
          <div className="flex gap-6">
            <Link to="/legal/terms" className="text-muted-foreground text-xs font-mono hover:text-primary transition-colors duration-250">
              TERMS
            </Link>
            <Link to="/legal/privacy" className="text-muted-foreground text-xs font-mono hover:text-primary transition-colors duration-250">
              PRIVACY
            </Link>
            <Link to="/legal/refund" className="text-muted-foreground text-xs font-mono hover:text-primary transition-colors duration-250">
              REFUND POLICY
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
