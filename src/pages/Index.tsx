import { motion } from "framer-motion";
import { Shield, Radar, Lock, Bug, Server, FileText, ChevronRight } from "lucide-react";
import CyberButton from "@/components/ui/CyberButton";
import Layout from "@/components/layout/Layout";
import heroBg from "@/assets/hero-bg.jpg";

const glitchVariants = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.2, 0.8, 0.2, 1],
    },
  },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const services = [
  {
    icon: Radar,
    title: "THREAT INTELLIGENCE",
    description: "Real-time monitoring and analysis of emerging cyber threats targeting East African infrastructure.",
  },
  {
    icon: Bug,
    title: "PENETRATION TESTING",
    description: "Adversarial simulation of attacks against your network, applications, and physical security.",
  },
  {
    icon: Lock,
    title: "INCIDENT RESPONSE",
    description: "24/7 rapid response team to contain, investigate, and remediate active security breaches.",
  },
  {
    icon: Server,
    title: "INFRASTRUCTURE SECURITY",
    description: "Hardening of servers, networks, cloud environments, and critical national infrastructure.",
  },
  {
    icon: Shield,
    title: "COMPLIANCE & AUDIT",
    description: "ISO 27001, PCI-DSS, and NIST compliance assessments tailored for Ugandan regulatory requirements.",
  },
  {
    icon: FileText,
    title: "SECURITY TRAINING",
    description: "Workforce cybersecurity awareness programs and executive threat briefings for organizations.",
  },
];

const stats = [
  { value: "500+", label: "THREATS NEUTRALIZED" },
  { value: "99.7%", label: "UPTIME MAINTAINED" },
  { value: "50+", label: "CLIENTS SECURED" },
  { value: "6+", label: "YEARS OPERATIONAL" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        {/* Floating Hexagons */}
        <div className="absolute top-20 left-10 w-16 h-16 border border-primary/20 rotate-45 animate-float" />
        <div className="absolute top-40 right-20 w-10 h-10 border border-primary/10 rotate-12 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-32 left-1/4 w-8 h-8 border border-primary/15 -rotate-12 animate-float" style={{ animationDelay: "4s" }} />

        <div className="relative z-10 container mx-auto px-6 text-center py-[20vh]">
          {/* Status line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 border border-border px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">
              ALL SYSTEMS OPERATIONAL — KAMPALA, UGANDA
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={glitchVariants}
            initial="initial"
            animate="animate"
            className="font-display font-bold tracking-[0.15em] uppercase text-foreground leading-none"
            style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
          >
            SYSTEM STATUS:{" "}
            <span className="text-primary">SECURED</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-display text-xl md:text-2xl tracking-[0.1em] uppercase text-muted-foreground mt-4 mb-2"
          >
            DEFENDING EAST AFRICA IN CYBERSPACE
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="font-body font-light text-lg text-muted-foreground max-w-[65ch] mx-auto mt-6 leading-relaxed"
          >
            CyberHawk-UG provides elite threat intelligence, penetration testing, and incident response services to protect Uganda's digital infrastructure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="flex flex-wrap gap-4 justify-center mt-10"
          >
            <CyberButton variant="primary" href="/store">
              ACCESS INTEL
            </CyberButton>
            <CyberButton variant="secondary" href="/contact">
              ENCRYPT MESSAGE
            </CyberButton>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-3xl md:text-4xl text-primary tracking-wider">
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-muted-foreground mt-1 tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-primary tracking-widest uppercase">
              // CAPABILITIES
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-[0.1em] uppercase text-foreground mt-3">
              OPERATIONAL SERVICES
            </h2>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                className="group border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_-2px_0_0_hsl(173,100%,50%),0_0_15px_hsla(173,100%,50%,0.1)]"
              >
                <service.icon className="w-8 h-8 text-primary mb-4 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(173,100%,50%)]" />
                <h3 className="font-display font-semibold text-sm tracking-[0.15em] uppercase text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border notched bg-card/30">
        <div className="container mx-auto px-6 text-center">
          <span className="font-mono text-xs text-primary tracking-widest uppercase">
            // THREAT REPORTS
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-[0.1em] uppercase text-foreground mt-3 mb-6">
            ACCESS CLASSIFIED INTEL
          </h2>
          <p className="font-body font-light text-lg text-muted-foreground max-w-[55ch] mx-auto mb-10 leading-relaxed">
            Our threat intelligence reports provide actionable insights on ransomware campaigns, zero-day exploits, and emerging attack vectors targeting East African organizations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <CyberButton variant="primary" href="/store">
              INITIALIZE PURCHASE
            </CyberButton>
            <CyberButton variant="secondary" href="/blog">
              <span className="flex items-center gap-2">
                READ THREAT BLOG <ChevronRight className="w-4 h-4" />
              </span>
            </CyberButton>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
