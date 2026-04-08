import { Plus, MessageSquare, Trash2, X } from "lucide-react";
import { Chat } from "@/lib/api";

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  open: boolean;
  onClose: () => void;
}

const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, open, onClose }: ChatSidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-foreground/20 z-30 md:hidden" onClick={onClose} />}

      <aside
        className={`fixed md:relative z-40 top-0 left-0 h-full w-72 bg-sidebar border-r flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-3 flex items-center justify-between border-b border-sidebar-border">
          <span className="text-sm font-semibold text-sidebar-foreground">Chats</span>
          <div className="flex gap-1">
            <button
              onClick={onNewChat}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors md:hidden">
              <X className="w-4 h-4 text-sidebar-foreground" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          {chats.length === 0 && (
            <p className="text-xs text-muted-foreground text-center mt-8">No chats yet. Start a conversation!</p>
          )}
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => { onSelectChat(chat.id); onClose(); }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer group transition-colors ${
                activeChatId === chat.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="text-sm truncate flex-1">{chat.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
