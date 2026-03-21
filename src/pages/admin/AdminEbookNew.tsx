import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CoverUpload from "@/components/admin/CoverUpload";
import PdfUpload from "@/components/admin/PdfUpload";

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminEbookNew = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "", author: "CyberHawk-UG Threat Intel Team", tags: "",
  });
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const priceInCents = Math.round(parseFloat(form.price) * 100);
    if (isNaN(priceInCents) || priceInCents <= 0) { setError("Invalid price"); setLoading(false); return; }

    const slug = slugify(form.title);
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);

    const { error: insertError } = await supabase.from("ebooks").insert({
      title: form.title,
      slug,
      description: form.description,
      price: priceInCents,
      category: form.category,
      author: form.author,
      tags,
      cover_url: coverUrl,
      file_key: fileKey,
      file_size: fileSize,
    });

    setLoading(false);
    if (insertError) { setError(insertError.message); return; }
    navigate("/admin/ebooks");
  };

  return (
    <div>
      <h1 className="font-display font-bold text-2xl tracking-[0.1em] uppercase text-foreground mb-8">NEW EBOOK</h1>

      {error && (
        <div className="border border-destructive bg-destructive/10 p-3 mb-6">
          <p className="font-mono text-xs text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <CoverUpload currentUrl={coverUrl} folder="ebooks" onUpload={setCoverUrl} onRemove={() => setCoverUrl(null)} />
        <PdfUpload currentFileKey={fileKey} onUpload={(key, size) => { setFileKey(key); setFileSize(size); }} onRemove={() => { setFileKey(null); setFileSize(null); }} />
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
            className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" placeholder="ransomware, threat-intel, east-africa" />
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading}
            className="px-8 py-3 font-display font-bold tracking-widest uppercase text-sm cyber-clip bg-primary text-primary-foreground hover:brightness-125 transition-all disabled:opacity-50">
            {loading ? "CREATING..." : "CREATE EBOOK"}
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

export default AdminEbookNew;
