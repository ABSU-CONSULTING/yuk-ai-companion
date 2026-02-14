import { useState } from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  Search,
  ChevronDown,
  ChevronRight,
  Settings,
} from "lucide-react";
import { Conversation, Project } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  conversations: Conversation[];
  projects: Project[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: (projectId?: string) => void;
  onDelete: (id: string) => void;
  onCreateProject: (name: string, description: string) => void;
  onDeleteProject: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatSidebar({
  conversations,
  projects,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  onCreateProject,
  onDeleteProject,
  isOpen,
  onToggle,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(["default"]));
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getConversationsForProject = (projectId: string) =>
    filteredConversations.filter((c) => c.projectId === projectId);

  const todayConversations = filteredConversations.filter((c) => {
    const today = new Date();
    return c.updatedAt.toDateString() === today.toDateString();
  });

  const olderConversations = filteredConversations.filter((c) => {
    const today = new Date();
    return c.updatedAt.toDateString() !== today.toDateString();
  });

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim(), "");
      setNewProjectName("");
      setShowNewProject(false);
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out overflow-hidden shrink-0",
        isOpen ? "w-[260px]" : "w-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-[15px] font-bold tracking-widest uppercase text-foreground">YUK</span>
        <button
          onClick={() => onCreate()}
          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
          title="New chat"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-accent rounded-xl subtle-border">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
        {/* Projects */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Projects
            </span>
            <button
              onClick={() => setShowNewProject(!showNewProject)}
              className="p-0.5 rounded hover:bg-accent text-muted-foreground"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {showNewProject && (
            <div className="mx-2 mb-2">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                placeholder="Project name..."
                autoFocus
                className="w-full px-3 py-1.5 text-sm bg-accent rounded-lg outline-none subtle-border focus:border-foreground/20 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}

          {projects.map((project) => {
            const projectConvs = getConversationsForProject(project.id);
            const isExpanded = expandedProjects.has(project.id);

            return (
              <div key={project.id} className="mb-0.5">
                <button
                  onClick={() => toggleProject(project.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm sidebar-item-hover group"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  )}
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="truncate text-foreground/70 text-[13px]">{project.name}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                    {projectConvs.length}
                  </span>
                  {project.id !== "default" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(project.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-4 space-y-0.5">
                    {projectConvs.length === 0 ? (
                      <button
                        onClick={() => onCreate(project.id)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:bg-accent transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>New chat</span>
                      </button>
                    ) : (
                      projectConvs.map((conv) => (
                        <ConversationItem
                          key={conv.id}
                          conv={conv}
                          isActive={conv.id === activeId}
                          onSelect={onSelect}
                          onDelete={onDelete}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Chats */}
        {todayConversations.length > 0 && (
          <div className="mb-3">
            <span className="px-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Today
            </span>
            <div className="mt-1 space-y-0.5">
              {todayConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === activeId}
                  onSelect={onSelect}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}

        {olderConversations.length > 0 && (
          <div className="mb-3">
            <span className="px-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Previous
            </span>
            <div className="mt-1 space-y-0.5">
              {olderConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === activeId}
                  onSelect={onSelect}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground sidebar-item-hover">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}

function ConversationItem({
  conv,
  isActive,
  onSelect,
  onDelete,
}: {
  conv: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(conv.id)}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[13px] transition-all group",
        isActive
          ? "bg-accent text-foreground font-medium"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground/80"
      )}
    >
      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-40" />
      <span className="truncate flex-1">{conv.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(conv.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-destructive transition-all"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </button>
  );
}
