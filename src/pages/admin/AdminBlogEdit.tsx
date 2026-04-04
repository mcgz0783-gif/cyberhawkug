import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CoverUpload from "@/components/admin/CoverUpload";
import AIContentGenerator from "@/components/admin/AIContentGenerator";

const CATEGORIES = ["RANSOMWARE", "ZERO-DAY", "AI THREATS", "DATA BREACH", "PHISHING", "INFRASTRUCTURE", "ADVISORY", "GENERAL"];
const THREAT_LEVELS = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

const AdminBlogEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", category: "GENERAL", threat_level: "", tags: "", read_time: "",
  });
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id!).single();
      if (error || !data) { setError("Post not found"); setLoading(false); return; }
      setForm({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        threat_level: data.threat_level || "",
        tags: (data.tags || []).join(", "),
        read_time: data.read_time || "",
      });
      setCoverUrl(data.cover_url || null);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);

    const { error: updateError } = await supabase.from("blog_posts").update({
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      threat_level: form.threat_level || null,
      tags,
      read_time: form.read_time || null,
      cover_url: coverUrl,
    }).eq("id", id!);

    setSaving(false);
    if (updateError) { setError(updateError.message); return; }
    navigate("/admin/blog");
  };

  if (loading) return <div className="py-20 text-center font-mono text-sm text-muted-foreground animate-pulse">LOADING...</div>;

  return (
    <div>
      <h1 className="font-display font-bold text-2xl tracking-[0.1em] uppercase text-foreground mb-8">EDIT BLOG POST</h1>

      {error && (
        <div className="border border-destructive bg-destructive/10 p-3 mb-6">
          <p className="font-mono text-xs text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
        <CoverUpload currentUrl={coverUrl} folder="blog" onUpload={setCoverUrl} onRemove={() => setCoverUrl(null)} />
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">TITLE</label>
          <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">EXCERPT</label>
          <textarea required rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none resize-none" />
        </div>
        <AIContentGenerator
          onInsert={(text) => setForm(f => ({ ...f, content: f.content ? f.content + "\n\n" + text : text }))}
          placeholder="E.g. Write a blog post about ransomware prevention tips..."
        />
        <div>
          <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">CONTENT (MARKDOWN)</label>
          <textarea required rows={12} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            className="w-full bg-secondary border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none resize-y" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">CATEGORY</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">THREAT LEVEL</label>
            <select value={form.threat_level} onChange={e => setForm(f => ({ ...f, threat_level: e.target.value }))}
              className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none">
              <option value="">NONE</option>
              {THREAT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">READ TIME</label>
            <input type="text" value={form.read_time} onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))}
              className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" placeholder="8 MIN READ" />
          </div>
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
          <button type="button" onClick={() => navigate("/admin/blog")}
            className="px-6 py-3 font-mono text-xs text-muted-foreground border border-border hover:border-primary transition-colors">
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogEdit;
