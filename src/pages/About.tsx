import { motion } from "framer-motion";
import { Shield, Target, Users, Award, Globe, Clock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import CyberButton from "@/components/ui/CyberButton";

const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const timeline = [
  { year: "2018", event: "CyberHawk-UG founded in Kampala, Uganda" },
  { year: "2019", event: "First government infrastructure security audit completed" },
  { year: "2020", event: "Launched 24/7 incident response operations center" },
  { year: "2021", event: "Expanded services to Kenya and Tanzania" },
  { year: "2022", event: "Published first East Africa Threat Landscape Report" },
  { year: "2023", event: "50+ enterprise clients secured across the region" },
  { year: "2024", event: "Launched digital threat intelligence store" },
];

const values = [
  { icon: Shield, title: "DEFENCE IN DEPTH", description: "Multi-layered security strategies that protect at every level — from perimeter to endpoint." },
  { icon: Target, title: "PRECISION", description: "Surgical accuracy in threat identification and elimination. Zero tolerance for false positives." },
  { icon: Users, title: "LOCAL EXPERTISE", description: "Deep understanding of East Africa's unique threat landscape, regulatory environment, and infrastructure challenges." },
  { icon: Award, title: "EXCELLENCE", description: "International-grade cybersecurity standards adapted for the African context." },
  { icon: Globe, title: "REGIONAL IMPACT", description: "Protecting critical infrastructure across Uganda, Kenya, Tanzania, and the greater East African Community." },
  { icon: Clock, title: "24/7 VIGILANCE", description: "Round-the-clock monitoring and rapid response from our Security Operations Center in Kampala." },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-[15vh] border-b border-border">
        <div className="container mx-auto px-6">
          <span className="font-mono text-xs text-primary tracking-widest uppercase">// ABOUT CYBERHAWK-UG</span>
          <h1 className="font-display font-bold tracking-[0.15em] uppercase text-foreground mt-3" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>
            EAST AFRICA'S CYBER <span className="text-primary">SHIELD</span>
          </h1>
          <p className="font-body font-light text-lg text-muted-foreground max-w-[65ch] mt-6 leading-relaxed">
            Founded in 2018, CyberHawk-UG is Uganda's premier cybersecurity firm. We defend government agencies, financial institutions, telecoms, and enterprises against the full spectrum of digital threats.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <span className="font-mono text-xs text-primary tracking-widest uppercase">// MISSION</span>
            <h2 className="font-display font-semibold text-2xl tracking-[0.1em] uppercase text-foreground mt-3 mb-4">
              OUR DIRECTIVE
            </h2>
            <p className="font-body font-light text-muted-foreground leading-relaxed mb-4">
              To safeguard East Africa's digital transformation by providing world-class cybersecurity services, threat intelligence, and security education. We believe that robust cybersecurity is foundational to economic growth, democratic governance, and regional stability.
            </p>
            <p className="font-body font-light text-muted-foreground leading-relaxed">
              Our team combines international expertise with deep local knowledge — understanding the specific vulnerabilities, regulatory requirements, and threat actors operating in the East African cyberspace.
            </p>
          </div>
          <div>
            <span className="font-mono text-xs text-primary tracking-widest uppercase">// TIMELINE</span>
            <h2 className="font-display font-semibold text-2xl tracking-[0.1em] uppercase text-foreground mt-3 mb-6">
              OPERATIONAL HISTORY
            </h2>
            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={item.year} className="flex gap-4 items-start">
                  <span className="font-mono text-sm text-primary shrink-0 w-12">{item.year}</span>
                  <div className="border-l border-border pl-4">
                    <p className="font-body text-sm text-foreground">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-primary tracking-widest uppercase">// CORE VALUES</span>
            <h2 className="font-display font-bold text-3xl tracking-[0.1em] uppercase text-foreground mt-3">
              OPERATIONAL PRINCIPLES
            </h2>
          </div>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="group border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_-2px_0_0_hsl(173,100%,50%),0_0_15px_hsla(173,100%,50%,0.1)]"
              >
                <v.icon className="w-7 h-7 text-primary mb-4" />
                <h3 className="font-display font-semibold text-sm tracking-[0.15em] uppercase text-foreground mb-2">{v.title}</h3>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border notched bg-card/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-3xl tracking-[0.1em] uppercase text-foreground mb-6">
            SECURE YOUR ORGANIZATION
          </h2>
          <p className="font-body font-light text-lg text-muted-foreground max-w-[50ch] mx-auto mb-8 leading-relaxed">
            Ready to defend your infrastructure? Contact our team for a confidential security assessment.
          </p>
          <CyberButton variant="primary" href="/contact">ENCRYPT MESSAGE</CyberButton>
        </div>
      </section>
    </Layout>
  );
};

export default About;
