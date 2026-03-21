import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, X } from "lucide-react";

interface PdfUploadProps {
  currentFileKey: string | null;
  onUpload: (fileKey: string, fileSize: number) => void;
  onRemove: () => void;
}

const PdfUpload = ({ currentFileKey, onUpload, onRemove }: PdfUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setError("Max file size is 500MB");
      return;
    }

    setUploading(true);
    setError("");

    const fileKey = `${crypto.randomUUID()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("ebooks")
      .upload(fileKey, file, { contentType: "application/pdf", upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    onUpload(fileKey, file.size);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <label className="block font-mono text-xs text-muted-foreground mb-2 tracking-wider uppercase">PDF FILE</label>

      {currentFileKey ? (
        <div className="flex items-center gap-3 p-3 border border-border bg-secondary">
          <FileText className="w-5 h-5 text-primary shrink-0" />
          <span className="font-mono text-xs text-foreground truncate flex-1">{currentFileKey}</span>
          <button type="button" onClick={onRemove} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-3 w-full p-4 border border-dashed border-border bg-secondary hover:border-primary/50 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span className="font-mono text-xs text-muted-foreground animate-pulse">UPLOADING PDF...</span>
          ) : (
            <>
              <Upload className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <span className="font-mono text-xs text-muted-foreground block">CLICK TO UPLOAD PDF</span>
                <span className="font-mono text-[10px] text-muted-foreground/60">MAX 500MB</span>
              </div>
            </>
          )}
        </button>
      )}

      {currentFileKey && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="mt-2 flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          <Upload className="w-3 h-3" /> {uploading ? "UPLOADING..." : "REPLACE PDF"}
        </button>
      )}

      <input ref={fileRef} type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
      {error && <p className="font-mono text-xs text-destructive mt-2">{error}</p>}
    </div>
  );
};

export default PdfUpload;
