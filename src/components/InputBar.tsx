import { useState, useRef } from "react";
import { Send, Mic, Paperclip, Loader2 } from "lucide-react";

interface InputBarProps {
  onSendText: (text: string) => void;
  onMicClick: () => void;
  onFileUpload: (file: File) => void;
  disabled: boolean;
  micLoading: boolean;
}

const InputBar = ({ onSendText, onMicClick, onFileUpload, disabled, micLoading }: InputBarProps) => {
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSendText(trimmed);
    setText("");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = "";
    }
  };

  return (
    <div className="p-3 border-t bg-card shrink-0">
      <div className="flex items-center gap-2 max-w-3xl mx-auto bg-secondary rounded-2xl px-3 py-2">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
          title="Upload file"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={handleFile} accept=".pdf,.txt,.doc,.docx" />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-40"
        />

        <button
          onClick={onMicClick}
          disabled={disabled || micLoading}
          className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
          title="Voice input"
        >
          {micLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
          title="Send"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InputBar;
