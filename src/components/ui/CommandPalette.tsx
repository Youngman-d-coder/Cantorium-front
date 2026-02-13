import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "./Components";

interface ShortcutItem {
  keys: string[];
  description: string;
  action?: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon?: string;
  shortcut?: string[];
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    { id: "dashboard", label: "Go to Dashboard", category: "Navigation", icon: "📊", action: () => navigate("/dashboard") },
    { id: "create", label: "Create New Composition", category: "Navigation", icon: "🎼", shortcut: ["Ctrl", "N"], action: () => navigate("/create") },
    { id: "library", label: "Browse Library", category: "Navigation", icon: "📚", action: () => navigate("/library") },
    { id: "practice", label: "Open Practice Studio", category: "Navigation", icon: "🎧", action: () => navigate("/practice") },
    { id: "profile", label: "View Profile", category: "Navigation", icon: "👤", action: () => navigate("/profile") },
    { id: "signin", label: "Sign In", category: "Account", icon: "🔑", action: () => navigate("/signin") },
    { id: "signup", label: "Sign Up", category: "Account", icon: "✨", action: () => navigate("/signup") },
    { id: "shortcuts", label: "View Keyboard Shortcuts", category: "Help", icon: "⌨️", action: () => {} },
  ];

  const filteredCommands = query
    ? commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const handleSelect = useCallback(
    (command: CommandItem) => {
      command.action();
      onClose();
      setQuery("");
      setSelectedIndex(0);
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            handleSelect(filteredCommands[selectedIndex]);
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, handleSelect, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-xl animate-scale-in rounded-2xl border border-cyan-400/30 bg-slate-900/95 shadow-2xl shadow-cyan-900/40">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
          <span className="text-slate-400">🔍</span>
          <input
            autoFocus
            type="text"
            placeholder="Search commands, pages, actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <kbd className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-400">Esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">No results found for "{query}"</p>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd, index) => (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    index === selectedIndex ? "bg-cyan-500/10 text-cyan-100" : "text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="text-lg">{cmd.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{cmd.label}</p>
                    <p className="text-xs text-slate-500">{cmd.category}</p>
                  </div>
                  {cmd.shortcut && (
                    <div className="flex gap-1">
                      {cmd.shortcut.map((key) => (
                        <kbd key={key} className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400">
                          {key}
                        </kbd>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-2 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-[10px]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-[10px]">↵</kbd> Select
            </span>
          </div>
          <span>Cantorium Command Palette</span>
        </div>
      </div>
    </div>
  );
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const shortcuts: { category: string; items: ShortcutItem[] }[] = [
    {
      category: "General",
      items: [
        { keys: ["Ctrl", "K"], description: "Open command palette" },
        { keys: ["Ctrl", "N"], description: "Create new composition" },
        { keys: ["Ctrl", "/"], description: "Show keyboard shortcuts" },
        { keys: ["Esc"], description: "Close modal / Cancel" },
      ],
    },
    {
      category: "Navigation",
      items: [
        { keys: ["G", "D"], description: "Go to Dashboard" },
        { keys: ["G", "C"], description: "Go to Compose" },
        { keys: ["G", "L"], description: "Go to Library" },
        { keys: ["G", "P"], description: "Go to Practice" },
      ],
    },
    {
      category: "Playback",
      items: [
        { keys: ["Space"], description: "Play / Pause" },
        { keys: ["←"], description: "Seek backward" },
        { keys: ["→"], description: "Seek forward" },
        { keys: ["M"], description: "Mute / Unmute" },
        { keys: ["-"], description: "Decrease tempo" },
        { keys: ["+"], description: "Increase tempo" },
      ],
    },
    {
      category: "Editor",
      items: [
        { keys: ["Ctrl", "S"], description: "Save draft" },
        { keys: ["Ctrl", "Enter"], description: "Generate AI rendition" },
        { keys: ["Ctrl", "Z"], description: "Undo" },
        { keys: ["Ctrl", "Shift", "Z"], description: "Redo" },
      ],
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" size="lg">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {shortcuts.map((group) => (
          <div key={group.category}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cyan-300/80">{group.category}</h3>
            <div className="space-y-2">
              {group.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-slate-800/40 px-3 py-2">
                  <span className="text-sm text-slate-300">{item.description}</span>
                  <div className="flex gap-1">
                    {item.keys.map((key, j) => (
                      <kbd key={j} className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-medium text-slate-400">
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useKeyboardShortcuts() {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let gPressed = false;
    let gTimeout: ReturnType<typeof setTimeout>;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      // Command palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // Shortcuts modal: Ctrl+/ or Cmd+/
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setShortcutsModalOpen(true);
        return;
      }

      // New composition: Ctrl+N or Cmd+N
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        navigate("/create");
        return;
      }

      // G-key navigation
      if (e.key.toLowerCase() === "g" && !gPressed) {
        gPressed = true;
        gTimeout = setTimeout(() => {
          gPressed = false;
        }, 500);
        return;
      }

      if (gPressed) {
        clearTimeout(gTimeout);
        gPressed = false;
        switch (e.key.toLowerCase()) {
          case "d":
            navigate("/dashboard");
            break;
          case "c":
            navigate("/create");
            break;
          case "l":
            navigate("/library");
            break;
          case "p":
            navigate("/practice");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    isShortcutsModalOpen,
    setShortcutsModalOpen,
  };
}
