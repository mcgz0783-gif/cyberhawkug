import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface CoverUploadProps {
  currentUrl: string | null;
  folder: string; // e.g. "ebooks" or "blog"
  onUpload: (url: string) => void;
  onRemove: () => void;
}

const CoverUpload = ({ currentUrl, folder, onUpload, onRemove }: CoverUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Max file size is 5MB");
      return;
    }

    setUploading(true);
    setError("");

    const ext = file.name.split(".").pop();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("covers")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("covers").getPublicUrl(path);
    onUpload(publicUrl);
    setUploading(false);

    // Reset input
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">COVER IMAGE</label>

      {currentUrl ? (
        <div className="relative w-48 h-64 border border-border bg-secondary group">
          <img src={currentUrl} alt="Cover" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-1 bg-background/80 border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center w-48 h-64 border border-dashed border-border bg-secondary hover:border-primary/50 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span className="font-mono text-xs text-muted-foreground animate-pulse">UPLOADING...</span>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="font-mono text-xs text-muted-foreground">CLICK TO UPLOAD</span>
              <span className="font-mono text-[10px] text-muted-foreground/60 mt-1">MAX 5MB</span>
            </>
          )}
        </button>
      )}

      {currentUrl && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="mt-2 flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          <Upload className="w-3 h-3" /> {uploading ? "UPLOADING..." : "REPLACE"}
        </button>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

      {error && <p className="font-mono text-xs text-destructive mt-2">{error}</p>}
    </div>
  );
};

export default CoverUpload;
