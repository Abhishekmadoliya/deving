"use client";

import { useState, useRef, useEffect } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import {
  Sparkles,
  Send,
  Plus,
  Copy,
  MessageCircle,
  ChevronDown,
  ArrowUp,
  ImagePlus,
} from "lucide-react";

const EDIT_SUGGESTIONS = [
  "Make it dark mode",
  "Add a modal dialog",
  "Change to blue theme",
  "Make it mobile responsive",
];

export function ChatPanel() {
  const {
    chatMessages,
    addChatMessage,
    isIterating,
    isGenerating,
    setIsIterating,
    updateSelectedVariant,
  } = useDesignStore();

  const selectedVariant = useDesignStore((s) => {
    return s.variants.find((v) => v.id === s.selectedVariantId) ?? null;
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isIterating]);

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
    <div
      style={{
        width: 340,
        minWidth: 340,
        borderRight: "1px solid #1a1a1a",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0a0a0a",
        height: "100%",
      }}
    >
      {/* Chat Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 16px",
        }}
      >
        {chatMessages.length === 0 && !isGenerating && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <MessageCircle
              style={{ width: 32, height: 32, color: "#333", marginBottom: 12 }}
            />
            <p style={{ fontSize: 14, color: "#555" }}>
              Describe what you want to design
            </p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 16,
            }}
          >
            {msg.role === "assistant" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles style={{ width: 10, height: 10, color: "#fff" }} />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#888",
                    letterSpacing: "0.02em",
                  }}
                >
                  Claude
                </span>
              </div>
            )}

            {msg.role === "user" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "#aaa",
                    fontWeight: 600,
                  }}
                >
                  Y
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#888",
                  }}
                >
                  You
                </span>
              </div>
            )}

            <div
              style={{
                padding: "0 0 0 26px",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: msg.role === "assistant" ? "#ccc" : "#aaa",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {msg.content}
              </p>
              <span
                style={{
                  fontSize: 10,
                  color: "#444",
                  marginTop: 4,
                  display: "block",
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {(isGenerating || isIterating) && (
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles style={{ width: 10, height: 10, color: "#fff" }} />
              </div>
              <span
                style={{ fontSize: 11, fontWeight: 600, color: "#888" }}
              >
                Claude
              </span>
            </div>
            <div style={{ padding: "0 0 0 26px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#6366f1",
                        animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: "#666" }}>
                  {isGenerating
                    ? "Generating designs..."
                    : "Updating design..."}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {selectedVariant && !isIterating && !isGenerating && (
        <div
          style={{
            padding: "8px 12px",
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            borderTop: "1px solid #1a1a1a",
          }}
        >
          {EDIT_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              style={{
                padding: "6px 14px",
                borderRadius: 100,
                border: "1px solid #2a2a2a",
                backgroundColor: "transparent",
                fontSize: 11,
                color: "#888",
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#444";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a2a2a";
                e.currentTarget.style.color = "#888";
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div
        style={{
          padding: 12,
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <div
          style={{
            borderRadius: 14,
            border: "1px solid #1e1e1e",
            backgroundColor: "#111",
            overflow: "hidden",
          }}
        >
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
            placeholder="What would you like to change or create?"
            rows={2}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "14px 16px 6px",
              fontSize: 13,
              color: "#fff",
              border: "none",
              resize: "none",
              outline: "none",
              lineHeight: 1.5,
              fontFamily: "inherit",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 10px 8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Plus style={{ width: 16, height: 16 }} />
              </button>
              <button
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Copy style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <MessageCircle style={{ width: 16, height: 16 }} />
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: "#1a1a1a",
                  color: "#ccc",
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <Sparkles style={{ width: 12, height: 12, color: "#6366f1" }} />
                3 Flash
                <ChevronDown style={{ width: 10, height: 10, color: "#555" }} />
              </button>
              <div
                style={{ width: 1, height: 20, backgroundColor: "#222" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isIterating}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "none",
                  backgroundColor:
                    input.trim() && !isIterating ? "#6366f1" : "#1a1a1a",
                  color:
                    input.trim() && !isIterating ? "#fff" : "#444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor:
                    input.trim() && !isIterating
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                <ArrowUp style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
