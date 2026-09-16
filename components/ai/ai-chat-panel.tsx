"use client";

import { useState } from "react";
import { Sparkles, Send, X, BookOpen, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; id: string }[];
}

export function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      role: "assistant",
      content: "Hello Alex! I am your AI Study Assistant. Ask me anything about DBMS, OS, or Computer Networks notes!",
    },
  ]);

  const promptPills = [
    "Explain BCNF vs 3NF",
    "What is a Semaphore Lock?",
    "Summarize TCP 3-way handshake",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.content,
          sources: data.sources,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-[#1C1917] text-[#FACC15] rounded-full shadow-2xl hover:scale-105 transition-all z-40 flex items-center gap-2 border border-[#332F2C]"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-semibold text-white pr-1">Ask AI Assistant</span>
        </button>
      )}

      {/* Floating Glassmorphic Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-md bg-[#F9F8F4]/95 backdrop-blur-md border border-[#E7E5E4] rounded-[2.5rem] shadow-2xl z-50 flex flex-col h-[520px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Panel Header */}
          <div className="p-4 bg-[#1C1917] text-white flex items-center justify-between border-b border-[#332F2C]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FACC15]" />
              <h3 className="text-xs font-semibold">StudentOS AI Study Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 text-stone-400 hover:text-white rounded-full">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "p-3 rounded-2xl text-xs max-w-[85%] flex flex-col gap-1.5",
                  m.role === "user"
                    ? "bg-[#1C1917] text-white self-end rounded-br-xs"
                    : "bg-white border border-[#E7E5E4] text-[#1C1917] self-start rounded-bl-xs shadow-xs"
                )}
              >
                <div className="flex items-center gap-1 text-[10px] opacity-70">
                  {m.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-amber-600" />}
                  <span>{m.role === "user" ? "You" : "AI Assistant"}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

                {m.sources && m.sources.length > 0 && (
                  <div className="pt-2 border-t border-[#E7E5E4] flex flex-wrap gap-1 mt-1">
                    {m.sources.map((s) => (
                      <span key={s.id} className="text-[9px] bg-[#F2EFE9] text-[#78716C] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <BookOpen className="w-2.5 h-2.5 text-blue-600" />
                        {s.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto border-t border-[#E7E5E4] bg-[#F2EFE9]/50">
            {promptPills.map((pill) => (
              <button
                key={pill}
                onClick={() => handleSend(pill)}
                className="px-2.5 py-1 bg-white hover:bg-[#1C1917] hover:text-white border border-[#E7E5E4] rounded-full text-[10px] text-[#78716C] transition-all shrink-0"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#E7E5E4] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question about course materials..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-[#F9F8F4] border border-[#E7E5E4] rounded-full text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-[#1C1917] text-white rounded-full hover:bg-[#332F2C] disabled:opacity-50 transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
