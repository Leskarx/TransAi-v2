const TypingIndicator = () => (
  <div className="flex justify-start mb-3 animate-in fade-in duration-300">
    <div className="bg-chat-ai rounded-2xl px-4 py-3 flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

export default TypingIndicator;
