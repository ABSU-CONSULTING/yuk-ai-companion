import { Message } from "@/types/chat";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("message-fade-in flex gap-3 max-w-3xl mx-auto px-4", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
          isUser ? "bg-user-bubble text-user-bubble-foreground" : "bg-ai-bubble text-ai-bubble-foreground border border-border"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={cn(
          "flex-1 rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-user-bubble text-user-bubble-foreground rounded-tr-sm"
            : "bg-ai-bubble text-ai-bubble-foreground rounded-tl-sm"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
