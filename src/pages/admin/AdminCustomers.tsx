import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ban, CheckCircle } from "lucide-react";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setCustomers(data);
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const toggleBan = async (id: string, currentlyBanned: boolean) => {
    const reason = currentlyBanned ? null : prompt("Ban reason:");
    if (!currentlyBanned && !reason) return;
    await supabase.from("profiles").update({
      is_banned: !currentlyBanned,
      ban_reason: currentlyBanned ? null : reason,
    }).eq("id", id);
    fetchCustomers();
  };

  return (
    <div>
      <h1 className="font-display font-bold text-2xl tracking-[0.1em] uppercase text-foreground mb-8">CUSTOMERS</h1>

      <div className="border border-border bg-card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">NAME</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">EMAIL</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">ROLE</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">STATUS</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">JOINED</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-border/50">
                <td className="p-4 font-body text-foreground">{c.full_name || "—"}</td>
                <td className="p-4 font-mono text-xs text-foreground">{c.email}</td>
                <td className="p-4 font-mono text-xs text-muted-foreground">{c.role}</td>
                <td className="p-4">
                  <span className={`font-mono text-xs ${c.is_banned ? "text-destructive" : "text-primary"}`}>
                    {c.is_banned ? "BANNED" : "ACTIVE"}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  {c.role === "CUSTOMER" && (
                    <button onClick={() => toggleBan(c.id, c.is_banned)}
                      className={`p-2 transition-colors ${c.is_banned ? "text-primary hover:text-primary" : "text-muted-foreground hover:text-destructive"}`}
                      title={c.is_banned ? "Unban" : "Ban"}>
                      {c.is_banned ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {customers.length === 0 && !loading && (
              <tr><td colSpan={6} className="p-8 text-center font-mono text-xs text-muted-foreground">NO CUSTOMERS YET</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;
