import { useState, useRef, useEffect } from "react";
import { ArrowUp, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttachedFile {
  file: File;
  id: string;
}

interface ChatInputProps {
  onSend: (message: string, attachments?: { name: string; type: string; size: number }[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if ((!trimmed && attachedFiles.length === 0) || disabled) return;

    const attachments = attachedFiles.map((af) => ({
      name: af.file.name,
      type: af.file.type,
      size: af.file.size,
    }));

    onSend(trimmed || "Sent file(s)", attachments.length > 0 ? attachments : undefined);
    setValue("");
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map((file) => ({
      file,
      id: Math.random().toString(36).slice(2, 8),
    }));
    setAttachedFiles((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 pb-6 pt-2">
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachedFiles.map((af) => (
            <div
              key={af.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-xl text-xs subtle-border"
            >
              {af.file.type.startsWith("image/") ? (
                <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <span className="truncate max-w-[120px] text-foreground/70">{af.file.name}</span>
              <button onClick={() => removeFile(af.id)} className="hover:text-destructive text-muted-foreground">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 bg-card subtle-border rounded-2xl p-2 focus-within:border-foreground/20 transition-all">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.txt,.md,.csv,.json,.py,.js,.ts,.tsx,.jsx"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl hover:bg-accent text-muted-foreground transition-colors shrink-0"
          title="Attach files"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message YUK..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent resize-none text-[14px] text-foreground placeholder:text-muted-foreground outline-none py-2 max-h-40 scrollbar-thin leading-relaxed"
        />

        <button
          onClick={handleSubmit}
          disabled={(!value.trim() && attachedFiles.length === 0) || disabled}
          className={cn(
            "p-2 rounded-xl transition-all shrink-0",
            value.trim() || attachedFiles.length > 0
              ? "bg-foreground text-background hover:opacity-80"
              : "bg-muted text-muted-foreground"
          )}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-[10px] text-muted-foreground/60 mt-3 tracking-wide uppercase">
        YUK runs locally via Ollama · Your data never leaves your machine
      </p>
    </div>
  );
}
