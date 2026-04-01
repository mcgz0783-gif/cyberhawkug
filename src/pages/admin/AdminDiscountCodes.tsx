import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminDiscountCodes = () => {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", description: "", discount_percent: 10, max_uses: "" as string, expires_at: "" });
  const [saving, setSaving] = useState(false);

  const fetchCodes = async () => {
    const { data } = await supabase.from("discount_codes").select("*").order("created_at", { ascending: false });
    if (data) setCodes(data);
    setLoading(false);
  };

  useEffect(() => { fetchCodes(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: any = {
      code: form.code.toUpperCase().trim(),
      description: form.description || null,
      discount_percent: form.discount_percent,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expires_at: form.expires_at || null,
    };
    const { error } = await supabase.from("discount_codes").insert(payload);
    if (error) { toast.error(error.message); } else {
      toast.success("Discount code created");
      setShowForm(false);
      setForm({ code: "", description: "", discount_percent: 10, max_uses: "", expires_at: "" });
      fetchCodes();
    }
    setSaving(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("discount_codes").update({ is_active: !current }).eq("id", id);
    fetchCodes();
  };

  const deleteCode = async (id: string) => {
    if (!confirm("Delete this discount code?")) return;
    await supabase.from("discount_codes").delete().eq("id", id);
    fetchCodes();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl tracking-wider uppercase text-foreground">Discount Codes</h1>
          <p className="font-mono text-xs text-muted-foreground mt-1">Manage coupon codes for the store</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-mono text-xs tracking-wider hover:brightness-125 transition-all"
        >
          <Plus className="w-4 h-4" /> NEW CODE
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border border-border bg-card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-muted-foreground block mb-1">CODE *</label>
              <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="SAVE20" required className="font-mono uppercase" />
            </div>
            <div>
              <label className="font-mono text-xs text-muted-foreground block mb-1">DISCOUNT % *</label>
              <Input type="number" min={1} max={100} value={form.discount_percent} onChange={e => setForm({ ...form, discount_percent: parseInt(e.target.value) })} required />
            </div>
            <div>
              <label className="font-mono text-xs text-muted-foreground block mb-1">DESCRIPTION</label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Summer sale discount" />
            </div>
            <div>
              <label className="font-mono text-xs text-muted-foreground block mb-1">MAX USES (blank = unlimited)</label>
              <Input type="number" min={1} value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })} placeholder="100" />
            </div>
            <div>
              <label className="font-mono text-xs text-muted-foreground block mb-1">EXPIRES AT</label>
              <Input type="datetime-local" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} />
            </div>
          </div>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground font-mono text-xs tracking-wider hover:brightness-125 disabled:opacity-50">
            {saving ? "CREATING..." : "CREATE CODE"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading...</p>
      ) : codes.length === 0 ? (
        <div className="border border-border bg-card p-12 text-center">
          <p className="font-mono text-sm text-muted-foreground">No discount codes yet</p>
        </div>
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary/50">
              <tr className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Uses</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(c => (
                <tr key={c.id} className="border-t border-border hover:bg-secondary/20">
                  <td className="px-4 py-3 font-mono text-sm text-primary font-bold">{c.code}</td>
                  <td className="px-4 py-3 font-mono text-sm text-foreground">{c.discount_percent}%</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {c.current_uses}{c.max_uses ? `/${c.max_uses}` : " / ∞"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${c.is_active ? "border-primary text-primary" : "border-destructive text-destructive"}`}>
                      {c.is_active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button onClick={() => toggleActive(c.id, c.is_active)} className="p-1 text-muted-foreground hover:text-primary transition-colors" title="Toggle active">
                      {c.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button onClick={() => deleteCode(c.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDiscountCodes;
