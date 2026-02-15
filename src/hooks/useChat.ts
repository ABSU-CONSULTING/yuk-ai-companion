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

const DEFAULT_ENDPOINT = "http://localhost:11434";

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("llama3.2");
  const [isGenerating, setIsGenerating] = useState(false);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [ollamaEndpoint, setOllamaEndpoint] = useState(
    () => localStorage.getItem("yuk-ollama-endpoint") || DEFAULT_ENDPOINT
  );

  const updateEndpoint = useCallback((url: string) => {
    const clean = url.replace(/\/+$/, "");
    setOllamaEndpoint(clean);
    localStorage.setItem("yuk-ollama-endpoint", clean);
  }, []);

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

      try {
        const currentConv = conversations.find((c) => c.id === currentConvId);
        const history = (currentConv?.messages || []).map((m) => ({
          role: m.role,
          content: m.content,
        }));
        history.push({ role: "user", content });

        const res = await fetch(`${ollamaEndpoint}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: selectedModel,
            messages: history,
            stream: false,
          }),
        });

        if (!res.ok) {
          throw new Error(`Ollama returned ${res.status}`);
        }

        const data = await res.json();
        const aiContent = data.message?.content || "No response received.";

        const aiMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: aiContent,
          timestamp: new Date(),
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== currentConvId) return c;
            return { ...c, messages: [...c.messages, aiMsg], updatedAt: new Date() };
          })
        );
      } catch (err: any) {
        const errorMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: `⚠️ **Connection failed**\n\nCouldn't reach Ollama at \`${ollamaEndpoint}\`.\n\n**To fix this:**\n1. Make sure Ollama is running on your VM\n2. Set \`OLLAMA_ORIGINS=*\` to allow CORS\n3. Update the endpoint URL in Settings with your VM's IP\n\nError: ${err.message}`,
          timestamp: new Date(),
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== currentConvId) return c;
            return { ...c, messages: [...c.messages, errorMsg], updatedAt: new Date() };
          })
        );
      }

      setIsGenerating(false);
    },
    [activeConversationId, selectedModel, ollamaEndpoint, conversations]
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
    ollamaEndpoint,
    updateEndpoint,
  };
}
