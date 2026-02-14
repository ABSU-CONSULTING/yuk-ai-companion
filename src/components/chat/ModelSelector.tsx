import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const MODELS = [
  { id: "llama3.2", name: "Llama 3.2", tag: "8B" },
  { id: "llama3.1", name: "Llama 3.1", tag: "70B" },
  { id: "mistral", name: "Mistral", tag: "7B" },
  { id: "codellama", name: "CodeLlama", tag: "13B" },
  { id: "gemma2", name: "Gemma 2", tag: "9B" },
  { id: "phi3", name: "Phi-3", tag: "3.8B" },
];

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = MODELS.find((m) => m.id === value) || MODELS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
      >
        {selected.name}
        <span className="text-xs text-muted-foreground font-mono">{selected.tag}</span>
        <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-card border border-border rounded-xl shadow-xl z-50 py-1 message-fade-in">
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => { onChange(model.id); setOpen(false); }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-accent transition-colors",
                model.id === value && "text-primary"
              )}
            >
              <span>{model.name}</span>
              <span className="text-xs text-muted-foreground font-mono">{model.tag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
