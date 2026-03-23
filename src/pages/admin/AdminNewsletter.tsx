import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Search, Mail, Users, UserCheck, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSubscribers = async () => {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });
    if (data) setSubscribers(data);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setLoading(false);
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = subscribers.filter((s) => s.is_active).length;
  const inactiveCount = subscribers.filter((s) => !s.is_active).length;

  const exportCSV = () => {
    const rows = [
      ["Email", "Status", "Subscribed At"],
      ...filtered.map((s) => [
        s.email,
        s.is_active ? "Active" : "Inactive",
        new Date(s.subscribed_at).toISOString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${filtered.length} subscribers exported to CSV.` });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-display font-bold text-2xl tracking-[0.1em] uppercase text-foreground">
          NEWSLETTER
        </h1>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-mono text-xs tracking-wider hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" /> EXPORT CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-mono text-xs text-muted-foreground">TOTAL</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">{subscribers.length}</p>
        </div>
        <div className="border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="w-5 h-5 text-primary" />
            <span className="font-mono text-xs text-muted-foreground">ACTIVE</span>
          </div>
          <p className="font-display text-3xl font-bold text-primary">{activeCount}</p>
        </div>
        <div className="border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <UserX className="w-5 h-5 text-destructive" />
            <span className="font-mono text-xs text-muted-foreground">INACTIVE</span>
          </div>
          <p className="font-display text-3xl font-bold text-destructive">{inactiveCount}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search subscribers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card border-border font-mono text-sm"
        />
      </div>

      {/* Table */}
      <div className="border border-border bg-card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">EMAIL</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">STATUS</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">SUBSCRIBED</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-border/50">
                <td className="p-4 font-mono text-xs text-foreground">{s.email}</td>
                <td className="p-4">
                  <span className={`font-mono text-xs px-2 py-1 ${s.is_active ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10"}`}>
                    {s.is_active ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-muted-foreground">
                  {new Date(s.subscribed_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan={3} className="p-8 text-center font-mono text-xs text-muted-foreground">
                  {search ? "NO MATCHING SUBSCRIBERS" : "NO SUBSCRIBERS YET"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Broadcast note */}
      <div className="mt-8 border border-border bg-card/50 p-6">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-mono text-xs text-foreground mb-1">BROADCAST EMAILS</p>
            <p className="font-body text-sm text-muted-foreground">
              For bulk newsletter campaigns, export your subscriber list and use a dedicated email marketing service 
              (e.g. Mailchimp, ConvertKit, Brevo). This ensures proper deliverability, unsubscribe handling, and compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;
