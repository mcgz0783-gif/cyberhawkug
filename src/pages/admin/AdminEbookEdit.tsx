import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AdminEbookEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "", author: "", tags: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEbook = async () => {
      const { data, error } = await supabase.from("ebooks").select("*").eq("id", id!).single();
      if (error || !data) { setError("Ebook not found"); setLoading(false); return; }
      setForm({
        title: data.title,
        description: data.description,
        price: (data.price / 100).toFixed(2),
        category: data.category || "",
        author: data.author || "",
        tags: (data.tags || []).join(", "),
      });
      setLoading(false);
    };
    fetchEbook();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const priceInCents = Math.round(parseFloat(form.price) * 100);
    if (isNaN(priceInCents) || priceInCents <= 0) { setError("Invalid price"); setSaving(false); return; }

    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);

    const { error: updateError } = await supabase.from("ebooks").update({
      title: form.title,
      description: form.description,
      price: priceInCents,
      category: form.category,
      author: form.author,
      tags,
    }).eq("id", id!);

    setSaving(false);
    if (updateError) { setError(updateError.message); return; }
    navigate("/admin/ebooks");
  };

  if (loading) return <div className="py-20 text-center font-mono text-sm text-muted-foreground animate-pulse">LOADING...</div>;

  return (
    <div>
      <h1 className="font-display font-bold text-2xl tracking-[0.1em] uppercase text-foreground mb-8">EDIT EBOOK</h1>

      {error && (
        <div className="border border-destructive bg-destructive/10 p-3 mb-6">
          <p className="font-mono text-xs text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">TITLE</label>
          <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">DESCRIPTION</label>
          <textarea required rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">PRICE (USD)</label>
            <input type="number" step="0.01" min="0.50" required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">CATEGORY</label>
            <input type="text" required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">AUTHOR</label>
          <input type="text" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
            className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">TAGS (COMMA-SEPARATED)</label>
          <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
            className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={saving}
            className="px-8 py-3 font-display font-bold tracking-widest uppercase text-sm cyber-clip bg-primary text-primary-foreground hover:brightness-125 transition-all disabled:opacity-50">
            {saving ? "SAVING..." : "SAVE CHANGES"}
          </button>
          <button type="button" onClick={() => navigate("/admin/ebooks")}
            className="px-6 py-3 font-mono text-xs text-muted-foreground border border-border hover:border-primary transition-colors">
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEbookEdit;
