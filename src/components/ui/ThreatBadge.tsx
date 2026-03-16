interface ThreatBadgeProps {
  level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

const ThreatBadge = ({ level }: ThreatBadgeProps) => {
  const styles: Record<string, string> = {
    CRITICAL: "bg-destructive text-primary-foreground animate-pulse",
    HIGH: "bg-warning text-warning-foreground",
    MEDIUM: "bg-primary text-primary-foreground",
    LOW: "bg-muted text-muted-foreground",
  };

  return (
    <span className={`inline-block px-3 py-1 font-mono text-xs uppercase tracking-wider ${styles[level]}`}>
      {level}
    </span>
  );
};

export default ThreatBadge;
