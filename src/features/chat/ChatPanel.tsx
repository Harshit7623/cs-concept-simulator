import { Bot, Send, X } from "lucide-react";
import { useState } from "react";
import type { Meta } from "../../lib/types";
export function ChatPanel({
  concept,
  open,
  onClose,
}: {
  concept?: Meta;
  open: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [
      ...m,
      { role: "user", content: q },
      {
        role: "assistant",
        content: `I’m grounded in ${concept?.title ?? "this workspace"}. Try stepping through the simulation, then ask me about the invariant or complexity.`,
      },
    ]);
    setInput("");
  };
  if (!open) return null;

  return (
    <aside className="fixed bottom-4 right-4 z-40 flex h-[min(50vh,26rem)] w-[min(20rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-panel">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent-algorithms/15 text-accent-algorithms">
          <Bot size={15} />
        </span>
        <div>
          <p className="text-sm font-medium">Concept copilot</p>
          <p className="text-[11px] text-muted">Context-aware learning help</p>
        </div>
        <button
          type="button"
          aria-label="Close concept copilot"
          onClick={onClose}
          className="ml-auto rounded-md p-1 text-muted transition hover:bg-surface-hover hover:text-foreground"
        >
          <X size={15} />
        </button>
      </div>
      <div className="scrollbar flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-4 text-sm leading-relaxed text-muted">
            Ask about{" "}
            <span className="text-foreground">
              {concept?.title ?? "any concept"}
            </span>
            , the current step, or a trade-off you want to understand.
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-xl p-3 text-sm leading-relaxed ${m.role === "user" ? "ml-6 bg-foreground text-background" : "mr-3 bg-background text-muted"}`}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask a question…"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted"
          />
          <button
            aria-label="Send"
            onClick={send}
            className="text-muted hover:text-foreground"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
