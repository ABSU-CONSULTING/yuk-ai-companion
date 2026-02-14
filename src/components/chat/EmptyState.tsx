import { Sparkles, Code, BookOpen, Lightbulb, Zap, PenLine } from "lucide-react";

interface EmptyStateProps {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  { icon: Code, text: "Write a Python function to sort a list", label: "Code" },
  { icon: BookOpen, text: "Explain quantum computing in simple terms", label: "Learn" },
  { icon: Lightbulb, text: "Give me 5 creative startup ideas using AI", label: "Ideas" },
  { icon: PenLine, text: "Help me write a professional email", label: "Write" },
];

export function EmptyState({ onSuggestion }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-5">
          <Zap className="w-7 h-7 text-foreground" />
        </div>
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground mb-2">
          How can I help?
        </h1>
        <p className="text-muted-foreground text-sm max-w-md">
          Ask me anything. I run locally on your machine via Ollama — fast, private, and flexible.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 max-w-lg w-full">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onSuggestion(s.text)}
            className="flex flex-col gap-2 p-4 rounded-2xl bg-card border border-border hover:border-foreground/15 hover:shadow-sm transition-all text-left group"
          >
            <div className="flex items-center gap-2">
              <s.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                {s.label}
              </span>
            </div>
            <span className="text-[13px] text-foreground/80 leading-snug">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
