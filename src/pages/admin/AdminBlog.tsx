import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import ThreatBadge from "@/components/ui/ThreatBadge";

const AdminBlog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const togglePublish = async (id: string, current: boolean) => {
    const updates: any = { is_published: !current };
    if (!current) updates.published_at = new Date().toISOString();
    await supabase.from("blog_posts").update(updates).eq("id", id);
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    fetchPosts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl tracking-[0.1em] uppercase text-foreground">BLOG POSTS</h1>
        <Link to="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 font-mono text-xs bg-primary text-primary-foreground cyber-clip hover:brightness-125 transition-all">
          <Plus className="w-4 h-4" /> NEW POST
        </Link>
      </div>

      <div className="border border-border bg-card overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">TITLE</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">CATEGORY</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">THREAT</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">STATUS</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border/50">
                <td className="p-4 font-body text-foreground">{post.title}</td>
                <td className="p-4 font-mono text-xs text-muted-foreground">{post.category}</td>
                <td className="p-4">{post.threat_level && <ThreatBadge level={post.threat_level} />}</td>
                <td className="p-4">
                  <span className={`font-mono text-xs ${post.is_published ? "text-primary" : "text-muted-foreground"}`}>
                    {post.is_published ? "PUBLISHED" : "DRAFT"}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => togglePublish(post.id, post.is_published)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                    {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <Link to={`/admin/blog/${post.id}/edit`} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => deletePost(post.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && !loading && (
              <tr><td colSpan={5} className="p-8 text-center font-mono text-xs text-muted-foreground">NO POSTS YET</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBlog;
