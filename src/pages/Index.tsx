import { useState, useRef, useEffect } from "react";
import { PanelLeft, Share } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ChatInput } from "@/components/chat/ChatInput";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { EmptyState } from "@/components/chat/EmptyState";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    selectedModel,
    setSelectedModel,
    isGenerating,
    createConversation,
    deleteConversation,
    sendMessage,
    projects,
    createProject,
    deleteProject,
  } = useChat();

  const messages = activeConversation?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <ChatSidebar
        conversations={conversations}
        projects={projects}
        activeId={activeConversationId || ""}
        onSelect={setActiveConversationId}
        onCreate={createConversation}
        onDelete={deleteConversation}
        onCreateProject={createProject}
        onDeleteProject={deleteProject}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 h-12 border-b border-border bg-background/60 glass-effect sticky top-0 z-10">
          <div className="flex items-center gap-1">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl hover:bg-accent text-muted-foreground transition-colors"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}
            <ModelSelector value={selectedModel} onChange={setSelectedModel} />
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl hover:bg-accent text-muted-foreground transition-colors">
              <Share className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Messages */}
        {messages.length === 0 && !isGenerating ? (
          <EmptyState onSuggestion={(text) => sendMessage(text)} />
        ) : (
          <div className="flex-1 overflow-y-auto scrollbar-thin py-6 space-y-3">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isGenerating && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={isGenerating} />
      </div>
    </div>
  );
};

export default Index;
