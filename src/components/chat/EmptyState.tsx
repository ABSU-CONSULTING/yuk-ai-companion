import { Sparkles, Code, BookOpen, Lightbulb } from "lucide-react";

interface EmptyStateProps {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  { icon: Code, text: "Write a Python function to sort a list", label: "Code" },
  { icon: BookOpen, text: "Explain quantum computing simply", label: "Learn" },
  { icon: Lightbulb, text: "Give me 5 startup ideas for AI", label: "Ideas" },
  { icon: Sparkles, text: "Write a poem about the ocean", label: "Create" },
];

export function EmptyState({ onSuggestion }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-mono tracking-tight text-foreground mb-2">
          YUK
        </h1>
        <p className="text-muted-foreground text-sm">
          Your local AI assistant powered by Ollama
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onSuggestion(s.text)}
            className="flex flex-col gap-2 p-4 rounded-xl bg-secondary border border-border hover:border-primary/30 hover:bg-accent transition-all text-left group"
          >
            <s.icon className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <span className="text-sm text-foreground leading-snug">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
