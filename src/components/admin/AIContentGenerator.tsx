import { useState } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { streamChat } from "@/lib/ai-chat";
import { toast } from "sonner";

interface AIContentGeneratorProps {
  onInsert?: (text: string) => void;
  placeholder?: string;
}

const AIContentGenerator = ({ onInsert, placeholder = "E.g. Write a blog post about ransomware prevention tips..." }: AIContentGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!prompt.trim() || isLoading) return;
    setResult("");
    setIsLoading(true);
    let content = "";

    try {
      await streamChat({
        messages: [{ role: "user", content: prompt }],
        mode: "content",
        onDelta: (chunk) => {
          content += chunk;
          setResult(content);
        },
        onDone: () => setIsLoading(false),
        onError: (err) => {
          toast.error(err);
          setIsLoading(false);
        },
      });
    } catch {
      toast.error("Failed to generate content");
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-card space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="font-display text-sm tracking-wider uppercase text-foreground">AI Content Generator</span>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />

      <button
        onClick={generate}
        disabled={isLoading || !prompt.trim()}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-mono tracking-wider rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
        {isLoading ? "GENERATING..." : "GENERATE"}
      </button>

      {result && (
        <div className="relative">
          <div className="bg-background border border-border rounded p-3 text-sm text-foreground max-h-64 overflow-y-auto whitespace-pre-wrap">
            {result}
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={copyToClipboard} className="flex items-center gap-1 px-3 py-1.5 bg-secondary text-foreground text-xs font-mono rounded hover:bg-secondary/80 transition-colors">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "COPIED" : "COPY"}
            </button>
            {onInsert && (
              <button onClick={() => onInsert(result)} className="flex items-center gap-1 px-3 py-1.5 bg-primary/20 text-primary text-xs font-mono rounded hover:bg-primary/30 transition-colors">
                INSERT
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator;
