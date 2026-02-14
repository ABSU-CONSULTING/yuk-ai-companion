import { useState, useCallback } from "react";
import { Message, Conversation } from "@/types/chat";

const generateId = () => Math.random().toString(36).slice(2, 10);

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "welcome",
    title: "Welcome to YUK",
    messages: [],
    model: "llama3.2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState("welcome");
  const [selectedModel, setSelectedModel] = useState("llama3.2");
  const [isGenerating, setIsGenerating] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const createConversation = useCallback(() => {
    const newConv: Conversation = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      model: selectedModel,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  }, [selectedModel]);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const filtered = prev.filter((c) => c.id !== id);
        if (id === activeConversationId && filtered.length > 0) {
          setActiveConversationId(filtered[0].id);
        }
        return filtered.length > 0 ? filtered : INITIAL_CONVERSATIONS;
      });
    },
    [activeConversationId]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversationId) return c;
          const title = c.messages.length === 0 ? content.slice(0, 40) : c.title;
          return { ...c, title, messages: [...c.messages, userMsg], updatedAt: new Date() };
        })
      );

      setIsGenerating(true);

      // Simulate AI response (replace with Ollama API call)
      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

      const aiMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: getSimulatedResponse(content),
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversationId) return c;
          return { ...c, messages: [...c.messages, aiMsg], updatedAt: new Date() };
        })
      );

      setIsGenerating(false);
    },
    [activeConversationId]
  );

  return {
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
  };
}

function getSimulatedResponse(input: string): string {
  const responses = [
    `Great question! Here's what I think about "${input.slice(0, 30)}...":\n\nThis is a simulated response from YUK. Connect your Ollama backend to get real AI responses. You can configure the API endpoint in settings to point to your local Ollama instance.`,
    `I'd be happy to help with that!\n\nTo get started with real responses, make sure Ollama is running locally and configure the API endpoint. YUK supports all Ollama models including Llama, Mistral, CodeLlama, and more.`,
    `Here's my analysis:\n\n1. **First point** — This is a demo response\n2. **Second point** — Connect Ollama for real AI\n3. **Third point** — YUK supports streaming responses\n\nLet me know if you need anything else!`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
