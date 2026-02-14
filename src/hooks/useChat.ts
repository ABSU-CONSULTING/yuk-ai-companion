import { useState, useCallback } from "react";
import { Message, Conversation, Project } from "@/types/chat";

const generateId = () => Math.random().toString(36).slice(2, 10);

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "default",
    name: "General",
    description: "Default project for all conversations",
    color: "#007AFF",
    conversationIds: [],
    createdAt: new Date(),
  },
];

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("llama3.2");
  const [isGenerating, setIsGenerating] = useState(false);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  const createConversation = useCallback((projectId?: string) => {
    const newConv: Conversation = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      model: selectedModel,
      createdAt: new Date(),
      updatedAt: new Date(),
      projectId: projectId || "default",
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    return newConv.id;
  }, [selectedModel]);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const filtered = prev.filter((c) => c.id !== id);
        if (id === activeConversationId) {
          setActiveConversationId(filtered.length > 0 ? filtered[0].id : null);
        }
        return filtered;
      });
    },
    [activeConversationId]
  );

  const createProject = useCallback((name: string, description: string) => {
    const colors = ["#007AFF", "#34C759", "#FF9500", "#FF3B30", "#AF52DE", "#5AC8FA"];
    const proj: Project = {
      id: generateId(),
      name,
      description,
      color: colors[Math.floor(Math.random() * colors.length)],
      conversationIds: [],
      createdAt: new Date(),
    };
    setProjects((prev) => [...prev, proj]);
    return proj.id;
  }, []);

  const deleteProject = useCallback((id: string) => {
    if (id === "default") return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setConversations((prev) => prev.filter((c) => c.projectId !== id));
  }, []);

  const sendMessage = useCallback(
    async (content: string, attachments?: { name: string; type: string; size: number }[]) => {
      let convId = activeConversationId;
      if (!convId) {
        const newConv: Conversation = {
          id: generateId(),
          title: content.slice(0, 40),
          messages: [],
          model: selectedModel,
          createdAt: new Date(),
          updatedAt: new Date(),
          projectId: "default",
        };
        setConversations((prev) => [newConv, ...prev]);
        convId = newConv.id;
        setActiveConversationId(convId);
      }

      const fileAttachments = attachments?.map((a) => ({
        id: generateId(),
        name: a.name,
        type: a.type,
        size: a.size,
        url: "#",
      }));

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
        attachments: fileAttachments,
      };

      const currentConvId = convId;

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== currentConvId) return c;
          const title = c.messages.length === 0 ? content.slice(0, 40) : c.title;
          return { ...c, title, messages: [...c.messages, userMsg], updatedAt: new Date() };
        })
      );

      setIsGenerating(true);
      await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));

      const aiMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: getSimulatedResponse(content),
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== currentConvId) return c;
          return { ...c, messages: [...c.messages, aiMsg], updatedAt: new Date() };
        })
      );
      setIsGenerating(false);
    },
    [activeConversationId, selectedModel]
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
    projects,
    createProject,
    deleteProject,
  };
}

function getSimulatedResponse(input: string): string {
  const responses = [
    `Here's my take on "${input.slice(0, 30)}...":\n\nThis is a simulated response from **YUK**. Connect your Ollama backend to get real AI responses.\n\nYou can configure the API endpoint to point to your local Ollama instance running at \`localhost:11434\`.`,
    `Great question! Let me break this down:\n\n1. **Key Insight** — YUK is your local AI interface\n2. **Privacy First** — All data stays on your machine\n3. **Model Flexibility** — Switch between any Ollama model\n\nTo get started with real responses, ensure Ollama is running locally.`,
    `I'd love to help with that.\n\nYUK supports all Ollama models including:\n- **Llama 3.2** for general tasks\n- **CodeLlama** for programming\n- **Mistral** for reasoning\n- **Gemma** for creative writing\n\nConfigure your endpoint in settings to connect.`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
