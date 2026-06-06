import { useState, FormEvent } from "react";
import { ChatMessage } from "../types";
import { Send, Sparkles, Wrench, RefreshCw, User, HelpCircle } from "lucide-react";

interface Props {
  onUnlockBadge: (badgeId: string) => void;
}

const FAQS = [
  "How do I mix a 40:1 fuel ratio correctly? What tools do I need?",
  "My drive chain looks tight on top but loose on the bottom. Is that standard?",
  "What is the difference between a 2-stroke and a 4-stroke motor kit?",
  "My kit didn't come with lock-washers. Should I buy some at the hardware shelf?"
];

export function SolderChat({ onUnlockBadge }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey there, young mechanic! 🛠️ Sparky here. I heard you're dropping a small gas engine onto your mountain bike frame for your big school project. That is super awesome!\n\nI can help you count ratios, align those rear drive chain tensioners, or explain thermodynamics laws simply. Remember, **SAFETY GLOGS ON** at all times! Ask me anything about your motorized bike setup, and let's build it safe together!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Map to match endpoint structure: messages containing role and content
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Garage signal is weak! Check your connection.");
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: data.text || "I had a tiny wrench jam! Could you say that again?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      
      // Unlock badge for talking to sparky
      onUnlockBadge("badge_chat");

    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: "❌ **Garage static line:** " + (error?.message || "I lost socket contact! Try again in a second, builder!"),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-2xl p-6 shadow-xl flex flex-col h-[550px] overflow-hidden">
      
      {/* Header of Workbench Chat */}
      <div className="border-b border-gray-800 pb-4 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-sans font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            Co-Pilot Garage QA Terminal
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Discuss specs, troubleshoot clattering cylinders or clarify mounting bolts with Sparky.
          </p>
        </div>

        {/* Status */}
        <span className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 font-mono text-[10px] px-2.5 py-1 rounded-full text-cyan-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          SPARKY ONLINE
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 antialiased">
        {messages.map((msg) => {
          const isSparky = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 max-w-[85%] ${isSparky ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-white ${
                  isSparky
                    ? "bg-amber-400/10 border-amber-500/30 text-amber-400"
                    : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                }`}
              >
                {isSparky ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              
              <div
                className={`rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                  isSparky
                    ? "bg-gray-900 border border-gray-850 text-gray-250 rounded-tl-none"
                    : "bg-cyan-950/40 border border-cyan-800/30 text-cyan-100 rounded-tr-none"
                }`}
              >
                <div className="whitespace-pre-line">
                  {msg.content}
                </div>
                <div className="text-[10px] text-gray-500 font-mono mt-2 text-right">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-3.5 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-400/10 border border-amber-500/30 text-amber-500 animate-spin">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="bg-gray-900 border border-gray-850 rounded-2xl p-4 text-xs text-gray-500 font-mono flex items-center gap-2">
              <span className="animate-pulse">Sparky is hunting the wrench shelf...</span>
            </div>
          </div>
        )}
      </div>

      {/* Prompt Suggestions Chips */}
      {messages.length === 1 && (
        <div className="mb-4">
          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block mb-2">
            💡 Common Apprentice Questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {FAQS.map((faq, fIdx) => (
              <button
                key={fIdx}
                id={`faq-chip-${fIdx}`}
                onClick={() => sendMessage(faq)}
                className="text-[11px] bg-gray-900 border border-gray-800 hover:border-amber-500 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-all text-left font-mono active:scale-95 cursor-pointer"
              >
                {faq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form Input Submit */}
      <form onSubmit={handleSubmit} className="flex gap-2.5 bg-gray-900/60 p-2 border border-gray-800 rounded-xl mt-auto">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask Sparky about fuel ratios, exhaust pipes, lock-washers, kill switches..."
          className="flex-1 bg-transparent text-xs md:text-sm text-white px-3 focus:outline-none placeholder-gray-550 border-0 outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          id="chat-send-btn"
          disabled={!inputValue.trim() || isLoading}
          className={`p-3 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
            inputValue.trim() && !isLoading
              ? "bg-amber-400 text-[#0b0f19] hover:scale-105 active:scale-95"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
