import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import CyberButton from "@/components/ui/CyberButton";
import ThreatBadge from "@/components/ui/ThreatBadge";

const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] },
  },
};

// Sample ebooks — will be dynamic from DB later
const ebooks = [
  {
    id: "1",
    slug: "east-africa-threat-landscape-2024",
    title: "East Africa Threat Landscape Report 2024",
    description: "Comprehensive analysis of ransomware campaigns, nation-state actors, and emerging attack vectors targeting East African infrastructure.",
    price: 2999,
    category: "THREAT INTELLIGENCE",
    threatLevel: "CRITICAL" as const,
    serial: "CH-TIR-001",
  },
  {
    id: "2",
    slug: "ransomware-defence-playbook",
    title: "Ransomware Defence Playbook for African Enterprises",
    description: "Step-by-step incident response procedures and prevention strategies tailored for organizations in the East African market.",
    price: 1999,
    category: "INCIDENT RESPONSE",
    threatLevel: "HIGH" as const,
    serial: "CH-TIR-002",
  },
  {
    id: "3",
    slug: "zero-day-exploit-analysis-q4",
    title: "Zero-Day Exploit Analysis — Q4 2024",
    description: "Technical deep-dive into critical zero-day vulnerabilities discovered in enterprise software used across African financial institutions.",
    price: 3499,
    category: "VULNERABILITY RESEARCH",
    threatLevel: "CRITICAL" as const,
    serial: "CH-TIR-003",
  },
  {
    id: "4",
    slug: "mobile-banking-security-assessment",
    title: "Mobile Banking Security Assessment Guide",
    description: "Security testing methodology for mobile money and banking applications prevalent in the East African fintech ecosystem.",
    price: 2499,
    category: "APPLICATION SECURITY",
    threatLevel: "HIGH" as const,
    serial: "CH-TIR-004",
  },
  {
    id: "5",
    slug: "ics-scada-security-east-africa",
    title: "ICS/SCADA Security for East African Utilities",
    description: "Securing industrial control systems in power, water, and telecommunications infrastructure across Uganda and the EAC.",
    price: 4499,
    category: "INFRASTRUCTURE",
    threatLevel: "CRITICAL" as const,
    serial: "CH-TIR-005",
  },
  {
    id: "6",
    slug: "phishing-social-engineering-report",
    title: "Phishing & Social Engineering: East Africa Report",
    description: "Analysis of phishing campaigns targeting East African organizations, including local language phishing and SMS-based attacks.",
    price: 1499,
    category: "THREAT INTELLIGENCE",
    threatLevel: "MEDIUM" as const,
    serial: "CH-TIR-006",
  },
];

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const Store = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-[12vh] border-b border-border">
        <div className="container mx-auto px-6">
          <span className="font-mono text-xs text-primary tracking-widest uppercase">// THREAT INTEL STORE</span>
          <h1 className="font-display font-bold tracking-[0.15em] uppercase text-foreground mt-3" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>
            CLASSIFIED <span className="text-primary">REPORTS</span>
          </h1>
          <p className="font-body font-light text-lg text-muted-foreground max-w-[65ch] mt-6 leading-relaxed">
            Actionable threat intelligence reports and security playbooks. Authored by CyberHawk-UG's elite analysts with deep East African expertise.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
          >
            {ebooks.map((ebook) => (
              <motion.div
                key={ebook.id}
                variants={fadeUp}
                className="group border border-border bg-card flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_-2px_0_0_hsl(173,100%,50%),0_0_15px_hsla(173,100%,50%,0.1)]"
              >
                {/* Card header */}
                <div className="aspect-[3/2] bg-secondary/50 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 dot-grid opacity-50" />
                  <div className="relative text-center p-6">
                    <div className="font-mono text-xs text-muted-foreground mb-2">{ebook.category}</div>
                    <div className="font-display font-semibold text-lg tracking-wider uppercase text-foreground leading-tight">
                      {ebook.title}
                    </div>
                  </div>
                  {/* Serial number */}
                  <div className="absolute top-3 right-3 font-mono text-[10px] text-muted-foreground/50">
                    {ebook.serial}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3">
                    <ThreatBadge level={ebook.threatLevel} />
                  </div>
                  <p className="font-body font-light text-sm text-muted-foreground leading-relaxed flex-1">
                    {ebook.description}
                  </p>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <span className="font-mono text-lg text-primary">{formatPrice(ebook.price)}</span>
                    <CyberButton variant="primary">
                      INITIALIZE PURCHASE
                    </CyberButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Store;
