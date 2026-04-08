import { useRef, useEffect } from "react";
import { Message } from "@/lib/api";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { Languages, Bot } from "lucide-react";
import { AppMode } from "@/lib/api";

interface ChatWindowProps {
  messages: Message[];
  typing: boolean;
  mode: AppMode;
}

const ChatWindow = ({ messages, typing, mode }: ChatWindowProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  if (messages.length === 0 && !typing) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-3">

        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto ">
        {mode === 'translator' ? (
          <Languages className="w-8 h-8 text-white" />
        ) : (
          <Bot className="w-8 h-8 text-white" />
        )}
      </div>

          {/* <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            {mode === "translator" ? (
              <Languages className="w-8 h-8 text-primary" />
            ) : (
              <Bot className="w-8 h-8 text-primary" />
            )}
          </div> */}

          <h2 className="text-lg font-semibold text-foreground">
            {mode === "translator" ? "Translate anything" : "Ask me anything"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            {mode === "translator"
              ? "Type or paste any text to get instant translations to Assamese."
              : "Chat with AI in Assamese or English. All responses will be in Assamese."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
      <div className="max-w-3xl mx-auto">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
