import { Message } from "@/types/chat";
import { Bot, User, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className="message-fade-in max-w-3xl mx-auto px-4 py-1.5">
      <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
        <div
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
            isUser
              ? "bg-foreground text-background"
              : "bg-accent text-foreground subtle-border"
          )}
        >
          {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-foreground">
              {isUser ? "You" : "YUK"}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {message.attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 px-3 py-2 bg-accent rounded-xl text-xs subtle-border"
                >
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  <span className="truncate max-w-[150px] text-foreground/70">{file.name}</span>
                  <span className="text-muted-foreground">
                    {(file.size / 1024).toFixed(0)}KB
                  </span>
                </div>
              ))}
            </div>
          )}

          <div
            className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap",
              isUser ? "text-foreground/90" : "text-foreground/70"
            )}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
}
