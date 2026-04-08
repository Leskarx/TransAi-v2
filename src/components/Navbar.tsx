import { Languages, Bot, Sun, Moon, Menu } from "lucide-react";
import { AppMode } from "@/lib/api";

interface NavbarProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  dark: boolean;
  onToggleDark: () => void;
  onToggleSidebar: () => void;
}

const Navbar = ({ mode, onModeChange, dark, onToggleDark, onToggleSidebar }: NavbarProps) => {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b bg-card shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors">
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">TransAI</h1>
        {/* <span className="text-lg font-bold text-primary tracking-tight">TransAI</span> */}
      </div>

      <div className="flex bg-secondary rounded-xl p-1 gap-1">
        <button
          onClick={() => onModeChange("translator")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            mode === "translator" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Languages className="w-4 h-4" />
          <span className="hidden sm:inline">Translator</span>
        </button>
        <button
          onClick={() => onModeChange("assistant")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            mode === "assistant" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">Assistant</span>
        </button>
      </div>

      <button onClick={onToggleDark} className="p-2 rounded-lg hover:bg-secondary transition-colors">
        {dark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
      </button>
    </header>
  );
};

export default Navbar;
