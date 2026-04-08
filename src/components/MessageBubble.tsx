import { FileText, Download, Loader2 } from "lucide-react";
import { Message, downloadFile } from "@/lib/api";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.sender === "user";

  if (message.type === "file") {
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
        <div
          className={`max-w-xs sm:max-w-sm rounded-2xl px-4 py-3 ${
            isUser ? "bg-chat-user text-chat-user-foreground" : "bg-chat-ai text-chat-ai-foreground"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium truncate">{message.fileName}</span>
          </div>
          {message.status === "uploading" && (
            <div className="flex items-center gap-2 text-xs opacity-80">
              <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
            </div>
          )}
          {message.status === "processing" && (
            <div className="flex items-center gap-2 text-xs opacity-80">
              <Loader2 className="w-3 h-3 animate-spin" /> Processing...
            </div>
          )}
          {message.status === "done" && message.fileUrl && (
            <button
              onClick={() => downloadFile(message.fileUrl!, message.fileName!)}
              className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isUser ? "bg-primary-foreground/20 hover:bg-primary-foreground/30" : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div
        className={`max-w-xs sm:max-w-md rounded-2xl px-4 py-2.5 ${
          isUser ? "bg-chat-user text-chat-user-foreground" : "bg-chat-ai text-chat-ai-foreground"
        }`}
      >
        {message.detected && (
          <span className="text-[10px] uppercase tracking-wider opacity-60 block mb-1">
            Detected: {message.detected}
          </span>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
