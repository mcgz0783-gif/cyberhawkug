import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, User, LogOut, Settings } from "lucide-react";
import CyberButton from "@/components/ui/CyberButton";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "ABOUT", path: "/about" },
  { label: "STORE", path: "/store" },
  { label: "BLOG", path: "/blog" },
  { label: "CONTACT", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <Shield className="w-7 h-7 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(173,100%,50%)]" />
          <span className="font-display font-bold text-lg tracking-[0.15em] uppercase text-foreground">
            CyberHawk<span className="text-primary">-UG</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}
              className={`font-display text-sm tracking-[0.15em] uppercase transition-colors duration-250 hover:text-primary ${
                location.pathname === link.path ? "text-primary" : "text-muted-foreground"
              }`}>
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin" className="font-mono text-xs text-destructive hover:text-destructive/80 transition-colors">
                  ADMIN
                </Link>
              )}
              <Link to="/dashboard" className="flex items-center gap-1 font-mono text-xs text-primary hover:text-primary/80 transition-colors">
                <User className="w-3 h-3" /> PORTAL
              </Link>
              <Link to="/settings" className="text-muted-foreground hover:text-primary transition-colors">
                <Settings className="w-4 h-4" />
              </Link>
              <button onClick={() => signOut()} className="text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <CyberButton variant="primary" href="/login">
              LOGIN
            </CyberButton>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}
                className={`font-display text-sm tracking-[0.15em] uppercase py-2 transition-colors duration-250 hover:text-primary ${
                  location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                }`}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="font-mono text-xs text-primary py-2">DASHBOARD</Link>
                {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className="font-mono text-xs text-destructive py-2">ADMIN PANEL</Link>}
                <button onClick={() => { signOut(); setIsOpen(false); }} className="font-mono text-xs text-muted-foreground py-2 text-left">SIGN OUT</button>
              </>
            ) : (
              <CyberButton variant="primary" href="/login">LOGIN</CyberButton>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
