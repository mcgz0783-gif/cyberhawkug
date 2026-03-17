import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Book, ShoppingCart, Users, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ ebooks: 0, orders: 0, customers: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [ebooksRes, ordersRes, customersRes] = await Promise.all([
        supabase.from("ebooks").select("id", { count: "exact", head: true }),
        supabase.from("purchases").select("id, amount_paid, status", { count: "exact" }).eq("status", "COMPLETED"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "CUSTOMER"),
      ]);

      const revenue = ordersRes.data?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0;

      setStats({
        ebooks: ebooksRes.count || 0,
        orders: ordersRes.count || 0,
        customers: customersRes.count || 0,
        revenue,
      });

      // Recent orders
      const { data: recent } = await supabase
        .from("purchases")
        .select("*, profiles(email, full_name), ebooks(title)")
        .order("created_at", { ascending: false })
        .limit(10);
      if (recent) setRecentOrders(recent);
    };
    fetchStats();
  }, []);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div>
      <h1 className="font-display font-bold text-2xl tracking-[0.1em] uppercase text-foreground mb-8">
        ADMIN DASHBOARD
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-10">
        {[
          { icon: Book, label: "TOTAL EBOOKS", value: stats.ebooks, color: "text-primary" },
          { icon: ShoppingCart, label: "COMPLETED ORDERS", value: stats.orders, color: "text-primary" },
          { icon: Users, label: "CUSTOMERS", value: stats.customers, color: "text-primary" },
          { icon: DollarSign, label: "TOTAL REVENUE", value: formatPrice(stats.revenue), color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="border border-border bg-card p-6">
            <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
            <div className="font-display font-bold text-2xl text-foreground">{s.value}</div>
            <div className="font-mono text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="font-display font-semibold text-lg tracking-[0.1em] uppercase text-foreground mb-4">
        RECENT ORDERS
      </h2>
      <div className="border border-border bg-card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">CUSTOMER</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">EBOOK</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">AMOUNT</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">STATUS</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">DATE</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-border/50">
                <td className="p-4 font-body text-foreground">{(order.profiles as any)?.full_name || (order.profiles as any)?.email}</td>
                <td className="p-4 font-body text-foreground">{(order.ebooks as any)?.title}</td>
                <td className="p-4 font-mono text-primary">{formatPrice(order.amount_paid)}</td>
                <td className="p-4">
                  <span className={`font-mono text-xs ${order.status === "COMPLETED" ? "text-primary" : order.status === "REFUNDED" ? "text-destructive" : "text-warning"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center font-mono text-xs text-muted-foreground">NO ORDERS YET</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
