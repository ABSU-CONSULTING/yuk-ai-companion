import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="message-fade-in max-w-3xl mx-auto px-4 py-1.5">
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-accent text-foreground subtle-border">
          <Bot className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-foreground">YUK</span>
          </div>
          <div className="flex items-center gap-1.5 py-1">
            <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
