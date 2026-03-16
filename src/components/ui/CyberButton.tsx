import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CyberButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
  href?: string;
}

const CyberButton = ({ children, variant = "primary", onClick, className = "", href }: CyberButtonProps) => {
  const baseClasses = "px-8 py-3 font-display font-bold tracking-widest uppercase text-sm cyber-clip transition-all duration-300 inline-block text-center";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:brightness-125 hover:drop-shadow-[0_0_8px_hsl(173,100%,50%)]",
    secondary: "border border-primary text-primary bg-transparent hover:bg-primary/10 hover:drop-shadow-[0_0_8px_hsl(173,100%,50%)]",
  };

  const content = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return <button onClick={onClick}>{content}</button>;
};

export default CyberButton;
