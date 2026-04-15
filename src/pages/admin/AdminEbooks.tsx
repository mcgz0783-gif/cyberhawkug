import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface AdminEbook {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  created_at: string;
}

const AdminEbooks = () => {
  const [ebooks, setEbooks] = useState<AdminEbook[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEbooks = async () => {
    setLoading(true);
    const { data } = await supabase.from("ebooks").select("*").order("created_at", { ascending: false });
    if (data) setEbooks(data);
    setLoading(false);
  };

  useEffect(() => { fetchEbooks(); }, []);

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("ebooks").update({ is_published: !current }).eq("id", id);
    fetchEbooks();
  };

  const deleteEbook = async (id: string) => {
    if (!confirm("Delete this ebook?")) return;
    await supabase.from("ebooks").delete().eq("id", id);
    fetchEbooks();
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl tracking-[0.1em] uppercase text-foreground">EBOOKS</h1>
        <Link to="/admin/ebooks/new"
          className="flex items-center gap-2 px-4 py-2 font-mono text-xs bg-primary text-primary-foreground cyber-clip hover:brightness-125 transition-all">
          <Plus className="w-4 h-4" /> NEW EBOOK
        </Link>
      </div>

      <div className="border border-border bg-card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">TITLE</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">PRICE</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">STATUS</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {ebooks.map((ebook) => (
              <tr key={ebook.id} className="border-b border-border/50">
                <td className="p-4 font-body text-foreground">{ebook.title}</td>
                <td className="p-4 font-mono text-primary">{formatPrice(ebook.price)}</td>
                <td className="p-4">
                  <span className={`font-mono text-xs ${ebook.is_published ? "text-primary" : "text-muted-foreground"}`}>
                    {ebook.is_published ? "PUBLISHED" : "DRAFT"}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => togglePublish(ebook.id, ebook.is_published)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors" title={ebook.is_published ? "Unpublish" : "Publish"}>
                    {ebook.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <Link to={`/admin/ebooks/${ebook.id}/edit`} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => deleteEbook(ebook.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {ebooks.length === 0 && !loading && (
              <tr><td colSpan={4} className="p-8 text-center font-mono text-xs text-muted-foreground">NO EBOOKS YET</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEbooks;
