"use client";

import { useState } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import {
  Sparkles,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  RotateCcw,
  Copy,
  Eye,
} from "lucide-react";

function VariantThumbnail({
  variant,
  isSelected,
  onSelect,
  label,
}: {
  variant: { id: string; label: string; html: string };
  isSelected: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: 180,
        minWidth: 180,
        height: 130,
        borderRadius: 12,
        border: isSelected
          ? "2px solid #6366f1"
          : "2px solid #1e1e1e",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        backgroundColor: "#fff",
        transition: "all 0.2s",
        boxShadow: isSelected
          ? "0 0 20px rgba(99,102,241,0.2)"
          : "none",
        flexShrink: 0,
      }}
    >
      <iframe
        srcDoc={variant.html}
        title={variant.label}
        style={{
          width: "360%",
          height: "360%",
          border: "none",
          pointerEvents: "none",
          transform: "scale(0.278)",
          transformOrigin: "top left",
        }}
        sandbox="allow-scripts"
      />
      {/* Label overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 8px 6px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "#fff",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        {isSelected && (
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check style={{ width: 10, height: 10, color: "#fff" }} />
          </div>
        )}
      </div>
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Sparkles
          style={{
            width: 20,
            height: 20,
            color: "#6366f1",
          }}
        />
        <span style={{ fontSize: 14, color: "#888" }}>
          Generating 3 design variants...
        </span>
      </div>
      {/* Skeleton grid */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "0 20px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="animate-shimmer"
            style={{
              width: 200,
              height: 150,
              borderRadius: 12,
              border: "1px solid #1e1e1e",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CodePanel({ html, css }: { html: string; css: string }) {
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);

  const copyText = (text: string, type: "html" | "css") => {
    navigator.clipboard.writeText(text);
    if (type === "html") {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } else {
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    }
  };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* HTML */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #1a1a1a",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 14px",
            borderBottom: "1px solid #1a1a1a",
            backgroundColor: "#0d0d0d",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: "#666" }}>
            HTML
          </span>
          <button
            onClick={() => copyText(html, "html")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 8px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "transparent",
              color: copiedHtml ? "#22c55e" : "#666",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            {copiedHtml ? (
              <Check style={{ width: 12, height: 12 }} />
            ) : (
              <Copy style={{ width: 12, height: 12 }} />
            )}
            {copiedHtml ? "Copied" : "Copy"}
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: 14,
            backgroundColor: "#0a0a0a",
          }}
        >
          <pre
            style={{
              fontSize: 12,
              color: "#aaa",
              fontFamily: "var(--font-geist-mono), monospace",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
            }}
          >
            {html}
          </pre>
        </div>
      </div>
      {/* CSS */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 14px",
            borderBottom: "1px solid #1a1a1a",
            backgroundColor: "#0d0d0d",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: "#666" }}>
            CSS
          </span>
          <button
            onClick={() => copyText(css || "", "css")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 8px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "transparent",
              color: copiedCss ? "#22c55e" : "#666",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            {copiedCss ? (
              <Check style={{ width: 12, height: 12 }} />
            ) : (
              <Copy style={{ width: 12, height: 12 }} />
            )}
            {copiedCss ? "Copied" : "Copy"}
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: 14,
            backgroundColor: "#0a0a0a",
          }}
        >
          <pre
            style={{
              fontSize: 12,
              color: "#aaa",
              fontFamily: "var(--font-geist-mono), monospace",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
            }}
          >
            {css || "/* Styles are embedded in the HTML */"}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function DesignCanvas() {
  const {
    variants,
    selectedVariantId,
    selectVariant,
    isGenerating,
    canvasTab,
  } = useDesignStore();

  const activeVariant =
    variants.find((v) => v.id === selectedVariantId) ?? null;

  const [viewport, setViewport] = useState("desktop");
  const [previewKey, setPreviewKey] = useState(0);

  const viewportWidth =
    viewport === "mobile"
      ? "375px"
      : viewport === "tablet"
        ? "768px"
        : "100%";

  // Loading state
  if (isGenerating) {
    return (
      <div
        style={{
          flex: 1,
          backgroundColor: "#111",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <LoadingSkeleton />
      </div>
    );
  }

  // Code view
  if (canvasTab === "code" && activeVariant) {
    return (
      <div
        style={{
          flex: 1,
          backgroundColor: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <CodePanel html={activeVariant.html} css={activeVariant.css} />
      </div>
    );
  }

  // No variants
  if (variants.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          backgroundColor: "#111",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: "#1a1a1a",
            border: "1px solid #222",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Sparkles style={{ width: 28, height: 28, color: "#333" }} />
        </div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#666",
            marginBottom: 8,
          }}
        >
          No variants generated yet
        </h3>
        <p style={{ fontSize: 13, color: "#555", maxWidth: 320 }}>
          Use the chat to describe a UI and generate design variants
        </p>
      </div>
    );
  }

  // Preview / Variants view
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#111",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Main Preview Area */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 20,
          backgroundColor: "#0d0d0d",
          position: "relative",
        }}
      >
        {/* Checkerboard / Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {activeVariant ? (
          <div
            style={{
              width: viewportWidth,
              maxWidth: "100%",
              height: "100%",
              backgroundColor: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              position: "relative",
              transition: "width 0.3s ease",
            }}
          >
            {/* Viewport controls */}
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                display: "flex",
                gap: 4,
                zIndex: 10,
                backgroundColor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                borderRadius: 8,
                padding: 3,
              }}
            >
              {[
                { id: "desktop", Icon: Monitor },
                { id: "tablet", Icon: Tablet },
                { id: "mobile", Icon: Smartphone },
              ].map(({ id, Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewport(id)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: "none",
                    backgroundColor:
                      viewport === id
                        ? "rgba(255,255,255,0.15)"
                        : "transparent",
                    color:
                      viewport === id ? "#fff" : "rgba(255,255,255,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Icon style={{ width: 13, height: 13 }} />
                </button>
              ))}
              <div
                style={{
                  width: 1,
                  height: 20,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  alignSelf: "center",
                }}
              />
              <button
                onClick={() => setPreviewKey((k) => k + 1)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: "transparent",
                  color: "rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <RotateCcw style={{ width: 13, height: 13 }} />
              </button>
            </div>
            <iframe
              key={previewKey}
              srcDoc={activeVariant.html}
              title="Preview"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#555",
              fontSize: 14,
            }}
          >
            <Eye
              style={{
                width: 40,
                height: 40,
                color: "#333",
                marginBottom: 12,
              }}
            />
            Select a variant below to preview it
          </div>
        )}
      </div>

      {/* Bottom Variant Thumbnails */}
      {variants.length > 0 && (
        <div
          style={{
            borderTop: "1px solid #1a1a1a",
            backgroundColor: "#0a0a0a",
            padding: "14px 16px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {variants.map((variant, i) => (
              <VariantThumbnail
                key={variant.id}
                variant={variant}
                isSelected={selectedVariantId === variant.id}
                onSelect={() => selectVariant(variant.id)}
                label={variant.label || `Variant ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
