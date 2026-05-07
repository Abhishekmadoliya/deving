"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowUp,
  Plus,
  Monitor,
  Smartphone,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  mode: "standard" | "experimental";
  onModeToggle: () => void;
  designType: "web" | "app";
  onDesignTypeChange: (type: "web" | "app") => void;
  onSubmit: () => void;
}

export default function PromptInput({
  prompt,
  onPromptChange,
  mode,
  onModeToggle,
  designType,
  onDesignTypeChange,
  onSubmit,
}: PromptInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{
        borderRadius: 16,
        border: "1px solid #1e1e1e",
        backgroundColor: "#111",
        overflow: "hidden",
      }}
    >
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            onSubmit();
          }
        }}
        placeholder="What would you like to design?"
        rows={4}
        style={{
          width: "100%",
          backgroundColor: "transparent",
          padding: "20px 22px 8px",
          fontSize: 15,
          color: "#fff",
          border: "none",
          resize: "none",
          outline: "none",
          lineHeight: 1.6,
          fontFamily: "inherit",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            style={{
              width: 34,
              height: 34,
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
            <Plus style={{ width: 18, height: 18 }} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              borderRadius: 10,
              padding: 3,
              marginLeft: 4,
            }}
          >
            <button
              onClick={() => onDesignTypeChange("app")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                backgroundColor:
                  designType === "app" ? "#252525" : "transparent",
                color: designType === "app" ? "#fff" : "#666",
              }}
            >
              <Smartphone style={{ width: 13, height: 13 }} />
              App
            </button>
            <button
              onClick={() => onDesignTypeChange("web")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                backgroundColor:
                  designType === "web" ? "#252525" : "transparent",
                color: designType === "web" ? "#fff" : "#666",
              }}
            >
              <Monitor style={{ width: 13, height: 13 }} />
              Web
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            style={{
              width: 34,
              height: 34,
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
            <MessageCircle style={{ width: 18, height: 18 }} />
          </button>

          <button
            onClick={onModeToggle}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              borderRadius: 10,
              border: "none",
              backgroundColor: "#1a1a1a",
              color: "#ccc",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <Sparkles
              style={{ width: 14, height: 14, color: "#6366f1" }}
            />
            {mode === "standard" ? "Standard" : "Experimental"}
            <ChevronDown
              style={{ width: 12, height: 12, color: "#555" }}
            />
          </button>

          <div
            style={{
              width: 1,
              height: 22,
              backgroundColor: "#222",
            }}
          />

          <button
            onClick={onSubmit}
            disabled={!prompt.trim()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "none",
              backgroundColor: prompt.trim() ? "#6366f1" : "#1a1a1a",
              color: prompt.trim() ? "#fff" : "#333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: prompt.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            <ArrowUp style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
