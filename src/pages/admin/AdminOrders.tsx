import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("purchases")
        .select("*, profiles(email, full_name), ebooks(title)")
        .order("created_at", { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div>
      <h1 className="font-display font-bold text-2xl tracking-[0.1em] uppercase text-foreground mb-8">ORDERS</h1>

      <div className="border border-border bg-card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">CUSTOMER</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">EBOOK</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">AMOUNT</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">STATUS</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">DOWNLOADS</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">DATE</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border/50">
                <td className="p-4 font-body text-foreground">{(order.profiles as any)?.full_name || (order.profiles as any)?.email}</td>
                <td className="p-4 font-body text-foreground">{(order.ebooks as any)?.title}</td>
                <td className="p-4 font-mono text-primary">{formatPrice(order.amount_paid)}</td>
                <td className="p-4">
                  <span className={`font-mono text-xs ${order.status === "COMPLETED" ? "text-primary" : order.status === "REFUNDED" ? "text-destructive" : "text-warning"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-muted-foreground">{order.download_count}/10</td>
                <td className="p-4 font-mono text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && !loading && (
              <tr><td colSpan={6} className="p-8 text-center font-mono text-xs text-muted-foreground">NO ORDERS YET</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
