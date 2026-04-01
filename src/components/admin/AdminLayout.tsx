import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { Shield, Book, FileText, ShoppingCart, Users, BarChart3, Settings, LogOut, Menu, X, TrendingUp, Mail, Tag } from "lucide-react";

const adminNav = [
  { label: "DASHBOARD", path: "/admin", icon: BarChart3 },
  { label: "ANALYTICS", path: "/admin/analytics", icon: TrendingUp },
  { label: "EBOOKS", path: "/admin/ebooks", icon: Book },
  { label: "BLOG", path: "/admin/blog", icon: FileText },
  { label: "ORDERS", path: "/admin/orders", icon: ShoppingCart },
  { label: "CUSTOMERS", path: "/admin/customers", icon: Users },
  { label: "NEWSLETTER", path: "/admin/newsletter", icon: Mail },
  { label: "DISCOUNTS", path: "/admin/discounts", icon: Tag },
];

const AdminLayout = () => {
  const { user, profile, loading, signOut, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin-login");
    }
  }, [loading, user, isAdmin]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="font-mono text-sm text-muted-foreground animate-pulse">LOADING ADMIN PANEL...</p>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-destructive" />
            <span className="font-display font-bold text-sm tracking-[0.15em] uppercase text-foreground">
              ADMIN <span className="text-destructive">PANEL</span>
            </span>
          </Link>
          <p className="font-mono text-[10px] text-muted-foreground mt-1">{profile?.email}</p>
        </div>

        <nav className="p-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 font-mono text-xs tracking-wider transition-colors ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          {isSuperAdmin && (
            <Link to="/admin/settings" onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 font-mono text-xs tracking-wider transition-colors ${
                location.pathname === "/admin/settings" ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}>
              <Settings className="w-4 h-4" /> SETTINGS
            </Link>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button onClick={() => { signOut(); navigate("/"); }}
            className="flex items-center gap-2 px-4 py-2 font-mono text-xs text-muted-foreground hover:text-destructive transition-colors w-full">
            <LogOut className="w-4 h-4" /> SIGN OUT
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border flex items-center px-6 bg-card/50">
          <button className="lg:hidden mr-4 text-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-mono text-xs text-muted-foreground">
            // CYBERHAWK-UG ADMIN — {profile?.role}
          </span>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
