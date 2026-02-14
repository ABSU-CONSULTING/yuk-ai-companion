import { Code, BookOpen, Lightbulb, PenLine } from "lucide-react";

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
      <div className="mb-12 text-center">
        <h1 className="text-[42px] font-light tracking-tight text-foreground mb-1 text-glow">
          The only move
        </h1>
        <h1 className="text-[42px] font-semibold tracking-tight text-foreground text-glow">
          that matters.
        </h1>
        <p className="text-muted-foreground text-sm mt-4 max-w-sm mx-auto leading-relaxed">
          Local AI, powered by Ollama. Private, fast, yours.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onSuggestion(s.text)}
            className="flex flex-col gap-2.5 p-4 rounded-2xl bg-card subtle-border hover-lift text-left group"
          >
            <div className="flex items-center gap-2">
              <s.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                {s.label}
              </span>
            </div>
            <span className="text-[13px] text-foreground/70 leading-snug group-hover:text-foreground transition-colors">
              {s.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
