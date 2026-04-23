import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import InputBar from "@/components/InputBar";
import {
  AppMode, Chat, Message, genId,
  sendMessageAPI, speechToTextAPI, uploadFileAPI, processFileAPI,
  loadChats, saveChats,
} from "@/lib/api";

const Index = () => {
  const [dark, setDark] = useState(() => localStorage.getItem("transai_theme") === "dark");
  const [mode, setMode] = useState<AppMode>("translator");
  const [chats, setChats] = useState<Chat[]>(loadChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [micLoading, setMicLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [text, setText] = useState("");

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("transai_theme", dark ? "dark" : "light");
  }, [dark]);

  // Persist chats
  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  const updateChat = useCallback((chatId: string, updater: (chat: Chat) => Chat) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? updater(c) : c)));
  }, []);

  const ensureChat = useCallback((firstMsg: Message): string => {
    if (activeChatId) {
      updateChat(activeChatId, (c) => ({ ...c, messages: [...c.messages, firstMsg] }));
      return activeChatId;
    }
    const id = genId();
    const title = firstMsg.text?.slice(0, 30) || firstMsg.fileName || "New Chat";
    const chat: Chat = { id, title, mode, messages: [firstMsg], createdAt: Date.now() };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(id);
    return id;
  }, [activeChatId, mode, updateChat]);

  const handleSendText = async (text: string) => {
    const userMsg: Message = { id: genId(), type: "text", sender: "user", text };
    const chatId = ensureChat(userMsg);

    setTyping(true);
    const result = await sendMessageAPI(text, mode);
    const aiMsg: Message = {
      id: genId(), type: "text", sender: "ai", text: result.response,
      detected: result.detected,
    };
    updateChat(chatId, (c) => ({ ...c, messages: [...c.messages, aiMsg] }));
    setTyping(false);
  };

  const handleMic = async () => {
    if (micLoading) return; // ✅ prevent double start
  
    try {
      setMicLoading(true);
      const result = await speechToTextAPI();
      setMicLoading(false);
  
      if (result) {
        setText((prev) => prev ? prev + " " + result : result);
      }
    } catch (err) {
      console.error(err);
      setMicLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    const fileMsg: Message = {
      id: genId(),
      type: "file",
      sender: "user",
      fileName: file.name,
      status: "uploading",
    };
  
    const chatId = ensureChat(fileMsg);
  
    try {
      // 🔥 Call backend
      const result = await uploadFileAPI(file);
  
      // update status → done
      updateChat(chatId, (c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === fileMsg.id
            ? { ...m, status: "done" as const }
            : m
        ),
      }));
  
      // 🔥 Add AI response (translated PDF)
      const aiFile: Message = {
        id: genId(),
        type: "file",
        sender: "ai",
        fileName: result.fileName,
        fileUrl: result.fileUrl,
        status: "done",
      };
  
      updateChat(chatId, (c) => ({
        ...c,
        messages: [...c.messages, aiFile],
      }));
  
    } catch (err) {
      console.error(err);
  
      // optional: mark failed
      updateChat(chatId, (c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === fileMsg.id
            ? { ...m, status: "done" as const }
            : m
        ),
      }));
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
  };

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          mode={mode}
          onModeChange={setMode}
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />
        <ChatWindow messages={activeChat?.messages || []} typing={typing} mode={mode} />
        <InputBar
  text={text}
  setText={setText}
  onSendText={handleSendText}
  onMicClick={handleMic}
  onFileUpload={handleFileUpload}
  disabled={typing}
  micLoading={micLoading}
/>
      </div>
    </div>
  );
};

export default Index;
