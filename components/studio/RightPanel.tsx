"use client";

import { useState, useRef, useEffect } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import {
  Palette,
  Type,
  Box,
  MessageSquare,
  Send,
  Paperclip,
  Sparkles,
  Copy,
  Check,
  Settings2,
  ImagePlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EDIT_SUGGESTIONS = [
  "Make it dark mode",
  "Add a modal",
  "Change to blue theme",
  "Make it mobile",
];

function PropertiesPanel() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const selectedVariant = useDesignStore((s) => {
    const v = s.variants.find((v) => v.id === s.selectedVariantId);
    return v ?? null;
  });

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  if (!selectedVariant) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Settings2 className="w-8 h-8 text-[#333] mb-3" />
        <p className="text-sm text-[#555]">No design selected</p>
        <p className="text-xs text-[#444] mt-1">
          Select a variant to view its properties
        </p>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-6">
      {/* Color Palette */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-3.5 h-3.5 text-[#6366f1]" />
          <span className="text-xs font-medium text-[#888] uppercase tracking-wider">
            Colors
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(selectedVariant.colors || []).map((color, i) => (
            <button
              key={`${color}-${i}`}
              onClick={() => copyColor(color)}
              className="group relative w-10 h-10 rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all cursor-pointer hover:scale-110"
              style={{ backgroundColor: color }}
              title={color}
            >
              <AnimatePresence>
                {copiedColor === color && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl"
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
          {(selectedVariant.colors || []).length === 0 && (
            <p className="text-xs text-[#555]">No colors extracted</p>
          )}
        </div>
      </div>

      {/* Typography */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-3.5 h-3.5 text-[#6366f1]" />
          <span className="text-xs font-medium text-[#888] uppercase tracking-wider">
            Typography
          </span>
        </div>
        <div className="space-y-2">
          {(selectedVariant.fonts || []).map((font, i) => (
            <div
              key={`${font}-${i}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]"
            >
              <span
                className="text-sm text-white"
                style={{ fontFamily: font }}
              >
                {font}
              </span>
            </div>
          ))}
          {(selectedVariant.fonts || []).length === 0 && (
            <p className="text-xs text-[#555]">No fonts detected</p>
          )}
        </div>
      </div>

      {/* Components */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <Box className="w-3.5 h-3.5 text-[#6366f1]" />
          <span className="text-xs font-medium text-[#888] uppercase tracking-wider">
            Components
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(selectedVariant.components || []).map((comp, i) => (
            <span
              key={`${comp}-${i}`}
              className="px-2.5 py-1 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 text-xs text-[#a78bfa]"
            >
              {comp}
            </span>
          ))}
          {(selectedVariant.components || []).length === 0 && (
            <p className="text-xs text-[#555]">No components detected</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PromptPanel() {
  const {
    chatMessages,
    addChatMessage,
    isIterating,
    setIsIterating,
    updateSelectedVariant,
    selectedVariantId,
  } = useDesignStore();

  const selectedVariant = useDesignStore((s) => {
    const v = s.variants.find((v) => v.id === s.selectedVariantId);
    return v ?? null;
  });

  const [input, setInput] = useState("");
  const [attachTooltip, setAttachTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || !selectedVariant || isIterating) return;

    const editPrompt = input.trim();
    setInput("");
    setIsIterating(true);

    addChatMessage({ role: "user", content: editPrompt });

    try {
      const res = await fetch("/api/iterate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentHtml: selectedVariant.html,
          currentCss: selectedVariant.css,
          conversationHistory: [],
          editPrompt,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Iteration failed");
      }

      const data = await res.json();

      updateSelectedVariant({
        html: data.html,
        css: data.css,
        components: data.components || selectedVariant.components,
        colors: data.colors || selectedVariant.colors,
        fonts: data.fonts || selectedVariant.fonts,
      });

      addChatMessage({
        role: "assistant",
        content: data.description || "Design updated successfully.",
      });
    } catch (error) {
      addChatMessage({
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "Failed to update design."}`,
      });
    } finally {
      setIsIterating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="w-8 h-8 text-[#333] mb-3" />
            <p className="text-sm text-[#555]">Start a conversation</p>
            <p className="text-xs text-[#444] mt-1">
              Describe changes to iterate on your design
            </p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                msg.role === "user"
                  ? "bg-[#1a1a1a] border border-[#2a2a2a] text-white"
                  : "bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 border border-[#6366f1]/20 text-[#ccc]"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3 text-[#6366f1]" />
                  <span className="text-[10px] font-medium text-[#6366f1]">
                    Claude
                  </span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <span className="text-[10px] text-[#555] mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </motion.div>
        ))}

        {isIterating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 border border-[#6366f1]/20 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs text-[#888]">Updating design...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Edit Suggestions */}
      {selectedVariant && !isIterating && (
        <div className="px-3 py-2 flex flex-wrap gap-1.5">
          {EDIT_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="px-2.5 py-1 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[10px] text-[#888] hover:text-white hover:border-[#3a3a3a] transition-all cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-[#1e1e1e]">
        <div className="flex items-end gap-2 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] px-3 py-2 focus-within:border-[#6366f1]/30 transition-colors">
          {/* Attach button */}
          <div className="relative">
            <button
              onMouseEnter={() => setAttachTooltip(true)}
              onMouseLeave={() => setAttachTooltip(false)}
              className="p-1.5 rounded-lg text-[#555] hover:text-[#888] transition-colors cursor-pointer"
            >
              <ImagePlus className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {attachTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-[#333] text-[10px] text-white rounded-lg whitespace-nowrap z-50"
                >
                  Coming soon
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe a change..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#555] resize-none focus:outline-none py-1 max-h-[120px]"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || !selectedVariant || isIterating}
            className="p-1.5 rounded-lg bg-[#6366f1] text-white hover:bg-[#818cf8] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function RightPanel() {
  const { rightPanelTab, setRightPanelTab } = useDesignStore();

  return (
    <div className="w-[320px] bg-[#0f0f0f] border-l border-[#1e1e1e] flex flex-col shrink-0 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#1e1e1e]">
        <button
          onClick={() => setRightPanelTab("properties")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
            rightPanelTab === "properties"
              ? "text-white border-b-2 border-[#6366f1] bg-[#6366f1]/5"
              : "text-[#666] hover:text-[#aaa]"
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          Properties
        </button>
        <button
          onClick={() => setRightPanelTab("prompt")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
            rightPanelTab === "prompt"
              ? "text-white border-b-2 border-[#6366f1] bg-[#6366f1]/5"
              : "text-[#666] hover:text-[#aaa]"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Prompt
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {rightPanelTab === "properties" ? (
            <motion.div
              key="properties"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 overflow-y-auto"
            >
              <PropertiesPanel />
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 overflow-hidden flex flex-col"
            >
              <PromptPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
