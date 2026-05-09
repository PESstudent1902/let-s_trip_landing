"use client";

import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STARTER_MESSAGE: ChatMessage = {
  id: "starter",
  role: "assistant",
  content: "Hi! I’m your LetsTrip travel assistant. Tell me your destination, budget, and duration, and I’ll suggest the best package.",
};

export default function TravelChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER_MESSAGE]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || loading) return;

    const nextMessages = [...messages, { id: crypto.randomUUID(), role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = (await res.json()) as { reply?: string };
      const reply = data.reply || "I can help with travel packages, destinations, and itinerary planning.";
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "I’m having trouble right now. Please try again for travel package suggestions." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80]">
      {open ? (
        <div className="w-[92vw] max-w-sm h-[70vh] max-h-[560px] rounded-2xl border border-white/10 bg-[#0B1428]/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div>
              <p className="text-cyan text-sm font-semibold">LetsTrip Concierge</p>
              <p className="text-[11px] text-gray-400">Travel only • Packages + itinerary guidance</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`max-w-[90%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${message.role === "user" ? "ml-auto bg-cyan/20 text-white" : "bg-white/8 text-gray-100 border border-white/10"}`}>
                {message.content}
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400">Thinking about your best travel package...</div>}
          </div>

          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="e.g. 5N Thailand under 60000"
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-cyan/40"
              />
              <button onClick={sendMessage} disabled={!input.trim() || loading} className="p-2.5 rounded-xl bg-cyan text-[#041528] disabled:opacity-50 disabled:cursor-not-allowed">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="h-14 px-4 rounded-full bg-cyan text-[#041528] font-semibold flex items-center gap-2 shadow-lg shadow-cyan/30 hover:scale-105">
          <MessageCircle size={18} /> Travel Chat
        </button>
      )}
    </div>
  );
}
