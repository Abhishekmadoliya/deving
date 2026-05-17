"use client";

import { useState, useRef, useEffect } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import {
  Zap,
  Download,
  Share2,
  User,
  Menu,
  ChevronDown,
  Check,
  Copy,
  Code2,
  Eye,
} from "lucide-react";

export function StudioToolbar() {
  const { currentPrompt, canvasTab, setCanvasTab } = useDesignStore();
  const [exportOpen, setExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const selectedVariant = useDesignStore((s) => {
    return s.variants.find((v) => v.id === s.selectedVariantId) ?? null;
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCopyCode = () => {
    if (selectedVariant) {
      navigator.clipboard.writeText(selectedVariant.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setExportOpen(false);
  };

  const handleExportHTML = () => {
    if (selectedVariant) {
      const blob = new Blob([selectedVariant.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "design.html";
      a.click();
      URL.revokeObjectURL(url);
    }
    setExportOpen(false);
  };

  return (
    <div
      style={{
        height: 56,
        backgroundColor: "#0f0f0f",
        borderBottom: "1px solid #1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        flexShrink: 0,
      }}
    >
      {/* Left: Menu + Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 200 }}>
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: "none",
            backgroundColor: "transparent",
            color: "#888",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Menu style={{ width: 18, height: 18 }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Zap style={{ width: 18, height: 18, color: "#6366f1" }} />
          <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
            {currentPrompt
              ? currentPrompt.length > 40
                ? currentPrompt.substring(0, 40) + "..."
                : currentPrompt
              : "Sketchloop"}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* View toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#1a1a1a",
            borderRadius: 10,
            padding: 3,
          }}
        >
          <button
            onClick={() => setCanvasTab("preview")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 8,
              border: "none",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              backgroundColor: canvasTab === "preview" ? "#252525" : "transparent",
              color: canvasTab === "preview" ? "#fff" : "#666",
            }}
          >
            <Eye style={{ width: 13, height: 13 }} />
            Preview
          </button>
          <button
            onClick={() => setCanvasTab("code")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 8,
              border: "none",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              backgroundColor: canvasTab === "code" ? "#252525" : "transparent",
              color: canvasTab === "code" ? "#fff" : "#666",
            }}
          >
            <Code2 style={{ width: 13, height: 13 }} />
            Code
          </button>
        </div>

        {/* Export */}
        <div style={{ position: "relative" }} ref={exportRef}>
          <button
            onClick={() => setExportOpen(!exportOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 10,
              border: "1px solid #2a2a2a",
              backgroundColor: "#1a1a1a",
              color: "#ccc",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <Download style={{ width: 14, height: 14 }} />
            Export
          </button>
          {exportOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                marginTop: 6,
                width: 200,
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                zIndex: 50,
              }}
            >
              <button
                onClick={handleExportHTML}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#ccc",
                  fontSize: 13,
                  textAlign: "left",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#222")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Download HTML/CSS
              </button>
              <button
                onClick={handleCopyCode}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#ccc",
                  fontSize: 13,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#222")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Copy Code
                {copied ? (
                  <Check style={{ width: 14, height: 14, color: "#22c55e" }} />
                ) : (
                  <Copy style={{ width: 14, height: 14, color: "#555" }} />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Share */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 10,
            border: "1px solid #2a2a2a",
            backgroundColor: "#1a1a1a",
            color: "#ccc",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <Share2 style={{ width: 14, height: 14 }} />
          Share
        </button>

        {/* Avatar */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            marginLeft: 4,
          }}
        >
          <User style={{ width: 16, height: 16, color: "#fff" }} />
        </div>
      </div>
    </div>
  );
}
