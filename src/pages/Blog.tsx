import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ThreatBadge from "@/components/ui/ThreatBadge";
import { Link } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] as const },
  },
};

// Sample blog posts — will be dynamic from DB later
const posts = [
  {
    slug: "ugandan-banks-targeted-ransomware",
    title: "Ugandan Banks Targeted by LockBit 3.0 Ransomware Campaign",
    excerpt: "A coordinated ransomware campaign has been identified targeting financial institutions across Uganda and Kenya. Our threat intelligence team has confirmed at least 12 attempted intrusions in the past 72 hours.",
    category: "RANSOMWARE",
    threatLevel: "CRITICAL" as const,
    readTime: "8 MIN READ",
    publishedAt: "2024-12-15",
    author: "CyberHawk-UG Threat Intel Team",
  },
  {
    slug: "zero-day-vulnerability-telecom-infrastructure",
    title: "Critical Zero-Day Discovered in East African Telecom Infrastructure",
    excerpt: "Our vulnerability research team has identified an unpatched remote code execution vulnerability affecting network equipment widely deployed across East African telecommunications providers.",
    category: "ZERO-DAY",
    threatLevel: "CRITICAL" as const,
    readTime: "12 MIN READ",
    publishedAt: "2024-12-10",
    author: "CyberHawk-UG Threat Intel Team",
  },
  {
    slug: "ai-powered-phishing-east-africa",
    title: "AI-Powered Phishing Campaigns Surge Across East Africa",
    excerpt: "Threat actors are leveraging large language models to generate convincing phishing emails in Luganda, Swahili, and other local languages, bypassing traditional email security filters.",
    category: "AI THREATS",
    threatLevel: "HIGH" as const,
    readTime: "6 MIN READ",
    publishedAt: "2024-12-05",
    author: "CyberHawk-UG Threat Intel Team",
  },
  {
    slug: "mobile-money-fraud-prevention",
    title: "Mobile Money Platform Vulnerabilities: A Technical Analysis",
    excerpt: "Deep-dive into API security weaknesses identified in popular mobile money platforms serving millions of users across Uganda and the East African Community.",
    category: "DATA BREACH",
    threatLevel: "HIGH" as const,
    readTime: "10 MIN READ",
    publishedAt: "2024-11-28",
    author: "CyberHawk-UG Threat Intel Team",
  },
  {
    slug: "national-cybersecurity-framework-uganda",
    title: "Uganda's National Cybersecurity Framework: Compliance Guide",
    excerpt: "Comprehensive overview of Uganda's evolving cybersecurity regulatory landscape and what organizations need to do to achieve compliance before the 2025 enforcement deadline.",
    category: "ADVISORY",
    threatLevel: "MEDIUM" as const,
    readTime: "15 MIN READ",
    publishedAt: "2024-11-20",
    author: "CyberHawk-UG Threat Intel Team",
  },
];

const categories = ["ALL", "RANSOMWARE", "ZERO-DAY", "AI THREATS", "DATA BREACH", "PHISHING", "INFRASTRUCTURE", "ADVISORY"];

const Blog = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-[12vh] border-b border-border">
        <div className="container mx-auto px-6">
          <span className="font-mono text-xs text-primary tracking-widest uppercase">// THREAT INTELLIGENCE BLOG</span>
          <h1 className="font-display font-bold tracking-[0.15em] uppercase text-foreground mt-3" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>
            THREAT <span className="text-primary">INTEL</span> FEED
          </h1>
          <p className="font-body font-light text-lg text-muted-foreground max-w-[65ch] mt-6 leading-relaxed">
            Real-time threat advisories, security analysis, and incident reports from our Security Operations Center.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-card/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className="font-mono text-xs tracking-wider uppercase px-4 py-2 border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors duration-250"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col gap-2"
          >
            {posts.map((post) => (
              <motion.article
                key={post.slug}
                variants={fadeUp}
                className="group border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_-2px_0_0_hsl(173,100%,50%),0_0_15px_hsla(173,100%,50%,0.1)]"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <ThreatBadge level={post.threatLevel} />
                      <span className="font-mono text-xs text-muted-foreground">{post.category}</span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="font-display font-semibold text-xl tracking-wider uppercase text-foreground mb-3 group-hover:text-primary transition-colors duration-250">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-6 mt-4">
                      <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {post.publishedAt}
                      </span>
                    </div>
                  </div>
                  <Link to={`/blog/${post.slug}`} className="shrink-0 self-center text-primary hover:translate-x-1 transition-transform duration-250">
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
