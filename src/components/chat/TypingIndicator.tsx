import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="message-fade-in flex gap-3 max-w-3xl mx-auto px-4">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 bg-ai-bubble text-ai-bubble-foreground border border-border">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-ai-bubble rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
        <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}
